import https from 'https';
import querystring from 'querystring';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { to, message } = req.body || {};
  if (!to)      return res.status(400).json({ success: false, error: 'Missing recipient number' });
  if (!message) return res.status(400).json({ success: false, error: 'Missing message body' });

  const accountSid  = process.env.TWILIO_ACCOUNT_SID;
  const authToken   = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber  = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !accountSid.startsWith('AC')) {
    return res.status(500).json({ success: false, error: 'Twilio credentials not configured in Vercel env' });
  }

  const toNum = to.startsWith('+') ? to : '+' + to;
  const body  = querystring.stringify({
    From: `whatsapp:${fromNumber}`,
    To:   `whatsapp:${toNum}`,
    Body: message,
  });

  const auth    = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const options = {
    hostname: 'api.twilio.com',
    path:     `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method:   'POST',
    headers:  {
      'Authorization': `Basic ${auth}`,
      'Content-Type':  'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const result = await new Promise((resolve, reject) => {
    const req2 = https.request(options, (r) => {
      let data = '';
      r.on('data', (c) => { data += c; });
      r.on('end', () => resolve({ status: r.statusCode, body: data }));
    });
    req2.on('error', reject);
    req2.write(body);
    req2.end();
  });

  let twilioResp = {};
  try { twilioResp = JSON.parse(result.body); } catch (_) {}

  if (result.status === 200 || result.status === 201) {
    return res.json({ success: true, sid: twilioResp.sid, status: twilioResp.status });
  }

  const err = twilioResp.message || twilioResp.error_message || 'Twilio error';
  return res.status(400).json({ success: false, error: err });
}
