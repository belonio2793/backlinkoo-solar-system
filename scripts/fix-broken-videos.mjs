#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const pagesDir = path.join(projectRoot, 'src', 'pages');
const mappingFile = path.join(__dirname, 'video-replacement-mapping.json');

const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));

const getPageSlugFromFilename = (filename) => {
  return filename.replace('.tsx', '');
};

const createYoutubeEmbed = (videoId) => {
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="Link building tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
};

const fixBrokenVideosInFile = (filePath, pageSlug) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const videoId = mapping.videoMapping[pageSlug];
  
  if (!videoId) {
    console.log(`⚠️  No video mapping found for: ${pageSlug}`);
    return false;
  }

  // Pattern 1: Empty iframe in media div
  const emptyIframePattern = /<div class="media">\s*<\/div>/g;
  if (emptyIframePattern.test(content)) {
    content = content.replace(
      /<div class="media">\s*<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    console.log(`✅ Fixed empty media div in: ${pageSlug}`);
    return true;
  }

  // Pattern 2: Media div with only closing tag at end
  const mediaWithNewlinePattern = /<div class="media">\s*\n\s*<\/div>/g;
  if (mediaWithNewlinePattern.test(content)) {
    content = content.replace(
      /<div class="media">\s*\n\s*<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    console.log(`✅ Fixed empty media div (with newline) in: ${pageSlug}`);
    return true;
  }

  // Pattern 3: Media div with style attribute and empty content
  const styledEmptyMediaPattern = /<div class="media" style="[^"]*">\s*<\/div>/g;
  if (styledEmptyMediaPattern.test(content)) {
    content = content.replace(
      /<div class="media" style="[^"]*">\s*<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    console.log(`✅ Fixed styled empty media div in: ${pageSlug}`);
    return true;
  }

  // Pattern 4: Check for placeholder video IDs
  const placeholderPatterns = [
    /example-video-id/,
    /sample-video-id/,
    /another-video-id/,
    /example-tutorial/,
    /tutorial-id/,
    /placeholder/i,
    /VIDEO_ID/,
  ];

  let hasPlaceholder = false;
  for (const pattern of placeholderPatterns) {
    if (pattern.test(content)) {
      hasPlaceholder = true;
      // Replace broken placeholder videos with correct video ID
      content = content.replace(
        /src="https:\/\/www\.youtube\.com\/embed\/([^"]*?)"/g,
        (match, currentId) => {
          if (placeholderPatterns.some(p => p.test(currentId))) {
            return `src="https://www.youtube.com/embed/${videoId}"`;
          }
          return match;
        }
      );
      console.log(`✅ Replaced placeholder video ID in: ${pageSlug}`);
      break;
    }
  }

  if (!hasPlaceholder && !emptyIframePattern.test(content)) {
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
};

const fixAllPages = () => {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  let fixed = 0;
  let skipped = 0;

  console.log(`\n📄 Processing ${files.length} page files...\n`);

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const pageSlug = getPageSlugFromFilename(file);
    
    if (fixBrokenVideosInFile(filePath, pageSlug)) {
      fixed++;
    } else {
      skipped++;
    }
  }

  console.log(`\n✨ Summary:`);
  console.log(`  Fixed: ${fixed} pages`);
  console.log(`  Skipped: ${skipped} pages (no broken videos found)`);
  console.log(`  Total processed: ${files.length} pages\n`);
};

// Run the fix
fixAllPages();
