import 'dotenv/config';
const SITE_ID = process.argv[2] || process.env.VITE_NETLIFY_SITE_ID || process.env.NETLIFY_SITE_ID;
const TOKEN = process.env.VITE_NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN;
if (!SITE_ID || !TOKEN) { console.error('Missing SITE_ID or TOKEN'); process.exit(1); }
(async ()=>{
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/domains`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) {
      console.error('Netlify API error', res.status, await res.text());
      process.exit(1);
    }
    const data = await res.json();
    console.log('Domains for site:', SITE_ID);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Netlify API fetch failed:', e.message || e);
  }
})();
