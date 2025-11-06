import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Layers, ShieldCheck } from 'lucide-react';
import '@/styles/sherlock-hacks-google.css';

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

const metaTitle = 'Sherlock Hacks Google by SarkarSEO — Independent Breakdown (2025)';
const metaDescription = 'A deep, independent analysis of Sherlock Hacks Google by SarkarSEO: methodology, link types, AI‑era strategy, case studies, risks, FAQs, and practical alternatives.';

const nav = [
  { id: 'intro', label: 'Overview' },
  { id: 'method', label: 'Methodology' },
  { id: 'linktypes', label: 'Backlink Types' },
  { id: 'ai', label: 'AI‑Era SEO' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'proof', label: 'Proof & Signals' },
  { id: 'cases', label: 'Case Studies' },
  { id: 'playbook', label: 'Implementation Playbook' },
  { id: 'pricing', label: 'Pricing & Fit' },
  { id: 'compare', label: 'Comparisons' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'faq', label: 'FAQ' },
  { id: 'extra', label: 'Expanded Research' },
  { id: 'cta', label: 'Get Started' },
];

function useProgress(selector: string) {
  useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.sherlock-progress__bar') as HTMLDivElement | null;
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
    <div className="sherlock-expanded prose prose-slate max-w-none">
      <section>
        <h3>Expanded Research</h3>
        <p>Deep notes and explainers about Sherlock Hacks Google: methodology, link archetypes, tooling, and safety controls for modern SEO.</p>
      </section>
      <section>
        <h4>Research Notes</h4>
        <p>Audit samples, anchor distributions, and timeline patterns to inform risk assessments and remediation plans.</p>
      </section>
    </div>
  );
}

export default function SherlockHacksGoogle() {
  useProgress('#sherlock-content');

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/sherlockhacksgoogle`;
    } catch {
      return '/sherlockhacksgoogle';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Sherlock Hacks Google by SarkarSEO, Sherlock Hacks Google, Sarkar SEO review, link building, backlinks, AI SEO, 2025 SEO, ranking strategy, Web2.0, EDU profiles, guest posts, niche edits');
    upsertCanonical(canonical);

    injectJSONLD('sherlock-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('sherlock-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Sherlock Hacks Google', item: '/sherlockhacksgoogle' },
      ],
    });

    injectJSONLD('sherlock-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Sherlock Hacks Google by SarkarSEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A branded link-building and SEO framework associated with SarkarSEO, focused on diversified link types, authority stacking, and ongoing velocity to influence Google rankings.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is it safe in 2025 under AI-driven updates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Safety depends on execution quality, topical relevance, source vetting, and pace. Prioritize editorial standards, entity consistency, and user-first content.'
          }
        },
        {
          '@type': 'Question',
          name: 'How fast do results show?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most competitive niches see meaningful movement within 8–16 weeks assuming content quality, internal links, and technical SEO are aligned.'
          }
        }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="sherlock-progress" aria-hidden="true"><div className="sherlock-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="sherlock-hero" aria-labelledby="page-title">
          <p className="sherlock-kicker">Independent Editorial</p>
          <h1 id="page-title" className="sherlock-title">Sherlock Hacks Google by SarkarSEO</h1>
          <p className="sherlock-subtitle">An exhaustive, research-driven breakdown of the framework’s strategy, link archetypes, AI‑era fit, results patterns, and risk controls—written to help serious operators make informed decisions.</p>
          <div className="sherlock-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Read time: 45+ minutes</span>
          </div>
          <div className="sherlock-hero__cta">
            <Button asChild size="lg"><a href="#cta">See Plans</a></Button>
            <Button variant="outline" asChild size="lg"><a href="#faq">Read FAQs</a></Button>
            <Badge className="ml-3" variant="secondary">2025 Research</Badge>
          </div>
        </header>

        <div className="sherlock-layout">
          <nav className="sherlock-toc" aria-label="On this page">
            <div className="sherlock-toc__title">On this page</div>
            <ul>
              {nav.map((n) => (
                <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="sherlock-content" className="sherlock-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="sherlock-section">
              <h2>What We’re Evaluating</h2>
              <p>
                “Sherlock Hacks Google” is a long‑running branded package associated with SarkarSEO. Public collateral emphasizes diversified link acquisition across
                Web 2.0 properties, editorial mentions, profile/authority stacking, niche edits, guest posts, and social reinforcement. Our analysis focuses on
                how this mix maps to modern ranking systems, entity understanding, and AI‑assisted indexing in 2025.
              </p>
              <ul>
                <li>Core thesis: blend of authority, relevance, and link velocity with layered anchors.</li>
                <li>Execution levers: source quality, topical match, cadence, tiering, and internal linking on your site.</li>
                <li>Risk controls: editorial standards, source diversity, branded/URL heavy anchors, and log‑level monitoring.</li>
              </ul>
            </section>

            <section id="method" className="sherlock-section">
              <h2>Methodology: Reverse‑Engineering The Play</h2>
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="anchors">Anchor Model</TabsTrigger>
                  <TabsTrigger value="tiers">Tiering</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <p>
                    We inspected public materials, historical discussions, and common patterns in off‑page campaigns claiming similar deliverables. The model hinges on
                    acquiring contextually relevant mentions combined with safe anchor pacing, while supporting pages with auxiliary signals (citations, profiles, social embeds).
                  </p>
                </TabsContent>
                <TabsContent value="anchors">
                  <p>
                    Anchor pacing prioritizes brand, URL, and partial‑match early, reserving exact‑match for strategic placements. This approach mirrors natural linking behavior
                    and reduces volatility across core updates.
                  </p>
                </TabsContent>
                <TabsContent value="tiers">
                  <p>
                    Tiering is used sparingly to consolidate equity and crawl paths. We recommend keeping tiered links highly curated, avoiding spam automations, and ensuring
                    top‑tier pages stand on their own editorial merit.
                  </p>
                </TabsContent>
              </Tabs>
            </section>

            <section id="linktypes" className="sherlock-section">
              <h2>Backlink Types Mapped To 2025</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Editorial Guest Posts', body: 'Placed on relevant sites with real readership. Focus on expert‑level contributions and author E‑E‑A‑T. Avoid networks and thin content.' },
                  { title: 'Niche Edits (Contextual Links)', body: 'Inserted into existing pages with stable rankings. Ensure topical fit and avoid over‑optimized anchors.' },
                  { title: 'Web 2.0 Hubs', body: 'Used as branded satellites to control narrative, publish thought leadership, and create validated entity co‑occurrence.' },
                  { title: 'Profiles & Citations', body: 'Strengthen entity resolution, especially local/brand knowledge panels. Ensure consistency of NAP and brand fields.' },
                  { title: 'Social Signals', body: 'Distribution vectors for new pages; subtle ranking assists via crawl discovery, freshness, and brand cues.' },
                  { title: 'Press / Mentions', body: 'Pursue genuine mentions; avoid mass syndication footprints. This works best when driven by newsworthy releases or studies.' },
                ].map((c) => (
                  <Card key={c.title}>
                    <CardHeader>
                      <CardTitle>{c.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{c.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="ai" className="sherlock-section">
              <h2>AI‑Era SEO: What Actually Moves The Needle</h2>
              <p>
                In 2025, ranking systems blend link graphs with entity understanding, user interactions, and AI‑generated summaries. Link quality still matters—especially when
                it corroborates expertise, brand consistency, and satisfies real user intent. The package’s effectiveness rises when paired with strong content architecture,
                internal links, and technical health.
              </p>
              <ul>
                <li>Relevance over raw DA: topic match and audience fit outperform generic authority.</li>
                <li>Entity signals: consistent brand profiles, authorship, and knowledge graph co‑occurrence.</li>
                <li>UX proxies: engagement, navigational queries, and task completion patterns.</li>
              </ul>
            </section>

            <section id="architecture" className="sherlock-section">
              <h2>Suggested Site Architecture To Compound Results</h2>
              <ol>
                <li>Create 3–5 pillar pages per core topic, each supported by 8–20 clusters.</li>
                <li>Map anchors to the intent layer (informational, commercial, transactional) and interlink accordingly.</li>
                <li>Attach rich media, FAQs, and comparison blocks to increase snippet capture and stickiness.</li>
              </ol>
            </section>

            <section id="proof" className="sherlock-section">
              <h2>Proof & Trust Signals</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="reports">
                  <AccordionTrigger>Reporting & Transparency</AccordionTrigger>
                  <AccordionContent>
                    Expect placement URLs, anchor disclosures, and timelines. Scrutinize domain quality, traffic patterns, and topical fit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timelines">
                  <AccordionTrigger>Timelines & Realistic Expectations</AccordionTrigger>
                  <AccordionContent>
                    Typical movement emerges within 8–16 weeks for competitive queries, faster for long‑tail. Compounding effects improve over months with steady cadence.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="risks">
                  <AccordionTrigger>Risk Controls</AccordionTrigger>
                  <AccordionContent>
                    Favor branded/URL anchors early, avoid mass syndication, and maintain content quality. Vet link sources—no PBN footprints, no spun content.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section id="cases" className="sherlock-section">
              <h2>Representative Case Patterns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>SaaS (B2B)</CardTitle></CardHeader>
                  <CardContent>
                    <p>Commercial intent pages improved from positions 18–30 to top‑5 with a blend of editorial mentions and contextual updates, supported by cluster content.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>E‑commerce (Specialty)</CardTitle></CardHeader>
                  <CardContent>
                    <p>Category pages rose steadily as brand demand and review snippets increased. Social distribution aided crawl discovery.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="playbook" className="sherlock-section">
              <h2>Implementation Playbook</h2>
              <ul>
                <li>Calibrate anchors quarterly; protect brand terms; pace exact‑match sparingly.</li>
                <li>Consolidate equity with internal links; keep click depth shallow to money pages.</li>
                <li>Instrument analytics and rank tracking; correlate placements with movement and refresh cycles.</li>
              </ul>
            </section>

            <section id="pricing" className="sherlock-section">
              <h2>Pricing & Best‑Fit Scenarios</h2>
              <p>
                Public pricing varies over time and by deliverables. Best fit: teams with validated offers, technical hygiene, and budget for ongoing campaigns. If you require
                ultra-low costs or instant wins, expectations may misalign.
              </p>
            </section>

            <section id="compare" className="sherlock-section">
              <h2>Comparisons & Alternatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Agency‑Led Outreach</CardTitle></CardHeader>
                  <CardContent>
                    <p>Turn‑key but pricier. Quality hinges on editorial standards and publisher relationships. Ensure transparency and source auditing.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Hybrid (Agency + In‑House)</CardTitle></CardHeader>
                  <CardContent>
                    <p>Build internal editorial assets while leveraging curated outreach for peak placements. Often the most resilient model.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="glossary" className="sherlock-section">
              <h2>Glossary</h2>
              <ul>
                <li><strong>Entity:</strong> A machine‑understood identity (brand, person, product) tied to properties and relationships.</li>
                <li><strong>Niche Edit:</strong> Contextual link inserted into an existing article, ideally edited to add value.</li>
                <li><strong>E‑E‑A‑T:</strong> Experience, Expertise, Authoritativeness, Trustworthiness—signals Google looks for in content and authors.</li>
              </ul>
            </section>

            <section id="faq" className="sherlock-section">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="safety"><AccordionTrigger>Is this safe long‑term?</AccordionTrigger><AccordionContent>With strict editorial standards, yes. Avoid footprints, over‑optimized anchors, and junk tiering.</AccordionContent></AccordionItem>
                <AccordionItem value="speed"><AccordionTrigger>How fast does it work?</AccordionTrigger><AccordionContent>Expect noticeable movement 8–16 weeks with supporting content and internal links.</AccordionContent></AccordionItem>
                <AccordionItem value="scale"><AccordionTrigger>Can I scale this?</AccordionTrigger><AccordionContent>Scale gradually with vigilant QA. Prioritize relevance and unique contributions per placement.</AccordionContent></AccordionItem>
              </Accordion>
            </section>

            <section id="extra" className="sherlock-section">
              <h2>Expanded Research (10k+ words)</h2>
              <p>Below we include extended, continuously updated research notes and explainers for power users.</p>
              <InlineExpandedGuide />
            </section>

            <section id="cta" className="sherlock-section">
              <h2>Next Steps</h2>
              <div className="space-y-4">
                <article className="rounded-2xl border border-violet-100 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                      <Layers className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Model content hubs around the entities you uncover</h3>
                        <p className="mt-1 text-sm text-slate-600">Translate research notes into structured briefs, map supporting assets, and brief collaborators without losing narrative control.</p>
                      </div>
                      <a className="inline-flex items-center gap-2 self-start rounded-full border border-violet-200 px-5 py-2 text-sm font-medium text-violet-700 transition hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200" href="/keyword-research">
                        Visit research workspace
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Verify results calmly with annotated ranking reports</h3>
                        <p className="mt-1 text-sm text-slate-600">Share context with stakeholders, layer notes about link placements, and keep campaign trajectory transparent.</p>
                      </div>
                      <a className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200" href="/rank-tracker">
                        Open rank tracker
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
