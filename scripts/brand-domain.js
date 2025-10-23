/* Update domains meta fields and theme */
const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)));

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
  const domain = process.argv[2];
  const name = process.argv[3];

  if (!supabaseUrl || !key) {
    console.error('Missing Supabase env');
    process.exit(1);
  }
  if (!domain || !name) {
    console.error('Usage: node scripts/brand-domain.js <domain> <Display Name>');
    process.exit(1);
  }

  const headers = { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  const update = {
    meta_title: name,
    meta_description: `Official blog for ${name}.`,
    og_title: name,
    og_description: 'Beauty, makeup, and more.',
    selected_theme: 'elegant-editorial',
    theme_name: name,
    blog_enabled: true,
    updated_at: new Date().toISOString()
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}`, { method: 'PATCH', headers, body: JSON.stringify(update) });
  const text = await res.text();
  if (!res.ok) {
    console.error('Update failed:', res.status, text);
    process.exit(1);
  }
  console.log('Updated:', text);
}

main();
