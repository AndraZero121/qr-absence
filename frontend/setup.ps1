# Frontend Setup Script (PowerShell)
Write-Host "🚀 Starting Frontend Setup..." -ForegroundColor Green

# Install dependencies
if (Test-Path "package.json") {
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Cyan
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    }
}

# Prepare environment file
if (-not (Test-Path ".env")) {
    Write-Host "📄 Creating .env..." -ForegroundColor Cyan
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        Set-Content -Path ".env" -Value "VITE_API_URL=http://127.0.0.1:8000/api"
    }
}

Write-Host "✅ Frontend Setup complete!" -ForegroundColor Green
