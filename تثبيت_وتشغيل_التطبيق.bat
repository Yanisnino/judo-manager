@echo off
chcp 65001 > nul
title JudoManager Setup & Launcher
echo =========================================================
echo    جاري تثبيت وتشغيل تطبيق إدارة أندية الجودو...
echo =========================================================
cd /d c:\Users\ThinkPad\CascadeProjects\judo-manager
set NODE_OPTIONS=--max-old-space-size=4096
start http://localhost:3000
npm run dev
