import React, { useEffect, useMemo, useState } from 'react';
import { Check, Zap, Shield, BarChart3, Timer, Globe2, Crown, Link as LinkIcon, Boxes, BookOpen, Rocket, Stars, BadgePercent, LineChart, Layers, MoveRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const metaTitle = 'Rapid Link Indexer — Index URLs & Backlinks Fast (Pay‑for‑Performance)';
const metaDescription = 'Rapid Link Indexer: get website URLs and backlinks indexed quickly with safe methods, transparent reporting, and a pay‑only‑for��indexed‑links model. No GSC access required.';
const metaKeywords = 'rapid link indexer, link indexer, backlink indexing, index backlinks, url indexer, google indexing, indexation, indexing service, pay as you go indexing';

const Feature: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="group relative rounded-xl border bg-white/70 dark:bg-white/5 p-6 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <div className="absolute inset-0 rounded-xl bg-white" />
    <div className="relative flex items-start gap-4">
      <div className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-lg bg-white">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const Step: React.FC<{ n: number; title: string; desc: string }> = ({ n, title, desc }) => (
  <div className="relative pl-10">
    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center text-xs font-bold">{n}</div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs bg-white/70 dark:bg-white/10 backdrop-blur">
    <Stars className="h-3.5 w-3.5 text-amber-500" /> {children}
  </span>
);

const PriceCard: React.FC<{ title: string; credits: string; price: string; per: string; popular?: boolean }>
 = ({ title, credits, price, per, popular }) => (
  <Card className={`relative overflow-hidden border-2 ${popular ? 'border-primary shadow-lg' : 'border-border'}`}>
    {popular && (
      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary text-white px-2 py-1 text-xs">
        <Crown className="h-3.5 w-3.5" /> Most Popular
      </div>
    )}
    <div className="absolute inset-x-0 -top-10 h-28 bg-white" />
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="text-sm text-muted-foreground">{credits}</div>
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold tracking-tight">{price}</div>
        <div className="text-muted-foreground">{per}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> Pay‑for‑performance: credits auto‑refunded for unindexed links</li>
        <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> No subscription, no lock‑in</li>
        <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> Detailed index reports & CSV export</li>
      </ul>
      <Button className="mt-6 w-full" size="lg">
        Buy {credits}
      </Button>
    </CardContent>
  </Card>
);

const RapidLinkIndexer: React.FC = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', metaKeywords);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(1200px 600px at 80% -10%, rgba(59, 130, 246, 0.15), transparent 60%)' }} />
        <div className="container mx-auto px-4 pt-16 pb-10 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              <Badge>Rapid link indexer</Badge>
              <Badge>Pay only for indexed links</Badge>
              <Badge>No GSC access required</Badge>
            </div>
            <h1 className="max-w-5xl text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Index URLs & Backlinks Fast with a Modern Rapid Link Indexer
            </h1>
            <p className="mt-5 max-w-3xl text-muted-foreground text-lg leading-relaxed">
              Accelerate Google discovery for website content, new posts, and backlinks. Safe methods, transparent reporting, and a no‑risk, pay‑for‑performance model where credits are automatically refunded for unindexed links.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-2">
                <Rocket className="h-4 w-4" /> Start Indexing
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <LineChart className="h-4 w-4" /> View Reports Demo
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> 100% safe methods</div>
              <div className="inline-flex items-center gap-2"><BadgePercent className="h-4 w-4" /> Pay‑as‑you‑go pricing</div>
              <div className="inline-flex items-center gap-2"><Timer className="h-4 w-4" /> Reports in ~4–14 days</div>
              <div className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Works for any language</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How the Rapid Link Indexer Works</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Three streamlined steps. Submit URLs, our system triggers safe crawl and discovery signals, then you review comprehensive reports with automatic credit refunds for anything that doesn’t index.
            </p>
            <div className="mt-6 space-y-5">
              <Step n={1} title="Submit Your URLs" desc="Create a project, paste your URLs (site pages, new posts, or backlinks), and start the job. No Search Console connection is required." />
              <Step n={2} title="Crawl & Indexing Signals" desc="We orchestrate discovery mechanisms that encourage Googlebot to fetch and index. There are no spammy blasts or risky schemes—just clean, safe signals." />
              <Step n={3} title="Verify Results & Refunds" desc="You receive an initial report after ~4 days and final charts around ~14 days. Any unindexed URLs automatically refund credits back to your balance." />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-white" />
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Transparent Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> Time‑phased charts show crawled vs indexed counts</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> CSV export and per‑URL status logs</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> Project‑level and batch‑level summaries</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5" /> Credits automatically returned for unindexed links</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section id="features" className="container mx-auto px-4 pb-6">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why This Rapid Link Indexer Wins</h2>
          <p className="mt-3 text-muted-foreground max-w-3xl">Built for agencies, SEOs, and publishers who need reliable indexation without risk. We emphasize safety, control, and clarity.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature icon={<Shield className="h-5 w-5" />} title="Safe by Design" desc="No spammy link blasts or PBN footprints. Discovery signals are engineered to be compliant and scalable." />
          <Feature icon={<Zap className="h-5 w-5" />} title="Speed with Accountability" desc="Progressive checks ensure your links are actually discovered and indexed—or you get credits back." />
          <Feature icon={<BarChart3 className="h-5 w-5" />} title="Actionable Reporting" desc="Everything is logged: attempts, status changes, and final outcomes with exportable CSVs." />
          <Feature icon={<Globe2 className="h-5 w-5" />} title="Language‑Agnostic" desc="Works for any locale and market. Use it for local citations, GBP pages, and international sites." />
          <Feature icon={<LinkIcon className="h-5 w-5" />} title="Website & Backlinks" desc="Index money pages, blogs, PR, and Tier‑1 to Tier‑3 backlinks—including brand profiles and citations." />
          <Feature icon={<Boxes className="h-5 w-5" />} title="Flexible Projects" desc="Organize runs by client or campaign. Upload lists, tag items, and track batch‑level success." />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-14">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-2 text-muted-foreground">Pay once. No subscriptions. Credits auto‑refund for unindexed links.</p>
          </div>
          <div className="text-sm text-muted-foreground">Effective per‑link price improves at higher tiers</div>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <PriceCard title="Starter" credits="500 credits" price="$25" per="$0.05 / credit" />
          <PriceCard title="Growth" credits="1,500 credits" price="$68" per="$0.045 / credit" />
          <PriceCard title="Agency" credits="5,000 credits" price="$213" per="$0.042 / credit" popular />
          <PriceCard title="Enterprise" credits="50,000 credits" price="$2,000" per="$0.04 / credit" />
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Prices indicative and subject to change. Credits are consumed only for successfully indexed links.</p>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold tracking-tight">Where Rapid Indexing Matters Most</h2>
            <p className="mt-3 text-muted-foreground">From product pages to publisher content and local SEO signals, faster discovery compounds ROI.</p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
            <Feature icon={<BookOpen className="h-5 w-5" />} title="Fresh Content" desc="Launch posts and landing pages right when momentum is highest. Get crawled and indexed sooner." />
            <Feature icon={<LinkIcon className="h-5 w-5" />} title="Backlink Indexing" desc="Index tiered links, brand profiles, citations, PR, and digital PR placements that need visibility." />
            <Feature icon={<Layers className="h-5 w-5" />} title="Technical SEO" desc="Resolve orphan pages and fast‑track critical pages into the index during migrations and site launches." />
            <Feature icon={<LineChart className="h-5 w-5" />} title="Local SEO" desc="Boost discovery for GBP pages, NAP citations, and local directories—multi‑location friendly." />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How We Compare</h2>
          <p className="mt-2 text-muted-foreground">Key differentiators that matter in practice.</p>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-3 font-semibold">Capability</th>
                <th className="text-left p-3 font-semibold">This Rapid Link Indexer</th>
                <th className="text-left p-3 font-semibold">Typical Indexers</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Pay‑for‑performance</td>
                <td className="p-3">Credits auto‑refunded for unindexed URLs</td>
                <td className="p-3">Often pay regardless of outcome</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">GSC requirement</td>
                <td className="p-3">Not required</td>
                <td className="p-3">Sometimes required or recommended</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Safety profile</td>
                <td className="p-3">White‑hat discovery signals, spam‑free</td>
                <td className="p-3">Mixed methods, occasional spam risk</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Reporting depth</td>
                <td className="p-3">Time‑phased charts, per‑URL logs, CSV</td>
                <td className="p-3">Basic counters or opaque summaries</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Extended Guide */}
      <section id="extended-guide" className="container mx-auto px-4 py-10">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Extended Rapid Link Indexer Guide</h2>
          <p className="mt-3 text-muted-foreground">Generate additional long‑form sections (~1k words per click) to expand this page toward 10,000 words. Content is created server‑side via our AI writer and appended below.</p>
          <ExtendedGenerator />
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-14">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Rapid Link Indexer FAQs</h2>
          <p className="mt-3 text-muted-foreground">Clear answers to the most common questions from SEOs and site owners.</p>
          <Accordion type="single" collapsible className="mt-6 divide-y rounded-lg border overflow-hidden bg-card">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4 sm:px-5">What is a rapid link indexer?</AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                A rapid link indexer is a service that accelerates search engine discovery for your URLs—website pages and backlinks—so they can enter the index faster. We focus on safe discovery signals with verifiable reporting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4 sm:px-5">Is this safe for my domain and clients?</AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                Yes. We avoid spammy link blasts and questionable footprints. Our approach emphasizes clean, white‑hat discovery that plays well with modern search engine crawlers and quality guidelines.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4 sm:px-5">Do I need Google Search Console access?</AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                No. You can submit any URL—even if you don’t own it or lack GSC access. This is ideal for agencies indexing client placements, citations, and PR.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4 sm:px-5">How fast are results?</AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                You’ll typically see an initial report around ~4 days and a final results view around ~14 days. Timing varies by site, crawl budget, and link type.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="px-4 sm:px-5">What happens if a URL doesn’t index?</AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                Credits used for any unindexed URL are automatically refunded back to your balance. You pay only for successfully indexed links.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <BacklinkInfinityCTA
          title="Ready to Accelerate Indexation?"
          description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
        />
      </section>
      <Footer />
    </div>
  );
};

const ExtendedGenerator: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalWords, setTotalWords] = useState(0);

  const avoidHeadings = useMemo(() => {
    const matches = Array.from(content.matchAll(/^##\s+(.+)$/gm));
    return matches.map(m => m[1]).slice(-20);
  }, [content]);

  const generate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/.netlify/functions/generate-rapid-indexer-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Rapid Link Indexer — advanced indexing strategies', keyword: 'rapid link indexer', intent: 'SEO landing page', avoid_headings: avoidHeadings, target_words: 1200 })
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Failed to generate');
      const block = String(data.content || '').trim();
      setContent(prev => prev + (prev ? '\n\n' : '') + block);
      setTotalWords(prev => prev + (Number(data.word_count) || 0));
    } catch (e: any) {
      setError(e?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <Button size="lg" className="gap-2" onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate ~1,200 words'}
        </Button>
        <div className="text-sm text-muted-foreground">Total generated ~{totalWords.toLocaleString()} words</div>
      </div>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      {content && (
        <div className="mt-6 prose max-w-none">
          <MarkdownRenderer content={content} type="blog" />
        </div>
      )}
    </div>
  );
};

export default RapidLinkIndexer;
