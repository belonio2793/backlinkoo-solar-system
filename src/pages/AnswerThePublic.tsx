import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Sparkles, ListChecks, Download, ArrowLeft, ArrowRight, BarChart3, Globe2, Wand2 } from 'lucide-react';
import '@/styles/answerthepublic.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; el.text = text; document.head.appendChild(el); } else { el.text = text; }
}

function useProgress(selector: string) {
  React.useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.atp-progress__bar') as HTMLDivElement | null;
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
        <h3>Expanded Guide</h3>
        <p>This section contains methodology, examples, prompt lists, and checklists for using search listening responsibly and effectively.</p>
      </section>
      <section>
        <h4>Prompt Lists & Examples</h4>
        <p>Use structured prompts to explore question families and translate them into briefs for writers and subject matter experts.</p>
      </section>
      <section>
        <h4>Checklists</h4>
        <ul>
          <li>Ensure unique, helpful answers for each significant query.</li>
          <li>Pair outputs with data and examples to avoid thin content.</li>
          <li>Validate ideas with user testing where possible.</li>
        </ul>
      </section>
    </div>
  );
}

function IdeaSimulator() {
  const [seed, setSeed] = React.useState('Answer The Public');
  const [complexity, setComplexity] = React.useState<number[]>([40]);
  const families = ['what','why','how','where','which','can','best','near','vs','for'];
  const ideas = React.useMemo(() => {
    const s = seed.trim();
    const rows: string[] = [];
    for (const f of families) {
      rows.push(`${f} ${s}`);
      if (complexity[0] > 20) rows.push(`${f} is ${s} good for`);
      if (complexity[0] > 35) rows.push(`${f} does ${s} work`);
      if (complexity[0] > 50) rows.push(`${f} to use ${s} for content ideas`);
      if (complexity[0] > 65) rows.push(`${f} alternatives to ${s}`);
      if (complexity[0] > 80) rows.push(`${f} ${s} pricing and limits`);
    }
    return rows;
  }, [seed, complexity]);
  const downloadCSV = () => {
    const csv = ['query'].concat(ideas).map(v => '"'+v.replace(/"/g,'""')+'"').join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${seed.replace(/\s+/g,'-').toLowerCase()}-ideas.csv`; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-emerald-600"/> Question Idea Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 not-prose">
          <div className="grow min-w-[240px]">
            <label className="text-sm text-slate-500">Seed topic</label>
            <input value={seed} onChange={e=>setSeed(e.target.value)} placeholder="Type a topic" className="w-full rounded-md border px-3 py-2" />
          </div>
          <Button variant="secondary" onClick={downloadCSV} className="rounded-full" size="sm"><Download className="h-4 w-4 mr-1"/>Download CSV</Button>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm"><span>Variation level</span><span>{complexity[0]}%</span></div>
          <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} aria-label="Variation" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
          {ideas.slice(0,60).map(q => (<div key={q} className="px-2 py-1 rounded border bg-white/70 dark:bg-slate-900/40">{q}</div>))}
        </div>
      </CardContent>
    </Card>
  );
}

const metaTitle = 'Answer The Public: Deep Guide, How It Works, Pricing Context, Alternatives, and Best Practices (2025)';
const metaDescription = 'An independent, comprehensive guide to Answer The Public: search listening explained, visualizations, content ideation workflows, pricing context, and ethical, modern SEO practices.';

export default function AnswerThePublic() {
  useProgress('#atp-content');
  const canonical = React.useMemo(() => {
    try { const base = typeof window !== 'undefined' ? window.location.origin : ''; return `${base}/answerthepublic`; } catch { return '/answerthepublic'; }
  }, []);
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Answer The Public, AnswerThePublic, search listening, question keywords, keyword visualization, content ideation, pricing, alternatives');
    upsertCanonical(canonical);
    injectJSONLD('atp-webpage', { '@context':'https://schema.org', '@type':'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage:'en' });
    injectJSONLD('atp-breadcrumbs', { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[ { '@type':'ListItem', position:1, name:'Home', item:'/' }, { '@type':'ListItem', position:2, name:'Answer The Public Guide', item:'/answerthepublic' } ] });
    injectJSONLD('atp-faq', { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:[ { '@type':'Question', name:'What is Answer The Public?', acceptedAnswer:{ '@type':'Answer', text:'A keyword research and search listening tool that surfaces questions and phrases people search for around a topic.' } }, { '@type':'Question', name:'Is there a free plan?', acceptedAnswer:{ '@type':'Answer', text:'Free access and paid tiers are commonly offered; check the official site for current allowances and pricing.' } }, { '@type':'Question', name:'What are good alternatives?', acceptedAnswer:{ '@type':'Answer', text:'Any tool that helps you understand user intent: Google Search Console, People Also Ask explorers, Keyword Planner, and entity analyzers.' } } ] });
  }, [canonical]);

  const nav = [
    { id:'intro', label:'Overview' },
    { id:'how', label:'How It Works' },
    { id:'features', label:'Features' },
    { id:'widgets', label:'Widgets' },
    { id:'pricing', label:'Pricing Context' },
    { id:'use-cases', label:'Use Cases' },
    { id:'alternatives', label:'Alternatives' },
    { id:'faq', label:'FAQ' },
    { id:'research', label:'Expanded Guide' },
    { id:'cta', label:'Get Started' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50 via-white to-indigo-50 atp-compact">
      <Header />
      <div className="atp-progress" aria-hidden="true"><div className="atp-progress__bar"/></div>
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="atp-hero" aria-labelledby="page-title">
          <p className="atp-kicker">Independent Editorial</p>
          <h1 id="page-title" className="atp-title">Answer The Public</h1>
          <p className="atp-subtitle">A deep, objective guide to Answer The Public—how search listening works, how to turn questions into briefs, and how to build an ethical content engine around genuine user intent.</p>
          <div className="atp-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0,10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Read time: 60+ minutes</span>
          </div>
          <div className="atp-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full"><a href="#widgets">Try Demo</a></Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full"><a href="#pricing">See Pricing Context</a></Button>
            <Badge className="ml-3" variant="secondary">2025 Guide</Badge>
          </div>
        </header>

        <div className="atp-layout">
          <nav className="atp-toc" aria-label="On this page">
            <div className="atp-toc__title">On this page</div>
            <ul>{nav.map(n => (<li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>))}</ul>
          </nav>

          <article id="atp-content" className="atp-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="atp-section">
              <h2>What Answer The Public Is (and Isn’t)</h2>
              <p>Answer The Public is a search listening and keyword ideation tool. You enter a topic and the system organizes real queries into familiar patterns—questions, prepositions, comparisons, and A–Z lists—so you can see what people are actually asking. This guide explains the method, shows practical workflows, and highlights ways to use question‑driven research responsibly in 2025.</p>
              <ul>
                <li>Understand how question clustering reveals intent along the buyer journey.</li>
                <li>Translate raw queries into briefs, outlines, and FAQ structures that help users.</li>
                <li>Combine first‑party data and editorial judgment for durable results.</li>
              </ul>
            </section>

            <section id="how" className="atp-section">
              <h2>How It Works</h2>
              <div className="grid grid-cols-1 gap-6">
                {[{title:'Search Listening', body:'Aggregate and normalize queries from multiple sources to surface natural‑language questions and phrases.'},{title:'Clustering', body:'Group by patterns like questions, prepositions, comparisons, and alphabetized expansions to map breadth quickly.'},{title:'Visualization', body:'Present clusters as wheels, lists, or graphs so teams can scan and select viable angles.'},{title:'Export & Briefs', body:'Copy or export selected phrases into notes and content briefs for editors and SMEs.'}].map(c => (
                  <Card key={c.title}><CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-4 w-4 text-emerald-600"/>{c.title}</CardTitle></CardHeader><CardContent><p>{c.body}</p></CardContent></Card>
                ))}
              </div>
              <p className="mt-4">The outcome is not just a list of keywords—it is a prioritized understanding of questions worth answering. Pair the outputs with expertise, examples, and evidence to create something genuinely useful.</p>
            </section>

            <section id="features" className="atp-section">
              <h2>Key Features</h2>
              <div className="grid grid-cols-1 gap-6">
                {[{title:'Question Families', body:'What, why, how, where, which, can—organized to mirror real intent.'}, {title:'Prepositions & Comparisons', body:'Discover "for", "with", "near", and X vs Y phrasing to identify decision criteria.'}, {title:'Alphabetical Expansions', body:'A–Z lists uncover long‑tail phrasings editors often miss.'}, {title:'Exports', body:'Move shortlists into CSV, notes, or planning tools to build briefs and sitemaps.'}, {title:'Team Collaboration', body:'Use shared lists and consistent naming so research scales across teams.'}].map(c => (
                  <Card key={c.title}><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-600"/>{c.title}</CardTitle></CardHeader><CardContent><p>{c.body}</p></CardContent></Card>
                ))}
              </div>
            </section>

            <section id="widgets" className="atp-section">
              <h2>Interactive Widgets</h2>
              <div className="grid grid-cols-1 gap-6 not-prose">
                <IdeaSimulator />
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-emerald-600"/> Simple Intent Mix</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-3">Estimate how your plan balances awareness, consideration, and decision content.</p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {['Awareness (what/why)','Consideration (how/which)','Decision (vs/near/pricing)'].map((l,i)=> (
                        <div key={l} className="flex items-center gap-2"><span className="shrink-0 w-40">{l}</span><div className="grow h-2 bg-slate-200 dark:bg-slate-800 rounded"><div className="h-2 bg-gradient-to-r from-emerald-400 to-indigo-500 rounded" style={{width:`${40 + i*20}%`}}/></div></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="pricing" className="atp-section">
              <h2>Pricing Context</h2>
              <p>Pricing and allowances change; always confirm on the official site. Typically, free access has limited searches, while paid tiers raise limits and add exports or collaboration. Choose a plan based on cadence: weekly ideation for a small blog differs from a newsroom with daily briefs.</p>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm">
                  <thead><tr><th className="text-left p-2">Plan</th><th className="text-left p-2">Best for</th><th className="text-left p-2">Highlights</th></tr></thead>
                  <tbody>
                    <tr><td className="p-2">Free/Trial</td><td className="p-2">Occasional checks</td><td className="p-2">Limited searches; good for quick validation</td></tr>
                    <tr><td className="p-2">Pro</td><td className="p-2">Regular publishing</td><td className="p-2">More searches, exports, faster workflow</td></tr>
                    <tr><td className="p-2">Team</td><td className="p-2">Editorial teams</td><td className="p-2">Shared lists, governance, higher limits</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="use-cases" className="atp-section">
              <h2>Use Cases</h2>
              <Tabs defaultValue="content">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
                <TabsContent value="content"><p>Generate angles for blog posts, scripts, and social threads. Build briefs around specific question clusters and cite sources.</p></TabsContent>
                <TabsContent value="seo"><p>Map question families to hubs and FAQs. Use internal links to connect related answers and support core pages.</p></TabsContent>
                <TabsContent value="research"><p>Summarize what people struggle with, then route insights to product and UX. Track trends month over month.</p></TabsContent>
                <TabsContent value="support"><p>Expand help centers by turning recurring questions into searchable, structured articles.</p></TabsContent>
              </Tabs>
            </section>

            <section id="alternatives" className="atp-section">
              <h2>Alternatives and Complements</h2>
              <div className="grid grid-cols-1 gap-6">
                {[{title:'Search Console', body:'Mine your own queries to find questions you already attract and pages to strengthen.'},{title:'People Also Ask explorers', body:'Scrape responsibly to study follow‑up questions and semantic neighbors.'},{title:'Planner + Entity tools', body:'Blend volume estimates with entity extraction to avoid thin, duplicate angles.'}].map(c => (
                  <Card key={c.title}><CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-indigo-600"/>{c.title}</CardTitle></CardHeader><CardContent><p>{c.body}</p></CardContent></Card>
                ))}
              </div>
            </section>

            <section id="faq" className="atp-section">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="free"><AccordionTrigger>Is there a free version?</AccordionTrigger><AccordionContent>Usually there is a limited free tier or trial. Check the official site for current terms.</AccordionContent></AccordionItem>
                <AccordionItem value="data"><AccordionTrigger>Where does the data come from?</AccordionTrigger><AccordionContent>Search listening aggregates anonymized queries and organizes them into patterns. Exact sources and sampling vary over time.</AccordionContent></AccordionItem>
                <AccordionItem value="exports"><AccordionTrigger>Can I export results?</AccordionTrigger><AccordionContent>Most paid tiers enable copy/export features. Our simulator above exports example prompts to CSV for planning.</AccordionContent></AccordionItem>
              </Accordion>
            </section>

            <section id="research" className="atp-section">
              <h2>Expanded Guide</h2>
              <p>Below is an extended guide with methodology, examples, prompt lists, and checklists.</p>
              <InlineExpandedGuide />
            </section>

            <section id="cta" className="atp-section">
              <h2>Next Steps</h2>
              <div className="space-y-4">
                <article className="rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Search className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Expand keyword discovery with structured prompts</h3>
                        <p className="mt-1 text-sm text-slate-600">Capture the full spectrum of question families, export prioritized lists, and brief writers without overwhelming spreadsheets.</p>
                      </div>
                      <a className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-200 px-5 py-2 text-sm font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" href="/keyword-research">
                        Visit research workspace
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <BarChart3 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Monitor rankings calmly and share trends</h3>
                        <p className="mt-1 text-sm text-slate-600">Keep stakeholders aligned with scheduled summaries, annotations, and dependable week-over-week comparisons.</p>
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
        <section className="mt-12 px-4 md:px-6">
          <BacklinkInfinityCTA
            title="Answer Your Audience With Quality Backlinks"
            description="Register for Backlink ∞ to combine AnswerThePublic keyword insights with quality backlinks. Drive traffic to pages that address real search questions and build authority."
            variant="card"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
