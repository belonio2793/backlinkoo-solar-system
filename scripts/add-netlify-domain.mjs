import 'dotenv/config';
const SITE_ID = process.env.VITE_NETLIFY_SITE_ID || process.env.NETLIFY_SITE_ID;
const TOKEN = process.env.VITE_NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_ACCESS_TOKEN;
if (!SITE_ID || !TOKEN) { console.error('Missing SITE_ID or TOKEN'); process.exit(1); }
(async ()=>{
  try {
    const domain = process.argv[2] || 'backlinkoo.com';
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/domains`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: domain })
    });
    const text = await res.text();
    console.log('Status', res.status);
    console.log('Body:', text);
  } catch (e) { console.error('Netlify API call failed:', e.message || e); }
})();
