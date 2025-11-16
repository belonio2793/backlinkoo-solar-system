import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Link2, TrendingUp, Globe, Users, Zap, Award, BookOpen, Target, Briefcase, BarChart3, Shield, MessageSquare } from 'lucide-react';
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

const metaTitle = 'How to Build Backlinks 2025: Complete Beginner to Advanced Guide';
const metaDescription = 'Comprehensive guide to building high-quality backlinks for SEO. Learn proven strategies, tools, and techniques to earn authoritative links that rank your site on Google.';

export default function HowToBuildBacklinks() {
  useProgress('#backlinks-content');

  const canonical = React.useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/how-to-build-backlinks`;
    } catch {
      return '/how-to-build-backlinks';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'how to build backlinks, backlink building, link building strategies, SEO backlinks, quality backlinks, backlink sources, link building techniques, SEO links');
    upsertCanonical(canonical);

    injectJSONLD('backlinks-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('backlinks-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'How to Build Backlinks Guide', item: '/how-to-build-backlinks' },
      ],
    });

    injectJSONLD('backlinks-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What are high-quality backlinks?', acceptedAnswer: { '@type': 'Answer', text: 'High-quality backlinks come from authoritative, relevant websites with good domain authority and user engagement. They pass ranking power (PageRank) and signal trust to search engines.' } },
        { '@type': 'Question', name: 'How many backlinks do I need to rank?', acceptedAnswer: { '@type': 'Answer', text: 'Quality trumps quantity. 10-15 high-authority backlinks often outrank 100+ low-quality links. Focus on earning links from relevant, authoritative sites rather than volume.' } },
        { '@type': 'Question', name: 'How long does it take to see results from backlinks?', acceptedAnswer: { '@type': 'Answer', text: 'Google typically indexes new backlinks within 1-3 months, but ranking improvements may take 3-6 months depending on competition and page authority. Consistent link building yields compounding results.' } },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'intro', label: 'Overview' },
    { id: 'what-are', label: 'What Are Backlinks' },
    { id: 'why-matter', label: 'Why Backlinks Matter' },
    { id: 'types', label: 'Types of Backlinks' },
    { id: 'white-hat', label: 'White-Hat Strategies' },
    { id: 'content-marketing', label: 'Content Marketing' },
    { id: 'outreach', label: 'Outreach Strategy' },
    { id: 'resource-links', label: 'Resource Links' },
    { id: 'broken-link', label: 'Broken Link Building' },
    { id: 'guest-posting', label: 'Guest Posting' },
    { id: 'digital-pr', label: 'Digital PR' },
    { id: 'analysis', label: 'Link Analysis' },
    { id: 'tools', label: 'Tools & Resources' },
    { id: 'checklist', label: 'Strategy Checklist' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Get Backlinks' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <div className="scrape-progress" aria-hidden="true"><div className="scrape-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="scrape-hero" aria-labelledby="page-title">
          <p className="scrape-kicker">Link Building Mastery</p>
          <h1 id="page-title" className="scrape-title">How to Build Backlinks</h1>
          <p className="scrape-subtitle">The complete guide to earning high-quality backlinks that improve rankings. Learn proven white-hat strategies, outreach tactics, and advanced techniques used by top SEO professionals to dominate Google search results.</p>
          <div className="scrape-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: SEO Link Building Team</span>
            <span>Read time: 60+ minutes</span>
          </div>
          <div className="scrape-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full">
              <a href="#white-hat">View Strategies</a>
            </Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full">
              <a href="#faq">Learn More</a>
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

          <article id="backlinks-content" className="scrape-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="scrape-section">
              <h2>How to Build Backlinks: The Complete 2025 Guide</h2>
              <p>Backlinks are one of Google's top three ranking factors, alongside content quality and website authority. Yet many businesses struggle to build quality backlinks effectively. This comprehensive guide covers everything from foundational concepts to advanced strategies used by elite SEO professionals.</p>
              <p>Whether you're a beginner learning link building basics or an advanced SEO professional seeking to optimize your strategy, you'll find actionable tactics, proven frameworks, and industry best practices that work in 2025. Building high-quality backlinks takes time and effort, but the results—improved rankings, increased organic traffic, and sustainable growth—justify the investment.</p>
              <p>The key to success is understanding what makes backlinks valuable, then systematically building them through strategies that prioritize relevance, authority, and user value. This guide teaches you exactly how to do that.</p>
            </section>

            <section id="what-are" className="scrape-section">
              <h2>What Are Backlinks?</h2>
              <p>A backlink is a link from one website to another. When Website A links to Website B, that link is a backlink for Website B. Backlinks are also called "inbound links" or "incoming links." They are essentially votes of confidence—one website recommending another.</p>
              <p>For example, if a major publication like TechCrunch publishes an article linking to your website, that's a high-value backlink. The link tells search engines: "This website is trustworthy enough that we're recommending it to our readers."</p>

              <h3 className="mt-6 font-semibold">Key Backlink Characteristics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-600" />
                      Domain Authority
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Links from high-authority websites pass more ranking power than links from low-authority sites.</p>
                    <p className="text-xs text-gray-600">A link from Forbes is worth more than a link from a brand-new blog.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      Relevance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Links from topically relevant sites are more valuable than random links from unrelated industries.</p>
                    <p className="text-xs text-gray-600">A link from a fitness blog is more valuable for a gym than a link from a food blog.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-green-600" />
                      Anchor Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>The clickable text of the link. Descriptive anchor text (e.g., "best backlink service") is more valuable than generic text (e.g., "click here").</p>
                    <p className="text-xs text-gray-600">Helps search engines understand what the linked page is about.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Link Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Dofollow links pass ranking power; nofollow links don't, but can still drive traffic and brand awareness.</p>
                    <p className="text-xs text-gray-600">Most valuable links are dofollow from authority sites.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="why-matter" className="scrape-section">
              <h2>Why Backlinks Matter for SEO</h2>
              <p>Google's original algorithm, PageRank, was based on the principle that pages with more high-quality backlinks deserve higher rankings. While Google has evolved to consider 200+ ranking factors, backlinks remain one of the top three most important signals.</p>

              <h3 className="mt-6 font-semibold">The Three Core Benefits of Backlinks</h3>
              <div className="space-y-4 mt-4">
                <Card className="border-l-4 border-emerald-500">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      1. Improved Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Pages with more high-quality backlinks rank higher for competitive keywords. Studies show strong correlation between backlink authority/relevance and top search positions.</CardContent>
                </Card>

                <Card className="border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      2. Increased Organic Traffic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Higher rankings lead directly to more organic search traffic. Additionally, links from popular websites drive direct referral traffic from users clicking the link.</CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      3. Domain Authority & Trust
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Backlinks signal to Google that your website is trustworthy and authoritative. Over time, accumulating high-quality links builds domain authority, making it easier to rank for new content.</CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Backlinks as a Long-Term Investment</h3>
              <p className="mt-2 text-sm">Unlike paid search or ads, the benefits of backlinks compound over time. A backlink you earn today will continue passing value for months or years. This makes backlink building a sustainable, long-term strategy for organic growth.</p>
            </section>

            <section id="types" className="scrape-section">
              <h2>Types of Backlinks: Quality Spectrum</h2>
              <p>Not all backlinks are created equal. Understanding different backlink types helps you prioritize your efforts toward high-value opportunities.</p>

              <h3 className="mt-6 font-semibold">Quality Categories</h3>
              <Tabs defaultValue="tier1" className="mt-4">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="tier1">Tier 1: Premium</TabsTrigger>
                  <TabsTrigger value="tier2">Tier 2: Good</TabsTrigger>
                  <TabsTrigger value="tier3">Tier 3: Weak</TabsTrigger>
                  <TabsTrigger value="avoid">Avoid</TabsTrigger>
                </TabsList>
                <TabsContent value="tier1" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">Tier 1: Premium Backlinks (Highest Value)</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Editorial Links:</strong> Links earned naturally because content is valuable. From reputable publications, news sites, industry leaders.</li>
                      <li><strong>Authority Site Links:</strong> From established, high-authority sites (DA 50+) with strong topical relevance.</li>
                      <li><strong>Brand Mentions:</strong> Links from major brands, universities, government sites, established institutions.</li>
                      <li><strong>Expert/Thought Leader Links:</strong> Links from recognized industry experts and thought leaders.</li>
                    </ul>
                    <p className="text-xs text-emerald-600 mt-2">Example: A link from Harvard Business Review to your business article.</p>
                  </div>
                </TabsContent>
                <TabsContent value="tier2" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">Tier 2: Good Backlinks (Moderate Value)</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Industry Resource Links:</strong> Links from relevant industry directories, databases, and resource pages.</li>
                      <li><strong>Guest Post Links:</strong> Links earned through quality guest contributions on industry blogs.</li>
                      <li><strong>Moderate Authority Links:</strong> Links from established blogs and websites (DA 30-50) with relevant content.</li>
                      <li><strong>Partnership Links:</strong> Links from partner businesses and complementary services.</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">Example: A guest post on a respected industry blog linking back to your site.</p>
                  </div>
                </TabsContent>
                <TabsContent value="tier3" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">Tier 3: Weak Backlinks (Minimal Value)</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Low Authority Links:</strong> Links from new or low-authority sites (DA under 20) with minimal traffic.</li>
                      <li><strong>Directory Links:</strong> Links from general business directories and citation sites.</li>
                      <li><strong>Comment Links:</strong> Links from blog comments or forum signatures (often marked nofollow).</li>
                      <li><strong>Reciprocal Links:</strong> "You link to me, I'll link to you" arrangements with minimal editorial value.</li>
                    </ul>
                    <p className="text-xs text-amber-600 mt-2">Better than nothing, but shouldn't be your focus.</p>
                  </div>
                </TabsContent>
                <TabsContent value="avoid" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">AVOID: Links That Harm Your SEO</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Purchased Links:</strong> Buying links violates Google's guidelines (though quality backlink services provide high-quality links ethically).</li>
                      <li><strong>Spam Links:</strong> Links from link farms, private blog networks (PBNs), and spammy directories.</li>
                      <li><strong>Automated Links:</strong> Links from automated submission tools and low-quality link directories.</li>
                      <li><strong>Exact Match Anchor Spam:</strong> Excessive use of exact-match anchor text (e.g., all links using "how to build backlinks").</li>
                      <li><strong>Cross-Site Linking Schemes:</strong> Unnatural patterns of reciprocal or cross-site linking.</li>
                    </ul>
                    <p className="text-xs text-red-600 mt-2">These can result in manual penalties or algorithm penalties from Google.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <section id="white-hat" className="scrape-section">
              <h2>White-Hat Link Building Strategies (Ethical & Effective)</h2>
              <p>White-hat link building focuses on earning links through valuable content, genuine relationships, and strategies that benefit the linking website's audience. These strategies take longer but build sustainable, penalty-resistant authority.</p>

              <h3 className="mt-6 font-semibold">The 7 Highest-ROI White-Hat Strategies</h3>
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">1. Original Research & Data</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Create original research, surveys, or datasets relevant to your industry. When others reference your data, they naturally link to you.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Publish an industry benchmark report; get cited by dozens of articles.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">2. Skyscraper Content</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Find popular, well-linked content in your niche. Create an even better, more</p>
  <p> comprehensive version. Reach out to sites linking to the original, showing them your improved version.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Find a popular "SEO guide" linked by 100 sites. Create a 10,000-word advanced guide. Email the 100 linking sites.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">3. Unlinked Brand Mentions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Monitor brand mentions across the web. Find instances where your brand is</p>
  <p> mentioned without a link. Reach out asking them to add a link. Many will comply.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Find 50 articles mentioning "Backlink Infinity" without linking. Request links.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">4. Resource Page Placement</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Find "best tools" or "resource" pages in your industry. Create tools or resources worth linking to, then request inclusion.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Create a free SEO calculator. Contact 100 "best SEO tools" resource pages requesting inclusion.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">5. Expert Interviews & Quotes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Interview industry experts and publish the content. Experts often link to interviews featuring them, and their audiences discover you.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Interview 10 SEO experts. Each may share and link to the interview.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">6. Infographics & Visual Content</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Create shareable infographics on industry topics. Infographics get shared and linked more than text content.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Create an infographic on "backlink building statistics." It gets linked 20+ times.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">7. Community Engagement & Authority</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Become active in industry communities, forums, and groups. Help people, build authority. People naturally link to trusted community members.</p>
                    <p className="text-xs text-gray-600 mt-1">Example: Answer 100 questions on industry forums. People researching topics find you and link to your site.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="content-marketing" className="scrape-section">
              <h2>Content Marketing as Link Generation</h2>
              <p>The best link building starts with creating content worth linking to. You can't</p>
  <p> earn links to mediocre content, but exceptional content attracts links naturally.</p>

              <h3 className="mt-6 font-semibold">Content Types That Attract Links</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Ultimate Guides (5,000+ words):</strong> Comprehensive, authoritative guides that become go-to resources. Get linked when others cite your comprehensive coverage.</li>
                <li><strong>Original Research:</strong> Surveys, studies, datasets. Publishers cite original research; you get editorial links.</li>
                <li><strong>Tools & Resources:</strong> Free calculators, templates, checkers. Tools get linked from multiple sites naturally.</li>
                <li><strong>Case Studies:</strong> Real examples with results and lessons learned. Case studies get cited in industry discussions.</li>
                <li><strong>Industry Reports:</strong> Comprehensive analysis of industry trends, forecasts, or benchmarks.</li>
                <li><strong>Interactive Content:</strong> Quizzes, assessments, interactive tools. High shareability and link attraction.</li>
                <li><strong>Expert Roundups:</strong> Compile insights from 10-20 industry experts. Experts share, getting you links from their audiences.</li>
              </ul>
            </section>

            <section id="outreach" className="scrape-section">
              <h2>Effective Link Outreach Strategy</h2>
              <p>Creating great content is necessary but not sufficient. You need to actively reach out to</p>
  <p> potential linking websites to earn their links. This is where strategic outreach makes the difference.</p>

              <h3 className="mt-6 font-semibold">The Outreach Process</h3>
              <div className="space-y-3 text-sm mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Step 1: Research & List Building</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Identify 50-100 potential linking targets: competitor backlinks, industry resource pages, relevant blogs, topical directories. Build a prospect list with email contacts.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Step 2: Personalization</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Personalize each outreach email. Reference specific content they've written or published. Generic mass emails have &lt;1% response rates; personalized emails achieve 5-15% response rates.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Step 3: Clear Value Proposition</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Clearly explain why linking to your content benefits THEIR audience. Lead with their benefit, not your need for a link. Example: "This will provide your readers with the most comprehensive guide on X."</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Step 4: Follow-up</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Most people don't respond to first emails. Send 2-3 follow-ups (1-2 weeks apart) to non-responders. Persistence yields 2-3x more links than single emails.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Step 5: Relationship Building</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">When someone links to you, thank them genuinely. Share their content. Build ongoing relationships. Today's linker may refer you to 5 other prospects next month.</CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Example Outreach Email Template</h3>
              <div className="bg-slate-50 p-4 rounded-lg text-sm mt-3 border border-slate-200">
                <p className="mb-2"><strong>Subject: Your readers will love this [topic] resource</strong></p>
                <p className="mb-2">Hi [Name],</p>
                <p className="mb-2">I came across your excellent article "[Article Title]" last week. Your section on [specific point] is the best explanation I've seen published.</p>
                <p className="mb-2">I've just published a comprehensive guide on [related topic] that complements your work perfectly. Your readers would benefit from it because [specific reason].</p>
                <p className="mb-2">If you think it's worth linking to, I'd be grateful. Either way, I admire your work.</p>
                <p>Best,<br />
                [Your Name]</p>
              </div>
            </section>

            <section id="resource-links" className="scrape-section">
              <h2>Resource Pages and Directories</h2>
              <p>Resource pages and industry directories are goldmines for link building. These</p>
  <p> curated lists exist specifically to link to valuable resources, making them perfect targets.</p>

              <h3 className="mt-6 font-semibold">How to Get on Resource Pages</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Find Resource Pages:</strong> Search "[your industry] + resources" or "[your industry] + tools" or "best [service]"</li>
                <li><strong>Evaluate Relevance:</strong> Make sure the resource page is topically relevant and high-quality (visit the page, check domain authority)</li>
                <li><strong>Create Linkable Content:</strong> If you don't have appropriate content to link to, create it first (tool, guide, template, etc.)</li>
                <li><strong>Reach Out to Curators:</strong> Email the resource page owner/curator, introducing yourself and your resource, explaining why it belongs on their page</li>
                <li><strong>Make Their Job Easy:</strong> Provide exact anchor text and URL they should use. Make link inclusion effortless.</li>
              </ul>
            </section>

            <section id="broken-link" className="scrape-section">
              <h2>Broken Link Building (Advanced)</h2>
              <p>Broken link building is a high-ROI technique where you find broken links on authority</p>
  <p> sites, create replacement content, and reach out asking them to link to your content instead.</p>

              <h3 className="mt-6 font-semibold">The Broken Link Building Process</h3>
              <div className="space-y-3 text-sm mt-4">
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Find Broken Links:</strong> Use tools like Ahrefs or SEMrush to scan high-authority competitor sites for 404s</li>
                  <li><strong>Analyze Link Context:</strong> Understand what the broken link was about and why it was linked</li>
                  <li><strong>Create Replacement:</strong> Create content similar to the broken link (or better), addressing the same topic</li>
                  <li><strong>Reach Out:</strong> Contact the site owner, alert them to the broken link, offer your content as a replacement</li>
                  <li><strong>Monitor Results:</strong> Track which outreach efforts result in links</li>
                </ol>
              </div>

              <h3 className="mt-6 font-semibold">Tools for Broken Link Finding</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li><strong><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs</a></strong> – Broken link audits and backlink analysis</li>
                <li><strong><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush</a></strong> – Site audit finding broken links</li>
                <li><strong><a href="https://www.screaming-frog.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Screaming Frog</a></strong> – Crawl sites to find broken links</li>
              </ul>
            </section>

            <section id="guest-posting" className="scrape-section">
              <h2>Guest Posting Strategy</h2>
              <p>Guest posting involves writing articles for other websites in exchange for a link back to your site. When done right, guest posts provide three benefits: a backlink, authority building through byline, and referral traffic from readers.</p>

              <h3 className="mt-6 font-semibold">Guest Posting Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Target Quality Sites:</strong> Write for established, relevant sites with good traffic (not low-quality blog networks)</li>
                <li><strong>Provide Value First:</strong> Write genuinely helpful content for their audience, not just to get a link</li>
                <li><strong>Follow Guidelines:</strong> Respect their editorial standards, submission requirements, and preferred topics</li>
                <li><strong>Natural Link Placement:</strong> Include 1-2 contextual links in the article where they make sense, not forced links</li>
                <li><strong>Promote After Publishing:</strong> Share the guest post to amplify reach and demonstrate value to the host</li>
              </ul>

              <h3 className="mt-6 font-semibold">Finding Guest Posting Opportunities</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li>Search "[industry] + guest post" or "[industry] + write for us"</li>
                <li>Use Ahrefs' content explorer to find popular articles in your niche, contact those authors</li>
                <li>Build relationships with editors in your industry; they'll commission guest posts</li>
              </ul>
            </section>

            <section id="digital-pr" className="scrape-section">
              <h2>Digital PR and Earned Media</h2>
              <p>Digital PR focuses on earning media coverage, press mentions, and news links through</p>
  <p> compelling stories, newsjacking, and relationship building with journalists and bloggers.</p>

              <h3 className="mt-6 font-semibold">Digital PR Tactics for Links</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Press Releases:</strong> Announce company milestones, research releases, or timely news to media</li>
                <li><strong>Newsjacking:</strong> React quickly to trending topics with relevant, expert commentary</li>
                <li><strong>Expert Positioning:</strong> Become a go-to expert for media inquiries. Media outlets link to featured experts.</li>
                <li><strong>Media Relationships:</strong> Build relationships with journalists in your industry. They'll turn to you for quotes and features.</li>
                <li><strong>Sponsorships:</strong> Sponsor relevant industry events or awards programs. Get links from event coverage.</li>
              </ul>

              <h3 className="mt-6 font-semibold">Press Release Distribution</h3>
              <p className="mt-2 text-sm">Services like <a href="https://www.prweb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PR Web</a> and <a href="https://www.einnews.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EIN News</a> distribute press releases to journalists and media outlets, increasing chances of media coverage and links.</p>
            </section>

            <section id="analysis" className="scrape-section">
              <h2>Link Analysis and Competitor Intelligence</h2>
              <p>Understanding your competitors' backlinks reveals link building opportunities you might</p>
  <p> miss. Where are your competitors getting links? Can you pursue those same opportunities?</p>

              <h3 className="mt-6 font-semibold">Analyzing Competitor Backlinks</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Find Competitor Backlinks:</strong> Use Ahrefs or Semrush to see all backlinks pointing to top-ranking competitors</li>
                <li><strong>Filter by Quality:</strong> Focus on high-quality backlinks (domain authority 30+, relevant sites)</li>
                <li><strong>Identify Patterns:</strong> Look for types of sites linking to competitors: industry directories, blogs, publications</li>
                <li><strong>Evaluate Your Opportunity:</strong> Can you create similar or better content to earn links from those same sources?</li>
                <li><strong>Create Outreach List:</strong> Build a prospect list from high-quality competitor backlinks</li>
              </ul>

              <h3 className="mt-6 font-semibold">Key Metrics to Track</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li><strong>Number of Backlinks:</strong> Total quantity (quality-adjusted)</li>
                <li><strong>Referring Domains:</strong> How many unique websites link to you</li>
                <li><strong>Domain Authority:</strong> Average authority of sites linking to you</li>
                <li><strong>Link Velocity:</strong> How many new links you earn per month</li>
                <li><strong>Anchor Text Profile:</strong> What keywords your backlinks use as anchor text</li>
              </ul>
            </section>

            <section id="tools" className="scrape-section">
              <h2>Essential Link Building Tools</h2>
              <p>Professional link building requires tools for research, outreach, analysis, and tracking. Here are the essential platforms:</p>

              <h3 className="mt-6 font-semibold">Backlink Research & Analysis</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs</a></strong> – Best-in-class backlink research, competitor analysis, broken link finding, content explorer</li>
                <li><strong><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush</a></strong> – Comprehensive backlink analysis, competitor research, site audits</li>
                <li><strong><a href="https://moz.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moz Pro</a></strong> – Domain authority metrics, backlink research, rank tracking</li>
                <li><strong><a href="https://www.majestic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Majestic</a></strong> – Comprehensive link data, citation flow metrics</li>
              </ul>

              <h3 className="mt-6 font-semibold">Outreach & Prospecting</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.pitchbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pitchbox</a></strong> – Influencer and journalist outreach with email finding and tracking</li>
                <li><strong><a href="https://www.contactout.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ContactOut</a></strong> – Find contact information for journalists and webmasters</li>
                <li><strong><a href="https://www.hunter.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hunter.io</a></strong> – Find email addresses for domain contacts</li>
              </ul>

              <h3 className="mt-6 font-semibold">Monitoring & Tracking</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Search Console</a></strong> – See backlinks Google has indexed for your site</li>
                <li><strong><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs Rank Tracker</a></strong> – Track new backlinks and monitor link profile changes</li>
              </ul>
            </section>

            <section id="checklist" className="scrape-section">
              <h2>Link Building Strategy Checklist</h2>
              <p>Use this checklist to ensure your link building strategy is comprehensive and effective:</p>

              <div className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Website is technically sound (fast, mobile-optimized, crawlable)</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Content is original, valuable, and comprehensive</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> On-page SEO is optimized (titles, metas, headings, schema)</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> You have established <a href="/technical-seo-audit" className="text-blue-600 hover:underline">technical SEO foundation</a></p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Content Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Created 3+ comprehensive guides worth linking to</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Developed original research or data</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Built interactive tools or resources</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Published case studies with results</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Link Building Tactics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Analyzed competitor backlinks (Ahrefs/Semrush)</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Created outreach lists (50-100 prospects minimum)</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Launched skyscraper content campaign</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Pursued guest posting opportunities</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Performed broken link building on authority sites</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Submitted to industry resource pages</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Monitoring & Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Track new backlinks monthly via Google Search Console</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Monitor ranking improvements for target keywords</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Identify and disavow toxic/low-quality links</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Analyze which outreach tactics convert best</p>
                    <p className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Plan next quarter's link building activities</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="case-studies" className="scrape-section">
              <h2>Link Building Case Studies: Real Results</h2>

              <div className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tech SaaS: Systematic Link Building</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> New SaaS product in a crowded market with low domain authority and no backlinks.</p>
                    <p><strong>Strategy:</strong> Created comprehensive buyer's guide (5,000+ words), skyscraper content outreach to 80 prospects, guest posts on 5 authority sites, expert roundup featuring 15 industry experts.</p>
                    <p><strong>Results:</strong> 23 high-quality backlinks earned in 6 months. Keywords improved from page 10+ to positions 3-7. Organic traffic increased 340%. New customer inquiries doubled.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>E-Commerce: Resource Page Dominance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> Competing with established brands, needed quick ranking improvements for competitive keywords.</p>
                    <p><strong>Strategy:</strong> Built interactive buying guides and comparison tools. Identified 120 "best of" and "resource" pages in the niche. Systematically reached out requesting inclusion.</p>
                    <p><strong>Results:</strong> 41 links from relevant resource pages. Keyword rankings improved significantly. Search traffic increased 215% in 6 months.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Digital Agency: PR-Driven Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> Needed rapid authority building to compete for high-value keywords.</p>
                    <p><strong>Strategy:</strong> Positioned founder as thought leader through press releases, industry interviews, and expert commentary on trending topics. Built relationships with 20+ journalists.</p>
                    <p><strong>Results:</strong> Featured in 8 major publications. 15 editorial links from high-authority sites. Domain authority increased from 22 to 41 in 12 months.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="faq" className="scrape-section">
              <h2>Link Building FAQ</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>How many backlinks do I need to rank on Google?</AccordionTrigger>
                  <AccordionContent>
                    Quality far exceeds quantity. 10-15 high-authority, relevant backlinks often outperform 100+ low-quality links. For competitive keywords, you may need 50-100+ quality links. Monitor your competitors' backlink counts and target similar numbers, focusing on higher authority sources.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2">
                  <AccordionTrigger>How long does it take to see ranking improvements from backlinks?</AccordionTrigger>
                  <AccordionContent>
                    Google typically crawls and indexes new backlinks within 1-4 weeks. Ranking improvements usually appear within 1-3 months, though it may take 6+ months for significant movements on competitive keywords. Consistency matters more than speed—ongoing link building yields compounding results over time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3">
                  <AccordionTrigger>Should I buy backlinks?</AccordionTrigger>
                  <AccordionContent>
                    Buying low-quality links violates Google's guidelines and risks manual penalties. However, legitimate services like Backlink Infinity offer high-quality backlinks from authoritative sources that comply with Google's guidelines. The key is purchasing from reputable providers who deliver genuine, editorially-placed links, not spammy link farms.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4">
                  <AccordionTrigger>Are nofollow links worthless?</AccordionTrigger>
                  <AccordionContent>
                    Nofollow links don't pass direct ranking power, but they're not worthless. They drive referral traffic, build brand awareness, and contribute to a natural link profile. A healthy link profile includes a mix of dofollow and nofollow links. Too many nofollow links looks unnatural, but some are beneficial.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5">
                  <AccordionTrigger>How do I know if a backlink is helping my SEO?</AccordionTrigger>
                  <AccordionContent>
                    Monitor metrics in Google Search Console (new backlinks), Ahrefs (domain authority changes, keyword ranking improvements), and organic traffic trends. Links from high-authority, relevant sites have the biggest impact. Over time, quality link building correlates strongly with improved rankings and organic traffic.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6">
                  <AccordionTrigger>Can I disavow bad backlinks?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Use Google Search Console's Disavow Links tool to tell Google to ignore specific backlinks. This is useful if you acquire a site with spammy backlinks or if your site is targeted by negative SEO. However, disavow sparingly—most links don't hurt, and excessive disavowing can signal a problem to Google.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Get High-Quality Backlinks From Backlink ∞"
                description="Stop struggling with link building. Backlink ∞ provides high-quality, authoritative backlinks from real, relevant websites. Our ethical link building service accelerates your rankings for competitive keywords without the time and effort of manual outreach. Get the backlinks you need to dominate Google search results. Partner with Backlink ∞ today."
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
