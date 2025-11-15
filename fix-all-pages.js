const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// List of files with malformed dangerouslySetInnerHTML
const filesToFix = [
  'affordable-link-building-services.tsx',
  'authoritative-backlinks-for-e-commerce.tsx',
  'backlink-dr-vs-ur-metrics.tsx',
  'backlink-indexing-techniques.tsx',
  'backlink-quality-vs-quantity.tsx',
  'backlink-velocity-best-practices.tsx',
  'buy-backlinks-from-authority-sites.tsx',
  'buy-high-quality-backlinks.tsx',
  'competitor-backlink-gap-analysis.tsx',
  'do-backlinks-still-work-in-2025.tsx',
  'e-commerce-backlink-packages.tsx',
  'free-backlink-opportunities-2025.tsx',
  'guest-post-link-building.tsx',
  'haro-link-building-guide.tsx',
  'high-quality-backlinks-vs-low-quality.tsx',
  'how-much-do-backlinks-cost.tsx',
  'how-to-buy-backlinks-safely.tsx',
  'influencer-outreach-for-backlinks.tsx',
  'manual-backlink-outreach.tsx',
  'measuring-roi-on-backlinks.tsx',
  'multilingual-backlink-building.tsx',
  'resource-page-link-building.tsx',
  'saas-link-building-tactics.tsx',
  'top-backlink-providers-reviewed.tsx',
  'travel-blog-guest-posts.tsx',
  'voice-search-backlink-optimization.tsx',
  'where-to-find-high-quality-backlinks.tsx',
  'white-hat-link-building-techniques.tsx',
  'zero-click-search-link-strategies.tsx'
];

function extractHtmlContent(content) {
  // Find the dangerouslySetInnerHTML=<... part
  const match = content.match(/dangerouslySetInnerHTML=(<[^/][^>]*>[\s\S]*?)<\/div>\s*\/>/);
  if (match) {
    // Extract everything from the opening tag to before </div> />
    let htmlStr = match[1];
    
    // Remove the opening tag (e.g., <div class="..."> or <html>)
    htmlStr = htmlStr.replace(/^<[^>]*>/, '').trim();
    
    return htmlStr;
  }
  return null;
}

function fixFile(filePath, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has malformed dangerouslySetInnerHTML
    if (!content.includes('dangerouslySetInnerHTML=<')) {
      console.log(`Skipping ${fileName} - no malformed dangerouslySetInnerHTML found`);
      return false;
    }

    // Extract component name
    const componentMatch = content.match(/const\s+(\w+):\s*React\.FC/);
    const componentName = componentMatch ? componentMatch[1] : 'Component';

    // Extract the HTML content
    const htmlContent = extractHtmlContent(content);
    
    if (!htmlContent) {
      console.log(`⚠️  Could not extract HTML from ${fileName}`);
      return false;
    }

    // Create the fixed version
    const fixed = `import React from 'react';
import { Link } from 'react-router-dom';

const ${componentName}: React.FC = () => {
  const htmlContent = \`${htmlContent.replace(/`/g, '\\`')}\`;

  return (
    <>
      <div className="max-w-4xl mx-auto px-5 py-8 font-sans leading-relaxed text-gray-800">
        <h1>${extractTitle(content)}</h1>
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

function extractTitle(content) {
  const match = content.match(/<h1>([^<]+)<\/h1>/);
  return match ? match[1] : 'Page';
}

// Fix all files
let successCount = 0;
let failureCount = 0;

console.log(`Starting to fix ${filesToFix.length} files...\n`);

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
