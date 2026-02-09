#!/bin/bash

# Whatekster Fix Script
set -e

echo "🔧 Fixing Whatekster Setup..."

# Create auth directory if not exists
if [ ! -d "whatekster/auth" ]; then
    echo "📂 Creating auth directory..."
    mkdir -p whatekster/auth
fi

# Ensure permissions (optional, but good for local dev)
# chmod -R 777 whatekster/auth

echo "✅ Whatekster Fix complete!"
