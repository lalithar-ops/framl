export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ ok: true, version: '2.0.0', service: 'Clari5 WhatsApp Proxy (Vercel)' });
}
