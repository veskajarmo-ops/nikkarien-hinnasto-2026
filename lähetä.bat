@echo off
cd /d "%~dp0"
echo.
echo ============================================
echo   Nikkarien Hinnasto — Lähetä GitHubiin
echo ============================================
echo.

:: Varmista että ollaan main-haaralla
git symbolic-ref --short HEAD >nul 2>&1
if errorlevel 1 (
    echo Siirrytaan main-haaralle...
    git checkout main 2>nul || git checkout -b main
)

git add .

set /p VIESTI="Kuvaus muutoksesta (tai Enter oletukselle): "
if "%VIESTI%"=="" set VIESTI=Päivitys %date% %time:~0,5%

git commit -m "%VIESTI%"

echo.
echo Lähetetään GitHubiin...
git push origin main

if errorlevel 1 (
    echo.
    echo VIRHE: Push epäonnistui!
    pause
    exit /b 1
)

echo.
echo Valmis! Muutos näkyy GitHubissa hetken kuluttua.
pause
