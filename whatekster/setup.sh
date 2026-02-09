#!/bin/bash

# Whatekster Setup Script
set -e

echo "🚀 Starting Whatekster (WhatsApp Gateway) Setup..."

# Clean old lockfiles
rm -f package-lock.json bun.lock

# Install dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing Node dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    elif command -v npm &> /dev/null; then
        npm install
    fi
fi

# Create auth directory if not exists
mkdir -p auth

echo "✅ Whatekster Setup complete!"
