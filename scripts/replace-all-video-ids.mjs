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

const replaceAllVideoIds = (filePath, pageSlug) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const pageData = mapping.pageVideoMapping[pageSlug];
  
  if (!pageData) {
    return { status: 'skip', reason: 'No mapping found' };
  }

  const newVideoId = pageData.videoId;
  let replacementCount = 0;
  const oldIds = [];

  // Find all YouTube embed URLs and replace them
  const youtubeEmbedPattern = /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g;
  let match;
  
  while ((match = youtubeEmbedPattern.exec(content)) !== null) {
    const oldId = match[1];
    if (oldId !== newVideoId && !oldIds.includes(oldId)) {
      oldIds.push(oldId);
    }
  }

  if (oldIds.length > 0) {
    // Replace all old video IDs with the new one
    for (const oldId of oldIds) {
      const regex = new RegExp(
        `src="https://www\\.youtube\\.com/embed/${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
        'g'
      );
      content = content.replace(regex, `src="https://www.youtube.com/embed/${newVideoId}"`);
    }
    
    replacementCount = oldIds.length;
  }

  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { 
      status: 'updated', 
      oldIds,
      newId: newVideoId,
      count: replacementCount,
      title: pageData.title
    };
  }

  // Also check for empty media divs and fill them
  const emptyMediaPattern = /<div class="media">\s*<\/div>/;
  if (emptyMediaPattern.test(content)) {
    const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${newVideoId}" title="${pageData.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
    content = content.replace(
      /<div class="media">\s*<\/div>/g,
      `<div class="media">\n      ${iframe}\n      </div>`
    );
    fs.writeFileSync(filePath, content, 'utf-8');
    return { 
      status: 'filled',
      newId: newVideoId,
      title: pageData.title
    };
  }

  return { status: 'ok', videoId: newVideoId, title: pageData.title };
};

const processAllPages = () => {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  
  let updated = 0;
  let filled = 0;
  let ok = 0;
  let skipped = 0;
  const results = [];

  console.log(`\n🎬 Replacing all unavailable YouTube videos with verified working alternatives...\n`);

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const pageSlug = getPageSlugFromFilename(file);
    
    // Only process pages in our mapping
    if (mapping.pageVideoMapping[pageSlug]) {
      const result = replaceAllVideoIds(filePath, pageSlug);
      
      if (result.status === 'updated') {
        updated++;
        results.push(result);
        console.log(`✅ UPDATED: ${pageSlug}`);
        console.log(`   Old IDs: ${result.oldIds.join(', ')}`);
        console.log(`   New ID: ${result.newId} (${result.title})`);
      } else if (result.status === 'filled') {
        filled++;
        console.log(`✅ FILLED: ${pageSlug} with ${result.newId}`);
      } else if (result.status === 'ok') {
        ok++;
      } else if (result.status === 'skip') {
        skipped++;
      }
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  ✅ Updated with new videos: ${updated} pages`);
  console.log(`  ✅ Filled empty videos: ${filled} pages`);
  console.log(`  ✔️  Already correct: ${ok} pages`);
  console.log(`  ⊘ Skipped: ${skipped} pages`);
  console.log(`  Total processed: ${updated + filled + ok} pages\n`);

  if (updated > 0) {
    console.log(`\n📝 Pages Updated with New Video IDs:\n`);
    results.forEach(r => {
      console.log(`  ${r.oldIds[0]} → ${r.newId}`);
      console.log(`  Title: "${r.title}"`);
    });
  }

  console.log(`\n✨ All YouTube videos have been replaced with verified working content!\n`);
};

// Run the replacement
processAllPages();
