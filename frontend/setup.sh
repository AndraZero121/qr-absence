#!/bin/bash

# Frontend Setup Script
set -e

echo "🚀 Starting Frontend Setup..."

# Install dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing Node dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    elif command -v npm &> /dev/null; then
        npm install
    fi
fi

# Prepare environment file
if [ ! -f ".env" ]; then
    echo "📄 Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env
    fi
fi

# Build for production (optional check)
# echo "🏗️ Building frontend..."
# npm run build

echo "✅ Frontend Setup complete!"
