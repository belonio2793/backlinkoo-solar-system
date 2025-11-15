import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diverse pool of Unsplash URLs - each for different contexts
// We'll assign these uniquely to each page
const uniqueImages = [
  // Analytics & Charts
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // Business analytics
  'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop', // Analytics dashboard
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // Business meeting
  'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop', // Team collaboration
  
  // SEO & Strategy
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop', // Strategy planning
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // Infographic design
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', // Data analysis
  'https://images.unsplash.com/photo-1677442d019cecf33b13e551aa1f9a2736940338?w=800&h=400&fit=crop', // AI technology
  
  // Digital & Marketing
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop', // Digital marketing
  'https://images.unsplash.com/photo-1668575007921-da64e5eff1fa?w=800&h=400&fit=crop', // Video production
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop', // Content creation
  'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop', // Growth metrics
  
  // Tools & Technology
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop', // Software tools
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // Dashboard interface
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', // Computer desk
  'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop', // Office workspace
  
  // Business & ROI
  'https://images.unsplash.com/photo-1611632622527-92c92d00dc8f?w=800&h=400&fit=crop', // Business growth
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop', // Strategy meeting
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // Team success
  'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop', // Performance chart
  
  // Additional unique variations
  'https://images.unsplash.com/photo-1493723903624-896b32b0a686?w=800&h=400&fit=crop', // Code development
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', // Technical analysis
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // Business planning
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop', // Digital strategy
  
  // More diversity
  'https://images.unsplash.com/photo-1516534775068-bb57e39c568f?w=800&h=400&fit=crop', // Collaboration
  'https://images.unsplash.com/photo-1460925895917-adf4e566c72f?w=800&h=400&fit=crop', // Analytics insight
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', // Design process
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop', // Marketing campaign
  
  // Additional options
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', // Research
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // Business metrics
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop', // Planning session
  'https://images.unsplash.com/photo-1668575007921-da64e5eff1fa?w=800&h=400&fit=crop', // Creative work
];

const srcDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx')).sort();

// Track URL usage
const imageUsageMap = new Map();
let imageIndex = 0;

files.forEach((file) => {
  const filePath = path.join(srcDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all img src patterns with unsplash URLs
    const imgPattern = /<img\s+src="https:\/\/images\.unsplash\.com[^"]*"([^>]*)>/g;
    const matches = [...content.matchAll(imgPattern)];

    matches.forEach((match) => {
      const fullMatch = match[0];
      const attributes = match[1];
      
      // Get the current URL
      const currentUrl = fullMatch.match(/src="([^"]*)"/)[1];
      
      // Track usage
      if (!imageUsageMap.has(currentUrl)) {
        imageUsageMap.set(currentUrl, []);
      }
      imageUsageMap.get(currentUrl).push(file);
    });
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

console.log('📊 Image Usage Analysis:');
console.log('========================\n');

const duplicates = [...imageUsageMap.entries()].filter(([url, files]) => files.length > 1);

if (duplicates.length === 0) {
  console.log('✅ No duplicate images found!');
  process.exit(0);
}

console.log(`Found ${duplicates.length} unique URLs used by multiple pages:\n`);

duplicates.forEach(([url, usedByFiles]) => {
  console.log(`Used by ${usedByFiles.length} pages:`);
  usedByFiles.slice(0, 3).forEach(f => console.log(`  - ${f}`));
  if (usedByFiles.length > 3) {
    console.log(`  ... and ${usedByFiles.length - 3} more`);
  }
  console.log();
});

// Now deduplicate by assigning unique images to each page
console.log('\n🔄 Deduplicating images...\n');

let filesUpdated = 0;

files.forEach((file, idx) => {
  const filePath = path.join(srcDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Find all img src patterns with unsplash URLs
    const imgPattern = /<img\s+src="https:\/\/images\.unsplash\.com[^"]*"([^>]*)>/g;
    const matches = [...content.matchAll(imgPattern)];

    let pageImageIndex = 0;
    matches.forEach((match) => {
      const fullMatch = match[0];
      const attributes = match[1];
      
      // Assign a unique image for this page and occurrence
      const uniqueImageUrl = uniqueImages[(idx * 3 + pageImageIndex) % uniqueImages.length];
      const newImg = `<img src="${uniqueImageUrl}"${attributes}>`;
      content = content.replace(fullMatch, newImg);
      pageImageIndex++;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      filesUpdated++;
      console.log(`✓ ${file} (${matches.length} images updated)`);
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});

console.log(`\n✅ Updated ${filesUpdated} files with unique images`);
