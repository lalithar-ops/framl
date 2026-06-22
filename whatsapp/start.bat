@echo off
title Clari5 WhatsApp Proxy
echo.
echo  ====================================================
echo   Clari5 WhatsApp Proxy  -  Starting...
echo  ====================================================
echo.

REM Install dependencies silently
pip install -r "%~dp0requirements.txt" -q

REM Check for config.json
if not exist "%~dp0config.json" (
  echo  WARNING: config.json not found!
  echo  Copy config.template.json to config.json
  echo  and fill in your Twilio credentials.
  echo.
  pause
  exit /b 1
)

echo  Starting proxy on http://localhost:3001 ...
echo  Press Ctrl+C to stop.
echo.
python "%~dp0server.py"

pause
