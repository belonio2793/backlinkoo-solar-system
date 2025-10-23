/*
Beautiful, safe formatter for automation_posts
- Uses node-html-parser to fix broken tags
- Normalizes structure (headings, lists, wrappers)
- Adds consistent attrs for links + images
- Cleans junk (empty p, excess br, nested wrappers)
- Idempotent: can run multiple times without mangling

Run: npm run posts:beautify
*/

import { parse } from 'node-html-parser';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and a key.');
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

function safeBeautify(content = '') {
  let html = String(content || '').trim();
  if (!html) return html;

  // Remove noisy tokens like **unified** and unescape simple encoded tags
  html = html.replace(/\*\*\s*unified\s*\*\*/gi, '').replace(/&lt;(\/?)(strong|em|a|h[1-6])&gt;/gi, '<$1$2>');

  // helper to decode basic html entities used inside attributes
  function decodeEntities(s) { return String(s || '').replace(/&quot;|&apos;/g, '"').replace(/&amp;/g, '&'); }

  // Parse into DOM
  const root = parse(html, { blockTextElements: { script: false, style: false } });

  // --- Fix wrapper ---
  if (!root.querySelector('.beautiful-blog-content')) {
    const wrapper = parse('<div class="beautiful-blog-content beautiful-prose"></div>');
    wrapper.appendChild(root);
    html = wrapper.toString();
  }

  // --- Normalize headings ---
  const h1s = root.querySelectorAll('h1');
  if (h1s.length > 1) {
    h1s.slice(1).forEach(h1 => h1.tagName = 'h2');
  }

  // --- Fix links ---
  root.querySelectorAll('a').forEach(a => {
    const rawHref = a.getAttribute('href') || '';
    const href = decodeEntities(rawHref).replace(/\u201C|\u201D/g, '"').replace(/^\s+|\s+$/g, '').replace(/"+$/g, '');
    let rel = (a.getAttribute('rel') || '').split(/\s+/);
    if (!rel.includes('noopener')) rel.push('noopener');
    a.setAttribute('rel', rel.filter(Boolean).join(' '));
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank');
    }
    // overwrite malformed hrefs with decoded variant
    if (href && href !== rawHref) {
      a.setAttribute('href', href);
    }
  });

  // --- Fix images ---
  root.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // --- Clean empty p + excessive br ---
  root.querySelectorAll('p').forEach(p => {
    if (!p.text.trim() && !p.querySelector('img')) p.remove();
  });
  root.querySelectorAll('br').forEach((br, i, arr) => {
    if (i > 0 && arr[i - 1] && arr[i - 1].tagName === 'BR') br.remove();
  });

  // --- Convert bullet paragraphs into <ul><li> ---
  const paras = root.querySelectorAll('p');
  const ul = parse('<ul></ul>');
  let buffer = [];
  for (const p of paras) {
    const text = p.text.trim();
    if (/^[-•]\s+/.test(text)) {
      buffer.push(parse(`<li>${text.replace(/^[-•]\s+/, '')}</li>`));
      p.remove();
    } else if (buffer.length) {
      buffer.forEach(li => ul.appendChild(li));
      p.insertAdjacentHTML('beforebegin', ul.toString());
      buffer = [];
    }
  }
  if (buffer.length) {
    root.appendChild(ul);
  }

  // --- Remove duplicate wrappers ---
  let finalHtml = root.toString()
    .replace(/(<div class="beautiful-blog-content beautiful-prose">){2,}/g, '$1')
    .replace(/<\/div>\s*<\/div>/g, '</div>');

  return finalHtml.trim();
}

async function fetchBatch(offset, limit) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?select=id,content&order=created_at.asc&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch batch failed ${res.status}`);
  return res.json();
}

async function updatePost(id, content) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?id=eq.${encodeURIComponent(id)}`;
  const body = { content, updated_at: new Date().toISOString() };
  const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Update ${id} failed: ${res.status} ${t}`);
  }
}

async function run() {
  console.log('Starting BEAUTIFUL (parser-based) formatting for automation_posts...');
  const pageSize = 200;
  let offset = 0; let totalUpdated = 0; let batchNum = 0;

  while (true) {
    batchNum++;
    const rows = await fetchBatch(offset, pageSize);
    if (!rows.length) break;

    const tasks = [];
    for (const row of rows) {
      const newContent = safeBeautify(row.content);
      if (newContent && newContent !== row.content) {
        tasks.push({ id: row.id, content: newContent });
      }
    }

    // Concurrency: 5 at a time
    let idx = 0; const conc = 5; let active = [];
    const pushNext = async () => {
      if (idx >= tasks.length) return;
      const t = tasks[idx++];
      const p = updatePost(t.id, t.content).then(() => { totalUpdated++; }).catch(e => { console.warn('Update failed for id', t.id, e.message || e); });
      active.push(p);
      p.finally(() => { active = active.filter(x => x !== p); pushNext(); });
    };
    for (let i=0;i<conc;i++) pushNext();
    await Promise.all(active);

    console.log(`Batch ${batchNum}: processed=${rows.length}, updated=${tasks.length}`);
    offset += pageSize;
  }

  console.log(`BEAUTIFY complete. Total rows updated: ${totalUpdated}`);
}

run().catch(err => { console.error('Beautify job failed:', err); process.exit(1); });
