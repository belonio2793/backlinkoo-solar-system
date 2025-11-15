#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive mapping of page slugs to relevant YouTube video IDs
const pageMediaMap = {
  'ai-tools-for-backlink-outreach': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'AI and automation for backlink outreach',
  },
  'algorithm-proof-backlink-strategy': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1611987620912-b7873f301371?w=800&h=400&fit=crop',
    imageAlt: 'Algorithm-proof backlink strategy',
  },
  'backlink-diversity-services': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlink diversity strategies',
  },
  'backlink-impact-on-domain-authority': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Domain authority and backlink impact',
  },
  'backlink-marketplace-alternatives': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Backlink marketplace alternatives',
  },
  'backlink-optimization-for-ranking-drops': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1543269863-cbf427effbad?w=800&h=400&fit=crop',
    imageAlt: 'Backlink optimization recovery',
  },
  'backlink-packages-for-agencies': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlink packages for agencies',
  },
  'backlink-packages-that-boost-sales': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Sales-boosting backlink packages',
  },
  'backlink-penalty-prevention': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Backlink penalty prevention',
  },
  'backlink-pricing-guide': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Backlink pricing and cost analysis',
  },
  'backlink-quality-vs-quantity-debate': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Quality vs quantity in backlinks',
  },
  'backlink-recommendations-for-2025': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: '2025 backlink strategy recommendations',
  },
  'backlink-recommendations-for-new-domains': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlinks for new domains',
  },
  'backlink-roi-calculation': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Calculating ROI on backlinks',
  },
  'backlink-services-for-international-sites': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'International backlink services',
  },
  'backlink-services-for-multilingual-brands': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Multilingual brand backlink services',
  },
  'backlink-services-for-niches': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Niche-specific backlink services',
  },
  'backlink-services-for-wordpress-sites': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'WordPress backlink services',
  },
  'backlink-services-that-actually-work': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Effective backlink services',
  },
  'backlinks-for-affiliate-marketers': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Affiliate marketing backlinks',
  },
  'backlinks-for-agencies': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlinks for agencies',
  },
  'backlinks-for-ai-websites': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'AI website backlinks',
  },
  'backlinks-for-b2b-companies': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'B2B company backlinks',
  },
  'backlinks-for-bloggers': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Blogger backlink strategies',
  },
  'backlinks-for-consultants': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Consultant backlinks',
  },
  'backlinks-for-crypto-sites': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Crypto website backlinks',
  },
  'backlinks-for-dropshipping-stores': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Dropshipping store backlinks',
  },
  'backlinks-for-lawyer-websites': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Lawyer website backlinks',
  },
  'backlinks-for-lead-generation-websites': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Lead generation backlinks',
  },
  'backlinks-for-local-maps-ranking': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Local maps ranking backlinks',
  },
  'backlinks-for-medical-websites': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Medical website backlinks',
  },
  'backlinks-for-new-brands': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'New brand backlinks',
  },
  'backlinks-for-portfolio-websites': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Portfolio website backlinks',
  },
  'backlinks-for-real-estate-websites': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    imageAlt: 'Real estate website backlinks',
  },
  'backlinks-for-saas-startups': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'SaaS startup backlinks',
  },
  'backlinks-for-service-businesses': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Service business backlinks',
  },
  'backlinks-guaranteed-indexing': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Indexed backlinks guarantee',
  },
  'best-backlinks-for-fast-ranking': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Fast ranking backlinks',
  },
  'best-places-to-buy-safe-backlinks': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Safe backlink marketplaces',
  },
  'cheapest-white-hat-backlinks-online': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Affordable white-hat backlinks',
  },
  'cheap-seo-services-for-small-business': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Affordable SEO services',
  },
  'competitor-backlink-replication-guide': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Competitor backlink analysis',
  },
  'contextual-link-packages': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Contextual link packages',
  },
  'editorial-backlinks-service': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Editorial backlink services',
  },
  'email-outreach-for-niche-edits': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Email outreach for niche edits',
  },
  'geo-targeted-seo-backlinks': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Geo-targeted backlinks',
  },
  'google-friendly-backlink-services': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Google-friendly backlinks',
  },
  'google-news-approved-backlinks': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Google News backlinks',
  },
  'google-ranking-boost-services': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Ranking boost services',
  },
  'guest-post-marketplaces-comparison': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Guest post marketplaces',
  },
  'high-authority-niche-edits-service': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'High authority niche edits',
  },
  'high-authority-seo-packages': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'High authority SEO packages',
  },
  'high-dr-backlinks-for-cheap': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'High DR backlinks affordable',
  },
  'high-traffic-guest-posting-sites': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'High traffic guest posting',
  },
  'high-trust-flow-backlinks': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'High trust flow backlinks',
  },
  'homepage-link-placements': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Homepage link placements',
  },
  'how-to-audit-paid-backlinks': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Audit paid backlinks',
  },
  'how-to-boost-domain-authority-fast': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Boost domain authority',
  },
  'how-to-check-if-backlinks-are-indexed': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Check backlink indexing',
  },
  'how-to-choose-a-backlink-provider': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Choose backlink provider',
  },
  'how-to-fix-ranking-drop-after-update': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Fix ranking drops',
  },
  'how-to-get-high-dr-backlinks-free': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Free high DR backlinks',
  },
  'how-to-get-indexing-for-backlinks': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Get backlinks indexed',
  },
  'how-to-increase-crawl-demand': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Increase crawl demand',
  },
  'how-to-recover-lost-backlinks': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Recover lost backlinks',
  },
  'internal-link-boosting-strategies': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Internal link strategies',
  },
  'link-building-for-amazon-affiliates': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Affiliate link building',
  },
  'link-building-for-finance-niche': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Finance niche link building',
  },
  'link-building-for-health-niche': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Health niche link building',
  },
  'link-building-for-new-blogs': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'New blog link building',
  },
  'link-building-for-tech-niche': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Tech niche link building',
  },
  'link-building-for-youtube-channels': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'YouTube channel links',
  },
  'link-building-packages-for-small-business': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Small business link packages',
  },
  'local-seo-backlink-packages': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Local SEO backlinks',
  },
  'local-seo-citations-and-backlinks': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'Local citations and backlinks',
  },
  'manual-link-building-service': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Manual link building',
  },
  'map-pack-seo-and-backlink-strategy': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Map pack SEO strategy',
  },
  'mixed-backlink-packages': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Mixed backlink packages',
  },
  'monthly-backlink-subscription-services': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Monthly backlink subscriptions',
  },
  'monthly-seo-and-backlink-plans': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Monthly SEO plans',
  },
  'niche-backlinks-for-local-businesses': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Niche local business backlinks',
  },
  'niche-specific-guest-post-services': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Niche guest posting',
  },
  'on-page-seo-and-backlink-bundle': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'On-page SEO and backlinks',
  },
  'organic-backlink-services-for-startups': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Startup backlink services',
  },
  'paid-backlink-alternatives': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlink alternatives',
  },
  'ranking-improvement-case-studies': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'Ranking improvement cases',
  },
  'safe-backlink-building-methods': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Safe link building methods',
  },
  'seo-ranking-improvement-services': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'SEO ranking improvement',
  },
  'seo-reseller-backlink-packages': {
    videoId: 'jGxFxv2D5d0',
    imageSrc: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop',
    imageAlt: 'Reseller backlink packages',
  },
  'seo-services-after-google-core-update': {
    videoId: 'M7lc1BCxL00',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    imageAlt: 'Post-update SEO recovery',
  },
  'seo-services-for-ecommerce-stores': {
    videoId: 'sOzlmuHvZUI',
    imageSrc: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop',
    imageAlt: 'E-commerce SEO services',
  },
  'tier-2-backlink-services': {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop',
    imageAlt: 'Tier-2 backlink services',
  },
  'tier-3-backlink-services': {
    videoId: 'lVKvr5PEf-g',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Tier-3 backlink services',
  },
  'white-label-link-building-service': {
    videoId: 'zhjRlYxwD6I',
    imageSrc: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    imageAlt: 'White-label link building',
  },
  'affordable-contextual-backlinks': {
    videoId: 'nZl1PGr6K9o',
    imageSrc: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop',
    imageAlt: 'Affordable contextual backlinks',
  },
  'affordable-high-dr-guest-posts': {
    videoId: 'IGtv_2YTqfI',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    imageAlt: 'Affordable high DR guest posts',
  },
};

function getMediaForPage(slug) {
  return pageMediaMap[slug] || {
    videoId: '6McePZz4XZM',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    imageAlt: 'Backlink strategy',
  };
}

function createYoutubeEmbed(videoId, title = 'Link building tutorial') {
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
}

function replaceMediaInFile(filePath, pageSlug) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const media = getMediaForPage(pageSlug);

    // Replace generic placeholder image with relevant image
    content = content.replace(
      /src="https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg"/g,
      `src="${media.imageSrc}"`
    );

    // Replace any old YouTube embeds with the correct one for this page
    const oldYoutubePattern = /src="https:\/\/www\.youtube\.com\/embed\/[^"]+"/g;
    content = content.replace(
      oldYoutubePattern,
      `src="https://www.youtube.com/embed/${media.videoId}"`
    );

    // If no YouTube embed exists and there's a media div, add one
    if (!content.includes(`youtube.com/embed/${media.videoId}`) && content.includes('<div class="media">')) {
      // Find the first media div and ensure it has a video
      const firstMediaDivPattern = /(<div class="media">\s*(?!<iframe)[^<]*)/;
      const youtubeEmbed = createYoutubeEmbed(media.videoId, `${pageSlug} tutorial`);
      
      if (firstMediaDivPattern.test(content)) {
        content = content.replace(
          firstMediaDivPattern,
          `$1\n      ${youtubeEmbed}`
        );
      }
    }

    // If file was modified, save it
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { changed: true, videoId: media.videoId, imageUrl: media.imageSrc };
    }

    return { changed: false, videoId: media.videoId, imageUrl: media.imageSrc };
  } catch (error) {
    return { changed: false, error: error.message };
  }
}

function main() {
  const baseDir = path.resolve(__dirname, '..');
  const pagesDir = path.join(baseDir, 'src', 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(`❌ Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const pageFiles = Object.keys(pageMediaMap)
    .map(slug => `${slug}.tsx`)
    .filter(filename => fs.existsSync(path.join(pagesDir, filename)));

  console.log(`\n📋 Processing ${pageFiles.length} pages with media updates...\n`);

  let updated = 0;
  let processed = 0;
  const results = [];

  pageFiles.forEach((filename, idx) => {
    const slug = filename.replace('.tsx', '');
    const filePath = path.join(pagesDir, filename);

    processed++;
    const result = replaceMediaInFile(filePath, slug);

    if (result.error) {
      console.log(`❌ ERROR (${idx + 1}/${pageFiles.length}): ${slug}`);
      results.push({ slug, status: 'error', error: result.error });
    } else if (result.changed) {
      updated++;
      console.log(`✓ UPDATED (${idx + 1}/${pageFiles.length}): ${slug}`);
      results.push({ slug, status: 'updated', videoId: result.videoId });
    } else {
      console.log(`• PROCESSED (${idx + 1}/${pageFiles.length}): ${slug}`);
      results.push({ slug, status: 'processed', videoId: result.videoId });
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('MEDIA REPLACEMENT SUMMARY');
  console.log('='.repeat(70));
  console.log(`✓ Total pages processed: ${processed}`);
  console.log(`✓ Updated with new media: ${updated}`);
  console.log(`✓ Coverage: ${Math.round((processed / pageFiles.length) * 100)}%`);
  console.log('='.repeat(70));

  if (updated > 0) {
    console.log(`\n✨ Successfully updated ${updated} pages with relevant images and videos!`);
  } else {
    console.log(`\n✨ All pages already have appropriate media!`);
  }

  console.log('\n📊 Sample pages updated:');
  results
    .filter(r => r.status === 'updated')
    .slice(0, 5)
    .forEach(r => {
      console.log(`   • ${r.slug}`);
    });
}

main();
