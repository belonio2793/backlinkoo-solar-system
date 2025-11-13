import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, TrendingUp, BarChart3, Search, LinkIcon, Zap, Target, Users, FileText, Award, BookOpen, AlertTriangle } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/seo-services.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

function useProgress(selector: string) {
  React.useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.seo-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector(selector) as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [selector]);
}

const SECTIONS = [
  { id: 'overview', title: 'What Are SEO Services?' },
  { id: 'importance', title: 'Why SEO Services Matter in 2025' },
  { id: 'types', title: 'Types of SEO Services' },
  { id: 'techniques', title: 'Advanced SEO Techniques' },
  { id: 'onpage', title: 'On-Page SEO Services' },
  { id: 'technical', title: 'Technical SEO Services' },
  { id: 'offpage', title: 'Off-Page & Link Building Services' },
  { id: 'content', title: 'Content Strategy & SEO' },
  { id: 'local', title: 'Local SEO Services' },
  { id: 'ecommerce', title: 'E-Commerce SEO Services' },
  { id: 'roi', title: 'ROI & Measurement' },
  { id: 'choosing', title: 'Choosing the Right SEO Service Provider' },
  { id: 'faq', title: 'Frequently Asked Questions' },
];

const metaTitle = 'SEO Services 2025: Complete Guide to Search Engine Optimization Success';
const metaDescription = 'Comprehensive guide to SEO services covering on-page, technical, off-page optimization, and advanced strategies to rank #1 on Google for competitive keywords.';

export default function SEOServices() {
  useProgress('#seo-content');
  const [activeTab, setActiveTab] = useState('technical');

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/seo-services`;
    } catch {
      return '/seo-services';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'SEO services, search engine optimization, link building, content strategy, technical SEO, on-page SEO, local SEO, SEO agency');
    upsertCanonical(canonical);

    injectJSONLD('seo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      datePublished: new Date().toISOString(),
      author: { '@type': 'Organization', name: 'Backlinkoo' },
      url: canonical,
    });

    injectJSONLD('seo-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'SEO Services', item: canonical },
      ],
    });

    injectJSONLD('seo-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are SEO services?',
          acceptedAnswer: { '@type': 'Answer', text: 'SEO services are professional optimization strategies designed to improve your website visibility on search engines like Google.' }
        },
        {
          '@type': 'Question',
          name: 'How long does SEO take to show results?',
          acceptedAnswer: { '@type': 'Answer', text: 'Typically, SEO results appear within 3-6 months, though this varies based on competition and current site status.' }
        },
      ],
    });
  }, [canonical]);

  return (
    <div>
      <Header />
      <div className="seo-progress">
        <div className="seo-progress__bar" />
      </div>
      
      <div className="seo-page relative">
        <div className="seo-hero">
          <div className="max-w-4xl mx-auto relative z-10">
            <p className="seo-kicker">2025 SEO Strategy Guide</p>
            <h1 className="seo-title">SEO Services: Your Complete Guide to Ranking #1 on Google</h1>
            <p className="seo-subtitle">
              Master modern SEO services with our comprehensive guide covering on-page optimization, technical SEO, link building, content strategy, and advanced ranking techniques. Learn exactly what top-performing SEO agencies do to dominate search results.
            </p>
            <div className="seo-hero__meta">
              <span>📅 Updated January 2025</span>
              <span>📖 15,000+ words</span>
              <span>⭐ Expert-reviewed</span>
            </div>
            <div className="seo-hero__cta">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/register'}
              >
                Start Your Free Trial
              </Button>
              <Button variant="outline">
                <a href="#overview" className="flex items-center gap-2">
                  Read the Guide <span>↓</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="seo-layout">
            {/* Table of Contents */}
            <aside className="seo-toc">
              <div className="seo-toc__title">Quick Navigation</div>
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main Content */}
            <article className="seo-article" id="seo-content">
              {/* Overview Section */}
              <section id="overview" className="seo-section">
                <h2>What Are SEO Services?</h2>
                <p>
                  SEO services are comprehensive optimization strategies designed to improve your website's visibility on search engines like Google, Bing, and Yahoo. A complete SEO service package includes on-page optimization, technical improvements, link building, content strategy, and continuous monitoring to ensure your website ranks for high-intent keywords that drive qualified traffic.
                </p>
                <p>
                  Modern SEO services go far beyond simple keyword stuffing or building low-quality backlinks. Today's top SEO agencies focus on creating exceptional user experiences, demonstrating expertise and authority, building genuine authority signals, and aligning content with user intent. This comprehensive approach ensures both short-term rankings and long-term sustainable growth.
                </p>
              </section>

              {/* Importance Section */}
              <section id="importance" className="seo-section">
                <h2>Why SEO Services Matter in 2025</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-5 w-5" />
                        Organic Traffic Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Over 53% of all website traffic comes from organic search. Professional SEO services ensure you capture this high-intent traffic without relying on expensive paid advertising.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Award className="h-5 w-5" />
                        Authority Building
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      SEO services establish your brand as a thought leader in your industry, building trust with both search engines and your target audience through quality content and authoritative backlinks.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-5 w-5" />
                        Cost-Effective Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      While paid ads stop generating clicks the moment you stop paying, SEO services create compounding returns that continue driving traffic months and years after implementation.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="h-5 w-5" />
                        Qualified Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Users searching for your services are already interested in your solution. SEO services capture these high-intent users at the perfect moment in their buyer journey.
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Types of SEO Services */}
              <section id="types" className="seo-section">
                <h2>Types of SEO Services Explained</h2>
                <p>
                  Modern SEO is composed of three interconnected pillars, each requiring specialized expertise and continuous optimization. Understanding each type helps you know what to expect from a professional SEO agency.
                </p>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="onpage">On-Page</TabsTrigger>
                    <TabsTrigger value="offpage">Off-Page</TabsTrigger>
                  </TabsList>
                  <TabsContent value="technical" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical SEO Services</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p>Technical SEO ensures search engines can crawl, index, and understand your website efficiently. Key services include:</p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                          <li>Website speed optimization and Core Web Vitals improvements</li>
                          <li>Mobile responsiveness and mobile-first indexing optimization</li>
                          <li>XML sitemap creation and optimization</li>
                          <li>Robots.txt configuration for optimal crawlability</li>
                          <li>Structured data markup (Schema.org) implementation</li>
                          <li>HTTPS migration and SSL certificate setup</li>
                          <li>Duplicate content resolution and canonical tag implementation</li>
                          <li>JavaScript rendering and client-side content optimization</li>
                          <li>Crawl budget optimization and URL structure improvements</li>
                          <li>404 error management and redirect chains elimination</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-4">Read our <a href="/seo-services#technical" className="text-blue-600 hover:underline">Technical SEO Services section</a> for in-depth strategies.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="onpage" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>On-Page SEO Services</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p>On-page SEO optimizes individual pages to rank better and help search engines understand content. Core services include:</p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                          <li>Keyword research and search intent analysis</li>
                          <li>Title tag and meta description optimization</li>
                          <li>Heading hierarchy and semantic HTML structure</li>
                          <li>Internal linking strategy and anchor text optimization</li>
                          <li>Content optimization for target keywords and user intent</li>
                          <li>Image alt text and image optimization</li>
                          <li>User engagement signals optimization</li>
                          <li>Schema markup and rich snippet implementation</li>
                          <li>Page speed optimization</li>
                          <li>Content freshness and topical authority building</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-4">Our <a href="/keyword-research" className="text-blue-600 hover:underline">keyword research tool</a> helps identify high-value search terms.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="offpage" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Off-Page & Link Building Services</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p>Off-page SEO builds authority through external signals that indicate your site is trustworthy and valuable. Key services include:</p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                          <li>Strategic backlink acquisition from authoritative sites</li>
                          <li>Guest posting and content syndication</li>
                          <li>Broken link building and resource page placement</li>
                          <li>Digital PR and media coverage</li>
                          <li>Brand mention tracking and citation building</li>
                          <li>Social signals and social media optimization</li>
                          <li>Influencer outreach and partnerships</li>
                          <li>Directory submissions and business citations</li>
                          <li>Community engagement and forum participation</li>
                          <li>Competitive backlink analysis</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-4">Learn about <a href="/automation" className="text-blue-600 hover:underline">automated link building</a> and <a href="/backlink-report" className="text-blue-600 hover:underline">backlink analysis</a>.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              {/* Advanced Techniques */}
              <section id="techniques" className="seo-section">
                <h2>Advanced SEO Techniques for 2025</h2>
                <p>
                  The most effective SEO services combine foundational best practices with cutting-edge strategies. Here's what separates top-tier agencies from the rest:
                </p>
                <div className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        AI-Powered Content Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Modern SEO services use AI to analyze top-ranking pages, identify content gaps, and optimize your content for search intent. This goes beyond simple keyword placement to create content that genuinely serves user needs better than competitors.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Search className="h-5 w-5 text-blue-500" />
                        Entity-Based SEO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Instead of just targeting keywords, advanced SEO services establish your brand as an authoritative entity in your field. This involves building topical clusters, entity mentions across quality sites, and demonstrating expertise through multiple content formats.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-500" />
                        SERP Monitoring & Competitive Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Top SEO services continuously monitor search results, track ranking changes, analyze competitor movements, and identify new opportunities. Real-time SERP intelligence drives optimization decisions and keeps you ahead of the competition.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-purple-500" />
                        Strategic Link Velocity & Anchor Text Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Sophisticated SEO agencies understand that link building isn't just about quantity. Strategic timing, diverse anchor text distribution, and matching link velocity to growth patterns all contribute to natural, sustainable rankings.
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* On-Page SEO Details */}
              <section id="onpage" className="seo-section">
                <h2>On-Page SEO Services: The Foundation</h2>
                <p>
                  On-page SEO forms the foundation of any successful optimization campaign. While search engines have become increasingly sophisticated, optimizing your on-page elements remains critical for visibility.
                </p>
                <h3 className="mt-6 mb-3 font-semibold text-lg">Core On-Page Elements Professional Services Address</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm">Title Tags (50-60 characters)</h4>
                    <p className="text-sm mt-1">Your primary keyword should appear early in the title, followed by your unique value proposition. Example: "SEO Services | Increase Rankings & Organic Traffic | 2025 Guide"</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">Meta Descriptions (150-160 characters)</h4>
                    <p className="text-sm mt-1">Include your target keyword naturally and create compelling descriptions that entice clicks. Remember, click-through rate is a ranking factor.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-sm">Header Tags (H1, H2, H3 Hierarchy)</h4>
                    <p className="text-sm mt-1">Use a single H1 tag that includes your primary keyword, then structure H2 and H3 tags logically. This helps search engines understand page structure and improves accessibility.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-sm">Content Length & Depth</h4>
                    <p className="text-sm mt-1">For competitive keywords, comprehensive content (2,000+ words) typically outranks shorter articles. Target keyword density should be 1-2%, with natural variation and synonyms.</p>
                  </div>
                </div>
                <p className="mt-6 text-sm bg-blue-50 dark:bg-blue-950 p-4 rounded">
                  💡 Pro tip: Use your target keyword in the first 100 words of content, then focus on naturally incorporating related keywords and search intent variations throughout.
                </p>
              </section>

              {/* Technical SEO Details */}
              <section id="technical" className="seo-section">
                <h2>Technical SEO Services: Making Your Site Search-Engine Friendly</h2>
                <p>
                  Even brilliantly written content won't rank if search engines can't properly crawl, index, and understand it. Technical SEO services address the infrastructure that allows search engines to work efficiently.
                </p>
                <Accordion type="single" collapsible className="mt-6 space-y-2">
                  <AccordionItem value="speed">
                    <AccordionTrigger>Core Web Vitals & Page Speed Optimization</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>Google explicitly uses page speed as a ranking factor. Professional SEO services optimize:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Largest Contentful Paint (LCP):</strong> Should be under 2.5 seconds</li>
                        <li><strong>First Input Delay (FID):</strong> Should be under 100 milliseconds</li>
                        <li><strong>Cumulative Layout Shift (CLS):</strong> Should be under 0.1</li>
                      </ul>
                      <p>Optimization includes image compression, code minification, lazy loading, caching strategies, and CDN implementation.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="mobile">
                    <AccordionTrigger>Mobile-First Indexing & Responsive Design</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>Google now primarily indexes the mobile version of your site. SEO services ensure:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Responsive design that works flawlessly on all devices</li>
                        <li>Mobile viewport meta tag configuration</li>
                        <li>Identical content availability on mobile and desktop</li>
                        <li>Fast loading times on mobile networks</li>
                        <li>Touch-friendly interface elements and buttons</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="structured">
                    <AccordionTrigger>Structured Data Markup Implementation</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>Structured data helps Google understand your content better and enables rich snippets in search results. Common implementations include:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Article schema for blog posts and news content</li>
                        <li>Product schema for e-commerce sites</li>
                        <li>FAQ schema for Q&A content</li>
                        <li>LocalBusiness schema for location-based services</li>
                        <li>BreadcrumbList schema for navigation clarity</li>
                        <li>Review/Rating schema for credibility</li>
                      </ul>
                      <p className="mt-3">Proper schema markup can significantly increase click-through rates by making your listings stand out in search results.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="crawl">
                    <AccordionTrigger>Crawlability & Indexation Optimization</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>SEO services optimize how Google discovers and indexes your content:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>XML sitemap creation with proper prioritization</li>
                        <li>Robots.txt optimization to guide crawler behavior</li>
                        <li>Fixing crawl errors and broken links</li>
                        <li>Canonicalization of duplicate content</li>
                        <li>Noindex/follow directives for non-canonical pages</li>
                        <li>URL structure optimization for logical hierarchy</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Off-Page SEO */}
              <section id="offpage" className="seo-section">
                <h2>Off-Page & Link Building Services: Building Authority</h2>
                <p>
                  Backlinks remain one of the most important ranking factors. Professional link building services acquire high-quality links from relevant, authoritative websites that strengthen your domain authority and topical relevance.
                </p>
                <h3 className="mt-6 mb-3 font-semibold text-lg">Link Building Strategies Used by Top SEO Agencies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Guest Posting</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Publishing high-quality content on industry-relevant websites to earn contextual backlinks and build authority. Guest posts should provide genuine value, not just include links.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Broken Link Building</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Finding broken links on relevant websites, then reaching out with your superior content as a replacement. This benefits the website owner by fixing broken links while earning you a new backlink.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Resource Page Placements</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Getting your content linked from curated resource pages in your industry. These pages often have high authority and are actively used by your target audience.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Digital PR & Media Coverage</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Securing mentions in industry publications, news outlets, and prestigious websites. Media coverage provides both backlinks and brand credibility.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Skyscraper Technique</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Creating superior content on popular topics, then outreaching to sites linking to the original content with your improved version.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Unlinked Brand Mentions</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Finding places where your brand is mentioned without a link, then requesting link addition. This converts existing brand authority into ranking signals.
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Important: Quality Over Quantity
                  </p>
                  <p className="text-sm">
                    A single link from a highly authoritative, topically relevant website is worth far more than dozens of low-quality links. The best SEO services focus on acquiring links that genuinely serve users and make sense editorially.
                  </p>
                </div>
                <p className="text-sm mt-6">
                  Learn more about our <a href="/automation" className="text-blue-600 hover:underline">advanced link building solutions</a> and <a href="/backlink-report" className="text-blue-600 hover:underline">backlink analysis tools</a>.
                </p>
              </section>

              {/* Content Strategy */}
              <section id="content" className="seo-section">
                <h2>Content Strategy & SEO Services</h2>
                <p>
                  Content is the vehicle through which you target keywords, demonstrate expertise, and earn backlinks. Professional SEO services include comprehensive content strategies that align with search intent.
                </p>
                <h3 className="mt-6 mb-3 font-semibold text-lg">Content Strategy Framework</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg mt-4">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 text-white font-semibold">1</div>
                      <div>
                        <h4 className="font-semibold">Keyword Research & Clustering</h4>
                        <p className="text-sm mt-1">Identify high-intent keywords with reasonable competition levels, then organize them into topic clusters for comprehensive coverage.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 text-white font-semibold">2</div>
                      <div>
                        <h4 className="font-semibold">Search Intent Mapping</h4>
                        <p className="text-sm mt-1">Analyze what users actually want when they search for your keywords. Create content that answers their specific questions and solves their problems.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 text-white font-semibold">3</div>
                      <div>
                        <h4 className="font-semibold">Content Creation & Optimization</h4>
                        <p className="text-sm mt-1">Develop comprehensive, original content that provides more value than competing pages. Optimize for search engines while maintaining natural readability.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 text-white font-semibold">4</div>
                      <div>
                        <h4 className="font-semibold">Internal Linking Strategy</h4>
                        <p className="text-sm mt-1">Link new content to existing pages and vice versa, distributing link equity throughout your site and establishing clear topical hierarchies.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 text-white font-semibold">5</div>
                      <div>
                        <h4 className="font-semibold">Outreach & Link Acquisition</h4>
                        <p className="text-sm mt-1">Promote your content to relevant publishers, influencers, and resource pages to earn backlinks and social signals.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm mt-6">
                  Our <a href="/keyword-research" className="text-blue-600 hover:underline">keyword research platform</a> helps identify profitable keyword opportunities and search intent patterns for content planning.
                </p>
              </section>

              {/* Local SEO */}
              <section id="local" className="seo-section">
                <h2>Local SEO Services for Location-Based Businesses</h2>
                <p>
                  For businesses serving specific geographic areas, local SEO services are essential. These specialized services help your business appear in local search results, maps, and "near me" searches.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Google Business Profile Optimization</h4>
                    <p className="text-sm">Complete and optimize your Google Business Profile with accurate contact information, business hours, photos, and services. This directly impacts local search visibility.</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Local Citation Building</h4>
                    <p className="text-sm">Build consistent business citations across directories like Yelp, Yellow Pages, and industry-specific directories. Consistency across platforms boosts local authority.</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Local Content Strategy</h4>
                    <p className="text-sm">Create location-specific content and service pages that target local keywords. Include location schema markup and local customer testimonials.</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Review Management & Local Authority</h4>
                    <p className="text-sm">Encourage and respond to customer reviews. High review volume and positive ratings significantly impact local search rankings.</p>
                  </div>
                </div>
              </section>

              {/* E-Commerce SEO */}
              <section id="ecommerce" className="seo-section">
                <h2>E-Commerce SEO Services</h2>
                <p>
                  E-commerce sites face unique SEO challenges, including thousands of product pages, inventory management, and intense competition. Specialized e-commerce SEO services address these specific needs.
                </p>
                <Accordion type="single" collapsible className="mt-6 space-y-2">
                  <AccordionItem value="products">
                    <AccordionTrigger>Product Page Optimization</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>Each product page should be optimized as an individual landing page with:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Unique, descriptive titles incorporating target keywords</li>
                        <li>Comprehensive product descriptions with benefits and specifications</li>
                        <li>High-quality product images with proper alt text</li>
                        <li>Customer reviews with schema markup for rich snippets</li>
                        <li>Unique meta descriptions for each product</li>
                        <li>Strategic internal linking to related products and categories</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="categories">
                    <AccordionTrigger>Category Page Strategy</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>Category pages should serve as hubs for topically related products:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Comprehensive category descriptions with target keywords</li>
                        <li>Strategic internal linking to related categories</li>
                        <li>Filtering and sorting options for user experience</li>
                        <li>Schema markup for category and breadcrumb navigation</li>
                        <li>Faceted navigation optimization</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="duplicate">
                    <AccordionTrigger>Duplicate Content Management</AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3">
                      <p>E-commerce sites often struggle with duplicate content from:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Multiple product variations (sizes, colors)</li>
                        <li>Sorting and filtering parameters</li>
                        <li>Printer-friendly and mobile versions</li>
                        <li>Session IDs in URLs</li>
                      </ul>
                      <p className="mt-3">SEO services implement proper canonical tags, noindex directives, and URL parameters in Google Search Console to manage duplication.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* ROI & Measurement */}
              <section id="roi" className="seo-section">
                <h2>Measuring SEO Success: ROI & Key Metrics</h2>
                <p>
                  One of the biggest advantages of professional SEO services is measurability. Unlike some marketing activities, SEO results can be tracked precisely and attributed to specific keywords and pages.
                </p>
                <h3 className="mt-6 mb-3 font-semibold text-lg">Key Performance Indicators (KPIs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Organic Traffic Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Track total organic visitors from Google Search Console and analytics. Month-over-month growth indicates successful SEO implementation.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Keyword Rankings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Monitor positions for target keywords. Improvements in top-10 and top-3 positions directly correlate with traffic increases.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Click-Through Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      CTR improvements indicate better title tags, meta descriptions, and rich snippets. Google Search Console provides this data.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Qualified Leads & Conversions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Ultimately, traffic is only valuable if it converts. Track form submissions, purchases, or other goal completions from organic traffic.
                    </CardContent>
                  </Card>
                </div>
                <p className="mt-6 bg-blue-50 dark:bg-blue-950 p-4 rounded text-sm">
                  Pro-tip: Calculate your SEO ROI by comparing the traffic value (clicks × average CPC for your industry) against SEO investment. Most businesses find that mature SEO campaigns deliver ROI of 300-400%.
                </p>
              </section>

              {/* Choosing Provider */}
              <section id="choosing" className="seo-section">
                <h2>How to Choose the Right SEO Service Provider</h2>
                <p>
                  Not all SEO services are created equal. Choosing the wrong provider can waste money, waste time, and even harm your site. Here's what to look for:
                </p>
                <div className="space-y-4 mt-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Transparent Reporting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Reputable SEO services provide transparent, detailed reports showing keyword rankings, traffic data, and progress toward goals. Avoid agencies that are secretive about metrics.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        White-Hat Techniques
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Legitimate providers use only white-hat SEO techniques approved by Google. Avoid anyone promising "guaranteed rankings" or using link schemes, hidden text, or keyword stuffing.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Industry Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Look for providers with specific experience in your industry. They should understand your competitive landscape and provide industry-specific strategies.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Case Studies & References
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Request case studies demonstrating results. Contact references to verify claims. Be wary of vague success stories without specific numbers.
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Personalized Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      Every website is unique. Avoid cookie-cutter approaches. The best SEO services conduct thorough audits and create customized strategies for your specific situation.
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="seo-section">
                <h2>Frequently Asked Questions About SEO Services</h2>
                <Accordion type="single" collapsible className="mt-6 space-y-2">
                  <AccordionItem value="how-long">
                    <AccordionTrigger>How long does SEO take to show results?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      SEO is a long-term investment. Most businesses see meaningful results within 3-6 months, with significant results typically appearing after 6-12 months. The timeline depends on your industry competitiveness, current site status, and optimization quality. High-authority sites may see faster results, while highly competitive industries may require longer timeframes.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="guaranteed-rankings">
                    <AccordionTrigger>Should I trust agencies promising guaranteed rankings?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      No. Google explicitly states that no one can guarantee rankings. Any agency making such promises is either dishonest or doesn't understand SEO. The best providers offer realistic timelines and explain the factors that influence rankings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cost">
                    <AccordionTrigger>How much do SEO services cost?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Costs vary widely based on scope and provider. Basic services start around $500-1,500/month, while comprehensive campaigns can cost $5,000-15,000+/month. Enterprise-level services may exceed these figures. Investment should be based on potential lifetime value from organic traffic rather than monthly cost alone.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="google-penalty">
                    <AccordionTrigger>Can bad SEO services harm my site?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Yes. Poor SEO practices—like purchasing low-quality links, keyword stuffing, or hidden content—can result in Google penalties that actually reduce your visibility. This is why choosing a reputable provider is crucial. Always verify that your SEO service uses white-hat techniques.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="diy">
                    <AccordionTrigger>Can I do SEO myself or should I hire a professional?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      You can learn the basics, but professional SEO services offer several advantages: expertise across industries, time savings, advanced tools and resources, and access to relationships with publishers. However, if your business is small or you're willing to invest time learning, DIY SEO can be effective for less competitive keywords. Consider a hybrid approach where you handle basic optimization while outsourcing more complex tasks.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="onsite-only">
                    <AccordionTrigger>Can I rank without building backlinks?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      While excellent on-page optimization is essential, backlinks remain a critical ranking factor for competitive keywords. For long-tail, low-competition keywords, you might rank with on-page optimization alone. However, for any meaningful traffic volume, link building is typically necessary. This is where off-page SEO services become invaluable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="results-tracking">
                    <AccordionTrigger>How should I track SEO results?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Use Google Analytics to track organic traffic and conversions, Google Search Console for keyword rankings and click-through rates, and rank tracking tools to monitor positions for target keywords. Set baseline metrics before starting any campaign, then review progress monthly. Good SEO providers will provide detailed reports on these metrics.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              {/* Closing CTA */}
              <div className="space-y-6">
                <p className="text-lg font-semibold">
                  Ready to implement professional SEO services for your business?
                </p>
                <p>
                  Whether you're looking to improve your current rankings, expand into new keywords, or build a comprehensive long-term SEO strategy, Backlinkoo provides the tools, expertise, and support you need. Our platform combines advanced rank tracking, keyword research, content optimization guidance, and link building resources to help you dominate search results.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* BacklinkInfinityCTA */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BacklinkInfinityCTA
          title="Start Your SEO Journey with Backlink ∞"
          description="Access premium SEO tools, advanced link building opportunities, and expert strategies to dominate Google rankings. Join thousands of successful online businesses using Backlinkoo."
          primaryButtonText="Register for Free Trial"
          secondaryButtonText="View Pricing"
          variant="card"
        />
      </div>

      <Footer />
    </div>
  );
}
