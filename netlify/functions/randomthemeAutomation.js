/* Netlify Function: randomthemeAutomation

   - POST /.netlify/functions/randomthemeAutomation
     Body: { postId: string, title?: string, contentHtml?: string, url?: string, persist?: boolean }
     Returns:
       - If persist is falsy: { cssUrl, seed }
       - If persist is true:  { cssUrl, seed, htmlUrl, cssStorageUrl }

   - GET  /.netlify/functions/randomthemeAutomation?postId=...&seed=...
     Returns: CSS (Content-Type: text/css) generated deterministically from postId+seed

   When persist=true, the generated CSS and a minimal post.html are uploaded to Supabase Storage:
     themes/random/{postId}/style.css and themes/random/{postId}/post.html
     Also refreshes themes/random/index.html to preview the latest post.

   Typical integration: after publishing a post, call POST with persist:true and save htmlUrl/cssStorageUrl/cssUrl on the post.
*/

import crypto from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    if (event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { postId, title, contentHtml, url, persist } = body;
      if (!postId) return jsonResponse(400, { error: 'postId required' });

      // generate a random seed (use crypto for stronger randomness)
      const seed = crypto.randomBytes(8).toString('hex');

      // css URL (served by this function with deterministic seed)
      const cssUrl = `/.netlify/functions/randomthemeAutomation?postId=${encodeURIComponent(postId)}&seed=${seed}`;

      if (!persist) {
        return jsonResponse(200, { cssUrl, seed });
      }

      // Persist CSS and HTML to Supabase Storage
      const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
      if (!SUPABASE_URL || !SERVICE_ROLE) {
        return jsonResponse(500, { error: 'Supabase service role not configured', cssUrl, seed });
      }

      // Build deterministic CSS now for storage copy too
      const rng = createSeededRng(`${postId}-${seed}`);
      const params = getDesignParams(rng);
      const css = generateCssFromParams({ postId, seed, ...params });

      const safeTitle = (title && String(title)) || `Preview for ${postId}`;
      const linkUrl = (url && String(url)) || `https://${postId}`;
      const bodyHtml = contentHtml && String(contentHtml).trim().length > 0 ? contentHtml : (
        `<article class="post post-article">
          <div class="post-hero">
            <h1>${escapeHtml(safeTitle)}</h1>
            <div class="meta">Random AI Generated Theme • Seed ${seed}</div>
          </div>
          <p>This is a preview post generated for <strong>${escapeHtml(postId)}</strong>. Every generation produces a unique, consistent theme.</p>
          <p>Visit <a href="${escapeHtml(linkUrl)}" rel="noopener">${escapeHtml(linkUrl)}</a></p>
        </article>`
      );

      const googleFontsHref = getGoogleFontsHref(params.fonts);

      const htmlDoc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(safeTitle)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${googleFontsHref ? `<link rel="stylesheet" href="${googleFontsHref}">` : ''}
<link rel="stylesheet" href="style.css">
<style id="rtheme-inline-fallback">${css}</style>
</head>
<body class="article-post">
${bodyHtml}
</body>
</html>`;

      const basePath = `random/${encodeURIComponent(postId)}`;
      const cssPath = `${basePath}/style.css`;
      const htmlPath = `${basePath}/post.html`;

      async function putObject(path, content, contentType) {
        const uploadUrl = `${String(SUPABASE_URL).replace(/\/$/, '')}/storage/v1/object/themes/${path}`;
        const res = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            apikey: SERVICE_ROLE,
            Authorization: `Bearer ${SERVICE_ROLE}`,
            'Content-Type': contentType,
            'x-upsert': 'true'
          },
          body: content
        });
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          throw new Error(`Upload failed ${res.status}: ${t}`);
        }
        return `${String(SUPABASE_URL).replace(/\/$/, '')}/storage/v1/object/public/themes/${path}`;
      }

      const cssStorageUrl = await putObject(cssPath, css, 'text/css');
      const htmlStorageUrl = await putObject(htmlPath, htmlDoc, 'text/html');

      // Also update a top-level random/index.html preview
      try {
        const previewHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(safeTitle)}</title></head><body style="margin:0;padding:0"><iframe src="./${encodeURIComponent(postId)}/post.html" style="border:0;width:100%;height:100vh"></iframe></body></html>`;
        await putObject('random/index.html', previewHtml, 'text/html');
      } catch (e) {
        console.warn('Failed updating random/index.html preview', e);
      }

      return jsonResponse(200, { cssUrl, seed, htmlUrl: htmlStorageUrl, cssStorageUrl });
    }

    if (event.httpMethod === 'GET') {
      const qp = event.queryStringParameters || {};
      const postId = qp.postId || qp.id || 'unknown';
      const seed = qp.seed || 'default';

      // Build deterministic pseudo-random generator from seed+postId
      const rng = createSeededRng(`${postId}-${seed}`);

      const css = generateControlledRandomCss({ postId, seed, rng });

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        body: css,
      };
    }

    return jsonResponse(405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('randomthemeAutomation error', err);
    return jsonResponse(500, { error: err.message || String(err) });
  }
}

/* ------------------ Helpers ------------------ */
function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function createSeededRng(seedStr) {
  // Simple xorshift-like generator seeded from hash of seedStr
  const hash = crypto.createHash('sha256').update(seedStr).digest();
  let a = hash.readUInt32LE(0);
  let b = hash.readUInt32LE(4);
  let c = hash.readUInt32LE(8);
  let d = hash.readUInt32LE(12);

  return function random() {
    // xorshift128
    let t = a ^ (a << 11);
    a = b; b = c; c = d; d = (d ^ (d >>> 19)) ^ (t ^ (t >>> 8));
    // normalize to [0,1)
    return (d >>> 0) / 4294967296;
  };
}

function pick(array, rng) {
  return array[Math.floor(rng() * array.length)];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
}

function generatePalette(rng) {
  // curated palettes (kept accessible and tested)
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
  // safe Google font pairs (heading, body) — instruct integrator to preload whichever they want
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

function getDesignParams(rng) {
  const palette = generatePalette(rng);
  const fonts = generateTypography(rng);
  const layout = generateLayoutParams(rng);
  return { palette, fonts, layout };
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

function generateCssFromParams({ postId, seed, palette, fonts, layout }) {
  const accent = shade(palette.primary, -10);
  const muted = shade(palette.secondary, 40);
  return `/* Random Theme for post ${postId} (seed: ${seed}) */
:root{
  --rtheme-primary: ${palette.primary};
  --rtheme-secondary: ${palette.secondary};
  --rtheme-accent: ${accent};
  --rtheme-muted: ${muted};
  --rtheme-bg: ${palette.bg};
  --rtheme-text: ${palette.text};
  --rtheme-max-width: ${layout.maxWidth};
  --rtheme-radius: ${layout.borderRadius};
}

/* Base layout */
body.article-post, .post-article {
  background: var(--rtheme-bg);
  color: var(--rtheme-text);
  font-family: '${fonts.body}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  line-height: 1.65;
}

article.post, .post-article {
  max-width: var(--rtheme-max-width);
  margin: 0 auto;
  padding: ${layout.density === 'airy' ? '3rem' : layout.density === 'cozy' ? '1rem' : '2rem'};
}

/* Headings */
h1, h2, h3 {
  font-family: '${fonts.heading}', Georgia, 'Times New Roman', serif;
  color: var(--rtheme-primary);
  margin-top: 1.2em;
  margin-bottom: 0.5em;
  line-height: 1.15;
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.6rem; }
h3 { font-size: 1.2rem; }

/* Links */
a { color: var(--rtheme-secondary); text-decoration: underline; }
a:hover { color: var(--rtheme-accent); }

/* Images */
.post-article img, article.post img { max-width: 100%; border-radius: calc(var(--rtheme-radius)); box-shadow: ${layout.cardShadow}; }

/* Blockquote */
blockquote { border-left: 4px solid var(--rtheme-primary); padding-left: 1rem; color: var(--rtheme-muted); font-style: italic; }

/* Code blocks */
pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace; background: rgba(0,0,0,0.03); padding: 0.25rem 0.5rem; border-radius: 6px; }

/* Lists */
ul, ol { margin-left: 1.2rem; }

/* Cards */
.post-card { border-radius: calc(var(--rtheme-radius)); box-shadow: ${layout.cardShadow}; background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); padding: 1rem; }

/* Subtle decorative gradient header */
.post-hero { border-radius: calc(var(--rtheme-radius)); padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02)); margin-bottom: 1.2rem; }

/* Small utilities */
.meta { color: var(--rtheme-muted); font-size: 0.9rem; }
.small { font-size: 0.9rem; color: var(--rtheme-muted); }

/* Responsive tweaks */
@media (max-width: 640px) {
  article.post, .post-article { padding: 1rem; }
  h1 { font-size: 1.6rem; }
}

/* End of generated theme */
`;
}

function generateControlledRandomCss({ postId, seed, rng }) {
  const { palette, fonts, layout } = getDesignParams(rng);
  return generateCssFromParams({ postId, seed, palette, fonts, layout });
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
