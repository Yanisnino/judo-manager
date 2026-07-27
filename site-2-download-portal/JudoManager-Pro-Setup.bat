@echo off
title JudoManager Pro App Launcher
color 0a
cls

echo ========================================================
echo   JudoManager Pro - Native Desktop Application
echo ========================================================
echo.

if not exist "%~dp0data" mkdir "%~dp0data"

echo [1/2] Starting local system engine...
start /b cmd /c "set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev >nul 2>&1"

echo [2/2] Launching Native App Window...
:check_loop
timeout /t 2 /nobreak >nul
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 3000); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    goto check_loop
)

:: Launch Chrome or Edge in --app mode (creates a real standalone desktop app window without browser UI)
start msedge --app=http://localhost:3000/dashboard || start chrome --app=http://localhost:3000/dashboard || start http://localhost:3000/dashboard

echo.
echo ========================================================
echo   JudoManager Pro Application Window Active!
echo ========================================================
exit
