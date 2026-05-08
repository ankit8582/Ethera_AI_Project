#!/usr/bin/env pwsh
# Railway Deployment Setup Script for Windows PowerShell
# This script helps prepare your project for Railway deployment

Write-Host "🚀 Railway Deployment Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
}

# Check if .gitignore exists at root
if (-not (Test-Path ".gitignore")) {
    Write-Host "⚠️  .gitignore not found. Creating..." -ForegroundColor Yellow
    @"
node_modules/
.env
.env.local
.env.production.local
dist/
build/
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vscode/
.idea/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✓ .gitignore created" -ForegroundColor Green
}

# Check backend .env
Write-Host ""
Write-Host "Checking Backend Configuration..." -ForegroundColor Cyan
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "⚠️  Created backend\.env from .env.example" -ForegroundColor Yellow
        Write-Host "⚠️  Please update with your MongoDB URI" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ backend\.env exists" -ForegroundColor Green
}

# Check frontend .env
Write-Host ""
Write-Host "Checking Frontend Configuration..." -ForegroundColor Cyan
if (-not (Test-Path "team-task-manager\.env")) {
    if (Test-Path "team-task-manager\.env.example") {
        Copy-Item "team-task-manager\.env.example" "team-task-manager\.env"
        Write-Host "⚠️  Created team-task-manager\.env from .env.example" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ team-task-manager\.env exists" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "Installing Dependencies..." -ForegroundColor Cyan
npm install:all
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some dependencies may have failed" -ForegroundColor Yellow
}

# Test local build
Write-Host ""
Write-Host "Testing Frontend Build..." -ForegroundColor Cyan
Push-Location "team-task-manager"
npm run build
$buildSuccess = $LASTEXITCODE -eq 0
Pop-Location

if ($buildSuccess) {
    Write-Host "✓ Frontend builds successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend build failed - check errors above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====== Setup Complete! ======" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend\.env with your MongoDB URI from MongoDB Atlas"
Write-Host "2. Update team-task-manager\.env with your API URL (initially localhost)"
Write-Host "3. Run: git add ."
Write-Host "4. Run: git commit -m 'Initial commit for Railway'"
Write-Host "5. Push to GitHub"
Write-Host "6. Follow RAILWAY_DEPLOYMENT_QUICK_START.md for Railway setup"
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "- RAILWAY_DEPLOYMENT_QUICK_START.md - Fast setup guide (5 min)"
Write-Host "- RAILWAY_DEPLOYMENT_GUIDE.md - Detailed guide with troubleshooting"
Write-Host ""
