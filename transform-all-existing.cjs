#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function generateComponentName(name) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/\./g, ''); // Remove dots for class names
}

function transformPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Get page name from filename
    const fileName = path.basename(filePath, '.tsx');
    
    // Find the h1 title from dangerouslySetInnerHTML
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Link Building Guide: ' + fileName.replace(/-/g, ' ');
    
    // Extract HTML from dangerouslySetInnerHTML - match between __html: and closing }}
    // More flexible regex to handle both single and double quotes
    let htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*['"](.+?)['"][,\s\}]/s);
    
    if (!htmlMatch) {
      // Try alternative pattern
      htmlMatch = content.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*['"]([^]*?)['"][,\s\}]/s);
    }
    
    if (!htmlMatch || !htmlMatch[1]) {
      return { success: false, reason: 'no html content' };
    }

    let html = htmlMatch[1];
    
    // Unescape common sequences
    html = html
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\//g, '/');

    // Extract subtitle from first p tag or create one
    const subtitleMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
    let subtitle = 'Complete guide on ' + title.toLowerCase();
    if (subtitleMatch && subtitleMatch[1]) {
      subtitle = subtitleMatch[1].trim();
      if (subtitle.length > 160) {
        subtitle = subtitle.substring(0, 157) + '...';
      }
    }
    
    const componentName = generateComponentName(fileName);
    const keywords = fileName.replace(/-/g, ', ') + ', SEO';
    
    // Escape backticks in HTML
    const escapedHtml = html.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    // Escape quotes in title and subtitle
    const safeTitle = title.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const safeSubtitle = subtitle.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    
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
    return { success: false, reason: e.message.substring(0, 50) };
  }
}

console.log('🚀 Transforming all existing pages...\n');

// Find all hyphenated page files
const pageFiles = glob.sync('src/pages/*-*.tsx').sort();

console.log(`Found ${pageFiles.length} pages to transform\n`);

let success = 0, failed = 0;
const failures = [];

pageFiles.forEach((filePath, i) => {
  const fileName = path.basename(filePath, '.tsx');
  const result = transformPage(filePath);
  
  if (result.success) {
    success++;
    if ((i + 1) % 25 === 0) {
      console.log(`✅ Processed: ${i + 1}/${pageFiles.length}`);
    }
  } else {
    failed++;
    failures.push({ fileName, reason: result.reason });
    console.log(`❌ ${fileName} (${result.reason})`);
  }
});

console.log(`\n✨ Transformation complete!`);
console.log(`✅ Successful: ${success}`);
console.log(`❌ Failed: ${failed}`);

if (failures.length > 0 && failures.length <= 10) {
  console.log('\nFailed pages:');
  failures.forEach(({ fileName, reason }) => {
    console.log(`  - ${fileName}: ${reason}`);
  });
}
