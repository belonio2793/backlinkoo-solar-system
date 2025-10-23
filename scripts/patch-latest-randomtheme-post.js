import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const FUNCS_BASE = (process.env.VITE_NETLIFY_FUNCTIONS_URL || process.env.NETLIFY_FUNCTIONS_URL || '').replace(/\/$/, '');

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function findLatestRandomPost() {
  try {
    let q = sb.from('automation_posts')
      .select('id,title,content,url,blog_theme,created_at')
      .in('blog_theme', ['random-ai-generated','random'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    let { data, error } = await q;
    if (error && String(error.message || '').toLowerCase().includes('column')) {
      ({ data, error } = await sb.from('automation_posts')
        .select('id,title,content,url,created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle());
    }
    if (error) throw error;
    return data || null;
  } catch (e) {
    console.error('Failed to query latest random post:', e.message || e);
    return null;
  }
}

function createSeededRng(seedStr) {
  const hash = crypto.createHash('sha256').update(seedStr).digest();
  let a = hash.readUInt32LE(0);
  let b = hash.readUInt32LE(4);
  let c = hash.readUInt32LE(8);
  let d = hash.readUInt32LE(12);
  return function random() {
    let t = a ^ (a << 11);
    a = b; b = c; c = d; d = (d ^ (d >>> 19)) ^ (t ^ (t >>> 8));
    return (d >>> 0) / 4294967296;
  };
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

function generatePalette(rng) {
  const palettes = [
    { primary: '#1f6feb', secondary: '#0ea5a4', bg: '#ffffff', text: '#0f172a' },
    { primary: '#7c3aed', secondary: '#f97316', bg: '#ffffff', text: '#0b1226' },
    { primary: '#ef4444', secondary: '#f59e0b', bg: '#fffaf0', text: '#1f2937' },
    { primary: '#0ea5a4', secondary: '#2563eb', bg: '#f8fafc', text: '#0b1226' },
    { primary: '#10b981', secondary: '#06b6d4', bg: '#ffffff', text: '#042029' },
    { primary: '#111827', secondary: '#6b7280', bg: '#fff', text: '#0b1226' },
    { primary: '#a78bfa', secondary: '#f472b6', bg: '#fff7fb', text: '#1f1f2e' },
    { primary: '#334155', secondary: '#64748b', bg: '#ffffff', text: '#0b1226' },
  ];
  return pick(palettes, rng);
}

function generateTypography(rng) {
  const fontPairs = [
    { heading: 'Playfair Display', body: 'Inter' },
    { heading: 'Merriweather', body: 'Roboto' },
    { heading: 'Lora', body: 'Inter' },
    { heading: 'Domine', body: 'Source Sans Pro' },
    { heading: 'Poppins', body: 'Inter' },
    { heading: 'Georgia', body: 'System UI' },
    { heading: 'Libre Baskerville', body: 'Inter' },
    { heading: 'Montserrat', body: 'Roboto' },
  ];
  return pick(fontPairs, rng);
}

function generateLayoutParams(rng) {
  const density = pick(['cozy', 'balanced', 'airy'], rng);
  const maxWidth = pick(['680px', '720px', '820px', '900px'], rng);
  const borderRadius = pick(['4px', '6px', '8px', '12px'], rng);
  const cardShadow = pick(['none', '0 6px 18px rgba(15,23,42,0.06)', '0 8px 30px rgba(15,23,42,0.08)'], rng);
  return { density, maxWidth, borderRadius, cardShadow };
}

function shade(hex, amt) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

function getDesignParams(rng) {
  const palette = generatePalette(rng);
  const fonts = generateTypography(rng);
  const layout = generateLayoutParams(rng);
  return { palette, fonts, layout };
}

function getGoogleFontsHref(fonts) {
  if (!fonts || (!fonts.heading && !fonts.body)) return '';
  function fam(s) { return encodeURIComponent(String(s).replace(/\s+/g, '+')); }
  const families = [];
  if (fonts.heading) families.push(`${fam(fonts.heading)}:wght@400;700`);
  if (fonts.body && fonts.body !== fonts.heading) families.push(`${fam(fonts.body)}:wght@400;600`);
  if (!families.length) return '';
  return `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;
}

function generateCssFromParams({ postId, seed, palette, fonts, layout }) {
  const accent = shade(palette.primary, -10);
  const muted = shade(palette.secondary, 40);
  return `/* Random Theme for post ${postId} (seed: ${seed}) */\n:root{\n  --rtheme-primary: ${palette.primary};\n  --rtheme-secondary: ${palette.secondary};\n  --rtheme-accent: ${accent};\n  --rtheme-muted: ${muted};\n  --rtheme-bg: ${palette.bg};\n  --rtheme-text: ${palette.text};\n  --rtheme-max-width: ${layout.maxWidth};\n  --rtheme-radius: ${layout.borderRadius};\n}\n\n/* Base layout */\nbody.article-post, .post-article {\n  background: var(--rtheme-bg);\n  color: var(--rtheme-text);\n  font-family: '${fonts.body}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;\n  line-height: 1.65;\n}\n\narticle.post, .post-article {\n  max-width: var(--rtheme-max-width);\n  margin: 0 auto;\n  padding: ${layout.density === 'airy' ? '3rem' : layout.density === 'cozy' ? '1rem' : '2rem'};\n}\n\n/* Headings */\nh1, h2, h3 {\n  font-family: '${fonts.heading}', Georgia, 'Times New Roman', serif;\n  color: var(--rtheme-primary);\n  margin-top: 1.2em;\n  margin-bottom: 0.5em;\n  line-height: 1.15;\n}\n\nh1 { font-size: 2.25rem; }\nh2 { font-size: 1.6rem; }\nh3 { font-size: 1.2rem; }\n\n/* Links */\na { color: var(--rtheme-secondary); text-decoration: underline; }\na:hover { color: var(--rtheme-accent); }\n\n/* Images */\n.post-article img, article.post img { max-width: 100%; border-radius: calc(var(--rtheme-radius)); box-shadow: ${layout.cardShadow}; }\n\n/* Blockquote */\nblockquote { border-left: 4px solid var(--rtheme-primary); padding-left: 1rem; color: var(--rtheme-muted); font-style: italic; }\n\n/* Code blocks */\npre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace; background: rgba(0,0,0,0.03); padding: 0.25rem 0.5rem; border-radius: 6px; }\n\n/* Lists */\nul, ol { margin-left: 1.2rem; }\n\n/* Cards */\n.post-card { border-radius: calc(var(--rtheme-radius)); box-shadow: ${layout.cardShadow}; background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); padding: 1rem; }\n\n/* Subtle decorative gradient header */\n.post-hero { border-radius: calc(var(--rtheme-radius)); padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02)); margin-bottom: 1.2rem; }\n\n/* Small utilities */\n.meta { color: var(--rtheme-muted); font-size: 0.9rem; }\n.small { font-size: 0.9rem; color: var(--rtheme-muted); }\n\n/* Responsive tweaks */\n@media (max-width: 640px) {\n  article.post, .post-article { padding: 1rem; }\n  h1 { font-size: 1.6rem; }\n}\n\n/* End of generated theme */\n`;
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

async function uploadToStorage(path, content, contentType) {
  const { error } = await sb.storage.from('themes').upload(path, typeof content === 'string' ? Buffer.from(content) : content, {
    contentType,
    upsert: true,
    cacheControl: '3600',
  });
  if (error) throw error;
  return `${String(SUPABASE_URL).replace(/\/$/, '')}/storage/v1/object/public/themes/${path}`;
}

async function patchViaFunction(post) {
  const fnBase = /\/\.netlify\/functions\/?$/.test(FUNCS_BASE) ? FUNCS_BASE : `${FUNCS_BASE}/.netlify/functions`;
  const fnUrl = FUNCS_BASE ? `${fnBase.replace(/\/$/, '')}/randomthemeAutomation` : '';
  if (!fnUrl) return null;
  const payload = { postId: post.id, title: post.title, contentHtml: post.content, url: post.url, persist: true };
  const res = await fetch(fnUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
  if (!res || !res.ok) return null;
  const j = await res.json().catch(() => null);
  return j || null;
}

async function patchDirect(post) {
  const seed = crypto.randomBytes(8).toString('hex');
  const rng = createSeededRng(`${post.id}-${seed}`);
  const params = getDesignParams(rng);
  const css = generateCssFromParams({ postId: post.id, seed, ...params });
  const fontsHref = getGoogleFontsHref(params.fonts);
  const safeTitle = (post.title && String(post.title)) || `Preview for ${post.id}`;
  const linkUrl = (post.url && String(post.url)) || `https://${post.id}`;
  const bodyHtml = post.content && String(post.content).trim().length > 0 ? post.content : (
    `<article class="post post-article">
      <div class="post-hero">
        <h1>${escapeHtml(safeTitle)}</h1>
        <div class="meta">Random AI Generated Theme • Seed ${seed}</div>
      </div>
      <p>This is a preview post generated for <strong>${escapeHtml(post.id)}</strong>.</p>
      <p>Visit <a href="${escapeHtml(linkUrl)}" rel="noopener">${escapeHtml(linkUrl)}</a></p>
    </article>`
  );
  const htmlDoc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(safeTitle)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontsHref ? `<link rel="stylesheet" href="${fontsHref}">` : ''}
<link rel="stylesheet" href="style.css">
<style id="rtheme-inline-fallback">${css}</style>
</head>
<body class="article-post">
${bodyHtml}
</body>
</html>`;

  const base = `random/${encodeURIComponent(post.id)}`;
  const cssPath = `${base}/style.css`;
  const htmlPath = `${base}/post.html`;

  const cssStorageUrl = await uploadToStorage(cssPath, css, 'text/css; charset=utf-8');
  const htmlStorageUrl = await uploadToStorage(htmlPath, htmlDoc, 'text/html; charset=utf-8');
  const indexHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(safeTitle)}</title></head><body style="margin:0"><iframe src="./${encodeURIComponent(post.id)}/post.html" style="border:0;width:100%;height:100vh"></iframe></body></html>`;
  await uploadToStorage('random/index.html', indexHtml, 'text/html; charset=utf-8');

  return { cssUrl: cssStorageUrl, htmlUrl: htmlStorageUrl, cssStorageUrl };
}

async function persistUrls(post, urls) {
  try {
    const updateAll = { ...(urls.cssUrl ? { css_url: urls.cssUrl } : {}), ...(urls.htmlUrl ? { html_url: urls.htmlUrl } : {}), ...(urls.cssStorageUrl ? { css_storage_url: urls.cssStorageUrl } : {}) };
    const up = await sb.from('automation_posts').update(updateAll).eq('id', post.id);
    if (up.error) {
      if (urls.cssUrl) await sb.from('automation_posts').update({ css_url: urls.cssUrl }).eq('id', post.id);
    }
  } catch (e) {
    console.warn('Failed updating automation_posts with theme URLs:', e.message || e);
  }
}

(async function main() {
  const post = await findLatestRandomPost();
  if (!post) {
    console.error('No post found to patch. Ensure you have automation_posts entries.');
    process.exit(1);
  }
  console.log('Patching latest post:', { id: post.id, title: post.title, url: post.url });
  let out = await patchViaFunction(post);
  if (!out) {
    console.log('Netlify function unavailable, patching directly via Supabase storage...');
    out = await patchDirect(post);
  }
  await persistUrls(post, out);
  console.log('Patched. URLs:', out);
  console.log('Preview:', `${SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/themes/random/index.html?v=${Date.now()}`);
})();
