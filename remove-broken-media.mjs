#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Broken video ID and image URL to remove
const BROKEN_VIDEO_ID = 'O8VlxLkFoWo';
const BROKEN_IMAGE_URL = 'photo-1460925895917-adf4e565db18';

function removeMediaBlocks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let removed = 0;

    // Pattern 1: Remove entire <div class="media">...</div> block containing the broken video
    const videoPattern = new RegExp(
      `<div class="media">\\s*<iframe[^>]*src="https:\\/\\/www\\.youtube\\.com\\/embed\\/${BROKEN_VIDEO_ID}"[^>]*>.*?<\\/iframe>\\s*<p>[^<]*<\\/p>\\s*<\\/div>`,
      'gs'
    );
    
    if (videoPattern.test(content)) {
      content = content.replace(videoPattern, '');
      removed++;
    }

    // Pattern 2: Remove entire <div class="media">...</div> block containing the broken image
    const imagePattern = new RegExp(
      `<div class="media">\\s*<img[^>]*src="https:\\/\\/images\\.unsplash\\.com\\/photo-1460925895917-adf4e565db18[^"]*"[^>]*>\\s*<p>[^<]*<\\/p>\\s*<\\/div>`,
      'gs'
    );
    
    if (imagePattern.test(content)) {
      content = content.replace(imagePattern, '');
      removed++;
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        changed: true,
        file: path.basename(filePath),
        removed: removed
      };
    }

    return {
      changed: false,
      file: path.basename(filePath)
    };
  } catch (error) {
    return {
      error: error.message,
      file: path.basename(filePath)
    };
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));

  let totalRemoved = 0;
  let filesChanged = 0;
  const changedFiles = [];

  console.log(`\n🗑️  REMOVING BROKEN MEDIA EMBEDS\n`);
  console.log(`📋 Processing ${files.length} pages...\n`);

  files.forEach(file => {
    const result = removeMediaBlocks(file);

    if (result.changed) {
      filesChanged++;
      totalRemoved += result.removed;
      changedFiles.push(result);
      console.log(`✓ ${result.file}: Removed ${result.removed} broken media block(s)`);
    } else if (result.error) {
      console.log(`✗ ${result.file}: Error - ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('BROKEN MEDIA REMOVAL REPORT');
  console.log('='.repeat(70));
  console.log(`Total pages scanned:           ${files.length}`);
  console.log(`Pages with removed media:      ${filesChanged}`);
  console.log(`Total broken embeds removed:   ${totalRemoved}`);
  console.log('='.repeat(70));

  if (filesChanged > 0) {
    console.log(`\n✅ Successfully removed ${totalRemoved} broken media embed(s) from ${filesChanged} page(s)!\n`);
    console.log('Removed from:');
    changedFiles.forEach(f => {
      console.log(`  • ${f.file}`);
    });
  } else {
    console.log(`\n✅ No broken media found to remove.\n`);
  }

  console.log('\n🎯 Removed:');
  console.log(`  • Video ID: ${BROKEN_VIDEO_ID}`);
  console.log(`  • Image URL: ${BROKEN_IMAGE_URL}\n`);
}

main();
