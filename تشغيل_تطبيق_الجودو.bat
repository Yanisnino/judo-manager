@echo off
chcp 65001 > nul
title JudoManager SaaS Launcher
echo ===================================================
echo     جاري تشغيل تطبيق إدارة أندية الجودو...
echo ===================================================
cd /d c:\Users\ThinkPad\CascadeProjects\judo-manager
set NODE_OPTIONS=--max-old-space-size=4096
timeout /t 2 /nobreak > nul
start http://localhost:3000
npm run dev
