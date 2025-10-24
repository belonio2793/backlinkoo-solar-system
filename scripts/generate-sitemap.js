import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://backlinkoo.com';
const searchDirs = ['src'];

const excludePrefixes = [
  '/admin', '/debug', '/diagnostic', '/email', '/payment', '/subscription', '/test',
  '/edge-function', '/route-sync-test', '/campaign', '/dashboard', '/my-', '/auth',
  '/report', '/saved-reports'
];

function walkDir(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      if (f === 'node_modules' || f === 'dist' || f === '.git') continue;
      walkDir(fp, filelist);
    } else {
      filelist.push(fp);
    }
  }
  return filelist;
}

function toUrlSegment(name) {
  // Remove extension if present
  name = name.replace(/\.[^/.]+$/, '');
  // Handle index specially
  if (name.toLowerCase() === 'index') return '';
  // Replace spaces and underscores
  name = name.replace(/[_\s]+/g, '-');
  // Convert CamelCase/PascalCase to kebab-case: FooBar -> foo-bar
  name = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  // Remove characters not URL-friendly
  name = name.replace(/[^a-zA-Z0-9-]/g, '');
  return name.toLowerCase();
}

function collectRoutes() {
  const routes = new Set(['/']);

  const exts = ['.js', '.jsx', '.ts', '.tsx', '.html'];
  const files = [];
  for (const dir of searchDirs) {
    const abs = path.resolve(dir);
    if (!fs.existsSync(abs)) continue;
    const all = walkDir(abs);
    for (const f of all) {
      if (exts.includes(path.extname(f))) files.push(f);
    }
  }

  // Regexes to find route-like references in code
  const routeRegexes = [
    /<Route\s+[^>]*\bpath\s*=\s*["'`]([^"'`]+)["'`]/g,
    /\bpath\s*=\s*{\s*["'`]([^"'`]+)["'`]\s*}/g,
    /<Link\s+[^>]*\bto\s*=\s*["'`]([^"'`]+)["'`]/g,
    /href\s*=\s*["'`]([^"'`]+)["'`]/g,
    /navigate\(\s*["'`]([^"'`]+)["'`]\s*\)/g
  ];

  for (const fp of files) {
    let src;
    try { src = fs.readFileSync(fp, 'utf8'); } catch (e) { continue; }

    for (const re of routeRegexes) {
      let m;
      while ((m = re.exec(src))) {
        const p = m[1];
        if (!p) continue;
        // ignore absolute external links
        if (/^https?:\/\//i.test(p)) continue;
        // normalize mailto, tel, anchors
        if (p.startsWith('mailto:') || p.startsWith('tel:') || p.startsWith('#')) continue;
        // skip wildcard or parameterized client routes that cannot be resolved statically
        if (p.includes('*') || p.includes(':') || p.includes('{') || p.includes('}')) continue;
        const normalized = p.startsWith('/') ? p : `/${p}`;
        if (excludePrefixes.some((pre) => normalized.startsWith(pre))) continue;
        // collapse trailing slashes
        const cleaned = normalized.replace(/\/+$|(?<=.)\/+$/g, '') || '/';
        routes.add(cleaned);
      }
    }
  }

  // Discover pages by filename under src/pages (file-system based mapping)
  const pagesDir = path.resolve('src/pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = walkDir(pagesDir).filter((f) => exts.includes(path.extname(f)));
    for (const pf of pageFiles) {
      const rel = path.relative(pagesDir, pf);
      // Split into segments and convert each to URL-safe segment
      const parts = rel.split(path.sep).map((seg) => toUrlSegment(seg));
      let route = '/' + parts.filter(Boolean).join('/');
      if (route === '') route = '/';
      if (route.endsWith('/index')) route = route.replace(/\/index$/, '') || '/';
      // skip excluded prefixes
      if (excludePrefixes.some((pre) => route.startsWith(pre))) continue;
      // skip dynamic segments
      if (route.includes(':') || route.includes('*') || route.includes('[') || route.includes(']')) continue;
      routes.add(route);
    }
  }

  return Array.from(routes)
    .filter(Boolean)
    .map((r) => (r.startsWith('/') ? r : `/${r}`))
    .filter((r, i, arr) => arr.indexOf(r) === i)
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function buildSitemap(urls) {
  const base = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0,10);
  const lines = urls.map((r) => {
    const loc = escapeXml(base + r);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    lines.join('\n') +
    `\n</urlset>\n`;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

(function main() {
  const routes = collectRoutes();
  const xml = buildSitemap(routes);
  const outDir = path.resolve('public');
  ensureDir(outDir);
  const outFile = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outFile, xml, 'utf8');
  console.log(`Generated ${outFile} with ${routes.length} URLs`);
})();
