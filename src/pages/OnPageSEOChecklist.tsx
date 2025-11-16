import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, TrendingUp, Search, BarChart3, Zap, Target, Code, FileText, ArrowRight, BookOpen, AlertCircle, Lightbulb } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';

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

const metaTitle = 'On-Page SEO Checklist: Complete Guide to Ranking Higher on Google';
const metaDescription = 'Master on-page SEO with our complete checklist. Learn every element you need to optimize—from titles and meta descriptions to schema markup and internal linking—to rank #1 on Google.';

export default function OnPageSEOChecklist() {
  const canonical = React.useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/on-page-seo-checklist`;
    } catch {
      return '/on-page-seo-checklist';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'on-page SEO, on page optimization, SEO checklist, meta tags, title tags, keyword optimization, internal linking, schema markup, on-page ranking factors');
    upsertCanonical(canonical);

    injectJSONLD('onpage-seo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Backlinkoo',
        url: 'https://backlinkoo.com',
      },
    });

    injectJSONLD('onpage-seo-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      url: canonical,
      author: {
        '@type': 'Organization',
        name: 'Backlinkoo Editorial Team',
      },
      datePublished: new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0],
    });

    injectJSONLD('onpage-seo-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'SEO Resources', item: '/seo-resources' },
        { '@type': 'ListItem', position: 3, name: 'On-Page SEO Checklist', item: canonical },
      ],
    });

    injectJSONLD('onpage-seo-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is on-page SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On-page SEO refers to all optimizations you make directly on your web pages to improve search visibility. This includes optimizing content, HTML tags, internal links, and technical elements like page speed and mobile responsiveness.',
          },
        },
        {
          '@type': 'Question',
          name: 'How important is on-page SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On-page SEO is fundamental to ranking. Google uses over 200 ranking factors, and while backlinks are important, on-page optimization directly signals relevance, quality, and user experience to search engines.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the most important on-page SEO factor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Content quality and relevance are most important. Your content must genuinely answer the search query better than current top results. Then, optimize HTML tags, structure, and user experience to help search engines understand and rank it.',
          },
        },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'intro', label: 'Introduction' },
    { id: 'fundamentals', label: 'On-Page SEO Fundamentals' },
    { id: 'content', label: 'Content Optimization' },
    { id: 'html-tags', label: 'HTML Tags & Meta' },
    { id: 'structure', label: 'Page Structure' },
    { id: 'internal-linking', label: 'Internal Linking' },
    { id: 'technical', label: 'Technical On-Page SEO' },
    { id: 'user-experience', label: 'User Experience Signals' },
    { id: 'media', label: 'Media Optimization' },
    { id: 'schema-markup', label: 'Schema Markup' },
    { id: 'checklist', label: 'Complete Checklist' },
    { id: 'common-mistakes', label: 'Common Mistakes' },
    { id: 'tools', label: 'Tools & Resources' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Next Steps' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <div className="ops-progress" aria-hidden="true">
        <div className="ops-progress__bar" />
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="ops-hero" aria-labelledby="page-title">
          <p className="ops-kicker">SEO Optimization Guide</p>
          <h1 id="page-title" className="ops-title">On-Page SEO Checklist</h1>
          <p className="ops-subtitle">The complete, actionable checklist for optimizing every element of your web pages. Master on-page SEO and dominate search rankings with our 2025 guide.</p>
          <div className="ops-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: SEO Editorial Team</span>
            <span>Read time: 55+ minutes</span>
          </div>
          <div className="ops-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full">
              <a href="#checklist">View Full Checklist</a>
            </Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full">
              <a href="#faq">Read FAQs</a>
            </Button>
            <Badge className="ml-3" variant="secondary">2025 Guide</Badge>
          </div>
        </header>

        <div className="ops-layout">
          <nav className="ops-toc" aria-label="On this page">
            <div className="ops-toc__title">
              <BookOpen className="h-4 w-4" />
              On this page
            </div>
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <article id="onpage-seo-content" className="ops-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="ops-section">
              <h2>Introduction to On-Page SEO</h2>
              <p>On-page SEO is where most SEO work happens—and where many websites fail to optimize effectively. Unlike backlinks, which depend on external factors, on-page SEO is entirely within your control. Every element of your page, from the title tag to the image alt text, sends signals to Google about relevance, quality, and user experience.</p>

              <p>In 2025, on-page SEO has become more sophisticated. Google's algorithms now evaluate not just keywords and structure, but also content depth, topic coherence, user engagement metrics, and how well your page satisfies search intent. This guide provides a comprehensive, actionable on-page SEO checklist covering every element modern SEO professionals need to master.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Control Your Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">On-page SEO is completely within your control—optimize everything from titles to internal links.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Improve Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Proper on-page optimization is one of the highest-ROI SEO investments you can make.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-amber-600" />
                      Boost User Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">On-page best practices improve both search visibility and user satisfaction.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="fundamentals" className="ops-section">
              <h2>On-Page SEO Fundamentals</h2>

              <p>Before diving into specific tactics, understand the three pillars of modern on-page SEO:</p>

              <div className="grid grid-cols-1 gap-4 my-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Relevance: Match Search Intent</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Your page content must precisely match what the user searched for. If someone searches "how to rank on Google," they want a guide—not a tool review. Google evaluates intent match as a primary ranking factor.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quality: Demonstrate Expertise</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Your content must show genuine expertise, accuracy, and depth. Google's E-E-A-T framework (Expertise, Experience, Authoritativeness, Trustworthiness) is central to ranking. Thin, superficial content doesn't rank well anymore.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">UX: Optimize for Humans First</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Page speed, mobile responsiveness, readability, and engagement all factor into rankings. A page optimized only for keywords but difficult to read or navigate won't rank well.</p>
                  </CardContent>
                </Card>
              </div>

              <h3>The Core On-Page Optimization Stack</h3>
              <p>Think of on-page SEO as having five interconnected layers:</p>

              <ol>
                <li><strong>Content Layer:</strong> High-quality, original content that answers user questions comprehensively.</li>
                <li><strong>Keyword Layer:</strong> Strategic placement of target keywords and semantic variations throughout content.</li>
                <li><strong>HTML Layer:</strong> Title tags, meta descriptions, headings, and structured data that help Google understand your content.</li>
                <li><strong>Link Layer:</strong> Internal linking structure that distributes authority and clarifies site hierarchy.</li>
                <li><strong>Technical Layer:</strong> Page speed, mobile responsiveness, crawlability, and core web vitals.</li>
              </ol>

              <p className="mt-4">A page optimized on only one or two layers will underperform. The best results come from coordinated optimization across all five.</p>
            </section>

            <section id="content" className="ops-section">
              <h2>Content Optimization for On-Page SEO</h2>

              <p>Content is the foundation of on-page SEO. No amount of technical optimization compensates for weak content.</p>

              <h3>1. Target Keywords Naturally Throughout Content</h3>
              <p>Place your primary keyword and related keywords naturally in:</p>

              <ul>
                <li><strong>First 100 words:</strong> Include your primary keyword early, ideally in the first paragraph or opening sentence.</li>
                <li><strong>Body paragraphs:</strong> Use keyword variations and related terms naturally throughout. Avoid keyword stuffing.</li>
                <li><strong>Subheadings (H2/H3):</strong> Include keywords in at least 1-2 subheadings to signal topic relevance.</li>
                <li><strong>Last 100 words:</strong> Reinforce your primary keyword and key concepts near the conclusion.</li>
              </ul>

              <p className="mt-4"><strong>Pro tip:</strong> Focus on semantic variations and related keywords rather than exact-match repetition. For "on-page SEO checklist," use variations like "on-page optimization," "on-page ranking factors," "page optimization," etc.</p>

              <h3>2. Create Content That Satisfies Search Intent</h3>
              <p>Analyze the top 10 results for your target keyword and answer the question: "What type of content does Google currently rank for this query?"</p>

              <ul>
                <li>If the top results are lists/checklists, create a superior checklist.</li>
                <li>If they're comparison articles, create a thorough comparison.</li>
                <li>If they're how-to guides, create an in-depth tutorial.</li>
              </ul>

              <p>Trying to rank a product review for a keyword dominated by tutorials is an uphill battle. Match the intent format.</p>

              <h3>3. Write for Both Humans and Algorithms</h3>
              <p>The best on-page SEO content reads naturally to humans while containing strategic keyword placement and structure for search engines.</p>

              <ul>
                <li><strong>Use short paragraphs:</strong> 2-4 sentences per paragraph improves readability, especially on mobile.</li>
                <li><strong>Use transitional phrases:</strong> Help readers (and algorithms) understand how sections relate.</li>
                <li><strong>Use active voice:</strong> "We optimized the page" is better than "The page was optimized."</li>
                <li><strong>Vary sentence length:</strong> Mix short, punchy sentences with longer explanatory ones.</li>
              </ul>

              <h3>4. Create Comprehensive, In-Depth Content</h3>
              <p>Google increasingly favors comprehensive content that thoroughly covers a topic. For competitive keywords, aim for:</p>

              <ul>
                <li><strong>Long-form content:</strong> 3,000-5,000+ words for competitive keywords (informational intent).</li>
                <li><strong>Complete coverage:</strong> Address all aspects of the topic—not just the basics.</li>
                <li><strong>Multiple content formats:</strong> Mix text, lists, tables, visuals, and interactive elements.</li>
                <li><strong>Real examples:</strong> Include case studies, screenshots, and real-world applications.</li>
              </ul>

              <p>However, length alone doesn't guarantee rankings. Content must be genuinely comprehensive and valuable, not just long.</p>

              <h3>5. Update and Refresh Content Regularly</h3>
              <p>Search engines favor fresh content, especially for time-sensitive queries. Even if your content ranks, periodic updates signal that information is current:</p>

              <ul>
                <li>Update statistics and data to current year.</li>
                <li>Add new examples and case studies.</li>
                <li>Expand sections that have become outdated.</li>
                <li>Update outbound links to maintain quality.</li>
                <li>Refresh the "last updated" date when making significant changes.</li>
              </ul>
            </section>

            <section id="html-tags" className="ops-section">
              <h2>Critical HTML Tags for On-Page SEO</h2>

              <p>HTML tags communicate content meaning to search engines. Optimize these critical elements:</p>

              <h3>Title Tag (Most Important)</h3>
              <p>The title tag is the single most important on-page element for ranking and CTR.</p>

              <ul>
                <li><strong>Length:</strong> 50-60 characters (up to 70 for longer keywords). Longer titles get truncated in SERPs.</li>
                <li><strong>Primary keyword first:</strong> Place your main keyword at or near the beginning (e.g., "On-Page SEO Checklist: Complete Guide for 2025" rather than "2025 Guide to On-Page SEO Checklist").</li>
                <li><strong>Brand at end:</strong> Include your brand name at the end if space allows (e.g., " | Backlinkoo").</li>
                <li><strong>Make it compelling:</strong> Users click based on title text, so make it clear and attractive.</li>
                <li><strong>Use modifiers:</strong> Include power words: "Guide," "Complete," "Ultimate," "2025," "Best Practices," etc.</li>
              </ul>

              <p><strong>Example:</strong> "On-Page SEO Checklist: Complete 2025 Guide | Backlinkoo"</p>

              <h3>Meta Description</h3>
              <p>While not a direct ranking factor, meta descriptions heavily influence CTR from search results.</p>

              <ul>
                <li><strong>Length:</strong> 155-160 characters on desktop, 120 on mobile.</li>
                <li><strong>Include primary keyword:</strong> Google bolds matching keywords in the SERP, drawing user attention.</li>
                <li><strong>Be specific:</strong> "Learn everything about SEO" is generic. "Master 23 critical on-page optimization elements with our actionable checklist" is compelling.</li>
                <li><strong>Include a CTA:</strong> "Learn more," "See the full checklist," "Start optimizing today."</li>
                <li><strong>Avoid duplication:</strong> Each page needs a unique meta description.</li>
              </ul>

              <p><strong>Example:</strong> "Master on-page SEO with our complete checklist. Optimize titles, meta tags, content, internal links, and technical elements to rank #1. Start your 2025 optimization now."</p>

              <h3>Header Tags (H1, H2, H3)</h3>
              <p>Proper heading hierarchy helps Google understand page structure and content topics.</p>

              <ul>
                <li><strong>One H1 per page:</strong> The H1 should match or closely relate to your title tag and primary keyword.</li>
                <li><strong>Use H2s for major sections:</strong> Break your page into clear sections, each with an H2.</li>
                <li><strong>Use H3s for subsections:</strong> Further organize content hierarchy with H3 headers.</li>
                <li><strong>Include keywords naturally:</strong> Use your target keywords in headers where it makes sense, but prioritize clarity over keyword density.</li>
                <li><strong>Never skip levels:</strong> Don't go from H1 to H3—maintain proper hierarchy (H1 → H2 → H3).</li>
              </ul>

              <h3>Canonical Tag</h3>
              <p>Specify the preferred version of your page, especially important if duplicate content exists.</p>

              <ul>
                <li><strong>Self-referencing canonical:</strong> Most pages should have a self-referencing canonical tag (pointing to themselves).</li>
                <li><strong>Use absolute URLs:</strong> Always use full URLs (https://example.com/page), not relative URLs.</li>
                <li><strong>One canonical per page:</strong> Don't specify multiple canonical tags.</li>
              </ul>
            </section>

            <section id="structure" className="ops-section">
              <h2>Content Structure and Readability</h2>

              <p>How you structure your content affects both user experience and search visibility.</p>

              <h3>Logical Content Organization</h3>
              <p>Organize your content in a logical flow that matches how users want to consume information:</p>

              <ul>
                <li>Start with the "why"—establish context and importance.</li>
                <li>Progress to the "what"—introduce key concepts and definitions.</li>
                <li>Move to the "how"—provide actionable guidance and steps.</li>
                <li>Conclude with "next steps" and related resources.</li>
              </ul>

              <h3>Use Lists and Tables</h3>
              <p>Lists and tables break up dense text and make content more scannable:</p>

              <ul>
                <li>Use bullet points for non-sequential information.</li>
                <li>Use numbered lists for sequential steps or processes.</li>
                <li>Use tables to compare multiple options or attributes.</li>
              </ul>

              <h3>Formatting for Scannability</h3>
              <p>Most users scan rather than read in detail. Improve scannability:</p>

              <ul>
                <li><strong>Bold key phrases:</strong> Make important concepts stand out.</li>
                <li><strong>Use short paragraphs:</strong> White space reduces cognitive load.</li>
                <li><strong>Use descriptive subheadings:</strong> Let subheadings tell the story even if someone just skims.</li>
                <li><strong>Use visual hierarchy:</strong> Font sizes, colors, and spacing guide reader attention.</li>
              </ul>
            </section>

            <section id="internal-linking" className="ops-section">
              <h2>Internal Linking Strategy for On-Page SEO</h2>

              <p>Internal links are one of the most underutilized on-page SEO tactics. They distribute authority, clarify site structure, and build topical relevance.</p>

              <h3>Strategic Internal Linking Principles</h3>

              <ul>
                <li><strong>Link to relevant pages:</strong> Only link to pages that genuinely relate to the topic. Avoid random linking.</li>
                <li><strong>Use descriptive anchor text:</strong> Anchor text tells Google what the linked page is about. "Learn more about on-page SEO" is better than "click here."</li>
                <li><strong>Link from high-authority pages:</strong> Links from your site's most authoritative pages carry more weight.</li>
                <li><strong>Vary anchor text:</strong> Use brand, exact-match, partial-match, and natural anchors. Don't use identical anchor text repeatedly.</li>
                <li><strong>Limit internal links:</strong> 3-5 relevant internal links per page is typically optimal. Too many dilutes authority distribution.</li>
              </ul>

              <h3>Building Topical Authority Through Internal Linking</h3>
              <p>Organize related content into "topic clusters" with a pillar page and supporting cluster pages:</p>

              <ul>
                <li><strong>Pillar page:</strong> Broad, comprehensive page on the main topic (e.g., "On-Page SEO Checklist").</li>
                <li><strong>Cluster pages:</strong> Specific subtopic pages (e.g., "Title Tag Optimization," "Meta Description Best Practices," "Internal Linking Strategy").</li>
                <li><strong>Linking strategy:</strong> Cluster pages link back to the pillar page with descriptive anchor text. The pillar page links to each cluster page.</li>
              </ul>

              <p>This structure signals topical expertise to Google and improves rankings for the pillar keyword and all cluster keywords.</p>

              <h3>Internal Linking Best Practices</h3>

              <ul>
                <li>Link contextually within content, not just in sidebars.</li>
                <li>Link to pages that provide additional value to the current reader.</li>
                <li>Use absolute URLs (including domain) for internal links—slightly better for crawlability.</li>
                <li>Avoid linking to pages you want to hide from search engines.</li>
                <li>Update internal links when page topics change.</li>
              </ul>

              <p>For example, when explaining on-page SEO fundamentals, link to your <a href="/keyword-research-for-seo">keyword research guide</a> for readers wanting to understand intent matching better. When discussing technical SEO, link to relevant how-to guides on your site.</p>
            </section>

            <section id="technical" className="ops-section">
              <h2>Technical On-Page SEO</h2>

              <p>Technical optimizations improve crawlability, indexability, and user experience.</p>

              <h3>Page Speed Optimization</h3>
              <p>Page speed is a confirmed ranking factor and crucial for user experience.</p>

              <ul>
                <li><strong>Optimize images:</strong> Compress and serve appropriately-sized images. Use modern formats (WebP).</li>
                <li><strong>Minimize CSS/JavaScript:</strong> Reduce file sizes and defer non-critical JavaScript.</li>
                <li><strong>Enable caching:</strong> Leverage browser caching to reduce load times for repeat visitors.</li>
                <li><strong>Use a CDN:</strong> Content delivery networks serve content from geographically distributed servers.</li>
                <li><strong>Lazy load below-the-fold content:</strong> Defer loading content users won't immediately see.</li>
              </ul>

              <h3>Mobile Responsiveness</h3>
              <p>Mobile-first indexing means Google primarily crawls and indexes the mobile version of your site.</p>

              <ul>
                <li>Use responsive design that adapts to all screen sizes.</li>
                <li>Ensure mobile content is not hidden or significantly reduced.</li>
                <li>Make navigation mobile-friendly.</li>
                <li>Ensure touch targets are appropriately sized.</li>
              </ul>

              <h3>Core Web Vitals</h3>
              <p>Google's Core Web Vitals measure user experience and are ranking factors:</p>

              <ul>
                <li><strong>Largest Contentful Paint (LCP):</strong> When the largest element renders. Target: under 2.5 seconds.</li>
                <li><strong>First Input Delay (FID) / Interaction to Next Paint (INP):</strong> How responsive the page is to user interaction. Target: under 100ms.</li>
                <li><strong>Cumulative Layout Shift (CLS):</strong> Visual stability during page load. Target: under 0.1.</li>
              </ul>

              <p>Use Google PageSpeed Insights or Google Search Console to identify Core Web Vitals issues on your pages.</p>

              <h3>Mobile Rendering</h3>
              <p>Ensure JavaScript-rendered content is crawlable:</p>

              <ul>
                <li>Test that your page renders correctly when JavaScript is disabled (or with limited JS).</li>
                <li>Ensure critical content and links are not hidden behind JavaScript-dependent interactions.</li>
                <li>Use server-side rendering for SEO-critical content when possible.</li>
              </ul>
            </section>

            <section id="user-experience" className="ops-section">
              <h2>User Experience Signals and On-Page SEO</h2>

              <p>Google measures how users interact with your page, and these signals influence rankings.</p>

              <h3>Click-Through Rate (CTR) from SERPs</h3>
              <p>Your title and meta description determine CTR. Higher CTR signals that your result is relevant and appealing:</p>

              <ul>
                <li>A/B test title variations in Google Search Console to identify high-performing titles.</li>
                <li>Include power words and modifiers that increase click appeal.</li>
                <li>Make your description compelling and action-oriented.</li>
              </ul>

              <h3>Bounce Rate and Dwell Time</h3>
              <p>How long users stay on your page matters. If they immediately bounce, Google interprets it as poor relevance:</p>

              <ul>
                <li>Ensure content matches user expectations set by title/description.</li>
                <li>Front-load the most important information.</li>
                <li>Make it easy to scan and understand immediately.</li>
                <li>Ensure visuals load quickly so page isn't blank initially.</li>
              </ul>

              <h3>Engagement Metrics</h3>
              <p>Signals like scroll depth, time on page, and link clicks indicate engagement:</p>

              <ul>
                <li>Break up content into digestible sections.</li>
                <li>Use visuals (images, videos, infographics) to maintain interest.</li>
                <li>Include interactive elements like quizzes, calculators, or collapsible sections.</li>
                <li>End sections with compelling internal links to keep users exploring.</li>
              </ul>
            </section>

            <section id="media" className="ops-section">
              <h2>Media Optimization for On-Page SEO</h2>

              <p>Images, videos, and other media enhance content quality and engagement.</p>

              <h3>Image Optimization</h3>

              <ul>
                <li><strong>Use descriptive alt text:</strong> Alt text helps visually impaired users and tells Google what the image shows. Include keywords naturally.</li>
                <li><strong>Use descriptive filenames:</strong> "on-page-seo-optimization-steps.jpg" is better than "image123.jpg".</li>
                <li><strong>Compress images:</strong> Use tools like TinyPNG or ImageOptim to reduce file sizes without visible quality loss.</li>
                <li><strong>Use appropriate dimensions:</strong> Serve images at the size they're displayed to avoid wasted bandwidth.</li>
                <li><strong>Use modern formats:</strong> WebP format provides better compression than JPEG/PNG.</li>
                <li><strong>Add captions:</strong> Captions provide context and allow natural keyword usage.</li>
              </ul>

              <h3>Video Optimization</h3>

              <ul>
                <li><strong>Host videos properly:</strong> Embed YouTube/Vimeo rather than self-hosting for faster load times.</li>
                <li><strong>Add transcripts:</strong> Transcripts improve accessibility and give Google text to index.</li>
                <li><strong>Create video sitemap:</strong> Submit to Google Search Console for better video discovery.</li>
                <li><strong>Use video schema:</strong> Markup videos with VideoObject schema for enhanced SERP appearance.</li>
              </ul>

              <h3>Infographics</h3>

              <ul>
                <li>Create original, data-driven infographics that summarize key points.</li>
                <li>Make infographics embeddable with attribution (link magnet).</li>
                <li>Provide text summary below infographic for accessibility and SEO.</li>
              </ul>
            </section>

            <section id="schema-markup" className="ops-section">
              <h2>Schema Markup for Enhanced On-Page SEO</h2>

              <p>Schema markup (structured data) helps search engines understand content context and enables rich snippets in search results.</p>

              <h3>Essential Schema Types for Most Pages</h3>

              <ul>
                <li><strong>Article schema:</strong> For blog posts and articles. Includes headline, description, image, author, date published.</li>
                <li><strong>FAQPage schema:</strong> For pages with FAQs. Enables FAQ rich snippets in SERPs.</li>
                <li><strong>HowTo schema:</strong> For instructional content. Shows step-by-step instructions in search results.</li>
                <li><strong>BreadcrumbList schema:</strong> Shows page hierarchy in SERPs, improving CTR.</li>
                <li><strong>Organization schema:</strong> For your site homepage. Includes company name, logo, contact info.</li>
              </ul>

              <h3>Best Practices for Schema Implementation</h3>

              <ul>
                <li>Use JSON-LD format (preferred by Google) rather than Microdata.</li>
                <li>Test schema with <a href="https://schema.org/docs/" target="_blank" rel="noopener noreferrer">Google Rich Results Test</a>.</li>
                <li>Only use schema types that accurately describe your content.</li>
                <li>Keep schema up-to-date with content changes.</li>
                <li>Don't use schema to trick search engines (e.g., marking non-recipes as recipes).</li>
              </ul>

              <p>Proper schema markup can earn you rich snippets in search results—dramatically increasing CTR.</p>
            </section>

            <section id="checklist" className="ops-section">
              <h2>Complete On-Page SEO Checklist</h2>

              <p>Use this comprehensive checklist before publishing or updating any page:</p>

              <Tabs defaultValue="pre-publish" className="my-6">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="pre-publish">Pre-Publish</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="html">HTML & Meta</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="post-publish">Post-Publish</TabsTrigger>
                </TabsList>

                <TabsContent value="pre-publish" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Target keyword identified and researched</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Top 10 ranking pages analyzed for content type and depth</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Search intent identified and confirmed</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Outline created with clear section headings</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Related internal pages identified for linking</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Content exceeds 3,000+ words (for competitive keywords)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Primary keyword appears in first 100 words</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Keyword variations used naturally throughout content</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Content is original and provides unique value</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Claims are supported with data, examples, or citations</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Content is properly formatted with short paragraphs</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Visuals (images, videos, infographics) included</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="html" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Title tag: 50-60 characters with primary keyword</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Meta description: 155-160 characters with keyword and CTA</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>H1 tag present and contains primary keyword</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>H2/H3 tags properly structured with keywords</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Canonical tag present and correctly configured</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Meta robots tag configured appropriately</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Schema markup added and validated</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Page loads in under 3 seconds</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Core Web Vitals optimized (LCP, CLS, INP)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Mobile responsive and tested on multiple devices</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Images optimized and compressed</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>No broken links (internal or external)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Proper redirects in place (if replacing old content)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="post-publish" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Page added to XML sitemap</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Submitted to Google Search Console</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Internal links added from relevant pages</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Page included in topical cluster with pillar</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Monitored in rank tracking tool</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Monitored for Core Web Vitals issues</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>

            <section id="common-mistakes" className="ops-section">
              <h2>Common On-Page SEO Mistakes to Avoid</h2>

              <div className="grid grid-cols-1 gap-4 my-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Ignoring Search Intent
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Creating content that doesn't match what users actually searched for.</p>
                    <p className="mt-2"><strong>Fix:</strong> Analyze top results for your target keyword to understand dominant intent before writing.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Keyword Stuffing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Overusing keywords unnaturally to try to force rankings.</p>
                    <p className="mt-2"><strong>Fix:</strong> Write naturally for humans first. Use keywords where they fit logically; use synonyms and variations elsewhere.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Thin or Duplicate Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Publishing shallow content or duplicating content from other pages.</p>
                    <p className="mt-2"><strong>Fix:</strong> Create comprehensive, original content. If pages are similar, consolidate or use canonical tags.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Neglecting Technical SEO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Great content that's slow or not mobile-responsive won't rank well.</p>
                    <p className="mt-2"><strong>Fix:</strong> Optimize page speed, ensure mobile responsiveness, and monitor Core Web Vitals.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Poor Internal Linking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Pages orphaned with no internal links, or poor anchor text in internal links.</p>
                    <p className="mt-2"><strong>Fix:</strong> Build internal linking strategy that distributes authority and clarifies site structure.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Missing Meta Elements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Mistake:</strong> Generic or missing title tags and meta descriptions tank CTR.</p>
                    <p className="mt-2"><strong>Fix:</strong> Create unique, compelling title tags and meta descriptions for every page.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="tools" className="ops-section">
              <h2>Tools for On-Page SEO Optimization</h2>

              <p>These tools help identify on-page SEO issues and opportunities:</p>

              <div className="grid grid-cols-1 gap-4 my-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Google Search Console</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> Identifying indexing issues, search performance, Core Web Vitals problems.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Google PageSpeed Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> Detailed page speed and Core Web Vitals analysis with recommendations.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Yoast SEO / Rank Math</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> On-page SEO analysis, keyword optimization suggestions, readability checks.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ahrefs / SEMrush</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> Competitive analysis, keyword research, on-page optimization gaps.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Google Rich Results Test</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> Validating schema markup and previewing rich snippets.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Screaming Frog SEO Spider</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Best for:</strong> Crawling sites to identify on-page issues (duplicate titles, missing meta tags, broken links).</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="faq" className="ops-section">
              <h2>On-Page SEO FAQ</h2>

              <Accordion type="single" collapsible>
                <AccordionItem value="importance">
                  <AccordionTrigger>How important is on-page SEO compared to backlinks?</AccordionTrigger>
                  <AccordionContent>
                    <p>Both are essential, but on-page SEO is the foundation. Excellent on-page optimization makes pages more crawlable, indexable, and relevant—this is prerequisite to ranking. Backlinks signal authority. Think of on-page as "necessary but not sufficient." A great page without links won't rank; poor on-page optimization won't rank even with links.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="keyword-placement">
                  <AccordionTrigger>Where exactly should I place keywords on a page?</AccordionTrigger>
                  <AccordionContent>
                    <p>Place your primary keyword: (1) in the title tag, (2) in the H1, (3) in the first 100 words, (4) in at least one subheading, (5) naturally throughout body content. But always prioritize readability over keyword placement. Avoid forcing keywords where they don't belong naturally.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="keyword-density">
                  <AccordionTrigger>Is keyword density important?</AccordionTrigger>
                  <AccordionContent>
                    <p>No. Keyword density (keyword frequency as % of total words) is outdated. Focus on relevance and natural usage instead. For a 3,000-word article targeting "on-page SEO," using the phrase 5-10 times naturally is fine; 50 times is spam. Google's algorithms are sophisticated enough to understand context without exact-match repetition.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="update-old-pages">
                  <AccordionTrigger>Should I update my old content for on-page SEO?</AccordionTrigger>
                  <AccordionContent>
                    <p>Absolutely. Refreshing old content with updated on-page optimization often yields quick ranking improvements. Update: titles/meta descriptions, add images and media, improve content quality, add internal links, and ensure technical optimization. Refresh the publication date or add an "Updated" date to signal freshness.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="num-internal-links">
                  <AccordionTrigger>How many internal links should each page have?</AccordionTrigger>
                  <AccordionContent>
                    <p>Quality over quantity. 3-5 contextual, relevant internal links per page is typically optimal. Too many internal links dilute authority distribution. Focus on links that genuinely help users navigate and learn more, not on hitting a target number.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="featured-snippets">
                  <AccordionTrigger>How do I optimize for featured snippets?</AccordionTrigger>
                  <AccordionContent>
                    <p>Featured snippets often come from pages already ranking in top 10. To optimize: (1) target long-tail keywords and question-based queries, (2) structure content with clear definitions, lists, or tables, (3) provide concise answers (40-60 words for definitions), (4) use header tags to clearly mark sections, (5) answer common "how," "what," "why" questions. Lists and tables are particularly effective for snippet optimization.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="heading-tags">
                  <AccordionTrigger>Can I use multiple H1 tags per page?</AccordionTrigger>
                  <AccordionContent>
                    <p>Technically, yes—HTML5 allows multiple H1s. However, best practice is one H1 per page for clarity. If you use multiple H1s, they should all relate to the main topic. H1 should be your page's primary heading; use H2 and H3 for sub-sections.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Dominate with On-Page SEO and High-Quality Backlinks?"
                description="On-page SEO is just one piece of the ranking puzzle. To achieve top 10 rankings for competitive keywords, you need high-quality backlinks from authoritative sites. Backlink ∞ is the #1 leading SEO agency and backlinks provider with proven results for even the most competitive keywords. We combine expert on-page optimization with our comprehensive link building strategy to help you dominate search results. Double guaranteed results—double the links across all your campaigns. Get premium SEO tools and expert guidance to take your rankings to the next level."
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
