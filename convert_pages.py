#!/usr/bin/env python3
import os
import re
from pathlib import Path

PAGES_DIR = "/src/pages"

PAGES_TO_CONVERT = [
    'algorithm-proof-backlink-strategy',
    'backlink-diversity-services',
    'backlink-impact-on-domain-authority',
    'backlink-marketplace-alternatives',
    'backlink-optimization-for-ranking-drops',
    'backlink-packages-for-agencies',
    'backlink-packages-that-boost-sales',
    'backlink-penalty-prevention',
    'backlink-pricing-guide',
    'backlink-quality-vs-quantity-debate',
    'backlink-recommendations-for-2025',
    'backlink-recommendations-for-new-domains',
    'backlink-roi-calculation',
    'backlink-services-for-international-sites',
    'backlink-services-for-multilingual-brands',
    'backlink-services-for-niches',
    'backlink-services-for-wordpress-sites',
    'backlink-services-that-actually-work',
    'backlinks-for-affiliate-marketers',
    'backlinks-for-agencies',
    'backlinks-for-ai-websites',
    'backlinks-for-b2b-companies',
    'backlinks-for-bloggers',
    'backlinks-for-consultants',
    'backlinks-for-crypto-sites',
    'backlinks-for-dropshipping-stores',
    'backlinks-for-lawyer-websites',
    'backlinks-for-lead-generation-websites',
    'backlinks-for-local-maps-ranking',
    'backlinks-for-medical-websites',
    'backlinks-for-new-brands',
    'backlinks-for-portfolio-websites',
    'backlinks-for-real-estate-websites',
    'backlinks-for-saas-startups',
    'backlinks-for-service-businesses',
    'backlinks-guaranteed-indexing',
    'best-backlinks-for-fast-ranking',
    'best-places-to-buy-safe-backlinks',
    'cheapest-white-hat-backlinks-online',
    'cheap-seo-services-for-small-business',
    'competitor-backlink-replication-guide',
    'contextual-link-packages',
    'editorial-backlinks-service',
    'email-outreach-for-niche-edits',
    'geo-targeted-seo-backlinks',
    'google-friendly-backlink-services',
    'google-news-approved-backlinks',
    'google-ranking-boost-services',
    'guest-post-marketplaces-comparison',
    'high-authority-niche-edits-service',
    'high-authority-seo-packages',
    'high-dr-backlinks-for-cheap',
    'high-traffic-guest-posting-sites',
    'high-trust-flow-backlinks',
    'homepage-link-placements',
    'how-to-audit-paid-backlinks',
    'how-to-boost-domain-authority-fast',
    'how-to-check-if-backlinks-are-indexed',
    'how-to-choose-a-backlink-provider',
    'how-to-fix-ranking-drop-after-update',
    'how-to-get-high-dr-backlinks-free',
    'how-to-get-indexing-for-backlinks',
    'how-to-increase-crawl-demand',
    'how-to-recover-lost-backlinks',
    'internal-link-boosting-strategies',
    'link-building-for-amazon-affiliates',
    'link-building-for-finance-niche',
    'link-building-for-health-niche',
    'link-building-for-new-blogs',
    'link-building-for-tech-niche',
    'link-building-for-youtube-channels',
    'link-building-packages-for-small-business',
    'link-insertion-services',
    'local-seo-backlink-packages',
    'local-seo-citations-and-backlinks',
    'manual-link-building-service',
    'map-pack-seo-and-backlink-strategy',
    'mixed-backlink-packages',
    'monthly-backlink-subscription-services',
    'monthly-seo-and-backlink-plans',
    'niche-backlinks-for-local-businesses',
    'niche-specific-guest-post-services',
    'on-page-seo-and-backlink-bundle',
    'organic-backlink-services-for-startups',
    'paid-backlink-alternatives',
    'ranking-improvement-case-studies',
    'safe-backlink-building-methods',
    'seo-ranking-improvement-services',
    'seo-reseller-backlink-packages',
    'seo-services-after-google-core-update',
    'seo-services-for-ecommerce-stores',
    'tier-2-backlink-services',
    'tier-3-backlink-services',
    'white-label-link-building-service',
    'affordable-contextual-backlinks',
    'affordable-high-dr-guest-posts'
]

def to_component_name(slug):
    return ''.join(word.capitalize() for word in slug.split('-')) + 'Page'

def extract_title_subtitle_html(file_content):
    title_match = re.search(r'const title = ["\']([^"\']+)["\']', file_content)
    subtitle_match = re.search(r'const subtitle = ["\']([^"\']+)["\']', file_content)
    html_match = re.search(r'const htmlContent = `([\s\S]*?)`\s*(?:;|const)', file_content)
    
    if not (title_match and subtitle_match and html_match):
        return None
    
    title = title_match.group(1)
    subtitle = subtitle_match.group(1)
    html_content = html_match.group(1).strip()
    
    return title, subtitle, html_content

def generate_new_page(slug, title, subtitle, html_content):
    component_name = to_component_name(slug)
    
    escaped_title = title.replace('"', '\\"').replace('`', '\\`')
    escaped_subtitle = subtitle.replace('"', '\\"').replace('`', '\\`')
    escaped_html = html_content.replace('`', '\\`')
    
    template = f'''import React from 'react';
import {{ GenericPageTemplate }} from '@/components/GenericPageTemplate';

const {component_name}: React.FC = () => {{
  const title = "{escaped_title}";
  const subtitle = "{escaped_subtitle}";
  const htmlContent = `{escaped_html}`;

  return <GenericPageTemplate title={{title}} subtitle={{subtitle}} htmlContent={{htmlContent}} />;
}};

export default {component_name};
'''
    return template

def main():
    converted = 0
    failed = 0
    errors = []
    
    for page_slug in PAGES_TO_CONVERT:
        file_path = os.path.join(PAGES_DIR, f"{page_slug}.tsx")
        
        if not os.path.exists(file_path):
            errors.append(f"File not found: {file_path}")
            failed += 1
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            extracted = extract_title_subtitle_html(content)
            if not extracted:
                errors.append(f"Could not extract data from: {page_slug}")
                failed += 1
                continue
            
            title, subtitle, html_content = extracted
            new_content = generate_new_page(page_slug, title, subtitle, html_content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            converted += 1
            print(f"✓ Converted: {page_slug}")
        
        except Exception as e:
            errors.append(f"Error processing {page_slug}: {str(e)}")
            failed += 1
            print(f"✗ Failed: {page_slug} - {str(e)}")
    
    print(f"\n=== Conversion Summary ===")
    print(f"Total converted: {converted}/{len(PAGES_TO_CONVERT)}")
    print(f"Failed: {failed}")
    
    if errors:
        print(f"\n=== Errors ===")
        for error in errors:
            print(f"- {error}")

if __name__ == "__main__":
    main()
