# Two-Way WhatsApp Setup — Webhook via ngrok

This enables the fraud head to reply to the WhatsApp alert and have their action reflected live in the demo.

---

## How it works

```
Demo sends alert → Fraud head's phone → Fraud head replies "1" (ESCALATE)
         ↓
Twilio receives reply → POSTs to your webhook URL
         ↓
Flask /webhook parses action → stores reply → sends confirmation back to phone
         ↓
Widget polls /replies every 3s → shows action card in demo drawer
```

---

## Step 1 — Install ngrok (one time)

Download from **https://ngrok.com/download** → unzip → place `ngrok.exe` anywhere on your PATH (e.g. `C:\Windows`).

Or with Chocolatey: `choco install ngrok`

Sign up for a free ngrok account and run:
```
ngrok config add-authtoken YOUR_AUTH_TOKEN
```
(Found at: dashboard.ngrok.com → Your Authtoken)

---

## Step 2 — Start the proxy server

Double-click **`start.bat`** — leave it running.

---

## Step 3 — Start ngrok tunnel

Double-click **`start_ngrok.bat`** — or run:
```
ngrok http 3001
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001
```

Copy the `https://` URL.

---

## Step 4 — Set the Twilio webhook

1. Go to **Twilio Console → Messaging → Try it out → Send a WhatsApp message**
2. Click **Sandbox settings**
3. In **"When a message comes in"**, paste:
   ```
   https://abc123.ngrok-free.app/webhook
   ```
4. Set method to **HTTP POST**
5. Click **Save**

---

## Step 5 — Test the flow

1. Open demo HTML in Chrome — green FAB should appear
2. Click FAB → send a BEC Critical Alert to your phone
3. On your phone, reply: `1` (or `escalate`, `freeze`, `approve`, `hold`, `info`)
4. Within 3 seconds, the demo drawer shows the action card
5. Your phone receives an auto-confirmation from Clari5 EFRM

---

## Action keywords

| Reply | Action |
|---|---|
| `1` or `escalate` | Escalate to Investigation Team |
| `2` or `freeze` | Freeze Account |
| `3` or `approve` | Approve Transaction |
| `4` or `hold` | Hold for 4-Hour Review |
| `5` or `info` | Request Info from Relationship Manager |

Any other reply → phone receives the help menu.

---

## Demo script (boardroom)

> *"Let me show you something live. This is the Prestige Foods BEC alert — ₦47.2M at risk. I'm going to send this alert right now to [Name], our Group Head of Fraud."*

[Click FAB → select contact → BEC Critical Alert → Send]

> *"The alert has just hit his phone. Watch what happens when he replies..."*

[Fraud head on their phone replies: `2` (FREEZE)]

> *"He's just frozen the account — straight from WhatsApp. And look — the action is reflected here in real time. The Clari5 platform has logged the freeze, updated the audit trail, and sent him a confirmation. All without him having to open a single system."*

---

## Before the demo — checklist

- [ ] ngrok running and URL set in Twilio console
- [ ] Fraud head's phone has joined the Twilio sandbox
- [ ] Test the full round-trip on your own phone first
- [ ] `start.bat` terminal is open (don't close it!)
- [ ] Run `POST http://localhost:3001/replies/clear` between demo runs to reset reply state

---

## ngrok URL changes each session

The free ngrok tier gives a new URL every time you start it. Remember to update the Twilio webhook URL at the start of each demo day.

**Tip:** ngrok paid tier ($8/month) gives you a stable custom URL — worth it for frequent demos.

---

*Clari5 Pre-Sales | WhatsApp Alert Integration v2.0*
