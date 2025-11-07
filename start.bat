@echo off
title CHAOS ZERO: NIGHTMARE - Server
color 0B
echo.
echo ================================================
echo   CHAOS ZERO: NIGHTMARE - TEAM BUILDER
echo   Iniciando servidor local...
echo ================================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python no detectado - Abriendo directamente el archivo HTML
    echo [!] Nota: Algunas funciones pueden no funcionar sin servidor HTTP
    echo.
    timeout /t 2 /nobreak >nul
    start "" "index.html"
    echo.
    echo Archivo abierto en el navegador predeterminado
    echo.
    pause
    exit /b 0
)

echo [OK] Python detectado - Iniciando servidor HTTP...
echo.

REM Iniciar servidor en segundo plano
start /B python -m http.server 8000

REM Esperar 2 segundos para que el servidor inicie
timeout /t 2 /nobreak >nul

REM Abrir navegador
start http://localhost:8000

echo.
echo ================================================
echo   Servidor iniciado exitosamente!
echo ================================================
echo.
echo   URL: http://localhost:8000
echo   Puerto: 8000
echo.
echo   Presiona cualquier tecla para detener el servidor
echo   (Esto cerrara la ventana)
echo.
echo ================================================
echo.

pause >nul

REM Matar el proceso de Python al cerrar
taskkill /F /FI "WINDOWTITLE eq CHAOS ZERO: NIGHTMARE - Server" >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

exit
