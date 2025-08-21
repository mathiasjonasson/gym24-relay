// api/relay.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { target, method = 'POST', headers = {}, formFields = {} } = req.body || {};
    if (!target) return res.status(400).send('Missing target');

    let upstream;
    if (method === 'GET' || method === 'HEAD') {
      // ❗️INGEN BODY VID GET/HEAD
      upstream = await fetch(target, { method, headers });
    } else {
      // POST/PUT etc: bygg form-data
      const fd = new FormData();
      Object.entries(formFields || {}).forEach(([k, v]) => fd.append(k, String(v ?? '')));
      upstream = await fetch(target, { method, headers, body: fd });
    }

    const text = await upstream.text();
    res.setHeader('content-type', upstream.headers.get('content-type') || 'application/json');
    return res.status(upstream.status).send(text);
  } catch (e) {
    return res.status(500).send(String(e));
  }
}
