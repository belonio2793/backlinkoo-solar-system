// Canonical post formatter (frontend copy) — mirrors supabase/functions/_shared/format-post.ts
// Pure string-based implementation (no external deps).

const SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via', 'with'
]);

export function titleCase(input: string): string {
  const words = String(input || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  return words.map((w, i) => {
    if (/^[A-Z0-9]{2,}$/.test(w) || /[A-Z].*[A-Z]/.test(w.slice(1))) return w; // acronyms/camelCase
    const lower = w.toLowerCase();
    if (i !== 0 && i !== words.length - 1 && SMALL_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

// ---------- Basic escaping / entity handling ----------
function escapeHtml(s: string): string {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeHtmlExceptBasic(s: string): string {
  // allow <strong>, <em>, <code>, <b>, <i>
  return escapeHtml(s).replace(/&lt;(\/?(?:strong|em|code|b|i))&gt;/g, '<$1>');
}

export function decodeEntities(s: string): string {
  const named: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', copy: '©', reg: '®'
  };
  return String(s || '').replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (_m, ent) => {
    if (!ent) return '';
    if (ent[0] === '#') {
      const num = ent[1].toLowerCase() === 'x' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      if (!isFinite(num)) return '';
      try { return String.fromCodePoint(num); } catch { return ''; }
    }
    return Object.prototype.hasOwnProperty.call(named, ent) ? named[ent] : `&${ent};`;
  });
}

// ---------- Stronger sanitization ----------
export function sanitize(html: string): string {
  let out = String(html || '');

  // Unescape some safe encoded tags (e.g. &lt;strong&gt;) so they can be normalized
  out = out.replace(/&lt;(\/?)(strong|em|a|h[1-6])&gt;/gi, '<$1$2>');

  // Remove dangerous elements entirely (script/style/iframe/object/embed/form)
  out = out.replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
  // Remove common self-closing dangerous tags
  out = out.replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/\s*>/gi, '');

  // Remove event handlers: onxxx="..."
  out = out.replace(/\son[a-z]+\s*=?\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // Remove javascript: pseudo-protocol in href/src attributes
  out = out.replace(/(href|src)\s*=\s*(\"|\')?\s*javascript:[^"'>\s]*/gi, '');

  // Collapse suspicious attribute dumps and long inline data URIs (could be malware)
  out = out.replace(/\sdata:[^'">\s]{100,}/gi, '');

  return out;
}

// Remove visible image metadata/credits and schema microdata (both real and HTML-encoded)
function stripImageMetaAndCredits(html: string): string {
  let out = String(html || '');

  // Remove real figcaptions
  out = out.replace(/<\s*figcaption[^>]*>[\s\S]*?<\/\s*figcaption\s*>/gi, '');
  // Remove encoded figcaptions
  out = out.replace(/&lt;\s*figcaption[^&]*&gt;[\s\S]*?&lt;\/\s*figcaption\s*&gt;/gi, '');

  // Remove inline "Photo by ... on Pexels" style credits (allow up to 200 chars between)
  out = out.replace(/Photo by[\s\S]{0,200}?Pexels/gi, '');

  // Remove encoded <meta ...> fragments and real meta tags lingering in content blocks
  out = out.replace(/&lt;\s*meta[^>]*&gt;|&lt;\s*meta[^>]*\/\s*&gt;/gi, '');
  out = out.replace(/<\s*meta[^>]*>/gi, '');

  // Drop schema.org microdata attributes that sometimes leak into visible markup
  out = out.replace(/\sitemscope\b/gi, '');
  out = out.replace(/\sitemtype\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/\sitemprop\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Tidy trailing "on Pexels" remnants
  out = out.replace(/\s*on\s*Pexels\.?\s*/gi, ' ');

  return out;
}

// ---------- URL normalization ----------
function normalizeUrl(u: string): string {
  const s = String(u || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  // bare domain like example.com or example.com/path -> add https://
  if (/^[a-z0-9-]+\.[a-z]{2,}(?:\/.*)?$/i.test(s)) return `https://${s}`;
  return s;
}

// ---------- Link normalization (unified & idempotent) ----------
function normalizeLinks(html: string): string {
  // We'll parse attributes through regex cautiously and ensure rel & target are safe.
  return String(html || '').replace(/<a\b([^>]*)>/gi, (m, rawAttrs) => {
    let attrs = String(rawAttrs || '');
    const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    // decode HTML entities and strip stray encoded quotes
    const hrefRaw = decodeEntities(hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '') : '').replace(/^\s+|\s+$/g, '').replace(/\u201C|\u201D|&quot;|&apos;/g, '');
    const href = normalizeUrl(hrefRaw);

    // If no href or a hash-only or mailto/ftp etc -> keep anchor but do not force target
    if (!href || /^#/.test(href) || (/^[a-z0-9.+-]+:/i.test(hrefRaw) && !/^https?:/i.test(hrefRaw))) {
      // If mailto, ensure proper href
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hrefRaw)) {
        // convert bare email to mailto
        attrs = attrs.replace(/href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, `href="mailto:${escapeAttr(hrefRaw)}"`);
      }
      return `<a${attrs}>`;
    }

    // Build canonical attrs: keep existing non-dangerous attrs; ensure href, rel, target
    if (/\brel\s*=/.test(attrs)) {
      attrs = attrs.replace(/\brel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i, (_m2, g1, g2, g3) => {
        const tokens = (g1 || g2 || g3 || '').split(/\s+/).map(t => t.trim()).filter(Boolean);
        const filtered = tokens.filter(t => !/^(nofollow|ugc)$/i.test(t));
        if (!filtered.length) filtered.push('noopener', 'noreferrer');
        if (!filtered.includes('noopener')) filtered.push('noopener');
        if (!filtered.includes('noreferrer')) filtered.push('noreferrer');
        return `rel="${filtered.join(' ')}"`;
      });
    } else {
      attrs += ` rel="noopener noreferrer"`;
    }

    if (!/target\s*=/.test(attrs)) {
      attrs += ` target="_blank"`;
    }

    // Ensure href attribute is the normalized one (escape)
    if (href && href !== hrefRaw) {
      // Remove old href token then add normalized
      attrs = attrs.replace(/\s*href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, '');
      attrs = ` href="${escapeAttr(href)}"${attrs}`;
    } else if (href) {
      // ensure href is properly escaped
      attrs = attrs.replace(/\s*href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, ` href="${escapeAttr(hrefRaw)}"`);
    }

    // Clean up multiple spaces
    attrs = attrs.replace(/\s+/g, ' ');
    return `<a${attrs}>`;
  });
}

// ---------- Image enhancements ----------
function enhanceImages(html: string): string {
  return String(html || '').replace(/<img\b([^>]*)>/gi, (m, attrs) => {
    let a = String(attrs || '');
    // ensure alt exists
    if (!/\balt\s*=/.test(a)) {
      a += ' alt=""';
    } else {
      // sanitize alt content
      a = a.replace(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i, (_m, g1, g2, g3) => {
        const raw = g1 || g2 || g3 || '';
        return `alt="${escapeAttr(decodeEntities(raw))}"`;
      });
    }
    if (!/\bloading=/.test(a)) a += ' loading="lazy"';
    if (!/\bdecoding=/.test(a)) a += ' decoding="async"';
    if (!/\breferrerpolicy=/.test(a)) a += ' referrerpolicy="no-referrer"';
    if (!/\bsizes=/.test(a)) a += ' sizes="(max-width: 920px) 100vw, 920px"';
    // Wrap standalone images in figure for layout (idempotent: only if not already in figure)
    const imgTag = `<img${a}>`;
    return imgTag;
  }).replace(/(?:\n\s*)?<img\b[^>]*>\s*(?:\n\s*)?/gi, (m) => {
    // if already inside <figure> or <a> or <picture>, don't auto-wrap
    if (/<figure\b[^>]*>[\s\S]*<\/figure>/i.test(m) || /<picture\b/i.test(m)) return m;
    return `<figure class="post-figure">${m}</figure>`;
  });
}

// ---------- Inline formatting: bold/italic/code/blockquote ----------
function formatInline(s: string): string {
  let src = String(s || '');

  // Pre-fix common HTML-encoded fragments
  src = src
    .replace(/&lt;(\/?)(strong|em|b|i|code)&gt;/gi, '<$1$2>')
    .replace(/(^|[>\s])strong&gt;([^<]+)/gi, (_m, p, t) => `${p}<strong>${t}</strong>`);

  // Remove empty anchors or anchors without href
  src = src.replace(/<a\b[^>]*href\s*=\s*(?:""|''|#)[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  src = src.replace(/<a\b(?![^>]*\bhref=)[^>]*>([\s\S]*?)<\/a>/gi, '$1');

  // Extract anchors and protect them
  const anchors: Record<string, string> = {};
  let idx = 0;
  src = src.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (m) => {
    const token = `__A_${idx++}__`;
    anchors[token] = m;
    return token;
  });

  // Convert inline code `code`
  src = src.replace(/`([^`]+)`/g, (_m, c) => `<code>${escapeHtmlExceptBasic(String(c))}</code>`);

  // Bold & italics (support ***bold italic***)
  src = src
    .replace(/\*\*\*([\s\S]+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em>$2</em>$3');

  // Restore anchors sanitized (we'll re-normalize later)
  src = src.replace(/__A_(\d+)__/g, (t) => anchors[t] || t);

  // Linkify inline markdown [text](url)
  src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const href = normalizeUrl(url);
    if (!href) return escapeHtml(text);
    return `<a href="${escapeAttr(href)}" rel="noopener noreferrer" target="_blank">${escapeHtml(text)}</a>`;
  });

  // Bare url linkify
  src = src.replace(/(^|[^\w\"'=])(https?:\/\/[^\s<>()]+)/gi, (_m, pre, url) => `${pre}<a href="${escapeAttr(url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(url)}</a>`);

  // Make sure HTML entities remain valid for allowed inline tags
  src = escapeHtmlExceptBasic(src);

  // Tidy up nested strong/em
  src = src.replace(/<strong>\s*<strong>/gi, '<strong>').replace(/<\/strong>\s*<\/strong>/gi, '</strong>');
  return src;
}

// ---------- Plain-text -> HTML blocks ----------
function parseSectionsFromPlain(text: string): string {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Blockquote
    if (/^>\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^>\s+/.test(lines[i])) {
        items.push(escapeHtmlExceptBasic(lines[i].replace(/^>\s+/, '')));
        i++;
      }
      out.push(`<blockquote class="prose-blockquote">${items.join('<br>')}</blockquote>`);
      continue;
    }

    // Heading via # markup
    const hash = line.match(/^#{1,6}\s+(.+)$/);
    if (hash) { out.push(`<h2>${formatInline(hash[1])}</h2>`); i++; continue; }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${formatInline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Unordered list
    if (/^(?:-|\*|•)\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(?:-|\*|•)\s+/.test(lines[i])) {
        items.push(`<li>${formatInline(lines[i].replace(/^(?:-|\*|•)\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Code fence (already stripped earlier, but handle inline triple-backticks gracefully)
    if (/^```/.test(line)) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !/^```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      i++; // skip closing fence
      out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Generic paragraph (short lines may be merged later)
    out.push(`<p>${formatInline(line)}</p>`);
    i++;
  }

  // Merge adjacent single-li lists into single ul/ol if necessary handled above
  return out.join('\n');
}

// ---------- Utility helpers ----------
function stripTags(s: string): string { return String(s || '').replace(/<[^>]+>/g, ''); }

function normalizeForCompare(s: string): string {
  return stripTags(String(s || '')).replace(/[\*_'`~\"“”’‘:]+/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

// Tolerant dedupe: remove nearly-identical consecutive blocks, allow small edits
function dedupeBlocks(html: string): string {
  const blocks = String(html || '').split(/\n+/).map(b => b.trim()).filter(Boolean);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const b of blocks) {
    const key = normalizeForCompare(b).slice(0, 240); // truncated key for tolerance
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out.join('\n');
}

// Balance tags for basic inline tags and paragraphs
function balanceTags(html: string): string {
  let out = String(html || '');
  const tagsToBalance = ['strong', 'em', 'code', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  for (const tag of tagsToBalance) {
    const opens = (out.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || []).length;
    const closes = (out.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    let diff = opens - closes;
    if (diff > 0) {
      out += Array(diff).fill(`</${tag}>`).join('');
    } else if (diff < 0) {
      // remove some excess closing tags (leftmost)
      let remove = -diff;
      out = out.replace(new RegExp(`(</${tag}>)`, 'i'), (_m) => {
        if (remove > 0) { remove--; return ''; }
        return _m;
      });
    }
  }
  // Simple fix for nested article wrappers
  out = out.replace(/(<article[^>]*>\s*)+(<article[^>]*>)/gi, '<article>');
  out = out.replace(/(<\/article>\s*)+<\/article>/gi, '</article>');
  return out;
}

// ---------- Class additions for blog look/consistency ----------
function addBlogClasses(html: string): string {
  let out = String(html || '');

  out = out.replace(/<h1([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<h1${attrs}>`;
    return `<h1 class="text-2xl font-bold text-gray-900 mb-4"${attrs}>`;
  });
  out = out.replace(/<h2([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<h2${attrs}>`;
    return `<h2 class="text-xl font-bold text-gray-900 mb-3"${attrs}>`;
  });
  out = out.replace(/<h3([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<h3${attrs}>`;
    return `<h3 class="text-lg font-semibold text-gray-900 mb-2"${attrs}>`;
  });

  out = out.replace(/<blockquote([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<blockquote${attrs}>`;
    return `<blockquote class="border-l-4 pl-4 italic text-gray-700 my-4"${attrs}>`;
  });

  out = out.replace(/<ul([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<ul${attrs}>`;
    return `<ul class="list-disc ml-6 mb-4"${attrs}>`;
  });
  out = out.replace(/<ol([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<ol${attrs}>`;
    return `<ol class="list-decimal ml-6 mb-4"${attrs}>`;
  });

  out = out.replace(/<strong([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<strong${attrs}>`;
    return `<strong class="font-bold text-gray-900"${attrs}>`;
  });
  out = out.replace(/<em([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<em${attrs}>`;
    return `<em class="italic text-gray-800"${attrs}>`;
  });

  // links: add visible link classes only if class not present
  out = out.replace(/<a\b([^>]*)>/gi, (m, attrs) => {
    if (/\bclass=/.test(attrs)) return `<a${attrs}>`;
    // preserve href/rel/target if present
    const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '') : '';
    const trailing = /target=/.test(attrs) ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a class="text-blue-600 hover:text-blue-800 font-semibold"${attrs}${trailing}>`;
  });

  return out;
}

// ---------- Preprocess raw text for control chars, repeated punctuation, etc. ----------
function preprocessRaw(s: string): string {
  let x = decodeEntities(String(s || ''));
  x = x.replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, ''); // control & zwsp
  x = x.replace(/\s*[\u00A0]\s*/g, ' ');
  x = x.replace(/\.{3,}/g, '…');
  x = x.replace(/\s*—\s*/g, ' — ');
  x = x.replace(/`{3,}[\s\S]*?`{3,}/g, ''); // drop fenced code blocks
  x = x.replace(/\*{3,}/g, '**');
  x = x.replace(/([!?.,;:\-])\1{2,}/g, '$1$1');
  x = x.replace(/\s{3,}/g, '  ');
  x = x.trim();
  return x;
}

// ---------- Promote short labeled paragraphs to headings heuristics ----------
function promoteShortParagraphsToHeadings(html: string): string {
  return String(html || '').replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (m, attrs, inner) => {
    // Skip if contains block-level elements
    if (/<(img|figure|pre|code|table|iframe|ul|ol|li|blockquote)[\s>]/i.test(inner)) return m;
    const text = stripTags(inner).trim();
    if (!text) return m;
    if (text.length > 120) return m;
    const words = text.split(/\s+/);
    if (words.length > 8) return m;
    // If looks like label: ends with ':' or is ALL CAPS or >60% Titlecase words
    const allCaps = text === text.toUpperCase();
    const caps = words.filter(w => /^[A-Z][a-z]/.test(w)).length;
    const looksHeading = /[:?]$/.test(text) || allCaps || (caps / Math.max(1, words.length) > 0.6);
    if (!looksHeading) return m;
    const clean = text.replace(/\s*[:.\-]\s*$/, '').trim();
    return `<h2${attrs}>${escapeHtml(clean)}</h2>`;
  });
}

// ---------- Ensure paragraphs exist if missing ----------
function ensureParagraphs(html: string): string {
  const hasP = /<p\b/i.test(html);
  if (hasP) return html;
  let parts = html.split(/\r?\n\r?\n+/);
  if (parts.length <= 1) parts = html.split(/\r?\n+/);
  const out = parts.map(seg => {
    const s = seg.trim();
    if (!s) return '';
    if (/^<\s*(h\d|ul|ol|li|figure|img|blockquote|section|article|table|div)\b/i.test(s)) return s;
    return `<p>${formatInline(s)}</p>`;
  }).filter(Boolean).join('\n');
  return out;
}

function linkifyMarkdown(s: string): string {
  return String(s || '').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const href = normalizeUrl(url);
    const safeText = escapeHtml(String(text).trim());
    const safeHref = escapeAttr(href);
    return `<a href="${safeHref}" rel="noopener noreferrer" target="_blank">${safeText}</a>`;
  });
}

function linkifyBareUrls(s: string): string {
  return String(s || '').replace(/(^|[^\w\"'=])(https?:\/\/[^\s<>()]+)/gi, (_m, pre, url) => {
    return `${pre}<a href="${escapeAttr(url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(url)}</a>`;
  });
}

// ---------- Title extraction improvements ----------
export function extractTitleFromContent(raw: string): string {
  if (!raw) return '';
  let source = decodeEntities(String(raw || ''));
  // remove noisy unified markers like **unified**
  source = source.replace(/\*\*\s*unified\s*\*\*/gi, '').replace(/\*\*unified\*\*/gi, '').trim();
  // prefer explicit h1
  const h1 = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]).trim();

  // "**Title: ...**"
  const t1 = source.match(/\*\*\s*Title\s*:\s*([\s\S]*?)\*\*/i);
  if (t1) return t1[1].trim();

  // meta-like candidate filtering
  const forbidden = /(\bfigure\b|\bclass\b|\bitemscope\b|\bitemtype\b|schema\.org|\bimageobject\b|\bcontenturl\b|\bwidth\b|\bheight\b|\bauthor\b|\bcaption\b|\bfeatured\b|\bimg\b|\bmeta\b|\bhref\b|\btarget\b|\brel\b|\bnoopener\b|\bnoreferrer\b|\bitemprop\b|\baria-\w+\b|\brole\b|=)/i;

  const sentences = source.split(/[.!?]\s+/).map(s => s.trim()).filter(Boolean);
  // prefer first <h2> or first sizable sentence with words>=3
  const h2 = source.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h2) return stripTags(h2[1]).trim();

  for (const s of sentences) {
    const cleaned = stripTags(s).replace(/\s{2,}/g, ' ').trim();
    if (cleaned.length > 15 && cleaned.split(/\s+/).length >= 3 && !forbidden.test(cleaned)) {
      return cleaned.slice(0, 160);
    }
  }

  // fallback: find best candidate by splitting on newlines/dots and filtering
  const candidates = source.split(/\n|\.|!|\?/).map(s => stripTags(s).replace(/\bhttps?:\/\/[\S]+/gi, '').replace(/\s{2,}/g, ' ').trim()).filter(s => s.length > 10 && /[a-z]/i.test(s) && s.split(/\s+/).length >= 3 && !forbidden.test(s));
  const first = candidates[0] || '';
  return first.slice(0, 160);
}

// ---------- Core normalization pipeline ----------
export function normalizeContent(currentTitle: string, content: string): string {
  try {
    // 0. Preprocess raw
    let raw = preprocessRaw(content || '');

    // Strip any fenced code still present
    raw = raw.replace(/```[\s\S]*?```/g, '');

    // Remove headings like "HTML Output" trailing dumps
    raw = raw.replace(/(^|\n)\s*(HTML\s*Output|Clean\s*HTML\s*Output|HTML\s*Version)\s*:?[\t ]*[\s\S]*$/i, '');
    raw = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');

    // If plain markers exist and HTML exists, take first HTML block
    const hasPlainMarkers = /(^|\n)\s*(?:\*\*\s*)?title\s*[:\-]/i.test(raw) || /\*\*[\s\S]*?\*\*/.test(raw);
    const firstHtmlIdx = raw.search(/<h2\b|<p\b|<ul\b|<ol\b|<section\b|<article\b|<div\b/i);
    if (hasPlainMarkers && firstHtmlIdx !== -1) raw = raw.slice(firstHtmlIdx);

    // Title detection
    let title = extractTitleFromContent(raw) || (currentTitle || '');
    title = titleCase(title);
    // remove residual tokens like '**unified' or surrounding asterisks
    title = String(title || '').replace(/\*+\s*unified\s*\*+/i, '').replace(/^\*+|\*+$/g, '').trim();

    // If raw contains HTML-ish content
    if (/<[a-z][\s\S]*>/i.test(raw)) {
      let html = raw;

      // Convert # markup embedded in HTML to headings
      html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>').replace(/^##\s+(.+)$/gm, '<h2>$1</h2>').replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');

      // Promote <p><strong>Label</strong></p> to h2 section headers
      html = html.replace(/<p[^>]*>\s*<strong[^>]*>([^<:]+?)\s*:?<\/strong>\s*<\/p>/gi, (_m, g1) => `<h2>${escapeHtml(g1.trim())}</h2>`);

      // Remove explicit Title paragraphs and leading h1 (we will add canonical h1)
      html = html.replace(/<p[^>]*>\s*<strong[^>]*>\s*Title\s*:\s*<\/strong>[^<]*<\/p>/gi, '');
      html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');

      // Unwrap if multiple article blocks — keep last (assume final is desired)
      const articleBlocks = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi);
      if (articleBlocks && articleBlocks.length > 1) html = articleBlocks[articleBlocks.length - 1];
      html = html.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');

      // Remove image metadata/credits blocks and encoded fragments
      html = stripImageMetaAndCredits(html);

      // Remove first paragraph if it duplicates the title
      const firstP = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
      if (firstP) {
        const firstText = stripTags(firstP[1]).trim();
        if (normalizeForCompare(firstText) === normalizeForCompare(title)) html = html.replace(firstP[0], '');
      }

      // Convert leftover markdown inline emphasis within HTML
      html = html.replace(/\*\*([^<>\n]+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^<>\n]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');

      // Sanitize and structure
      const cleaned = sanitize(html);
      const withParagraphs = ensureParagraphs(cleaned);
      const promoted = promoteShortParagraphsToHeadings(withParagraphs);
      const images = enhanceImages(promoted);
      const linksNormalized = normalizeLinks(images);

      // Deduplicate without adding wrappers; rely on raw model output structure
      let article = dedupeBlocks(linksNormalized);

      article = linkifyMarkdown(article);
      article = linkifyBareUrls(article);
      article = addBlogClasses(article);

      // Final sanitization and balancing
      article = sanitize(article);
      article = normalizeLinks(article); // idempotent
      article = balanceTags(article);
      article = promoteShortParagraphsToHeadings(article);

      return article;
    }

    // Plain text pathway: convert to structured HTML
    let bodySource = raw.replace(/(^|\n)\s*(?:\*\*\s*)?Title\s*[:\-]\s*[^\n]*\n?/i, '$1');
    const lines = bodySource.replace(/\r\n?/g, '\n').split('\n');
    const firstIdx = lines.findIndex(l => l.trim().length > 0);
    if (firstIdx !== -1) {
      const firstLine = lines[firstIdx];
      const titleNorm = titleCase(title);
      if (normalizeForCompare(firstLine) === normalizeForCompare(titleNorm)) { lines.splice(firstIdx, 1); bodySource = lines.join('\n'); }
    }
    const bodyHtml = parseSectionsFromPlain(bodySource);
    let article = dedupeBlocks(bodyHtml);
    article = linkifyMarkdown(article);
    article = linkifyBareUrls(article);
    article = addBlogClasses(article);
    article = sanitize(article);
    article = normalizeLinks(article);
    article = balanceTags(article);
    article = promoteShortParagraphsToHeadings(article);
    return article;
  } catch (e) {
    // Defensive fallback: return sanitized plain paragraph
    try { console.error('normalizeContent error', e); } catch { }
    const raw = String(content || '').trim();
    const escaped = normalizeLinks(sanitize(ensureParagraphs(escapeHtml(raw))));
    return escaped || '<p>No content</p>';
  }
}

// ---------- Formatting wrapper ----------
export function formatAutomationPost(inputTitle: string, inputContent: string): { title: string; content: string } {
  const normalizedHtml = normalizeContent(inputTitle || '', inputContent || '');
  const title = titleCase(String(inputTitle || ''));
  return { title, content: normalizedHtml };
}

// ---------- External page title fetch (improved) ----------
export async function fetchExternalPageTitle(url: string): Promise<string | null> {
  try {
    const u = String(url || '').trim();
    if (!/^https?:\/\//i.test(u)) return null;
    const res = await fetch(u, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutomationBot/1.0)' }, redirect: 'follow' });
    if (!res.ok) return null;
    const html = await res.text();
    const pickMeta = (tag: string) => {
      const re = new RegExp(`<meta[^>]+(?:property|name)=["']${tag}["'][^>]*>`, 'i');
      const m = html.match(re);
      if (!m) return null;
      const t = m[0];
      const c = t.match(/content=["']([^"']+)["']/i);
      return c ? c[1] : null;
    };
    let title = pickMeta('og:title') || pickMeta('twitter:title') || null;
    if (!title) {
      const h1Meta = html.match(/<(?:meta|[^>]+)\b[^>]*itemprop=["']headline["'][^>]*>/i);
      if (h1Meta) { const c = h1Meta[0].match(/content=["']([^"']+)["']/i); if (c) title = c[1]; }
    }
    if (!title) {
      const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (t) title = t[1];
    }
    if (!title) {
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1) title = h1[1];
    }
    if (!title) return null;
    title = decodeEntities(stripTags(title)).replace(/\s{2,}/g, ' ').trim();
    // Reject poor titles
    if (/(\btarget|\brel|noopener|noreferrer|itemprop|itemscope|schema\.org|href|http|https)\b/i.test(title)) return null;
    if (/\s*=\s*['"][^'\"]+['"]/i.test(title)) return null;
    if (title.length < 5 || title.split(/\s+/).length < 2) return null;
    return title.slice(0, 160);
  } catch (_) {
    return null;
  }
}
