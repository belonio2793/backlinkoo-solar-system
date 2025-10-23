// Node script to fetch demo posts and run a local copy of normalizeContent
// Usage: node scripts/format_demo_posts.js

const urls = [
  'https://demo.backlinkoo.com/themes/ecommerce/go-high-level-stars-why-we-use-go-high-level-every-day',
  'https://demo.backlinkoo.com/themes/modern/seo-software-for-smarter-marketing',
  'https://demo.backlinkoo.com/themes/elegant/go-high-level-stars-why-we-use-go-high-level-every-',
  'https://demo.backlinkoo.com/themes/lifestyle/go-high-level-stars-why-we-use-go-high-level-every-day'
];

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
function normalizeForCompare(s) { return stripTags(String(s || '')).replace(/[\*_`~"“”’‘:]+/g,'').replace(/\s+/g,' ').trim().toLowerCase(); }

function sanitize(html) {
  let out = String(html || '');
  out = out.replace(/<\s*(script|style|iframe)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
  out = out.replace(/ on[a-z]+="[^"]*"/gi, '');
  out = out.replace(/ javascript:/gi, '');
  return out;
}

function ensureParagraphs(html) {
  const hasP = /<p\b/i.test(html);
  if (hasP) return html;
  let parts = html.split(/\r?\n\r?\n+/);
  if (parts.length <= 1) parts = html.split(/\r?\n+/);
  const out = parts
    .map(seg => {
      const s = seg.trim();
      if (!s) return '';
      if (/^<\s*(h\d|ul|ol|li|figure|img|blockquote|section|article|table|div)\b/i.test(s)) return s;
      return `<p>${escapeHtml(s)}</p>`;
    })
    .filter(Boolean)
    .join('\n');
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
    const href = url.trim();
    const safeText = escapeHtml(text.trim());
    const safeHref = escapeHtml(href);
    return `<a href="${safeHref}" rel="noopener">${safeText}</a>`;
  });
}
function linkifyBareUrls(s) {
  return String(s || '').replace(/(^|[^\w\"'=])(https?:\/\/[^\s"'<>]+)/gi, (_m, pre, url) => `${pre}<a href="${escapeHtml(url)}" rel="noopener">${escapeHtml(url)}</a>`);
}

function buildArticleHtml(title, bodyHtml) {
  return `<article>\n  <h1>${escapeHtml(title)}</h1>\n  <div class="beautiful-blog-content beautiful-prose">\n  ${bodyHtml}\n  </div>\n</article>`;
}

function extractTitleFromContent(raw) {
  if (!raw) return '';
  const source = raw;
  const h1 = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]).trim();
  const t1 = source.match(/\*\*\s*Title\s*:\s*([\s\S]*?)\*\*/i);
  if (t1) return t1[1].trim();
  const forbidden = /(figure|class|itemscope|itemtype|schema\.org|imageobject|contenturl|width|height|author|caption|featured|img|meta|href|target|rel|noopener|noreferrer|itemprop|aria-\w+|role|=)/i;
  const candidates = source
    .split(/\n|\.|!|\?/)
    .map(s => stripTags(s).replace(/\bhttps?:\/\/[\S]+/gi, '').replace(/\s{2,}/g, ' ').trim())
    .filter(s => s.length > 10 && /[a-z]/i.test(s) && s.split(/\s+/).length >= 3 && !forbidden.test(s));
  return (candidates[0] || '').slice(0,160);
}

function normalizeContent(currentTitle, content) {
  try {
    let raw = String(content || '').trim();
    raw = raw.replace(/```[\s\S]*?```/g, '');
    raw = raw.replace(/(^|\n)\s*(HTML\s*Output|Clean\s*HTML\s*Output|HTML\s*Version)\s*:?[\t ]*[\s\S]*$/i, '');
    raw = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');
    const hasPlainMarkers = /(^|\n)\s*(?:\*\*\s*)?title\s*[:\-]/i.test(raw) || /\*\*[\s\S]*?\*\*/.test(raw);
    const firstHtmlIdx = raw.search(/<h2\b|<p\b|<ul\b|<ol\b|<section\b|<article\b/i);
    if (hasPlainMarkers && firstHtmlIdx !== -1) raw = raw.slice(firstHtmlIdx);
    let title = extractTitleFromContent(raw) || currentTitle || '';
    title = title;
    if (/<[a-z][\s\S]*>/i.test(raw)) {
      let html = raw;
      html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>').replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/<p>\s*<strong>([^<:]+)\s*:?<\/strong>\s*<\/p>/gi, (_m, g1) => `<h2>${g1.trim()}</h2>`);
      html = html.replace(/<p>\s*<strong>\s*Title\s*:\s*<\/strong>\s*[^<]*<\/p>/gi, '');
      html = html.replace(/<h1[\s\S]*?<\/h1>/gi, '');
      const articleBlocks = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi);
      if (articleBlocks && articleBlocks.length > 1) html = articleBlocks[articleBlocks.length-1];
      html = html.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');
      const firstP = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
      if (firstP) {
        const firstText = stripTags(firstP[1]).trim();
        if (normalizeForCompare(firstText) === normalizeForCompare(title)) html = html.replace(firstP[0], '');
      }
      html = html.replace(/\*\*([^<>\n]+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/(^|[^*])\*([^<>\n]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');
      const cleaned = sanitize(html);
      const withParagraphs = ensureParagraphs(cleaned);
      const structured = String(withParagraphs).replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (m, attrs, inner) => {
        if (/<\s*(img|figure|pre|code|table|iframe|ul|ol|li|blockquote)[^>]*>/i.test(inner)) return m;
        const text = stripTags(inner).trim();
        if (text.length < 8 || text.length > 120) return m;
        const words = text.split(/\s+/); if (words.length > 16) return m;
        const caps = words.filter(w => /^[A-Z][a-z]/.test(w)).length;
        const allCaps = words.every(w => /^[A-Z]+$/.test(w));
        const looksHeading = /[:?]$/.test(text) || allCaps || (caps / Math.max(1, words.length) > 0.6);
        if (!looksHeading) return m;
        const clean = text.replace(/\s*[:.]\s*$/, '').trim();
        return `<h2>${escapeHtml(clean)}</h2>`;
      });
      const enhanced = enhanceImages(structured);
      let article = buildArticleHtml(title, enhanced);
      article = linkifyMarkdown(article);
      article = linkifyBareUrls(article);
      return ensureParagraphs(sanitize(article));
    }
    let bodySource = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');
    const lines = bodySource.replace(/\r\n?/g, '\n').split('\n');
    const firstIdx = lines.findIndex(l => l.trim().length > 0);
    if (firstIdx !== -1) {
      const firstLine = lines[firstIdx];
      const titleNorm = title;
      if (normalizeForCompare(firstLine) === normalizeForCompare(titleNorm)) { lines.splice(firstIdx, 1); bodySource = lines.join('\n'); }
    }
    const bodyHtml = bodySource.split('\n').map(l=>`<p>${escapeHtml(l)}</p>`).join('\n');
    let article = buildArticleHtml(title, bodyHtml);
    article = linkifyMarkdown(article);
    article = linkifyBareUrls(article);
    return ensureParagraphs(sanitize(article));
  } catch (e) {
    console.error('normalizeContent error', e && e.message ? e.message : e);
    const raw = String(content || '').trim();
    const escaped = ensureParagraphs(sanitize(escapeHtml(raw)));
    return escaped || '<p>No content</p>';
  }
}

(async function(){
  for (const u of urls) {
    try {
      console.log('\n--- URL:', u, '---\n');
      const res = await fetch(u, { method: 'GET' });
      const text = await res.text();
      // Attempt to extract main article content by common selectors
      let content = '';
      const markers = ['<div id="post-content"', '<article', '<div class="content">', '<div class="post-container"', '<div id="posts">'];
      let found = false;
      for (const m of markers) {
        const idx = text.indexOf(m);
        if (idx !== -1) {
          // crude extraction: take a large slice around marker
          const slice = text.slice(Math.max(0, idx-200), Math.min(text.length, idx+20000));
          // find opening < and closing of the main container
          const start = slice.indexOf('>');
          if (start !== -1) {
            // attempt to get rest of page body as fallback
            content = text;
            found = true;
            break;
          }
        }
      }
      if (!found) content = text;
      const normalized = normalizeContent('', content);
      console.log('Normalized Output:\n', normalized.slice(0, 8000));
    } catch (e) {
      console.error('Fetch/normalize failed for', u, e.message || e);
    }
  }
})();
