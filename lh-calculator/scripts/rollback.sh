#!/bin/bash

# Emergency rollback script for LH Calculator
# Usage: ./scripts/rollback.sh [BACKUP_ID]

set -euo pipefail

# Configuration
COMPOSE_FILE="docker-compose.yml"
SERVICE_NAME="lh-calculator"
BACKUP_DIR="./backups"
HEALTH_CHECK_URL="http://localhost/health"
MAX_RETRIES=30
RETRY_INTERVAL=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Check if running as root
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
        exit 1
    fi
}

# List available backups
list_backups() {
    log "Available backups:"
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi
    
    local backups=($(ls -1t "$BACKUP_DIR" 2>/dev/null || echo ""))
    
    if [[ ${#backups[@]} -eq 0 ]]; then
        error "No backups found in $BACKUP_DIR"
        exit 1
    fi
    
    for i in "${!backups[@]}"; do
        local backup="${backups[$i]}"
        local backup_path="$BACKUP_DIR/$backup"
        local timestamp=$(date -r "$backup_path" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "Unknown")
        echo "  $((i+1)). $backup (created: $timestamp)"
    done
    
    echo "${backups[@]}"
}

# Get latest backup
get_latest_backup() {
    local backups=($(ls -1t "$BACKUP_DIR" 2>/dev/null || echo ""))
    
    if [[ ${#backups[@]} -eq 0 ]]; then
        error "No backups found"
        exit 1
    fi
    
    echo "${backups[0]}"
}

# Validate backup
validate_backup() {
    local backup_id="$1"
    local backup_path="$BACKUP_DIR/$backup_id"
    
    log "Validating backup: $backup_id"
    
    if [[ ! -d "$backup_path" ]]; then
        error "Backup directory not found: $backup_path"
        exit 1
    fi
    
    # Check if essential files exist
    local required_files=("docker-compose.yml")
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$backup_path/$file" ]]; then
            warn "Required file not found in backup: $file"
        fi
    done
    
    log "Backup validation completed"
}

# Stop current application
stop_current() {
    log "Stopping current application..."
    
    if docker-compose ps | grep -q "$SERVICE_NAME.*Up"; then
        docker-compose down --timeout 30
        log "Current application stopped"
    else
        warn "No running containers found for service: $SERVICE_NAME"
    fi
}

# Restore from backup
restore_backup() {
    local backup_id="$1"
    local backup_path="$BACKUP_DIR/$backup_id"
    
    log "Restoring from backup: $backup_id"
    
    # Create a backup of current state before rollback
    local current_backup_dir="./backups/pre_rollback_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$current_backup_dir"
    
    # Backup current files
    cp -r deploy/ "$current_backup_dir/" 2>/dev/null || true
    cp docker-compose.yml "$current_backup_dir/" 2>/dev/null || true
    cp .env* "$current_backup_dir/" 2>/dev/null || true
    
    log "Current state backed up to: $current_backup_dir"
    
    # Restore configuration files
    if [[ -f "$backup_path/docker-compose.yml" ]]; then
        cp "$backup_path/docker-compose.yml" .
        log "Restored docker-compose.yml"
    fi
    
    if [[ -d "$backup_path/deploy" ]]; then
        rm -rf deploy/ 2>/dev/null || true
        cp -r "$backup_path/deploy/" .
        log "Restored deploy configuration"
    fi
    
    # Restore environment files
    for env_file in "$backup_path"/.env*; do
        if [[ -f "$env_file" ]]; then
            local filename=$(basename "$env_file")
            cp "$env_file" "./$filename"
            log "Restored $filename"
        fi
    done
    
    log "Backup restoration completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    local retries=0
    
    while [[ $retries -lt $MAX_RETRIES ]]; do
        if curl -f -s "$HEALTH_CHECK_URL" >/dev/null; then
            log "Health check passed"
            return 0
        fi
        
        retries=$((retries + 1))
        if [[ $retries -lt $MAX_RETRIES ]]; then
            warn "Health check failed (attempt $retries/$MAX_RETRIES), retrying in $RETRY_INTERVAL seconds..."
            sleep $RETRY_INTERVAL
        fi
    done
    
    error "Health check failed after $MAX_RETRIES attempts"
    return 1
}

# Start application
start_application() {
    log "Starting application..."
    
    # Use production environment file
    export COMPOSE_FILE="docker-compose.yml"
    if [[ -f ".env.production.local" ]]; then
        export COMPOSE_ENV_FILE=".env.production.local"
    else
        export COMPOSE_ENV_FILE=".env.production"
    fi
    
    docker-compose up -d --remove-orphans
    
    log "Application started"
}

# Run basic tests
run_basic_tests() {
    log "Running basic tests..."
    
    # Test main page
    if ! curl -f -s "http://localhost/" >/dev/null; then
        error "Main page is not accessible"
        return 1
    fi
    
    # Test health endpoint
    if ! curl -f -s "$HEALTH_CHECK_URL" >/dev/null; then
        error "Health endpoint is not accessible"
        return 1
    fi
    
    log "Basic tests passed"
}

# Interactive backup selection
interactive_selection() {
    local backups_output=$(list_backups)
    local backups=($backups_output)
    
    echo "Please select a backup to restore:"
    read -p "Enter backup number (1-${#backups[@]}) or 'q' to quit: " selection
    
    if [[ "$selection" == "q" ]]; then
        log "Rollback cancelled by user"
        exit 0
    fi
    
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [[ $selection -lt 1 ]] || [[ $selection -gt ${#backups[@]} ]]; then
        error "Invalid selection: $selection"
        exit 1
    fi
    
    local selected_backup="${backups[$((selection-1))]}"
    echo "$selected_backup"
}

# Main rollback function
main() {
    local backup_id="${1:-}"
    
    log "Starting rollback process..."
    
    check_permissions
    
    # If no backup ID provided, show interactive selection
    if [[ -z "$backup_id" ]]; then
        log "No backup ID provided, showing available options..."
        backup_id=$(interactive_selection)
    elif [[ "$backup_id" == "latest" ]]; then
        backup_id=$(get_latest_backup)
        log "Using latest backup: $backup_id"
    fi
    
    validate_backup "$backup_id"
    
    # Confirmation prompt
    read -p "Are you sure you want to rollback to backup '$backup_id'? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log "Rollback cancelled by user"
        exit 0
    fi
    
    stop_current
    restore_backup "$backup_id"
    start_application
    
    if ! health_check; then
        error "Health check failed after rollback"
        
        # Show container logs for debugging
        log "Container logs:"
        docker-compose logs --tail=50 "$SERVICE_NAME" || true
        
        exit 1
    fi
    
    if ! run_basic_tests; then
        error "Basic tests failed after rollback"
        exit 1
    fi
    
    log "Rollback completed successfully!"
    log "Application is available at: http://localhost/"
    log "Health check: $HEALTH_CHECK_URL"
    
    # Show running containers
    log "Current running containers:"
    docker-compose ps
    
    warn "Remember to investigate the root cause of the issue that required this rollback"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi