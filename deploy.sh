#!/bin/bash

# Deployment script for deshadow-frontend
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed. Please install Bun first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install PM2 first: npm install -g pm2"
    exit 1
fi

# Backup current state
print_status "Creating backup..."
git stash push -m "Auto-backup before manual deploy $(date)" || print_warning "No changes to stash"

# Pull latest changes
print_status "Pulling latest changes from origin/main..."
git fetch origin
git reset --hard origin/main

# Install dependencies
print_status "Installing dependencies..."
bun install --frozen-lockfile

# Build the application
print_status "Building application..."
bun run build

# Create logs directory
print_status "Setting up logs directory..."
mkdir -p logs

# Check if PM2 process exists and restart/start accordingly
print_status "Managing PM2 process..."
if pm2 describe web > /dev/null 2>&1; then
    print_status "Restarting existing PM2 process 'web'..."
    pm2 restart web
else
    print_status "Starting new PM2 process 'web'..."
    pm2 start ecosystem.config.js
fi

# Save PM2 configuration
pm2 save

# Show PM2 status
print_status "Current PM2 status:"
pm2 list

print_status "✅ Deployment completed successfully!"
print_status "🔗 Your application should be running on the configured port."
print_status "📊 Monitor with: pm2 monit"
print_status "📋 View logs with: pm2 logs web"