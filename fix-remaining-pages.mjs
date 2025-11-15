import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src', 'pages');

// Files that failed with the first script
const filesToFix = [
  'buy-backlinks-from-authority-sites.tsx',
  'manual-backlink-outreach.tsx',
  'measuring-roi-on-backlinks.tsx',
  'multilingual-backlink-building.tsx',
  'top-backlink-providers-reviewed.tsx',
  'voice-search-backlink-optimization.tsx',
  'white-hat-link-building-techniques.tsx',
  'zero-click-search-link-strategies.tsx'
];

function extractHtmlContentForHtmlTag(content) {
  // This handles files with <html>...</html> structure
  const match = content.match(/dangerouslySetInnerHTML=<html>([\s\S]*?)<\/html>\s*\/>/);
  if (match) {
    // Extract from <html> to </html>
    return '<html>' + match[1] + '</html>';
  }
  
  // Fallback for other structures
  const match2 = content.match(/dangerouslySetInnerHTML=(<[^/][^>]*>[\s\S]*?)<\/[^>]+>\s*\/>/);
  if (match2) {
    return match2[1];
  }
  
  return null;
}

function extractTitle(content) {
  const match = content.match(/<h1>([^<]+)<\/h1>/);
  return match ? match[1] : 'Page';
}

function fixFile(filePath, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has malformed dangerouslySetInnerHTML
    if (!content.includes('dangerouslySetInnerHTML=')) {
      console.log(`Skipping ${fileName} - no malformed dangerouslySetInnerHTML found`);
      return false;
    }

    // Extract component name
    const componentMatch = content.match(/const\s+(\w+):\s*React\.FC/);
    const componentName = componentMatch ? componentMatch[1] : 'Component';

    // Extract the HTML content
    let htmlContent = extractHtmlContentForHtmlTag(content);
    
    if (!htmlContent) {
      console.log(`⚠️  Could not extract HTML from ${fileName}`);
      return false;
    }

    // If it's a full HTML document, extract just the body content
    if (htmlContent.includes('<html>')) {
      const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
      if (bodyMatch) {
        htmlContent = bodyMatch[1];
      } else {
        // Just remove the html and head tags
        htmlContent = htmlContent.replace(/<html>/, '').replace(/<\/html>/, '').replace(/<head>[\s\S]*?<\/head>/, '').trim();
      }
    }

    const title = extractTitle(content);

    // Create the fixed version
    const fixed = `import React from 'react';
import { Link } from 'react-router-dom';

const ${componentName}: React.FC = () => {
  const htmlContent = \`${htmlContent.replace(/`/g, '\\`')}\`;

  return (
    <>
      <div className="max-w-4xl mx-auto px-5 py-8 font-sans leading-relaxed text-gray-800">
        <h1>${title}</h1>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        <div className="author-bio">
          <p><strong>About the Author</strong>: Jane Doe, SEO Director at Backlinkoo with 10+ years in link building. Featured on Forbes.</p>
        </div>

        <button className="cta-button" onClick={() => window.location.href = '/register'}>
          Register for Backlink ∞ Today – Get Your First 10 links Free!
        </button>
        <p><em>Ready to transform your SEO? Join 10,000+ users building unbreakable link profiles.</em></p>

        <p>Related Reads: <Link to="/senuke">SENUKE Review</Link> | <Link to="/xrumer">XRumer Setup</Link> | <a href="https://searchengineland.com/backlinks-2025-456789" target="_blank" rel="noopener noreferrer">Search Engine Land Trends</a></p>
      </div>
    </>
  );
};

export default ${componentName};`;

    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ Fixed: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${fileName}:`, error.message);
    return false;
  }
}

// Fix all files
let successCount = 0;
let failureCount = 0;

console.log(`Starting to fix ${filesToFix.length} remaining files...\n`);

filesToFix.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  if (fs.existsSync(filePath)) {
    if (fixFile(filePath, fileName)) {
      successCount++;
    } else {
      failureCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${fileName}`);
  }
});

console.log(`\n✅ Successfully fixed: ${successCount} files`);
console.log(`❌ Failed to fix: ${failureCount} files`);
console.log('Done!');
