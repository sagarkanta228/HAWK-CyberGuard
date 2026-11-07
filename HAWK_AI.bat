@echo off
TITLE HAWK AI - Multi-Vector Threat Defense Platform
COLOR 0B
CLS

echo ==============================================================================
echo       HAWK - MULTI-VECTOR AI THREAT DEFENSE PLATFORM                          
echo       • PhishX (LightGBM + CharCNN)                                           
echo       • EMBER2024 (14 Benchmark Malware Classifiers)                          
echo       • DeepGuard (MS-EffGCViT Synthetic Media Forensics)                     
echo       • Database: Neon PostgreSQL                                             
echo ==============================================================================
echo.
echo [1/3] Starting Django REST AI Backend (Port 8000)...
set KMP_DUPLICATE_LIB_OK=TRUE
start "HAWK Backend" cmd /k "cd /d %~dp0backend-django && python manage.py runserver 127.0.0.1:8000"

echo [2/3] Starting Next.js Cyber Defense UI (Port 3000)...
start "HAWK Frontend" cmd /k "cd /d %~dp0frontend-next && npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Launching HAWK Console in browser...
start http://localhost:3000/

echo ==============================================================================
echo HAWK Platform is now running at http://localhost:3000/
echo ==============================================================================
pause

