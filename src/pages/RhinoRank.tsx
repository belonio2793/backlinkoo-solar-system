import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ExternalLink, ShieldCheck, Sparkles, Search, BookOpen, Gauge, Trophy, Globe2, BarChart3, Stars, Link as LinkIcon, Layers, Info, Phone, Mail, Clock, Image } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const sectionsOrder = [
  { id: 'overview', label: 'Overview' },
  { id: 'why-rhino-rank', label: 'Why Rhino Rank' },
  { id: 'services', label: 'Services' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'quality', label: 'Quality & Compliance' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'implementation', label: 'Implementation Playbooks' },
  { id: 'pricing', label: 'Pricing Philosophy' },
  { id: 'data', label: 'Data & Measurement' },
  { id: 'faq', label: 'FAQ' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'advanced', label: 'Advanced Strategy' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'sops', label: 'SOPs' },
  { id: 'risk', label: 'Risk Management' },
  { id: 'international', label: 'International' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'checklists', label: 'Checklists' },
];

export default function RhinoRankPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parts: string[] = [];
        parts.push(`<section><h2>Overview</h2><p>A comprehensive, original guide to Rhino Rank, link building, and backlink strategies. Built for SEO practitioners, agencies, and growth teams who demand data-backed execution.</p></section>`);
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveId(top.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [html]);

  const tocItems = useMemo(() => sectionsOrder, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="rhinorank-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">SEO Deep Dive</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="rhinorank-gradient-text">Rhino Rank</span> — white-label link building, natural backlinks, and ranking growth
              </h1>
              <p className="text-slate-600 text-lg md:text-xl">
                A comprehensive, original guide to Rhino Rank, link building, and backlink strategies. Built for SEO practitioners, agencies, and growth teams who demand data-backed execution.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><Check className="h-3.5 w-3.5 mr-1"/>Natural in-content links</Badge>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200"><ShieldCheck className="h-3.5 w-3.5 mr-1"/>White-label delivery</Badge>
                <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200"><Gauge className="h-3.5 w-3.5 mr-1"/>Scalable outcomes</Badge>
              </div>
              <div className="flex gap-3 pt-3">
                <Button size="lg" className="premium-banner-clouds">
                  <Sparkles className="h-4 w-4 mr-2"/> Explore Services
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://rhinorank.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2"/> Visit rhinorank.io
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-slate-500 pt-2 text-sm">
                <div className="flex items-center gap-2"><Globe2 className="h-4 w-4"/>UK/US Support</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Money-back on first order</div>
                <div className="flex items-center gap-2"><Trophy className="h-4 w-4"/>Trusted by 2,500+ agencies</div>
              </div>
            </div>
            <div className="relative">
              <div className="rhinorank-card rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: LinkIcon, label: 'Curated Links' },
                    { icon: BookOpen, label: 'Guest Posts' },
                    { icon: Image, label: 'Visual Links' },
                  ].map((i, idx) => (
                    <div key={idx} className="rhinorank-shimmer rounded-xl border p-4 text-center">
                      <i.icon className="h-6 w-6 mx-auto text-blue-600"/>
                      <div className="mt-2 text-sm font-medium text-slate-700">{i.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Stars className="h-4 w-4 text-amber-500"/>Natural placements</div>
                  <div className="flex items-center gap-2"><Search className="h-4 w-4 text-sky-500"/>Relevance-first</div>
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-violet-500"/>Data-backed</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Ethical outreach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="rhinorank-toc rounded-xl border bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">On this page</div>
              <ul className="space-y-1">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className={"text-sm " + (activeId === item.id ? 'active rhinorank-toc-link' : '')}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Need help choosing?</CardTitle>
                  <CardDescription>Talk to a specialist who implements link building daily.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4"/>US: (415) 376-3927</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4"/>UK: (+44) 01743 387506</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4"/>hello@rhinorank.io</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4"/>Mon–Fri business hours</div>
                </CardContent>
              </Card>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="prose prose-slate max-w-none rhinorank-prose">
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

            <div id="services" className="rhinorank-section mt-12">
              <Tabs defaultValue="curated" className="w-full">
                <TabsList>
                  <TabsTrigger value="curated">Curated Links</TabsTrigger>
                  <TabsTrigger value="guest">Guest Posts</TabsTrigger>
                  <TabsTrigger value="visual">Visual Links</TabsTrigger>
                </TabsList>
                <TabsContent value="curated">
                  <Card>
                    <CardHeader>
                      <CardTitle>Curated Links</CardTitle>
                      <CardDescription>Natural in-content backlinks placed within relevant, pre-existing articles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>High relevance and topical fit</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Scalable and efficient</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Signals authority and context</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="guest">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guest Posts</CardTitle>
                      <CardDescription>Editorial placements on real sites with minimum 750+ words per article.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Full editorial narrative control</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Topical authority building</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Content-led growth</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="visual">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Links</CardTitle>
                      <CardDescription>Image-backed backlinks for diversity, with relevant alt text optimization.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Anchor profile diversification</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Semantic reinforcement via alt text</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Contextual placements</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div id="faq" className="rhinorank-section mt-12">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="q1">
                  <AccordionTrigger>What is Rhino Rank?</AccordionTrigger>
                  <AccordionContent>
                    Rhino Rank is a specialist, white-label link building agency offering curated links, guest posts, and visual links using ethical, outreach-led methods designed to increase rankings via natural, relevant backlinks.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Are these links safe and compliant?</AccordionTrigger>
                  <AccordionContent>
                    The focus is on real websites, genuine outreach, and relevance-first placements—prioritizing ethical practices that align with sustainable SEO.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Who uses Rhino Rank?</AccordionTrigger>
                  <AccordionContent>
                    Agencies, in-house marketing teams, and businesses that want scalable, data-backed link building without managing outreach themselves.
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
