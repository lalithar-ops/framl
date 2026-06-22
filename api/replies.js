// Vercel is stateless — no in-memory reply store possible.
// Returns empty replies so the widget degrades gracefully (send-only mode on Vercel).
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ replies: [] });
}
