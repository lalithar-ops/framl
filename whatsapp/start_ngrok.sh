#!/bin/bash
# Converted from Windows .bat — macOS compatible
set -e

echo ""
echo " ===================================================="
echo "  Clari5 WhatsApp  -  Starting ngrok tunnel"
echo " ===================================================="
echo ""
echo " This will expose localhost:3001 to the internet"
echo " so Twilio can send WhatsApp replies back to you."
echo ""
echo " Make sure start.sh is already running in another window!"
echo ""
echo " After ngrok starts, copy the https:// URL and paste it"
echo " into Twilio Console as your WhatsApp webhook:"
echo ""
echo "   Twilio Console > Messaging > Try it out > WhatsApp"
echo "   > Sandbox settings > \"When a message comes in\""
echo "   > paste: https://xxxx.ngrok-free.app/webhook"
echo ""
echo " ===================================================="
echo ""

# On macOS, ngrok is typically installed via Homebrew or direct download
# If installed via Homebrew: ngrok http 3001
# If downloaded manually, adjust the path below
ngrok http 3001

read -rp "Press Enter to continue..."
