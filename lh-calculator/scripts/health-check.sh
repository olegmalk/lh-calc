#!/bin/bash

# Health check script for LH Calculator
# Usage: ./scripts/health-check.sh [--detailed] [--url=URL]

set -euo pipefail

# Default configuration
DEFAULT_URL="http://localhost"
HEALTH_ENDPOINT="/health"
TIMEOUT=30
MAX_RETRIES=3
RETRY_DELAY=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
DETAILED=false
BASE_URL="$DEFAULT_URL"

while [[ $# -gt 0 ]]; do
    case $1 in
        --detailed)
            DETAILED=true
            shift
            ;;
        --url=*)
            BASE_URL="${1#*=}"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--detailed] [--url=URL]"
            echo "  --detailed    Show detailed health information"
            echo "  --url=URL     Base URL to check (default: $DEFAULT_URL)"
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

# Check if URL is accessible
check_url_accessibility() {
    local url="$1"
    local description="$2"
    
    info "Checking $description: $url"
    
    local retries=0
    while [[ $retries -lt $MAX_RETRIES ]]; do
        if timeout $TIMEOUT curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "^[23]"; then
            log "$description is accessible"
            return 0
        fi
        
        retries=$((retries + 1))
        if [[ $retries -lt $MAX_RETRIES ]]; then
            warn "$description check failed (attempt $retries/$MAX_RETRIES), retrying in $RETRY_DELAY seconds..."
            sleep $RETRY_DELAY
        fi
    done
    
    error "$description is not accessible after $MAX_RETRIES attempts"
    return 1
}

# Check response time
check_response_time() {
    local url="$1"
    local max_time="$2"
    
    info "Checking response time for: $url (max: ${max_time}s)"
    
    local response_time=$(timeout $TIMEOUT curl -s -o /dev/null -w "%{time_total}" "$url" 2>/dev/null || echo "timeout")
    
    if [[ "$response_time" == "timeout" ]]; then
        error "Request timed out"
        return 1
    fi
    
    if (( $(echo "$response_time > $max_time" | bc -l) )); then
        warn "Response time ${response_time}s exceeds threshold ${max_time}s"
        return 1
    else
        log "Response time: ${response_time}s ✓"
        return 0
    fi
}

# Get health status JSON
get_health_status() {
    local health_url="$BASE_URL$HEALTH_ENDPOINT"
    
    timeout $TIMEOUT curl -s "$health_url" 2>/dev/null || echo '{"status":"error","message":"Health endpoint not accessible"}'
}

# Check Docker container health
check_docker_health() {
    info "Checking Docker container health..."
    
    if ! command -v docker >/dev/null 2>&1; then
        warn "Docker not available for container health check"
        return 0
    fi
    
    # Get container ID for lh-calculator
    local container_id=$(docker ps -q --filter "name=lh-calculator" 2>/dev/null || echo "")
    
    if [[ -z "$container_id" ]]; then
        error "LH Calculator container not found"
        return 1
    fi
    
    # Check container health status
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || echo "unknown")
    
    case "$health_status" in
        "healthy")
            log "Container health status: healthy ✓"
            ;;
        "unhealthy")
            error "Container health status: unhealthy"
            # Show recent health check logs
            info "Recent health check logs:"
            docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' "$container_id" | tail -n 5
            return 1
            ;;
        "starting")
            warn "Container health status: starting (still initializing)"
            ;;
        *)
            warn "Container health status: $health_status"
            ;;
    esac
    
    # Check container resource usage
    if [[ "$DETAILED" == true ]]; then
        info "Container resource usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" "$container_id"
    fi
    
    return 0
}

# Check system resources
check_system_resources() {
    info "Checking system resources..."
    
    # Check disk space
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        error "Disk usage is ${disk_usage}% (critical)"
        return 1
    elif [[ $disk_usage -gt 80 ]]; then
        warn "Disk usage is ${disk_usage}% (warning)"
    else
        log "Disk usage: ${disk_usage}% ✓"
    fi
    
    # Check memory usage
    if command -v free >/dev/null 2>&1; then
        local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        if [[ $mem_usage -gt 90 ]]; then
            error "Memory usage is ${mem_usage}% (critical)"
            return 1
        elif [[ $mem_usage -gt 80 ]]; then
            warn "Memory usage is ${mem_usage}% (warning)"
        else
            log "Memory usage: ${mem_usage}% ✓"
        fi
    fi
    
    # Check load average
    if command -v uptime >/dev/null 2>&1; then
        local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
        local cpu_cores=$(nproc 2>/dev/null || echo "1")
        local load_threshold=$(echo "$cpu_cores * 0.8" | bc -l)
        
        if (( $(echo "$load_avg > $load_threshold" | bc -l) )); then
            warn "Load average ${load_avg} is high (threshold: ${load_threshold})"
        else
            log "Load average: ${load_avg} ✓"
        fi
    fi
    
    return 0
}

# Main health check
perform_health_check() {
    log "Starting comprehensive health check for LH Calculator..."
    log "Base URL: $BASE_URL"
    
    local overall_status=0
    
    # Basic connectivity checks
    if ! check_url_accessibility "$BASE_URL/" "Main application"; then
        overall_status=1
    fi
    
    if ! check_url_accessibility "$BASE_URL$HEALTH_ENDPOINT" "Health endpoint"; then
        overall_status=1
    fi
    
    # Response time checks
    if ! check_response_time "$BASE_URL/" 5; then
        overall_status=1
    fi
    
    # Docker container health
    if ! check_docker_health; then
        overall_status=1
    fi
    
    # System resources
    if ! check_system_resources; then
        overall_status=1
    fi
    
    # Detailed health information
    if [[ "$DETAILED" == true ]]; then
        info "Fetching detailed health status..."
        local health_json=$(get_health_status)
        echo ""
        echo "=== Health Status Details ==="
        echo "$health_json" | python3 -m json.tool 2>/dev/null || echo "$health_json"
        echo "============================"
    fi
    
    echo ""
    if [[ $overall_status -eq 0 ]]; then
        log "✅ Overall health check: PASSED"
        log "Application is healthy and operational"
    else
        error "❌ Overall health check: FAILED"
        error "Application has health issues that need attention"
    fi
    
    return $overall_status
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    perform_health_check
    exit $?
fi