/*
Reformat all automation_posts: fix broken titles and normalize content paragraphs/headings.
Usage:
  node scripts/reformat-automation-posts.mjs [--dry] [--limit N] [--offset N] [--domain example.com]
Environment: VITE_SUPABASE_URL or SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
*/

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  console.error('Missing Supabase env (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

// -------- Formatting helpers (ported from supabase/functions/_shared/format-post.ts) --------
const SMALL_WORDS = new Set(['a','an','and','as','at','but','by','for','in','nor','of','on','or','per','the','to','vs','via','with']);
function titleCase(input) {
  const words = String(input || '').trim().split(/\s+/);
  if (!words.length) return '';
  return words.map((w, i) => {
    if (/^[A-Z0-9]{2,}$/.test(w) || /[A-Z].*[A-Z]/.test(w.slice(1))) return w;
    const lower = w.toLowerCase();
    if (i !== 0 && i !== words.length - 1 && SMALL_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}
function sanitize(html) {
  let out = String(html || '');
  out = out.replace(/<\s*(script|style|iframe)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
  out = out.replace(/ on[a-z]+="[^"]*"/gi, '');
  out = out.replace(/ javascript:/gi, '');
  return out;
}
function ensureLinkRel(html) {
  return String(html || '').replace(/<a\b([^>]*href=\"https?:[^\"]*\"[^>]*)>/gi, (_m, attrs) => {
    if (/\brel=/.test(attrs)) { attrs = attrs.replace(/\brel\s*=\s*(["'])([^"']*)\1/i, (_m2, q, val) => { const filtered = String(val || '') .split(/\s+/) .filter((t) => !/^(nofollow|ugc)$/i.test(t)) .join(' ') .trim(); return `rel="${filtered || 'noopener'}"`; }); return `<a${attrs}>`; }
    return `<a${attrs} rel="noopener">`;
  });
}
function normalizeUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/[\S]*)?$/i.test(s)) return `https://${s}`;
  return s;
}
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeHtmlExceptBasic(s) { return escapeHtml(s).replace(/&lt;(\/?(?:strong|em|b))&gt;/g, '<$1>'); }
function decodeEntities(s) { return String(s).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'); }

function addBlogClasses(html) {
  let out = String(html || '');
  out = out.replace(/<h1([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<h1${attrs}>`; return `<h1 class="text-2xl font-bold text-gray-900 mb-4"${attrs}>`; });
  out = out.replace(/<h2([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<h2${attrs}>`; return `<h2 class="text-xl font-bold text-gray-900 mb-3"${attrs}>`; });
  out = out.replace(/<h3([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<h3${attrs}>`; return `<h3 class="text-lg font-semibold text-gray-900 mb-2"${attrs}>`; });
  out = out.replace(/<strong([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<strong${attrs}>`; return `<strong class="font-bold text-gray-900"${attrs}>`; });
  out = out.replace(/<em([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<em${attrs}>`; return `<em class="italic text-gray-800"${attrs}>`; });
  out = out.replace(/<a\b([^>]*)>/gi, (m, attrs) => { if (/\bclass=/.test(attrs)) return `<a${attrs}>`; const target = /target=/.test(attrs) ? '' : ' target="_blank" rel="noopener noreferrer"'; return `<a class="text-blue-600 hover:text-blue-800 font-semibold"${attrs}${target}>`; });
  return out;
}
function enhanceImages(html) {
  return String(html || '').replace(/<img\b([^>]*)>/gi, (_m, attrs) => {
    let a = attrs || '';
    if (!/\bloading=/.test(a)) a += ' loading="lazy"';
    if (!/\bdecoding=/.test(a)) a += ' decoding="async"';
    if (!/\breferrerpolicy=/.test(a)) a += ' referrerpolicy="no-referrer"';
    if (!/\bsizes=/.test(a)) a += ' sizes="(max-width: 920px) 100vw, 920px"';
    return `<img${a}>`;
  });
}
function linkifyMarkdown(s) {
  return String(s || '').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const href = normalizeUrl(url);
    const safeText = escapeHtml(text.trim());
    const safeHref = escapeHtml(href);
    return `<a href="${safeHref}" rel="noopener">${safeText}</a>`;
  });
}
function linkifyBareUrls(s) {
  return String(s || '').replace(/(^|[^\w\"'=])(https?:\/\/[\w.-]+(?:\/[\w\-._~:\/?#\[\]@!$&'()*+,;=%]*)?)/gi, (_m, pre, url) => {
    return `${pre}<a href="${escapeHtml(url)}" rel="noopener">${escapeHtml(url)}</a>`;
  });
}
function formatInline(s) {
  let src = String(s || '');
  // Preserve existing <a> tags
  const anchorMap = {}; let i = 0;
  src = src.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, (m, inner) => {
    const hrefMatch = m.match(/href=\"([^\"]+)\"/i); const hrefRaw = hrefMatch ? hrefMatch[1] : '';
    const href = normalizeUrl(hrefRaw);
    if (!/^https?:\/\//i.test(href)) return inner;
    const text = stripTags(inner).trim() || href;
    const safe = `<a href="${escapeHtml(href)}" rel="noopener">${escapeHtml(text)}</a>`;
    const token = `__ANCHOR_${i++}__`; anchorMap[token] = safe; return token;
  });
  let out = src.replace(/\b([A-Za-z][A-Za-z\s&,.-]+?):\*\*/g, '<strong>$1:</strong>')
               .replace(/^([A-Za-z][^:\n]*?):\*\*/gm, '<strong>$1:</strong>');
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
  out = escapeHtmlExceptBasic(out);
  out = linkifyMarkdown(out);
  out = linkifyBareUrls(out);
  out = out.replace(/__ANCHOR_\d+__/g, (t) => anchorMap[t] || t);
  out = out.replace(/^\*\*\s*/gm,'').replace(/\s*\*\*$/gm,'').replace(/>\s*\*\*\s*</g,'><');
  return out;
}
function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
function normalizeForCompare(s) {
  return stripTags(String(s || '')).replace(/[\*_'`~\"“”’‘:]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
}
function parseSectionsFromPlain(text) {
  const lines = String(text || '').replace(/\r\n?/g,'\n').split('\n').map(l=>l.trim()).filter(l=>l.length);
  const html = []; let i=0;
  while (i < lines.length) {
    const line = lines[i];
    const hash = line.match(/^#{1,6}\s+(.+)$/);
    if (hash) { html.push(`<p><strong>${formatInline(hash[1].trim())}</strong></p>`); i++; continue; }
    const hMatch = line.match(/^\*\*([^*]+)\*\*:?:?\s*$/);
    if (hMatch && !/^title\s*:/i.test(hMatch[1])) { html.push(`<h2>${escapeHtml(hMatch[1].trim())}</h2>`); i++; continue; }
    if (/^\d+\.\s+/.test(line)) { const items=[]; while (i<lines.length && /^\d+\.\s+/.test(lines[i])){ const item = lines[i].replace(/^\d+\.\s+/, ''); items.push(`<li>${formatInline(item)}</li>`); i++; } html.push(`<ol>${items.join('')}</ol>`); continue; }
    if (/^(?:-|•|\*)\s+/.test(line)) { const items=[]; while (i<lines.length && /^(?:-|•|\*)\s+/.test(lines[i])){ const item = lines[i].replace(/^(?:-|•|\*)\s+/, ''); items.push(`<li>${formatInline(item)}</li>`); i++; } html.push(`<ul>${items.join('')}</ul>`); continue; }
    const p = formatInline(line); html.push(`<p>${p}</p>`); i++;
  }
  return html.join('\n');
}
function buildArticleHtml(title, bodyHtml) { return `<article>\n  <h1>${escapeHtml(title)}</h1>\n  <div class="beautiful-blog-content beautiful-prose">\n  ${bodyHtml}\n  </div>\n</article>`; }
function extractTitleFromContent(raw) {
  if (!raw) return '';
  const source = decodeEntities(String(raw));
  const h1 = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i); if (h1) return stripTags(h1[1]).trim();
  const t1 = source.match(/\*\*\s*Title\s*:\s*([\s\S]*?)\*\*/i); if (t1) return t1[1].trim();
  const forbidden = /(\bfigure\b|\bclass\b|\bitemscope\b|\bitemtype\b|schema\.org|\bimageobject\b|\bcontenturl\b|\bwidth\b|\bheight\b|\bauthor\b|\bcaption\b|\bfeatured\b|\bimg\b|\bmeta\b)/i;
  const candidates = source.split(/\n|\.|!|\?/)
    .map(s => stripTags(s).replace(/\bhttps?:\/\/[\S]+/gi, '').replace(/\s{2,}/g,' ').trim())
    .filter(s => s.length > 10 && /[a-z]/i.test(s) && s.split(/\s+/).length >= 3 && !forbidden.test(s));
  const first = candidates[0] || '';
  return first.slice(0, 120);
}
function ensureParagraphs(html) {
  if (/<p\b/i.test(String(html || ''))) return html;
  let parts = String(html || '').split(/\r?\n\r?\n+/); if (parts.length <= 1) parts = String(html || '').split(/\r?\n+/);
  const out = parts.map(seg => {
    const s = seg.trim(); if (!s) return '';
    if (/^<\s*(h\d|ul|ol|li|figure|img|blockquote|section|article|table|div)\b/i.test(s)) return s;
    return `<p>${formatInline(s)}</p>`;
  }).filter(Boolean).join('\n');
  return out;
}
function normalizeContent(currentTitle, content) {
  let raw = String(content || '').trim();
  raw = raw.replace(/```[\s\S]*?```/g, '');
  raw = raw.replace(/(^|\n)\s*(HTML\s*Output|Clean\s*HTML\s*Output|HTML\s*Version)\s*:?[\t ]*[\s\S]*$/i, '');
  raw = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');
  const hasPlainMarkers = /(^|\n)\s*(?:\*\*\s*)?title\s*[:\-]/i.test(raw) || /\*\*[\s\S]*?\*\*/.test(raw);
  const firstHtmlIdx = raw.search(/<h2\b|<p\b|<ul\b|<ol\b|<section\b|<article\b/i);
  if (hasPlainMarkers && firstHtmlIdx !== -1) raw = raw.slice(firstHtmlIdx);
  let title = extractTitleFromContent(raw) || currentTitle || ''; title = titleCase(title);
  if (/<[a-z][\s\S]*>/i.test(raw)) {
    let html = raw;
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>').replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/<p>\s*<strong>([^<:]+)\s*:?<\/strong>\s*<\/p>/gi, (_m,g1)=>`<h2>${g1.trim()}</h2>`);
    html = html.replace(/<p>\s*<strong>\s*Title\s*:\s*<\/strong>\s*[^<]*<\/p>/gi, '');
    html = html.replace(/<h1[\s\S]*?<\/h1>/gi, '');
    html = html
      .replace(/<p[^>]*>\s*###\s+([\s\S]*?)<\/p>/gi, '<h3>$1</h3>')
      .replace(/<p[^>]*>\s*##\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>')
      .replace(/<p[^>]*>\s*#\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>')
      .replace(/<h1[^>]*>\s*#\s+([\s\S]*?)<\/h1>/gi, '<h1>$1</h1>')
      .replace(/<h2[^>]*>\s*##\s+([\s\S]*?)<\/h2>/gi, '<h2>$1</h2>')
      .replace(/<h3[^>]*>\s*###\s+([\s\S]*?)<\/h3>/gi, '<h3>$1</h3>');
    const articleBlocks = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi);
    if (articleBlocks && articleBlocks.length > 1) html = articleBlocks[articleBlocks.length - 1];
    html = html.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');
    const firstP = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (firstP) { const firstText = stripTags(firstP[1]).trim(); if (normalizeForCompare(firstText) === normalizeForCompare(title)) { html = html.replace(firstP[0], ''); } }
    html = html.replace(/\*\*([^<>\n]+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^*])\*([^<>\n]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');
    const cleaned = sanitize(html);
    const withParagraphs = ensureParagraphs(cleaned);
    const enhanced = enhanceImages(withParagraphs);
    let article = buildArticleHtml(title, enhanced);
    article = linkifyMarkdown(article);
    article = linkifyBareUrls(article);
    article = addBlogClasses(article);
    return ensureLinkRel(sanitize(article));
  }
  let bodySource = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');
  const lines = bodySource.replace(/\r\n?/g,'\n').split('\n');
  const firstIdx = lines.findIndex(l => l.trim().length > 0);
  if (firstIdx !== -1) { const firstLine = lines[firstIdx]; const titleNorm = titleCase(title); if (normalizeForCompare(firstLine) === normalizeForCompare(titleNorm)) { lines.splice(firstIdx, 1); bodySource = lines.join('\n'); } }
  const bodyHtml = parseSectionsFromPlain(bodySource);
  let article = buildArticleHtml(title, bodyHtml);
  article = linkifyMarkdown(article);
  article = linkifyBareUrls(article);
  article = addBlogClasses(article);
    return ensureLinkRel(sanitize(article));
}

function isBrokenTitle(t) {
  const s = String(t || '').trim();
  if (!s) return true;
  return /<|>|itemscope|itemtype|schema|figure|class=|https?:\/\//i.test(s);
}

async function fetchBatch(offset, limit, domainId) {
  const base = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts`;
  const params = new URLSearchParams();
  params.set('select', 'id,title,content,slug,url,domain_id');
  params.set('order', 'created_at.asc');
  params.set('offset', String(offset));
  params.set('limit', String(limit));
  if (domainId) params.set('domain_id', `eq.${domainId}`);
  const url = `${base}?${params.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch batch failed ${res.status}`);
  return res.json();
}

async function updatePost(row, newTitle, newContent) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?id=eq.${encodeURIComponent(row.id)}`;
  const body = { updated_at: new Date().toISOString() };
  if (newContent && newContent !== row.content) body.content = newContent;
  if (newTitle && newTitle !== row.title) body.title = newTitle;
  if (Object.keys(body).length === 1) return false;
  const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const t = await res.text().catch(()=> '');
    throw new Error(`Update ${row.id} failed: ${res.status} ${t}`);
  }
  return true;
}

async function run() {
  const args = process.argv.slice(2);
  const DRY = args.includes('--dry');
  const limitArg = Number((args.find(a=>a.startsWith('--limit='))||'').split('=')[1]) || null;
  const offsetArg = Number((args.find(a=>a.startsWith('--offset='))||'').split('=')[1]) || 0;
  const domainFilter = (args.find(a=>a.startsWith('--domain='))||'').split('=')[1] || null; // expects domain name

  let domainId = null;
  if (domainFilter) {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/domains?select=id,domain&domain=eq.${encodeURIComponent(domainFilter)}`;
    const r = await fetch(url, { headers });
    const rows = await r.json();
    domainId = rows?.[0]?.id || null;
    if (!domainId) { console.error('Domain not found:', domainFilter); process.exit(2); }
  }

  const pageSize = limitArg || 200;
  let offset = offsetArg;
  let total = 0; let updated = 0; let batch = 0;

  console.log('Starting reformat job', { DRY, pageSize, offset, domainId });

  while (true) {
    batch++;
    const rows = await fetchBatch(offset, pageSize, domainId);
    if (!rows.length) break;
    total += rows.length;

    // Prepare tasks
    const tasks = rows.map(row => ({ row }));

    // Process with small concurrency
    const conc = 5; let idx = 0; const active = [];
    const next = async () => {
      if (idx >= tasks.length) return;
      const t = tasks[idx++];
      await (async () => {
        const norm = normalizeContent(t.row.title || '', t.row.content || '');
        const computedTitle = titleCase(extractTitleFromContent(norm) || t.row.title || '');
        const change = isBrokenTitle(t.row.title) || norm !== t.row.content || computedTitle !== t.row.title;
        if (change) {
          if (!DRY) {
            const did = await updatePost(t.row, computedTitle, norm).catch(e => { console.warn('Update failed', t.row.id, e.message || e); return false; });
            if (did) updated++;
          } else {
            updated++;
          }
        }
      })();
      await Promise.resolve();
      if (idx < tasks.length) return next();
    };
    for (let i=0;i<conc;i++) active.push(next());
    await Promise.all(active);

    console.log(`Batch ${batch}: processed=${rows.length}, updated~=${updated}`);
    offset += pageSize;
  }

  console.log(`Reformat complete. scanned=${total}, updated=${updated}, dry=${DRY}`);
}

run().catch(err => { console.error('Reformat job failed:', err); process.exit(1); });
