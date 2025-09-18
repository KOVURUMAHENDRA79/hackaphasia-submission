@echo off
echo 🌱 Starting CropGuard - AI-Powered Crop Disease Detection Platform
echo ==================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "server\node_modules" (
    echo 📦 Installing server dependencies...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo 📦 Installing client dependencies...
    cd client
    npm install
    cd ..
)

echo.
echo 🚀 Starting development servers...
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers concurrently
npm run dev
