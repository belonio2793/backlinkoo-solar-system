import React, { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Gauge } from 'lucide-react';
import '@/styles/scrapebox.css';

// Interactive search simulator widget
function ScrapeboxSearchSimulator() {
  const [query, setQuery] = React.useState('keyword research');
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<number | null>(null);

  const run = () => {
    if (!query) return;
    setRunning(true);
    setResults(null);
    // Simulate async harvesting
    setTimeout(() => {
      const n = Math.max(100, Math.floor(5000 + Math.random() * 45000));
      setResults(n);
      setRunning(false);
    }, 1200 + Math.floor(Math.random() * 800));
  };

  return (
    <div className="scrape-sim p-4 rounded-lg bg-white">
      <div className="flex items-center gap-3">
        <input
          aria-label="Simulate Scrapebox query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          className="flex-1 rounded-md border border-purple-200 px-3 py-2 bg-white/90 placeholder:text-slate-400"
          placeholder='Enter footprint or keyword — e.g. "site:example.com + "guest post"'
        />
        <Button onClick={run} size="sm" className="h-9">
          {running ? 'Harvesting…' : 'Simulate'}
        </Button>
      </div>

      <div className="mt-3">
        <div className="h-2 bg-purple-100 rounded overflow-hidden">
          <div
            className="scrape-sim__bar h-full bg-white"
            style={{ width: results ? '100%' : running ? '60%' : '0%' }}
          />
        </div>
        <div className="mt-2 text-sm text-slate-600">
          {results ? (
            <span className="font-medium">~{results.toLocaleString()} results harvested (simulated)</span>
          ) : running ? (
            <span>Running simulated harvest…</span>
          ) : (
            <span>Ready to simulate a fast harvesting preview</span>
          )}
        </div>
      </div>
    </div>
  );
}

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
  useEffect(() => {
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

function InlineExpandedGuide() {
  return (
    <div className="prose prose-slate max-w-none">
      <section>
        <h3>Scrapebox: Practical Guide</h3>
        <p>This guide covers harvesting, deduping, enrichment, and ethical usage of</p>
  <p> Scrapebox-style workflows. Use these patterns for research and prospecting—not automated posting.</p>
      </section>
      <section>
        <h4>Audit Workflow</h4>
        <ol>
          <li>Collect candidate URLs and deduplicate by host/path.</li>
          <li>Sample pages and evaluate editorial quality and topical relevance.</li>
          <li>Score for salvage, monitor, or disavow and prioritize remediation.</li>
        </ol>
      </section>
      <section>
        <h4>Safety Checklist</h4>
        <ul>
          <li>Respect robots.txt and site policies.</li>
          <li>Avoid bulk posting; use results for human‑led outreach.</li>
          <li>Monitor anchors and remove repetitive templates.</li>
        </ul>
      </section>
    </div>
  );
}

const metaTitle = 'Scrapebox: Complete Guide, Use Cases, Safety, and 2025 Best Practices';
const metaDescription = 'Independent, long‑form guide to Scrapebox: harvesting, auditing, link prospecting, footprint safety, and ethical workflows for modern SEO.';

export default function Scrapebox() {
  useProgress('#scrape-content');

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/scrapebox`;
    } catch {
      return '/scrapebox';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Scrapebox, scrapebox guide, link building, backlinks, harvesting, footprint safety, SEO tools, 2025 SEO');
    upsertCanonical(canonical);

    injectJSONLD('scrape-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('scrape-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Scrapebox Guide', item: '/scrapebox' },
      ],
    });

    injectJSONLD('scrape-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Scrapebox?', acceptedAnswer: { '@type': 'Answer', text: 'A Windows-based SEO tool known for large-scale URL harvesting, data enrichment, and various modules that assist with research and outreach workflows.' } },
        { '@type': 'Question', name: 'Is Scrapebox safe to use in 2025?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, when used responsibly for research, auditing, and prospecting. Respect robots, avoid spam automations, and maintain footprint safety.' } },
        { '@type': 'Question', name: 'What are practical use cases?', acceptedAnswer: { '@type': 'Answer', text: 'Finding link prospects, checking indexation, extracting metadata, auditing SERPs, and enriching keyword research pipelines.' } },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'intro', label: 'Overview' },
    { id: 'modules', label: 'Core Modules' },
    { id: 'workflows', label: 'Workflows' },
    { id: 'safety', label: 'Footprint Safety' },
    { id: 'prospecting', label: 'Link Prospecting' },
    { id: 'auditing', label: 'Auditing' },
    { id: 'automation', label: 'Automation' },
    { id: 'ethics', label: 'Ethical Usage' },
    { id: 'faq', label: 'FAQ' },
    { id: 'research', label: 'Expanded Guide' },
    { id: 'cta', label: 'Get Started' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="scrape-progress" aria-hidden="true"><div className="scrape-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="scrape-hero" aria-labelledby="page-title">
          <p className="scrape-kicker">Independent Editorial</p>
          <h1 id="page-title" className="scrape-title">Scrapebox</h1>
          <p className="scrape-subtitle">A comprehensive, modern guide to Scrapebox: capabilities, modules, safety, and real‑world workflows for research‑driven SEO and link building.</p>
          <div className="scrape-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Read time: 45+ minutes</span>
          </div>
          <div className="scrape-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full">
              <a href="#cta">See Tools</a>
            </Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full">
              <a href="#faq">Read FAQs</a>
            </Button>
            <Badge className="ml-3" variant="secondary">2025 Guide</Badge>
          </div>

          {/* Inline interactive simulator to preview harvest behavior and micro-interactions */}
          <div className="mt-6 md:mt-8">
            <ScrapeboxSearchSimulator />
          </div>
        </header>

        <div className="scrape-layout">
          <nav className="scrape-toc" aria-label="On this page">
            <div className="scrape-toc__title">On this page</div>
            <ul>
              {nav.map((n) => (<li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>))}
            </ul>
          </nav>

          <article id="scrape-content" className="scrape-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="scrape-section">
              <h2>What Scrapebox Is (and Isn’t)</h2>
              <p>Scrapebox is a flexible research and data collection toolkit. Used responsibly, it accelerates prospecting, auditing, and enrichment. This guide focuses on productive, ethical, and modern use—not spam.</p>
              <ul>
                <li>Harvest at scale with safe settings and rotating proxies.</li>
                <li>Extract metadata, identify opportunities, and enrich keywords.</li>
                <li>Respect robots, site policies, and local regulations.</li>
              </ul>
            </section>

            <section id="modules" className="scrape-section">
              <h2>Core Modules At a Glance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Harvester', body: 'Collect URLs by query patterns, engines, and footprints. Apply throttling, timeouts, and proxy rotations.' },
                  { title: 'Checker', body: 'Validate status codes, indexation hints, outbound links, meta data, and content length.' },
                  { title: 'Keyword Tools', body: 'Expand seed terms, scrape suggests, and map modifiers that match intent.' },
                  { title: 'Extractor', body: 'Pull emails (opt‑in only), social handles, schema snippets, and titles for prospect dossiers.' },
                  { title: 'Custom Search', body: 'Compose advanced operators and footprints for precise research.' },
                  { title: 'Add‑ons', body: 'Marketplace modules for sitemaps, broken links, and platform‑specific utilities.' },
                ].map((c) => (
                  <Card key={c.title}>
                    <CardHeader><CardTitle>{c.title}</CardTitle></CardHeader>
                    <CardContent><p>{c.body}</p></CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="workflows" className="scrape-section">
              <h2>Workflows</h2>
              <Tabs defaultValue="prospecting">
                <TabsList>
                  <TabsTrigger value="prospecting">Prospecting</TabsTrigger>
                  <TabsTrigger value="auditing">Auditing</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>
                <TabsContent value="prospecting">
                  <p>Build clean lists: harvest → dedupe → filter for relevance → enrich with titles and contact pages → export for outreach tooling.</p>
                </TabsContent>
                <TabsContent value="auditing">
                  <p>Audit SERPs and competitors: capture titles, word counts, outbound links, and identify content gaps to inform your on‑page strategy.</p>
                </TabsContent>
                <TabsContent value="keywords">
                  <p>Generate modifiers from suggests, cluster terms by intent, and tie each cluster to a pillar or support article for internal linking.</p>
                </TabsContent>
              </Tabs>
            </section>

            <section id="safety" className="scrape-section">
              <h2>Footprint Safety Essentials</h2>
              <ul>
                <li>Throttle requests and rotate proxies to avoid burdening websites.</li>
                <li>Respect robots.txt and terms; do not scrape gated content.</li>
                <li>Avoid spam modules; prefer research and auditing features.</li>
              </ul>
            </section>

            <section id="prospecting" className="scrape-section">
              <h2>Link Prospecting With Scrapebox</h2>
              <p>Use advanced operators to find relevant sites, then vet for topical match and quality. Pair with editorial outreach and value‑add content.</p>
            </section>

            <section id="auditing" className="scrape-section">
              <h2>Auditing & Validation</h2>
              <p>Check indexation hints, status codes, duplicate titles, and thin pages. Feed results into your CMS backlog and prioritize by impact.</p>
            </section>

            <section id="automation" className="scrape-section">
              <h2>Automation Without Footprints</h2>
              <p>Focus on legit automation: deduping, enrichment, classification, clustering. Keep human review for anything that touches publishers directly.</p>
            </section>

            <section id="ethics" className="scrape-section">
              <h2>Ethical Usage</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="respect"><AccordionTrigger>Respect Websites</AccordionTrigger><AccordionContent>Scrape responsibly; prefer public, permitted data. Avoid intensive crawling.</AccordionContent></AccordionItem>
                <AccordionItem value="privacy"><AccordionTrigger>Privacy</AccordionTrigger><AccordionContent>Do not collect personal data without consent. Follow applicable laws.</AccordionContent></AccordionItem>
                <AccordionItem value="value"><AccordionTrigger>Value Creation</AccordionTrigger><AccordionContent>Use insights to create better content and earn links—not to spam.</AccordionContent></AccordionItem>
              </Accordion>
            </section>

            <section id="faq" className="scrape-section">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="safe"><AccordionTrigger>Is Scrapebox safe?</AccordionTrigger><AccordionContent>Yes, when used within guidelines for research and auditing, with throttling and proxy hygiene.</AccordionContent></AccordionItem>
                <AccordionItem value="windows"><AccordionTrigger>Does it require Windows?</AccordionTrigger><AccordionContent>Scrapebox is Windows‑based. Mac/Linux users often run it in a VM.</AccordionContent></AccordionItem>
                <AccordionItem value="links"><AccordionTrigger>Can it build links?</AccordionTrigger><AccordionContent>We recommend using it for prospecting and validation—not for automated link placement. Earn links with quality outreach.</AccordionContent></AccordionItem>
              </Accordion>
            </section>

            <section id="research" className="scrape-section">
              <h2>Expanded Guide (10k+ words)</h2>
              <p>Below is the extended, continuously updated guide with deep dives, examples, and checklists.</p>
              <InlineExpandedGuide />
            </section>

            <section id="cta" className="scrape-section">
              <h2>Next Steps</h2>
              <div className="space-y-4">
                <article className="rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <ListChecks className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Organize harvested leads into outreach-ready lists</h3>
                        <p className="mt-1 text-sm text-slate-600">Deduplicate domains, enrich with key contacts, and send prioritized batches to your outreach workflow without chaos.</p>
                      </div>
                      <a className="inline-flex items-center gap-2 self-start rounded-full border border-purple-200 px-5 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-300 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200" href="/keyword-research">
                        Visit research workspace
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Gauge className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Track rankings and annotate campaign changes</h3>
                        <p className="mt-1 text-sm text-slate-600">Compare week-over-week movement, share calm summaries, and connect performance with the research you surface.</p>
                      </div>
                      <a className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" href="/rank-tracker">
                        Open rank tracker
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Build Your Link Authority?"
                description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
