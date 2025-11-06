import React, { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Globe, Zap, Database, Search, Shield, BarChart3, FileText, Network, Link as LinkIcon, Layers, Megaphone, Building2 } from 'lucide-react';

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

const metaTitle = 'Dappier: Real‑Time Data for AI via RAG APIs | Publisher Marketplace & Integrations';
const metaDescription = 'Deep dive on Dappier. Build AI features with real‑time, trusted data using RAG APIs; integrate with GPTs, LangChain and more; monetize publisher content through an AI data marketplace; analytics, governance, and ad options included.';

const dappierFaqs = [
  {
    q: 'What is Dappier?',
    a: 'Dappier is a platform that connects AI applications to trusted, real‑time data via Retrieval‑Augmented Generation (RAG) APIs. It also offers a marketplace for publishers to syndicate and monetize content for AI agents.'
  },
  {
    q: 'How does Dappier improve AI accuracy?',
    a: 'By supplying models with fresh, verifiable sources at query time. RAG reduces hallucinations and enables answers grounded in up‑to‑date information.'
  },
  {
    q: 'Who uses Dappier?',
    a: 'AI engineers building GPTs, chatbots, and agents; data teams wiring RAG into apps; and publishers who want to license content to AI products with transparent economics.'
  },
  {
    q: 'What integrations exist?',
    a: 'Popular AI frameworks and providers, including GPTs, LangChain‑style pipelines, and agent frameworks. REST and SDK options simplify adoption across stacks.'
  },
  {
    q: 'Can publishers control usage and monetization?',
    a: 'Yes. Publishers define access rules, pricing models (pay‑per‑query or ad‑supported), and analytics. Policies and reporting provide control and attribution.'
  },
  {
    q: 'Is Dappier suitable for regulated environments?',
    a: 'Dappier emphasizes governance and security. Teams can restrict sources, log attribution, and route traffic through approved connectors. Enterprise options support stricter compliance needs.'
  }
];

export default function DappierPage() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/dappier`;
    } catch {
      return '/dappier';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Dappier, RAG, retrieval augmented generation, real-time data API, AI data marketplace, GPTs integration, LangChain, AI publishers, content monetization, AI advertising');
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);

    injectJSONLD('dappier-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('dappier-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().split('T')[0],
      inLanguage: 'en',
      keywords: 'Dappier, RAG APIs, AI data marketplace'
    });

    injectJSONLD('dappier-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: dappierFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }, [canonical]);

  return (
    <div className="dappier-page min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-sky-500/20 border border-sky-400/30 rounded-full text-sky-200 text-sm font-semibold">
              <Globe className="inline w-4 h-4 mr-2" />
              Real‑Time Data for AI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Dappier: RAG APIs and a Marketplace for Trusted, Live Data
            </h1>
            <p className="text-lg sm:text-xl text-sky-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect your AI to up‑to‑date sources with Retrieval‑Augmented Generation. Build grounded assistants, search, and agents. For publishers, license content with clear economics and analytics.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'RAG Delivery', value: 'Real‑time', icon: Zap },
              { label: 'Coverage', value: 'Trusted sources', icon: Database },
              { label: 'Integrations', value: 'GPTs, LangChain', icon: Network },
              { label: 'Monetization', value: 'Publisher marketplace', icon: Megaphone }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-sky-300" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-sky-200">{s.label}</div>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What Dappier Does and Why It Matters</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">Dappier bridges AI models with live, trustworthy data. Instead of relying purely on static pretraining, apps can retrieve sources at query time—news, documentation, knowledge bases, and publisher feeds—to produce answers with citations and current context. This pattern, known as Retrieval‑Augmented Generation (RAG), dramatically reduces hallucinations and keeps responses aligned with reality.</p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">Beyond developer APIs, Dappier enables a two‑sided marketplace: publishers can license content to the AI ecosystem, set rules for usage, and monetize via pay‑per‑query or ad‑supported models. Developers gain transparent access to high‑quality sources; publishers gain control and revenue; end users receive more accurate AI experiences.</p>
          </section>

          {/* Feature grid */}
          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4"><Search className="w-6 h-6 text-sky-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">RAG APIs for Live Answers</h3>
              <p className="text-slate-700 leading-relaxed">Query trusted sources in real time and ground model outputs with verifiable citations. Useful for assistants, search, and vertical agents that must stay current.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><Network className="w-6 h-6 text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Integrations with Popular Frameworks</h3>
              <p className="text-slate-700 leading-relaxed">Hook into GPTs, LangChain‑style pipelines, and agent frameworks. Use REST or SDKs to add retrieval, citations, and freshness with minimal code.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><FileText className="w-6 h-6 text-purple-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Publisher Marketplace</h3>
              <p className="text-slate-700 leading-relaxed">Publishers list datasets and content feeds with pricing and policies. Developers subscribe with clear attribution and usage reporting.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4"><BarChart3 className="w-6 h-6 text-pink-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analytics & Governance</h3>
              <p className="text-slate-700 leading-relaxed">Track queries, sources, and outcomes. Set access rules, audit attribution, and ensure content use aligns with publisher policies.</p>
            </div>
          </section>

          {/* Use cases */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Where Dappier Fits in AI Products</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-sky-600 pl-6"><h3 className="text-xl font-bold text-slate-900 mb-2">Grounded Chat Assistants</h3><p className="text-slate-700">Answer questions with current data and citations. Ideal for fintech, healthcare, and education where correctness matters.</p></div>
              <div className="border-l-4 border-emerald-600 pl-6"><h3 className="text-xl font-bold text-slate-900 mb-2">Domain Search & Q&A</h3><p className="text-slate-700">Index trusted vertical sources and produce precise, explainable answers instead of generic summaries.</p></div>
              <div className="border-l-4 border-purple-600 pl-6"><h3 className="text-xl font-bold text-slate-900 mb-2">Agent Tools that Act on Fresh Facts</h3><p className="text-slate-700">Let agents plan and act using reliable, current inputs—reducing errors in automations and workflows.</p></div>
              <div className="border-l-4 border-pink-600 pl-6"><h3 className="text-xl font-bold text-slate-900 mb-2">Publisher Syndication & Monetization</h3><p className="text-slate-700">License proprietary content to AI apps with transparent pricing and granular control over access and attribution.</p></div>
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How Dappier’s RAG Pipeline Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-6">
              <li>Developers select sources from the marketplace or connect their own feeds and knowledge bases.</li>
              <li>Queries hit Dappier’s retrieval layer; relevant, recent documents are gathered with metadata.</li>
              <li>The app combines retrieved context with model prompts to generate grounded answers.</li>
              <li>Attribution and usage events are logged for analytics and publisher reporting.</li>
              <li>Policies enforce access scope, rate limits, and monetization rules per source.</li>
            </ol>
            <p className="text-slate-700 leading-relaxed">The result is a predictable, auditable data path: where facts came from, when they were retrieved, and how they shaped the final answer. This transparency builds trust with users and rights‑holders.</p>
          </section>

          {/* Playbooks */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Playbooks for Builders and Publishers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">For Developers</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Define your truth set: which sources establish correctness for your domain.</li>
                  <li>Return citations and timestamps by default to increase user trust.</li>
                  <li>Cache stable context; refresh volatile context aggressively.</li>
                  <li>Use guardrails to filter untrusted documents before prompting.</li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">For Publishers</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Package content into clear feeds (updates, guides, archives) with pricing.</li>
                  <li>Set attribution requirements and rate limits aligned to value.</li>
                  <li>Monitor query analytics and adjust policies to maximize yield.</li>
                  <li>Experiment with ad‑supported access to broaden reach.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparisons */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Dappier vs. DIY RAG Stacks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Capability</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">Dappier</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">DIY Assembly</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Source access & licensing', 'Built‑in marketplace', 'Manual negotiations'],
                    ['Attribution & analytics', 'First‑class', 'Custom logging'],
                    ['Integrations', 'GPTs, LangChain, agents', 'Per‑tool adapters'],
                    ['Governance', 'Policies & reporting', 'Ad‑hoc scripts'],
                    ['Monetization models', 'Pay‑per‑query / ads', 'Custom billing'],
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

          {/* Testimonials */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">What Teams Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { quote: 'Grounded responses with clear citations improved trust and retention in our support assistant.', author: 'Avery L.', role: 'Head of Product, SaaS' },
                { quote: 'Integrations made it easy to wire retrieval into our LangChain flows. Time‑to‑value was days, not months.', author: 'Chris D.', role: 'Lead ML Engineer' },
                { quote: 'As a publisher, we finally have transparent economics for AI usage. Analytics and policy controls are key.', author: 'Priya S.', role: 'Director of Content' },
                { quote: 'We reduced hallucinations by focusing on trusted feeds and enforcing guardrails before prompting.', author: 'Jon K.', role: 'Engineering Manager' }
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
              {dappierFaqs.map((f, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-white border border-slate-200 rounded-lg px-6 overflow-hidden">
                  <AccordionTrigger className="py-4 font-semibold text-slate-900 hover:text-sky-600 transition-colors">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-slate-700 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Closing SEO perspective */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Dappier’s Role in Searchable, Trustworthy AI</h2>
            <p className="text-slate-700 leading-relaxed mb-6">Reliable AI requires fresh information, source attribution, and accountable governance. Dappier provides these primitives out of the box: a path to live data, a marketplace for rights‑holders, and APIs that make RAG practical at product scale.</p>
            <p className="text-slate-700 leading-relaxed mb-6">Whether you’re launching a grounded assistant or syndicating a premium content archive, aligning incentives for builders and publishers is the fastest path to quality. Dappier’s approach turns that alignment into a repeatable system.</p>
          </section>

          {/* Final CTA: only Backlink∞ registration */}
          <section className="mb-0">
            <div className="bg-sky-600 rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Grow Rankings with Authoritative Backlinks</h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">If you publish AI engineering guides, RAG case studies, or marketplace insights, earn topical authority with high‑quality backlinks. That’s how you rank for competitive queries and reach teams building AI products.</p>
              <p className="text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed">Backlink ∞ acquires relevant, reputable backlinks that compound your organic traffic. Register to start building durable search visibility today.</p>
              <a href="https://backlinkoo.com/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-sky-700 font-semibold rounded-lg hover:bg-sky-50 transition-colors">
                Register for Backlink ∞
                <ArrowRight className="ml-3 w-5 h-5" />
              </a>
              <p className="text-sky-200 text-sm mt-8">Establish authority • Rank for AI & RAG keywords • Convert qualified readers</p>
            </div>
          </section>

        </div>
      </article>

      <Footer />
    </div>
  );
}
