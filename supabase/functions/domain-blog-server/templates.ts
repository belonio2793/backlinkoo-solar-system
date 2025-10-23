// Theme-specific HTML renderers for index and post pages
// Keys correspond to domain.selected_theme values (e.g., "minimal", "modern", "magazine", "seo-optimized", "tech-blog", "lifestyle", "business", "portfolio", "ecommerce", "custom-layout")

export type SiteMeta = {
  siteTitle: string;
  description?: string | null;
  keywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  themeKey: string;
};

export type ListItem = {
  title: string;
  slug: string;
  href: string; // absolute or root-relative
  published?: string | null;
  excerpt?: string | null;
};

export type PostData = {
  title: string;
  contentHtml: string; // safe HTML
  published?: string | null;
  slug: string;
  canonicalUrl?: string | null;
};

function head(meta: SiteMeta, pageTitle?: string) {
  const title = pageTitle ? `${pageTitle} — ${meta.siteTitle}` : meta.siteTitle;
  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="robots" content="index, follow">
  ${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
  ${meta.keywords ? `<meta name="keywords" content="${meta.keywords}">` : ''}
  ${meta.ogTitle ? `<meta property="og:title" content="${meta.ogTitle}">` : ''}
  ${meta.ogDescription ? `<meta property="og:description" content="${meta.ogDescription}">` : ''}
  ${meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}">` : ''}
  ${meta.favicon ? `<link rel="icon" href="${meta.favicon}">` : `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`}
  ${meta.canonicalUrl ? `<link rel="canonical" href="${meta.canonicalUrl}">` : ''}
  <link rel="stylesheet" href="/automation-posts.css">
  <style>
    :root{--fg:#0f172a;--muted:#64748b;--accent:#2563eb}
    html{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7}
    body{margin:0;color:var(--fg);background:#f8fafc}
    a{color:var(--accent);text-decoration:none}
    .container{max-width:960px;margin:0 auto;padding:28px}
    header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
    .title{font-size:28px;font-weight:800;letter-spacing:-.01em}
    .subtitle{color:var(--muted);margin-top:6px}
    .grid{display:grid;gap:22px}
    .card{padding:18px;border:1px solid #e2e8f0;border-radius:14px;background:#fff}
    .meta{color:var(--muted);font-size:12px}
    .post h1{font-size:40px;margin:8px 0 12px;line-height:1.2;letter-spacing:-.02em}
    .post h2{font-size:28px;margin:28px 0 12px;line-height:1.3}
    .post h3{font-size:22px;margin:22px 0 10px;line-height:1.35}
    .post p{font-size:18px;line-height:1.8;color:#334155;margin:16px 0}
    .post ul,.post ol{margin:16px 0 16px 22px}
    .post li{margin:6px 0}
    .post img{max-width:100%;height:auto;border-radius:12px;display:block;margin:16px auto;box-shadow:0 10px 30px rgba(0,0,0,.06)}
    .post figure{margin:0}
    .post figcaption{color:var(--muted);font-size:12px;text-align:center;margin-top:8px}
  </style>
  `;
}

function layout(meta: SiteMeta, content: string, pageTitle?: string, themeTwist?: string) {
  const themeClass = `theme-${meta.themeKey}`;
  const twist = themeTwist || '';
  return `<!doctype html><html><head>${head(meta, pageTitle)}</head><body class="${themeClass}">
    <div class="container ${twist}">
      <header>
        <div>
          <div class="title">${meta.siteTitle}</div>
          ${meta.description ? `<div class="subtitle">${meta.description}</div>` : ''}
        </div>
        <nav><a href="/blog/">Home</a></nav>
      </header>
      ${content}
    </div>
  </body></html>`;
}

// Per-theme variants: lightweight style differences per theme key
const themeDecor: Record<string, { list?: (items: ListItem[]) => string; postWrap?: (html: string) => string; twist?: string }> = {
  minimal: {
    list: (items) => `<ul class="grid">${items.map(i=>`<li class="card"><a href="${i.href}"><strong>${i.title}</strong></a><div class="meta">${i.published||''}</div>${i.excerpt?`<p>${i.excerpt}</p>`:''}</li>`).join('')}</ul>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  modern: {
    list: (items) => `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${items.map(i=>`<a class="card" style="display:block" href="${i.href}"><div style="font-size:18px;font-weight:600">${i.title}</div><div class="meta" style="margin-top:6px">${i.published||''}</div><div style="margin-top:8px">${i.excerpt||''}</div></a>`).join('')}</div>`,
    postWrap: (html) => `<article class="post" style="padding:6px 2px">${html}</article>`,
    twist: ''
  },
  magazine: {
    list: (items) => `<div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start">${items.map((i,idx)=>`<a class="card" style="display:block;${idx===0?'grid-column:1/3;font-size:20px':''}" href="${i.href}"><div style="font-weight:700">${i.title}</div><div class="meta" style="margin-top:6px">${i.published||''}</div><div style="margin-top:8px">${i.excerpt||''}</div></a>`).join('')}</div>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  'seo-optimized': {
    list: (items) => `<ul class="grid">${items.map(i=>`<li class="card" itemscope itemtype="https://schema.org/BlogPosting"><a href="${i.href}" itemprop="url"><span itemprop="headline"><strong>${i.title}</strong></span></a><meta itemprop="datePublished" content="${i.published||''}"><div class="meta">${i.published||''}</div>${i.excerpt?`<p itemprop="description">${i.excerpt}</p>`:''}</li>`).join('')}</ul>`,
    postWrap: (html) => `<article class="post" itemscope itemtype="https://schema.org/BlogPosting">${html}</article>`,
    twist: ''
  },
  'tech-blog': {
    list: (items) => `<div class="grid">${items.map(i=>`<div class="card" style="background:#0b1220;color:#e5e7eb"><a style="color:#60a5fa" href="${i.href}"><strong>${i.title}</strong></a><div class="meta" style="color:#93a6c7">${i.published||''}</div><div style="opacity:.9">${i.excerpt||''}</div></div>`).join('')}</div>`,
    postWrap: (html) => `<article class="post" style="background:#0b1220;color:#e5e7eb;padding:20px;border-radius:12px">${html}</article>`,
    twist: ''
  },
  lifestyle: {
    list: (items) => `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">${items.map(i=>`<a class="card" style="display:block;border-radius:16px" href="${i.href}"><div style="font-size:20px">${i.title}</div><div class="meta">${i.published||''}</div><div>${i.excerpt||''}</div></a>`).join('')}</div>`,
    postWrap: (html) => `<article class="post" style="border-radius:16px">${html}</article>`,
    twist: ''
  },
  business: {
    list: (items) => `<table style="width:100%;border-collapse:separate;border-spacing:0 10px">${items.map(i=>`<tr><td class="card"><a href="${i.href}"><strong>${i.title}</strong></a><div class="meta">${i.published||''}</div><div>${i.excerpt||''}</div></td></tr>`).join('')}</table>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  portfolio: {
    list: (items) => `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${items.map(i=>`<a class="card" style="display:block;text-align:center" href="${i.href}"><div style="font-weight:700">${i.title}</div><div class="meta">${i.published||''}</div></a>`).join('')}</div>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  ecommerce: {
    list: (items) => `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${items.map(i=>`<a class="card" style="display:block" href="${i.href}"><div style="font-size:18px;font-weight:600">${i.title}</div><div class="meta">${i.published||''}</div><div>${i.excerpt||''}</div></a>`).join('')}</div>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  'custom-layout': {
    list: (items) => `<section class="grid" style="grid-template-columns:2fr 1fr">${items.map(i=>`<a class="card" style="display:block" href="${i.href}"><div style="font-size:18px;font-weight:600">${i.title}</div><div class="meta">${i.published||''}</div><div>${i.excerpt||''}</div></a>`).join('')}</section>`,
    postWrap: (html) => `<article class="post">${html}</article>`,
    twist: ''
  },
  'elegant-editorial': {
    list: (items) => {
      return `<div class="grid" style="grid-template-columns:2fr 1fr;gap:24px">`
        + `<div>`
        + items.map(i => `
            <article class="card" style="padding:16px 0;border-bottom:1px solid #e5e7eb">
              <a href="${i.href}" style="color:inherit;text-decoration:none">
                <div style="font-weight:800;font-size:22px;line-height:1.35">${i.title}</div>
                <div class="meta" style="margin-top:6px">${i.published||''}</div>
                ${i.excerpt?`<p style=\"margin:8px 0;color:#6b7280\">${i.excerpt}</p>`:''}
              </a>
            </article>
          `).join('')
        + `</div>`
        + `<aside>`
        + `<div class="card" style="padding:12px 0;border-bottom:1px solid #e5e7eb"><div class="meta">An elegant editorial of ideas and perspectives</div></div>`
        + `<div class="card" style="padding:12px 0"><a href=\"/blog/\" class=\"meta\">Browse all posts →</a></div>`
        + `</aside>`
        + `</div>`;
    },
    postWrap: (html) => `<article class=\"post\" style=\"font-family:ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif\">${html}</article>`,
    twist: ''
  }
};

function normalizeTheme(themeKey?: string | null): string {
  const k = (themeKey || 'minimal').toLowerCase();
  if (k in themeDecor) return k;
  // map directory names to keys
  const map: Record<string,string> = {
    'seo': 'seo-optimized',
    'seo_optimized': 'seo-optimized',
    'seooptimized': 'seo-optimized',
    'tech': 'tech-blog',
    'techblog': 'tech-blog',
    'customlayout': 'custom-layout',
    'e-commerce': 'ecommerce',
    'eleganteditorial': 'elegant-editorial',
    'elegant_editorial': 'elegant-editorial'
  };
  return map[k] || 'minimal';
}

export function renderIndex(meta: SiteMeta, items: ListItem[]): string {
  const key = normalizeTheme(meta.themeKey);
  const deco = themeDecor[key] || themeDecor.minimal;
  const content = deco.list ? deco.list(items) : themeDecor.minimal.list!(items);
  return layout({ ...meta, themeKey: key }, content, undefined, deco.twist);
}

function stripLeadingH1(html: string): string {
  if (!html) return '';
  return String(html).replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
}

export function renderPost(meta: SiteMeta, post: PostData): string {
  const key = normalizeTheme(meta.themeKey);
  const deco = themeDecor[key] || themeDecor.minimal;
  const contentNoH1 = stripLeadingH1(post.contentHtml);
  const inner = `
    <a href="/blog/" class="meta">← Back</a>
    <h1>${post.title}</h1>
    ${post.published ? `<div class="meta">${post.published}</div>` : ''}
    <div>${contentNoH1}</div>
  `;
  const wrapped = deco.postWrap ? deco.postWrap(inner) : inner;
  return layout({ ...meta, themeKey: key }, wrapped, post.title, deco.twist);
}
