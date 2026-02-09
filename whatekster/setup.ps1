# Whatekster Setup Script (PowerShell)
Write-Host "🚀 Starting Whatekster Setup..." -ForegroundColor Green

# Install dependencies
if (Test-Path "package.json") {
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Cyan
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    }
}

# Create auth directory
if (-not (Test-Path "auth")) {
    New-Item -ItemType Directory -Path "auth" -Force | Out-Null
}

Write-Host "✅ Whatekster Setup complete!" -ForegroundColor Green
