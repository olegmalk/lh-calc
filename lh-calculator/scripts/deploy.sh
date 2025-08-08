#!/bin/bash

# Production deployment script for LH Calculator
# Usage: ./scripts/deploy.sh [IMAGE_TAG]

set -euo pipefail

# Configuration
COMPOSE_FILE="docker-compose.yml"
SERVICE_NAME="lh-calculator"
IMAGE_NAME="ghcr.io/$(git config --get remote.origin.url | sed 's/.*github.com[\/:]//g' | sed 's/.git$//')"
HEALTH_CHECK_URL="http://localhost/health"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
MAX_RETRIES=30
RETRY_INTERVAL=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
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

# Validate environment
validate_environment() {
    log "Validating deployment environment..."
    
    # Check if docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running or not accessible"
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "docker-compose is not installed"
        exit 1
    fi
    
    # Check if compose file exists
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    
    # Check if .env.production.local exists
    if [[ ! -f ".env.production.local" ]]; then
        warn ".env.production.local not found - using .env.production"
        if [[ ! -f ".env.production" ]]; then
            error "Neither .env.production.local nor .env.production found"
            exit 1
        fi
    fi
    
    log "Environment validation passed"
}

# Create backup
create_backup() {
    log "Creating backup before deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current state
    if docker-compose ps | grep -q "$SERVICE_NAME"; then
        log "Backing up current container state..."
        docker-compose logs "$SERVICE_NAME" > "$BACKUP_DIR/logs.txt" 2>&1 || true
        docker inspect $(docker-compose ps -q "$SERVICE_NAME") > "$BACKUP_DIR/container_info.json" 2>/dev/null || true
    fi
    
    # Backup configuration files
    cp -r deploy/ "$BACKUP_DIR/" 2>/dev/null || true
    cp docker-compose.yml "$BACKUP_DIR/" 2>/dev/null || true
    cp .env* "$BACKUP_DIR/" 2>/dev/null || true
    
    log "Backup created in: $BACKUP_DIR"
}

# Pull new image
pull_image() {
    local image_tag=${1:-"latest"}
    local full_image="${IMAGE_NAME}:${image_tag}"
    
    log "Pulling new Docker image: $full_image"
    
    export IMAGE_TAG="$image_tag"
    
    # Pull the new image
    if ! docker pull "$full_image"; then
        error "Failed to pull Docker image: $full_image"
        exit 1
    fi
    
    log "Successfully pulled image: $full_image"
}

# Deploy new version
deploy() {
    log "Deploying new version..."
    
    # Use production environment file
    export COMPOSE_FILE="docker-compose.yml"
    if [[ -f ".env.production.local" ]]; then
        export COMPOSE_ENV_FILE=".env.production.local"
    else
        export COMPOSE_ENV_FILE=".env.production"
    fi
    
    # Deploy with zero-downtime (if possible)
    log "Stopping old containers..."
    docker-compose down --timeout 30
    
    log "Starting new containers..."
    docker-compose up -d --remove-orphans
    
    log "Deployment completed"
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
        warn "Health check failed (attempt $retries/$MAX_RETRIES), retrying in $RETRY_INTERVAL seconds..."
        sleep $RETRY_INTERVAL
    done
    
    error "Health check failed after $MAX_RETRIES attempts"
    return 1
}

# Smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
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
    
    # Test static assets
    if ! curl -f -s "http://localhost/assets/" >/dev/null 2>&1; then
        warn "Static assets might not be loading correctly"
    fi
    
    log "Smoke tests passed"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f >/dev/null 2>&1 || true
    
    # Keep only the last 3 versions of the application image
    docker images "$IMAGE_NAME" --format "table {{.Tag}}\t{{.ID}}" | tail -n +2 | head -n -3 | awk '{print $2}' | xargs -r docker rmi >/dev/null 2>&1 || true
    
    log "Cleanup completed"
}

# Rollback function
rollback() {
    error "Deployment failed - initiating rollback..."
    
    # Stop current containers
    docker-compose down --timeout 30
    
    # Find the most recent backup
    local latest_backup=$(ls -1t backups/ 2>/dev/null | head -n1 || echo "")
    
    if [[ -n "$latest_backup" ]]; then
        warn "Rolling back to backup: $latest_backup"
        
        # Restore configuration files
        if [[ -f "backups/$latest_backup/docker-compose.yml" ]]; then
            cp "backups/$latest_backup/docker-compose.yml" .
        fi
        
        # Start the previous version
        docker-compose up -d --remove-orphans
        
        if health_check; then
            warn "Rollback completed successfully"
            exit 1
        else
            error "Rollback failed - manual intervention required"
            exit 2
        fi
    else
        error "No backup found for rollback - manual intervention required"
        exit 2
    fi
}

# Main deployment function
main() {
    local image_tag=${1:-"latest"}
    
    log "Starting deployment process..."
    log "Image tag: $image_tag"
    
    # Set trap for cleanup on failure
    trap rollback ERR
    
    check_permissions
    validate_environment
    create_backup
    pull_image "$image_tag"
    deploy
    
    if ! health_check; then
        error "Health check failed"
        exit 1
    fi
    
    if ! run_smoke_tests; then
        error "Smoke tests failed"
        exit 1
    fi
    
    cleanup
    
    log "Deployment completed successfully!"
    log "Application is available at: http://localhost/"
    log "Health check: $HEALTH_CHECK_URL"
    
    # Show running containers
    log "Current running containers:"
    docker-compose ps
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi