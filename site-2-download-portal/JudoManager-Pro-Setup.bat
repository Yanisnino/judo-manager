@echo off
title JudoManager Pro Setup & Launcher
color 0a
cls

echo ========================================================
echo   JudoManager Pro - Smart Server Launcher
echo ========================================================
echo.

if not exist "%~dp0data" mkdir "%~dp0data"

echo [1/2] Starting local system background engine...
start /b cmd /c "set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev >nul 2>&1"

echo [2/2] Waiting for local engine connection...
:check_loop
timeout /t 3 /nobreak >nul
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 3000); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Engine booting, please wait a moment...
    goto check_loop
)

echo.
echo Connection established! Opening dashboard now...
start http://localhost:3000/dashboard
echo ========================================================
echo   JudoManager Pro is now running successfully.
echo ========================================================
exit
