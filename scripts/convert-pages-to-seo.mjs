import fs from 'fs';
import path from 'path';

const pagesDir = path.resolve('src/pages');
if (!fs.existsSync(pagesDir)) {
  console.error('No src/pages directory found');
  process.exit(1);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkDir(p));
    else files.push(p);
  }
  return files;
}

const pageFiles = walkDir(pagesDir).filter(f => f.endsWith('.tsx'));
console.log('Found', pageFiles.length, 'tsx files under src/pages');

let modified = 0;
for (const file of pageFiles) {
  let src = fs.readFileSync(file, 'utf8');
  if (!/upsertMeta\(|document.title\s*=|injectJSONLD\(/.test(src)) continue;

  // Try to extract title, description, pageUrl
  const titleMatch = src.match(/document.title\s*=\s*['`"]([\s\S]*?)['`"];?/);
  const descMatch = src.match(/upsertMeta\(\s*['\"]description['\"]\s*,\s*['`"]([\s\S]*?)['`"]\s*\)/);
  const pageUrlMatch = src.match(/(?:const\s+pageUrl\s*=|const\s+canonical\s*=)\s*['`"]([\s\S]*?)['`"]/);
  const canonicalMatch = src.match(/upsertCanonical\(\s*([^)]+)\s*\)/);

  const title = titleMatch ? titleMatch[1].trim() : null;
  const description = descMatch ? descMatch[1].trim() : null;
  const pageUrl = pageUrlMatch ? pageUrlMatch[1].trim() : null;

  if (!title && !description && !pageUrl) continue; // nothing to do

  // Remove the useEffect block that contains those upserts
  const newSrc = src.replace(/useEffect\(() => \{[\s\S]*?\}\s*,\s*\[\s*\]\s*\)\s*;?/m, '');

  let out = newSrc;

  // Ensure Seo import
  if (!/import\s+Seo\s+from\s+['\"]@\/components\/Seo['\"];?/.test(out)) {
    out = out.replace(/(import\s+\{?[\s\S]*?\}?\s+from\s+['\"][^'\"]+['\"];?\n)/, '$1import Seo from \"@/components/Seo\";\n');
    // If no imports matched, prepend
    if (out === newSrc) {
      out = 'import Seo from \"@/components/Seo\";\n' + out;
    }
  }

  // Insert constants near top of component function. Find export default function X() { and insert below
  const compMatch = out.match(/export default function\s+([A-Za-z0-9_]+)\s*\(.*?\)\s*\{/);
  if (compMatch) {
    const insertPos = out.indexOf(compMatch[0]) + compMatch[0].length;
    const parts = [];
    if (title) parts.push(`  const title = ${JSON.stringify(title)};`);
    if (description) parts.push(`  const description = ${JSON.stringify(description)};`);
    if (pageUrl) parts.push(`  const canonical = ${JSON.stringify(pageUrl)};`);
    if (parts.length) {
      const insertText = '\n' + parts.join('\n') + '\n';
      out = out.slice(0, insertPos) + insertText + out.slice(insertPos);
    }

    // Add Seo component into returned JSX. We'll insert immediately after the opening div inside return.
    // Find pattern: return (\n\s*<div
    const returnDivMatch = out.match(/return\s*\(\s*<div[\s\S]*?>/m);
    if (returnDivMatch) {
      const divStart = out.indexOf(returnDivMatch[0]);
      const afterDiv = divStart + returnDivMatch[0].length;
      // Prepare jsonLd placeholder: combine article/software detection? For now pass jsonLd null and software if present
      const jsonLdParts = [];
      if (/injectJSONLD\(\s*['\"]roosterme-article['\"]/m.test(src)) {
        jsonLdParts.push('jsonLd');
      }
      // Simpler: pass jsonLd as null; Seo will ignore if null
      const seoTag = `\n      <Seo title={title} description={description} canonical={typeof canonical !== 'undefined' ? canonical : undefined} />\n`;
      out = out.slice(0, afterDiv) + seoTag + out.slice(afterDiv);
    }
  }

  // Write back
  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    modified++;
    console.log('Updated', file);
  }
}

console.log('Modified files:', modified);
