import React, { useEffect, useMemo, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Check, ExternalLink, ShieldCheck, Sparkles, Search, BookOpen, Gauge, Trophy, Globe2, BarChart3, Stars, Link as LinkIcon, Info, Mail, Megaphone, MapPin, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const sectionsOrder = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-is-lbhq', label: 'What is Link Building HQ?' },
  { id: 'services', label: 'Services' },
  { id: 'white-label', label: 'White-Label Link Building' },
  { id: 'enterprise', label: 'Enterprise Link Building' },
  { id: 'digital-pr', label: 'Digital PR' },
  { id: 'process', label: 'Process' },
  { id: 'strategy', label: 'Strategy & Frameworks' },
  { id: 'anchor-text', label: 'Anchor Text & Distribution' },
  { id: 'topical-authority', label: 'Topical Authority' },
  { id: 'link-velocity', label: 'Link Velocity & Cadence' },
  { id: 'eeat', label: 'E‑E‑A‑T & Safety' },
  { id: 'quality', label: 'Quality Assurance' },
  { id: 'comparisons', label: 'Comparisons & Alternatives' },
  { id: 'reporting', label: 'Reporting & KPIs' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'pricing', label: 'Pricing Philosophy' },
  { id: 'faq', label: 'FAQ' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'cta', label: 'Get Started' }
];

export default function LinkBuildingHQPage() {
  const title = "Link Building HQ — White‑Label Link Building & Digital PR Deep Dive";

  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parts: string[] = [];
        parts.push(`<section><h2>Overview</h2><p>A comprehensive, independent deep dive into Link Building HQ: white‑label link building, enterprise campaigns, Digital PR, strategy frameworks, QA standards, reporting, and ROI modeling.</p></section>`);
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
      const desc = 'A comprehensive, independent deep dive into Link Building HQ (LBHQ): white‑label link building, enterprise campaigns, Digital PR, strategy frameworks, QA standards, reporting, and ROI modeling.';
      document.title = 'Link Building HQ — White‑Label Link Building & Digital PR Deep Dive';
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = desc;

      const url = typeof window !== 'undefined' ? window.location.href : 'https://example.com/linkbuildinghq';

      const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Link Building HQ — White‑Label Link Building & Digital PR Deep Dive',
        description: desc,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: 'Backlink' },
        publisher: { '@type': 'Organization', name: 'Backlink' }
      } as const;

      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Link Building HQ?',
            acceptedAnswer: { '@type': 'Answer', text: 'A white‑label link building and Digital PR partner focused on safe outreach, traffic‑verified placements, and transparent reporting for agencies and brands.' }
          },
          {
            '@type': 'Question',
            name: 'How fast are placements delivered?',
            acceptedAnswer: { '@type': 'Answer', text: 'Most campaigns see placements within ~30 days depending on volume and editor calendars; enterprise follows agreed SLAs.' }
          },
          {
            '@type': 'Question',
            name: 'Do you use PBNs?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. The focus is white‑hat editorial outreach to real publications with natural anchors and topical relevance.' }
          }
        ]
      } as const;

      const breadcrumbsLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: url.replace(/\/linkbuildinghq.*/, '/')
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Link Building HQ',
            item: url
          }
        ]
      } as const;

      const id = 'ld-linkbuildinghq';
      let s = document.getElementById(id) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = id;
        document.head.appendChild(s);
      }
      s.textContent = JSON.stringify([articleLd, faqLd, breadcrumbsLd]);
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
              <li className="text-slate-900 font-medium">Link Building HQ</li>
            </ol>
          </nav>
        </div>
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">Expert Analysis</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="text-gray-900 font-semibold">Link Building HQ</span> — comprehensive, data‑driven guide to services, strategy, and results
              </h1>
              <p className="text-slate-600 text-lg md:text-xl">
                An original, exhaustive deep dive into Link Building HQ: how they approach white‑label link building, enterprise campaigns, and Digital PR—plus the playbooks and measurements that make link acquisition safe and effective.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><Check className="h-3.5 w-3.5 mr-1"/>Traffic‑verified placements</Badge>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200"><ShieldCheck className="h-3.5 w-3.5 mr-1"/>White‑hat outreach</Badge>
                <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200"><Gauge className="h-3.5 w-3.5 mr-1"/>Measurable ROI</Badge>
              </div>
              <div className="flex gap-3 pt-3">
                <Button size="lg" className="premium-banner-clouds">
                  <Sparkles className="h-4 w-4 mr-2"/> Explore Services
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://www.linkbuildinghq.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2"/> Visit linkbuildinghq.com
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-slate-500 pt-2 text-sm">
                <div className="flex items-center gap-2"><Globe2 className="h-4 w-4"/>Global coverage</div>
                <div className="flex items-center gap-2"><Trophy className="h-4 w-4"/>Case‑study backed</div>
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/>Performance‑driven</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl p-6 shadow-xl bg-white/90 ring-1 ring-slate-200">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: LinkIcon, label: 'White‑Label' },
                    { icon: BookOpen, label: 'Guest Posts' },
                    { icon: Sparkles, label: 'Digital PR' },
                  ].map((i, idx) => (
                    <div key={idx} className="rounded-xl border p-4 text-center bg-white">
                      <i.icon className="h-6 w-6 mx-auto text-indigo-600"/>
                      <div className="mt-2 text-sm font-medium text-slate-700">{i.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Stars className="h-4 w-4 text-amber-500"/>Editorial placements</div>
                  <div className="flex items-center gap-2"><Search className="h-4 w-4 text-sky-500"/>Competitor‑aware</div>
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-violet-500"/>Data‑driven</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Policy‑safe</div>
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
                  <CardTitle className="text-base">Free Strategy Call</CardTitle>
                  <CardDescription>Discuss goals, budgets, and timelines with a link‑building strategist.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-3">
                  <Button asChild className="w-full">
                    <a href="https://www.linkbuildinghq.com/" target="_blank" rel="noopener noreferrer">
                      <Megaphone className="h-4 w-4 mr-2"/> Book a Call
                    </a>
                  </Button>
                  <div className="flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4"/>letstalk@linkbuildinghq.com</div>
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
                  <div className="flex items-center gap-3 text-slate-600"><Info className="h-5 w-5"/> Loading SEO deep dive…</div>
                </div>
              )}
              <div ref={contentRef} dangerouslySetInnerHTML={html ? { __html: html } : undefined} />
            </div>

            <div id="services" className="mt-12">
              <Tabs defaultValue="white-label" className="w-full">
                <TabsList>
                  <TabsTrigger value="white-label">White‑Label</TabsTrigger>
                  <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                  <TabsTrigger value="pr">Digital PR</TabsTrigger>
                  <TabsTrigger value="local">Local Citations</TabsTrigger>
                </TabsList>
                <TabsContent value="white-label">
                  <Card>
                    <CardHeader>
                      <CardTitle>White‑Label Link Building</CardTitle>
                      <CardDescription>Scalable acquisition for agencies with transparent reporting and safe outreach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Traffic‑value over vanity metrics</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Balanced anchors and topical fit</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Replacement assurance</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="enterprise">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise Link Building</CardTitle>
                      <CardDescription>Multi‑market campaigns, advanced governance, and exec‑level reporting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Territory and language coverage</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Stakeholder alignment and SLAs</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Attribution‑ready dashboards</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pr">
                  <Card>
                    <CardHeader>
                      <CardTitle>Digital PR</CardTitle>
                      <CardDescription>Story‑driven placements that build authority and referral traffic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Editorial brand mentions</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Ideal for asset launches</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Amplifies E‑E‑A‑T</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="local">
                  <Card>
                    <CardHeader>
                      <CardTitle>Local Citations</CardTitle>
                      <CardDescription>Consistent NAP listings across authoritative directories for local SEO.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600"/>100+ directories where relevant</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Supports maps rankings</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Clean reporting</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div id="faq" className="mt-12">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="q1">
                  <AccordionTrigger>What is Link Building HQ?</AccordionTrigger>
                  <AccordionContent>
                    Link Building HQ is a white‑label link building and Digital PR partner focused on safe outreach, traffic‑verified placements, and transparent reporting for agencies and brands.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>How fast are placements delivered?</AccordionTrigger>
                  <AccordionContent>
                    Turnaround typically completes within 30 days depending on volume and publication calendars. Enterprise timelines follow agreed SLAs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Do you use private blog networks?</AccordionTrigger>
                  <AccordionContent>
                    No. The focus is white‑hat editorial outreach to real publications and vetted directories with natural anchors and topical relevance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Execute Your Link Building Strategy?"
                description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
              />
            </section>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
