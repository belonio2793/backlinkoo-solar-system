import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const BUCKET = process.env.SUPABASE_THEMES_BUCKET || 'themes';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.txt': return 'text/plain; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

async function listAll(prefix) {
  const out = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: pageSize, offset: page * pageSize });
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...data);
    if (data.length < pageSize) break;
    page++;
  }
  return out;
}

async function copyThemeToDomain(themeId, domain) {
  const themePrefix = String(themeId).replace(/^\/+|\/+$/g, '');
  const domainKey = String(domain).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

  const files = await listAll(themePrefix);
  console.log(`Found ${files.length} files under theme ${themePrefix}`);

  for (const f of files) {
    try {
      const srcPath = `${themePrefix}/${f.name}`;
      const destPath = `${domainKey}/${f.name}`;
      console.log('Copying', srcPath, '->', destPath);

      const { data: downloadData, error: downloadErr } = await sb.storage.from(BUCKET).download(srcPath);
      if (downloadErr) { console.warn('Could not download', srcPath, downloadErr.message || downloadErr); continue; }

      const arrayBuffer = await downloadData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const contentType = getMimeType(f.name);
      const { error: uploadErr } = await sb.storage.from(BUCKET).upload(destPath, buffer, { contentType, upsert: true });
      if (uploadErr) { console.warn('Failed to upload', destPath, uploadErr.message || uploadErr); continue; }
    } catch (e) {
      console.warn('Error copying file for domain theme:', e && e.message);
    }
  }

  console.log('Theme files copied to domain folder');
}

(async function(){
  const theme = process.argv[2] || 'minimal';
  const domain = process.argv[3] || '';
  if (!domain) {
    console.error('Usage: node scripts/copy-theme-to-domain.js <themeId> <domain>');
    process.exit(1);
  }
  try {
    await copyThemeToDomain(theme, domain);
    console.log('Done');
  } catch (e){
    console.error('Failed:', e && e.message);
    process.exit(1);
  }
})();
