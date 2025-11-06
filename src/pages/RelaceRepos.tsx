import React, { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle2, GitBranch, Box, Layers, Cpu, Zap, Database, Shield, BarChart3, BookOpen, Search, Code2, Globe, Network } from 'lucide-react';

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

const metaTitle = 'Relace Repos: Source Control for AI Coding Agents | High‑Throughput Retrieval & Fast Apply';
const metaDescription = 'Relace Repos is source control designed for AI. Lightweight push/pull, two‑stage retrieval, fast apply/merge at high throughput, SOC 2 options, and API‑first integration for coding agents. This deep dive covers features, architecture, use cases, and best practices.';

const relaceFaqs = [
  {
    q: 'What is Relace Repos and how is it different from Git? ',
    a: 'Relace Repos is a source control system designed for AI coding agents. It emphasizes lightweight read/write operations, semantic retrieval, fast merging, and entitlement controls tuned for autonomous code changes. Traditional Git is human‑centric; Relace optimizes for agent throughput, global lookups, and reliability under high edit rates.'
  },
  {
    q: 'How does two‑stage retrieval improve code search?',
    a: 'Two‑stage retrieval combines embeddings for broad recall with a reranker for precision. Agents first gather likely files, then rerank to surface the most relevant lines and snippets. This reduces hallucinations and speeds up correct edits, especially in large monorepos.'
  },
  {
    q: 'What is Fast Apply and why does throughput matter?',
    a: 'Fast Apply is a model‑driven editing/merging system that applies structured patches at high tokens‑per‑second rates. Higher throughput means agents can propose, test, and iterate on changes in tight loops, raising success rates for autonomous coding tasks.'
  },
  {
    q: 'Does Relace support on‑premise or VPC deployments?',
    a: 'Yes. Teams working with regulated or sensitive code can deploy in VPC‑isolated or on‑prem environments. Hosted options support encryption in transit and at rest, while self‑managed deployments keep source fully under your control.'
  },
  {
    q: 'How does Relace Repos integrate with CI/CD and developer tools?',
    a: 'The platform exposes an API‑first surface for retrieval, edits, and entitlement checks. You can wire agents into CI pipelines, code review bots, and IDE assistants so that retrieval, patching, and validation run automatically against your repos.'
  },
  {
    q: 'Is Relace SOC 2 compliant?',
    a: 'Relace emphasizes security and governance. Hosted tiers advertise SOC 2 alignment and auditability, while self‑hosted deployments allow teams to meet internal compliance and data residency requirements.'
  }
];

export default function RelaceRepos() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/relacerepos`;
    } catch {
      return '/relacerepos';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Relace Repos, Relace, AI coding agents, code retrieval, reranker, embeddings, fast apply, semantic code search, agent repos, autonomous codegen, source control for AI');
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);

    injectJSONLD('relace-repos-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('relace-repos-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().split('T')[0],
      inLanguage: 'en',
      keywords: 'Relace Repos, AI source control, code retrieval, fast apply'
    });

    injectJSONLD('relace-repos-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: relaceFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }, [canonical]);

  return (
    <div className="relace-repos-page min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-sm font-semibold">
              <GitBranch className="inline w-4 h-4 mr-2" />
              Source Control for AI Agents
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Relace Repos: Agent‑Native Source Control with High‑Recall Retrieval & Fast Apply
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed mb-8">
              A modern repository layer built for autonomous coding. Two‑stage retrieval for large codebases, fast model‑driven patching, and API‑first integration with your CI, IDE assistants, and code review bots.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Two‑Stage Retrieval', value: 'Embed + Rerank', icon: Search },
              { label: 'Apply Throughput', value: 'High tok/s', icon: Zap },
              { label: 'Deployment', value: 'Cloud or VPC', icon: Network },
              { label: 'Security', value: 'SOC 2 minded', icon: Shield }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-indigo-300" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-indigo-200">{s.label}</div>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Teams Choose Relace Repos for Autonomous Codegen</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">Relace Repos rethinks source control for AI. Instead of bolting agents onto human‑centric tooling, it provides a repository layer that speaks the language of coding agents: semantic retrieval, low‑latency entitlement checks, and high‑throughput patching. The result is faster iteration, fewer hallucinations, and code changes that converge to correctness.</p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">Where classic repos excel at collaboration among humans, agent workflows demand different primitives. Two‑stage retrieval surfaces the right files with high recall and precision; the fast apply engine merges edits at tok/s rates suitable for inner loops; and API‑first design wires everything into your CI, review, and IDE workflows. Teams ship reliable agent capabilities without reinventing infra.</p>
          </section>

          {/* Pillars */}
          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4"><Search className="w-6 h-6 text-indigo-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Two‑Stage Retrieval for Large Codebases</h3>
              <p className="text-slate-700 leading-relaxed">Combine embeddings for broad recall with a reranker for pinpoint precision. Agents pull the right files and even relevant sections within those files, cutting exploration time and reducing incorrect edits across massive monorepos.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><Zap className="w-6 h-6 text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Apply: High‑Throughput Merging</h3>
              <p className="text-slate-700 leading-relaxed">A model‑driven patching engine applies edits at high tokens‑per‑second throughput. That speed lets agents iterate quickly—proposing, testing, and refining patches in short cycles for higher success rates on complex tasks.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><Layers className="w-6 h-6 text-purple-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Entitlements & Guardrails</h3>
              <p className="text-slate-700 leading-relaxed">Define which paths, services, or commands an agent can touch. Enforce code‑area ownership and rate limits to preserve safety. Guardrails turn agent autonomy into dependable automation.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4"><Cpu className="w-6 h-6 text-pink-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Small, Fast Models for Code</h3>
              <p className="text-slate-700 leading-relaxed">Relace emphasizes specialized models for retrieval, reranking, and patching. These smaller, tuned models act as tools that outperform generic LLMs on focused coding subtasks, improving accuracy and speed while reducing cost.</p>
            </div>
          </section>

          {/* How it works */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How Relace Repos Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-6">
              <li>Your agent asks for context; the repo returns semantically relevant files and snippets via two‑stage retrieval.</li>
              <li>The agent proposes edits; the Fast Apply engine merges changes at high throughput with conflict awareness.</li>
              <li>Entitlement checks and guardrails validate allowed actions before writes land.</li>
              <li>CI and review bots verify builds and tests; failed attempts feed back into retrieval and apply loops.</li>
              <li>Approved changes are versioned with full lineage to keep humans in the loop.</li>
            </ol>
            <p className="text-slate-700 leading-relaxed">Because retrieval, patching, and governance share one control plane, agents behave consistently across tools and environments. Latency stays low, and the same policies apply in local dev, CI, and production branches.</p>
          </section>

          {/* Use cases */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Use Cases Where Relace Repos Shines</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-indigo-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">IDE Coding Assistants</h3>
                <p className="text-slate-700">Give assistants a reliable, low‑latency context engine. They pull relevant files, propose safe patches, and hand results back to developers without derailing flow or breaking builds.</p>
              </div>
              <div className="border-l-4 border-emerald-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">CI Agents & Review Bots</h3>
                <p className="text-slate-700">Wire retrieval and apply into CI so bots can triage failures, fix flaky tests, and modernize code patterns under strict guardrails and approvals.</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Large Monorepo Navigation</h3>
                <p className="text-slate-700">Two‑stage retrieval with reranking surfaces the right modules and functions in sprawling codebases. Agents spend more time improving code and less time searching.</p>
              </div>
              <div className="border-l-4 border-pink-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Legacy Upgrades & Migrations</h3>
                <p className="text-slate-700">Automate framework upgrades, dependency changes, and pattern refactors with high‑throughput apply and policy‑driven guardrails to prevent risky edits.</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Regulated & Enterprise Environments</h3>
                <p className="text-slate-700">Run in VPC or on‑prem to keep code resident and auditable. Enforce fine‑grained access and maintain plan lineage for compliance reviews.</p>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-16 bg-white border border-slate-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Architecture and Design Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Two‑Stage Retrieval</h3>
                <p>Embedding models maximize recall; a reranker increases precision on candidate files and even lines. The combo drives higher correctness for autonomous edits.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">High‑Throughput Apply</h3>
                <p>Structured edits stream through a merge engine optimized for tokens‑per‑second throughput, enabling short feedback loops and safer convergence.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">API‑First Integration</h3>
                <p>Everything is accessible via stable APIs so agents, CLIs, and services can retrieve context, propose patches, and enforce guardrails uniformly.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Governance by Default</h3>
                <p>Entitlements, audit trails, and lineage reduce risk. You control what can change, where, and when—turning autonomy into dependable automation.</p>
              </div>
            </div>
          </section>

          {/* Comparisons */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Relace Repos vs. Traditional Tooling</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Capability</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">Relace Repos</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">Classic Git + Ad‑hoc</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Semantic retrieval', 'Built‑in (two‑stage)', 'External search or none'],
                    ['Patching throughput', 'High tok/s apply', 'Human‑paced merges'],
                    ['Guardrails & entitlements', 'Centralized policies', 'Scripts and conventions'],
                    ['CI/IDE integration', 'API‑first by design', 'Glue code and plugins'],
                    ['Large monorepos', 'Recall + precision tuned', 'Manual spelunking'],
                    ['Deployment options', 'Cloud / VPC / on‑prem', 'Self‑assembled'],
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
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Operations and Best Practices</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Choose one canonical value metric for agent progress (tests passed, endpoints fixed, etc.).</li>
              <li>Start with conservative entitlements; expand as success rates rise.</li>
              <li>Use two‑stage retrieval everywhere—recall first, then precision.</li>
              <li>Prefer many small patches over large rewrites to improve safety.</li>
              <li>Keep humans in the loop with approvals until metrics stabilize.</li>
              <li>Measure tok/s for apply loops and watch for throughput regressions.</li>
              <li>Version policies; never change guardrails mid‑run without lineage.</li>
            </ul>
          </section>

          {/* Case Studies */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Case Studies</h2>
            <div className="space-y-6 text-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Scaling a Code Assistant to Enterprise Monorepos</h3>
                <p>After integrating two‑stage retrieval and Fast Apply, an assistant reduced search time by double‑digit percentages and shipped safe refactors weekly. Guardrails prevented edits outside owned paths, keeping risk contained.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Automated Dependency Upgrades in CI</h3>
                <p>A CI bot used Relace Repos to locate breaking changes, propose targeted patches, and open review‑ready diffs. Apply throughput enabled many small fixes per hour, improving merge rates without reviewer fatigue.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">VPC‑Isolated Deployment for Regulated Codebases</h3>
                <p>A security‑sensitive team ran Relace components in VPC. Retrieval and apply stayed close to the code, with full audit trails for compliance and predictable latency for agents.</p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">What Builders Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: 'Relace Repos gave our agents reliable context and a fast edit loop. Throughput made the difference for complex refactors.',
                  author: 'Teddy N.',
                  role: 'Co‑founder, DevTools Startup',
                  rating: 5
                },
                {
                  quote: 'We use two‑stage retrieval across a multi‑language monorepo. Precision improved code suggestions and cut review time.',
                  author: 'James G.',
                  role: 'CEO, AI Code Platform',
                  rating: 5
                },
                {
                  quote: 'Guardrails and entitlements made autonomous code changes safe enough for CI. The audit trails keep security satisfied.',
                  author: 'Anton O.',
                  role: 'Engineering Leader',
                  rating: 5
                },
                {
                  quote: 'Small, tuned models as tools outperform our general LLM on retrieval and apply. Costs dropped, quality went up.',
                  author: 'Maya R.',
                  role: 'Head of ML, SaaS',
                  rating: 5
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => (<div key={i} className="text-yellow-400 text-lg">★</div>))}</div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="font-bold text-slate-900">{t.author}</p>
                    <p className="text-sm text-slate-600">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {relaceFaqs.map((f, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-white border border-slate-200 rounded-lg px-6 overflow-hidden">
                  <AccordionTrigger className="py-4 font-semibold text-slate-900 hover:text-indigo-600 transition-colors">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-slate-700 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* SEO perspective */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Relace Repos in the AI Development Stack</h2>
            <p className="text-slate-700 leading-relaxed mb-6">Modern AI engineering stacks hinge on three loops: retrieve, apply, and verify. Relace Repos consolidates the first two with governance, allowing the verify loop—tests, linters, benchmarks—to close faster. The net effect is more correct changes per unit time and a clear path from prototype agents to production automation.</p>
            <p className="text-slate-700 leading-relaxed mb-6">Compared with stitching together vector search, ad‑hoc scripts, and classic repos, Relace Repos reduces fragility. Policies are versioned, lineage is preserved, and performance characteristics are visible—so you can measure and improve agent reliability like any other production system.</p>
          </section>

          {/* Final CTA: only Backlink∞ registration */}
          <section className="mb-0">
            <div className="bg-indigo-600 rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Grow Search Visibility with Strategic Backlinks</h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">Publishing deep technical guides about agent repos, retrieval, and fast apply? Earn topical authority with relevant backlinks to rank for competitive AI engineering terms and drive qualified traffic from teams adopting AI coding agents.</p>
              <p className="text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed">Backlink ∞ helps you acquire high‑quality, contextually relevant backlinks from authoritative engineering and AI publications. Register to start compounding organic growth.</p>
              <a href="https://backlinkoo.com/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                Register for Backlink ∞
                <ArrowRight className="ml-3 w-5 h-5" />
              </a>
              <p className="text-indigo-200 text-sm mt-8">Establish authority • Rank for AI dev keywords • Convert engineering teams</p>
            </div>
          </section>

        </div>
      </article>

      <Footer />
    </div>
  );
}
