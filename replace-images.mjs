import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of image descriptions to Unsplash URLs
// Using direct Unsplash URLs that are optimized and don't require API keys
const imageMap = {
  'infographic': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'backlink': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'seo': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'chart': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'graph': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'comparison': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'tool': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'growth': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'strategy': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'process': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'guide': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'flow': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'ranking': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'faq': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'ai': 'https://images.unsplash.com/photo-1677442d019cecf33b13e551aa1f9a2736940338?w=800&h=400&fit=crop',
  'automation': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  'video': 'https://images.unsplash.com/photo-1668575007921-da64e5eff1fa?w=800&h=400&fit=crop',
  'risk': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
  'audience': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'conversion': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'engagement': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'traffic': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'authority': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'quality': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'success': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'marketing': 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop',
  'content': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
  'screenshot': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
  'benefits': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'risks': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
  'difference': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'checklist': 'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop',
  'tips': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'case study': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
};

function getImageUrlFromDescription(description) {
  const lowerDesc = description.toLowerCase();
  
  // Find the best matching keyword
  for (const [keyword, url] of Object.entries(imageMap)) {
    if (lowerDesc.includes(keyword)) {
      return url;
    }
  }
  
  // Default image
  return 'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop';
}

const srcDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx'));

let totalReplaced = 0;
const replacedFiles = [];

files.forEach((file) => {
  const filePath = path.join(srcDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let fileReplaced = false;

    // Find all img src patterns with media paths
    const imgPattern = /<img\s+src="\/media\/[^"]*"([^>]*)>/g;
    const matches = [...content.matchAll(imgPattern)];

    matches.forEach((match) => {
      const fullMatch = match[0];
      const attributes = match[1];
      
      // Extract alt text to determine image type
      const altMatch = fullMatch.match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : '';
      
      // Get appropriate image URL based on alt text
      const imageUrl = getImageUrlFromDescription(alt);
      
      // Replace with real image
      const newImg = `<img src="${imageUrl}"${attributes}>`;
      content = content.replace(fullMatch, newImg);
      fileReplaced = true;
    });

    if (fileReplaced && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      replacedFiles.push(file);
      totalReplaced++;
      console.log(`✓ Updated images in: ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

console.log(`\n✅ Replaced placeholder images in ${totalReplaced} files`);
if (replacedFiles.length > 0) {
  console.log('\nFiles updated:');
  replacedFiles.forEach((f) => console.log(`  - ${f}`));
}
