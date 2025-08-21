export default async function handler(req, res) {
  // CORS för webbläsare
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { target, method = 'POST', headers = {}, formFields = {} } = req.body || {};
    if (!target) return res.status(400).send('Missing target');

    // Bygg form-data enligt Ellions krav (-F i curl)
    const fd = new FormData();
    Object.entries(formFields).forEach(([k, v]) => fd.append(k, String(v ?? '')));

    const r = await fetch(target, { method, headers, body: fd });
    const text = await r.text();

    res.setHeader('content-type', r.headers.get('content-type') || 'application/json');
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).send(String(e));
  }
}
