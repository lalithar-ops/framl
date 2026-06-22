"""
Clari5 WhatsApp Proxy Server — v2.0
Two-way WhatsApp integration for demo use. Runs on localhost:3001.

Endpoints:
  GET  /health        -> status check
  POST /send          -> send outbound alert
  POST /webhook       -> Twilio inbound webhook (expose via ngrok)
  GET  /replies       -> widget polls for incoming replies
  POST /replies/clear -> reset reply store between demo runs
  GET  /widget.js     -> serves the widget
"""
import json
import os
import base64
import time
import threading
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')

# In-memory reply store — cleared on server restart (fine for demo)
_replies = []
_lock    = threading.Lock()

# ── Action vocabulary ────────────────────────────────────────────────────────
ACTION_MAP = {
    '1': 'ESCALATE', 'escalate': 'ESCALATE',
    '2': 'FREEZE',   'freeze':   'FREEZE',
    '3': 'APPROVE',  'approve':  'APPROVE',
    '4': 'HOLD',     'hold':     'HOLD',
    '5': 'INFO',     'info':     'INFO', 'request info': 'INFO',
}

ACTION_LABELS = {
    'ESCALATE': 'Escalate to Investigation Team',
    'FREEZE':   'Freeze Account',
    'APPROVE':  'Approve Transaction',
    'HOLD':     'Hold for 4-Hour Compliance Review',
    'INFO':     'Request Info from Relationship Manager',
}

ACTION_ICONS = {
    'ESCALATE': 'escalate',
    'FREEZE':   'freeze',
    'APPROVE':  'approve',
    'HOLD':     'hold',
    'INFO':     'info',
}

ACTION_CONFIRM = {
    'ESCALATE': (
        '✅ *Action Executed: ESCALATE*\n\n'
        'Case escalated to FBN investigation team.\n'
        'Team lead notified via Clari5 EFRM.\n'
        'SLA clock started: 2 hours.\n\n'
        '_— Clari5 EFRM Platform_'
    ),
    'FREEZE': (
        '✅ *Action Executed: FREEZE ACCOUNT*\n\n'
        'Account frozen pending investigation.\n'
        'No further transactions will be processed.\n'
        'Freeze logged in Clari5 audit trail.\n\n'
        '_— Clari5 EFRM Platform_'
    ),
    'APPROVE': (
        '✅ *Action Executed: APPROVE*\n\n'
        'Transaction approved. Alert closed.\n'
        'Case marked resolved in Clari5 EFRM.\n'
        'Justification logged for compliance.\n\n'
        '_— Clari5 EFRM Platform_'
    ),
    'HOLD': (
        '✅ *Action Executed: HOLD*\n\n'
        'Transaction placed on 4-hour hold.\n'
        'Compliance review window activated.\n'
        'Escalates automatically if no further action.\n\n'
        '_— Clari5 EFRM Platform_'
    ),
    'INFO': (
        '✅ *Action Executed: REQUEST INFO*\n\n'
        'Additional information request sent to RM.\n'
        'Response expected within 2 hours.\n'
        'Alert paused pending response.\n\n'
        '_— Clari5 EFRM Platform_'
    ),
}

HELP_MSG = (
    'Clari5 EFRM — reply with a number to take action:\n'
    '1 ESCALATE to investigation team\n'
    '2 FREEZE account\n'
    '3 APPROVE transaction\n'
    '4 HOLD for 4-hour review\n'
    '5 Request INFO'
)


def load_config():
    with open(CONFIG_FILE, encoding='utf-8') as f:
        return json.load(f)


def twilio_send(to, body, cfg):
    twilio      = cfg.get('twilio', {})
    account_sid = twilio.get('account_sid', '')
    auth_token  = twilio.get('auth_token', '')
    from_number = twilio.get('from_number', '')
    if not to.startswith('+'):
        to = '+' + to
    auth_header = base64.b64encode(f'{account_sid}:{auth_token}'.encode()).decode()
    url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json'
    return requests.post(
        url,
        headers={'Authorization': f'Basic {auth_header}'},
        data={'From': f'whatsapp:{from_number}', 'To': f'whatsapp:{to}', 'Body': body},
        timeout=15,
    )


# ── Health check ─────────────────────────────────────────────────────────────
@app.route('/health')
def health():
    return jsonify({'ok': True, 'version': '2.0.0', 'service': 'Clari5 WhatsApp Proxy'})


# ── Send outbound alert ───────────────────────────────────────────────────────
@app.route('/send', methods=['POST'])
def send():
    data    = request.get_json(force=True) or {}
    to      = (data.get('to') or '').strip()
    message = (data.get('message') or '').strip()

    if not to:
        return jsonify({'success': False, 'error': 'Missing recipient number'}), 400
    if not message:
        return jsonify({'success': False, 'error': 'Missing message body'}), 400
    if not to.startswith('+'):
        to = '+' + to

    try:
        cfg = load_config()
    except FileNotFoundError:
        return jsonify({'success': False,
                        'error': 'config.json not found'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': f'Config error: {e}'}), 500

    twilio = cfg.get('twilio', {})
    if not twilio.get('account_sid', '').startswith('AC'):
        return jsonify({'success': False, 'error': 'Twilio credentials not configured'}), 500

    try:
        r    = twilio_send(to, message, cfg)
        resp = r.json()
    except requests.RequestException as e:
        return jsonify({'success': False, 'error': f'Network error: {e}'}), 500

    if r.status_code in (200, 201) and resp.get('status') not in ('failed', 'undelivered'):
        print(f'  [SENT]  To:{to}  SID:{resp.get("sid","?")}')
        return jsonify({'success': True, 'sid': resp.get('sid'), 'status': resp.get('status')})

    err = resp.get('message') or resp.get('error_message') or 'Twilio error'
    print(f'  [FAIL]  To:{to}  Error:{err}')
    return jsonify({'success': False, 'error': err}), 400


# ── Twilio inbound webhook ────────────────────────────────────────────────────
@app.route('/webhook', methods=['POST'])
def webhook():
    """Twilio POSTs here when the fraud head replies on WhatsApp."""
    from_num = request.form.get('From', '').replace('whatsapp:', '').strip()
    body     = (request.form.get('Body') or '').strip()

    action       = ACTION_MAP.get(body.lower().strip())
    action_label = ACTION_LABELS.get(action, '')
    action_icon  = ACTION_ICONS.get(action, 'unknown')

    reply = {
        'from':   from_num,
        'body':   body,
        'action': action,
        'label':  action_label,
        'icon':   action_icon,
        'ts':     time.time(),
    }
    with _lock:
        _replies.append(reply)

    print(f'  [REPLY] From:{from_num}  Body:"{body}"  Action:{action or "unknown"}')

    try:
        cfg = load_config()
        msg = ACTION_CONFIRM.get(action, HELP_MSG)
        twilio_send(from_num, msg, cfg)
        print(f'  [ACK]   Confirmation sent to {from_num}')
    except Exception as e:
        print(f'  [ACK-FAIL] {e}')

    return ('<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            200, {'Content-Type': 'text/xml'})


# ── Poll for replies ──────────────────────────────────────────────────────────
@app.route('/replies')
def get_replies():
    since = float(request.args.get('since', 0))
    with _lock:
        new = [r for r in _replies if r['ts'] > since]
    return jsonify({'replies': new})


# ── Clear replies (between demo runs) ────────────────────────────────────────
@app.route('/replies/clear', methods=['POST'])
def clear_replies():
    with _lock:
        _replies.clear()
    return jsonify({'ok': True})


# ── Serve widget JS ──────────────────────────────────────────────────────────
@app.route('/widget.js')
def widget():
    return send_from_directory(BASE_DIR, 'widget.js', mimetype='application/javascript')


# ── Main ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('=' * 58)
    print('  Clari5 WhatsApp Proxy  --  v2.0')
    print('  Listening : http://localhost:3001')
    print('  Widget    : http://localhost:3001/widget.js')
    print('  Health    : http://localhost:3001/health')
    print('  Webhook   : http://localhost:3001/webhook')
    print('  Two-way   : see WEBHOOK_SETUP.md for ngrok instructions')
    print('=' * 58)
    if not os.path.exists(CONFIG_FILE):
        print('\n  WARNING: config.json not found.')
        print('  Copy config.template.json to config.json\n')
    app.run(host='0.0.0.0', port=3001, debug=False)
