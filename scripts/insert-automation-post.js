/*
Insert an automation_posts row for a given domain and slug.
Usage:
  SUPABASE_SERVICE_ROLE_KEY=... node scripts/insert-automation-post.js <domain> <slug>
*/

async function main() {
  const [domain, slugSimple] = process.argv.slice(2);
  if (!domain || !slugSimple) {
    console.error('Usage: node scripts/insert-automation-post.js <domain> <slug>');
    process.exit(1);
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    console.error('Missing SUPABASE URL or service role key');
    process.exit(1);
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/domains?select=id,user_id,selected_theme,domain&domain=eq.${encodeURIComponent(domain)}`, { headers });
  if (!res.ok) {
    throw new Error(`Domain fetch failed: ${res.status}`);
  }
  const arr = await res.json();
  const dom = arr[0];
  if (!dom) throw new Error(`Domain not found: ${domain}`);

  const title = slugSimple.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const now = new Date().toISOString();
  const body = {
    automation_id: null,
    domain_id: dom.id,
    user_id: dom.user_id || null,
    slug: slugSimple,
    title,
    content: '',
    url: `https://${domain}/posts/${slugSimple}`,
    status: 'published',
    published_at: now,
  };

  const insertRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/automation_posts`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  const text = await insertRes.text();
  if (!insertRes.ok) {
    throw new Error(`Insert failed ${insertRes.status}: ${text}`);
  }
  console.log(text);
}

main().catch((e) => {
  console.error(e && (e.message || String(e)));
  process.exit(1);
});
