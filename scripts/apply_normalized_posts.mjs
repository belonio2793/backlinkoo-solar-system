import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing Supabase env vars SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

const urls = [
  'https://demo.backlinkoo.com/themes/ecommerce/go-high-level-stars-why-we-use-go-high-level-every-day',
  'https://demo.backlinkoo.com/themes/modern/seo-software-for-smarter-marketing',
  'https://demo.backlinkoo.com/themes/elegant/go-high-level-stars-why-we-use-go-high-level-every-',
  'https://demo.backlinkoo.com/themes/lifestyle/go-high-level-stars-why-we-use-go-high-level-every-day'
];

(async () => {
  for (const u of urls) {
    const safe = u.replace(/[^a-z0-9]/gi, '_').slice(0,120);
    const file = path.join('scripts','output', `${safe}_extracted_normalized.html`);
    if (!fs.existsSync(file)) {
      console.warn('Normalized file missing for', u, file);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    try {
      // Try exact match first
      const { data: rows, error } = await sb.from('automation_posts').select('id, url').eq('url', u).limit(1).maybeSingle();
      if (error) {
        console.error('Supabase select error for', u, error.message || error);
        continue;
      }
      let id = null;
      if (rows && rows.id) {
        id = rows.id;
      } else {
        // try ilike search for slug portion
        const slug = u.split('/').pop();
        const pattern = `%/themes/%${slug}%`;
        const { data: byUrl } = await sb.from('automation_posts').select('id, url').ilike('url', `*${slug}*`).limit(1).maybeSingle();
        if (byUrl && byUrl.id) id = byUrl.id;
      }
      if (!id) {
        console.warn('No automation_posts row found for', u);
        continue;
      }
      const { error: upErr } = await sb.from('automation_posts').update({ content: content, updated_at: new Date().toISOString() }).eq('id', id);
      if (upErr) {
        console.error('Failed to update post', id, upErr.message || upErr);
      } else {
        console.log('Updated post', id, 'for', u);
      }
    } catch (e) {
      console.error('Error processing', u, e && e.message ? e.message : e);
    }
  }
  process.exit(0);
})();
