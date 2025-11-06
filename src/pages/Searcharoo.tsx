import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ExternalLink, ShieldCheck, Sparkles, Search, BookOpen, Gauge, Trophy, Globe2, BarChart3, Stars, Link as LinkIcon, Info, Phone, Mail, Clock, Image, Megaphone, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const sectionsOrder = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand-story', label: 'Brand Story' },
  { id: 'market-landscape', label: 'Market Landscape' },
  { id: 'guiding-principles', label: 'Guiding Principles' },
  { id: 'service-portfolio', label: 'Service Portfolio' },
  { id: 'niche-edits', label: 'Niche Edits' },
  { id: 'guest-posts', label: 'Guest Posts' },
  { id: 'digital-pr', label: 'Digital PR' },
  { id: 'local-seo', label: 'Local SEO' },
  { id: 'tiered-links', label: 'Tiered Links' },
  { id: 'content-engine', label: 'Content Engine' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'guarantees', label: 'Guarantees' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'technology', label: 'Technology' },
  { id: 'outreach-sops', label: 'Outreach SOPs' },
  { id: 'quality', label: 'Quality Assurance' },
  { id: 'risk', label: 'Risk Management' },
  { id: 'industry-playbooks', label: 'Industry Playbooks' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'competitive', label: 'Competitive Comparison' },
  { id: 'roi-modeling', label: 'ROI Modeling' },
  { id: 'timeline', label: 'Implementation Timeline' },
  { id: 'team', label: 'Team Architecture' },
  { id: 'integration', label: 'Marketing Integration' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'kpi', label: 'KPI Scoreboard' },
  { id: 'education', label: 'Education & Enablement' },
  { id: 'resources', label: 'Resource Library' },
  { id: 'experiments', label: 'Experimentation' },
  { id: 'leadership', label: 'Leadership Alignment' },
  { id: 'global', label: 'Global Expansion' },
  { id: 'sustainability', label: 'Sustainability & Ethics' },
  { id: 'innovation', label: 'Innovation Roadmap' },
  { id: 'future', label: 'Future Trends' },
  { id: 'faq', label: 'FAQ' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'cta', label: 'Get Started' }
];

export default function SearcharooPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parts: string[] = [];
        parts.push(`<section><h2>Overview</h2><p>An original, comprehensive analysis of Searcharoo: link-building frameworks, guest-post strategies, and measurement playbooks.</p></section>`);
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="rhinorank-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">SEO Deep Dive</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="rhinorank-gradient-text">Searcharoo</span> — results-driven link building: niche edits, guest posts, and digital PR
              </h1>
              <p className="text-slate-600 text-lg md:text-xl">
                An original, comprehensive analysis of Searcharoo, its link-building framework, pricing philosophy, and measurement playbooks—crafted for agencies, SEOs, and growth teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><Check className="h-3.5 w-3.5 mr-1"/>Traffic-first strategy</Badge>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200"><ShieldCheck className="h-3.5 w-3.5 mr-1"/>6‑month placement guarantee</Badge>
                <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200"><Gauge className="h-3.5 w-3.5 mr-1"/>Direct value pricing</Badge>
              </div>
              <div className="flex gap-3 pt-3">
                <Button size="lg" className="premium-banner-clouds">
                  <Sparkles className="h-4 w-4 mr-2"/> Explore Packages
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://searcharoo.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2"/> Visit searcharoo.com
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-slate-500 pt-2 text-sm">
                <div className="flex items-center gap-2"><Globe2 className="h-4 w-4"/>Global campaigns</div>
                <div className="flex items-center gap-2"><Trophy className="h-4 w-4"/>Case‑study backed</div>
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/>Traffic‑value focus</div>
              </div>
            </div>
            <div className="relative">
              <div className="rhinorank-card rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: LinkIcon, label: 'Niche Edits' },
                    { icon: BookOpen, label: 'Guest Posts' },
                    { icon: Megaphone, label: 'Digital PR' },
                  ].map((i, idx) => (
                    <div key={idx} className="rhinorank-shimmer rounded-xl border p-4 text-center">
                      <i.icon className="h-6 w-6 mx-auto text-blue-600"/>
                      <div className="mt-2 text-sm font-medium text-slate-700">{i.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Stars className="h-4 w-4 text-amber-500"/>Editorial placements</div>
                  <div className="flex items-center gap-2"><Search className="h-4 w-4 text-sky-500"/>Competitor‑informed</div>
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-violet-500"/>Data‑driven</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>White‑hat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 self-start">
            <nav className="rhinorank-toc rounded-xl border bg-white p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">On this page</div>
              <ul className="space-y-1">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block rounded px-2 py-1 text-sm transition-colors ${
                        activeId === item.id
                          ? 'rhinorank-toc-link font-semibold text-blue-700'
                          : 'text-slate-600 hover:text-blue-600'
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
                  <CardDescription>Discuss goals, budgets, and timelines with a link‑building specialist.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-3">
                  <Button asChild className="w-full">
                    <a href="https://searcharoo.com" target="_blank" rel="noopener noreferrer">
                      <Megaphone className="h-4 w-4 mr-2"/> Book a Call
                    </a>
                  </Button>
                  <div className="flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4"/>Contact via website</div>
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
              <Tabs defaultValue="edits" className="w-full">
                <TabsList>
                  <TabsTrigger value="edits">Niche Edits</TabsTrigger>
                  <TabsTrigger value="guest">Guest Posts</TabsTrigger>
                  <TabsTrigger value="pr">Digital PR</TabsTrigger>
                  <TabsTrigger value="local">Local Citations</TabsTrigger>
                </TabsList>
                <TabsContent value="edits">
                  <Card>
                    <CardHeader>
                      <CardTitle>Niche Edits</CardTitle>
                      <CardDescription>Contextual insertions into ranking, traffic‑verified articles on real sites.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Traffic‑value over vanity metrics</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Balanced anchor distribution</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>6‑month placement assurance</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="guest">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guest Posts</CardTitle>
                      <CardDescription>Editorial placements with original articles on niche‑relevant websites.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Narrative control and topical depth</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Competitor‑informed prospecting</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Traffic‑verified host sites</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pr">
                  <Card>
                    <CardHeader>
                      <CardTitle>Digital PR</CardTitle>
                      <CardDescription>Premium publications and story‑driven placements that attract referral traffic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-700">
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Reputation‑building editorial links</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Ideal for category‑defining assets</div>
                      <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>Amplifies brand authority</div>
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

            <div id="faq" className="rhinorank-section mt-12">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="q1">
                  <AccordionTrigger>What is Searcharoo?</AccordionTrigger>
                  <AccordionContent>
                    Searcharoo is a results‑driven link‑building and content partner offering niche edits, guest posts, digital PR, and local SEO assets with traffic‑first selection and a 6‑month placement guarantee.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>How are packages structured?</AccordionTrigger>
                  <AccordionContent>
                    Publicly priced tiers include DR targets and link volumes. Timelines are typically live within 4 weeks; each placement carries a replacement guarantee if it becomes unavailable within 6 months.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Is it safe?</AccordionTrigger>
                  <AccordionContent>
                    The focus is white‑hat outreach, traffic‑verified host sites, and natural anchor distribution—prioritizing sustainable rankings and brand safety.
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
