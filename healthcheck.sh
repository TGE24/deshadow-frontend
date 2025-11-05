#!/bin/bash

# Health check script for the application
# Returns 0 if healthy, 1 if unhealthy

PORT=${PORT:-3000}
HOST=${HOST:-localhost}

# Check if the application is responding
response=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/ || echo "000")

if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ Application is healthy (HTTP $response)"
    exit 0
else
    echo "❌ Application is unhealthy (HTTP $response)"
    exit 1
fi