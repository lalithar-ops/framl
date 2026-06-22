@echo off
title Clari5 WhatsApp - ngrok Tunnel
echo.
echo  ====================================================
echo   Clari5 WhatsApp  -  Starting ngrok tunnel
echo  ====================================================
echo.
echo  This will expose localhost:3001 to the internet
echo  so Twilio can send WhatsApp replies back to you.
echo.
echo  Make sure start.bat is already running in another window!
echo.
echo  After ngrok starts, copy the https:// URL and paste it
echo  into Twilio Console as your WhatsApp webhook:
echo.
echo    Twilio Console ^> Messaging ^> Try it out ^> WhatsApp
echo    ^> Sandbox settings ^> "When a message comes in"
echo    ^> paste: https://xxxx.ngrok-free.app/webhook
echo.
echo  ====================================================
echo.
"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" http 3001
pause
