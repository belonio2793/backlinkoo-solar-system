#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractVideoIds(content) {
  const pattern = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g;
  const ids = [];
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    ids.push({
      videoId: match[1],
      fullMatch: match[0],
      index: match.index,
    });
  }
  
  return ids;
}

function removeDuplicateVideos(filePath, pageSlug) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Extract all video IDs from the page
    const videoIds = extractVideoIds(content);
    
    if (videoIds.length <= 1) {
      return { 
        changed: false, 
        duplicates: 0, 
        totalVideos: videoIds.length,
        duplicateIds: [] 
      };
    }
    
    // Find duplicates
    const seen = new Set();
    const duplicates = [];
    
    videoIds.forEach(({ videoId }) => {
      if (seen.has(videoId)) {
        duplicates.push(videoId);
      } else {
        seen.add(videoId);
      }
    });
    
    if (duplicates.length === 0) {
      return { 
        changed: false, 
        duplicates: 0, 
        totalVideos: videoIds.length,
        duplicateIds: [] 
      };
    }
    
    // Remove duplicate videos (keep first occurrence of each)
    const seen2 = new Set();
    
    duplicates.forEach(videoId => {
      const pattern = new RegExp(
        `<iframe[^>]*src="https:\\/\\/www\\.youtube\\.com\\/embed\\/${videoId}"[^>]*><\\/iframe>`,
        'g'
      );
      
      let count = 0;
      content = content.replace(pattern, (match) => {
        count++;
        // Keep the first one, remove the rest
        if (count === 1) {
          return match;
        }
        // Also remove surrounding container if it exists
        return '';
      });
    });
    
    // Clean up empty media divs that might be left behind
    content = content.replace(
      /<div class="media">\s*\n\s*<\/div>/g,
      ''
    );
    content = content.replace(
      /<div class="media">\s*<\/div>/g,
      ''
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { 
        changed: true, 
        duplicates: duplicates.length, 
        totalVideos: videoIds.length,
        duplicateIds: duplicates,
        removed: duplicates.length
      };
    }
    
    return { 
      changed: false, 
      duplicates: 0, 
      totalVideos: videoIds.length,
      duplicateIds: [] 
    };
  } catch (error) {
    return { 
      changed: false, 
      error: error.message,
      duplicates: 0 
    };
  }
}

function main() {
  const baseDir = path.resolve(__dirname, '..');
  const pagesDir = path.join(baseDir, 'src', 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(`❌ Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));

  console.log(`\n🔍 Scanning ${files.length} pages for duplicate videos...\n`);

  let pagesWithDuplicates = 0;
  let totalDuplicatesRemoved = 0;
  const duplicatePages = [];

  files.forEach((file, idx) => {
    const filename = path.basename(file);
    const slug = filename.replace('.tsx', '');
    const result = removeDuplicateVideos(file, slug);

    if (result.error) {
      console.log(`❌ ERROR: ${slug}`);
    } else if (result.changed) {
      pagesWithDuplicates++;
      totalDuplicatesRemoved += result.duplicates;
      duplicatePages.push({
        slug,
        duplicatesRemoved: result.duplicates,
        videoIds: result.duplicateIds,
        total: result.totalVideos
      });
      console.log(`✓ FIXED: ${slug} (removed ${result.duplicates} duplicate video(s))`);
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('DUPLICATE VIDEO REMOVAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✓ Pages scanned: ${files.length}`);
  console.log(`✓ Pages with duplicates: ${pagesWithDuplicates}`);
  console.log(`✓ Total duplicates removed: ${totalDuplicatesRemoved}`);
  console.log('='.repeat(70));

  if (pagesWithDuplicates > 0) {
    console.log(`\n📋 Pages with duplicates removed:\n`);
    duplicatePages.forEach(page => {
      console.log(`   • ${page.slug}`);
      console.log(`     └─ Removed ${page.duplicatesRemoved} duplicate(s), ${page.total - page.duplicatesRemoved} video(s) remaining`);
    });
  } else {
    console.log(`\n✨ No duplicate videos found! All pages are clean.`);
  }

  console.log('\n✅ Complete!');
}

main();
