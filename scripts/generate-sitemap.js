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
  name = name.replace(/\.[^/.]+$/, '');
  if (name.toLowerCase() === 'index') return '';
  name = name.replace(/[_\s]+/g, '-');
  name = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  name = name.replace(/[^a-zA-Z0-9-]/g, '');
  return name.toLowerCase();
}

function isValidRoute(route) {
  // allow only lower-case letters, numbers, dashes and slashes (and root)
  if (!route || route === '/') return true;
  return /^\/[a-z0-9\-\/]*$/.test(route);
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
        if (/^https?:\/\//i.test(p)) continue;
        if (p.startsWith('mailto:') || p.startsWith('tel:') || p.startsWith('#')) continue;
        if (p.includes('*') || p.includes(':') || p.includes('{') || p.includes('}')) continue;
        // remove query/hash fragments and collapse slashes
        let cleaned = p.split(/[?#]/)[0];
        const normalized = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
        const collapsed = normalized.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
        if (excludePrefixes.some((pre) => collapsed.startsWith(pre))) continue;
        if (!isValidRoute(collapsed)) continue;
        routes.add(collapsed);
      }
    }
  }

  const pagesDir = path.resolve('src/pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = walkDir(pagesDir).filter((f) => exts.includes(path.extname(f)));
    for (const pf of pageFiles) {
      const rel = path.relative(pagesDir, pf);
      const rawParts = rel.split(path.sep);
      const parts = rawParts.map((seg) => toUrlSegment(seg));
      let route = '/' + parts.filter(Boolean).join('/');
      if (route === '') route = '/';
      if (route.endsWith('/index')) route = route.replace(/\/index$/, '') || '/';
      if (excludePrefixes.some((pre) => route.startsWith(pre))) continue;
      if (route.includes(':') || route.includes('*') || route.includes('[') || route.includes(']')) continue;
      // final validation
      if (!isValidRoute(route)) continue;
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
