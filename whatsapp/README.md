# Clari5 WhatsApp Alert Widget

Standalone two-way WhatsApp integration for Clari5 demo HTML files.
Drop this folder onto any laptop, run `start.bat`, and a live WhatsApp FAB appears in the demo.

---

## What it does

- Floating green WhatsApp button (FAB) appears in the demo — visible on all views
- Click to open a drawer: pick a contact, pick an alert preset, send live
- Fraud head receives the alert on their phone with an action menu
- They reply (`1`–`5`) → action reflected live in the demo drawer within 3 seconds
- Auto-confirmation sent back to their phone

---

## Quick start (one-way send only)

1. Copy `config.template.json` → `config.json`, fill in Twilio credentials
2. Double-click `start.bat`
3. Open the demo HTML in Chrome — green FAB appears bottom-right

See `SETUP.md` for Twilio account and sandbox setup (5 minutes).

---

## Two-way (live reply in demo)

Requires ngrok to expose localhost to Twilio's webhook.
See `WEBHOOK_SETUP.md` for full instructions.

---

## Files

| File | Purpose |
|---|---|
| `server.py` | Flask proxy server — all API endpoints |
| `widget.js` | Self-contained JS widget (no dependencies) |
| `config.json` | Your Twilio credentials (create from template) |
| `config.template.json` | Credentials template |
| `requirements.txt` | Python deps: flask, flask-cors, requests |
| `start.bat` | Windows launcher — double-click to run |
| `start_ngrok.bat` | Starts ngrok tunnel for two-way mode |
| `SETUP.md` | Twilio sandbox setup guide |
| `WEBHOOK_SETUP.md` | Two-way / ngrok setup guide |

---

## Inject into any demo HTML

Add this before `</body>` in the outer shell HTML:

```html
<script>
(function(){
  var s=document.createElement('script');
  s.src='http://127.0.0.1:3001/widget.js';
  s.onerror=function(){console.log('[Clari5] WhatsApp widget offline')};
  document.head.appendChild(s);
})();
</script>
```

The widget gracefully does nothing if the proxy is not running — the demo works offline.

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Status check — widget polls this on load |
| POST | `/send` | Send outbound alert `{to, message}` |
| POST | `/webhook` | Twilio inbound webhook (set URL in Twilio console) |
| GET | `/replies?since=<ts>` | Poll for new inbound replies |
| POST | `/replies/clear` | Reset reply store between demo runs |
| GET | `/widget.js` | Serves the widget JS |

---

## Action keywords (fraud head replies)

| Reply | Action | Demo narrative |
|---|---|---|
| `1` / `escalate` | Escalate to investigation team | Case goes to the queue |
| `2` / `freeze` | Freeze account | Account locked instantly |
| `3` / `approve` | Approve transaction | Alert closed, false positive |
| `4` / `hold` | 4-hour compliance hold | Review window opened |
| `5` / `info` | Request info from RM | Info request dispatched |

---

## Requirements

- Python 3.8+
- `pip install -r requirements.txt`
- Twilio account (free sandbox tier is sufficient)
- ngrok (for two-way mode only)
