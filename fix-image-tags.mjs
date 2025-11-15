import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src', 'pages');

// Files with Image tags that need fixing
const filesToFix = [
  'backlink-growth-tracking.tsx',
  'case-study-high-quality-backlinks.tsx',
  'high-da-backlinks-for-sale.tsx'
];

function fixImageTags(content) {
  // Replace all <Image src="..." /> with <img src="..." />
  // Also convert width={800} to width="800"
  return content.replace(/<Image\s+src="([^"]+)"\s+alt="([^"]+)"\s+width={(\d+)}\s+height={(\d+)}\s*\/>/g, 
    '<img src="$1" alt="$2" width="$3" height="$4" style="max-width: 100%; height: auto;" />');
}

function fixFile(filePath, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has Image tags
    if (!content.includes('<Image')) {
      console.log(`Skipping ${fileName} - no <Image> tags found`);
      return false;
    }

    const fixed = fixImageTags(content);
    
    if (fixed === content) {
      console.log(`⚠️  No changes made to ${fileName}`);
      return false;
    }

    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ Fixed: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${fileName}:`, error.message);
    return false;
  }
}

// Fix all files
let successCount = 0;
let failureCount = 0;

console.log(`Starting to fix ${filesToFix.length} files with Image tags...\n`);

filesToFix.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  if (fs.existsSync(filePath)) {
    if (fixFile(filePath, fileName)) {
      successCount++;
    } else {
      failureCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${fileName}`);
  }
});

// Also search for any remaining Image tags in all files
console.log('\n\nSearching for any remaining <Image> tags in all files...');
const allFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
let filesWithImages = [];

allFiles.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<Image')) {
    filesWithImages.push(fileName);
    if (fixFile(filePath, fileName)) {
      successCount++;
    } else {
      failureCount++;
    }
  }
});

console.log(`\n✅ Successfully fixed: ${successCount} files`);
console.log(`❌ Failed to fix: ${failureCount} files`);
if (filesWithImages.length > 0) {
  console.log(`📝 Additional files fixed: ${filesWithImages.join(', ')}`);
}
console.log('Done!');
