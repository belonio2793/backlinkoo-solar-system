#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pattern to match broken/placeholder YouTube embed iframes
const brokenVideoPattern = /<div class="media"[^>]*>\s*<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*><\/iframe>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/gi;

// Alternative pattern for iframes without the full div wrapper
const brokenIframePattern = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*><\/iframe>/gi;

const pagesDir = path.join(__dirname, 'src', 'pages');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Remove broken video divs with full wrapper
    content = content.replace(brokenVideoPattern, '');
    
    // If the file was modified, write it back
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx') && f !== 'NotFound.tsx')
    .map(f => path.join(pagesDir, f));

  let fixed = 0;
  let total = files.length;

  files.forEach(file => {
    if (fixFile(file)) {
      fixed++;
    }
  });

  console.log(`\n=== Summary ===`);
  console.log(`Total pages scanned: ${total}`);
  console.log(`Pages fixed: ${fixed}`);
}

main();
