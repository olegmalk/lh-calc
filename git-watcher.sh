#!/bin/bash

# Git Watcher Script
# Checks for updates every minute and restarts the application if changes are detected

# GitHub token for pulling (required for private repo)
GITHUB_TOKEN="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"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Ensure NVM is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 22
nvm use 22 >/dev/null 2>&1 || true

echo "[$(date)] Git watcher started. Checking for updates every 60 seconds..."

while true; do
    # Fetch latest changes from remote
    git fetch origin main 2>&1 | grep -v "^$"

    # Check if there are any differences between local and remote
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "[$(date)] Changes detected! Pulling updates..."

        # Pull the latest changes
        git pull origin main

        if [ $? -eq 0 ]; then
            echo "[$(date)] Successfully pulled changes. Updating dependencies..."

            # Update root dependencies if package.json exists
            if [ -f "package.json" ]; then
                npm install
            fi

            # Update excel-api dependencies and rebuild
            if [ -d "excel-api" ]; then
                cd excel-api

                echo "[$(date)] Installing excel-api dependencies..."
                npm install

                echo "[$(date)] Building TypeScript..."
                npm run build

                if [ $? -eq 0 ]; then
                    echo "[$(date)] Build successful. Restarting application..."
                    cd "$SCRIPT_DIR"

                    # Restart only the application, not the watcher
                    pm2 restart lh-calc-app

                    echo "[$(date)] Application restarted successfully!"
                else
                    echo "[$(date)] ERROR: Build failed! Application not restarted."
                    cd "$SCRIPT_DIR"
                fi
            else
                echo "[$(date)] excel-api directory not found, restarting anyway..."
                pm2 restart lh-calc-app
            fi
        else
            echo "[$(date)] ERROR: Git pull failed!"
        fi
    else
        echo "[$(date)] No changes detected. Repository is up to date."
    fi

    # Wait for 60 seconds before next check
    sleep 60
done
