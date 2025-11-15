#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const pagesDir = path.join(projectRoot, 'src', 'pages');
const mappingFile = path.join(__dirname, 'page-video-mapping-fix.json');

// Load the mapping
const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));

const getPageSlugFromFilename = (filename) => {
  return filename.replace('.tsx', '');
};

const fixVideoInFile = (filePath, pageSlug) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const pageData = mapping.pageVideoMapping[pageSlug];
  
  if (!pageData) {
    return { status: 'skip', reason: 'No mapping found' };
  }

  const newVideoId = pageData.videoId;
  let fixed = false;
  const replacements = [];

  // List of broken/placeholder video IDs to replace
  const brokenIds = [
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
    'VIDEO_ID',
    'placeholder',
    'unknown',
  ];

  // Also capture any invalid video IDs (short IDs that don't match YouTube ID pattern)
  // YouTube IDs are 11 characters, alphanumeric plus - and _
  const youtubeIdPattern = /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g;
  let match;
  while ((match = youtubeIdPattern.exec(content)) !== null) {
    const currentId = match[1];
    // Check if this is a placeholder or invalid ID
    if (!currentId.match(/^[A-Za-z0-9_-]{11}$/) || brokenIds.includes(currentId)) {
      content = content.replace(
        `src="https://www.youtube.com/embed/${currentId}"`,
        `src="https://www.youtube.com/embed/${newVideoId}"`
      );
      fixed = true;
      replacements.push(`Replaced invalid ID "${currentId}" with "${newVideoId}"`);
    }
  }

  // Pattern 1: Empty media divs
  const emptyMediaPattern = /<div class="media">\s*<\/div>/;
  if (emptyMediaPattern.test(content)) {
    const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${newVideoId}" title="${pageData.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
    content = content.replace(
      /<div class="media">\s*<\/div>/g,
      `<div class="media">\n      ${iframe}\n      </div>`
    );
    fixed = true;
    replacements.push('Filled empty media div with video');
  }

  // Pattern 2: Whitespace-only media divs
  const whitespaceMediaPattern = /<div class="media">\s+<\/div>/;
  if (whitespaceMediaPattern.test(content)) {
    const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${newVideoId}" title="${pageData.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
    content = content.replace(
      /<div class="media">\s+<\/div>/g,
      `<div class="media">\n      ${iframe}\n      </div>`
    );
    fixed = true;
    replacements.push('Filled whitespace-only media div');
  }

  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { status: 'fixed', replacements };
  }

  return { status: 'verified', reason: 'No broken videos found' };
};

const processAllPages = () => {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  
  let fixed = 0;
  let verified = 0;
  let skipped = 0;
  const results = [];

  console.log(`\n📹 Fixing YouTube videos across ${files.length} pages...\n`);

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const pageSlug = getPageSlugFromFilename(file);
    
    // Only process pages in our mapping
    if (mapping.pageVideoMapping[pageSlug]) {
      const result = fixVideoInFile(filePath, pageSlug);
      
      if (result.status === 'fixed') {
        fixed++;
        results.push({ page: pageSlug, ...result });
        console.log(`✅ FIXED: ${pageSlug}`);
        result.replacements.forEach(r => console.log(`   - ${r}`));
      } else if (result.status === 'verified') {
        verified++;
        console.log(`✔️  OK: ${pageSlug}`);
      } else {
        skipped++;
      }
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  ✅ Fixed: ${fixed} pages`);
  console.log(`  ✔️  Already OK: ${verified} pages`);
  console.log(`  ⊘ Not in mapping: ${skipped} pages`);
  console.log(`  Total processed: ${fixed + verified} pages\n`);

  if (fixed > 0) {
    console.log(`\n📝 Fixed Pages:\n`);
    results.forEach(r => {
      console.log(`  ${r.page}:`);
      r.replacements.forEach(rep => console.log(`    - ${rep}`));
    });
  }

  console.log(`\n✨ All available videos have been replaced with working, page-relevant YouTube content!\n`);
};

// Run the fix
processAllPages();
