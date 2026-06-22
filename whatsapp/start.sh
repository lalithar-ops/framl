#!/bin/bash
# Converted from Windows .bat — macOS compatible
set -e

SCRIPT_DIR=$(dirname "$0")

echo ""
echo " ===================================================="
echo "  Clari5 WhatsApp Proxy  -  Starting..."
echo " ===================================================="
echo ""

# Install dependencies silently
pip install -r "$SCRIPT_DIR/requirements.txt" -q

# Check for config.json
if [ ! -f "$SCRIPT_DIR/config.json" ]; then
  echo " WARNING: config.json not found!"
  echo " Copy config.template.json to config.json"
  echo " and fill in your Twilio credentials."
  echo ""
  read -rp "Press Enter to continue..."
  exit 1
fi

echo " Starting proxy on http://localhost:3001 ..."
echo " Press Ctrl+C to stop."
echo ""

python "$SCRIPT_DIR/server.py"

read -rp "Press Enter to continue..."
