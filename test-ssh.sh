#!/bin/bash

# SSH Test Script
echo "=== SSH Connection Test ==="

# Prompt for server details
read -p "Enter your Digital Ocean server IP: " DO_HOST
read -p "Enter SSH username (default: root): " DO_USERNAME
DO_USERNAME=${DO_USERNAME:-root}
read -p "Enter SSH port (default: 22): " DO_PORT  
DO_PORT=${DO_PORT:-22}

echo ""
echo "Testing SSH connection to $DO_USERNAME@$DO_HOST:$DO_PORT..."
echo "----------------------------------------"

# Test SSH connection
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p $DO_PORT $DO_USERNAME@$DO_HOST "echo 'SSH connection successful!'; whoami; pwd"

if [ $? -eq 0 ]; then
    echo "✅ SSH connection works!"
    echo ""
    echo "Now test if your project directory exists:"
    ssh -p $DO_PORT $DO_USERNAME@$DO_HOST "ls -la /var/www/ | grep deshadow || echo 'Project directory not found'"
else
    echo "❌ SSH connection failed!"
    echo ""
    echo "Common fixes:"
    echo "1. Make sure your public key is in ~/.ssh/authorized_keys on the server"
    echo "2. Check server firewall allows SSH (port $DO_PORT)"
    echo "3. Verify the server IP address is correct"
    echo "4. Ensure SSH service is running on the server"
fi