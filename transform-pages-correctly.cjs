#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generateComponentName(name) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/\./g, '');
}

function transformPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.tsx');
    
    // Extract h1 title
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Link Building Guide';
    
    // Extract HTML from dangerouslySetInnerHTML - match the string between __html: " and the closing "
    // This regex matches: __html: "  ... multi-line content ... "
    const htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*"((?:[^"\\]|\\.)*)"\s*\}\}/s);
    
    if (!htmlMatch || !htmlMatch[1]) {
      return { success: false, reason: 'no html found' };
    }

    let html = htmlMatch[1];
    
    // Unescape the HTML string (it was escaped in the original file)
    html = html
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\//g, '/')
      .replace(/\\'/g, "'");

    // Extract first paragraph for subtitle
    const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
    let subtitle = 'Complete guide';
    if (pMatch && pMatch[1]) {
      let text = pMatch[1]
        .replace(/<[^>]+>/g, '') // Remove any remaining tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#?\w+;/g, ' ');
      subtitle = text.trim();
      if (subtitle.length > 160) {
        subtitle = subtitle.substring(0, 157) + '...';
      }
    }

    const componentName = generateComponentName(fileName);
    const keywords = fileName.replace(/-/g, ', ') + ', SEO';
    
    // Properly escape HTML for template literal
    // Need to escape: backticks, dollar signs, and backslashes
    const escapedHtml = html
      .replace(/\\/g, '\\\\') // Escape backslashes first
      .replace(/`/g, '\\`')   // Escape backticks
      .replace(/\$/g, '\\$');  // Escape dollar signs
    
    // Escape quotes and special chars in metadata strings
    const safeTitle = title
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');
    
    const safeSubtitle = subtitle
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');

    const newContent = `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${safeTitle}";
  const subtitle = "${safeSubtitle}";
  const htmlContent = \`${escapedHtml}\`;
  const keywords = "${keywords}";
  
  return (
    <GenericPageTemplate
      title={title}
      subtitle={subtitle}
      htmlContent={htmlContent}
      keywords={keywords}
      description={subtitle}
    />
  );
};

export default ${componentName};
`;

    fs.writeFileSync(filePath, newContent, 'utf8');
    return { success: true };
  } catch (e) {
    console.error(`Error processing ${path.basename(filePath)}: ${e.message}`);
    return { success: false, reason: e.message.substring(0, 40) };
  }
}

console.log('🔄 Transforming pages correctly...\n');

const pagesDir = 'src/pages';
const allFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
const pageFiles = allFiles
  .filter(f => f.includes('-'))
  .map(f => path.join(pagesDir, f))
  .sort();

console.log(`Found ${pageFiles.length} pages\n`);

let success = 0, failed = 0;
const failures = [];

pageFiles.forEach((filePath, i) => {
  const fileName = path.basename(filePath, '.tsx');
  const result = transformPage(filePath);
  
  if (result.success) {
    success++;
    if ((i + 1) % 20 === 0) {
      console.log(`✅ Progress: ${i + 1}/${pageFiles.length}`);
    }
  } else {
    failed++;
    failures.push({ fileName, reason: result.reason });
  }
});

console.log(`\n✨ Complete!`);
console.log(`✅ Transformed: ${success}`);
console.log(`❌ Failed: ${failed}`);

if (failures.length > 0 && failures.length <= 20) {
  console.log(`\nFailed pages:`);
  failures.forEach(({ fileName, reason }) => {
    console.log(`  ❌ ${fileName}: ${reason}`);
  });
}
