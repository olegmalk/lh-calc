#!/bin/bash

# LH-Calc Setup Script
# This script installs all dependencies and sets up the application with PM2

set -e  # Exit on any error

echo "========================================"
echo "LH-Calc Automated Setup Script"
echo "========================================"

# GitHub token for cloning
GITHUB_TOKEN="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"
REPO_URL="https://${GITHUB_TOKEN}@github.com/olegmalk/lh-calc.git"
NODE_VERSION="22"
APP_DIR="$HOME/lh-calc"
EXCEL_API_DIR="$APP_DIR/excel-api"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo ""
echo "Step 1: Installing NVM (Node Version Manager)"
echo "--------------------------------------"
if [ -d "$HOME/.nvm" ]; then
    echo "NVM already installed"
else
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Ensure NVM is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo ""
echo "Step 2: Installing Node.js ${NODE_VERSION}"
echo "--------------------------------------"
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
nvm alias default ${NODE_VERSION}

echo ""
echo "Step 3: Installing PM2 globally"
echo "--------------------------------------"
npm install -g pm2

echo ""
echo "Step 4: Cloning repository"
echo "--------------------------------------"
if [ -d "$APP_DIR" ]; then
    echo "Repository directory already exists at $APP_DIR"
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

echo ""
echo "Step 5: Installing root dependencies"
echo "--------------------------------------"
if [ -f "package.json" ]; then
    npm install
fi

echo ""
echo "Step 6: Installing excel-api dependencies"
echo "--------------------------------------"
if [ ! -d "$EXCEL_API_DIR" ]; then
    echo "ERROR: excel-api directory not found at $EXCEL_API_DIR"
    exit 1
fi
cd "$EXCEL_API_DIR"
npm install

echo ""
echo "Step 7: Building TypeScript application"
echo "--------------------------------------"
npm run build

echo ""
echo "Step 8: Setting up PM2 ecosystem"
echo "--------------------------------------"
cd "$APP_DIR"

# Stop and delete existing PM2 processes if they exist
pm2 delete lh-calc-app 2>/dev/null || true
pm2 delete lh-calc-watcher 2>/dev/null || true

# Start the application and watcher
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
echo "Setting up PM2 to start on boot..."
STARTUP_CMD=$(pm2 startup | grep "sudo" | tail -n 1)
if [ -n "$STARTUP_CMD" ]; then
    echo "Please run this command manually with sudo if needed:"
    echo "$STARTUP_CMD"
    echo "(Attempting to run automatically...)"
    eval "$STARTUP_CMD" 2>/dev/null || echo "Note: Manual sudo may be required for startup script"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "Useful commands:"
echo "  pm2 status              - View status of all processes"
echo "  pm2 logs lh-calc-app    - View application logs"
echo "  pm2 logs lh-calc-watcher - View git watcher logs"
echo "  pm2 restart all         - Restart all processes"
echo "  pm2 stop all            - Stop all processes"
echo ""
echo "The application will:"
echo "  - Run on port 3000"
echo "  - Auto-restart on crashes"
echo "  - Check for git updates every minute"
echo "  - Auto-restart when code changes are detected"
echo ""
