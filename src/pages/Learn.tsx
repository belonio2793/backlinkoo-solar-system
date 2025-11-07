import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { scrollToTop } from "@/utils/scrollToTop";
import {
  BookOpen,
  GraduationCap,
  Search,
  Link as LinkIcon,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuthModal } from '@/contexts/ModalContext';
import TestimonialCard from '@/components/TestimonialCard';
import { Link } from 'react-router-dom';
import { stripeCheckout } from '@/services/universalStripeCheckout';
import { supabase } from '@/integrations/supabase/client';

// Example anonymized testimonials (illustrative only)
const TESTIMONIALS: Record<string, any> = {
  anchor: {
    title: "Local Bakery",
    url: "https://localbakery.example.com",
    keyword: "best sourdough near me",
    excerpt: "Baked goods shop reached #1 within 10 weeks for a local query after a focused page + outreach.",
    social: [
      { platform: 'facebook', handle: '@localbakery', url: 'https://facebook.com/localbakery' },
      { platform: 'instagram', handle: '@localbakery', url: 'https://instagram.com/localbakery' },
      { platform: 'yelp', handle: 'Local Bakery', url: 'https://yelp.com/biz/localbakery' },
    ],
    rankHistory: [
      { date: 'Week 1', rank: 12 },
      { date: 'Week 3', rank: 6 },
      { date: 'Week 6', rank: 2 },
      { date: 'Week 10', rank: 1 },
    ],
    visitsHistory: [
      { date: 'W1', visits: 55 },
      { date: 'W3', visits: 220 },
      { date: 'W6', visits: 410 },
      { date: 'W10', visits: 980 },
    ],
  },
  search: {
    title: "Joe's Plumbers",
    url: "https://joesplumbing.example.com",
    keyword: "plumber near me",
    excerpt: "Small service business climbed to #1 in under 4 months with content that matched local intent.",
    social: [
      { platform: 'twitter', handle: '@joesplumbers', url: 'https://twitter.com/joesplumbers' },
      { platform: 'facebook', handle: '@joesplumbers', url: 'https://facebook.com/joesplumbers' },
      { platform: 'linkedin', handle: 'Joe\'s Plumbers', url: 'https://linkedin.com/company/joesplumbers' },
    ],
    rankHistory: [
      { date: 'Month 1', rank: 18 },
      { date: 'Month 2', rank: 9 },
      { date: 'Month 3', rank: 3 },
      { date: 'Month 4', rank: 1 },
    ],
    visitsHistory: [
      { date: 'M1', visits: 120 },
      { date: 'M2', visits: 420 },
      { date: 'M3', visits: 780 },
      { date: 'M4', visits: 1500 },
    ],
  },
  keywords: {
    title: "Tanya's Studio",
    url: "https://tanyastudio.example.com",
    keyword: "yoga for beginners",
    excerpt: "Niche site gained top spot by answering the exact question users typed.",
    social: [
      { platform: 'instagram', handle: '@tanyastudio', url: 'https://instagram.com/tanyastudio' },
      { platform: 'facebook', handle: '@tanyastudio', url: 'https://facebook.com/tanyastudio' },
      { platform: 'youtube', handle: 'Tanya Studio', url: 'https://youtube.com/@tanyastudio' },
    ],
    rankHistory: [
      { date: 'W1', rank: 8 },
      { date: 'W4', rank: 4 },
      { date: 'W8', rank: 2 },
      { date: 'W12', rank: 1 },
    ],
    visitsHistory: [
      { date: 'W1', visits: 90 },
      { date: 'W4', visits: 300 },
      { date: 'W8', visits: 630 },
      { date: 'W12', visits: 1100 },
    ],
  },
  backlinks: {
    title: "Bob's Landscaping",
    url: "https://bobslandscaping.example.com",
    keyword: "garden maintenance services",
    excerpt: "Authority-building outreach resulted in a #1 ranking for local service queries.",
    social: [
      { platform: 'yelp', handle: 'Bobs Landscaping', url: 'https://yelp.com/biz/bobs-landscaping' },
      { platform: 'facebook', handle: '@bobslandscaping', url: 'https://facebook.com/bobslandscaping' },
      { platform: 'instagram', handle: '@bobs.landscaping', url: 'https://instagram.com/bobs.landscaping' },
    ],
    rankHistory: [
      { date: '1', rank: 22 },
      { date: '2', rank: 11 },
      { date: '3', rank: 5 },
      { date: '4', rank: 1 },
    ],
    visitsHistory: [
      { date: '1', visits: 40 },
      { date: '2', visits: 210 },
      { date: '3', visits: 480 },
      { date: '4', visits: 940 },
    ],
  },
  revenue: {
    title: "Clever Crafts",
    url: "https://clevercrafts.example.com",
    keyword: "handmade wooden toys",
    excerpt: "Niche e-commerce store captured #1 and saw conversion increases.",
    social: [
      { platform: 'pinterest', handle: '@clevercrafts', url: 'https://pinterest.com/clevercrafts' },
      { platform: 'instagram', handle: '@clevercrafts', url: 'https://instagram.com/clevercrafts' },
      { platform: 'facebook', handle: '@clevercrafts', url: 'https://facebook.com/clevercrafts' },
    ],
    rankHistory: [
      { date: 'Jan', rank: 14 },
      { date: 'Feb', rank: 7 },
      { date: 'Mar', rank: 3 },
      { date: 'Apr', rank: 1 },
    ],
    visitsHistory: [
      { date: 'Jan', visits: 210 },
      { date: 'Feb', visits: 430 },
      { date: 'Mar', visits: 760 },
      { date: 'Apr', visits: 1600 },
    ],
  },
  checklist: {
    title: "Local Tiler",
    url: "https://localtiler.example.com",
    keyword: "bathroom tiling near me",
    excerpt: "Simple checklist + a few contextual mentions moved this tradesperson to the top.",
    social: [
      { platform: 'facebook', handle: '@localtiler', url: 'https://facebook.com/localtiler' },
      { platform: 'instagram', handle: '@localtiler', url: 'https://instagram.com/localtiler' },
      { platform: 'nextdoor', handle: 'Local Tiler', url: 'https://nextdoor.com/localtiler' },
    ],
    rankHistory: [
      { date: '1', rank: 10 },
      { date: '2', rank: 6 },
      { date: '3', rank: 2 },
      { date: '4', rank: 1 },
    ],
    visitsHistory: [
      { date: '1', visits: 60 },
      { date: '2', visits: 190 },
      { date: '3', visits: 430 },
      { date: '4', visits: 900 },
    ],
  },
  faq: {
    title: "Neighborhood Mechanic",
    url: "https://neighborhoodmechanic.example.com",
    keyword: "car battery replacement near me",
    excerpt: "A targeted FAQ page + a few earned links took this local shop to the top.",
    social: [
      { platform: 'google', handle: 'Neighborhood Mechanic', url: 'https://maps.google.com/?cid=somecid' },
      { platform: 'facebook', handle: '@neighborhoodmechanic', url: 'https://facebook.com/neighborhoodmechanic' },
      { platform: 'yelp', handle: 'Neighborhood Mechanic', url: 'https://yelp.com/biz/neighborhoodmechanic' },
    ],
    rankHistory: [
      { date: '1', rank: 9 },
      { date: '2', rank: 5 },
      { date: '3', rank: 2 },
      { date: '4', rank: 1 },
    ],
    visitsHistory: [
      { date: '1', visits: 80 },
      { date: '2', visits: 240 },
      { date: '3', visits: 520 },
      { date: '4', visits: 1100 },
    ],
  },
};

const LearnPricing: React.FC = () => {
  const [customCredits, setCustomCredits] = React.useState<number | ''>('');
  const pricePer = 1.4;
  const total = typeof customCredits === 'number' && customCredits > 0 ? Number((customCredits * pricePer).toFixed(2)) : 0;
  const { openLoginModal } = useAuthModal();

  const ensureSignedIn = async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      openLoginModal({ reason: 'checkout' });
      return false;
    }
    return true;
  };

  const buyPreset = async (credits: number) => {
    if (!(await ensureSignedIn())) return;
    await stripeCheckout.quickBuyCredits(credits);
  };

  const buyCustom = async () => {
    if (!customCredits || customCredits <= 0) return;
    if (!(await ensureSignedIn())) return;
    await stripeCheckout.purchaseCredits({ credits: Number(customCredits), amount: total, productName: `${customCredits} Backlink Credits` });
  };

  const PlanCard = ({ title, price, credits }: { title: string; price: number; credits: number }) => (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold">${price}</div>
        <div className="text-sm text-slate-600 mt-1">{credits} Credits</div>
        <ul className="mt-3 text-sm text-slate-700 space-y-1">
          <li>High DA/DR contextual backlinks</li>
          <li>Live progress tracking</li>
          <li>Flexible campaign allocation</li>
        </ul>
        <Button className="mt-4 w-full" onClick={() => buyPreset(credits)}>Get Started</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Pricing</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanCard title="Starter 100" price={140} credits={100} />
        <PlanCard title="Starter 200" price={280} credits={200} />
        <PlanCard title="Starter 300" price={420} credits={300} />
      </div>

      <Card className="mt-4 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Custom Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Number of Credits</label>
              <input
                type="number"
                min={1}
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Total</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
            <div>
              <Button className="w-full" disabled={!total} onClick={buyCustom}>Purchase Custom Package</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const pages = [
  {
    key: "anchor",
    title: "Anchor text moves keywords",
    content: (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Anchor text matters — it directly signals what your page should rank for</h2>
        <p className="text-slate-700 leading-relaxed">
          When reputable websites link to your page using specific anchor text (the clickable words), search engines treat that
          anchor as a headline about your page. In short: well‑placed anchor text pointing to your URL helps the target
          phrase gain visibility and ranking potential. That’s why outreach with the right wording wins attention from search.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <div className="text-sm text-slate-600">Example anchor</div>
            <a href="/services/crm" className="mt-2 inline-block text-blue-700 font-semibold hover:underline">best CRM for freelancers</a>
            <div className="mt-2 text-xs text-slate-500">When other sites use this exact phrase, it helps engines associate that phrase with your page.</div>
          </div>

          <div className="rounded-md border border-slate-200 bg-blue-50 p-3 shadow-sm">
            <div className="text-xs font-semibold text-blue-700">Why it works</div>
            <ul className="mt-2 list-disc pl-5 text-slate-700">
              <li>Anchor text describes context — search engines read it as evidence.</li>
              <li>Multiple relevant anchors from different trusted sites compound the signal.</li>
              <li>Natural phrasing + brand builds credibility — avoid spammy exact-match patterns.</li>
            </ul>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="px-3 py-2 rounded bg-white border shadow-sm text-sm">
            <strong className="text-slate-900">Real outcome:</strong> more targeted organic visitors who already expect what you offer.
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-100">High intent traffic</Badge>
        </div>

        <div className="mt-3 text-xs text-slate-600">Pro tip: Combine brand + phrase in anchors ("Acme CRM — best CRM for freelancers") to stay natural and persuasive.</div>
      </div>
    ),
  },
  {
    key: "search",
    title: "What is a Search Engine?",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">What is a Search Engine — and why it chooses one page over another</h2>
        <p className="text-slate-700 leading-relaxed">
          Think of search engines as a marketplace where the winner solves the buyer’s question fastest, cleanest, and most
          convincingly. Factors like clarity, speed, and trust decide which page wins the top spot.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold">Speed & Experience</div>
            <p className="text-slate-700 text-sm mt-1">Fast, mobile-friendly pages keep people engaged — search notices and rewards that.</p>
          </div>
          <div className="rounded border border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold">Relevance & Trust</div>
            <p className="text-slate-700 text-sm mt-1">Clear content and trusted mentions (backlinks) tell search engines your page deserves to rank.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "keywords",
    title: "Keywords & Search Phrases",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Keywords = Customer Questions</h2>
        <p className="text-slate-700 leading-relaxed">
          Keywords are the language your customers use. The smarter you match their words and intent, the more likely they are to
          find and choose you.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            "plumber near me",
            "best crm for freelancers",
            "how to fix a leaking pipe",
            "organic dog treats",
          ].map((k) => (
            <Badge key={k} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {k}
            </Badge>
          ))}
        </div>

        <div className="mt-3 text-sm text-slate-700">
          Quick exercise: write a 150‑word page that answers one keyword question better than the top 3 results — then ask two trusted sites to link to it with natural anchor text.
        </div>
      </div>
    ),
  },
  {
    key: "backlinks",
    title: "Backlinks (Votes of Trust)",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Backlinks: real endorsements that build visibility</h2>
        <p className="text-slate-700 leading-relaxed">
          A backlink is the internet saying "this is useful". When authoritative, relevant sites link to you, search engines see
          a pattern: people trust this content — so it should rank higher.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-slate-200 p-3 bg-white">
            <div className="text-sm font-semibold">What to look for</div>
            <ul className="list-disc pl-5 text-slate-700 mt-2">
              <li>Relevance: same audience or topic</li>
              <li>Editorial placement: in‑article links beat footers</li>
              <li>Single, thoughtful link from a respected site beats many weak links</li>
            </ul>
          </div>

          <div className="rounded border border-slate-200 p-3 bg-white">
            <div className="text-sm font-semibold">Outreach play</div>
            <ol className="list-decimal pl-5 text-slate-700 mt-2">
              <li>Find a helpful resource you can add value to.</li>
              <li>Offer a concise improvement and ask for a contextual mention.</li>
              <li>Suggest natural anchor text that includes your phrase + brand.</li>
            </ol>
          </div>
        </div>

        <div className="mt-3">
          <blockquote className="border-l-2 pl-3 italic text-slate-700">"We doubled organic leads in 6 months after focused anchor outreach — all by improving relevance and asking for natural anchors." — Emily R., Founder</blockquote>
        </div>
      </div>
    ),
  },
  {
    key: "revenue",
    title: "Traffic, Sales, Revenue",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">How SEO and Backlinks Move the Needle</h2>
        <p className="text-slate-700 leading-relaxed">
          Ranking for the right phrases brings people who are already interested — that reduces acquisition cost and increases
          conversions. SEO compounds: the same page can bring traffic for months or years.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-slate-200 p-3 bg-white">
            <div className="text-sm font-semibold">Benefits</div>
            <ul className="list-disc pl-5 text-slate-700 mt-2">
              <li>Lower cost per lead</li>
              <li>Higher conversion because visitors have intent</li>
              <li>Long-term compounding traffic</li>
            </ul>
          </div>
          <div className="rounded border border-slate-200 p-3 bg-white text-sm">
            <div className="font-semibold">Mini case</div>
            <div className="text-slate-700 mt-2">A focused page + 5 contextual backlinks often outperforms a scattershot content strategy.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "checklist",
    title: "Rank keywords, unlock steady traffic",
    content: (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Getting keywords ranked is the best way to get traffic for your business</h2>
        <p className="text-slate-700 leading-relaxed">
          When your product, app, or software ranks for the exact phrases people search, you meet buyers at the moment of intent. That consistency delivers the highest conversions without guessing, gambling on paid ads, or hoping the algorithm smiles on you.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Why it outperforms ads</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> People arrive already searching for what you offer.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Organic clicks stay reliable long after an ad budget stops.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Clear rankings reveal which offers resonate — no guesswork.</li>
            </ul>
          </div>
          <div className="rounded border border-slate-200 bg-blue-50 p-4 shadow-sm text-sm text-slate-700">
            <div className="font-semibold text-blue-700">Put it into motion</div>
            <p className="mt-2">Match your pages to real keyword language, ship them fast, and track the phrases that climb. Each ranking secures compounding, intent-driven traffic for everything you can imagine selling.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "faq",
    title: "Common questions",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Common questions</h2>
        <div>
          <Accordion type="single" collapsible className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">Do I need lots of backlinks?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-slate-700">Yes. It depends on your keyword, competition, and what the battlefield looks like.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">How do I find the right keywords?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-slate-700">Talk to customers, see their language, then rank for the exact questions they ask.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">How long until results?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-slate-700">SEO compounds — you’ll often see initial movement in weeks and meaningful results in months. Consistency matters.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    ),
  },
  {
    key: "get-started",
    title: "Get started",
    content: (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Ready to get targeted traffic?</h2>
        <p className="text-slate-700 leading-relaxed">Start small: one clear page, one outreach list, one persuasive anchor. Repeat and measure.</p>
        <div className="flex flex-wrap gap-3"></div>

        <div className="mt-4 rounded border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Success signal</div>
          <div className="text-slate-700 mt-2">If a page gets higher click-throughs and time-on-page after a few quality backlinks — you’re on the right path.</div>
        </div>

        <LearnPricing />
      </div>
    ),
  },
];

export default function Learn() {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const touchStartX = React.useRef<number | null>(null);
  const { openLoginModal, openSignupModal } = useAuthModal();

  React.useEffect(() => {
    try { scrollToTop('smooth'); } catch { window.scrollTo(0, 0); }
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { scrollToTop('auto'); setIndex((i) => Math.min(i + 1, pages.length - 1)); }
      if (e.key === "ArrowLeft") { scrollToTop('auto'); setIndex((i) => Math.max(i - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    // focus container for keyboard access
    containerRef.current?.focus();
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) { scrollToTop('auto'); setIndex((i) => Math.min(i + 1, pages.length - 1)); }
    if (dx > 40) { scrollToTop('auto'); setIndex((i) => Math.max(i - 1, 0)); }
    touchStartX.current = null;
  };

  return (
    <div className="relative">
      <Header />
      <main className="relative z-10 min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto">
          <header className="mb-6 flex flex-col items-center justify-center gap-3 bg-transparent text-center">
            <div className="flex items-center gap-3 justify-center">
              <Button asChild variant="ghost" className="px-2">
                <Link to="/" className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10.707 1.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 9h1v7a1 1 0 001 1h4a1 1 0 001-1V12h2v4a1 1 0 001 1h4a1 1 0 001-1V9h1a1 1 0 00.707-1.707l-7-7z" />
                  </svg>
                  Home
                </Link>
              </Button>
              <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">Learn: How Backlinks &amp; SEO Work</h1>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <div className="text-sm text-slate-600">Page <strong>{index + 1}</strong> / {pages.length}</div>
              <div className="w-40 bg-slate-100 h-2 rounded overflow-hidden">
                <div className="h-2 bg-blue-500 transition-all" style={{ width: `${((index + 1) / pages.length) * 100}%` }} />
              </div>
            </div>
          </header>

          <div
            ref={containerRef}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="learn-glare-border rounded-2xl shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60"
            aria-roledescription="carousel"
            aria-label="Learn book carousel"
          >
            <div className="learn-glare-border__inner relative overflow-hidden rounded-[inherit] bg-white">
              <div
                className="flex w-full"
                style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 500ms cubic-bezier(.2,.9,.2,1)" }}
              >
                {pages.map((p) => (
                  <article key={p.key} className="w-full flex-shrink-0 p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                      <Card className="border-0 shadow-none">
                        <CardContent>
                          {p.content}
                          {/* Testimonial / results panel (anonymized examples) */}
                          <TestimonialCard t={TESTIMONIALS[p.key] ?? null} />
                        </CardContent>
                      </Card>
                    </div>
                  </article>
                ))}
              </div>

              <button
                aria-label="Previous page"
                onClick={() => { scrollToTop('auto'); setIndex((i) => Math.max(i - 1, 0)); }}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-slate-200 shadow-sm transition-opacity hover:scale-105 ${index === 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
              >
                <ArrowLeft className="h-4 w-4 text-slate-700" />
              </button>

              <button
                aria-label="Next page"
                onClick={() => { scrollToTop('auto'); setIndex((i) => Math.min(i + 1, pages.length - 1)); }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-slate-200 shadow-sm transition-opacity hover:scale-105 ${index === pages.length - 1 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
              >
                <ArrowRight className="h-4 w-4 text-slate-700" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { scrollToTop('auto'); setIndex(i); }}
                    aria-label={`Go to page ${i + 1}`}
                    className={`h-2 w-8 rounded-full transition-all ${i === index ? "bg-blue-600" : "bg-slate-200 hover:bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="text-sm text-slate-600">Use ← and → keys or swipe to flip pages</div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => { scrollToTop('auto'); setIndex(0); }}>Start over</Button>
              <Button onClick={() => { scrollToTop('auto'); setIndex((i) => Math.min(i + 1, pages.length - 1)); }}>Next</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
