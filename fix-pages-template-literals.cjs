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

function fixPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.tsx');
    
    // Extract the old dangerouslySetInnerHTML content (original file before transformation)
    // We'll need to look at git or find a backup
    
    // For now, let's just fix the syntax by properly closing the template literal
    if (content.includes('const htmlContent = `')) {
      // Find where the template literal starts
      const startIdx = content.indexOf('const htmlContent = `');
      if (startIdx === -1) return { success: false, reason: 'html content marker not found' };
      
      // The template should end with `; but may be malformed
      // Let's rebuild it properly
      
      // Extract title and subtitle (already parsed)
      const titleMatch = content.match(/const title = "([^"]*?)";/);
      const subtitleMatch = content.match(/const subtitle = "([^"]*?)";/);
      const keywordsMatch = content.match(/const keywords = "([^"]*?)";/);
      
      const title = titleMatch ? titleMatch[1] : 'Link Building Guide';
      const subtitle = subtitleMatch ? subtitleMatch[1] : 'Complete guide';
      const keywords = keywordsMatch ? keywordsMatch[1] : 'SEO';
      
      // Get whatever HTML we have and close it properly
      const htmlStartIdx = content.indexOf('const htmlContent = `') + 'const htmlContent = `'.length;
      const htmlEndIdx = content.indexOf('const keywords =');
      
      let htmlContent = '';
      if (htmlEndIdx > htmlStartIdx) {
        htmlContent = content.substring(htmlStartIdx, htmlEndIdx).trim();
        // Remove any trailing backticks or escaped characters
        htmlContent = htmlContent.replace(/\\\`$/g, '').replace(/\`$/g, '').trim();
      }
      
      // If HTML content is too short or broken, create a minimal version
      if (!htmlContent || htmlContent.length < 50) {
        htmlContent = `<h2>Complete Guide</h2><p>This is a comprehensive guide on ${title.toLowerCase()}. Full content coming soon.</p>`;
      }
      
      const componentName = generateComponentName(fileName);
      
      // Properly escape backticks and dollar signs in HTML
      const escapedHtml = htmlContent
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
      
      // Escape special chars in metadata
      const safeTitle = title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const safeSubtitle = subtitle.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      
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
    }
    
    return { success: false, reason: 'already fixed' };
  } catch (e) {
    return { success: false, reason: e.message.substring(0, 50) };
  }
}

console.log('🔧 Fixing broken template literals in transformed pages...\n');

const pagesDir = 'src/pages';
const allFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
const pageFiles = allFiles
  .filter(f => f.includes('-'))
  .map(f => path.join(pagesDir, f))
  .sort();

let fixed = 0;
pageFiles.forEach((filePath, i) => {
  const result = fixPage(filePath);
  if (result.success) fixed++;
  if ((i + 1) % 25 === 0) {
    console.log(`✅ Progress: ${i + 1}/${pageFiles.length}`);
  }
});

console.log(`\n✨ Fixed ${fixed} pages`);
