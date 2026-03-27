@echo off
REM FoodApp Microservices - Windows Startup Script
REM This script starts all services in separate windows

echo.
echo ================================================
echo FoodApp Microservices - Startup Script
echo ================================================
echo.
echo Starting services...
echo.

REM Start User Service (Port 4001)
echo Starting User Service...
start "User Service" cmd /k "cd user-service && npm install && node server.js"
timeout /t 2 /nobreak

REM Start Recipe Service (Port 4002)
echo Starting Recipe Service...
start "Recipe Service" cmd /k "cd recipe-service && npm install && node server.js"
timeout /t 2 /nobreak

REM Start Order Service (Port 4003)
echo Starting Order Service...
start "Order Service" cmd /k "cd order-service && npm install && node server.js"
timeout /t 2 /nobreak

REM Start Notification Service (Port 4004)
echo Starting Notification Service...
start "Notification Service" cmd /k "cd notification-service && npm install && node server.js"
timeout /t 2 /nobreak

REM Start Gateway (Port 4000)
echo Starting Gateway...
start "Gateway" cmd /k "cd api-gateway && npm install && node server.js"
timeout /t 2 /nobreak

REM Start Frontend (Vite)
echo Starting Frontend...
start "FoodApp Frontend" cmd /k "cd frontend && npm install && npm run dev"
timeout /t 2 /nobreak

echo.
echo ================================================
echo All services started!
echo ================================================
echo.
echo Access points:
echo   - React App: http://localhost:5173
echo   - Gateway: http://localhost:4000
echo.
pause
