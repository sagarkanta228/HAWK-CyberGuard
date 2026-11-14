@echo off
title HAWK CyberGuard Android APK Builder
color 0b
echo ===============================================================
echo     HAWK CYBERGUARD - ANDROID .APK GENERATOR & LAUNCHER
echo ===============================================================
echo.
echo [1/3] Verifying Java & Android Environment...
where javac >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] JDK / javac not found in PATH.
    echo Please ensure Java 17+ or JDK is installed.
    pause
    exit /b 1
)
echo [OK] JDK Compiler detected.

echo.
echo [2/3] Checking Gradle and Android Build Tools...
if exist "android\gradlew.bat" (
    echo [INFO] Running Gradle build for debug APK...
    cd android
    call gradlew.bat assembleDebug
    cd ..
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        echo.
        echo ===============================================================
        echo [SUCCESS] APK BUILT SUCCESSFULLY!
        echo Location: android\app\build\outputs\apk\debug\app-debug.apk
        echo ===============================================================
    )
) else (
    echo [INFO] Ready to sync with Capacitor CLI:
    echo        1. Run: npx cap sync android
    echo        2. Run: npx cap open android
    echo.
    echo [TIP] You can also open the WebAPK / PWA directly in Chrome on Android:
    echo        http://localhost:3000/mobile
    echo        and tap 'Add to Home Screen' to install instantly!
)

echo.
echo Done.
pause
