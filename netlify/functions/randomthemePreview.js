/* Netlify Function: randomthemePreview

GET /.netlify/functions/randomthemePreview?domain=example.com&seed=...

- Fetches a base theme HTML from Supabase Storage (minimal) or domain-specific theme if available.
- Generates a controlled-random CSS using the same generator used by randomthemeAutomation.
- Injects the generated CSS inline into the HTML <head> and returns the HTML.

This enables previewing a unique styled page every time without persisting CSS files.
*/

import crypto from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const qp = event.queryStringParameters || {};
    const domain = qp.domain || qp.dom || qp.d || 'preview-domain';
    const seed = qp.seed || '' + Date.now();

    // Build RNG
    const rng = createSeededRng(`${domain}-${seed}`);

    // Generate CSS and selected fonts
    const params = getDesignParams(rng);
    const css = generateCssFromParams({ postId: domain, seed, ...params });

    // Find base HTML: try domain-specific then minimal
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    const candidates = [domain, 'minimal'];
    let baseHtml = null;

    for (const c of candidates) {
      try {
        const storageUrl = `${String(supabaseUrl).replace(/\/$/, '')}/storage/v1/object/public/themes/${encodeURIComponent(c)}/index.html`;
        const res = await fetch(storageUrl, { headers: { Accept: 'text/html' } });
        if (res.ok) {
          const text = await res.text();
          if (/<!DOCTYPE|<html[\s>]/i.test(text)) { baseHtml = text; break; }
        }
      } catch (e) {
        // ignore and try next
      }
    }

    if (!baseHtml) {
      // fallback simple HTML wrapper
      baseHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${domain}</title></head><body><main><h1>${domain}</h1><p>Preview</p></main></body></html>`;
    }

    // Inject CSS and Google Fonts into head
    let processed = baseHtml;
    const fontsHref = getGoogleFontsHref(params.fonts);
    const inject = `${fontsHref ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel=\"stylesheet\" href=\"${fontsHref}\">` : ''}<style id=\"rtheme-${escapeHtml(domain)}\">\n${css}\n</style>`;
    if (processed.includes('</head>')) processed = processed.replace('</head>', `${inject}</head>`);
    else processed = inject + processed;

    // Replace templated placeholders
    const url = `https://${domain}`;
    processed = processed.replace(/\{\{\s*domain\s*\}\}/g, domain).replace(/\{\{\s*url\s*\}\}/g, url).replace(/\{\{\s*host\s*\}\}/g, domain);

    // Attempt to persist generated preview HTML to Supabase Storage under themes/random-ai-generated/index.html
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
      if (SUPABASE_URL && SERVICE_ROLE) {
        const uploadPath = 'random/index.html';
        const uploadUrl = `${String(SUPABASE_URL).replace(/\/$/, '')}/storage/v1/object/themes/${encodeURIComponent(uploadPath)}`;
        try {
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              apikey: SERVICE_ROLE,
              Authorization: `Bearer ${SERVICE_ROLE}`,
              'Content-Type': 'text/html',
              'x-upsert': 'true'
            },
            body: processed,
          });
        } catch (e) {
          console.warn('Failed to upload preview HTML to Supabase storage:', e && (e.message || e));
        }
      }
    } catch (e) {
      console.warn('Error while attempting to persist preview HTML:', e && (e.message || e));
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      body: processed,
    };
  } catch (err) {
    console.error('randomthemePreview error', err);
    return { statusCode: 500, headers: corsHeaders, body: 'Internal error' };
  }
}

/* ---------------- Helpers (shared generator logic) ---------------- */
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

function pick(array, rng) { return array[Math.floor(rng() * array.length)]; }

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
  return `/* Random Theme for ${postId} seed:${seed} */\n:root{--rtheme-primary:${palette.primary};--rtheme-secondary:${palette.secondary};--rtheme-accent:${accent};--rtheme-muted:${muted};--rtheme-bg:${palette.bg};--rtheme-text:${palette.text};--rtheme-max-width:${layout.maxWidth};--rtheme-radius:${layout.borderRadius};}\nbody.article-post, .post-article{background:var(--rtheme-bg);color:var(--rtheme-text);font-family:'${fonts.body}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;line-height:1.65;}\narticle.post, .post-article{max-width:var(--rtheme-max-width);margin:0 auto;padding:${layout.density==='airy'?'3rem':layout.density==='cozy'?'1rem':'2rem'};}\nh1,h2,h3{font-family:'${fonts.heading}', Georgia, 'Times New Roman', serif;color:var(--rtheme-primary);margin-top:1.2em;margin-bottom:0.5em;line-height:1.15;}\nh1{font-size:2.25rem;}h2{font-size:1.6rem;}h3{font-size:1.2rem;}a{color:var(--rtheme-secondary);text-decoration:underline;}a:hover{color:var(--rtheme-accent);}img{max-width:100%;border-radius:calc(var(--rtheme-radius));box-shadow:${layout.cardShadow};}blockquote{border-left:4px solid var(--rtheme-primary);padding-left:1rem;color:var(--rtheme-muted);font-style:italic;}pre,code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,'Roboto Mono','Courier New',monospace;background:rgba(0,0,0,0.03);padding:0.25rem 0.5rem;border-radius:6px;}ul,ol{margin-left:1.2rem;} .post-card{border-radius:calc(var(--rtheme-radius));box-shadow:${layout.cardShadow}; background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); padding: 1rem; } .post-hero { border-radius: calc(var(--rtheme-radius)); padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02)); margin-bottom: 1.2rem; } .meta { color: var(--rtheme-muted); font-size: 0.9rem; } .small { font-size: 0.9rem; color: var(--rtheme-muted); } @media (max-width: 640px) { article.post, .post-article { padding: 1rem; } h1 { font-size: 1.6rem; } }`;
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

function generateControlledRandomCss({ postId, seed, rng }) {
  const palette = generatePalette(rng);
  const fonts = generateTypography(rng);
  const layout = generateLayoutParams(rng);
  const accent = shade(palette.primary, -10);
  const muted = shade(palette.secondary, 40);
  return `/* Random Theme for ${postId} seed:${seed} */\n:root{--rtheme-primary:${palette.primary};--rtheme-secondary:${palette.secondary};--rtheme-accent:${accent};--rtheme-muted:${muted};--rtheme-bg:${palette.bg};--rtheme-text:${palette.text};--rtheme-max-width:${layout.maxWidth};--rtheme-radius:${layout.borderRadius};}\nbody.article-post, .post-article{background:var(--rtheme-bg);color:var(--rtheme-text);font-family:'${fonts.body}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;line-height:1.65;}\narticle.post, .post-article{max-width:var(--rtheme-max-width);margin:0 auto;padding:${layout.density==='airy'?'3rem':layout.density==='cozy'?'1rem':'2rem'};}\nh1,h2,h3{font-family:'${fonts.heading}', Georgia, 'Times New Roman', serif;color:var(--rtheme-primary);margin-top:1.2em;margin-bottom:0.5em;line-height:1.15;}\nh1{font-size:2.25rem;}h2{font-size:1.6rem;}h3{font-size:1.2rem;}a{color:var(--rtheme-secondary);text-decoration:underline;}a:hover{color:var(--rtheme-accent);}img{max-width:100%;border-radius:calc(var(--rtheme-radius));box-shadow:${layout.cardShadow};}blockquote{border-left:4px solid var(--rtheme-primary);padding-left:1rem;color:var(--rtheme-muted);font-style:italic;}pre,code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,'Roboto Mono','Courier New',monospace;background:rgba(0,0,0,0.03);padding:0.25rem 0.5rem;border-radius:6px;}ul,ol{margin-left:1.2rem;} .post-card{border-radius:calc(var(--rtheme-radius));box-shadow:${layout.cardShadow};background:linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.3));padding:1rem;} .post-hero{border-radius:calc(var(--rtheme-radius));padding:2rem;background:linear-gradient(135deg,rgba(255,255,255,0.02),rgba(0,0,0,0.02));margin-bottom:1.2rem;} .meta{color:var(--rtheme-muted);font-size:0.9rem;}@media (max-width:640px){article.post,.post-article{padding:1rem;}h1{font-size:1.6rem;}}\n`;
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }
