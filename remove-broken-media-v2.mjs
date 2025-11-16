#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BROKEN_VIDEO_ID = 'O8VlxLkFoWo';
const BROKEN_IMAGE_URL = 'photo-1460925895917-adf4e565db18';

function removeMediaBlocks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let removed = 0;

    // Find and remove media blocks containing the broken video
    // Look for pattern: <div class="media"> ... src="...O8VlxLkFoWo" ... </div>
    const lines = content.split('\n');
    let newLines = [];
    let skipUntilClosingDiv = false;
    let mediaBlockStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is the start of a media block with broken video
      if (line.includes('<div class="media">') && !skipUntilClosingDiv) {
        // Look ahead to see if this media block contains broken video or image
        let hasbrokenVideo = false;
        let hasbrokenImage = false;
        
        for (let j = i; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes(BROKEN_VIDEO_ID)) {
            hasbrokenVideo = true;
            break;
          }
          if (lines[j].includes(BROKEN_IMAGE_URL)) {
            hasbrokenImage = true;
            break;
          }
          if (lines[j].includes('</div>') && j > i) {
            break;
          }
        }

        if (hasbrokenVideo || hasbrokenImage) {
          skipUntilClosingDiv = true;
          mediaBlockStart = i;
          removed++;
          continue;
        }
      }

      // Check if we're at the end of a media block we should skip
      if (skipUntilClosingDiv && line.includes('</div>')) {
        skipUntilClosingDiv = false;
        // Don't add this closing div line
        continue;
      }

      // Only add lines that are not being skipped
      if (!skipUntilClosingDiv) {
        newLines.push(line);
      }
    }

    const newContent = newLines.join('\n');

    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
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

  console.log('\n🎯 Broken media removed:');
  console.log(`  • Video ID: ${BROKEN_VIDEO_ID}`);
  console.log(`  • Image URL: ${BROKEN_IMAGE_URL}\n`);
}

main();
