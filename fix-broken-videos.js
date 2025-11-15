const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to match empty media blocks with only captions (no iframe/video)
// These are broken placeholder videos
const patterns = [
  // Media block with only caption (no iframe)
  /<div class="media"[^>]*>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/g,
  // Variant with style attribute
  /<div class="media"[^>]*style="[^"]*"[^>]*>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/g,
  // Empty media blocks
  /<div class="media"[^>]*>\s*<\/div>/g,
];

const srcDir = path.join(__dirname, 'src', 'pages');

// Find all page files
glob('**/*.tsx', { cwd: srcDir }, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }

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

      // Also remove iframes with placeholder video IDs
      const placeholderPattern = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*><\/iframe>/g;
      if (placeholderPattern.test(content)) {
        // Find the surrounding media div and remove the entire block
        content = content.replace(
          /<div class="media"[^>]*>\s*<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*><\/iframe>\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>/g,
          ''
        );
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
});
