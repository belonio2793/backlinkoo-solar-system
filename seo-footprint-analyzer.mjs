#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

// Helper: Extract text content from HTML
function extractText(content) {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper: Get first N characters of content
function getContentHash(content) {
  const text = extractText(content);
  return text.substring(0, 300);
}

// Helper: Extract meta tags and title
function extractMetaTags(content) {
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const descMatch = content.match(/subtitle[^>]*>(.*?)<\/h2>/i);
  return {
    title: titleMatch ? extractText(titleMatch[1]) : '',
    description: descMatch ? extractText(descMatch[1]) : ''
  };
}

// Helper: Count internal links
function countInternalLinks(content) {
  const links = content.match(/href="\/[^"]*"/g) || [];
  return links.length;
}

// Helper: Find FAQ pattern
function hasFAQPattern(content) {
  return /FAQ|Frequently Asked|Common Questions/i.test(content);
}

// Helper: Detect AI patterns
function detectAIPatterns(content) {
  const text = extractText(content);
  const patterns = [
    /In (this article|this guide|this post)/gi,
    /Let's (explore|dive into|discuss)/gi,
    /Here are (some|the|5|10|20)/gi,
    /To summarize|In conclusion/gi,
    /Whether you're|If you're/gi,
    /This is (why|important because)/gi,
    /You may (wonder|ask|think)/gi,
    /The bottom line is/gi,
    /Our (team|experts) (have|has) found/gi,
  ];
  
  let patternCount = 0;
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    patternCount += matches.length;
  });
  
  return patternCount;
}

// Helper: Extract structure metrics
function analyzeStructure(content) {
  const h1Count = (content.match(/<h1/gi) || []).length;
  const h2Count = (content.match(/<h2/gi) || []).length;
  const h3Count = (content.match(/<h3/gi) || []).length;
  const pCount = (content.match(/<p>/gi) || []).length;
  const listCount = (content.match(/<(ul|ol)>/gi) || []).length;
  
  return { h1Count, h2Count, h3Count, pCount, listCount };
}

function analyzeAllPages() {
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => ({
      name: f,
      path: path.join(pagesDir, f),
      slug: f.replace('.tsx', '')
    }));

  console.log(`\n📊 SEO FOOTPRINT ANALYSIS - ${files.length} Pages\n`);
  console.log('='.repeat(80));

  // 1. DUPLICATE CONTENT ANALYSIS
  console.log('\n1️⃣  DUPLICATE/SIMILAR CONTENT CHECK');
  console.log('-'.repeat(80));
  
  const contentHashes = new Map();
  const duplicateGroups = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const hash = getContentHash(content);
    
    if (contentHashes.has(hash)) {
      const group = contentHashes.get(hash) || [];
      group.push(file.slug);
      contentHashes.set(hash, group);
    } else {
      contentHashes.set(hash, [file.slug]);
    }
  });

  let duplicateCount = 0;
  contentHashes.forEach((slugs, hash) => {
    if (slugs.length > 1) {
      duplicateCount += slugs.length - 1;
      duplicateGroups.push({ slugs, contentPreview: hash.substring(0, 100) });
    }
  });

  console.log(`⚠️  Found ${duplicateCount} pages with highly similar opening content`);
  if (duplicateGroups.length > 0 && duplicateGroups.length <= 5) {
    duplicateGroups.forEach((group, idx) => {
      console.log(`\n   Group ${idx + 1}: ${group.slugs.length} pages`);
      group.slugs.forEach(slug => console.log(`     • ${slug}`));
    });
  } else if (duplicateGroups.length > 5) {
    console.log(`\n   (Showing first 5 groups of ${duplicateGroups.length} total)`);
    duplicateGroups.slice(0, 5).forEach((group, idx) => {
      console.log(`\n   Group ${idx + 1}: ${group.slugs.length} pages`);
      group.slugs.slice(0, 3).forEach(slug => console.log(`     • ${slug}`));
      if (group.slugs.length > 3) console.log(`     ... and ${group.slugs.length - 3} more`);
    });
  }

  // 2. META TAG ANALYSIS
  console.log(`\n\n2️⃣  META TAG ANALYSIS`);
  console.log('-'.repeat(80));
  
  const titleMap = new Map();
  const descMap = new Map();
  
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const meta = extractMetaTags(content);
    
    if (meta.title) {
      titleMap.set(meta.title, (titleMap.get(meta.title) || 0) + 1);
    }
    if (meta.description) {
      descMap.set(meta.description, (descMap.get(meta.description) || 0) + 1);
    }
  });

  const duplicateTitles = Array.from(titleMap.entries()).filter(([_, count]) => count > 1).length;
  const duplicateDescs = Array.from(descMap.entries()).filter(([_, count]) => count > 1).length;

  console.log(`⚠️  Duplicate Title Tags: ${duplicateTitles}`);
  console.log(`⚠️  Duplicate Meta Descriptions: ${duplicateDescs}`);

  // 3. STRUCTURE ANALYSIS
  console.log(`\n\n3️⃣  REPETITIVE STRUCTURE CHECK`);
  console.log('-'.repeat(80));
  
  const structures = [];
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const struct = analyzeStructure(content);
    structures.push({ slug: file.slug, ...struct });
  });

  // Find common structure patterns
  const structurePatterns = new Map();
  structures.forEach(s => {
    const pattern = `h1:${s.h1Count},h2:${s.h2Count},h3:${s.h3Count},p:${s.pCount}`;
    if (!structurePatterns.has(pattern)) {
      structurePatterns.set(pattern, []);
    }
    structurePatterns.get(pattern).push(s.slug);
  });

  let highlyRepetitive = 0;
  structurePatterns.forEach((pages, pattern) => {
    if (pages.length > 20) {
      highlyRepetitive += pages.length;
      console.log(`\n⚠️  Pattern: ${pattern}`);
      console.log(`    Affects ${pages.length} pages`);
      console.log(`    Examples: ${pages.slice(0, 3).join(', ')}`);
    }
  });

  // 4. AI GENERATION PATTERNS
  console.log(`\n\n4️⃣  AI GENERATION PATTERN DETECTION`);
  console.log('-'.repeat(80));
  
  const aiPatterns = [];
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const count = detectAIPatterns(content);
    if (count > 10) {
      aiPatterns.push({ slug: file.slug, count });
    }
  });

  if (aiPatterns.length > 0) {
    console.log(`⚠️  Found ${aiPatterns.length} pages with high AI pattern density`);
    console.log(`\n   Top offenders (pattern occurrences):`);
    aiPatterns.sort((a, b) => b.count - a.count).slice(0, 10).forEach(p => {
      console.log(`   • ${p.slug}: ${p.count} patterns`);
    });
  } else {
    console.log(`✓ No significant AI generation patterns detected`);
  }

  // 5. INTERNAL LINKING ANALYSIS
  console.log(`\n\n5️⃣  INTERNAL LINKING PATTERN CHECK`);
  console.log('-'.repeat(80));
  
  const linkCounts = [];
  const linkTargets = new Map();
  
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const count = countInternalLinks(content);
    linkCounts.push({ slug: file.slug, count });
    
    // Find most linked pages
    const linkMatches = content.match(/href="\/([^"]*)"(?!.*href="\/)/g) || [];
    linkMatches.forEach(link => {
      const target = link.replace(/href="/, '').replace(/"/, '');
      linkTargets.set(target, (linkTargets.get(target) || 0) + 1);
    });
  });

  const avgLinks = linkCounts.reduce((sum, l) => sum + l.count, 0) / linkCounts.length;
  const overLinked = linkCounts.filter(l => l.count > avgLinks * 2);

  console.log(`📈 Average internal links per page: ${avgLinks.toFixed(1)}`);
  console.log(`⚠���  Pages with excessive internal links (>${(avgLinks * 2).toFixed(0)}): ${overLinked.length}`);
  
  if (overLinked.length > 0) {
    console.log(`\n   Top over-linked pages:`);
    overLinked.sort((a, b) => b.count - a.count).slice(0, 5).forEach(p => {
      console.log(`   • ${p.slug}: ${p.count} links`);
    });
  }

  const topTargets = Array.from(linkTargets.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  if (topTargets.length > 0) {
    console.log(`\n   Most linked pages:`);
    topTargets.forEach(([target, count]) => {
      console.log(`   • ${target} (${count} times)`);
    });
  }

  // 6. FAQ PATTERN ANALYSIS
  console.log(`\n\n6️⃣  FAQ SECTION PATTERN ANALYSIS`);
  console.log('-'.repeat(80));
  
  const faqPages = files.filter(f => {
    const content = fs.readFileSync(f.path, 'utf-8');
    return hasFAQPattern(content);
  });

  console.log(`📋 Pages with FAQ sections: ${faqPages.length} (${(faqPages.length/files.length*100).toFixed(1)}%)`);
  if (faqPages.length / files.length > 0.7) {
    console.log(`⚠️  WARNING: Nearly all pages have FAQ sections - check for boilerplate FAQ content`);
  }

  // 7. BOILERPLATE CHECK
  console.log(`\n\n7️⃣  BOILERPLATE & HEADER/FOOTER ANALYSIS`);
  console.log('-'.repeat(80));
  
  const contentLines = new Map();
  
  files.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const lines = content.split('\n');
    
    // Check for repeated blocks
    lines.forEach((line, idx) => {
      if (line.length > 50 && line.includes('<p>')) {
        contentLines.set(line, (contentLines.get(line) || 0) + 1);
      }
    });
  });

  const commonLines = Array.from(contentLines.entries())
    .filter(([_, count]) => count > 50)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (commonLines.length > 0) {
    console.log(`⚠️  Found ${commonLines.length} text blocks appearing in 50+ pages:\n`);
    commonLines.forEach(([line, count]) => {
      const preview = line.replace(/<[^>]*>/g, '').substring(0, 60);
      console.log(`   • "${preview}..." (${count} pages)`);
    });
  } else {
    console.log(`✓ No highly repetitive boilerplate blocks detected`);
  }

  // FINAL REPORT
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('OVERALL RISK ASSESSMENT');
  console.log('='.repeat(80));

  let riskScore = 0;
  const issues = [];

  if (duplicateCount > 50) {
    riskScore += 20;
    issues.push('HIGH: Significant duplicate content risk');
  } else if (duplicateCount > 10) {
    riskScore += 10;
    issues.push('MEDIUM: Some duplicate content detected');
  }

  if (duplicateTitles > 20) {
    riskScore += 15;
    issues.push('HIGH: Many duplicate title tags');
  } else if (duplicateTitles > 5) {
    riskScore += 5;
    issues.push('MEDIUM: Some duplicate titles');
  }

  if (highlyRepetitive > 100) {
    riskScore += 15;
    issues.push('HIGH: Very repetitive page structure');
  } else if (highlyRepetitive > 0) {
    riskScore += 8;
    issues.push('MEDIUM: Repetitive structure patterns');
  }

  if (aiPatterns.length > 50) {
    riskScore += 12;
    issues.push('MEDIUM: High density of AI-generated patterns');
  }

  if (overLinked.length > 20) {
    riskScore += 10;
    issues.push('MEDIUM: Excessive internal linking on many pages');
  }

  if (commonLines.length > 3) {
    riskScore += 8;
    issues.push('MEDIUM: Boilerplate content detected');
  }

  console.log(`\n🎯 RISK SCORE: ${riskScore}/100\n`);

  if (riskScore >= 70) {
    console.log('🚨 CRITICAL: High risk of Google penalty. Immediate action needed.');
  } else if (riskScore >= 50) {
    console.log('⚠️  WARNING: Moderate risk. Recommended to address issues.');
  } else if (riskScore >= 30) {
    console.log('⚡ CAUTION: Some risk factors present. Monitor closely.');
  } else {
    console.log('✅ LOW RISK: Most SEO footprints are acceptable.');
  }

  if (issues.length > 0) {
    console.log('\n📌 Key Issues:');
    issues.forEach(issue => console.log(`   • ${issue}`));
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

analyzeAllPages();
