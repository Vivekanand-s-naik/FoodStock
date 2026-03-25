# Food Microservices - Windows PowerShell Startup Script
# Run this script in PowerShell to start all services

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Food Microservices - PowerShell Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Prerequisites:" -ForegroundColor Yellow
Write-Host "  1. MongoDB running (mongod command in separate terminal)" -ForegroundColor White
Write-Host "  2. Node.js installed" -ForegroundColor White
Write-Host "  3. All npm dependencies installed" -ForegroundColor White
Write-Host ""

# Function to start service in new PowerShell window
function Start-Service-Window {
    param(
        [string]$WindowTitle,
        [string]$Command
    )
    
    Write-Host "Starting: $WindowTitle" -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $Command -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start services
Start-Service-Window "User Service (4001)" `
    "cd '$PSScriptRoot\services\user-service' ; npm install ; node index.js"

Start-Service-Window "Food Service (4002)" `
    "cd '$PSScriptRoot\services\food-service' ; npm install ; node index.js"

Start-Service-Window "Gateway (4000)" `
    "cd '$PSScriptRoot\gateway' ; npm install ; node index.js"

Start-Service-Window "React Client" `
    "cd '$PSScriptRoot\client' ; npm install ; npm run dev"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "All services started!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access points:" -ForegroundColor Yellow
Write-Host "  - React App: http://localhost:5173" -ForegroundColor White
Write-Host "  - Gateway: http://localhost:4000" -ForegroundColor White
Write-Host "  - User Service: http://localhost:4001" -ForegroundColor White
Write-Host "  - Food Service: http://localhost:4002" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Make sure MongoDB is running first!" -ForegroundColor Yellow
Write-Host "   Run: mongod" -ForegroundColor White
Write-Host ""
