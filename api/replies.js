/**
 * Poll for WhatsApp replies stored in Upstash Redis.
 * Widget calls GET /api/replies?since=<unix_ts>
 */

async function upstash(method, path, body) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { result: [] };
  const r = await fetch(`${url}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const since = parseFloat(req.query?.since || '0');

  try {
    const data    = await upstash('GET', '/lrange/clari5_replies/0/49');
    const entries = (data.result || []).map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    const fresh   = entries.filter(r => r.ts > since);
    return res.json({ replies: fresh });
  } catch (e) {
    return res.json({ replies: [] });
  }
}
