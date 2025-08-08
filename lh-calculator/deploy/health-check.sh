#!/bin/sh

# Simple health check script for Docker container
# This script is used by Docker's HEALTHCHECK instruction

set -e

# Configuration
HEALTH_URL="http://localhost/health"
MAIN_URL="http://localhost/"
TIMEOUT=10

# Check if main application is responding
if ! wget --quiet --tries=1 --timeout=$TIMEOUT --spider "$MAIN_URL"; then
    echo "Main application is not responding"
    exit 1
fi

# Check health endpoint if it exists
if wget --quiet --tries=1 --timeout=$TIMEOUT --spider "$HEALTH_URL" 2>/dev/null; then
    # Health endpoint exists, check its response
    HEALTH_RESPONSE=$(wget --quiet --timeout=$TIMEOUT -O - "$HEALTH_URL" 2>/dev/null || echo "")
    
    if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
        echo "Health check passed"
        exit 0
    else
        echo "Health endpoint returned unhealthy status"
        exit 1
    fi
else
    # Health endpoint doesn't exist, just check main app
    echo "Main application is responding"
    exit 0
fi