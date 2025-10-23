// Set Netlify environment variables via API
// Usage: node scripts/set-netlify-env.js KEY=value KEY2=value2
// Requires: NETLIFY_ACCESS_TOKEN, NETLIFY_SITE_ID

const SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID;
const TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN;

if (!SITE_ID || !TOKEN) {
  console.error('NETLIFY_SITE_ID and NETLIFY_ACCESS_TOKEN are required');
  process.exit(1);
}

const BASE = 'https://api.netlify.com/api/v1';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

function parseArgs(argv) {
  const out = {};
  for (const arg of argv.slice(2)) {
    const idx = arg.indexOf('=');
    if (idx > 0) out[arg.slice(0, idx)] = arg.slice(idx + 1);
  }
  return out;
}

const toSet = parseArgs(process.argv);

(async () => {
  const res = await fetch(`${BASE}/sites/${SITE_ID}/env`, { headers });
  if (!res.ok) {
    console.error('Failed to load current env', res.status);
    process.exit(1);
  }
  const current = await res.json();
  const next = { ...current, ...toSet };
  const put = await fetch(`${BASE}/sites/${SITE_ID}/env`, { method: 'PUT', headers, body: JSON.stringify(next) });
  const text = await put.text();
  console.log('Update status', put.status);
  console.log(text);
  if (!put.ok) process.exit(1);
})();
