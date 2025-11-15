#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map of page filenames to their topic and content
const missingPages = {
  'backlink-quality-factors.tsx': {
    title: 'Backlink Quality Factors: What Makes a Backlink Valuable for SEO',
    subtitle: 'Learn the essential factors that determine backlink quality and how to build a high-quality backlink profile.',
    topic: 'backlink quality factors'
  },
  'backlink-relevancy-best-practices.tsx': {
    title: 'Backlink Relevancy Best Practices: Building Contextually Relevant Links',
    subtitle: 'Master the art of building backlinks from relevant, contextually appropriate sources.',
    topic: 'backlink relevancy'
  },
  'backlink-score-improvement.tsx': {
    title: 'Backlink Score Improvement: Strategies to Boost Your Domain Authority',
    subtitle: 'Discover proven strategies to improve your backlink score and increase domain authority.',
    topic: 'backlink score improvement'
  },
  'backlink-strategy-for-local-business.tsx': {
    title: 'Backlink Strategy for Local Business: Local SEO Link Building Guide',
    subtitle: 'Complete guide to building backlinks specifically for local business SEO success.',
    topic: 'local business backlinks'
  },
  'backlink-types-explained.tsx': {
    title: 'Backlink Types Explained: Dofollow, Nofollow, and More',
    subtitle: 'Understanding different types of backlinks and how they impact your SEO.',
    topic: 'types of backlinks'
  },
  'best-backlink-marketplaces.tsx': {
    title: 'Best Backlink Marketplaces: Where to Buy Quality Links',
    subtitle: 'Comprehensive guide to the best marketplaces for purchasing high-quality backlinks.',
    topic: 'backlink marketplaces'
  },
  'best-backlink-monitoring-tools.tsx': {
    title: 'Best Backlink Monitoring Tools: Track and Analyze Your Links',
    subtitle: 'Essential tools for monitoring, tracking, and analyzing your backlink profile.',
    topic: 'backlink monitoring tools'
  },
  'best-backlink-services-review.tsx': {
    title: 'Best Backlink Services Review: Top Link Building Providers',
    subtitle: 'Honest reviews of the best backlink services and link building agencies.',
    topic: 'backlink services'
  },
  'best-guest-posting-platforms.tsx': {
    title: 'Best Guest Posting Platforms: Top Sites for Link Building',
    subtitle: 'Discover the best platforms and websites for guest posting opportunities.',
    topic: 'guest posting platforms'
  },
  'best-link-building-agencies.tsx': {
    title: 'Best Link Building Agencies: Professional SEO Link Building',
    subtitle: 'Review of the top link building agencies and professional SEO services.',
    topic: 'link building agencies'
  },
  'best-link-building-courses.tsx': {
    title: 'Best Link Building Courses: Learn Advanced Link Building Strategies',
    subtitle: 'Top courses and training programs for mastering link building techniques.',
    topic: 'link building courses'
  },
  'best-seo-backlinking-tools.tsx': {
    title: 'Best SEO Backlinking Tools: Essential Tools for Link Building',
    subtitle: 'Complete list of the best SEO tools for researching and building backlinks.',
    topic: 'SEO backlinking tools'
  },
  'blogger-outreach-for-backlinks.tsx': {
    title: 'Blogger Outreach for Backlinks: Effective Outreach Strategies',
    subtitle: 'Complete guide to outreach strategies for acquiring links from bloggers.',
    topic: 'blogger outreach'
  },
  'broken-backlink-recovery.tsx': {
    title: 'Broken Backlink Recovery: How to Recover Lost Links',
    subtitle: 'Strategies to identify and recover from broken or lost backlinks.',
    topic: 'broken backlink recovery'
  },
  'broken-link-building-guide.tsx': {
    title: 'Broken Link Building Guide: Complete Strategy for Link Acquisition',
    subtitle: 'Master the broken link building method for ethical backlink acquisition.',
    topic: 'broken link building'
  },
  'buying-backlinks-safely.tsx': {
    title: 'Buying Backlinks Safely: Best Practices and Safe Methods',
    subtitle: 'How to buy backlinks safely without risking Google penalties.',
    topic: 'buying backlinks safely'
  },
  'cheap-backlinks-vs-premium.tsx': {
    title: 'Cheap Backlinks vs Premium: Quality vs Cost Analysis',
    subtitle: 'Understanding the differences between cheap and premium backlink services.',
    topic: 'cheap vs premium backlinks'
  },
  'competitive-seo-backlink-analysis.tsx': {
    title: 'Competitive SEO Backlink Analysis: Analyze Your Competitors\' Links',
    subtitle: 'Learn how to analyze competitor backlinks and gain SEO advantages.',
    topic: 'competitive backlink analysis'
  },
  'content-distribution-backlinks.tsx': {
    title: 'Content Distribution for Backlinks: Multi-Channel Link Building',
    subtitle: 'Strategies for distributing content across channels to earn backlinks.',
    topic: 'content distribution'
  },
  'content-syndication-for-backlinks.tsx': {
    title: 'Content Syndication for Backlinks: Amplify Your Link Reach',
    subtitle: 'How to use content syndication to attract high-quality backlinks.',
    topic: 'content syndication'
  },
  'contextual-backlinks-guide.tsx': {
    title: 'Contextual Backlinks Guide: Building Links Within Relevant Content',
    subtitle: 'Complete guide to acquiring contextual backlinks from relevant sources.',
    topic: 'contextual backlinks'
  },
  'create-high-authority-backlinks.tsx': {
    title: 'Create High Authority Backlinks: Building Links from High-DA Sites',
    subtitle: 'Strategies for securing backlinks from high-authority domains.',
    topic: 'high authority backlinks'
  },
  'custom-backlink-strategy.tsx': {
    title: 'Custom Backlink Strategy: Tailored Link Building for Your Niche',
    subtitle: 'Develop a customized backlink strategy specific to your industry.',
    topic: 'custom backlink strategy'
  },
  'da-pa-backlink-metrics.tsx': {
    title: 'DA/PA Backlink Metrics: Understanding Domain and Page Authority',
    subtitle: 'Learn how Domain Authority and Page Authority metrics impact backlinks.',
    topic: 'DA PA metrics'
  },
  'edu-backlink-strategies.tsx': {
    title: 'EDU Backlink Strategies: Getting Links from Educational Institutions',
    subtitle: 'Specialized strategies for acquiring high-authority links from .edu sites.',
    topic: 'educational backlinks'
  },
  'effective-backlink-outreach.tsx': {
    title: 'Effective Backlink Outreach: Proven Email and Contact Strategies',
    subtitle: 'Master the art of outreach to secure high-quality backlinks.',
    topic: 'backlink outreach'
  },
  'ecommerce-backlink-seo-guide.tsx': {
    title: 'E-Commerce Backlink SEO Guide: Link Building for Online Stores',
    subtitle: 'Specialized guide to building backlinks for e-commerce websites.',
    topic: 'e-commerce backlinks'
  },
  'enterprise-link-building-strategy.tsx': {
    title: 'Enterprise Link Building Strategy: Scaling Link Acquisition',
    subtitle: 'Enterprise-level strategies for managing large-scale link building campaigns.',
    topic: 'enterprise link building'
  },
  'expert-roundup-backlinks.tsx': {
    title: 'Expert Roundup Backlinks: Building Links Through Expert Interviews',
    subtitle: 'How to use expert roundups to acquire valuable backlinks.',
    topic: 'expert roundups'
  },
  'forum-backlinks-strategy.tsx': {
    title: 'Forum Backlinks Strategy: Building Links Through Forum Participation',
    subtitle: 'Strategies for acquiring backlinks through forum engagement and participation.',
    topic: 'forum backlinks'
  },
  'free-backlinks-methods.tsx': {
    title: 'Free Backlinks Methods: Organic Ways to Earn Links Without Paying',
    subtitle: 'Comprehensive guide to free, organic methods for acquiring backlinks.',
    topic: 'free backlinks'
  },
  'guest-post-backlink-strategy.tsx': {
    title: 'Guest Post Backlink Strategy: Complete Guide to Guest Posting',
    subtitle: 'Master guest posting for acquiring high-quality editorial backlinks.',
    topic: 'guest posting'
  },
  'guest-post-email-templates.tsx': {
    title: 'Guest Post Email Templates: Effective Outreach Templates',
    subtitle: 'Ready-to-use email templates for successful guest posting outreach.',
    topic: 'guest post emails'
  },
  'high-authority-blog-backlinks.tsx': {
    title: 'High Authority Blog Backlinks: Getting Links from Top Blogs',
    subtitle: 'Strategies for acquiring backlinks from high-authority blogs in your niche.',
    topic: 'high authority blogs'
  },
  'high-quality-link-building-services.tsx': {
    title: 'High Quality Link Building Services: Premium SEO Link Building',
    subtitle: 'Overview of premium services that deliver high-quality backlinks.',
    topic: 'premium link services'
  },
  'how-many-backlinks-needed.tsx': {
    title: 'How Many Backlinks Needed: Backlink Quantity Guidelines',
    subtitle: 'Understanding how many backlinks you need to rank competitively.',
    topic: 'backlink quantity'
  },
  'how-to-analyze-backlink-quality.tsx': {
    title: 'How to Analyze Backlink Quality: Evaluating Link Value',
    subtitle: 'Methods and metrics for analyzing and evaluating backlink quality.',
    topic: 'analyze backlinks'
  },
  'how-to-build-backlinks-fast.tsx': {
    title: 'How to Build Backlinks Fast: Accelerated Link Building Methods',
    subtitle: 'Proven methods for building backlinks quickly and effectively.',
    topic: 'fast backlink building'
  },
  'how-to-check-backlinks.tsx': {
    title: 'How to Check Backlinks: Tools and Methods for Backlink Checking',
    subtitle: 'Complete guide to checking, monitoring, and analyzing backlinks.',
    topic: 'check backlinks'
  },
  'how-to-do-backlink-outreach.tsx': {
    title: 'How to Do Backlink Outreach: Step-by-Step Outreach Guide',
    subtitle: 'Complete tutorial on conducting effective backlink outreach campaigns.',
    topic: 'backlink outreach'
  },
  'how-to-find-backlink-opportunities.tsx': {
    title: 'How to Find Backlink Opportunities: Discovering Link Sources',
    subtitle: 'Research methods and tools for identifying backlink opportunities.',
    topic: 'find backlink opportunities'
  },
  'how-to-get-organic-backlinks.tsx': {
    title: 'How to Get Organic Backlinks: Natural Link Building Methods',
    subtitle: 'Strategies for organically attracting backlinks without paid services.',
    topic: 'organic backlinks'
  },
  'industry-specific-backlink-tips.tsx': {
    title: 'Industry-Specific Backlink Tips: Niche Link Building Strategies',
    subtitle: 'Tailored link building strategies for different industries and niches.',
    topic: 'niche backlinks'
  },
  'influencer-link-building.tsx': {
    title: 'Influencer Link Building: Acquiring Links Through Influencers',
    subtitle: 'How to leverage influencers and partnerships for backlink acquisition.',
    topic: 'influencer links'
  },
  'infographic-backlink-method.tsx': {
    title: 'Infographic Backlink Method: Building Links with Visual Content',
    subtitle: 'How to create and promote infographics to earn quality backlinks.',
    topic: 'infographic links'
  },
  'internal-links-vs-backlinks.tsx': {
    title: 'Internal Links vs Backlinks: Understanding Link Types',
    subtitle: 'Difference between internal links and backlinks and their SEO impact.',
    topic: 'internal vs external links'
  },
  'keyword-research-for-link-building.tsx': {
    title: 'Keyword Research for Link Building: Researching Link Targets',
    subtitle: 'Using keyword research to identify and target link building opportunities.',
    topic: 'keyword research for links'
  },
  'link-audit-and-cleanup.tsx': {
    title: 'Link Audit and Cleanup: Maintaining a Healthy Backlink Profile',
    subtitle: 'Complete guide to auditing and cleaning up your backlink profile.',
    topic: 'link audit'
  },
  'link-bait-content-ideas.tsx': {
    title: 'Link Bait Content Ideas: Creating Content That Attracts Links',
    subtitle: 'Content ideas and strategies for creating naturally link-worthy content.',
    topic: 'link bait content'
  },
  'link-building-automation-tools.tsx': {
    title: 'Link Building Automation Tools: Tools for Scaling Link Acquisition',
    subtitle: 'Tools and platforms for automating and scaling link building efforts.',
    topic: 'link building automation'
  },
  'link-building-for-affiliate-sites.tsx': {
    title: 'Link Building for Affiliate Sites: SEO for Affiliate Marketing',
    subtitle: 'Specialized strategies for building backlinks to affiliate websites.',
    topic: 'affiliate links'
  },
  'link-building-for-saas-companies.tsx': {
    title: 'Link Building for SaaS Companies: B2B Link Building Strategy',
    subtitle: 'Link building strategies specifically designed for SaaS businesses.',
    topic: 'SaaS link building'
  },
  'link-building-kpis.tsx': {
    title: 'Link Building KPIs: Measuring Link Building Success Metrics',
    subtitle: 'Key performance indicators for tracking link building campaign success.',
    topic: 'link KPIs'
  },
  'link-building-scams-to-avoid.tsx': {
    title: 'Link Building Scams to Avoid: Warning Signs and Red Flags',
    subtitle: 'Common link building scams and how to avoid them.',
    topic: 'link building scams'
  },
  'link-buying-vs-organic.tsx': {
    title: 'Link Buying vs Organic: Paid vs Natural Link Building',
    subtitle: 'Comparison of bought links versus organically earned backlinks.',
    topic: 'bought vs organic links'
  },
  'link-exchange-risks.tsx': {
    title: 'Link Exchange Risks: Why Link Exchanges Are Risky',
    subtitle: 'Understanding the risks and penalties associated with link exchanges.',
    topic: 'link exchange risks'
  },
  'link-indexing-services.tsx': {
    title: 'Link Indexing Services: Ensuring Your Backlinks Get Indexed',
    subtitle: 'Services and strategies for ensuring backlinks are properly indexed by Google.',
    topic: 'link indexing'
  },
  'link-insertion-backlinks.tsx': {
    title: 'Link Insertion Backlinks: Inserting Links into Existing Content',
    subtitle: 'Strategy of acquiring links by inserting them into existing content.',
    topic: 'link insertions'
  },
  'link-magnet-content-types.tsx': {
    title: 'Link Magnet Content Types: Content That Naturally Attracts Links',
    subtitle: 'Types of content that naturally attract backlinks without outreach.',
    topic: 'link magnet content'
  },
  'local-backlink-strategies.tsx': {
    title: 'Local Backlink Strategies: Building Links for Local SEO',
    subtitle: 'Comprehensive strategies for building local backlinks for local SEO.',
    topic: 'local backlinks'
  },
  'manual-vs-automated-link-building.tsx': {
    title: 'Manual vs Automated Link Building: Which Approach Works Best',
    subtitle: 'Comparing manual link building efforts with automated approaches.',
    topic: 'manual vs automated'
  },
  'micro-niche-backlinks.tsx': {
    title: 'Micro-Niche Backlinks: Link Building for Micro-Niches',
    subtitle: 'Specialized link building strategies for micro-niche markets.',
    topic: 'micro-niche links'
  },
  'natural-backlink-growth.tsx': {
    title: 'Natural Backlink Growth: Strategies for Sustainable Link Growth',
    subtitle: 'Methods for achieving sustainable, natural backlink growth.',
    topic: 'natural growth'
  },
  'niche-edits-guide.tsx': {
    title: 'Niche Edits Guide: Complete Guide to Niche Edit Links',
    subtitle: 'Master the niche edit strategy for acquiring contextual backlinks.',
    topic: 'niche edits'
  },
  'nicheoutreach-backlinks.tsx': {
    title: 'Niche Outreach Backlinks: Targeted Outreach in Your Industry',
    subtitle: 'Specialized outreach techniques for niche-specific backlink acquisition.',
    topic: 'niche outreach'
  },
  'outreach-personalization-tips.tsx': {
    title: 'Outreach Personalization Tips: Making Your Outreach Stand Out',
    subtitle: 'Tips for personalizing outreach to increase response rates.',
    topic: 'outreach personalization'
  },
  'parasite-seo-backlink-strategy.tsx': {
    title: 'Parasite SEO Backlink Strategy: Leveraging Authority Domains',
    subtitle: 'How to use parasite SEO to leverage authority domains for backlinks.',
    topic: 'parasite SEO'
  },
  'pdf-backlinks-technique.tsx': {
    title: 'PDF Backlinks Technique: Building Links Through PDF Distribution',
    subtitle: 'Strategy for acquiring backlinks through PDF creation and distribution.',
    topic: 'PDF backlinks'
  },
  'press-release-backlinks.tsx': {
    title: 'Press Release Backlinks: Getting Links from Press Releases',
    subtitle: 'How to use press releases to earn high-quality backlinks.',
    topic: 'press release links'
  },
  'private-blog-network-risks.tsx': {
    title: 'Private Blog Network Risks: Why PBN Links Are Risky',
    subtitle: 'Understanding the risks and penalties of using private blog networks.',
    topic: 'PBN risks'
  },
  'profile-backlinks-guide.tsx': {
    title: 'Profile Backlinks Guide: Building Links from Profile Pages',
    subtitle: 'Guide to acquiring backlinks from profile pages and directory links.',
    topic: 'profile links'
  },
  'quick-backlink-wins.tsx': {
    title: 'Quick Backlink Wins: Fast Ways to Build Backlinks',
    subtitle: 'Quick and easy tactics for acquiring backlinks fast.',
    topic: 'quick wins'
  },
  'review-backlink-services.tsx': {
    title: 'Review Backlink Services: Review Sites as Link Sources',
    subtitle: 'How to acquire backlinks from review sites and review platforms.',
    topic: 'review links'
  },
  'seo-link-pyramids.tsx': {
    title: 'SEO Link Pyramids: Understanding Link Pyramid Strategies',
    subtitle: 'Overview of link pyramid methods and their SEO implications.',
    topic: 'link pyramids'
  },
  'seo-ranking-with-backlinks.tsx': {
    title: 'SEO Ranking with Backlinks: How Backlinks Impact Rankings',
    subtitle: 'Understanding how backlinks directly impact search engine rankings.',
    topic: 'backlinks and rankings'
  },
  'skyscraper-backlink-technique.tsx': {
    title: 'Skyscraper Backlink Technique: Finding and Outdoing Competitor Links',
    subtitle: 'Complete guide to the skyscraper technique for link building.',
    topic: 'skyscraper technique'
  },
  'review-backlink-services.tsx': {
    title: 'Review Backlink Services: Premium Link Building Service Reviews',
    subtitle: 'Detailed reviews of backlink services and their effectiveness.',
    topic: 'service reviews'
  },
  'seo-link-pyramids.tsx': {
    title: 'SEO Link Pyramids: Link Pyramid Strategies and Techniques',
    subtitle: 'Understanding link pyramid methods in modern SEO.',
    topic: 'link pyramids'
  },
  'seo-ranking-with-backlinks.tsx': {
    title: 'SEO Ranking with Backlinks: Backlinks Impact on Rankings',
    subtitle: 'How backlinks influence SEO rankings and Google visibility.',
    topic: 'backlinks ranking'
  },
  'skyscraper-backlink-technique.tsx': {
    title: 'Skyscraper Technique: Building Better Links Than Competitors',
    subtitle: 'Master the skyscraper content technique for link acquisition.',
    topic: 'skyscraper method'
  }
};

function generatePageContent(filename, title, subtitle, topic) {
  const componentName = filename.replace(/\.tsx$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${title}";
  const subtitle = "${subtitle}";
  const htmlContent = \`
    <h1>${title}</h1>
    <p>Welcome to our comprehensive guide on ${topic}. This article covers everything you need to know about ${topic} and how it impacts your SEO strategy.</p>
    
    <h2>Introduction to ${topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>
    <p>${topic.charAt(0).toUpperCase() + topic.slice(1)} is a crucial aspect of modern SEO and digital marketing. Understanding the fundamentals and best practices can significantly improve your online visibility and search rankings.</p>
    
    <h2>Key Strategies for ${topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>
    <p>Successful ${topic} requires a strategic approach that combines research, planning, and execution. Here are the key strategies you should implement:</p>
    <ul>
      <li>Understand your audience and their needs</li>
      <li>Research and identify opportunities in your niche</li>
      <li>Develop a comprehensive action plan</li>
      <li>Execute with consistency and precision</li>
      <li>Monitor results and adjust as needed</li>
    </ul>
    
    <h2>Best Practices for ${topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>
    <p>Following industry best practices ensures your efforts are effective and sustainable. Always focus on quality over quantity, maintain ethical standards, and stay updated with the latest trends and algorithm changes.</p>
    
    <h2>Common Mistakes to Avoid</h2>
    <p>Many practitioners make similar mistakes when it comes to ${topic}. By understanding these pitfalls, you can avoid them and achieve better results more quickly.</p>
    
    <h2>Conclusion</h2>
    <p>Mastering ${topic} is essential for long-term SEO success. By implementing the strategies and best practices outlined in this guide, you'll be well-positioned to dominate your niche and achieve your business goals.</p>
  \`;
  const keywords = "${topic}";
  
  return (
    <GenericPageTemplate
      title={title}
      subtitle={subtitle}
      htmlContent={htmlContent}
      keywords={keywords}
    />
  );
};

export default ${componentName};
`;
}

const pagesDir = path.join(__dirname, 'src', 'pages');
let created = 0;
let skipped = 0;

// Handle duplicates by filtering
const uniqueMissingPages = {};
Object.entries(missingPages).forEach(([filename, data]) => {
  if (!uniqueMissingPages[filename]) {
    uniqueMissingPages[filename] = data;
  }
});

console.log(`Creating ${Object.keys(uniqueMissingPages).length} missing pages...\n`);

Object.entries(uniqueMissingPages).forEach(([filename, { title, subtitle, topic }], index) => {
  const filePath = path.join(pagesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    const content = generatePageContent(filename, title, subtitle, topic);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ [${index + 1}] Created: ${filename}`);
    created++;
  } else {
    console.log(`⊘ [${index + 1}] Already exists: ${filename}`);
    skipped++;
  }
});

console.log(`\n=== Summary ===`);
console.log(`Created: ${created} pages`);
console.log(`Skipped: ${skipped} pages`);
console.log(`Total: ${created + skipped} pages processed`);
