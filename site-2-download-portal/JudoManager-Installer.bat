@echo off
title JudoManager Pro Setup
cls
echo ===================================================
echo   JudoManager Pro Desktop Launcher
echo ===================================================
echo.

if not exist "%~dp0data" mkdir "%~dp0data"

echo [1/2] Starting local system server...
start /b cmd /c "set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev >nul 2>&1"

echo [2/2] Launching dashboard in browser...
timeout /t 3 >nul
start http://localhost:3000/dashboard

echo.
echo ===================================================
echo   System Launched Successfully!
echo ===================================================
timeout /t 2 >nul
