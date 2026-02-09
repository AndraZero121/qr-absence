# Whatekster Fix Script (PowerShell)
Write-Host "🔧 Fixing Whatekster Setup..." -ForegroundColor Cyan

if (-not (Test-Path "auth")) {
    Write-Host "📂 Creating auth directory..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path "auth" -Force | Out-Null
}

Write-Host "✅ Whatekster Fix complete!" -ForegroundColor Green
