@echo off
REM Food Microservices - Windows Startup Script
REM This script starts all services in separate windows

echo.
echo ================================================
echo Food Microservices - Startup Script
echo ================================================
echo.
echo Prerequisites:
echo   1. MongoDB must be running (run mongod separately)
echo   2. Node.js must be installed
echo   3. All npm dependencies must be installed
echo.
echo Starting services...
echo.

REM Start User Service (Port 4001)
echo Starting User Service on port 4001...
start "User Service" cmd /k "cd services\user-service && npm install && node index.js"
timeout /t 2 /nobreak

REM Start Food Service (Port 4002)
echo Starting Food Service on port 4002...
start "Food Service" cmd /k "cd services\food-service && npm install && node index.js"
timeout /t 2 /nobreak

REM Start Gateway (Port 4000)
echo Starting Gateway on port 4000...
start "Gateway" cmd /k "cd gateway && npm install && node index.js"
timeout /t 2 /nobreak

REM Start Client (React)
echo Starting React Client...
start "React Client" cmd /k "cd client && npm install && npm run dev"
timeout /t 2 /nobreak

echo.
echo ================================================
echo All services started!
echo ================================================
echo.
echo Access points:
echo   - React App: http://localhost:5173 (or shown in React Client window)
echo   - Gateway: http://localhost:4000
echo   - User Service: http://localhost:4001
echo   - Food Service: http://localhost:4002
echo.
echo Note: Make sure MongoDB is running separately!
echo   mongod command in another terminal
echo.
pause
