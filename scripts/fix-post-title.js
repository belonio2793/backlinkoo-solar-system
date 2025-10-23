import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) { console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL'); process.exit(1); }
if (!SERVICE_ROLE) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

function decodeEntities(s) {
  if (!s) return '';
  return String(s)
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}
function stripTags(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\u00A0\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
function titleCase(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\s{2,}/g, ' ').split(' ').map(w => w ? (w[0].toUpperCase() + w.slice(1)) : '').join(' ').trim();
}
function deriveTitle(currentTitle, html, slug) {
  const t = decodeEntities(currentTitle || '').trim();
  const looksBroken = !t || /<|>|itemtype|itemscope|figure|schema|class=/i.test(t) || /^https?:\/\//i.test(t);
  if (!looksBroken) return t;
  const h1Match = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const extracted = stripTags(h1Match[1]);
    if (extracted) return extracted.slice(0, 180);
  }
  const cleanSlug = (slug || '').replace(/\.html$/i, '').split('/').pop() || slug || '';
  return titleCase(cleanSlug).slice(0, 180);
}

async function findPost(sb, domainId, slugHint, table) {
  const tail = (slugHint || '').replace(/\.html$/i, '').split('/').pop();
  const variants = Array.from(new Set([
    slugHint,
    (slugHint || '').replace(/\.html$/i, ''),
    `${(slugHint || '').replace(/\.html$/i, '')}.html`,
    tail,
    `${tail}.html`,
    `business/${tail}`,
    `themes/business/${tail}`,
  ].filter(Boolean).map(s => s.toLowerCase())));

  // exact slug variants
  for (const s of variants) {
    const { data } = await sb.from(table).select('id, title, slug, content, url').eq('domain_id', domainId).eq('slug', s).maybeSingle();
    if (data) return { table, row: data };
  }
  // url contains themes path + tail
  if (tail) {
    const patterns = [`%/themes/%${tail}%`, `%/themes/business/%${tail}%`];
    for (const p of patterns) {
      const { data } = await sb.from(table).select('id, title, slug, content, url').eq('domain_id', domainId).ilike('url', p).limit(1).maybeSingle();
      if (data) return { table, row: data };
    }
    // slug ilike fallback
    const { data } = await sb.from(table).select('id, title, slug, content, url').eq('domain_id', domainId).ilike('slug', `%${tail}%`).limit(1).maybeSingle();
    if (data) return { table, row: data };
  }
  return null;
}

async function main() {
  const domain = process.argv[2];
  const slugHint = process.argv[3] || '';
  const forcedTitle = (process.argv.length > 4) ? process.argv.slice(4).join(' ') : '';
  if (!domain) { console.error('Usage: node scripts/fix-post-title.js <domain> [slugHint] [new title ...]'); process.exit(1); }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const { data: drow, error: derr } = await sb.from('domains').select('id, domain').eq('domain', domain).maybeSingle();
  if (derr) throw derr;
  if (!drow) { console.error('Domain not found:', domain); process.exit(1); }
  const domainId = drow.id;

  let found = await findPost(sb, domainId, slugHint, 'automation_posts');
  if (!found) found = await findPost(sb, domainId, slugHint, 'blog_posts');
  if (!found) {
    console.error('No post found for domain', domain, 'with hint', slugHint);
    process.exit(1);
  }

  const { table, row } = found;
  const computed = forcedTitle || deriveTitle(row.title, row.content || '', row.slug || slugHint || '');
  if (!computed) { console.error('Could not compute a valid title'); process.exit(1); }
  if (computed.trim() === (row.title || '').trim()) { console.log('Title unchanged, already looks correct:', row.title); return; }

  const { error: upErr } = await sb.from(table).update({ title: computed, updated_at: new Date().toISOString() }).eq('id', row.id);
  if (upErr) throw upErr;
  console.log(`Updated ${table}#${row.id}:\n  Old: ${row.title}\n  New: ${computed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
