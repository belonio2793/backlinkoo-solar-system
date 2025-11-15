const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// Get all .tsx files
const files = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') && (
    f === 'affordable-link-building-services.tsx' ||
    f === 'authoritative-backlinks-for-e-commerce.tsx' ||
    f === 'backlink-building-for-beginners.tsx' ||
    f === 'backlink-dr-vs-ur-metrics.tsx' ||
    f === 'backlink-indexing-techniques.tsx' ||
    f === 'backlink-quality-vs-quantity.tsx' ||
    f === 'backlink-velocity-best-practices.tsx' ||
    f === 'buy-backlinks-from-authority-sites.tsx' ||
    f === 'buy-high-quality-backlinks.tsx' ||
    f === 'competitor-backlink-gap-analysis.tsx' ||
    f === 'do-backlinks-still-work-in-2025.tsx' ||
    f === 'e-commerce-backlink-packages.tsx' ||
    f === 'free-backlink-opportunities-2025.tsx' ||
    f === 'guest-post-link-building.tsx' ||
    f === 'haro-link-building-guide.tsx' ||
    f === 'high-quality-backlinks-vs-low-quality.tsx' ||
    f === 'how-much-do-backlinks-cost.tsx' ||
    f === 'how-to-buy-backlinks-safely.tsx' ||
    f === 'influencer-outreach-for-backlinks.tsx' ||
    f === 'manual-backlink-outreach.tsx' ||
    f === 'measuring-roi-on-backlinks.tsx' ||
    f === 'multilingual-backlink-building.tsx' ||
    f === 'resource-page-link-building.tsx' ||
    f === 'saas-link-building-tactics.tsx' ||
    f === 'top-backlink-providers-reviewed.tsx' ||
    f === 'travel-blog-guest-posts.tsx' ||
    f === 'ultimate-link-building-checklist.tsx' ||
    f === 'voice-search-backlink-optimization.tsx' ||
    f === 'where-to-find-high-quality-backlinks.tsx' ||
    f === 'white-hat-link-building-techniques.tsx' ||
    f === 'zero-click-search-link-strategies.tsx'
  ));

console.log(`Found ${files.length} files to fix`);

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if this file needs fixing
  if (!content.includes('dangerouslySetInnerHTML=')) {
    return;
  }
  
  // Find the malformed dangerouslySetInnerHTML pattern
  const malformedPattern = /dangerouslySetInnerHTML=(<[^/][^>]*|<html|<div[^>]*>[\s\S]*?(?=\/>|\n\s*<\/div>))/;
  
  if (content.match(malformedPattern)) {
    console.log(`Fixing: ${file}`);
    
    // Extract HTML content - find everything from the opening tag to the closing </div>
    const match = content.match(/<div className="max-w-4xl[^>]*>[\s\S]*?<div dangerouslySetInnerHTML=(.+?)\/>/);
    
    if (match) {
      // Extract the HTML content between the dangerouslySetInnerHTML attribute and />
      let htmlContent = match[1];
      
      // Remove the opening tag for the dangerouslySetInnerHTML div if present
      if (htmlContent.startsWith('<')) {
        // Find where the actual HTML content ends
        const endDivIndex = content.lastIndexOf('</div>');
        const startIndex = content.indexOf('dangerouslySetInnerHTML=') + 'dangerouslySetInnerHTML='.length;
        const beforeContent = content.substring(0, startIndex);
        const afterContent = content.substring(endDivIndex);
        
        // Extract the HTML that should go in htmlContent
        let extractedHtml = content.substring(startIndex, endDivIndex).trim();
        
        // Clean up the HTML - remove the opening <div or <html tag
        extractedHtml = extractedHtml.replace(/^<[^>]*>/, '').trim();
        if (extractedHtml.endsWith('/>')) {
          extractedHtml = extractedHtml.substring(0, extractedHtml.length - 2).trim();
        }
        
        // Create the fixed version
        const fixed = beforeContent + 
          '{{ __html: `' + extractedHtml.replace(/`/g, '\\`') + '` }}' + 
          afterContent;
        
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`✓ Fixed: ${file}`);
      }
    }
  }
});

console.log('Done!');
