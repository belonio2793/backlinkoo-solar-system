import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pattern to match empty/broken media blocks with only captions (no iframe)
const patterns = [
  // Media block with only caption (no iframe) - main pattern
  /<div class="media"[^>]*>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/g,
  // Variant with newlines
  /<div class="media"[^>]*>\s*\n\s*<p><em>[^<]*<\/em><\/p>\s*\n\s*<\/div>/g,
  // Empty media blocks
  /<div class="media"[^>]*>\s*<\/div>/g,
];

const srcDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx'));

let totalFixed = 0;
const fixedFiles = [];

files.forEach((file) => {
  const filePath = path.join(srcDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let fileFixed = false;

    // Apply all patterns
    patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        fileFixed = true;
      }
    });

    // Also remove iframes with placeholder video IDs within media divs
    const placeholderMediaPattern = /<div class="media"[^>]*>\s*<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*><\/iframe>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/g;
    if (placeholderMediaPattern.test(content)) {
      content = content.replace(placeholderMediaPattern, '');
      fileFixed = true;
    }

    if (fileFixed && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      fixedFiles.push(file);
      totalFixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

console.log(`\n✅ Fixed ${totalFixed} files with broken videos`);
if (fixedFiles.length > 0) {
  console.log('\nFiles fixed:');
  fixedFiles.forEach((f) => console.log(`  - ${f}`));
}
