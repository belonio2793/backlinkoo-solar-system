import { createClient } from '@supabase/supabase-js';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--url') out.url = args[++i];
    else if (a === '--domain') out.domain = args[++i];
    else if (a === '--slug') out.slug = args[++i];
    else if (a === '--title') out.title = args[++i];
  }
  return out;
}

function extractDomainSlugFromUrl(u) {
  try {
    const url = new URL(u);
    const domain = url.hostname;
    const m = url.pathname.replace(/^\/+/, '').match(/themes\/(.+)$/i);
    const slug = m ? m[1] : '';
    return { domain, slug };
  } catch (_) { return { domain: '', slug: '' }; }
}

async function main() {
  const { url, domain: dArg, slug: sArg, title: overrideTitle } = parseArgs();
  let domain = dArg || '';
  let slug = sArg || '';
  if (url && (!domain || !slug)) {
    const parsed = extractDomainSlugFromUrl(url);
    domain = parsed.domain; slug = parsed.slug;
  }
  if (!domain || !slug) {
    console.error('Provide --url or both --domain and --slug');
    process.exit(1);
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Supabase env vars missing');
    process.exit(1);
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // Load domain
  const { data: domainRow, error: dErr } = await sb
    .from('domains')
    .select('id, domain')
    .eq('domain', domain)
    .maybeSingle();
  if (dErr || !domainRow) {
    console.error('Domain not found', domain, dErr && dErr.message);
    process.exit(1);
  }

  // Find post
  const { data: post, error: pErr } = await sb
    .from('automation_posts')
    .select('id, automation_id, user_id, slug, title, content, keywords, anchor_texts')
    .eq('domain_id', domainRow.id)
    .eq('slug', slug)
    .maybeSingle();
  if (pErr || !post) {
    console.error('Post not found', slug, pErr && pErr.message);
    process.exit(1);
  }

  // Load campaign target_url for backlink insertion (kept for compatibility)
  let target_url = null;
  try {
    const { data: camp } = await sb
      .from('automation_campaigns')
      .select('target_url')
      .eq('id', post.automation_id)
      .maybeSingle();
    if (camp && camp.target_url) target_url = camp.target_url;
  } catch {}

  // No local cleaning/enhancement. Rendering now relies on Supabase themes post.html at read-time.
  const newTitle = (overrideTitle || post.title || '').trim();
  const newContent = post.content || '';
  const host = String(domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
  const urlOut = `https://${host}/themes/${slug}`;

  const { data: updated, error: uErr } = await sb
    .from('automation_posts')
    .update({ title: newTitle, content: newContent, url: urlOut })
    .eq('id', post.id)
    .select('id, title, slug, url')
    .maybeSingle();

  if (uErr) {
    console.error('Update failed:', uErr.message || uErr);
    process.exit(1);
  }

  console.log(JSON.stringify({ success: true, updated }, null, 2));
}

main().catch((e) => { console.error(e && (e.message || e)); process.exit(1); });
