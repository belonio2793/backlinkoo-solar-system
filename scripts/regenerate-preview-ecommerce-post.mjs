import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_URL = process.env.SOURCE_URL || 'https://demo.backlinkoo.com/themes/ecommerce/unlocking-power-go-high-zbyqz';
const THEME = 'ecommerce';
const OUT_SLUG = 'preview-unlocking-power-go-high-zbyqz';

function extractBetween(html, startSel) {
  // Try to locate #post-content container and extract inner HTML
  const marker = '<div id="post-content"';
  let idx = html.indexOf(marker);
  if (idx !== -1) {
    const rest = html.slice(idx);
    const start = rest.indexOf('>');
    if (start !== -1) {
      const after = rest.slice(start + 1);
      // naive close div for this container
      const endIdx = after.indexOf('</div>');
      if (endIdx !== -1) {
        return after.slice(0, endIdx);
      }
    }
  }
  // Fallback: try <article> content
  const artStart = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (artStart) return artStart[1];
  // Last resort: take body
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (body) return body[1];
  return html;
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, '').trim();
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return t[1].replace(/\s*—.*$/, '').trim();
  const urlPart = SOURCE_URL.split('/').pop() || 'Preview';
  return urlPart.replace(/[\-_]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

async function main() {
  const res = await fetch(SOURCE_URL, { method: 'GET' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const html = await res.text();
  const contentHtml = extractBetween(html);
  const title = extractTitle(html);
  const templatePath = path.join('themes', THEME, 'post.html');
  const template = await readFile(templatePath, 'utf8');
  const out = template
    .replace(/\{\{\s*post_title\s*\}\}/g, title)
    .replace(/\{\{\s*domain\s*\}\}/g, 'demo.backlinkoo.com')
    .replace(/\{\{\s*published_at\s*\}\}/g, new Date().toLocaleDateString('en-US'))
    .replace(/<!--POST_CONTENT-->/g, contentHtml);
  const outPath = path.join('themes', THEME, `${OUT_SLUG}.html`);
  await writeFile(outPath, out, 'utf8');
  console.log(JSON.stringify({ ok: true, outPath }));
}

main().catch(err => { console.error(err); process.exit(1); });
