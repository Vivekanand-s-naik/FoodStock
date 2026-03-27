# FoodApp Microservices - PowerShell Startup Script
# Run this script in PowerShell to start all services

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "FoodApp Microservices - Startup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

function Start-Service-Window {
    param(
        [string]$WindowTitle,
        [string]$Path,
        [string]$Command = "npm install ; node server.js"
    )
    
    Write-Host "Starting: $WindowTitle" -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path' ; $Command" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start services
Start-Service-Window "User Service" "$PSScriptRoot\user-service"
Start-Service-Window "Recipe Service" "$PSScriptRoot\recipe-service"
Start-Service-Window "Order Service" "$PSScriptRoot\order-service"
Start-Service-Window "Notification Service" "$PSScriptRoot\notification-service"
Start-Service-Window "Gateway" "$PSScriptRoot\api-gateway"
Start-Service-Window "Frontend" "$PSScriptRoot\frontend" "npm install ; npm run dev"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "All services started!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access points:" -ForegroundColor Yellow
Write-Host "  - React App: http://localhost:5173" -ForegroundColor White
Write-Host "  - Gateway: http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Make sure MongoDB is running first!" -ForegroundColor Yellow
Write-Host ""
