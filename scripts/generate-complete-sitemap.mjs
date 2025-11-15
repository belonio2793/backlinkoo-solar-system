import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(filename) {
  // Remove .tsx extension
  let slug = filename.replace('.tsx', '');
  
  // Convert PascalCase to kebab-case
  slug = slug
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  return slug;
}

function generateSitemap() {
  // Get all .tsx files in src/pages
  const pagesDir = path.join(__dirname, '../src/pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  
  console.log(`Found ${files.length} .tsx files in src/pages\n`);

  // Generate URLs
  const urls = files
    .map(filename => {
      const slug = slugify(filename);
      return {
        filename,
        slug,
        url: `https://backlinkoo.com/${slug}`
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n`;
  xml += `    <loc>https://backlinkoo.com/</loc>\n`;
  xml += `    <lastmod>2024-01-15</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  urls.forEach(({ slug, url }) => {
    // Set priority based on page type
    let priority = 0.7;
    let changefreq = 'monthly';

    // Higher priority for backlink-related pages
    if (slug.includes('backlink') || slug.includes('link-building')) {
      priority = 0.8;
    }
    // Medium priority for tool/service pages
    else if (slug.includes('ahrefs') || slug.includes('moz') || slug.includes('semrush') || slug.includes('tool') || slug.includes('service')) {
      priority = 0.7;
    }
    // Lower priority for misc pages
    else if (slug.match(/^[A-Z]/) || slug === 'index') {
      priority = 0.5;
      changefreq = 'quarterly';
    }

    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>2024-01-15</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  // Write sitemap
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);

  console.log(`✅ Complete sitemap generated!`);
  console.log(`📊 Total URLs: ${urls.length + 1} (includes homepage)`);
  console.log(`📁 File: public/sitemap.xml`);
  console.log(`\n📋 Sample URLs:`);
  urls.slice(0, 10).forEach(({ url }) => console.log(`   ${url}`));
  console.log(`   ...and ${urls.length - 10} more`);

  // Generate URL list report
  const reportPath = path.join(__dirname, '../SITEMAP_URLS.txt');
  let report = `All URLs in Sitemap (${urls.length + 1} total)\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `${'='.repeat(80)}\n\n`;
  report += `Home: https://backlinkoo.com/\n\n`;
  urls.forEach(({ url }) => {
    report += `${url}\n`;
  });

  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 URL list saved to: SITEMAP_URLS.txt`);

  return urls.length + 1;
}

const total = generateSitemap();
