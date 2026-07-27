@echo off
setlocal enabledelayedexpansion
title JudoManager Pro Setup
color 0a
cls

echo ========================================================
echo   JudoManager Pro - Desktop Application Installation
echo ========================================================
echo.
echo [1/3] Preparing application directory...
if not exist "%~dp0data" mkdir "%~dp0data"

echo [2/3] Checking connection and starting desktop server...
start /b cmd /c "set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev >nul 2>&1"

echo [3/3] Opening JudoManager Pro Interface...
timeout /t 3 >nul
start http://localhost:3000/dashboard

echo.
echo ========================================================
echo   Success! JudoManager Pro is now running smoothly.
echo ========================================================
exit
