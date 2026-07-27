@echo off
title JudoManager Pro App Launcher
cls
echo Starting JudoManager Pro...
start http://localhost:3000/dashboard
start /b cmd /c "npm run dev"
