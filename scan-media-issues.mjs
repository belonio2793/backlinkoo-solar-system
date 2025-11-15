#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

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

let issues = {
  placeholderContent: [],
  duplicateImages: {},
  duplicateVideos: {},
  missingMediaContent: [],
  missingAltText: [],
  totalImages: 0,
  totalVideos: 0
};

function analyzeFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for placeholder content
  if (content.includes('Placeholder content generated')) {
    issues.placeholderContent.push(fileName);
  }

  // Count images and track duplicates
  const imgRegex = /src="(https:\/\/images\.pexels\.com[^"]+)"/g;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const url = imgMatch[1];
    issues.totalImages++;
    issues.duplicateImages[url] = (issues.duplicateImages[url] || 0) + 1;
    
    // Check for missing alt text
    const imgFullRegex = /<img[^>]*src="[^"]*"[^>]*>/g;
    let fullMatch;
    while ((fullMatch = imgFullRegex.exec(content)) !== null) {
      if (fullMatch[0].includes(url) && !fullMatch[0].includes('alt=')) {
        issues.missingAltText.push({ file: fileName, url });
      }
    }
  }

  // Count videos and track duplicates
  const videoRegex = /src="(https:\/\/videos\.pexels\.com[^"]+)"/g;
  let videoMatch;
  while ((videoMatch = videoRegex.exec(content)) !== null) {
    const url = videoMatch[1];
    issues.totalVideos++;
    issues.duplicateVideos[url] = (issues.duplicateVideos[url] || 0) + 1;
  }

  // Check for empty media divs or missing content
  const mediaRegex = /<div class="media">([\s\S]*?)<\/div>/g;
  let mediaMatch;
  while ((mediaMatch = mediaRegex.exec(content)) !== null) {
    const mediaContent = mediaMatch[1];
    const hasImg = mediaContent.includes('<img');
    const hasVideo = mediaContent.includes('<video') || mediaContent.includes('<iframe');
    
    if (!hasImg && !hasVideo) {
      issues.missingMediaContent.push({
        file: fileName,
        content: mediaContent.substring(0, 100)
      });
    }
  }
}

// Scan all files
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(pagesDir, file);
    try {
      analyzeFile(filePath, file);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
    }
  }
});

// Generate report
console.log('\n===== MEDIA ISSUES REPORT =====\n');

console.log('1. PLACEHOLDER CONTENT FOUND:');
if (issues.placeholderContent.length > 0) {
  issues.placeholderContent.forEach(file => {
    console.log(`   - ${file}`);
  });
} else {
  console.log('   ✓ None found');
}

console.log('\n2. MISSING MEDIA CONTENT (empty media divs):');
if (issues.missingMediaContent.length > 0) {
  issues.missingMediaContent.forEach(item => {
    console.log(`   - ${item.file}: "${item.content.trim()}..."`);
  });
} else {
  console.log('   ✓ None found');
}

console.log('\n3. MISSING ALT TEXT ON IMAGES:');
if (issues.missingAltText.length > 0) {
  issues.missingAltText.forEach(item => {
    console.log(`   - ${item.file}`);
  });
} else {
  console.log('   ✓ None found');
}

console.log('\n4. DUPLICATE IMAGE URLS:');
const duplicateImgs = Object.entries(issues.duplicateImages).filter(([url, count]) => count > 3);
if (duplicateImgs.length > 0) {
  duplicateImgs.forEach(([url, count]) => {
    console.log(`   - ${url.substring(url.lastIndexOf('/') + 1)}: appears ${count} times`);
  });
} else {
  console.log('   ✓ No excessive duplicates (all URLs appear ≤3 times)');
}

console.log('\n5. DUPLICATE VIDEO URLS:');
const duplicateVids = Object.entries(issues.duplicateVideos).filter(([url, count]) => count > 3);
if (duplicateVids.length > 0) {
  duplicateVids.forEach(([url, count]) => {
    console.log(`   - ${url.substring(url.lastIndexOf('-') + 1, url.lastIndexOf('-') + 8)}: appears ${count} times`);
  });
} else {
  console.log('   ✓ No excessive duplicates (all URLs appear ≤3 times)');
}

console.log('\n6. STATISTICS:');
console.log(`   - Total images found: ${issues.totalImages}`);
console.log(`   - Total videos found: ${issues.totalVideos}`);
console.log(`   - Unique image URLs: ${Object.keys(issues.duplicateImages).length}`);
console.log(`   - Unique video URLs: ${Object.keys(issues.duplicateVideos).length}`);

console.log('\n===== SUMMARY =====');
const totalIssues = issues.placeholderContent.length + issues.missingMediaContent.length + 
                     issues.missingAltText.length + duplicateImgs.length + duplicateVids.length;
console.log(`Total issues found: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('✓ All media assets are properly configured!');
}
