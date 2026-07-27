@echo off
chcp 65001 >nul
title تثبيت برنامج JudoManager Pro
color 0A

echo ===================================================
echo   جاري تثبيت وتشغيل برنامج JudoManager Pro للحاسوب
echo ===================================================
echo.

set PORT=3000

echo [1/3] فحص البيئة والملفات...
if not exist "%~dp0data" mkdir "%~dp0data"

echo [2/3] تشغيل خادم النظام المحلي...
start /b cmd /c "set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev >nul 2>&1"

echo [3/3] جاري فتح لوحة التحكم...
timeout /t 5 >nul
start http://localhost:3000/dashboard

echo.
echo ===================================================
echo   تم تشغيل النظام بنجاح!
echo   لوحة التحكم مفتوحة الآن في متصفحك.
echo ===================================================
pause
