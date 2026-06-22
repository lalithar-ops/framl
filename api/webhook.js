/**
 * Twilio inbound webhook — receives WhatsApp replies, stores in Upstash Redis.
 * Twilio console: set "When a message comes in" to this URL (HTTP POST).
 */

const ACTION_MAP = {
  '1': 'ESCALATE', 'escalate': 'ESCALATE',
  '2': 'FREEZE',   'freeze':   'FREEZE',
  '3': 'APPROVE',  'approve':  'APPROVE',
  '4': 'HOLD',     'hold':     'HOLD',
  '5': 'INFO',     'info':     'INFO',
};

const ACTION_LABELS = {
  ESCALATE: 'Escalate to Investigation Team',
  FREEZE:   'Freeze Account',
  APPROVE:  'Approve Transaction',
  HOLD:     'Hold for 4-Hour Compliance Review',
  INFO:     'Request Info from Relationship Manager',
};

const ACTION_CONFIRM = {
  ESCALATE: '✅ *Action Executed: ESCALATE*\n\nCase escalated to FBN investigation team.\nTeam lead notified via Clari5 EFRM.\nSLA clock started: 2 hours.\n\n_— Clari5 EFRM Platform_',
  FREEZE:   '✅ *Action Executed: FREEZE ACCOUNT*\n\nAccount frozen pending investigation.\nNo further transactions will be processed.\nFreeze logged in Clari5 audit trail.\n\n_— Clari5 EFRM Platform_',
  APPROVE:  '✅ *Action Executed: APPROVE*\n\nTransaction approved. Alert closed.\nCase marked resolved in Clari5 EFRM.\nJustification logged for compliance.\n\n_— Clari5 EFRM Platform_',
  HOLD:     '✅ *Action Executed: HOLD*\n\nTransaction placed on 4-hour hold.\nCompliance review window activated.\nEscalates automatically if no further action.\n\n_— Clari5 EFRM Platform_',
  INFO:     '✅ *Action Executed: REQUEST INFO*\n\nAdditional information request sent to RM.\nResponse expected within 2 hours.\nAlert paused pending response.\n\n_— Clari5 EFRM Platform_',
};

const HELP_MSG = 'Clari5 EFRM — reply with a number to take action:\n1 ESCALATE\n2 FREEZE\n3 APPROVE\n4 HOLD\n5 Request INFO';

async function upstash(method, path, body) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Upstash env vars not set');
  const r = await fetch(`${url}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
}

async function twilioSend(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM_NUMBER;
  const toNum      = to.startsWith('+') ? to : '+' + to;
  const params     = new URLSearchParams({ From: `whatsapp:${from}`, To: `whatsapp:${toNum}`, Body: body });
  const auth       = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const from = (req.body?.From || '').replace('whatsapp:', '').trim();
  const body = (req.body?.Body || '').trim();

  const action = ACTION_MAP[body.toLowerCase().trim()];
  const reply  = {
    from,
    body,
    action:  action || null,
    label:   ACTION_LABELS[action] || '',
    icon:    (action || 'unknown').toLowerCase(),
    ts:      Date.now() / 1000,
  };

  // Store in Upstash (LPUSH, keep last 50)
  try {
    await upstash('POST', '/pipeline', [
      ['lpush', 'clari5_replies', JSON.stringify(reply)],
      ['ltrim', 'clari5_replies', 0, 49],
    ]);
  } catch (e) {
    console.error('Upstash error:', e.message);
  }

  // Send confirmation back via Twilio
  try {
    const msg = ACTION_CONFIRM[action] || HELP_MSG;
    await twilioSend(from, msg);
  } catch (_) {}

  // Twilio expects TwiML response
  res.setHeader('Content-Type', 'text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
}
