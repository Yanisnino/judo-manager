@echo off
chcp 65001 > nul
title JudoManager Pro - تثبيت النظام
color 0B
cls
echo.
echo ================================================================
echo   JudoManager Pro - نظام إدارة أندية الجودو والرياضات القتالية
echo ================================================================
echo.
echo [1] جاري التحقق من المتطلبات...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js غير مثبت على جهازك.
    echo [!] سيتم فتح صفحة تنزيل Node.js الآن...
    echo.
    start https://nodejs.org/en/download
    echo بعد تثبيت Node.js قم بتشغيل هذا الملف مجدداً.
    pause
    exit
)

echo [+] Node.js موجود ✓
echo.
echo [2] جاري تحميل النظام من الإنترنت...
echo.

:: Create app folder in user's home directory
set APP_DIR=%USERPROFILE%\JudoManagerPro
if not exist "%APP_DIR%" mkdir "%APP_DIR%"

cd /d "%APP_DIR%"

:: Clone or download the app
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    if not exist "%APP_DIR%\.git" (
        echo جاري استنساخ النظام...
        git clone https://github.com/nisoo09/judo-manager.git .
    ) else (
        echo جاري تحديث النظام...
        git pull
    )
) else (
    echo [!] Git غير مثبت - يرجى تثبيت Git من: https://git-scm.com
    start https://git-scm.com/download/win
    pause
    exit
)

echo.
echo [3] جاري تثبيت الحزم...
call npm install --legacy-peer-deps

echo.
echo [4] جاري تشغيل النظام...
echo.
echo ================================================================
echo  النظام يعمل الآن! افتح المتصفح على: http://localhost:3000
echo  لإيقاف النظام: اضغط Ctrl+C في هذه النافذة
echo ================================================================
echo.

start http://localhost:3000/dashboard
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev
