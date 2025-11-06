import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Shield, CreditCard, Rocket, Zap, Sparkles, ArrowRight, BarChart3, RefreshCcw, Layers, Lock, ExternalLink } from 'lucide-react';

// Lightweight helper for meta tags without extra deps
function useSEO(meta: { title: string; description: string; url?: string; image?: string }) {
  useEffect(() => {
    document.title = meta.title;

    const ensure = (name: string, attr: 'name' | 'property' = 'name') => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      return tag;
    };

    ensure('description').setAttribute('content', meta.description);

    // OpenGraph
    ensure('og:title', 'property').setAttribute('content', meta.title);
    ensure('og:description', 'property').setAttribute('content', meta.description);
    if (meta.url) ensure('og:url', 'property').setAttribute('content', meta.url);
    if (meta.image) ensure('og:image', 'property').setAttribute('content', meta.image);

    // Twitter
    ensure('twitter:card').setAttribute('content', 'summary_large_image');
    ensure('twitter:title').setAttribute('content', meta.title);
    ensure('twitter:description').setAttribute('content', meta.description);
  }, [meta.title, meta.description, meta.url, meta.image]);
}

const Feature = ({ icon: Icon, title, desc }: { icon: React.ComponentType<any>; title: string; desc: string }) => (
  <div className="group rounded-xl border bg-white/70 dark:bg-white/5 backdrop-blur p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 grid place-items-center rounded-md bg-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    </div>
    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border p-4 text-center bg-white/60 dark:bg-white/5">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs mt-1 text-muted-foreground uppercase tracking-wide">{label}</div>
  </div>
);

function JsonLDSnippets() {
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Giga Indexer — Link Indexing Service',
    description: 'Advanced link indexing with rapid crawl triggers, drip feed scheduling and safety-first controls. 80%+ indexing observed within 7 days in typical scenarios.',
    brand: { '@type': 'Brand', name: 'Backlinkoo' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '412' },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0.28',
      highPrice: '499',
      priceCurrency: 'USD',
      offerCount: '3',
      availability: 'https://schema.org/InStock',
    },
  }), []);

  const faq = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Giga Indexer safe for money sites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our signals replicate natural discovery patterns, adhere to webmaster guidelines, and include pacing controls and automatic retries for safety.',
        },
      },
      {
        '@type': 'Question',
        name: 'What indexing success rates should I expect?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Results vary by domain and link quality. Many campaigns observe 50–80% of submitted URLs indexed within 7 days when on-page health and crawl paths are in good shape.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you support drip-feeding?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Schedule submissions over days or weeks to mirror organic link velocity and reduce risk. Useful for larger tiered-link deployments.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Some URLs index in hours; others take days. Typical turnarounds we see are initial crawls within 24–72 hours and first-week indexation for a meaningful share of URLs.',
        },
      },
    ],
  }), []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}

function LongFormLoader() {
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // Fallback to inline sections to avoid external /seo dependencies
      const next = loadedCount + 1;
      const sample = `<section><h3>Indexing Deep Dive #${next}</h3><p>Practitioner notes about crawl orchestration, scheduling, and safety controls for indexation.</p></section>`;
      setSections((prev) => [...prev, sample]);
      setLoadedCount(next);
    } catch (e: any) {
      setError(e?.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">In-Depth Guide: How Giga Indexer Works</h2>
      <p className="mt-2 text-muted-foreground">A comprehensive, practitioner-grade explainer about indexing, crawl orchestration, scheduling, safety, and measurement.</p>

      <div className="mt-6 space-y-8">
        {sections.map((html, i) => (
          <article key={i} className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button onClick={loadMore} variant="secondary" disabled={loading}>
          {loading ? 'Loading…' : 'Load more insights'}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

export default function GigaIndexer() {
  useSEO({
    title: 'Giga Indexer — Advanced Link Indexing Service (Fast, Safe, Proven)',
    description:
      'Giga Indexer helps your backlinks get discovered and indexed faster. Drip-feed scheduling, safety-first signals, transparent tracking, and pro-grade controls for SEOs.',
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  });

  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'safety', label: 'Safety' },
    { id: 'faq', label: 'FAQs' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <JsonLDSnippets />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200 via-indigo-200 to-transparent dark:from-blue-900/30 dark:via-indigo-900/20" />
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <Badge className="bg-blue-600/90">SEO Indexing</Badge>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Giga Indexer — Rapid, Reliable Link Indexing for Modern SEO
              </h1>
              <p className="mt-4 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                Accelerate discovery and indexation with safety-first signals, drip-feeding, health checks, and transparent
                tracking. Practitioners report 50–80% of submitted URLs indexed within a week when technical foundations are solid.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#pricing">See Pricing</a>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <a href="#faq">Read FAQs</a>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
                <Stat label="Typical Week-1 Indexing" value="50–80%" />
                <Stat label="Turnaround Window" value="24–72h" />
                <Stat label="Refund Logic" value="Smart Balance" />
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-white" />
                <div className="relative rounded-2xl border bg-white/70 dark:bg-white/5 backdrop-blur p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 grid place-items-center rounded-md bg-white">
                      <Rocket className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Engineered for Indexing</h3>
                      <p className="text-sm text-muted-foreground">Signals that mirror natural discovery + pacing control</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Drip-feed scheduler and velocity controls</li>
                    <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Automatic retries for stubborn URLs</li>
                    <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Safety-first patterns for money sites</li>
                    <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Transparent tracking and export</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-10">
          {/* TOC */}
          <aside className="md:col-span-3 order-last md:order-first">
            <div className="sticky top-24">
              <div className="rounded-xl border bg-white/70 dark:bg-white/5 backdrop-blur p-4">
                <h4 className="font-semibold mb-3">On this page</h4>
                <ul className="space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}><a className="text-muted-foreground hover:text-foreground" href={`#${t.id}`}>{t.label}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <main className="md:col-span-9">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <div className="grid sm:grid-cols-2 gap-4">
                <Feature icon={Zap} title="Fast discovery" desc="Trigger crawls quickly with diversified, safety-aware signals that mimic organic discovery paths." />
                <Feature icon={Clock} title="Paced delivery" desc="Use drip-feeding to mirror realistic link velocity and avoid suspicious bursts." />
                <Feature icon={Shield} title="Money-site safe" desc="Designed for safety-first rollouts; we avoid spam footprints and support staged submissions." />
                <Feature icon={CreditCard} title="Credit-based pricing" desc="Simple, predictable pricing—pay for exactly what you submit, no opaque tiers." />
              </div>
            </section>

            {/* Benefits */}
            <section id="benefits" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why SEOs choose Giga Indexer</h2>
              <p className="mt-2 text-muted-foreground">Built for link builders, affiliates, agencies, and technical SEOs who need dependable indexation at scale.</p>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Measurable outcomes</CardTitle>
                    <CardDescription>Track crawls, indexation hints, retries, and pacing in one place.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Timeline view of crawl attempts</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Segments by link tier or project</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Export-ready reports for clients</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Drip & retry logic</CardTitle>
                    <CardDescription>Automated schedules help stubborn URLs get discovered without spikes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Daily/weekly pacing windows</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Automatic cool-downs and escalation</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Granular per-project rules</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Safety & compliance</CardTitle>
                    <CardDescription>Signals formulated to respect bots and site health; no spammy footprints.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Money-site friendly defaults</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Supports robots and crawl budget best-practices</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Programmatic throttles for large lists</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><RefreshCcw className="h-5 w-5" /> Transparent ops</CardTitle>
                    <CardDescription>Know what happened, when, and why—no black boxes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Event-level logs for each URL</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Reasoned backoffs and retries</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Export or webhook to your stack</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How Giga Indexer works</h2>
              <p className="mt-2 text-muted-foreground">Purpose-built to increase discovery probability while preserving site health and plausible link velocity.</p>

              <Tabs defaultValue="submit" className="mt-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="submit">Submit</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="signals">Signals</TabsTrigger>
                  <TabsTrigger value="measure">Measure</TabsTrigger>
                </TabsList>
                <TabsContent value="submit">
                  <div className="rounded-xl border p-6">
                    <h3 className="font-semibold text-lg">1) Submit your URLs</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Paste lists or import CSVs, segment by project or tier, and preview crawlability hints before sending.</p>
                  </div>
                </TabsContent>
                <TabsContent value="schedule">
                  <div className="rounded-xl border p-6">
                    <h3 className="font-semibold text-lg">2) Choose pacing</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Use drip-feeding windows—daily/weekly cadence—to emulate organic discovery. Avoids suspicious spikes.</p>
                  </div>
                </TabsContent>
                <TabsContent value="signals">
                  <div className="rounded-xl border p-6">
                    <h3 className="font-semibold text-lg">3) Signal orchestration</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Trigger diversified signals that help bots find your URLs—without spam footprints—plus automatic retries for stubborn cases.</p>
                  </div>
                </TabsContent>
                <TabsContent value="measure">
                  <div className="rounded-xl border p-6">
                    <h3 className="font-semibold text-lg">4) Track results</h3>
                    <p className="mt-2 text-sm text-muted-foreground">See crawl attempts, indexation checks, and export client-ready PDF/CSV. Integrate via webhook when needed.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* Pricing */}
            <section id="pricing" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Simple, credit-based pricing</h2>
              <p className="mt-2 text-muted-foreground">Pay for exactly what you submit. Bulk lists benefit most from drip schedules and automatic retries.</p>

              <div className="mt-6 grid md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden">
                  <div className="absolute right-3 top-3"><Badge variant="secondary">Starter</Badge></div>
                  <CardHeader>
                    <CardTitle>60 Credits</CardTitle>
                    <CardDescription>Good for modest campaigns and fresh projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold">$29</div>
                    <p className="mt-2 text-sm text-muted-foreground">~$0.48 per URL</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Drip-feed scheduling</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Auto-retries</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Export & reporting</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Buy Credits</Button>
                  </CardFooter>
                </Card>

                <Card className="relative overflow-hidden border-blue-600/30">
                  <div className="absolute right-3 top-3"><Badge className="bg-blue-600/90">Most Popular</Badge></div>
                  <CardHeader>
                    <CardTitle>260 Credits</CardTitle>
                    <CardDescription>Best value for active link builders and agencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold">$99</div>
                    <p className="mt-2 text-sm text-muted-foreground">~$0.38 per URL</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Sparkles className="mt-1 h-4 w-4 text-blue-600" /> Priority windows</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Drip + retries</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Client-ready reports</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Buy Credits</Button>
                  </CardFooter>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute right-3 top-3"><Badge variant="outline">Agency</Badge></div>
                  <CardHeader>
                    <CardTitle>2000 Credits</CardTitle>
                    <CardDescription>Scale indexation for robust, tiered architectures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold">$499</div>
                    <p className="mt-2 text-sm text-muted-foreground">~$0.25 per URL</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-start gap-2"><Lock className="mt-1 h-4 w-4 text-slate-600" /> Advanced throttling</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> Priority queues</li>
                      <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600" /> SLA-backed support</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Buy Credits</Button>
                  </CardFooter>
                </Card>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">All prices in USD. Indexation isn’t guaranteed—no service can force inclusion—but we optimize discovery and persistence using safe, diversified methods.</p>
            </section>

            {/* Safety */}
            <section id="safety" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Safety-first by design</h2>
              <div className="mt-4 grid md:grid-cols-3 gap-6">
                <Feature icon={Shield} title="Natural patterns" desc="Our orchestration avoids spammy footprints and aligns with expected crawl behavior." />
                <Feature icon={Layers} title="Segmented rollouts" desc="Submit by tier, velocity, or quality bands. Fine-tune pacing to mirror reality." />
                <Feature icon={RefreshCcw} title="Resilient retries" desc="Stubborn URLs receive staggered, reasoned escalation rather than blast tactics." />
              </div>

              <LongFormLoader />
            </section>

            {/* FAQ */}
            <section id="faq" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="q1">
                  <AccordionTrigger>Is Giga Indexer safe for money sites?</AccordionTrigger>
                  <AccordionContent>
                    Yes. We prioritize safety—signals mirror natural discovery, include pacing controls, and avoid obvious
                    spam footprints. For sensitive niches, we recommend conservative drip schedules.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>What results should I expect?</AccordionTrigger>
                  <AccordionContent>
                    Typical campaigns see a significant portion of URLs discovered within 24–72 hours and 50–80% indexed within
                    a week when on-site technical health is solid. Outcomes vary by domain, template, and link quality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Do you support drip-feeding and retries?</AccordionTrigger>
                  <AccordionContent>
                    Yes. You can schedule paced submissions and we automatically retry stubborn URLs with safe backoff logic to
                    improve discovery probability over time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>Which payments are supported?</AccordionTrigger>
                  <AccordionContent>
                    We support common online payments. Credits are consumed per submitted URL—simple, predictable, and scalable for
                    campaigns of any size.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5">
                  <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                  <AccordionContent>
                    We operate with smart-balance logic for non-indexing scenarios within defined windows. Contact support with your
                    job details and we’ll review transparently.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 text-sm text-muted-foreground">
                Still have questions? <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href="/contact"><span>Contact us</span><ExternalLink className="h-3.5 w-3.5" /></a>
              </div>
            </section>

            {/* Final CTA */}
            <section className="mt-16 mb-24">
              <div className="rounded-2xl border p-8 bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold">Ready to accelerate indexation?</h3>
                    <p className="text-muted-foreground mt-1">Submit your URLs, set pacing, and let our orchestration handle the rest.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg">Get Started</Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="#pricing">Compare plans</a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
