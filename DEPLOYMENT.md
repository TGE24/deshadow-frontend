# Deployment Guide

This project includes automated CI/CD deployment to Digital Ocean using GitHub Actions.

## Setup Instructions

### 1. Digital Ocean Server Setup

First, ensure your Digital Ocean server has the necessary dependencies:

```bash
# Install Node.js and Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 globally
npm install -g pm2

# Clone your repository
git clone https://github.com/De-Shadow/deshadow-frontend.git /var/www/deshadow-frontend
cd /var/www/deshadow-frontend

# Initial build
bun install
bun run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository settings:

- `DO_HOST`: Your Digital Ocean server IP address
- `DO_USERNAME`: SSH username (usually `root` or your user)
- `DO_SSH_KEY`: Your private SSH key content
- `DO_PORT`: SSH port (optional, defaults to 22)

### 3. SSH Key Setup

Generate SSH keys if you haven't already:

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to your Digital Ocean server
ssh-copy-id username@your-server-ip

# Add private key content to GitHub secrets
cat ~/.ssh/id_rsa  # Copy this content to DO_SSH_KEY secret
```

### 4. Server Directory Structure

Ensure your server has this structure:

```
/var/www/deshadow-frontend/
├── .git/
├── package.json
├── ecosystem.config.js
├── deploy.sh
├── dist/ (created after build)
└── logs/ (created automatically)
```

## Manual Deployment

You can also deploy manually using the included script:

```bash
# On your Digital Ocean server
cd /var/www/deshadow-frontend
./deploy.sh
```

## PM2 Commands

Useful PM2 commands for managing your application:

```bash
# View status
pm2 list

# View logs
pm2 logs web

# Monitor resources
pm2 monit

# Restart application
pm2 restart web

# Stop application
pm2 stop web

# Delete application
pm2 delete web

# Save current configuration
pm2 save
```

## Troubleshooting

### Build Fails

- Check that Bun is properly installed
- Verify all dependencies are compatible
- Check build logs: `pm2 logs web`

### PM2 Process Won't Start

- Check the ecosystem.config.js configuration
- Verify the port is available
- Check server resources: `pm2 monit`

### Deployment Fails

- Verify GitHub secrets are correctly set
- Check SSH key permissions
- Ensure the deployment path exists on the server

### Port Issues

- Check if the port is already in use: `netstat -tlnp | grep :3000`
- Modify the PORT in ecosystem.config.js if needed
- Ensure firewall allows the port

## Environment Variables

The application uses these environment variables:

- `NODE_ENV`: Set to 'production'
- `PORT`: Application port (default: 3000)
- `HOST`: Bind address (default: 0.0.0.0)

Add additional environment variables to the `env` section in ecosystem.config.js.

## Automatic Deployment

The CI/CD pipeline triggers on:

- Push to `main` branch
- Pull request to `main` branch

The deployment process:

1. Connects to your Digital Ocean server via SSH
2. Pulls the latest code from GitHub
3. Installs dependencies with Bun
4. Builds the application
5. Restarts the PM2 process

## Monitoring

Monitor your deployment with:

```bash
# Real-time logs
pm2 logs web --lines 100

# Application metrics
pm2 monit

# System resources
htop
```
