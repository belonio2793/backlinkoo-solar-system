import React, { useEffect, useMemo, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ExternalLink, ShieldCheck, Sparkles, Search, BookOpen, Gauge, Trophy, Globe2, BarChart3, Stars, Link as LinkIcon, Info, Mail, Megaphone, MapPin, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const sectionsOrder = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-is-presswhizz', label: 'What is PressWhizz?' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: '4‑Step Process' },
  { id: 'features', label: 'Key Features' },
  { id: 'vetting', label: 'Vetting & Safety' },
  { id: 'strategy', label: 'Strategy & Frameworks' },
  { id: 'anchors', label: 'Anchor Strategy' },
  { id: 'topical', label: 'Topical Authority' },
  { id: 'velocity', label: 'Link Velocity' },
  { id: 'anchor-mix-by-month', label: 'Anchor Mix by Month' },
  { id: 'prospecting-heuristics', label: 'Prospecting Heuristics' },
  { id: 'reporting', label: 'Reporting & KPIs' },
  { id: 'comparisons', label: 'Comparisons' },
  { id: 'comparison-matrix', label: 'Comparison Matrix' },
  { id: 'case-study-matrix', label: 'Case Study Matrix' },
  { id: 'filters-recipes', label: 'Filter Recipes' },
  { id: 'qa-rubric', label: 'Publisher QA Rubric' },
  { id: 'cadence-calendar', label: 'Cadence Calendar' },
  { id: 'pricing', label: 'Pricing Philosophy' },
  { id: 'pricing-scenarios', label: 'Pricing Scenarios' },
  { id: 'vertical-pricing', label: 'Vertical Pricing' },
  { id: 'i18n-playbooks', label: 'International Playbooks' },
  { id: 'email-templates', label: 'Outreach Templates' },
  { id: 'okr-kpis', label: 'OKRs & KPIs' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'cta', label: 'Get Started' }
];

export default function PressWhizzPage() {
  const title = "PressWhizz — AI‑Powered Link Building Marketplace Deep Dive";

  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parts: string[] = [];
        parts.push(`<section><h2>Overview</h2><p>PressWhizz deep dive: AI‑powered link building marketplace, curated publishers, vetting, and strategy frameworks for safe, scalable acquisition.</p></section>`);
        const text = parts.join('\n');
        if (!cancelled) setHtml(text);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const headings = Array.from(container.querySelectorAll('h2[id],h3[id]')) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
      const top = visible[0]?.target as HTMLElement | undefined;
      if (top?.id) setActiveId(top.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] });
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [html]);

  const tocItems = useMemo(() => sectionsOrder, []);

  useEffect(() => {
    try {
      const desc = 'PressWhizz deep dive: AI‑powered link building marketplace, 37k+ curated sites across 20+ countries, expert vetting, 24h TAT, and strategy frameworks for safe, scalable acquisition.';
      document.title = 'PressWhizz — AI‑Powered Link Building Marketplace Deep Dive';
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = desc;

      const url = typeof window !== 'undefined' ? window.location.href : 'https://example.com/presswhizz';
      const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'PressWhizz — AI‑Powered Link Building Marketplace Deep Dive',
        description: desc,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: 'Backlink' },
        publisher: { '@type': 'Organization', name: 'Backlink' }
      } as const;
      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is PressWhizz?', acceptedAnswer: { '@type': 'Answer', text: 'An AI‑powered link building marketplace with curated publishers, fast turnaround, and transparent ordering.' }},
          { '@type': 'Question', name: 'What types of links are offered?', acceptedAnswer: { '@type': 'Answer', text: 'Guest posts, niche edits, tier‑2 boosting, and category‑specific options like iGaming and SaaS.' }},
          { '@type': 'Question', name: 'Are links safe?', acceptedAnswer: { '@type': 'Answer', text: 'Sites are vetted; users should still manage anchors, velocity, and on‑page quality for safety.' }}
        ]
      } as const;
      const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: url.replace(/\/presswhizz.*/, '/') },
          { '@type': 'ListItem', position: 2, name: 'PressWhizz', item: url }
        ]
      } as const;
      const id = 'ld-presswhizz';
      let s = document.getElementById(id) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = id;
        document.head.appendChild(s);
      }
      const howToLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to order links on PressWhizz',
        description: 'Step‑by‑step process to discover publishers, place an order, and verify placements on PressWhizz.',
        step: [
          { '@type': 'HowToStep', name: 'Discover & Filter', text: 'Search by keyword, niche, language, and metrics. Shortlist suitable publishers.' },
          { '@type': 'HowToStep', name: 'Order & Brief', text: 'Choose anchors and target URLs; add editorial notes and instructions.' },
          { '@type': 'HowToStep', name: 'Draft & Placement', text: 'Content is prepared and placed; review drafts if required by publisher.' },
          { '@type': 'HowToStep', name: 'Verify & Report', text: 'Confirm link position and attributes; log screenshots and dates.' }
        ]
      } as const;
      s.textContent = JSON.stringify([articleLd, faqLd, breadcrumbsLd, howToLd]);
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Seo title={title} description={description} canonical={typeof canonical !== 'undefined' ? canonical : undefined} />

      <Header />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-6 md:pt-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-600">
            <ol className="flex items-center gap-1">
              <li>
                <a href="/" className="inline-flex items-center gap-1 hover:text-indigo-700">
                  <HomeIcon className="h-4 w-4" /> Home
                </a>
              </li>
              <li aria-hidden="true" className="px-1"><ChevronRight className="h-4 w-4 text-slate-400" /></li>
              <li className="text-slate-900 font-medium">PressWhizz</li>
            </ol>
          </nav>
        </div>
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">Expert Marketplace Analysis</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-clip-text text-transparent bg-white">PressWhizz</span> — AI‑powered link building marketplace: curated publishers, global coverage, and fast TAT
              </h1>
              <p className="text-slate-600 text-lg md:text-xl">
                An original, exhaustive deep dive into PressWhizz: how the marketplace works, its vetting standards, delivery speed, and the strategies to maximize ROI while safeguarding E‑E‑A‑T.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><Gauge className="h-3.5 w-3.5 mr-1"/>~24h average delivery</Badge>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200"><ShieldCheck className="h-3.5 w-3.5 mr-1"/>Vetted publishers</Badge>
                <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200"><Globe2 className="h-3.5 w-3.5 mr-1"/>20+ countries, 30+ languages</Badge>
              </div>
              <div className="flex gap-3 pt-3">
                <Button size="lg" asChild className="premium-banner-clouds">
                  <a href="https://app.presswhizz.com/signup" target="_blank" rel="noopener noreferrer">
                    <Sparkles className="h-4 w-4 mr-2"/> Signup Free
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://presswhizz.com/book-a-demo-call/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2"/> Book a Demo Call
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-slate-500 pt-2 text-sm">
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/>Transparent marketplace</div>
                <div className="flex items-center gap-2"><Stars className="h-4 w-4 text-amber-500"/>Human‑edited content</div>
                <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 text-indigo-600"/>Guest posts & niche edits</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl p-6 shadow-xl bg-white/90 ring-1 ring-slate-200">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: LinkIcon, label: 'Guest Posts' },
                    { icon: BookOpen, label: 'Niche Edits' },
                    { icon: Sparkles, label: 'Tier‑2 Boosting' },
                  ].map((i, idx) => (
                    <div key={idx} className="rounded-xl border p-4 text-center bg-white">
                      <i.icon className="h-6 w-6 mx-auto text-indigo-600"/>
                      <div className="mt-2 text-sm font-medium text-slate-700">{i.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Search className="h-4 w-4 text-sky-500"/>Keyword‑relevant filters</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Publisher vetting</div>
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-violet-500"/>Accurate metrics</div>
                  <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-indigo-600"/>International coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 self-start">
            <nav className="rounded-xl border bg-white p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">On this page</div>
              <ul className="space-y-1">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block rounded px-2 py-1 text-sm transition-colors ${
                        activeId === item.id
                          ? 'font-semibold text-indigo-700 bg-indigo-50'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Free Demo</CardTitle>
                  <CardDescription>Explore the marketplace, filters, and examples—see how orders flow from cart to live link.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-3">
                  <Button asChild className="w-full">
                    <a href="https://presswhizz.com/book-a-demo-call/" target="_blank" rel="noopener noreferrer">
                      <Megaphone className="h-4 w-4 mr-2"/> Book a Demo
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="prose prose-slate max-w-none">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
              )}
              {!html && !error && (
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-600"><Info className="h-5 w-5"/> Loading marketplace deep dive…</div>
                </div>
              )}
              <div ref={contentRef} dangerouslySetInnerHTML={html ? { __html: html } : undefined} />
            </div>

            <div id="services" className="mt-12">
              <Tabs defaultValue="guest" className="w-full">
                <TabsList>
                  <TabsTrigger value="guest">Guest Posts</TabsTrigger>
                  <TabsTrigger value="edits">Niche Edits</TabsTrigger>
                  <TabsTrigger value="tier2">Tier‑2 Boosting</TabsTrigger>
                  <TabsTrigger value="managed">Managed Service</TabsTrigger>
                </TabsList>
                <TabsContent value="guest">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guest Posts</CardTitle>
                      <CardDescription>Editorial articles on vetted sites with contextual links and human‑edited content.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Keyword‑relevant site discovery</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Balanced anchors with topic fit</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Clear guarantees per publisher</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="edits">
                  <Card>
                    <CardHeader>
                      <CardTitle>Niche Edits</CardTitle>
                      <CardDescription>Contextual insertions into existing, relevant articles with traffic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Fast turnaround</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Natural anchor placement</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Traffic‑verified targets</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tier2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tier‑2 Boosting</CardTitle>
                      <CardDescription>Support links that strengthen your Tier‑1 placements and extend reach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Improves discovery and crawl depth</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Enhances referral pathways</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Pairs with PR surges</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="managed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Managed Service</CardTitle>
                      <CardDescription>White‑glove management with strategy, QA, and reporting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Campaign scoping & anchor rules</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Stakeholder alignment & SLAs</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Attribution‑ready dashboards</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div id="faq" className="mt-12">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="q1">
                  <AccordionTrigger>What is PressWhizz?</AccordionTrigger>
                  <AccordionContent>
                    PressWhizz is an AI‑powered link building marketplace featuring curated publishers across many languages and countries, transparent filters, and fast turnaround on placements.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Which link types are available?</AccordionTrigger>
                  <AccordionContent>
                    Guest posts, niche edits (contextual inserts), tier‑2 boosting, and category‑specific options for SaaS, iGaming, and local.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Are links safe?</AccordionTrigger>
                  <AccordionContent>
                    Publishers are vetted; however, always manage anchors, velocity, and on‑page quality. Follow a balanced strategy for sustainable results.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
