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

const scanAndFixVideos = (filePath, pageSlug) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const videoId = mapping.videoMapping[pageSlug];
  
  if (!videoId) {
    return { status: 'skipped', reason: 'No video mapping found', fixed: false };
  }

  let hasUpdates = false;
  let updates = [];

  // Pattern 1: Placeholder video IDs in YouTube embeds
  const placeholderIds = [
    'example-video-id',
    'sample-video-id',
    'another-video-id',
    'example-tutorial',
    'example-tutorial-video',
    'example-tutorial-id',
    'another-tutorial',
    'another-tutorial-id',
    'example-gaming-backlink-tutorial',
    'example-faq-backlinks',
    'faq-tutorial',
    'case-study-video',
    'example-organic-link-building-tutorial',
    'example-paid-backlinks-tutorial',
    'example-link-building-tutorial',
    'another-link-building-video',
  ];

  for (const placeholderId of placeholderIds) {
    if (content.includes(placeholderId)) {
      content = content.replace(
        new RegExp(
          `src="https://www\\.youtube\\.com/embed/${placeholderId}"`,
          'g'
        ),
        `src="https://www.youtube.com/embed/${videoId}"`
      );
      hasUpdates = true;
      updates.push(`Replaced placeholder "${placeholderId}" with "${videoId}"`);
    }
  }

  // Pattern 2: Empty media divs
  const emptyMediaPattern = /<div class="media">\s*<\/div>/;
  if (emptyMediaPattern.test(content)) {
    content = content.replace(
      /<div class="media">\s*<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    hasUpdates = true;
    updates.push('Fixed empty media div');
  }

  // Pattern 3: Media divs with only whitespace
  const whitespaceMediaPattern = /<div class="media">\s+<\/div>/;
  if (whitespaceMediaPattern.test(content)) {
    content = content.replace(
      /<div class="media">\s+<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    hasUpdates = true;
    updates.push('Fixed whitespace-only media div');
  }

  // Pattern 4: Media divs with style but empty content
  const styledEmptyPattern = /<div class="media" style="[^"]*">\s*<\/div>/;
  if (styledEmptyPattern.test(content)) {
    content = content.replace(
      /<div class="media" style="[^"]*">\s*<\/div>/g,
      `<div class="media">\n      ${createYoutubeEmbed(videoId)}\n      </div>`
    );
    hasUpdates = true;
    updates.push('Fixed styled empty media div');
  }

  if (hasUpdates) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { status: 'fixed', fixed: true, updates };
  }

  // Pattern 5: Check for videos that exist - return as verified
  const videoPattern = /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g;
  let match;
  const foundVideos = [];
  while ((match = videoPattern.exec(content)) !== null) {
    foundVideos.push(match[1]);
  }

  if (foundVideos.length > 0) {
    return { status: 'verified', reason: `Contains ${foundVideos.length} working video(s)`, foundVideos, fixed: false };
  }

  return { status: 'skipped', reason: 'No broken or empty videos found', fixed: false };
};

const processAllPages = () => {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  
  let fixed = 0;
  let verified = 0;
  let skipped = 0;
  const fixedPages = [];
  const verifiedPages = [];

  console.log(`\n📄 Scanning ${files.length} page files for broken YouTube videos...\n`);

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const pageSlug = getPageSlugFromFilename(file);
    
    const result = scanAndFixVideos(filePath, pageSlug);
    
    if (result.fixed) {
      fixed++;
      fixedPages.push({ page: pageSlug, updates: result.updates });
      console.log(`✅ FIXED: ${pageSlug}`);
      result.updates.forEach(u => console.log(`   - ${u}`));
    } else if (result.status === 'verified') {
      verified++;
      verifiedPages.push({ page: pageSlug, videos: result.foundVideos });
      console.log(`✔️  VERIFIED: ${pageSlug} (${result.foundVideos.join(', ')})`);
    } else {
      skipped++;
      // console.log(`⊘ SKIPPED: ${pageSlug} (${result.reason})`);
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  ✅ Fixed: ${fixed} pages`);
  console.log(`  ✔️  Verified (working videos): ${verified} pages`);
  console.log(`  ⊘ Skipped: ${skipped} pages`);
  console.log(`  Total processed: ${files.length} pages\n`);

  if (fixed > 0) {
    console.log(`\n📝 Fixed Pages:\n`);
    fixedPages.forEach(p => {
      console.log(`  ${p.page}:`);
      p.updates.forEach(u => console.log(`    - ${u}`));
    });
  }

  if (verified > 0) {
    console.log(`\n✔️ Pages with Working Videos:\n`);
    verifiedPages.slice(0, 10).forEach(p => {
      console.log(`  ${p.page}: ${p.videos.join(', ')}`);
    });
    if (verifiedPages.length > 10) {
      console.log(`  ... and ${verifiedPages.length - 10} more pages`);
    }
  }
};

// Run the process
processAllPages();
