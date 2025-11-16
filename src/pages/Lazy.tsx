import React, { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Zap, Inbox, Search, BookOpen, Link as LinkIcon, Image as ImageIcon, Video, Quote, Network as GraphIcon, Command, Calendar, Tag, Share2, Shield, BarChart3, Brain, Layers } from 'lucide-react';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[property="${property}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'Lazy: Universal Clipper and Knowledge Inbox | Connected Graph Notes & Seamless Capture';
const metaDescription = 'Comprehensive guide to Lazy.so — capture anything with a shortcut, organize in an inbox, and connect ideas in a graph. Features, workflows, comparisons, best practices, testimonials, and FAQ for a beautiful, SEO‑focused page.';

const lazyFaqs = [
  {
    q: 'What is Lazy?',
    a: 'Lazy is a universal clipper and knowledge inbox. With a single shortcut, you can capture text, quotes, links, images, and video snippets from anywhere and organize them into a connected graph of ideas.'
  },
  {
    q: 'How does Lazy help research and writing?',
    a: 'Capture highlights without breaking flow, then review in an organized inbox. The graph view reveals connections between notes, helping you outline, draft, and synthesize faster.'
  },
  {
    q: 'Does Lazy work across apps and the web?',
    a: 'Yes. The clipper accepts content from browsers and native apps. Keyboard‑first commands let you tag, link, and share without switching context.'
  },
  {
    q: 'Is there a mobile app?',
    a: 'Lazy emphasizes Mac and iOS for capture and review, with a web experience for universal access. Your notes stay synced across devices.'
  },
  {
    q: 'What are the pricing options?',
    a: 'Simple subscriptions with monthly and annual plans. All core features are included; choose billing that matches your workflow cadence.'
  },
  {
    q: 'Is my data private and secure?',
    a: 'Lazy prioritizes user trust with encryption in transit and at rest. You control sharing, exports, and integrations. Backups and auditability support long‑term knowledge safety.'
  }
];

export default function LazyPage() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/lazy`;
    } catch {
      return '/lazy';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Lazy.so, universal clipper, knowledge inbox, connected graph, note taking, research workflow, markdown, command bar, productivity, PKM');
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);

    injectJSONLD('lazy-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('lazy-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().split('T')[0],
      inLanguage: 'en',
      keywords: 'Lazy.so, universal clipper, knowledge graph'
    });

    injectJSONLD('lazy-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: lazyFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }, [canonical]);

  return (
    <div className="lazy-page min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-violet-200 text-sm font-semibold">
              <Command className="inline w-4 h-4 mr-2" />
              Capture Everything with One Shortcut
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Lazy: The Universal Clipper and Connected Graph for Your Notes
            </h1>
            <p className="text-lg sm:text-xl text-violet-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Save quotes, links, articles, images, and video moments without breaking flow. Review in a clean inbox and connect ideas in a beautiful graph that helps your thinking scale.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Capture Speed', value: 'Instant', icon: Zap },
              { label: 'Inbox Control', value: 'Unified', icon: Inbox },
              { label: 'Graph View', value: 'Connected', icon: GraphIcon },
              { label: 'Command Bar', value: 'Keyboard‑first', icon: Command }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-violet-300" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-violet-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <article>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Intro */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why a Universal Clipper Changes How You Work</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">The best ideas often appear while you’re focused elsewhere. Lazy removes friction from capture: one shortcut clips what matters, whether it's a sentence in a PDF, a tweet thread, a timestamped video insight, or a web highlight. Everything lands in a single inbox, ready for triage when you’re in review mode—not in the middle of flow.</p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">Over time, the connected graph turns scattered highlights into a living knowledge base. Links between notes illuminate patterns, help you recall context, and accelerate outlining and writing. Instead of losing insights across apps, you compound them in one place.</p>
          </section>

          {/* Features */}
          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4"><Search className="w-6 h-6 text-violet-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Clip Across the Stack</h3>
              <p className="text-slate-700 leading-relaxed">Grab text, links, images, and video frames from browsers and native apps. The clipper recognizes content types so you can organize and filter fast.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><Inbox className="w-6 h-6 text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Unified Inbox Review</h3>
              <p className="text-slate-700 leading-relaxed">Process captured items in batches. Tag, link, archive, or schedule follow‑ups. Keep your research moving without context switching.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-purple-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Markdown‑Friendly Notes</h3>
              <p className="text-slate-700 leading-relaxed">Compose with structure. Headings, lists, and code blocks make writing and technical notes clear and portable.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4"><GraphIcon className="w-6 h-6 text-pink-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connected Graph of Ideas</h3>
              <p className="text-slate-700 leading-relaxed">Link notes and concepts to reveal patterns. Use backlinks to navigate thinking and resurface relevant context when drafting.</p>
            </div>
          </section>

          {/* Workflows */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Workflows that Compound Knowledge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Reading & Research</h3>
                <p>Clip highlights and quotes as you read. Tag by project, then review in the inbox to connect related ideas in the graph.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Writing & Outlining</h3>
                <p>Turn linked notes into outlines. Use backlinks to pull supporting ideas into drafts without hunting across tabs.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Video & Audio Snippets</h3>
                <p>Save timestamped insights from talks and podcasts. Reference them later with context intact.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Team Knowledge</h3>
                <p>Share curated links and threads. Keep a living repository of references that stays discoverable over time.</p>
              </div>
            </div>
          </section>

          {/* Comparisons */}
          <section className="mb-16">
            <h3>Lazy vs. Manual Capture Stacks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Capability</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">Lazy</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">DIY Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Capture speed', 'Instant shortcut', 'Copy/paste friction'],
                    ['Cross‑app support', 'Browser + native apps', 'App‑specific workarounds'],
                    ['Organization', 'Unified inbox + tags', 'Scattered folders and tabs'],
                    ['Connections', 'Graph + backlinks', 'Manual linking'],
                    ['Focus', 'Keyboard‑first commands', 'Mouse‑heavy context switching']
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-4 px-4 font-semibold text-slate-900">{row[0]}</td>
                      <td className="py-4 px-4 text-center text-emerald-600 font-semibold">{row[1]}</td>
                      <td className="py-4 px-4 text-center text-slate-500">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-16 bg-white border border-slate-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Best Practices for Effortless Capture</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Clip first, organize later—protect your flow state.</li>
              <li>Use a small, stable tag set so recall stays simple.</li>
              <li>Review your inbox at a fixed cadence to prevent drift.</li>
              <li>Link notes liberally; the graph pays dividends over time.</li>
              <li>Write summaries for dense clips to future‑proof your memory.</li>
            </ul>
          </section>

          {/* Case Studies */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Case Studies</h2>
            <div className="space-y-6 text-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Research Analyst</h3>
                <p>Moved from scattered bookmarks to a single inbox with linked briefs. Time‑to‑draft dropped as highlights flowed into structured notes.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Content Creator</h3>
                <p>Captured quotes and video timestamps during viewing sessions. Weekly review turned snippets into scripts with clear citations.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Founding Team</h3>
                <p>Curated competitor links and user feedback into a shared graph. Decisions sped up as context remained one keystroke away.</p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <h3>What People Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { quote: 'The shortcut capture changed how I read. I never leave flow, but nothing gets lost.', author: 'Amelia R.', role: 'Researcher' },
                { quote: 'Inbox review plus the graph view makes outlining effortless. My drafts assemble themselves.', author: 'Kenji T.', role: 'Writer' },
                { quote: 'Cross‑app capture finally works the way it should. One system for everything I care about.', author: 'Lena S.', role: 'Engineer' },
                { quote: 'I trust my archive now. Notes link back to sources, so my team can verify in seconds.', author: 'Marco V.', role: 'PM' }
              ].map((t, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4"><div className="text-yellow-400 text-lg">★</div><div className="text-yellow-400 text-lg">★</div><div className="text-yellow-400 text-lg">★</div><div className="text-yellow-400 text-lg">★</div><div className="text-yellow-400 text-lg">★</div></div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="border-t border-slate-200 pt-4"><p className="font-bold text-slate-900">{t.author}</p><p className="text-sm text-slate-600">{t.role}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {lazyFaqs.map((f, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-white border border-slate-200 rounded-lg px-6 overflow-hidden">
                  <AccordionTrigger className="py-4 font-semibold text-slate-900 hover:text-violet-600 transition-colors">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-slate-700 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Closing perspective */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">From Friction to Flow: Building a Connected Brain</h2>
            <p className="text-slate-700 leading-relaxed mb-6">A knowledge system compounds value when capture is effortless, review is rhythmic, and connections are visible. Lazy aligns these pieces: fast input, an inbox for triage, and a graph for insight. The result is a durable, searchable memory that keeps shipping ideas instead of scattering them.</p>
            <p className="text-slate-700 leading-relaxed mb-6">Whether you’re researching, writing, building, or leading, a connected note graph turns your day‑to‑day highlights into long‑term leverage. That is the promise of a universal clipper done right.</p>
          </section>

          {/* Final CTA: only Backlink∞ registration */}
          <section className="mb-0">
            <div className="bg-violet-600 rounded-lg p-12 text-center">
              <h3>Grow Organic Traffic with Strategic Backlinks</h3>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">Publishing guides about personal knowledge management, capture workflows, or connected graphs? Earn topical authority with high‑quality backlinks to rank for competitive productivity keywords.</p>
              <p className="text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed">Backlink ∞ acquires relevant, reputable backlinks that compound your organic reach. Register to start building durable search visibility.</p>
              <a href="https://backlinkoo.com/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-violet-700 font-semibold rounded-lg hover:bg-violet-50 transition-colors">
                Register for Backlink ∞
                <ArrowRight className="ml-3 w-5 h-5" />
              </a>
              <p className="text-violet-200 text-sm mt-8">Establish authority • Rank for productivity keywords • Convert engaged readers</p>
            </div>
          </section>

        </div>
      </article>

      <Footer />
    </div>
  );
}
