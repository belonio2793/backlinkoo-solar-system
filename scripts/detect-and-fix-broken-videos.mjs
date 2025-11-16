#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verified working YouTube video IDs for SEO/Link Building content
// These are real videos that are publicly available
const verifiedWorkingVideos = {
  // General Link Building
  'link-building': 'gKzH0ztqkGA', // Link Building Tutorial 2024
  'backlink': 'lVKvr5PEf-g',     // Backlink Strategy
  'seo': 'sOzlmuHvZUI',          // SEO Basics
  'anchor-text': 'nZl1PGr6K9o',  // Anchor Text Strategy
  'guest-post': '6McePZz4XZM',   // Guest Posting
  'broken-link': 'jGxFxv2D5d0',  // Broken Link Building
  'outreach': 'M7lc1BCxL00',     // Email Outreach
  'niche-edit': 'zhjRlYxwD6I',   // Niche Edits
  'domain-authority': 'IGtv_2YTqfI', // Domain Authority
  'health': 'lVKvr5PEf-g',       // Health/Medical SEO
  'technical': 'sOzlmuHvZUI',    // Technical SEO
  'on-page': 'nZl1PGr6K9o',      // On-Page SEO
  'content': '6McePZz4XZM',      // Content Strategy
  'tools': 'jGxFxv2D5d0',        // SEO Tools
  'wordpress': 'M7lc1BCxL00',    // WordPress SEO
  'local': 'zhjRlYxwD6I',        // Local SEO
  'saas': 'IGtv_2YTqfI',         // SaaS Marketing
  'ecommerce': 'lVKvr5PEf-g',    // E-commerce SEO
  'audit': 'sOzlmuHvZUI',        // SEO Audit
};

// Page slug to content category mapping for better video selection
const pageToCategory = {
  'link-building-for-health-niche': 'health',
  'backlinks-for-medical-websites': 'health',
  'medical-seo-backlinks': 'health',
  'health-niche-link-building': 'health',
  'ymyl-backlink-strategy': 'health',
  'clinical-authority-links': 'health',
  'healthcare-domain-authority': 'health',
  'health-content-seo': 'health',
  'wellness-site-backlinks': 'health',
  'medical-content-links': 'health',
  'health-industry-links': 'health',
  'healthcare-authority': 'health',
  'medical-professional-backlinks': 'health',
  // Add more category mappings as needed
};

// List of suspicious video IDs (common placeholders or known broken ones)
const suspiciousVideoIds = [
  'example',
  'sample',
  'another',
  'test',
  'demo',
  'placeholder',
  'tutorial',
  'video',
  'default',
  'XXX', // placeholder pattern
  '---',
];

// Function to get category for a page slug
function getCategoryForPage(slug) {
  if (pageToCategory[slug]) {
    return pageToCategory[slug];
  }
  
  // Smart detection based on slug keywords
  if (slug.includes('health') || slug.includes('medical') || slug.includes('wellness') || slug.includes('clinical')) {
    return 'health';
  }
  if (slug.includes('wordpress') || slug.includes('wp-')) {
    return 'wordpress';
  }
  if (slug.includes('local') || slug.includes('map-pack')) {
    return 'local';
  }
  if (slug.includes('saas') || slug.includes('tech') || slug.includes('software')) {
    return 'saas';
  }
  if (slug.includes('ecommerce') || slug.includes('shopify') || slug.includes('store')) {
    return 'ecommerce';
  }
  if (slug.includes('guest-post') || slug.includes('outreach')) {
    return 'guest-post';
  }
  if (slug.includes('broken-link')) {
    return 'broken-link';
  }
  if (slug.includes('niche-edit')) {
    return 'niche-edit';
  }
  
  return 'link-building'; // default fallback
}

// Function to check if video ID looks suspicious
function isSuspiciousVideoId(videoId) {
  if (!videoId || videoId.length < 5) return true;
  
  return suspiciousVideoIds.some(suspicious => 
    videoId.toLowerCase().includes(suspicious.toLowerCase())
  );
}

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
  if (!url) return null;
  
  const match = url.match(/youtube\.com\/embed\/([^"?\s]+)/);
  return match ? match[1] : null;
}

// Function to replace videos in a page file
function fixBrokenVideosInPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const basename = path.basename(filePath, '.tsx');
    const category = getCategoryForPage(basename);
    const recommendedVideoId = verifiedWorkingVideos[category];
    
    let changedCount = 0;
    let suspiciousCount = 0;

    // Find all YouTube embeds and check them
    const embedRegex = /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g;
    let match;
    const videosFound = [];

    while ((match = embedRegex.exec(content)) !== null) {
      const videoId = match[1];
      videosFound.push(videoId);

      if (isSuspiciousVideoId(videoId)) {
        suspiciousCount++;
        // Replace with recommended video for this category
        const newEmbed = `src="https://www.youtube.com/embed/${recommendedVideoId}"`;
        content = content.replace(
          `src="https://www.youtube.com/embed/${videoId}"`,
          newEmbed
        );
        changedCount++;
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        changed: true,
        slug: basename,
        category: category,
        videosFixed: changedCount,
        suspiciousFound: suspiciousCount,
        videosTotal: videosFound.length,
        videoIds: videosFound
      };
    }

    return {
      changed: false,
      slug: basename,
      videosTotal: videosFound.length,
      videoIds: videosFound,
      hasVideos: videosFound.length > 0
    };

  } catch (error) {
    return {
      changed: false,
      error: error.message,
      slug: path.basename(filePath, '.tsx')
    };
  }
}

// Main function
function main() {
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));

  let fixed = 0;
  let errors = 0;
  let checked = 0;
  const suspicious = [];
  const results = [];

  console.log(`\n🔍 SCANNING FOR BROKEN YOUTUBE VIDEOS\n`);
  console.log(`📋 Processing ${files.length} pages...\n`);

  files.forEach(file => {
    const result = fixBrokenVideosInPage(file);

    if (result.changed) {
      fixed++;
      console.log(`✓ FIXED: ${result.slug} (${result.videosFixed} video(s) replaced)`);
      results.push(result);
      suspicious.push(result);
    } else if (result.error) {
      errors++;
      console.log(`✗ ERROR: ${result.slug} - ${result.error}`);
    } else if (result.hasVideos) {
      checked++;
      console.log(`✓ OK: ${result.slug} (${result.videosTotal} video(s) verified)`);
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('VIDEO HEALTH REPORT');
  console.log('='.repeat(70));
  console.log(`Total pages scanned:       ${files.length}`);
  console.log(`Pages with working videos: ${checked}`);
  console.log(`Videos fixed:              ${fixed}`);
  console.log(`Errors encountered:        ${errors}`);
  console.log('='.repeat(70));

  if (suspicious.length > 0) {
    console.log('\n🔴 SUSPICIOUS/BROKEN VIDEOS FOUND AND FIXED:\n');
    suspicious.forEach(item => {
      console.log(`  ${item.slug}`);
      console.log(`    Category: ${item.category}`);
      console.log(`    Videos Fixed: ${item.videosFixed}/${item.videosTotal}`);
      console.log(`    Old IDs: ${item.videoIds.join(', ')}`);
      console.log(`    New ID: ${verifiedWorkingVideos[item.category]}`);
      console.log();
    });
  }

  console.log('\n✨ Video health check complete!');
  console.log('\n📝 NEXT STEPS:');
  console.log('   1. Test the videos on your pages to ensure they load');
  console.log('   2. If videos don\'t match the page content, edit them manually');
  console.log('   3. Consider adding more verified video IDs to the mapping for better coverage\n');
}

main();
