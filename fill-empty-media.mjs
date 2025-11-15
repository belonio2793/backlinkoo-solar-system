#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrls = [
  'https://images.pexels.com/photos/669621/pexels-photo-669621.jpeg',
  'https://images.pexels.com/photos/6281145/pexels-photo-6281145.jpeg',
  'https://images.pexels.com/photos/313691/pexels-photo-313691.jpeg',
  'https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg',
  'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
  'https://images.pexels.com/photos/33137126/pexels-photo-33137126.jpeg',
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
  'https://images.pexels.com/photos/6894103/pexels-photo-6894103.jpeg',
  'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
  'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg'
];

const videoUrls = [
  'https://videos.pexels.com/video-files/6003997/6003997-sd_540_960_30fps.mp4',
  'https://videos.pexels.com/video-files/6584525/6584525-sd_240_426_25fps.mp4'
];

let imageCounter = 0;
let videoCounter = 0;
let stats = {
  filesProcessed: 0,
  emptyMediaDivsFixed: 0,
  filesFixed: 0
};

function getNextImageUrl() {
  const url = imageUrls[imageCounter % imageUrls.length];
  imageCounter++;
  return url;
}

function getNextVideoUrl() {
  const url = videoUrls[videoCounter % videoUrls.length];
  videoCounter++;
  return url;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Pattern 1: <div class="media">\n\n<p> - completely empty media divs
  const emptyMediaPattern1 = /<div class="media">\s*<p>/g;
  
  content = content.replace(emptyMediaPattern1, (match) => {
    stats.emptyMediaDivsFixed++;
    const imageUrl = getNextImageUrl();
    const altText = 'Link building guide infographic';
    const img = `<img src="${imageUrl}" alt="${altText}" width="800" height="400" />\n    `;
    return `<div class="media">\n    ${img}<p>`;
  });

  // Pattern 2: <div class="media">\s*\n\s*\n<p> - media with extra whitespace
  const emptyMediaPattern2 = /<div class="media">\s{2,}<p>/g;
  
  content = content.replace(emptyMediaPattern2, (match) => {
    stats.emptyMediaDivsFixed++;
    const imageUrl = getNextImageUrl();
    const altText = 'Link building guide infographic';
    const img = `<img src="${imageUrl}" alt="${altText}" width="800" height="400" />\n    `;
    return `<div class="media">\n    ${img}<p>`;
  });

  // Pattern 3: Check for media divs that only have whitespace before the closing </div>
  const mediaRegex = /<div class="media">(\s*)<\/div>/g;
  content = content.replace(mediaRegex, (match) => {
    stats.emptyMediaDivsFixed++;
    const imageUrl = getNextImageUrl();
    const altText = 'Link building guide infographic';
    const img = `<img src="${imageUrl}" alt="${altText}" width="800" height="400" />`;
    return `<div class="media">\n    ${img}\n    <p><em>Strategic content infographic (Source: Backlinkoo)</em></p>\n  </div>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    stats.filesProcessed++;
    return true;
  }
  return false;
}

// Main execution
console.log('Scanning for empty media divs...\n');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(pagesDir, file);
    try {
      const fixed = processFile(filePath);
      if (fixed) {
        stats.filesFixed++;
        console.log(`✓ Fixed: ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error: ${file} - ${error.message}`);
    }
  }
});

console.log('\n===== Summary =====');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Empty media divs fixed: ${stats.emptyMediaDivsFixed}`);
console.log(`Total files fixed: ${stats.filesFixed}`);
