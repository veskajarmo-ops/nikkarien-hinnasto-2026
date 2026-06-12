@echo off
cd /d "%~dp0"
echo.
echo ============================================
echo   Nikkarien Hinnasto -- Laheta GitHubiin
echo ============================================
echo.

git merge --abort 2>nul
git add .

set /p VIESTI="Kuvaus muutoksesta (tai Enter oletukselle): "
if "%VIESTI%"=="" set VIESTI=Paivitys %date% %time:~0,5%

git commit -m "%VIESTI%"

echo.
echo Lahetetaan GitHubiin...
git push --force origin main

if errorlevel 1 (
    echo.
    echo VIRHE: Push epaonnistui!
    pause
    exit /b 1
)

echo.
echo Valmis! Muutos nakyy GitHubissa hetken kuluttua.
pause
