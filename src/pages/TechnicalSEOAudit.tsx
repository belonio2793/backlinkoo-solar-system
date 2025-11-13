import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Zap, Settings, Layers, TrendingUp, Shield, Search, Code, Database, ArrowLeft, ArrowRight } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/senuke.css';

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
      const bar = document.querySelector('.scrape-progress__bar') as HTMLDivElement | null;
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

function AuditChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const metaTitle = 'Technical SEO Audit 2025: Complete Guide to Site Health & Rankings';
const metaDescription = 'Comprehensive technical SEO audit guide covering crawlability, indexation, site speed, structured data, mobile optimization, and Core Web Vitals. Learn how to audit and fix critical technical issues.';

export default function TechnicalSEOAudit() {
  useProgress('#audit-content');

  const canonical = React.useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/technical-seo-audit`;
    } catch {
      return '/technical-seo-audit';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'technical SEO audit, crawlability, indexation, site speed, Core Web Vitals, structured data, mobile optimization, SEO health check, technical SEO guide');
    upsertCanonical(canonical);

    injectJSONLD('audit-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('audit-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Technical SEO Audit Guide', item: '/technical-seo-audit' },
      ],
    });

    injectJSONLD('audit-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is a technical SEO audit?', acceptedAnswer: { '@type': 'Answer', text: 'A technical SEO audit is a comprehensive analysis of your website\'s technical foundation to ensure it\'s optimized for search engine crawling, indexation, and ranking.' } },
        { '@type': 'Question', name: 'How often should I perform a technical SEO audit?', acceptedAnswer: { '@type': 'Answer', text: 'It\'s recommended to perform a technical SEO audit at least quarterly, or whenever you make significant website changes.' } },
        { '@type': 'Question', name: 'What are the most critical technical SEO issues?', acceptedAnswer: { '@type': 'Answer', text: 'The most critical issues include crawl errors, indexation problems, poor Core Web Vitals, mobile usability issues, and missing structured data.' } },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'intro', label: 'Overview' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'crawlability', label: 'Crawlability' },
    { id: 'indexation', label: 'Indexation' },
    { id: 'site-speed', label: 'Site Speed' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'https-security', label: 'HTTPS & Security' },
    { id: 'structured-data', label: 'Structured Data' },
    { id: 'architecture', label: 'Site Architecture' },
    { id: 'tools', label: 'Audit Tools' },
    { id: 'checklist', label: 'Audit Checklist' },
    { id: 'prioritization', label: 'Prioritization' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Get Help' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <div className="scrape-progress" aria-hidden="true"><div className="scrape-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="scrape-hero" aria-labelledby="page-title">
          <p className="scrape-kicker">SEO Mastery</p>
          <h1 id="page-title" className="scrape-title">Technical SEO Audit</h1>
          <p className="scrape-subtitle">The complete, authoritative guide to auditing your website's technical SEO foundation. Learn how to identify, prioritize, and fix critical issues that impact rankings and user experience.</p>
          <div className="scrape-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: SEO Technical Team</span>
            <span>Read time: 50+ minutes</span>
          </div>
          <div className="scrape-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full">
              <a href="#checklist">View Checklist</a>
            </Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full">
              <a href="#faq">Read FAQs</a>
            </Button>
            <Badge className="ml-3" variant="secondary">2025 Edition</Badge>
          </div>
        </header>

        <div className="scrape-layout">
          <nav className="scrape-toc" aria-label="On this page">
            <div className="scrape-toc__title">On this page</div>
            <ul>
              {nav.map((n) => (<li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>))}
            </ul>
          </nav>

          <article id="audit-content" className="scrape-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="scrape-section">
              <h2>What Is a Technical SEO Audit?</h2>
              <p>A technical SEO audit is a systematic evaluation of your website's technical foundation to ensure it is optimized for search engine crawling, indexation, and user experience. Unlike content SEO or link building, technical SEO focuses on the infrastructure, configuration, and backend elements that directly impact how Google and other search engines discover, understand, and rank your pages.</p>
              <p>A thorough technical SEO audit examines over 100+ different factors across multiple categories: server configuration, site architecture, page speed, mobile responsiveness, structured data implementation, security protocols, and crawl efficiency. The goal is to identify and eliminate barriers that prevent search engines from effectively crawling and indexing your content, while simultaneously improving user experience metrics that Google now uses as ranking factors.</p>
              <p>For businesses competing on high-value keywords like "technical SEO audit," "SEO services," or "backlink building," a comprehensive technical foundation is non-negotiable. Technical issues can result in lost rankings, reduced visibility, and missed opportunities to capture qualified search traffic.</p>
            </section>

            <section id="foundations" className="scrape-section">
              <h2>Technical SEO Foundations</h2>
              <p>Before diving into audit specifics, understand the three pillars of technical SEO:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-indigo-600" />
                      Crawlability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Ensures search engine bots can discover and access all important pages on your site without obstacles, redirects, or blocks.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-violet-600" />
                      Indexation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Confirms that crawled pages are added to Google's index and eligible to appear in search results without duplicate or canonical issues.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      User Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Evaluates Core Web Vitals, mobile usability, and page speed to ensure users have a fast, accessible, frustration-free experience.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="crawlability" className="scrape-section">
              <h2>Crawlability: How Search Engines Discover Your Content</h2>
              <p>Crawlability is the foundation of everything. If Google's crawlers can't reach your pages, they can't index or rank them, no matter how brilliant your content is. Poor crawlability manifests as crawl errors, blocked resources, and inefficient crawl budgets.</p>

              <h3 className="mt-6 font-semibold">Critical Crawlability Issues</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-sm mb-2">Crawl Errors</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> 4xx and 5xx server errors prevent indexation</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Blocked resources (CSS, JS) prevent rendering</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Redirect chains waste crawl budget</li>
                  </ul>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-sm mb-2">Crawl Budget Waste</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" /> Crawling duplicate or parameter pages</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" /> Infinite crawl traps in pagination</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" /> Crawling auto-generated or thin content</li>
                  </ul>
                </div>
              </div>

              <h3 className="mt-6 font-semibold">Robots.txt and Sitemap Configuration</h3>
              <p className="mt-2 text-sm">Your robots.txt file tells crawlers which pages to crawl and which to skip. Misconfiguration can accidentally block important pages or waste crawl budget on unimportant ones. A proper robots.txt should:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Allow crawling of all important pages and resources (CSS, JavaScript, images)</li>
                <li>Block low-value pages: admin areas, login pages, filter/sort parameters, duplicate content</li>
                <li>Reference a well-structured XML sitemap with all indexable URLs</li>
                <li>Have a reasonable crawl delay if your server is resource-constrained</li>
              </ul>

              <h3 className="mt-6 font-semibold">XML Sitemap Best Practices</h3>
              <p className="mt-2 text-sm">A well-maintained XML sitemap accelerates crawl discovery and signals priority. Best practices include:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Include only indexable URLs (no duplicates, canonicals, or noindex pages)</li>
                <li>Update sitemap when content changes (ideally within 24 hours)</li>
                <li>Limit each sitemap to 50,000 URLs; use sitemap indexes for larger sites</li>
                <li>Include lastmod and changefreq hints (though Google doesn't guarantee using them)</li>
                <li>Submit sitemap via Google Search Console and Bing Webmaster Tools</li>
              </ul>
            </section>

            <section id="indexation" className="scrape-section">
              <h2>Indexation: Ensuring Your Pages Are in Google's Index</h2>
              <p>Even if crawlers successfully visit your pages, they may not be indexed. Indexation issues are often silent—you may not realize pages are blocked until you check Search Console. Common indexation barriers include:</p>

              <h3 className="mt-6 font-semibold">Noindex Tags and Meta Robots</h3>
              <p className="mt-2 text-sm">The <code className="bg-slate-100 px-1 rounded">X-Robots-Tag: noindex</code> HTTP header or <code className="bg-slate-100 px-1 rounded">&lt;meta name="robots" content="noindex"&gt;</code> prevents pages from being indexed. This is intentional for private pages, but accidental noindex directives block content you want to rank:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Staging or test sites accidentally inheriting noindex from production</li>
                <li>Pagination or filter pages marked noindex to prevent duplication (bad practice)</li>
                <li>HTTP responses with incorrect noindex headers</li>
              </ul>

              <h3 className="mt-6 font-semibold">Duplicate Content and Canonical Tags</h3>
              <p className="mt-2 text-sm">When multiple URLs contain identical or near-identical content, Google must decide which to index. A missing or incorrect canonical tag can result in the wrong version being indexed, split authority between duplicates, or both versions being deindexed.</p>
              <p className="mt-2 text-sm font-semibold">Canonical implementation rules:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Use <code className="bg-slate-100 px-1 rounded">&lt;link rel="canonical" href="..."&gt;</code> in the <code className="bg-slate-100 px-1 rounded">&lt;head&gt;</code> of each page</li>
                <li>Point to the preferred version (usually the longest, most authoritative URL)</li>
                <li>Use absolute URLs, not relative paths</li>
                <li>Canonicalize to self on the preferred page</li>
                <li>For multi-region content, use <code className="bg-slate-100 px-1 rounded">rel="alternate" hreflang</code> instead</li>
              </ul>

              <h3 className="mt-6 font-semibold">Search Console Coverage Report</h3>
              <p className="mt-2 text-sm">Google Search Console's Coverage report reveals indexation status across your entire site:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong>Indexed:</strong> Pages successfully in Google's index</li>
                <li><strong>Crawled (not indexed):</strong> Google saw the page but chose not to index (usually due to thin content, noindex, or duplicate detection)</li>
                <li><strong>Errors:</strong> 4xx/5xx responses preventing indexation</li>
                <li><strong>Valid with warnings:</strong> Pages indexed but with issues like mobile usability problems</li>
                <li><strong>Excluded:</strong> Pages blocked by robots.txt, marked noindex, or excluded via settings</li>
              </ul>
            </section>

            <section id="site-speed" className="scrape-section">
              <h2>Site Speed and Core Web Vitals</h2>
              <p>Google has confirmed that page speed is a ranking factor. Since 2021, Core Web Vitals—a set of three metrics measuring user experience—have become an official ranking signal. Sites with poor Core Web Vitals experience lower rankings and higher bounce rates.</p>

              <h3 className="mt-6 font-semibold">The Three Core Web Vitals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-600" />
                      LCP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Largest Contentful Paint</strong></p>
                    <p>Time until the largest visible element (image, video, text block) is rendered.</p>
                    <p className="text-xs text-emerald-600">Good: &lt; 2.5s | Poor: &gt; 4s</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-violet-600" />
                      FID
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>First Input Delay</strong> (replaced by INP)</p>
                    <p>Time from user interaction to browser response. Being phased out in favor of Interaction to Next Paint (INP).</p>
                    <p className="text-xs text-emerald-600">Good: &lt; 100ms | Poor: &gt; 300ms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4 text-emerald-600" />
                      CLS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Cumulative Layout Shift</strong></p>
                    <p>Measure of unexpected layout shifts (ads, modals, images loading) during page load.</p>
                    <p className="text-xs text-emerald-600">Good: &lt; 0.1 | Poor: &gt; 0.25</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Optimizing for Core Web Vitals</h3>
              <Tabs defaultValue="lcp" className="mt-4">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="lcp">LCP Optimization</TabsTrigger>
                  <TabsTrigger value="inp">INP Optimization</TabsTrigger>
                  <TabsTrigger value="cls">CLS Optimization</TabsTrigger>
                </TabsList>
                <TabsContent value="lcp" className="mt-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Minimize server response time (improve backend performance)</li>
                    <li>Enable compression and minimize CSS/JavaScript</li>
                    <li>Preload critical images and resources</li>
                    <li>Use a Content Delivery Network (CDN) to serve assets from locations near users</li>
                    <li>Optimize images: use modern formats (WebP), lazy load below-the-fold images</li>
                    <li>Remove render-blocking scripts and stylesheets</li>
                  </ul>
                </TabsContent>
                <TabsContent value="inp" className="mt-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Break up long JavaScript tasks (use requestIdleCallback or defer heavy processing)</li>
                    <li>Minimize main thread work (avoid blocking JavaScript)</li>
                    <li>Defer non-critical JavaScript execution</li>
                    <li>Use event delegation to reduce listeners</li>
                    <li>Profile with Chrome DevTools and address JavaScript bottlenecks</li>
                  </ul>
                </TabsContent>
                <TabsContent value="cls" className="mt-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Reserve space for images, videos, and ads with explicit width/height attributes</li>
                    <li>Avoid inserting content above existing content (especially ads, pop-ups, notifications)</li>
                    <li>Use font-display: swap or font-display: optional to prevent FOUT/FOIT</li>
                    <li>Load third-party scripts (analytics, ads) asynchronously or defer</li>
                    <li>Animate layout shifts using transform property instead of changing width/margin</li>
                  </ul>
                </TabsContent>
              </Tabs>

              <h3 className="mt-6 font-semibold">Measuring Performance</h3>
              <p className="mt-2 text-sm">Use these tools to measure site speed and Core Web Vitals:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong><a href="https://pagespeedinsights.web.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google PageSpeed Insights</a></strong> – Free tool using real-world CrUX data</li>
                <li><strong><a href="https://web.dev/measure" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">web.dev</a></strong> – Comprehensive site audits and optimization guides</li>
                <li><strong>Chrome DevTools (Lighthouse)</strong> – Built-in auditing with detailed recommendations</li>
                <li><strong><a href="https://www.gtmetrix.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GTmetrix</a></strong> – Waterfall analysis and specific optimization recommendations</li>
                <li><strong>WebPageTest</strong> – Advanced testing with custom locations and throttling profiles</li>
              </ul>
            </section>

            <section id="mobile" className="scrape-section">
              <h2>Mobile Optimization and Usability</h2>
              <p>Mobile-first indexing means Google primarily crawls and indexes the mobile version of your site. If your mobile experience lags, your entire SEO suffers. Mobile optimization covers responsiveness, usability, and performance specific to smaller screens and potentially slower networks.</p>

              <h3 className="mt-6 font-semibold">Mobile Usability Checklist</h3>
              <AuditChecklistCard
                title="Essential Mobile Requirements"
                items={[
                  'Responsive design (no separate mobile site; single fluid design)',
                  'Viewport meta tag correctly set: <meta name="viewport" content="width=device-width, initial-scale=1">',
                  'Touch-friendly buttons and links (minimum 48x48px with adequate spacing)',
                  'No intrusive interstitials (pop-ups must close easily without obscuring content)',
                  'Readable text without zooming (font size 12px or larger)',
                  'Images and media properly scaled for mobile screens',
                  'Horizontal scroll avoided (content fits within viewport width)',
                  'Avoid plugins like Flash that don\'t work on mobile',
                ]}
              />

              <h3 className="mt-6 font-semibold">Accelerated Mobile Pages (AMP)</h3>
              <p className="mt-2 text-sm">AMP is a framework that creates extremely fast mobile pages, but it's becoming less important as Core Web Vitals matter more. Unless you're in news/publishing, AMP is optional. Focus instead on making your standard mobile pages fast using the Core Web Vitals optimizations outlined above.</p>
            </section>

            <section id="https-security" className="scrape-section">
              <h2>HTTPS and Site Security</h2>
              <p>HTTPS encryption is both a security requirement and a ranking factor. Google confirmed in 2014 that HTTPS is a ranking signal. Additionally, modern browsers mark non-HTTPS sites as "Not Secure," damaging trust and increasing bounce rates.</p>

              <h3 className="mt-6 font-semibold">HTTPS Implementation Checklist</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li><strong>Obtain an SSL/TLS certificate</strong> from a trusted Certificate Authority (free options: Let's Encrypt, via hosting provider)</li>
                <li><strong>Install certificate</strong> on all servers; use wildcard certificates for subdomains if needed</li>
                <li><strong>Redirect all HTTP traffic to HTTPS</strong> using 301 redirects (permanent redirects preserve SEO authority)</li>
                <li><strong>Update internal links</strong> to use HTTPS URLs</li>
                <li><strong>Update external references</strong> (sitemaps, robots.txt, meta tags, canonical links) to HTTPS</li>
                <li><strong>Implement HSTS (HTTP Strict Transport Security)</strong> header to force HTTPS in future requests</li>
                <li><strong>Update Search Console</strong> to add HTTPS property and update settings to prefer HTTPS</li>
                <li><strong>Test for mixed content</strong> (HTTPS pages loading HTTP resources) which browsers block</li>
              </ul>

              <h3 className="mt-6 font-semibold">Security Best Practices Beyond HTTPS</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li>Use strong passwords and implement multi-factor authentication (MFA) for admin accounts</li>
                <li>Keep all software (CMS, plugins, libraries, server OS) updated to patch vulnerabilities</li>
                <li>Implement Web Application Firewall (WAF) to block malicious traffic</li>
                <li>Monitor for malware and hacking using Google Search Console's Security Issues report</li>
                <li>Use robots.txt and noindex to prevent sensitive information from being indexed</li>
                <li>Implement Content Security Policy (CSP) headers to mitigate injection attacks</li>
              </ul>
            </section>

            <section id="structured-data" className="scrape-section">
              <h2>Structured Data and Schema Markup</h2>
              <p>Structured data uses standardized formats (JSON-LD, Microdata, RDFa) to provide explicit meaning to page content. Search engines use structured data to better understand content, power rich results, and improve rankings for featured snippets, knowledge panels, and other SERP features.</p>

              <h3 className="mt-6 font-semibold">Critical Schema Types for SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Organization & Article</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Organization Schema:</strong> Define your company name, logo, contact info, social profiles. Improves knowledge panel visibility.</p>
                    <p><strong>Article Schema:</strong> Mark publication date, author, headline. Enables rich snippets in search results.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">FAQ & HowTo</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>FAQ Schema:</strong> Structure Q&A content for rich snippets showing questions in search results.</p>
                    <p><strong>HowTo Schema:</strong> Provide step-by-step instructions with images. Eligible for rich snippets.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Review & Rating</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Review Schema:</strong> Markup product/service reviews with ratings. Shows star ratings in search results.</p>
                    <p><strong>AggregateRating:</strong> Display average rating across multiple reviews.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Product & Offer</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Product Schema:</strong> Mark product name, image, description, price, availability.</p>
                    <p><strong>Offer Schema:</strong> Specify pricing, currency, availability for e-commerce.</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Implementing Structured Data</h3>
              <p className="mt-2 text-sm">Best practice: use JSON-LD format within <code className="bg-slate-100 px-1 rounded">&lt;script type="application/ld+json"&gt;</code> tags in the page <code className="bg-slate-100 px-1 rounded">&lt;head&gt;</code> or <code className="bg-slate-100 px-1 rounded">&lt;body&gt;</code>. JSON-LD is:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Easiest to implement (no HTML attribute changes)</li>
                <li>Supported by all major search engines</li>
                <li>Not affected by DOM parsing order</li>
                <li>Can be added dynamically via JavaScript (though static is preferred)</li>
              </ul>

              <h3 className="mt-6 font-semibold">Testing and Validation</h3>
              <p className="mt-2 text-sm">Always test structured data using:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong><a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Rich Results Test</a></strong> – Official tool to validate markup and preview rich results</li>
                <li><strong><a href="https://validator.schema.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schema.org Validator</a></strong> – Validates JSON-LD and other structured data formats</li>
                <li>Schema.org documentation for complete list of properties and requirements</li>
              </ul>
            </section>

            <section id="architecture" className="scrape-section">
              <h2>Site Architecture and Internal Linking</h2>
              <p>Site architecture is the blueprint of how content is organized and connected. A well-structured site with effective internal linking helps search engines understand content hierarchy, distributes crawl budget efficiently, and improves user navigation.</p>

              <h3 className="mt-6 font-semibold">Information Architecture Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Logical hierarchy:</strong> Organize content into clear categories and subcategories (ideally 3-4 levels deep)</li>
                <li><strong>Hub-and-spoke model:</strong> Create pillar pages for major topics with internal links to supporting cluster content</li>
                <li><strong>Flat crawlability:</strong> Ensure every important page is reachable within 2-3 clicks from the home page</li>
                <li><strong>Clear URLs:</strong> Use semantic URLs (e.g., /seo/technical-seo-audit) that reflect content hierarchy</li>
                <li><strong>Breadcrumb navigation:</strong> Implement breadcrumb markup (and visually) to show page structure and aid user navigation</li>
                <li><strong>Clear navigation menus:</strong> Primary navigation should reflect top-level categories and be consistent across all pages</li>
              </ul>

              <h3 className="mt-6 font-semibold">Internal Linking Strategy</h3>
              <p className="mt-2 text-sm">Internal links serve dual purposes: they help search engines crawl and understand content hierarchy, and they distribute ranking power (PageRank) across pages. Strategic internal linking can significantly impact rankings.</p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Link to important pages multiple times:</strong> Hub pages should receive internal links from multiple sources</li>
                <li><strong>Use descriptive anchor text:</strong> Anchor text should clearly describe the linked page's content, not just "click here"</li>
                <li><strong>Link from high-authority pages:</strong> Links from established pages (home, popular content) carry more weight</li>
                <li><strong>Maintain logical flow:</strong> Link contextually when it makes sense for user experience, not artificially</li>
                <li><strong>Avoid orphan pages:</strong> Every important page should be reachable via at least one internal link</li>
                <li><strong>Use keyword-rich anchor text moderately:</strong> Avoid over-optimization with exact-match keywords (looks spammy to Google)</li>
              </ul>
            </section>

            <section id="tools" className="scrape-section">
              <h2>Essential Technical SEO Audit Tools</h2>
              <p>A comprehensive audit requires multiple tools to identify different categories of issues. Below are essential tools for different audit dimensions:</p>

              <h3 className="mt-6 font-semibold">Search Console & Webmaster Tools</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Search Console</a></strong> – Essential; shows indexation status, crawl errors, Core Web Vitals, security issues, and mobile usability problems</li>
                <li><strong><a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bing Webmaster Tools</a></strong> – Alternative data; useful for checking Bing-specific issues</li>
              </ul>

              <h3 className="mt-6 font-semibold">Full-Site Crawlers</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.screamingfrog.co.uk/seo-spider/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Screaming Frog SEO Spider</a></strong> – Desktop crawler; identifies crawl errors, duplicate content, broken links, missing meta tags, redirect chains, and more</li>
                <li><strong><a href="https://moz.com/products/pro/features/crawl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moz Site Crawl</a></strong> – Cloud-based crawling as part of Moz Pro subscription</li>
                <li><strong><a href="https://www.semrush.com/features/site-audit/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush Site Audit</a></strong> – Comprehensive audits tracking issues over time</li>
              </ul>

              <h3 className="mt-6 font-semibold">Performance Analysis</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://pagespeedinsights.web.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google PageSpeed Insights</a></strong> – Free Core Web Vitals and performance analysis</li>
                <li><strong><a href="https://www.gtmetrix.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GTmetrix</a></strong> – Waterfall charts and advanced performance debugging</li>
                <li><strong>Chrome DevTools Lighthouse</strong> – Built into Chrome; provides detailed audits and recommendations</li>
              </ul>

              <h3 className="mt-6 font-semibold">Structured Data Validation</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Rich Results Test</a></strong> – Tests JSON-LD and validates rich result eligibility</li>
                <li><strong><a href="https://validator.schema.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schema.org Validator</a></strong> – Validates structured data formats</li>
              </ul>

              <h3 className="mt-6 font-semibold">Link Analysis and Backlink Profiles</h3>
              <p className="mt-2 text-sm">While not strictly technical SEO, link profile analysis is crucial for understanding domain authority and identifying toxic links:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs</a></strong> – Comprehensive backlink analysis and competitor research. Learn about <a href="/senuke" className="text-blue-600 hover:underline">historical automation tools</a> and their link profiles</li>
                <li><strong><a href="https://moz.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moz Pro</a></strong> – Domain authority metrics and link data</li>
                <li><strong><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush</a></strong> – Link analysis and toxic link detection</li>
              </ul>
            </section>

            <section id="checklist" className="scrape-section">
              <h2>Complete Technical SEO Audit Checklist</h2>
              <p>Use this comprehensive checklist to evaluate your site's technical SEO foundation. Score each item as Pass/Fail/Needs Work, then prioritize fixes based on impact and effort.</p>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Crawlability & Indexation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuditChecklistCard
                      title="Crawlability"
                      items={[
                        'No 4xx/5xx errors on important pages',
                        'Robots.txt properly allows crawling of important pages',
                        'CSS, JavaScript, and image resources are not blocked by robots.txt',
                        'No excessive redirect chains (max 3 hops)',
                        'Internal links use standard HTML anchors',
                        'No crawl traps or infinite loops',
                        'Crawl budget not wasted on duplicate or low-value content',
                      ]}
                    />
                    <AuditChecklistCard
                      title="Indexation"
                      items={[
                        'All important pages are indexed (check Google Search Console)',
                        'No accidental noindex tags on pages you want ranked',
                        'Duplicate content has proper canonical tags',
                        'XML sitemap present and submitted to Google',
                        'Sitemap contains only indexable URLs',
                        'Search Console shows healthy indexation coverage',
                        'No blocked resources preventing rendering',
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Performance & User Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuditChecklistCard
                      title="Core Web Vitals"
                      items={[
                        'LCP (Largest Contentful Paint) < 2.5 seconds',
                        'FID/INP (Interaction metrics) < 100ms / < 200ms',
                        'CLS (Cumulative Layout Shift) < 0.1',
                        '75%+ of pages pass Core Web Vitals (per CrUX)',
                        'Images optimized and lazy-loaded',
                        'CSS/JavaScript minified and deferred',
                        'Third-party scripts loaded asynchronously',
                      ]}
                    />
                    <AuditChecklistCard
                      title="Mobile Optimization"
                      items={[
                        'Responsive design (single mobile version)',
                        'Viewport meta tag configured correctly',
                        'Touch-friendly buttons (48x48px minimum)',
                        'No intrusive interstitials',
                        'Text readable without zooming',
                        'Mobile usability issues < 5% of pages',
                        'Mobile performance score > 50 on PageSpeed',
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Security & Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuditChecklistCard
                      title="HTTPS & Security"
                      items={[
                        'All pages served over HTTPS (SSL/TLS)',
                        'HTTP redirects to HTTPS with 301 status',
                        'No mixed content (HTTPS page loading HTTP resources)',
                        'HSTS header configured',
                        'Certificate is valid and not expired',
                        'No security warnings in Search Console',
                        'Site clean from malware (check Google Safe Browsing)',
                      ]}
                    />
                    <AuditChecklistCard
                      title="Structured Data"
                      items={[
                        'JSON-LD markup for Organization schema',
                        'Article/BlogPosting schema on blog posts',
                        'Schema.org validation passes',
                        'Rich snippets rendering in search results',
                        'Breadcrumb schema implemented',
                        'No structured data errors in Search Console',
                        'FAQPage schema for FAQ content (if applicable)',
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Site Architecture & Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AuditChecklistCard
                      title="Information Architecture"
                      items={[
                        'Clear hierarchical site structure (category > subcategory)',
                        'Important pages reachable within 2-3 clicks',
                        'Semantic URLs reflecting content hierarchy',
                        'Breadcrumb navigation (visual and markup)',
                        'Consistent main navigation across all pages',
                        'No orphan pages (every page linked from somewhere)',
                        'Home page updated regularly with latest content',
                      ]}
                    />
                    <AuditChecklistCard
                      title="On-Page Technical Elements"
                      items={[
                        'Unique title tags (50-60 characters) on every page',
                        'Unique meta descriptions (150-160 characters)',
                        'H1 tag present and unique per page',
                        'Proper heading hierarchy (H1 > H2 > H3, no skipping)',
                        'Internal links using descriptive anchor text',
                        'Image alt text descriptive and keyword-relevant',
                        'Meta robots tag set correctly (or absent for indexable pages)',
                      ]}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section id="prioritization" className="scrape-section">
              <h2>Audit Finding Prioritization Framework</h2>
              <p>Not all technical SEO issues have equal impact. Use this framework to prioritize fixes by impact, effort, and opportunity:</p>

              <h3 className="mt-6 font-semibold">Impact & Effort Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-emerald-900">High Impact, Low Effort</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">Do First (Quick Wins)</p>
                    <ul className="list-disc pl-4">
                      <li>Fix crawl errors</li>
                      <li>Add missing canonical tags</li>
                      <li>Fix broken internal links</li>
                      <li>Implement missing meta descriptions</li>
                      <li>Enable HTTPS (if not already)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-yellow-900">High Impact, High Effort</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">Do Next (Strategic)</p>
                    <ul className="list-disc pl-4">
                      <li>Redesign site architecture</li>
                      <li>Improve Core Web Vitals</li>
                      <li>Implement structured data</li>
                      <li>Mobile redesign (if needed)</li>
                      <li>Remove duplicate content</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-sky-200 bg-sky-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-sky-900">Low Impact, Low Effort</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">Do Gradually (Nice to Have)</p>
                    <ul className="list-disc pl-4">
                      <li>Optimize image alt text</li>
                      <li>Implement breadcrumbs</li>
                      <li>Add FAQ schema</li>
                      <li>Improve internal linking</li>
                      <li>Optimize robots.txt</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-red-900">Low Impact, High Effort</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">Reconsider (Low ROI)</p>
                    <ul className="list-disc pl-4">
                      <li>Redesign entire site</li>
                      <li>Implement AMP (unless critical)</li>
                      <li>Migrate to new platform</li>
                      <li>Major URL structure changes</li>
                      <li>Re-platform entire site</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="monitoring" className="scrape-section">
              <h2>Ongoing Technical SEO Monitoring</h2>
              <p>A one-time audit is insufficient. Technical SEO requires continuous monitoring to detect regressions, new issues, and opportunities. Implement ongoing monitoring using these tools and practices:</p>

              <h3 className="mt-6 font-semibold">Essential Monitoring Practices</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Weekly:</strong> Review Google Search Console for new crawl errors, indexation drops, or mobile usability issues</li>
                <li><strong>Monthly:</strong> Run site crawl using Screaming Frog or Semrush Site Audit to detect link breakage or missing tags</li>
                <li><strong>Monthly:</strong> Check Core Web Vitals performance via PageSpeed Insights or Search Console</li>
                <li><strong>Quarterly:</strong> Conduct full technical SEO audit to catch cumulative issues</li>
                <li><strong>Continuously:</strong> Monitor server logs for 4xx/5xx errors, redirect chains, and unusual crawl patterns</li>
                <li><strong>After updates:</strong> Perform spot checks after any website changes (redesigns, migrations, CMS updates)</li>
              </ul>

              <h3 className="mt-6 font-semibold">Setting Up Automated Monitoring</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li>Use Search Console API to programmatically check for errors and indexation issues</li>
                <li>Set up alerts for Core Web Vitals regressions via PageSpeed Insights API</li>
                <li>Use monitoring tools like <a href="https://www.nagios.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nagios</a> or <a href="https://www.uptimerobot.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UptimeRobot</a> to track 24/7 uptime</li>
                <li>Log 404 errors via server logs or JavaScript to identify broken links early</li>
                <li>Use Google Analytics 4 to track page load times and user experience metrics</li>
              </ul>
            </section>

            <section id="case-studies" className="scrape-section">
              <h2>Real-World Technical SEO Case Studies</h2>

              <div className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>E-Commerce Site: Core Web Vitals Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> Large e-commerce site had LCP of 4.2s and CLS of 0.35, putting it in the "Poor" category. Rankings for high-value keywords were declining.</p>
                    <p><strong>Solution:</strong> Optimized images using WebP format, deferred non-critical JavaScript, and fixed layout shift caused by dynamically-loaded ads. Implemented lazy loading for below-the-fold images.</p>
                    <p><strong>Results:</strong> LCP improved to 1.8s, CLS to 0.08. Core Web Vitals score went from 12% passing to 87% in 60 days. Rankings for top keywords improved 3-5 positions. Conversion rate increased 15%.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>B2B SaaS: Crawl Budget Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> SaaS product had thousands of parameter-based URLs (filters, sorts) that Google was crawling inefficiently, wasting crawl budget on duplicate content.</p>
                    <p><strong>Solution:</strong> Implemented pagination rel=next/prev, added URL parameters to robots.txt to prevent crawling, and consolidated filter-based URLs into canonicalized versions.</p>
                    <p><strong>Results:</strong> Crawl budget spent on unique pages increased 300%. Indexation of core content improved 45%. Overall organic traffic increased 28% without any content changes.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Publishing: Structured Data for Rich Snippets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> Publishing site wasn't appearing in featured snippets or rich results despite having high-quality content.</p>
                    <p><strong>Solution:</strong> Implemented Article schema with publication date/author, FAQ schema for Q&A content, and breadcrumb navigation. Updated search console.</p>
                    <p><strong>Results:</strong> Featured snippet positions increased 340%. FAQ schema appeared in 85% of targeted searches. Click-through rate from search improved 22%.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="faq" className="scrape-section">
              <h2>Technical SEO Audit FAQ</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>How long does a technical SEO audit take?</AccordionTrigger>
                  <AccordionContent>
                    For a small site (< 500 pages), 1-2 weeks. Medium sites (500-5,000 pages), 2-4 weeks. Large sites (5,000+ pages) can take 4-8 weeks. This includes crawling, analysis, prioritization, and remediation planning. Implementation may take additional weeks or months depending on findings.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2">
                  <AccordionTrigger>What's the difference between robots.txt and noindex?</AccordionTrigger>
                  <AccordionContent>
                    robots.txt prevents crawling (search engines don't fetch the page at all). noindex allows crawling but prevents indexation (Google sees the page but doesn't add it to the index). Use robots.txt to block low-priority pages; use noindex for duplicate or thin content you want crawled but not indexed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3">
                  <AccordionTrigger>Does my site need AMP?</AccordionTrigger>
                  <AccordionContent>
                    AMP is becoming less important. Focus instead on improving Core Web Vitals for your standard mobile pages. AMP is still useful for news/publishing sites aiming for top news carousel placement, but for most businesses, standard responsive pages with good performance are sufficient.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4">
                  <AccordionTrigger>What's a good Core Web Vitals score?</AccordionTrigger>
                  <AccordionContent>
                    Good: LCP < 2.5s, FID < 100ms (or INP < 200ms), CLS < 0.1. Google requires 75%+ of pages meeting these thresholds over a rolling 28-day window. If your site passes on 50%+ of pages, you're above average; 75%+ puts you in the top tier.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5">
                  <AccordionTrigger>How often should I audit my site?</AccordionTrigger>
                  <AccordionContent>
                    Minimum quarterly. More frequently if you make regular updates or changes. After any major update (redesign, platform migration, new section launch), conduct an audit within 2 weeks to catch regressions early. Set up continuous monitoring between audits.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6">
                  <AccordionTrigger>What's the most impactful technical SEO fix?</AccordionTrigger>
                  <AccordionContent>
                    Usually fixing crawl errors and ensuring proper indexation. Many sites have 10-50% of important pages with crawl errors or blocked from indexation. Simply fixing these can unlock 20-30% traffic increases without any content or link building changes. Core Web Vitals improvements also tend to have high impact on modern queries.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Dominate Rankings With Quality Backlinks?"
                description="After fixing your technical SEO foundation, accelerate rankings with high-authority backlinks from Backlink ∞. We're the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords. Combine technical excellence with strategic link building for unbeatable search visibility. Access premium SEO tools and expert support."
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}