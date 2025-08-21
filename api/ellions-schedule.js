export default async function handler(req, res) {
  const API_BASE = "https://gym24.novasecur.se/api/2.0/";
  const API_KEY  = "U2OYWTKSK3SK0GI7TQPSA6OK898AF6NT";

  const { start, end } = req.query;
  const url = API_BASE + "?" + new URLSearchParams({
    command: "getSchedule",
    start, end
  });

  try {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    res.status(500).json({ success:false, error:e.message });
  }
}
