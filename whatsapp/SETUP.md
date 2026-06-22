# Clari5 WhatsApp Alert — Setup Guide

5-minute setup. You do this once before the demo.

---

## What you need

- A Twilio account (free sandbox — no credit card required for testing)
- Python 3.8+ installed on your laptop
- The WhatsApp app on the demo recipient's phone

---

## Step 1 — Create a free Twilio account

1. Go to **https://www.twilio.com/try-twilio** and sign up
2. Verify your email and phone number
3. On the welcome screen, select:
   - *I want to:* **Send WhatsApp messages**
   - *Building with:* **Python** (doesn't matter, pick anything)

---

## Step 2 — Activate the WhatsApp Sandbox

1. In the Twilio Console, go to **Messaging → Try it out → Send a WhatsApp message**
2. You'll see a sandbox number (usually **+1 415 523 8886**) and a join code like `join yellow-dragon`
3. Note both — you need them below

**Each recipient must join the sandbox once:**

Send this WhatsApp message from their phone:
```
join yellow-dragon
```
...to: **+1 415 523 8886**

They'll receive a confirmation: *"You have joined the sandbox."*

Do this for your own phone and any prospect phones before the demo.

---

## Step 3 — Get your Twilio credentials

In the Twilio Console, click the home icon (or go to **Console Dashboard**).

Copy:
- **Account SID** — starts with `AC...`
- **Auth Token** — click the eye icon to reveal

---

## Step 4 — Create config.json

In the `whatsapp/` folder, copy `config.template.json` to `config.json`:

```
copy config.template.json config.json
```

Edit `config.json` and fill in:

```json
{
  "twilio": {
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "auth_token":  "your_auth_token_here",
    "from_number": "+14155238886"
  }
}
```

> **Security:** `config.json` is for demo use only. Do not commit it to git or share it.

---

## Step 5 — Start the proxy server

Double-click **`start.bat`** in the `whatsapp/` folder.

You should see:
```
=======================================================
  Clari5 WhatsApp Proxy  —  v1.0
  Listening : http://localhost:3001
  Widget    : http://localhost:3001/widget.js
  Health    : http://localhost:3001/health
=======================================================
```

Leave this terminal window open during the demo.

---

## Step 6 — Verify everything works

1. Open `Clari5_FBN_EFRM_Demo.html` in Chrome
2. You should see a **green WhatsApp button** in the bottom-right corner
3. Click it → the drawer opens → status bar shows **"Proxy connected — ready to send"**
4. Select a contact and message preset → click **Send via WhatsApp**
5. The recipient's phone receives the WhatsApp message within ~5 seconds

---

## Using it in the boardroom demo

During the demo, when you reach the Investigation Workbench:

1. Click the green WhatsApp FAB (bottom-right)
2. The drawer slides in from the right
3. Select the recipient (you set their number in the contacts list beforehand)
4. Select the alert preset that matches what's on screen:
   - **BEC Critical Alert** — when showing FBN-ML-2291 Prestige Foods case
   - **ATO High Priority** — when showing account takeover detection
   - **FRAML Executive Brief** — for the board-level summary view
5. Click **Send via WhatsApp**
6. The animated delivery receipt plays: Sent → Delivered → Read
7. The recipient's phone buzzes with the alert — live, in the room

---

## Troubleshooting

| Problem | Fix |
|---|---|
| FAB doesn't appear | Make sure `start.bat` is running. Open http://localhost:3001/health in a browser — should return `{"ok": true}` |
| Status bar shows "Proxy offline" | Click **Recheck** button. If still offline, check that `server.py` is running |
| "Twilio credentials not configured" | Edit `config.json` and make sure Account SID doesn't still say `FILL_IN...` |
| Message sends but not received | Confirm the recipient texted `join [code]` to the sandbox number. Check Twilio Console → Logs |
| "This number is not registered" | The recipient hasn't joined the Twilio sandbox yet (Step 2) |
| `config.json not found` | You forgot to copy `config.template.json` to `config.json` |

---

## Pre-demo checklist

- [ ] Twilio sandbox activated
- [ ] Your phone has joined the sandbox
- [ ] Prospect's phone has joined the sandbox (if sending to them live)
- [ ] `config.json` filled in with real credentials
- [ ] `start.bat` running — terminal shows "Listening: http://localhost:3001"
- [ ] Demo HTML open in Chrome — green FAB visible
- [ ] Test send completed successfully
- [ ] Contact numbers saved in the FAB drawer (they persist across sessions)

---

*Clari5 Pre-Sales | WhatsApp Alert Integration v1.0*
