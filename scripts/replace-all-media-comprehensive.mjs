#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive mapping with content-specific images and videos
const pageMediaMap = {
  'ab-testing-anchor-texts': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'A/B testing and analytics dashboard' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Testing and optimization graphs' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Analytics and metrics visualization' }
    ]
  },
  'affordable-link-building-services': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', alt: 'Affordable link building services and strategy' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Cost-effective SEO solutions' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Budget planning and ROI analysis' }
    ]
  },
  'ahrefs-for-link-building': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Ahrefs SEO tool dashboard and metrics' },
      { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', alt: 'Backlink analysis and competitor research' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO analytics and reporting' }
    ]
  },
  'ai-powered-link-building': {
    video: '2zFqSyZ57-8',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'AI and machine learning for link building' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Artificial intelligence automation' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Smart analytics and automation' }
    ]
  },
  'anchor-text-optimization-for-backlinks': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Anchor text optimization techniques' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Keyword optimization strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO text analysis' }
    ]
  },
  'are-paid-backlinks-worth-it': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Paid vs organic backlinks ROI analysis' },
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Cost benefit analysis for SEO investment' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'ROI tracking and metrics' }
    ]
  },
  'authoritative-backlinks-for-e-commerce': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'E-commerce backlink authority strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Online store SEO authority' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'E-commerce ranking metrics' }
    ]
  },
  'backlink-building-for-beginners': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Beginner guide to backlink building' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO fundamentals learning' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO tutorial and education' }
    ]
  },
  'backlink-disavow-tool-usage': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Backlink disavow tool and cleanup' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link quality management' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Harmful link removal process' }
    ]
  },
  'backlink-dr-vs-ur-metrics': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'DR and UR metrics comparison' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Domain authority metrics' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO rating systems' }
    ]
  },
  'backlink-equity-calculation': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Link equity flow calculation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO value distribution analysis' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Authority transfer metrics' }
    ]
  },
  'backlink-farming-risks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Backlink farming risks and penalties' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Black hat SEO consequences' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Google penalty recovery' }
    ]
  },
  'backlink-growth-tracking': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Backlink growth monitoring and tracking' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link profile growth analytics' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Progress tracking dashboard' }
    ]
  },
  'backlink-indexing-techniques': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Backlink indexing and coverage' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Google indexing process' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Search engine crawling' }
    ]
  },
  'backlink-negotiation-scripts': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link building negotiation scripts' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Email outreach communication' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Outreach strategy and techniques' }
    ]
  },
  'backlink-profile-diversification': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Backlink profile diversification strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link source variety and distribution' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Anchor text and source analysis' }
    ]
  },
  'backlink-quality-factors': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Backlink quality assessment factors' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Quality link evaluation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO quality metrics' }
    ]
  },
  'backlink-relevancy-best-practices': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Backlink relevancy and contextual matching' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content relevance strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Topical authority building' }
    ]
  },
  'backlink-score-improvement': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Backlink score and rating improvements' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'SEO score optimization' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Performance metrics enhancement' }
    ]
  },
  'backlink-strategy-for-local-business': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop', alt: 'Local business backlink strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Local SEO and Google My Business' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Local ranking improvement' }
    ]
  },
  'backlink-types-explained': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Different types of backlinks explained' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link type classification' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link building categories' }
    ]
  },
  'best-backlink-marketplaces': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Best backlink marketplaces and platforms' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Link marketplace selection guide' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Marketplace comparison and reviews' }
    ]
  },
  'best-backlink-monitoring-tools': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Best backlink monitoring tools and software' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link tracking dashboard' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO monitoring tools' }
    ]
  },
  'best-backlink-services-review': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Best backlink services review and comparison' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link building services evaluation' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Service comparison metrics' }
    ]
  },
  'best-guest-posting-platforms': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Best guest posting platforms and networks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Guest post opportunities' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content syndication platforms' }
    ]
  },
  'best-link-building-agencies': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Best link building agencies and firms' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Professional SEO agency team' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Agency performance metrics' }
    ]
  },
  'best-link-building-courses': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Best link building courses and training' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO education and learning resources' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Online training programs' }
    ]
  },
  'best-seo-backlinking-tools': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Best SEO backlinking tools and software' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO tool interface' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Analytics and reporting tools' }
    ]
  },
  'blogger-outreach-for-backlinks': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Blogger outreach and link building strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Outreach email campaign' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content creator networking' }
    ]
  },
  'broken-backlink-recovery': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Broken backlink recovery and repair' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link restoration techniques' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link health monitoring' }
    ]
  },
  'broken-link-building-guide': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Broken link building guide and strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Finding and fixing broken links' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link replacement opportunities' }
    ]
  },
  'buying-backlinks-safely': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Buying backlinks safely and ethically' },
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Safe link purchasing guide' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Backlink investment strategy' }
    ]
  },
  'cheap-backlinks-vs-premium': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Cheap vs premium backlinks comparison' },
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Backlink quality vs cost analysis' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'ROI comparison pricing' }
    ]
  },
  'competitive-seo-backlink-analysis': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Competitive backlink analysis and research' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Competitor link gap analysis' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Competitive intelligence' }
    ]
  },
  'content-distribution-backlinks': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Content distribution and backlink strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content syndication and promotion' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Multi-channel distribution' }
    ]
  },
  'content-syndication-for-backlinks': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Content syndication platforms for backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Syndication network strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content reuse and amplification' }
    ]
  },
  'contextual-backlinks-guide': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Contextual backlinks guide and best practices' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'In-content link placement' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Natural link integration' }
    ]
  },
  'create-high-authority-backlinks': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Creating high authority backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Authority building techniques' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Domain authority growth' }
    ]
  },
  'custom-backlink-strategy': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Custom backlink strategy development' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Tailored SEO planning' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Strategy implementation process' }
    ]
  },
  'da-pa-backlink-metrics': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Domain Authority and Page Authority metrics' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Authority measurement dashboard' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO metric tracking' }
    ]
  },
  'edu-backlink-strategies': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Educational institution backlink strategies' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Academic SEO and authority' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'University website ranking' }
    ]
  },
  'effective-backlink-outreach': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Effective backlink outreach strategies' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Email outreach campaigns' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Prospecting and engagement' }
    ]
  },
  'ecommerce-backlink-seo-guide': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'E-commerce backlink and SEO guide' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Online store optimization' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'E-commerce ranking metrics' }
    ]
  },
  'enterprise-link-building-strategy': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Enterprise link building strategy' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Large-scale SEO implementation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Corporate SEO strategy' }
    ]
  },
  'expert-roundup-backlinks': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Expert roundup backlinks and content' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Expert interview collection' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content collaboration strategy' }
    ]
  },
  'forum-backlinks-strategy': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Forum backlinks and community engagement' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Community participation strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Online discussion forums' }
    ]
  },
  'free-backlinks-methods': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Free backlinks methods and techniques' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Low-cost link building' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Organic backlink growth' }
    ]
  },
  'guest-post-backlink-strategy': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Guest post backlink strategy and execution' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Guest article placement' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content collaboration opportunities' }
    ]
  },
  'guest-post-email-templates': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Guest post email templates and examples' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Email communication templates' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Outreach message examples' }
    ]
  },
  'high-authority-blog-backlinks': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'High authority blog backlinks strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'High-authority blog placement' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Blog authority metrics' }
    ]
  },
  'high-quality-link-building-services': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'High quality link building services' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Professional link building services' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Service quality metrics' }
    ]
  },
  'how-many-backlinks-needed': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'How many backlinks are needed for ranking' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Backlink volume analysis' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link count and distribution' }
    ]
  },
  'how-to-analyze-backlink-quality': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'How to analyze backlink quality' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Quality assessment methodology' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link evaluation criteria' }
    ]
  },
  'how-to-build-backlinks-fast': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'How to build backlinks fast' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Quick link building tactics' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Rapid link growth strategies' }
    ]
  },
  'how-to-check-backlinks': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'How to check backlinks for your website' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Backlink checker tools' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link audit process' }
    ]
  },
  'how-to-do-backlink-outreach': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'How to do backlink outreach effectively' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Outreach strategy and execution' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Email and messaging tactics' }
    ]
  },
  'how-to-find-backlink-opportunities': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'How to find backlink opportunities' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link prospect research' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Opportunity identification' }
    ]
  },
  'how-to-get-organic-backlinks': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'How to get organic backlinks naturally' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Natural link acquisition' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'White hat link building' }
    ]
  },
  'industry-specific-backlink-tips': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Industry specific backlink tips and strategies' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Niche-specific tactics' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Vertical-specific strategies' }
    ]
  },
  'influencer-link-building': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Influencer link building and partnerships' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Influencer collaboration' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Partnership marketing strategy' }
    ]
  },
  'infographic-backlink-method': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Infographic backlink method and strategy' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Visual content creation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content marketing visuals' }
    ]
  },
  'internal-links-vs-backlinks': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Internal links vs backlinks comparison' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link architecture and structure' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Internal linking strategy' }
    ]
  },
  'keyword-research-for-link-building': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Keyword research for link building campaigns' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Keyword analysis tools' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Search volume and intent research' }
    ]
  },
  'link-audit-and-cleanup': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Link audit and cleanup process' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Backlink audit tools' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link health management' }
    ]
  },
  'link-bait-content-ideas': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Link bait content ideas and examples' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Viral content creation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Shareable content strategy' }
    ]
  },
  'link-building-automation-tools': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Link building automation tools and software' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Automation software interface' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Automated workflow tools' }
    ]
  },
  'link-building-for-affiliate-sites': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Link building for affiliate marketing sites' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Affiliate site optimization' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Affiliate content strategy' }
    ]
  },
  'link-building-for-saas-companies': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Link building for SaaS companies' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SaaS product marketing' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'B2B SaaS strategy' }
    ]
  },
  'link-building-kpis': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link building KPIs and metrics' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Performance metrics dashboard' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Analytics and reporting' }
    ]
  },
  'link-building-scams-to-avoid': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Link building scams to avoid' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Fraudulent link services' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Risk and security awareness' }
    ]
  },
  'link-buying-vs-organic': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Link buying vs organic growth comparison' },
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Paid vs earned links strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Hybrid approach tactics' }
    ]
  },
  'link-exchange-risks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Link exchange risks and penalties' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link scheme consequences' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Google penalty recovery' }
    ]
  },
  'link-indexing-services': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Link indexing services and tools' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Google indexing boost' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Search engine indexing' }
    ]
  },
  'link-insertion-backlinks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Link insertion and niche edits' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Content link placement' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link integration techniques' }
    ]
  },
  'link-magnet-content-types': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Link magnet content types and creation' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Viral content and link attractions' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content marketing strategy' }
    ]
  },
  'local-backlink-strategies': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b914?w=800&h=400&fit=crop', alt: 'Local backlink strategies and tactics' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Local SEO optimization' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Local search rankings' }
    ]
  },
  'manual-vs-automated-link-building': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Manual vs automated link building comparison' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Automation workflow tools' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Efficiency analysis' }
    ]
  },
  'micro-niche-backlinks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Micro niche backlinks strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Niche targeting strategies' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Vertical specific approach' }
    ]
  },
  'natural-backlink-growth': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Natural backlink growth and acquisition' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Organic link building' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'White hat SEO practices' }
    ]
  },
  'niche-edits-guide': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Niche edits guide and strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Content editing for link placement' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Contextual link insertion' }
    ]
  },
  'nicheoutreach-backlinks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Niche outreach and backlinks' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Targeted outreach campaigns' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Niche community engagement' }
    ]
  },
  'outreach-personalization-tips': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Outreach personalization tips and techniques' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Personalized email communication' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Relationship building strategy' }
    ]
  },
  'parasite-seo-backlink-strategy': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Parasite SEO and backlink strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'High authority domain leverage' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Authority hijacking techniques' }
    ]
  },
  'pdf-backlinks-technique': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'PDF backlinks technique and execution' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'PDF document distribution' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'File sharing platforms' }
    ]
  },
  'press-release-backlinks': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Press release backlinks and distribution' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'PR distribution channels' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'News coverage and mentions' }
    ]
  },
  'private-blog-network-risks': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Private blog network risks and penalties' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Black hat link tactics' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Google penalty consequences' }
    ]
  },
  'profile-backlinks-guide': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Profile backlinks guide and strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Social profile optimization' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Directory and profile submissions' }
    ]
  },
  'quick-backlink-wins': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Quick backlink wins and tactics' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Fast link building methods' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Quick wins strategy' }
    ]
  },
  'resource-page-link-building': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Resource page link building strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Resource page opportunities' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Curation and recommendations' }
    ]
  },
  'review-backlink-services': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Review of backlink services and providers' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Service comparison and ratings' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Customer reviews and testimonials' }
    ]
  },
  'seo-link-pyramids': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'SEO link pyramids strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Tiered link building' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link velocity and acceleration' }
    ]
  },
  'seo-ranking-with-backlinks': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'SEO ranking improvement with backlinks' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Ranking factor analysis' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Search result position' }
    ]
  },
  'skyscraper-backlink-technique': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Skyscraper technique for backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Content improvement strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Competitor outreach' }
    ]
  },
  'social-media-signal-backlinks': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Social media signals and backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Social sharing strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Social media engagement' }
    ]
  },
  'spam-score-reduction-for-links': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Spam score reduction for backlinks' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link quality improvement' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Safety and compliance' }
    ]
  },
  'spyfu-competitor-backlinks': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Spyfu competitor backlinks analysis' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Competitive intelligence tools' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link research and analysis' }
    ]
  },
  'tech-startup-backlinks': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Tech startup backlink strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Startup SEO and growth' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Technology industry SEO' }
    ]
  },
  'top-backlink-providers-reviewed': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Top backlink providers reviewed' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Service provider comparison' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Provider ratings and reviews' }
    ]
  },
  'topical-authority-through-links': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Topical authority through backlinks' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Topic clustering and authority' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Content authority building' }
    ]
  },
  'toxic-backlink-removal': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Toxic backlink removal strategy' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Link cleanup and disavowal' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link health recovery' }
    ]
  },
  'travel-blog-guest-posts': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Travel blog guest posts and backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Travel content and niche' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Travel industry partnerships' }
    ]
  },
  'ultimate-link-building-checklist': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Ultimate link building checklist' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Complete SEO checklist' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link building process' }
    ]
  },
  'video-seo-backlinks': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Video SEO and backlinks strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Video marketing and distribution' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Video content strategy' }
    ]
  },
  'voice-search-backlink-optimization': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Voice search and backlink optimization' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Voice search optimization' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Future of search' }
    ]
  },
  'web3-link-building-nfts': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Web3 link building and NFT strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Blockchain and crypto links' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Web3 marketing strategy' }
    ]
  },
  'where-to-find-high-quality-backlinks': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Where to find high quality backlinks' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Quality link sources' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link opportunity discovery' }
    ]
  },
  'white-hat-link-building-techniques': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'White hat link building techniques' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Ethical SEO practices' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Safe link building methods' }
    ]
  },
  'xrumer-backlink-automation': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Xrumer backlink automation tool' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Automation software' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Link posting automation' }
    ]
  },
  'zero-click-search-link-strategies': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Zero click search and link strategy' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Featured snippets optimization' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Search result positioning' }
    ]
  },
  // Additional pages from second batch
  'ai-tools-for-backlink-outreach': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'AI tools for backlink outreach' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Artificial intelligence automation' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Smart outreach tools' }
    ]
  },
  'algorithm-proof-backlink-strategy': {
    video: '6McePZz4XZM',
    images: [
      { src: 'https://images.unsplash.com/photo-1611987620912-b7873f301371?w=800&h=400&fit=crop', alt: 'Algorithm proof backlink strategy' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'SEO algorithm safety' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Future proof strategy' }
    ]
  },
  'backlink-diversity-services': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Backlink diversity services' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Diverse link profile' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Link variety strategy' }
    ]
  },
  'backlink-impact-on-domain-authority': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Backlink impact on domain authority' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Authority metrics' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Domain strength' }
    ]
  },
  'backlink-marketplace-alternatives': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Backlink marketplace alternatives' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Alternative link sources' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', alt: 'Marketplace options' }
    ]
  },
  'backlink-optimization-for-ranking-drops': {
    video: 'zhjRlYxwD6I',
    images: [
      { src: 'https://images.unsplash.com/photo-1543269863-cbf427effbad?w=800&h=400&fit=crop', alt: 'Backlink optimization for ranking drops' },
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Recovery strategy' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Ranking recovery' }
    ]
  },
  'backlink-packages-for-agencies': {
    video: 'nZl1PGr6K9o',
    images: [
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Backlink packages for agencies' },
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Agency services' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'White label solutions' }
    ]
  },
  'backlink-packages-that-boost-sales': {
    video: 'IGtv_2YTqfI',
    images: [
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Sales boosting backlink packages' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Revenue growth' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Sales optimization' }
    ]
  },
  'backlink-penalty-prevention': {
    video: 'jGxFxv2D5d0',
    images: [
      { src: 'https://images.unsplash.com/photo-1518611505868-48510c8dfa93?w=800&h=400&fit=crop', alt: 'Backlink penalty prevention' },
      { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', alt: 'Penalty avoidance' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Safety compliance' }
    ]
  },
  'backlink-pricing-guide': {
    video: 'M7lc1BCxL00',
    images: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Backlink pricing guide' },
      { src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop', alt: 'Pricing analysis' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Cost comparison' }
    ]
  },
  'affordable-contextual-backlinks': {
    video: 'sOzlmuHvZUI',
    images: [
      { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', alt: 'Affordable contextual backlinks' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Cost effective links' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Affordable pricing' }
    ]
  },
  'affordable-high-dr-guest-posts': {
    video: 'lVKvr5PEf-g',
    images: [
      { src: 'https://images.unsplash.com/photo-1516534775068-bb57ce32cb4d?w=800&h=400&fit=crop', alt: 'Affordable high DR guest posts' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', alt: 'Quality at low cost' },
      { src: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=400&fit=crop', alt: 'Guest post value' }
    ]
  }
};

function replaceMediaInPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const basename = path.basename(filePath, '.tsx');
    const mediaData = pageMediaMap[basename];

    if (!mediaData) {
      return { changed: false, error: 'No media mapping found', slug: basename };
    }

    // Replace images in media divs with safer logic
    let imageIndex = 0;
    const mediaRegex = /<div class="media">[\s\S]*?<\/div>/g;
    const mediaDivs = content.match(mediaRegex) || [];

    if (mediaDivs.length > 0) {
      for (let i = 0; i < mediaDivs.length && imageIndex < mediaData.images.length; i++) {
        const img = mediaData.images[imageIndex++];
        const newDiv = `<div class="media">
    <img src="${img.src}" alt="${img.alt}" width="800" height="400" />
    <p><em>${img.alt} (Source: Backlinkoo)</em></p>
  </div>`;
        content = content.replace(mediaDivs[i], newDiv);
      }
    }

    // Add video if missing
    if (!content.includes('youtube.com/embed/')) {
      const videoEmbed = `<div class="media">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${mediaData.video}" title="Link building tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>
    <p><em>Video tutorial on this topic</em></p>
  </div>`;

      if (content.includes('<h2>FAQ')) {
        content = content.replace('<h2>FAQ', videoEmbed + '\n\n  <h2>FAQ');
      } else if (content.includes('<h2>Conclusion')) {
        content = content.replace('<h2>Conclusion', videoEmbed + '\n\n  <h2>Conclusion');
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { changed: true, slug: basename, imageCount: mediaData.images.length, videoId: mediaData.video };
    }

    return { changed: false, slug: basename };
  } catch (error) {
    return { changed: false, error: error.message, slug: path.basename(filePath, '.tsx') };
  }
}

function main() {
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const targetPageNames = Object.keys(pageMediaMap).map(k => `${k}.tsx`);
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx') && targetPageNames.includes(f))
    .map(f => path.join(pagesDir, f));

  let updated = 0;
  let unchanged = 0;
  const errors = [];
  const results = [];

  console.log(`\n📋 Processing ${files.length} pages with media replacement...\n`);

  files.forEach(file => {
    const result = replaceMediaInPage(file);

    if (result.changed) {
      updated++;
      console.log(`✓ UPDATED: ${result.slug}`);
      results.push({ slug: result.slug, status: 'updated', images: result.imageCount, video: result.videoId });
    } else if (result.error) {
      errors.push({ slug: result.slug, error: result.error });
      console.log(`✗ ERROR: ${result.slug} - ${result.error}`);
    } else {
      unchanged++;
      console.log(`⚠ UNCHANGED: ${result.slug}`);
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('MEDIA REPLACEMENT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total pages processed: ${files.length}`);
  console.log(`Updated with new media: ${updated}`);
  console.log(`Unchanged:             ${unchanged}`);
  console.log(`Errors:                ${errors.length}`);
  console.log(`Success rate:          ${Math.round((updated / files.length) * 100)}%`);
  console.log('='.repeat(70));

  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
  }

  console.log('\n✨ Media replacement complete!');
}

main();
