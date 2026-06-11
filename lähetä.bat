@echo off
cd /d "%~dp0"
echo.
echo ============================================
echo   Nikkarien Hinnasto — Lähetä GitHubiin
echo ============================================
echo.

git checkout main
echo Haetaan viimeisimmat muutokset GitHubista...
git pull origin main

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
