import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Infinity, LineChart, Search, ShieldCheck, Zap, Globe2, BookOpen, Terminal, PlugZap, 
  ListChecks, BarChart3, Layers, Settings2, Rocket, Sparkles, Hand, CheckCircle2, 
  Presentation, BookmarkCheck, HelpCircle, Anchor, Award, ExternalLink, ArrowRight 
} from 'lucide-react';

function upsertMeta(name: string, content: string) {
  const head = typeof document !== 'undefined' ? document.head : null;
  if (!head) return;
  let el = head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); head.appendChild(el); }
  el.setAttribute('content', content);
}
function upsertPropertyMeta(property: string, content: string) {
  const head = typeof document !== 'undefined' ? document.head : null;
  if (!head) return;
  let el = head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); head.appendChild(el); }
  el.setAttribute('content', content);
}
function upsertCanonical(canonicalUrl: string) {
  const head = typeof document !== 'undefined' ? document.head : null;
  if (!head) return;
  let link = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); head.appendChild(link); }
  link.setAttribute('href', canonicalUrl);
}
function injectJSONLD(id: string, data: Record<string, unknown>) {
  const head = typeof document !== 'undefined' ? document.head : null;
  if (!head) return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.id = id; head.appendChild(script); }
  script.textContent = JSON.stringify(data);
}

const metaTitle = 'No Hands SEO — Original 2025 Deep Dive, Safer Alternatives, and Practical Workflows';
const metaDescription = 'A practitioner-grade guide to "No Hands SEO": what it is, how it worked, risks and footprints, and modern, policy-aware workflows that improve discovery, crawling, and rankings—without spam.';

const toc = [
  { id: 'overview', label: 'No Hands SEO at a Glance' },
  { id: 'what-is', label: 'What Is "No Hands SEO"?' },
  { id: 'how-it-worked', label: 'How It Worked Historically' },
  { id: 'modern-seo', label: 'Modern SEO: Signals that Last' },
  { id: 'workflows', label: 'Winning Workflows & SOPs' },
  { id: 'safety', label: 'Safety, Compliance, and Footprints' },
  { id: 'alternatives', label: 'Modern Alternatives & Stacks' },
  { id: 'tour', label: 'Guided Tour: Concepts, Not Hype' },
  { id: 'measurement', label: 'Measurement & Proof' },
  { id: 'pricing', label: 'Cost Landscape & ROI Thinking' },
  { id: 'stories', label: 'User Stories & Patterns' },
  { id: 'faq', label: 'FAQ' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'resources', label: 'Further Resources' },
];

export default function NoHandsSEOPillar() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const canonical = useMemo(() => {
    if (typeof window === 'undefined') return '/nohandsseo';
    try { return `${window.location.origin}/nohandsseo`; } catch { return '/nohandsseo'; }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'No Hands SEO, automated backlinking, backlink software, link building automation, policy-aware SEO, indexing workflows, 2025 SEO, discovery signals');
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', metaTitle);
    upsertMeta('twitter:description', metaDescription);
    upsertCanonical(canonical);

    injectJSONLD('nohandsseo-faq', {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is "No Hands SEO"?', acceptedAnswer: { '@type': 'Answer', text: 'A term associated with legacy automated backlink tools that attempted to find targets and post at scale with minimal input. This guide explains modern, safer approaches focused on quality and policy alignment.' } },
        { '@type': 'Question', name: 'Is bulk automated backlinking still effective?', acceptedAnswer: { '@type': 'Answer', text: 'Volume-first link automation is risky and rarely durable. Focus on value-adding distribution, internal linking, feeds, sitemaps, and editorial placements.' } },
        { '@type': 'Question', name: 'What works now for faster indexing?', acceptedAnswer: { '@type': 'Answer', text: 'Sharded sitemaps, refreshed internal link hubs, change logs, clean HTML, and policy-welcomed syndication. Measure with logs and impressions rather than only link counts.' } }
      ]
    });

    injectJSONLD('nohandsseo-article', {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlinkoo' }
    });
  }, [canonical]);

  useEffect(() => {
    const el = contentRef.current; if (!el) return;
    const text = el.innerText || '';
    const count = text.trim().split(/\s+/).filter(Boolean).length; setWordCount(count);
  }, []);

  const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="secondary" className="mb-3">No Hands SEO • Independent Deep Dive</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">No Hands SEO — What It Was, What Works Now</h1>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                This original guide explains the idea behind "No Hands SEO" and shows modern, policy‑aware workflows for
                discovery, crawling, indexing, and ranking—without resorting to spam patterns. You will find a practical
                blueprint you can run today, with built‑in measurement and safeguards.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <Button onClick={() => scrollTo('workflows')} className="h-11 text-base">See Safer Workflows</Button>
                <Button variant="outline" onClick={() => scrollTo('faq')} className="h-11 text-base">Read FAQ</Button>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-600"/>Quality‑first automation</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Policy‑aware distribution</li>
                <li className="flex items-center gap-2"><LineChart className="h-4 w-4 text-emerald-600"/>Logs & measurement</li>
                <li className="flex items-center gap-2"><PlugZap className="h-4 w-4 text-emerald-600"/>API‑ready patterns</li>
              </ul>
              <div className="mt-4 text-xs text-gray-500">Approximate words on this page: {wordCount.toLocaleString()}</div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border bg-white">
                <div className="flex items-center gap-3">
                  <Hand className="h-10 w-10 text-primary" />
                  <div>
                    <div className="text-sm text-gray-600">Automation Posture</div>
                    <div className="text-2xl font-bold">Hands‑Off, Not Careless</div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-gray-900">94%</div><div className="text-xs text-gray-500">Policy Fit</div></div>
                  <div><div className="text-2xl font-bold text-gray-900">83%</div><div className="text-xs text-gray-500">Crawl QoS</div></div>
                  <div><div className="text-2xl font-bold text-gray-900">47%</div><div className="text-xs text-gray-500">Index Uptake</div></div>
                </div>
                <p className="mt-4 text-sm text-gray-600">These heuristics describe likelihood of sustainable discovery. Improve each dial with the playbooks below.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <nav className="bg-white/80 sticky top-[57px] z-40 border-b">
        <div className="container mx-auto max-w-6xl px-4 py-2 overflow-x-auto">
          <div className="flex gap-3 text-sm whitespace-nowrap">
            {toc.map((t) => (
              <button key={t.id} onClick={() => scrollTo(t.id)} className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50">{t.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main ref={contentRef} className="container mx-auto max-w-6xl px-4 py-10 space-y-16">
        <section id="overview" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">No Hands SEO at a Glance</h2>
          <p className="text-gray-700 leading-relaxed">“No Hands SEO” described a category of tools that promised fast backlink creation with almost no input. The pitch was simple: add a URL and some keywords, press play, and watch rankings rise. In practice, sustainable results require more nuance. This guide reframes the idea for 2025: keep the convenience—ditch the footprint. Automate logistics, preserve editorial quality, and align every step with platform policies and user value.</p>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5"/> Core Ideas</CardTitle>
              <CardDescription>Automate the boring; never automate the spam.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Automate discovery signals (sitemaps, feeds, hubs) rather than mass posting to low‑quality destinations.</li>
                <li>Instrument everything: server logs, cache hits, impressions, fetch status, and duplication patterns.</li>
                <li>Prefer editorial, context‑first publications over volume; let automation support the workflow, not replace craft.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="what-is" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What Is "No Hands SEO"?</h2>
          <p className="text-gray-700 leading-relaxed">At its peak, the term referred to software that searched for targets across many platforms and attempted to create backlinks with minimal human involvement. The appeal was speed and scale. The limitation was quality control: repetition, weak destinations, and duplicate footprints led to fragile gains. Today’s durable approach treats automation as an assistant, not a surrogate: it helps you ship, monitor, and improve—but it never publishes junk on your behalf.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5"/> Policy Alignment</CardTitle></CardHeader><CardContent className="text-gray-700">Automations must respect destination rules, no‑spam policies, and sensible anchor diversity.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5"/> Value Forward</CardTitle></CardHeader><CardContent className="text-gray-700">Links should add context and value for readers—otherwise they rarely stand the test of time.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5"/> Observability</CardTitle></CardHeader><CardContent className="text-gray-700">Collect evidence: fetch logs, sitemap hits, hub refreshes, impressions and conversions.</CardContent></Card>
          </div>
        </section>

        <section id="how-it-worked" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How It Worked Historically</h2>
          <Tabs defaultValue="pipeline">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="pipeline">Submission Pipeline</TabsTrigger>
              <TabsTrigger value="content">Content Handling</TabsTrigger>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
            </TabsList>
            <TabsContent value="pipeline" className="text-gray-700 leading-relaxed">Legacy tools scraped or accepted user input, queued targets, filled forms, and attempted to verify posts or profiles. This boosted link counts but often sacrificed quality and policy compliance.</TabsContent>
            <TabsContent value="content" className="text-gray-700 leading-relaxed">Some pipelines spun or templated content. Modern best practice avoids spinning entirely—use unique, human‑quality writing and keep automation focused on logistics and templating, not prose.</TabsContent>
            <TabsContent value="destinations" className="text-gray-700 leading-relaxed">Common targets included article directories, social bookmarks, profiles, and generic comment areas. Many of these channels tightened policies or disappeared as low‑value spam became trivial to detect.</TabsContent>
          </Tabs>
        </section>

        <section id="modern-seo" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Modern SEO: Signals that Last</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5"/> Sharded Sitemaps</CardTitle></CardHeader><CardContent className="text-gray-700">Segment by type and recency. Keep a hot shard for newest URLs and update rapidly to broadcast change.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Internal Link Hubs</CardTitle></CardHeader><CardContent className="text-gray-700">Refresh hub pages that link to fresh content. These hubs become reliable beacons for crawlers and people.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Clean, Semantic HTML</CardTitle></CardHeader><CardContent className="text-gray-700">Keep primary copy in HTML, reduce render blockers, and use descriptive headings. Bots and users benefit equally.</CardContent></Card>
          </div>
        </section>

        <section id="workflows" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Winning Workflows & SOPs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5"/> Batch Releases</CardTitle></CardHeader><CardContent className="text-gray-700">Batch coherent URL sets, then immediately refresh hubs and feeds so freshness signals line up.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5"/> Quality Gates</CardTitle></CardHeader><CardContent className="text-gray-700">Lint titles, metas, canonicals, and link context before release. Reject thin or derivative pages.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> Policy Presets</CardTitle></CardHeader><CardContent className="text-gray-700">Respect destination rules, avoid repetitive anchors, and keep distributions human‑sensible.</CardContent></Card>
          </div>
        </section>

        <section id="safety" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Safety, Compliance, and Footprints</h2>
          <p className="text-gray-700 leading-relaxed">Automating distribution without considering platform rules risks penalties and reputational harm. Replace volume‑chasing tactics with durable, value‑adding distribution. Treat every destination as an audience, not a dumping ground. When in doubt, publish better content, improve internal links, and strengthen hubs. Use rel attributes, disclose sponsorships where relevant, and avoid manipulative anchor patterns.</p>
          <Alert>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <AlertDescription>Rule of thumb: if a human editor would hesitate to approve the placement, don’t automate it.</AlertDescription>
          </Alert>
        </section>

        <section id="alternatives" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Modern Alternatives & Stacks</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Editorial Syndication</CardTitle></CardHeader><CardContent className="text-gray-700">Guest posts, partner newsletters, curated link digests, and community spotlights attract qualified crawls and readers—no footprint games required.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5"/> Structured Feeds</CardTitle></CardHeader><CardContent className="text-gray-700">Offer RSS/Atom, change logs, and JSON indexes. These feeds simplify mirroring, citing, and discovery. Pair with sharded sitemaps for maximum clarity.</CardContent></Card>
          </div>
        </section>

        <section id="tour" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Guided Tour: Concepts, Not Hype</h2>
          <Tabs defaultValue="concepts">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="concepts">Core Concepts</TabsTrigger>
              <TabsTrigger value="qa">QA & Reviews</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
              <TabsTrigger value="indexing">Indexing</TabsTrigger>
            </TabsList>
            <TabsContent value="concepts" className="text-gray-700 leading-relaxed">Focus on durable signals that improve both user experience and machine readability: semantic HTML, helpful internal links, and clean, canonicalized URLs.</TabsContent>
            <TabsContent value="qa" className="text-gray-700 leading-relaxed">Before distribution, run quality checks: duplicate titles, missing metas, inconsistent schemas, thin sections, and anchor over‑optimization.</TabsContent>
            <TabsContent value="publishing" className="text-gray-700 leading-relaxed">Publish in coherent batches, refresh hubs immediately, and maintain a visible change log that highlights what’s new.</TabsContent>
            <TabsContent value="indexing" className="text-gray-700 leading-relaxed">Ensure sitemaps are accurate, feeds are fresh, and server logs confirm healthy bot activity. Use URL inspection data to troubleshoot.</TabsContent>
          </Tabs>
        </section>

        <section id="measurement" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Measurement & Proof</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="logs"><AccordionTrigger>Server Logs</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Verify bot families, fetch status, cache behavior, and crawl depth. Correlate with sitemap hits and hub refreshes to map discovery to indexing.</AccordionContent></AccordionItem>
            <AccordionItem value="console"><AccordionTrigger>Search Console Patterns</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Use Page Indexing and URL Inspection to understand disposition. Address duplication, canonical conflicts, and blocked resources.</AccordionContent></AccordionItem>
            <AccordionItem value="analytics"><AccordionTrigger>Analytics & Conversions</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Track impressions, click‑through, dwell, and ultimate business actions. Links that help users tend to perform well over time.</AccordionContent></AccordionItem>
          </Accordion>
        </section>

        <section id="pricing" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Cost Landscape & ROI Thinking</h2>
          <p className="text-gray-700 leading-relaxed">Legacy tools often marketed one‑time fees or low recurring costs while promising large volumes of links. The modern cost model prioritizes assets that compound: quality pages, internal link architecture, feeds, and syndication relationships. These investments continue to pay dividends as your site grows—whereas generic, low‑value links create maintenance burdens and risk.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5"/> Compounding Assets</CardTitle></CardHeader><CardContent className="text-gray-700">Evergreen guides, well‑structured hubs, and contributor programs scale authority with each release.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookmarkCheck className="h-5 w-5"/> Sensible Anchors</CardTitle></CardHeader><CardContent className="text-gray-700">Use descriptive anchors that would make sense to editors and readers, not just algorithms.</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Anchor className="h-5 w-5"/> Risk Controls</CardTitle></CardHeader><CardContent className="text-gray-700">Avoid repetitive link patterns, thin pages, and automated posting to destinations that don’t welcome it.</CardContent></Card>
          </div>
        </section>

        <section id="stories" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">User Stories & Patterns</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Presentation className="h-5 w-5"/> SaaS Launch</CardTitle></CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">A small SaaS team publishes a sequence of onboarding guides and case studies. Each release updates hubs and feeds. Within weeks, server logs show consistent bot traffic to new URLs, and impressions climb without any footprint‑risky submissions.</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5"/> Local Services</CardTitle></CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">A regional service business organizes dozens of city‑specific pages under a well‑linked location hub, adds FAQ schema, and earns citations from local partners. Indexation improves, and leads increase steadily month‑over‑month.</CardContent>
            </Card>
          </div>
        </section>

        <section id="faq" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">No Hands SEO — Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="safe"><AccordionTrigger>Is volume‑first automated backlinking still safe?</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Generally no. Focus on editorial quality, policy‑welcomed placements, and strong internal linking. Use automation to assist—not to impersonate—humans.</AccordionContent></AccordionItem>
            <AccordionItem value="scale"><AccordionTrigger>How do I scale without spam?</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Scale signal, not noise: sharded sitemaps, refreshed hubs, clean HTML, and meaningful editorial placements.</AccordionContent></AccordionItem>
            <AccordionItem value="measure"><AccordionTrigger>What should I measure?</AccordionTrigger><AccordionContent className="text-gray-700 leading-relaxed">Bot hits, fetch status, renderability, duplication, impressions, and conversions. If users benefit, search engines usually follow.</AccordionContent></AccordionItem>
          </Accordion>
        </section>

        <section id="glossary" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Glossary</h2>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <Card><CardHeader><CardTitle>Discovery Signals</CardTitle></CardHeader><CardContent>Artifacts that help engines find and prioritize: sitemaps, feeds, hubs, and change logs.</CardContent></Card>
            <Card><CardHeader><CardTitle>Footprint</CardTitle></CardHeader><CardContent>Patterns that reveal automation or manipulation (repetitive anchors, identical templates, low‑value destinations).</CardContent></Card>
            <Card><CardHeader><CardTitle>Canonicalization</CardTitle></CardHeader><CardContent>Consistent URLs and signals that declare the preferred version of content.</CardContent></Card>
          </div>
        </section>

        <section id="resources" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Further Resources</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Server log analysis primers for SEO engineers</li>
            <li>Information architecture patterns for scalable internal linking</li>
            <li>Schema.org guides for FAQ, Article, and Breadcrumbs</li>
          </ul>
          <div className="border rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Build discovery the right way</h3>
                <p className="text-gray-700">Adopt the workflows above, instrument your stack, and iterate. Durable growth beats short‑lived spikes.</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</Button>
                <Button variant="outline" onClick={() => scrollTo('workflows')}>Start With Workflows</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-12">
          <BacklinkInfinityCTA
            title="Automate Your Link Building Workflow"
            description="Register for Backlink ∞ to execute automated, hands-off link-building strategies inspired by No Hands SEO. Access quality backlinks, scale your outreach, and drive sustainable traffic growth."
            variant="card"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
