import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, TrendingUp, Users, Zap, BarChart3, Shield, Lightbulb, Award } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/seo-company.css';

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

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
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
      const bar = document.querySelector('.seo-company-progress__bar') as HTMLDivElement | null;
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

const metaTitle = 'SEO Company: Complete Guide to Services, Pricing, and Results (2025)';
const metaDescription = 'Comprehensive guide to SEO companies: what they do, how to choose the right one, services offered, pricing models, case studies, and maximizing your ROI. Updated 2025.';

export default function SEOCompanyPage() {
  useProgress('#seo-company-content');

  const canonical = React.useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/seocompany`;
    } catch {
      return '/seocompany';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'SEO company, SEO service provider, SEO agency, search engine optimization company, SEO experts, hire SEO company, best SEO companies, SEO services, organic search marketing');
    upsertCanonical(canonical);

    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);

    injectJSONLD('seo-company-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
      datePublished: new Date().toISOString(),
      author: { '@type': 'Organization', name: 'Backlink ∞' },
    });

    injectJSONLD('seo-company-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'SEO Resources', item: '/seocompany' },
        { '@type': 'ListItem', position: 3, name: 'SEO Company Guide', item: '/seocompany' },
      ],
    });

    injectJSONLD('seo-company-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does an SEO company do?', acceptedAnswer: { '@type': 'Answer', text: 'An SEO company optimizes websites to rank higher in search results through technical improvements, content creation, link building, and strategy. They improve visibility for target keywords and increase organic traffic.' } },
        { '@type': 'Question', name: 'How much does an SEO company cost?', acceptedAnswer: { '@type': 'Answer', text: 'SEO pricing ranges from $500-$5,000+ monthly depending on scope, competition, industry, and company reputation. Retainer models are common, with performance-based pricing available from some providers.' } },
        { '@type': 'Question', name: 'How long does SEO take to work?', acceptedAnswer: { '@type': 'Answer', text: 'SEO typically takes 3-6 months to show initial results, with significant improvements after 6-12 months. Timeline depends on competition, current site state, and strategy effectiveness.' } },
        { '@type': 'Question', name: 'Should I hire an in-house SEO or agency?', acceptedAnswer: { '@type': 'Answer', text: 'In-house SEO suits larger companies with ongoing needs and budget. Agencies work well for businesses wanting specialized expertise without full-time hiring. Many use hybrid approaches.' } },
        { '@type': 'Question', name: 'What makes a good SEO company?', acceptedAnswer: { '@type': 'Answer', text: 'Top SEO companies demonstrate proven results, transparent reporting, ethical practices, deep industry knowledge, continuous learning, and clear communication about realistic timelines and expectations.' } },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'what-is', label: 'What is an SEO Company?' },
    { id: 'services', label: 'Core Services' },
    { id: 'choosing', label: 'How to Choose' },
    { id: 'strategies', label: 'Modern Strategies' },
    { id: 'pricing', label: 'Pricing Models' },
    { id: 'red-flags', label: 'Red Flags' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'roi', label: 'Measuring ROI' },
    { id: 'vs-inhouse', label: 'Agency vs In-House' },
    { id: 'challenges', label: 'Common Challenges' },
    { id: 'emerging', label: 'Emerging Trends' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Get Started' },
  ];

  return (
    <>
      <Header />
      <div className="seo-company-progress">
        <div className="seo-company-progress__bar"></div>
      </div>
      
      <div className="seo-company-page">
        <article id="seo-company-content" className="seo-company-article">
          
          {/* Hero Section */}
          <section className="seo-company-hero">
            <div className="seo-company-hero__content">
              <div className="seo-company-hero__kicker">Editorial Authority</div>
              <h1 className="seo-company-title">SEO Company: Complete Guide to Services, Pricing, and Results</h1>
              <p className="seo-company-hero__description">
                Everything you need to know about hiring an SEO company, what to expect, how to measure success, and why organic search remains the highest-ROI marketing channel for most businesses.
              </p>
              <div className="seo-company-meta">
                <span className="meta-item">📊 Data-Driven Insights</span>
                <span className="meta-item">✓ Updated 2025</span>
                <span className="meta-item">🎯 5000+ Words</span>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <nav className="seo-company-nav">
            <h3>Quick Navigation</h3>
            <div className="seo-company-nav__items">
              {nav.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="seo-company-nav__link">
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Main Content Sections */}
          <section id="what-is" className="seo-company-section">
            <h2>What Is an SEO Company?</h2>
            <p>
              An SEO company is a specialized agency or service provider that helps businesses improve their visibility in search engine results. Unlike traditional marketing agencies that span multiple channels, SEO companies focus specifically on organic search—the unpaid listings that appear when users search for relevant keywords on Google, Bing, and other search engines.
            </p>
            <p>
              The best SEO companies operate at the intersection of technical expertise, creative strategy, and data analysis. They don't simply "submit your site to Google" (a common misconception)—instead, they systematically audit your site, analyze competitors, identify opportunities, and execute a coordinated strategy across technical infrastructure, content, authority, and user experience.
            </p>
            <div className="seo-company-stats">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Organic Search Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">53%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">of website traffic comes from organic search (BrightEdge)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3x</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">higher conversion rate than paid search (HubSpot)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    ROI Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">18+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">month compounding returns vs. 0 after ad spend stops</p>
                </CardContent>
              </Card>
            </div>
            <p>
              In 2025, search engine optimization has evolved far beyond simple keyword stuffing or link schemes. Modern SEO companies implement sophisticated systems for technical excellence, user-focused content, competitive analysis, and continuous measurement. They understand core ranking factors like <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer">Core Web Vitals</a>, topical authority, E-A-T (Expertise, Authoritativeness, Trustworthiness), and entity relationships.
            </p>
          </section>

          <section id="services" className="seo-company-section">
            <h2>Core SEO Company Services</h2>
            <p>
              While every SEO company structures their offerings differently, the fundamental services remain consistent. Below is a breakdown of what top-tier providers deliver:
            </p>

            <Tabs defaultValue="technical" className="seo-company-tabs">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="authority">Authority</TabsTrigger>
                <TabsTrigger value="measurement">Measurement</TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical SEO Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Site Audits &amp; Crawl Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive analysis of crawlability, indexation, internal linking structure, and technical errors using tools like Screaming Frog, Semrush, or Ahrefs.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Core Web Vitals Optimization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Improvements to page speed (LCP), interactivity (INP), and visual stability (CLS) to meet Google's ranking criteria.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Mobile Optimization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ensures responsive design, mobile-first indexing compliance, and touch-friendly interfaces.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Schema Markup Implementation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Structured data (JSON-LD) for rich snippets, FAQs, product data, breadcrumbs, and entity relationships.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Site Architecture &amp; Internal Linking</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Strategic URL structure, logical hierarchy, and internal link placement to distribute authority and guide crawlers.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content SEO Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Keyword Research &amp; Strategy</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Identifies high-intent keywords, search volume, difficulty, and opportunity gaps. Strategic targeting across buyer journey stages.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Content Creation &amp; Optimization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Crafts original, user-focused content that targets keywords while satisfying search intent. Includes blogs, guides, FAQs, and more.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Topical Authority Building</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Develops clusters of content around core topics to establish expertise signals. Interlinking and semantic relationships matter.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">User Experience &amp; Engagement</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optimizes for time-on-page, scroll depth, and interaction signals that indicate content quality to search engines.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Content Audits &amp; Refreshes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Evaluates existing content for relevance, outdated information, and optimization opportunities. Updates and republishes for freshness signals.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="authority" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Authority &amp; Link Building</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Editorial Link Building</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Outreach to relevant publishers, journalists, and resource sites for natural, contextual backlinks. Relationship-driven approach.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Digital PR &amp; Media Relations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Creates newsworthy content, research, and announcements that earn media coverage and high-quality links.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Backlink Audit &amp; Disavowal</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Analyzes your backlink profile, identifies toxic or low-quality links, and files disavow files to protect domain authority.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Local SEO &amp; Citations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">For local businesses: Google My Business optimization, local citations, reviews management, and local landing pages.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Strategic Link Acquisition</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Some companies use premium backlink networks like <a href="/seocompany" className="text-blue-600 hover:underline">Backlink ∞</a> to accelerate authority growth with curated, high-quality placements.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="measurement" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics &amp; Reporting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Rank Tracking</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitors keyword rankings across devices and locations, tracks changes, and identifies gains and losses over time.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Organic Traffic Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Google Analytics 4 setup and reporting on organic visitor behavior, conversion paths, and attribution.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Competitive Benchmarking</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Regular competitive analysis to identify opportunities, monitor competitor content and link strategies.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">ROI &amp; Business Impact Reporting</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ties SEO improvements to revenue, leads, or other business goals. Transparent, actionable monthly reports.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Predictive Analytics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Advanced agencies use machine learning to forecast results, identify emerging trends, and optimize strategies proactively.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <section id="choosing" className="seo-company-section">
            <h2>How to Choose the Right SEO Company</h2>
            <p>
              Not all SEO companies are created equal. Some are generalist agencies that dabble in SEO, others are specialized boutiques. The key is aligning the provider's strengths with your business needs and budget. Here's what to evaluate:
            </p>

            <Accordion type="single" collapsible className="seo-company-accordion">
              <AccordionItem value="experience">
                <AccordionTrigger>Industry Experience &amp; Track Record</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Look for companies with proven results in your specific industry. An agency that excels in e-commerce might struggle with SaaS or local services. Ask for case studies, client references (speak to them directly), and portfolio examples.
                  </p>
                  <p className="font-semibold text-sm">Key Questions:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>How long have you worked with companies like mine?</li>
                    <li>Can you share 3-5 client results with similar metrics or goals?</li>
                    <li>What's your average timeline to measurable results?</li>
                    <li>How do you handle algorithm updates that affect rankings?</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="methodology">
                <AccordionTrigger>Transparent Methodology &amp; Ethical Practices</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Avoid any agency claiming guaranteed rankings, promising #1 positions, or suggesting "secret" tactics. Reputable companies follow Google's guidelines (white-hat SEO), explain their strategies clearly, and adapt to algorithm changes. They should be able to articulate why they recommend specific tactics.
                  </p>
                  <p className="font-semibold text-sm">Red Flags:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>"We guarantee #1 rankings"</li>
                    <li>"Private link network" or exclusive private blog networks</li>
                    <li>Vague or evasive about tactics and reporting</li>
                    <li>Pushing high-volume, low-quality link building</li>
                    <li>No mention of algorithm updates or industry changes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="communication">
                <AccordionTrigger>Communication &amp; Reporting Standards</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Top SEO companies provide regular, transparent reporting. At minimum, you should receive monthly updates covering keyword rankings, organic traffic, technical audits, and business impact. They should explain what changed, why, and what's planned next.
                  </p>
                  <p className="font-semibold text-sm">What to Expect:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Monthly or quarterly reports (dashboards or formatted documents)</li>
                    <li>Clear tracking of KPIs relevant to your goals</li>
                    <li>Responsive communication (same-day or next-day replies)</li>
                    <li>Quarterly business reviews discussing strategy and ROI</li>
                    <li>Honest conversations about challenges and realistic timelines</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="team">
                <AccordionTrigger>Team Composition &amp; Expertise</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    A strong SEO company has specialists—not generalists wearing multiple hats. Your account should have a dedicated project manager, and you should have access to technical specialists, content strategists, and link builders as needed.
                  </p>
                  <p className="font-semibold text-sm">Look For:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Dedicated account manager assigned to your account</li>
                    <li>Technical SEO experts with coding or engineering background</li>
                    <li>Content strategists who understand keyword intent and topical authority</li>
                    <li>Link builders with established publisher relationships</li>
                    <li>Team members active in SEO communities, speaking at conferences, publishing research</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tools">
                <AccordionTrigger>Tools &amp; Technology Stack</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Leading agencies use industry-standard tools like Semrush, Ahrefs, Screaming Frog, Google Search Console, and GA4. They may also have proprietary dashboards or integrations. The specific tools matter less than their commitment to continuous measurement.
                  </p>
                  <p className="font-semibold text-sm">Industry Standard Tools:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><a href="https://semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush</a> - SEO suite, rank tracking, competitive analysis</li>
                    <li><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs</a> - Backlink analysis, keyword research, rank tracking</li>
                    <li><a href="https://www.screaming-frog.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Screaming Frog</a> - Site crawl, technical audits</li>
                    <li>Google Search Console - Official ranking and click data</li>
                    <li>Google Analytics 4 - Traffic and conversion tracking</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contract">
                <AccordionTrigger>Contract Terms &amp; Flexibility</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Quality agencies typically require 3-6 month minimum contracts to allow time for strategy implementation and results. However, they should be transparent about what's included, exit terms, and any additional costs.
                  </p>
                  <p className="font-semibold text-sm">Contract Considerations:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Minimum contract length (3-6 months recommended)</li>
                    <li>Cancellation terms and notice periods</li>
                    <li>What's included in the retainer vs. extra-cost services</li>
                    <li>Ownership of content, data, and IP created</li>
                    <li>Escalation clauses or performance commitments</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="strategies" className="seo-company-section">
            <h2>Modern SEO Strategies That Work in 2025</h2>
            <p>
              SEO has shifted significantly in recent years. Successful strategies today combine technical rigor, user-first content, and authority-building. Here's what modern SEO companies prioritize:
            </p>

            <div className="seo-company-grid">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    E-E-A-T &amp; Authority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Google's focus on Experience, Expertise, Authoritativeness, and Trustworthiness means your content must demonstrate real knowledge. This includes author bios, credentials, citations from authoritative sources, and topical authority signals.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Author expertise pages</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Editorial backlinks from trusted sources</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Client testimonials and case studies</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Original research and data</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Core Web Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Page experience is a confirmed ranking factor. Your site must load fast (LCP under 2.5s), be interactive (INP under 200ms), and maintain visual stability (CLS under 0.1). These aren't nice-to-haves—they're SEO requirements.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Image optimization &amp; lazy loading</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Server response time improvements</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Layout stability fixes</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Mobile-first optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    User Intent Matching
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Content must match what searchers actually want. For "SEO company," they want to understand services, pricing, and whether to hire. Poor intent matching means high bounce rates and low rankings regardless of optimization.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Analyze SERP features for a keyword</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Satisfy all question types</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Clear, actionable information</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Strong calls-to-action</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Topical Authority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Rather than creating isolated pages, successful sites build clusters of related content interlinking around core topics. This tells Google you're an authoritative source for that topic area.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Pillar pages covering broad topics</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Cluster content for subtopics</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Strategic internal linking</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Semantic consistency</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Link Quality Over Quantity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Google's systems are sophisticated at identifying artificial link building. Modern SEO focuses on earning editorial links from relevant, authoritative sources. This requires creating link-worthy content and relationship-building.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Editorial link earning</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Digital PR and media relations</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Brand and community signals</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Disavowal of toxic links</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    AI &amp; Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Modern agencies leverage AI for content optimization, keyword research, and predictive analytics—while maintaining human oversight. AI tools enhance efficiency but can't replace strategic thinking.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> AI-assisted content drafting</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Predictive analytics</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Automated technical audits</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> Smart keyword recommendations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="pricing" className="seo-company-section">
            <h2>SEO Pricing Models Explained</h2>
            <p>
              SEO pricing varies widely based on scope, competitiveness, and service model. Understanding different pricing models helps you budget accurately and identify better value.
            </p>

            <Tabs defaultValue="retainer" className="seo-company-tabs">
              <TabsList className="grid w-full grid-cols-3 gap-2">
                <TabsTrigger value="retainer">Retainer</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
              </TabsList>

              <TabsContent value="retainer" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Retainer (Most Common)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>You pay a fixed monthly fee for ongoing optimization work. Most common model for sustained, comprehensive SEO.</p>
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
                      <h4 className="font-semibold mb-3">Typical Pricing by Company Size:</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Freelancers/Solo:</strong> $500–$1,500/month</li>
                        <li><strong>Small Agencies:</strong> $1,500–$3,000/month</li>
                        <li><strong>Mid-Tier Agencies:</strong> $3,000–$7,500/month</li>
                        <li><strong>Enterprise Agencies:</strong> $7,500–$20,000+/month</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What's Typically Included:</h4>
                      <ul className="space-y-1 text-sm list-disc pl-6">
                        <li>Monthly strategy and planning</li>
                        <li>Technical SEO audits and fixes</li>
                        <li>Content creation or optimization</li>
                        <li>Link building outreach</li>
                        <li>Reporting and analysis</li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <strong>Best for:</strong> Businesses committed to long-term SEO growth with steady budgets.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance-Based (Hybrid)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>You pay a base retainer plus bonuses for hitting specific metrics (rankings, traffic, conversions). Some agencies offer purely performance-based pricing (rare and risky).</p>
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
                      <h4 className="font-semibold mb-3">Example Structure:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>Base: $3,000/month</li>
                        <li>Bonus: +$500 per target keyword reaching top 10</li>
                        <li>Bonus: +$2,000 if organic traffic increases 25%+</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pros &amp; Cons:</h4>
                      <p className="text-sm mb-2">✓ Aligns incentives—agency benefits when you benefit</p>
                      <p className="text-sm">✗ Algorithm updates can affect results outside agency control</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <strong>Best for:</strong> Companies with specific, measurable KPIs and tolerance for market volatility.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="project" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project-Based</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Pay a fixed fee for a specific project (e.g., technical audit, content overhaul, site migration). Common for one-off needs rather than ongoing management.</p>
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
                      <h4 className="font-semibold mb-3">Examples of Project Work:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>Technical SEO audit: $2,000–$5,000</li>
                        <li>Content creation (10 pillar pages): $5,000–$15,000</li>
                        <li>Site migration: $3,000–$10,000</li>
                        <li>Backlink strategy and initial outreach: $3,000–$8,000</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pros &amp; Cons:</h4>
                      <p className="text-sm mb-2">✓ Clear scope and budget upfront</p>
                      <p className="text-sm">✗ Without ongoing work, results often plateau</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <strong>Best for:</strong> Specific needs (audits, migrations, one-time optimization).
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-3">Factors Affecting SEO Pricing</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Industry Competitiveness:</strong> Highly competitive industries (finance, legal) cost more.</li>
                <li><strong>Geographic Scope:</strong> National or international SEO costs more than local.</li>
                <li><strong>Site Complexity:</strong> Large ecommerce sites with thousands of pages require more work.</li>
                <li><strong>Current Site Health:</strong> Sites with technical issues or penalties need more remediation.</li>
                <li><strong>Agency Tier:</strong> Top-tier agencies with proven track records charge premium rates.</li>
              </ul>
            </div>
          </section>

          <section id="red-flags" className="seo-company-section">
            <h2>Red Flags: Warning Signs of Mediocre SEO Companies</h2>
            <p>
              Unfortunately, the SEO industry has a lot of low-quality providers. Here are clear warning signs to avoid:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ Guarantee Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>"We guarantee #1 ranking in 30 days" is impossible. No one can guarantee Google rankings. Any company making this claim either doesn't understand SEO or is lying.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ No Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>If an agency won't explain their strategy, refuses access to analytics, or keeps their process secret, that's a bad sign. Good agencies educate clients.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ Private Blog Networks
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>"Exclusive private blog network links" are a violation of Google's guidelines. They're typically low-quality, artificial links that increase penalty risk.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ High-Volume, Low-Quality Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>"Get 1,000 backlinks this month!" is not a strategy—it's spam. Quality always beats quantity in SEO.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ No Case Studies
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>If they won't share any client results or case studies (even with names redacted), they likely don't have good results to show.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ Cold Calling/Email Spam
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>If an "SEO company" emails or calls unsolicited claiming they can rank your site, that's not professional. They're likely spammers themselves.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ No Clear Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>"We'll optimize your site" is too vague. What specifically? What content changes? What technical fixes? Demand clarity.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    ⚠️ Keyword Stuffing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>If their content samples feel unnatural or stuffed with repeated keywords, that's an old, low-quality approach that doesn't work anymore.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="case-studies" className="seo-company-section">
            <h2>Real-World Case Studies: What Success Looks Like</h2>
            <p>
              To illustrate what effective SEO company work produces, here are realistic case study examples (anonymized):
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Case Study #1: SaaS Company, B2B</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">The Situation</h4>
                  <p className="text-sm">A project management SaaS with $2M ARR had virtually no organic traffic. Competitors owned the search results for target keywords.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Strategy</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Technical audit found crawlability issues and missing structured data</li>
                    <li>Built topical authority clusters around "project management," "team collaboration," "workflow automation"</li>
                    <li>Created 25 high-value content pieces over 12 months</li>
                    <li>Implemented strategic internal linking and schema markup</li>
                    <li>Earned 45 editorial backlinks from industry publications via PR</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Results (12 months)</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Organic traffic: 0 to 8,000 monthly visitors</li>
                    <li>Ranking positions: Moved 87 target keywords from rank 50+ to top 3</li>
                    <li>MQLs from organic: 120 qualified leads/month</li>
                    <li>Organic-attributed ARR: +$450K (22.5% revenue growth)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Case Study #2: E-Commerce, High Competition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">The Situation</h4>
                  <p className="text-sm">An online retailer in a highly competitive space (electronics) was losing market share. Competitor content dominated SERPs.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Strategy</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Focus on long-tail, buyer-intent keywords with less competition</li>
                    <li>Created comparison guides, buying guides, and expert reviews</li>
                    <li>Fixed Core Web Vitals (LCP: 4.2s to 1.8s)</li>
                    <li>Built author expertise pages with reviewer credentials</li>
                    <li>Developed link-worthy research and original data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Results (18 months)</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Organic revenue: $1.2M to $3.8M (+216%)</li>
                    <li>Organic transactions: 450 to 2,100/month</li>
                    <li>Average order value increased 8% (better content qualification)</li>
                    <li>Customer acquisition cost: $85 to $42 (50% reduction)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Study #3: Local Service Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">The Situation</h4>
                  <p className="text-sm">A plumbing service in a mid-sized city had some website traffic but wasn't capturing local search opportunities.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Strategy</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Optimized Google My Business profile and gathered 50+ local reviews</li>
                    <li>Created location-specific service pages (30+ neighborhoods)</li>
                    <li>Built local citations across directories (Yelp, HomeAdvisor, etc.)</li>
                    <li>Earned local press coverage and community partnership links</li>
                    <li>Implemented local schema markup</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">The Results (9 months)</h4>
                  <ul className="text-sm space-y-1 list-disc pl-6">
                    <li>Local search impressions: 500 to 12,000/month</li>
                    <li>Google My Business clicks: 45 to 320/month</li>
                    <li>Website calls/inquiries: 12 to 85/month</li>
                    <li>Revenue increase: +$180K annually</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="roi" className="seo-company-section">
            <h2>Measuring SEO ROI: What Metrics Matter</h2>
            <p>
              SEO is often criticized as being hard to measure. That's not true—you just need to focus on the right metrics. Here's how to quantify return on investment:
            </p>

            <div className="seo-company-metrics">
              <Tabs defaultValue="business" className="seo-company-tabs">
                <TabsList className="grid w-full grid-cols-3 gap-2">
                  <TabsTrigger value="business">Business Metrics</TabsTrigger>
                  <TabsTrigger value="ranking">Ranking Metrics</TabsTrigger>
                  <TabsTrigger value="content">Content Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue &amp; Conversion Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-semibold text-sm mb-1">Organic Revenue Attribution</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track which transactions came from organic search using GA4. This is your ultimate ROI metric.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Cost Per Acquisition (CPA)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Divide total SEO spend by conversions: SEO typically delivers CPA 50-70% lower than paid search.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Customer Lifetime Value (CLV)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Organic customers often have 2-3x higher LTV than paid customers because they self-qualify through search.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Lead Generation &amp; MQLs</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">For B2B, track marketing-qualified leads from organic channels. Attribution through CRM systems.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ranking" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ranking &amp; Visibility Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-semibold text-sm mb-1">Target Keyword Rankings</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track positions for 20-50 target keywords monthly. Success: moving from position 50+ to top 10-20.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Search Impression Share</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">GSC data showing what % of searches for your keywords you appear in. Improvement = visibility growth.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Organic Click-Through Rate (CTR)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">GSC shows average CTR. Better titles, descriptions, and rankings increase CTR (target: 3-5% for competitive terms).</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Keyword Growth</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track total keywords ranking in top 100, top 50, top 10. This grows as SEO progresses.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement &amp; Content Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-semibold text-sm mb-1">Organic Traffic</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total sessions from organic search monthly. Track growth rate and compare to competitors.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Pages per Session &amp; Session Duration</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Higher engagement indicates better content quality and relevance to searcher intent.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Bounce Rate</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Percentage of visits where user left without further action. Goal: below 50% for good content.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">Backlink Profile</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track new referring domains, quality of backlinks, and domain authority growth over time.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3">Calculating Your SEO ROI</h4>
              <div className="bg-white dark:bg-slate-900 p-4 rounded font-mono text-sm space-y-2 mb-4">
                <p>Monthly SEO Investment: $3,000</p>
                <p>Organic Revenue This Month: $12,000</p>
                <p>Organic Revenue Last Month: $8,000</p>
                <p>Attributable Growth: $4,000</p>
                <p className="border-t border-gray-300 dark:border-gray-700 pt-2 font-bold">ROI: ($4,000 / $3,000) × 100 = <span className="text-green-600">133% monthly</span></p>
              </div>
              <p className="text-sm">
                <strong>Note:</strong> Compounding effect means ROI improves over time as organic traffic grows—you'll eventually pay $3K/month but generate $30K-$50K+ in revenue.
              </p>
            </div>
          </section>

          <section id="vs-inhouse" className="seo-company-section">
            <h2>SEO Agency vs. In-House Team: Which Is Right?</h2>
            <p>
              Some businesses hire external agencies, others build internal teams. Here's how they compare:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                    <th className="text-left p-3 font-semibold">Factor</th>
                    <th className="text-left p-3 font-semibold">SEO Agency</th>
                    <th className="text-left p-3 font-semibold">In-House Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="p-3 font-semibold">Cost</td>
                    <td className="p-3">$1,500–$20,000/month retainer</td>
                    <td className="p-3">$60K–$150K+ annually per FTE</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Expertise Breadth</td>
                    <td className="p-3">✓ Multiple specialists available</td>
                    <td className="p-3">Limited by individual skill sets</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Industry Knowledge</td>
                    <td className="p-3">Often works across multiple industries</td>
                    <td className="p-3">✓ Deep domain knowledge over time</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Accountability</td>
                    <td className="p-3">✓ Contractual SLAs and reporting</td>
                    <td className="p-3">Internal metrics, harder to measure</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Speed to Results</td>
                    <td className="p-3">✓ Faster (experienced systems)</td>
                    <td className="p-3">Slower (ramp-up time, learning curve)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tools &amp; Technology</td>
                    <td className="p-3">✓ Access to premium tools included</td>
                    <td className="p-3">Must budget for expensive tools separately</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Conflict of Interest</td>
                    <td className="p-3">May oversell services to increase revenue</td>
                    <td className="p-3">✓ Aligned with business goals</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Best For</td>
                    <td className="p-3">Companies under $50M revenue or limited budget</td>
                    <td className="p-3">✓ Large companies with ongoing high-volume needs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-3">Hybrid Approach (Recommended)</h4>
              <p className="text-sm mb-3">
                Many companies use a hybrid model: hire 1-2 internal SEO professionals to manage strategy and execution, while outsourcing specialized work (link building, content production, technical audits) to agencies. This combines cost-efficiency with expertise.
              </p>
              <p className="text-sm">
                <strong>Example:</strong> $80K in-house SEO manager + $2K/month agency for link building and technical work = better results than either approach alone.
              </p>
            </div>
          </section>

          <section id="challenges" className="seo-company-section">
            <h2>Common SEO Challenges &amp; How to Address Them</h2>
            <p>
              Even with a quality SEO company, you'll encounter challenges. Understanding them helps set realistic expectations:
            </p>

            <Accordion type="single" collapsible className="seo-company-accordion">
              <AccordionItem value="plateau">
                <AccordionTrigger>Ranking Plateau (No Further Growth)</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    You gain rankings for months, then progress stalls. This is normal and expected—early wins target easier keywords. Breaking through requires:
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-2">
                    <li>Bigger content initiatives (pillar pages, research)</li>
                    <li>Earning high-quality backlinks (requires more outreach)</li>
                    <li>Expanding to brand queries and navigational improvements</li>
                    <li>Patience—very competitive keywords take 12-24 months</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="algorithm">
                <AccordionTrigger>Algorithm Updates &amp; Ranking Volatility</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Google makes algorithm updates quarterly (or more). Some improvements stick, others are temporary. Volatility is part of SEO. How to respond:
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-2">
                    <li>Don't panic over short-term fluctuations</li>
                    <li>Focus on core E-A-T and user-first content</li>
                    <li>Ensure technical excellence and Core Web Vitals</li>
                    <li>Continue building authority through links and signals</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="competitor">
                <AccordionTrigger>Aggressive Competition</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    In highly competitive spaces (finance, legal, e-commerce), competitors have resources and established authority. Solutions:
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-2">
                    <li>Target long-tail keywords with lower competition</li>
                    <li>Focus on underserved audience segments</li>
                    <li>Build unique, original content competitors can't replicate</li>
                    <li>Invest in brand building alongside SEO</li>
                    <li>Consider paid channels to supplement organic</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="budget">
                <AccordionTrigger>Budget Constraints</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Limited budgets require prioritization. Ask your SEO company to:
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-2">
                    <li>Identify "quick wins" with highest ROI potential</li>
                    <li>Prioritize high-intent keywords for conversion</li>
                    <li>DIY certain tasks (small content, data organization)</li>
                    <li>Scale strategically—start small, reinvest wins</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="internal">
                <AccordionTrigger>Internal Alignment &amp; Silos</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p>
                    Marketing, product, and development teams may not prioritize SEO. This slows progress. Solutions:
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-2">
                    <li>Get executive buy-in by showing ROI data</li>
                    <li>Integrate SEO into product roadmaps</li>
                    <li>Create cross-functional SEO working groups</li>
                    <li>Share organic revenue wins broadly (celebrate success)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="emerging" className="seo-company-section">
            <h2>Emerging SEO Trends in 2025+</h2>
            <p>
              The SEO landscape continues evolving. Here's what forward-thinking companies and agencies are focusing on:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI-Generated Content &amp; Detection</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Google's helpful content update targets unhelpful AI content. High-quality AI-assisted content (with human oversight) works fine, but low-effort bulk generation doesn't. Focus on human insight and original value.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Entity-First SEO</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Google increasingly uses entity relationships (Schema.org, Knowledge Graph) to understand content. SEO companies are mapping entities, building entity authority, and using semantic markup strategically.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Content Hubs &amp; Topical Authority</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Moving beyond siloed pages to building interconnected content hubs that demonstrate deep expertise on topics. This becomes increasingly important for competitive keywords.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Experience &amp; Engagement Signals</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Click-through rate, scroll depth, and time on page matter more than ever. Agencies are optimizing for engagement metrics that indicate content quality.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Zero-Click Optimization</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Many searches now result in direct answers (featured snippets, People Also Ask, etc.) with no click to your site. SEO needs to optimize for visibility in these SERP features.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Search Generative Experience (SGE)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Google's AI-powered search results are evolving. SEO strategies are adapting to ensure visibility even when users get AI-generated answers alongside traditional results.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="faq" className="seo-company-section">
            <h2>Frequently Asked Questions About SEO Companies</h2>

            <Accordion type="single" collapsible className="seo-company-accordion">
              <AccordionItem value="q1">
                <AccordionTrigger>How long before we see results?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Most SEO companies begin with technical fixes and quick wins visible in 1-3 months. Significant traffic improvements typically appear after 6 months of consistent work. Very competitive niches may take 12-18 months for top rankings. Realistic timelines are a sign of a good agency.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>What if we have a Google penalty?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Your SEO company should conduct a link audit, identify problematic links, file a disavowal with Google, and improve your site's quality signals. Recovery takes 3-6 months typically. Choose a company experienced in penalty recovery—this is complex work.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>Can we do SEO in-house with free tools?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Yes, to an extent. Google Search Console, Google Analytics 4, and free versions of Ubersuggest or Semrush provide basic data. However, for competitive analysis, rank tracking, and backlink research, paid tools are nearly essential. Most agencies include tool costs in their retainers.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>Should we buy backlinks?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    It depends. Buying links from low-quality sites or private blog networks violates Google's guidelines and risks penalties. However, investing in premium backlink networks (like <a href="/seocompany" className="text-blue-600 hover:underline">Backlink ∞</a>) that offer curated, high-quality placements from real, authoritative publishers can accelerate results safely when combined with earned links.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>What about international SEO or multiple languages?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    International SEO requires expertise in hreflang tags, geo-targeting, local keyword research for each market, and often cultural considerations for content. This is a specialized area—ensure your agency has proven international experience.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>How do we know if the agency is actually working?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Request transparent reporting showing: keyword rankings, organic traffic, backlink growth, and business impact (leads, revenue). Monthly reports should show week-to-week and month-to-month comparisons. Red flag: vague reports that don't show concrete metrics.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q7">
                <AccordionTrigger>How should we handle content changes or site redesigns?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Inform your SEO company immediately. Major changes (redesigns, URL migrations, content restructuring) require planning to preserve rankings. Poor execution can cause significant traffic loss. A good agency will manage these carefully with redirects, canonicals, and monitoring.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q8">
                <AccordionTrigger>What's the difference between "white-hat" and "black-hat" SEO?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    White-hat follows Google's guidelines: quality content, legitimate links, technical excellence. Black-hat uses deceptive tactics: link schemes, cloaking, keyword stuffing, buying links from spam sites. Black-hat may produce short-term results but risks severe penalties. Always choose white-hat providers.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="conclusion" className="seo-company-section py-12 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-2xl">
              <h2>Final Thoughts: Why SEO Companies Matter</h2>
              <p>
                Organic search remains the highest-ROI marketing channel for most businesses. An effective SEO company doesn't just improve rankings—it builds sustainable growth that compounds over time. A $3,000/month investment in quality SEO can generate $50K-$200K+ in additional annual revenue.
              </p>
              <p>
                The key is choosing the right partner: one with proven results, transparent practices, ethical methods, and alignment with your long-term goals. Ask the right questions, demand accountability, and give SEO the 6-12 month runway it needs to work.
              </p>
              <p>
                If you're ready to invest in organic growth, look for a company that educates you, explains its strategy clearly, and ties results to your business goals. The best SEO partnerships feel collaborative, not transactional.
              </p>
            </div>
          </section>

          <section id="cta" className="seo-company-section mt-12">
            <BacklinkInfinityCTA 
              title="Ready to Accelerate Your SEO Results?"
              description="At Backlink ∞, we provide quality backlink placements from real, authoritative publishers to amplify your SEO efforts. Combined with content and technical optimization, premium links accelerate your path to #1 rankings."
              primaryButtonText="Get Started with Backlink ∞"
              secondaryButtonText="View Our Link Network"
            />
          </section>
        </article>
      </div>
      <Footer />
    </>
  );
}
