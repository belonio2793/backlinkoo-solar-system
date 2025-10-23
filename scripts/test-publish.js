import { createClient } from '@supabase/supabase-js';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const next = argv[i+1];
      if (next && !next.startsWith('--')) { args[k]=next; i++; } else { args[k]='true'; }
    }
  }
  return args;
}

function slugify(s) {
  return String(s||'')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0,120);
}

(async function(){
  const args = parseArgs(process.argv);
  const domain = args.domain;
  const theme = args.theme || 'modern';
  const title = args.title || 'Untitled';
  const content = args.content || `<p>Sample generated post for ${title}</p>`;
  const publishedAt = new Date().toISOString();

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // find domain id
  const { data: domainRow, error: domainErr } = await supabase.from('domains').select('id,domain').eq('domain', domain).maybeSingle();
  if (domainErr) { console.error('Failed to lookup domain:', domainErr); process.exit(1); }
  if (!domainRow) { console.error('Domain not found in DB:', domain); process.exit(1); }

  const slug = slugify(args.slug || title);
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body><article><h1>${title}</h1>${content}</article></body></html>`;
  const bucket = 'themes';
  const keyHtml = `${theme}/posts/${slug}.html`;
  const keyIndex = `${theme}/posts/${slug}/index.html`;

  const buf = Buffer.from(html, 'utf8');

  console.log('Uploading', keyHtml);
  const up1 = await supabase.storage.from(bucket).upload(keyHtml, buf, { contentType: 'text/html; charset=utf-8', upsert: true });
  if (up1.error) { console.error('Upload error:', up1.error); process.exit(1); }
  console.log('Uploading', keyIndex);
  const up2 = await supabase.storage.from(bucket).upload(keyIndex, buf, { contentType: 'text/html; charset=utf-8', upsert: true }).catch(e=>({ error: e }));
  if (up2 && up2.error) console.warn('Index upload warning:', up2.error.message || up2.error);

  // insert automation_posts
  let inserted = null;
  try {
    const insert = await supabase.from('automation_posts').insert({ domain_id: domainRow.id, title, slug, content, published_at: publishedAt }).select('id').maybeSingle();
    if (insert.error) throw insert.error;
    inserted = insert.data;
    console.log('Inserted automation_posts id:', inserted?.id);
  } catch (e) {
    console.warn('Insert automation_posts failed:', e?.message || e);
    try {
      const insert2 = await supabase.from('domain_blog_posts').insert({ domain_id: domainRow.id, title, slug, content, published_at: publishedAt, status: 'published' }).select('id').maybeSingle();
      if (insert2.error) throw insert2.error;
      inserted = insert2.data;
      console.log('Inserted domain_blog_posts id:', inserted?.id);
    } catch (e2) {
      console.warn('Fallback insert into domain_blog_posts failed:', e2?.message || e2);
    }
  }

  const publicBase = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${bucket}`;
  console.log('Public URL (file):', `${publicBase}/${encodeURIComponent(theme)}/posts/${encodeURIComponent(slug)}.html`);
  console.log('Public URL (folder):', `${publicBase}/${encodeURIComponent(theme)}/posts/${encodeURIComponent(slug)}/`);

  console.log('Done');
})();
