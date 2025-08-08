#!/bin/bash

# Backup script for LH Calculator production deployment
# Usage: ./scripts/backup.sh [--full] [--config-only]

set -euo pipefail

# Configuration
BACKUP_ROOT_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT_DIR/$TIMESTAMP"
COMPOSE_FILE="docker-compose.yml"
SERVICE_NAME="lh-calculator"
MAX_BACKUPS=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
FULL_BACKUP=false
CONFIG_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            FULL_BACKUP=true
            shift
            ;;
        --config-only)
            CONFIG_ONLY=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--full] [--config-only]"
            echo "  --full         Create full backup including container data"
            echo "  --config-only  Backup only configuration files"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

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

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    # Check if docker is available and running
    if ! command -v docker >/dev/null 2>&1; then
        error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running or not accessible"
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "docker-compose is not installed or not in PATH"
        exit 1
    fi
}

# Create backup directory
create_backup_directory() {
    log "Creating backup directory: $BACKUP_DIR"
    
    mkdir -p "$BACKUP_DIR"
    
    # Create metadata file
    cat > "$BACKUP_DIR/backup_metadata.json" << EOF
{
    "timestamp": "$TIMESTAMP",
    "backup_type": "$([[ "$FULL_BACKUP" == true ]] && echo "full" || echo "config")",
    "hostname": "$(hostname)",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo "unknown")",
    "git_branch": "$(git branch --show-current 2>/dev/null || echo "unknown")",
    "docker_version": "$(docker --version)",
    "compose_version": "$(docker-compose --version)"
}
EOF
    
    log "Backup directory created successfully"
}

# Backup configuration files
backup_configuration() {
    log "Backing up configuration files..."
    
    # Core configuration files
    local config_files=(
        "docker-compose.yml"
        ".env.production"
        ".env.production.local"
        "package.json"
        "vite.config.ts"
        "tsconfig.json"
        "Dockerfile"
        ".dockerignore"
    )
    
    for file in "${config_files[@]}"; do
        if [[ -f "$file" ]]; then
            cp "$file" "$BACKUP_DIR/"
            info "Backed up: $file"
        else
            warn "File not found, skipping: $file"
        fi
    done
    
    # Backup directories
    local config_dirs=(
        "deploy"
        "scripts"
        "monitoring"
        ".github"
    )
    
    for dir in "${config_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            cp -r "$dir" "$BACKUP_DIR/"
            info "Backed up directory: $dir"
        else
            warn "Directory not found, skipping: $dir"
        fi
    done
    
    log "Configuration backup completed"
}

# Backup container state
backup_container_state() {
    log "Backing up container state..."
    
    # Get running containers
    local container_ids=$(docker-compose ps -q 2>/dev/null || echo "")
    
    if [[ -z "$container_ids" ]]; then
        warn "No running containers found for backup"
        return 0
    fi
    
    # Create container state directory
    mkdir -p "$BACKUP_DIR/container_state"
    
    for container_id in $container_ids; do
        local container_name=$(docker inspect --format='{{.Name}}' "$container_id" | sed 's/^.//')
        
        info "Backing up container state for: $container_name"
        
        # Container inspection
        docker inspect "$container_id" > "$BACKUP_DIR/container_state/${container_name}_inspect.json"
        
        # Container logs
        docker logs "$container_id" > "$BACKUP_DIR/container_state/${container_name}_logs.txt" 2>&1 || true
        
        # Container stats (if running)
        if docker ps | grep -q "$container_id"; then
            docker stats --no-stream "$container_id" > "$BACKUP_DIR/container_state/${container_name}_stats.txt" 2>/dev/null || true
        fi
    done
    
    # Docker compose state
    docker-compose ps > "$BACKUP_DIR/container_state/compose_ps.txt" 2>/dev/null || true
    docker-compose config > "$BACKUP_DIR/container_state/compose_config.yml" 2>/dev/null || true
    
    log "Container state backup completed"
}

# Backup volumes (for full backup)
backup_volumes() {
    if [[ "$FULL_BACKUP" != true ]]; then
        return 0
    fi
    
    log "Backing up Docker volumes..."
    
    # Get volumes used by the compose project
    local volumes=$(docker-compose config --volumes 2>/dev/null || echo "")
    
    if [[ -z "$volumes" ]]; then
        info "No named volumes found to backup"
        return 0
    fi
    
    mkdir -p "$BACKUP_DIR/volumes"
    
    for volume in $volumes; do
        info "Backing up volume: $volume"
        
        # Create a temporary container to backup the volume
        docker run --rm -v "$volume:/backup_source" -v "$(pwd)/$BACKUP_DIR/volumes:/backup_dest" \
            alpine:latest tar czf "/backup_dest/${volume}.tar.gz" -C /backup_source . 2>/dev/null || \
            warn "Failed to backup volume: $volume"
    done
    
    log "Volume backup completed"
}

# Backup application data
backup_application_data() {
    log "Backing up application-specific data..."
    
    # Backup logs if they exist
    if [[ -d "logs" ]]; then
        cp -r logs "$BACKUP_DIR/"
        info "Backed up application logs"
    fi
    
    # Backup any persistent data
    local data_dirs=(
        "data"
        "uploads"
        "storage"
    )
    
    for dir in "${data_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            cp -r "$dir" "$BACKUP_DIR/"
            info "Backed up data directory: $dir"
        fi
    done
    
    # Backup SSL certificates if they exist
    if [[ -f "acme.json" ]]; then
        cp acme.json "$BACKUP_DIR/"
        chmod 600 "$BACKUP_DIR/acme.json"
        info "Backed up SSL certificates"
    fi
    
    log "Application data backup completed"
}

# Create backup archive
create_archive() {
    log "Creating backup archive..."
    
    local archive_name="lh-calculator-backup-$TIMESTAMP.tar.gz"
    local archive_path="$BACKUP_ROOT_DIR/$archive_name"
    
    # Create compressed archive
    tar -czf "$archive_path" -C "$BACKUP_ROOT_DIR" "$TIMESTAMP"
    
    if [[ -f "$archive_path" ]]; then
        local archive_size=$(du -h "$archive_path" | cut -f1)
        log "Backup archive created: $archive_name (size: $archive_size)"
        
        # Create symlink to latest backup
        ln -sf "$archive_name" "$BACKUP_ROOT_DIR/latest-backup.tar.gz"
        log "Latest backup symlink updated"
    else
        error "Failed to create backup archive"
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Keep only the latest N backups
    local backup_dirs=($(ls -1t "$BACKUP_ROOT_DIR" | grep -E '^[0-9]{8}_[0-9]{6}$' || true))
    
    if [[ ${#backup_dirs[@]} -gt $MAX_BACKUPS ]]; then
        local dirs_to_remove=("${backup_dirs[@]:$MAX_BACKUPS}")
        
        for dir in "${dirs_to_remove[@]}"; do
            info "Removing old backup directory: $dir"
            rm -rf "$BACKUP_ROOT_DIR/$dir"
        done
    fi
    
    # Cleanup old archives
    local backup_archives=($(ls -1t "$BACKUP_ROOT_DIR"/*.tar.gz 2>/dev/null | grep -v latest-backup.tar.gz || true))
    
    if [[ ${#backup_archives[@]} -gt $MAX_BACKUPS ]]; then
        local archives_to_remove=("${backup_archives[@]:$MAX_BACKUPS}")
        
        for archive in "${archives_to_remove[@]}"; do
            info "Removing old backup archive: $(basename "$archive")"
            rm -f "$archive"
        done
    fi
    
    log "Cleanup completed"
}

# Generate backup summary
generate_summary() {
    log "Generating backup summary..."
    
    local summary_file="$BACKUP_DIR/backup_summary.txt"
    
    cat > "$summary_file" << EOF
LH Calculator Backup Summary
===========================

Backup Details:
- Timestamp: $TIMESTAMP
- Type: $([[ "$FULL_BACKUP" == true ]] && echo "Full Backup" || echo "Configuration Backup")
- Location: $BACKUP_DIR
- Hostname: $(hostname)

System Information:
- OS: $(uname -a)
- Docker Version: $(docker --version)
- Compose Version: $(docker-compose --version)
- Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "unknown")
- Git Branch: $(git branch --show-current 2>/dev/null || echo "unknown")

Backup Contents:
$(ls -la "$BACKUP_DIR" | tail -n +2)

Container Status at Backup Time:
$(docker-compose ps 2>/dev/null || echo "No containers found")

Backup Size:
$(du -sh "$BACKUP_DIR")

Generated on: $(date)
EOF
    
    log "Backup summary saved to: $summary_file"
}

# Verify backup integrity
verify_backup() {
    log "Verifying backup integrity..."
    
    # Check if critical files exist
    local critical_files=(
        "backup_metadata.json"
        "docker-compose.yml"
        "backup_summary.txt"
    )
    
    for file in "${critical_files[@]}"; do
        if [[ ! -f "$BACKUP_DIR/$file" ]]; then
            error "Critical file missing in backup: $file"
            return 1
        fi
    done
    
    # Verify JSON files
    if command -v python3 >/dev/null 2>&1; then
        for json_file in "$BACKUP_DIR"/*.json; do
            if [[ -f "$json_file" ]]; then
                if ! python3 -m json.tool "$json_file" >/dev/null; then
                    warn "Invalid JSON file: $(basename "$json_file")"
                fi
            fi
        done
    fi
    
    log "Backup verification completed successfully"
}

# Main backup function
main() {
    log "Starting LH Calculator backup process..."
    
    if [[ "$CONFIG_ONLY" == true ]]; then
        log "Configuration-only backup mode enabled"
    elif [[ "$FULL_BACKUP" == true ]]; then
        log "Full backup mode enabled"
    else
        log "Standard backup mode (configuration + container state)"
    fi
    
    check_prerequisites
    create_backup_directory
    backup_configuration
    
    if [[ "$CONFIG_ONLY" != true ]]; then
        backup_container_state
        backup_application_data
        
        if [[ "$FULL_BACKUP" == true ]]; then
            backup_volumes
        fi
    fi
    
    generate_summary
    verify_backup
    create_archive
    cleanup_old_backups
    
    log "Backup process completed successfully!"
    log "Backup location: $BACKUP_DIR"
    log "Archive: $BACKUP_ROOT_DIR/lh-calculator-backup-$TIMESTAMP.tar.gz"
    
    # Show backup size
    local backup_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    info "Total backup size: $backup_size"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi