import 'dotenv/config';

const siteId = process.env.VITE_NETLIFY_SITE_ID || process.env.NETLIFY_SITE_ID;
const token = process.env.VITE_NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_ACCESS_TOKEN;

if (!siteId || !token) {
  console.error('Missing NETLIFY_SITE_ID or NETLIFY_ACCESS_TOKEN');
  process.exit(1);
}

function cleanDomain(input) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

async function getSite() {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET site failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function patchAliases(aliases) {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain_aliases: aliases })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH aliases failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  const domains = process.argv.slice(2).filter(Boolean);
  if (domains.length === 0) {
    console.error('Usage: node scripts/add-netlify-alias.mjs <domain> [more domains...]');
    process.exit(1);
  }
  const targets = domains.map(cleanDomain);
  const site = await getSite();
  const existing = Array.isArray(site.domain_aliases) ? site.domain_aliases.map(String) : [];

  let updated = [...existing];
  for (const d of targets) {
    if (!updated.includes(d)) updated.push(d);
  }

  if (updated.length === existing.length) {
    console.log('No changes. Domains already present:', existing);
    return;
  }

  const patched = await patchAliases(updated);
  console.log('Updated aliases:', patched.domain_aliases);
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
