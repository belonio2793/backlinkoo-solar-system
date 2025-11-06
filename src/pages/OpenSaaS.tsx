import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
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

const metaTitle = 'Open SaaS — Free Open‑Source SaaS Template & Starter Kit (Guide)';
const metaDescription =
  'Open SaaS is a free, open‑source starter kit for building SaaS products. This guide explains features, auth, payments, admin dashboards, AI readiness, deployment options, and how to use Open SaaS to launch faster.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Open SaaS — A Free SaaS Template with Superpowers',
    summary:
      'Open SaaS is an open‑source, feature‑rich starter kit for SaaS founders and teams. It bundles boilerplate—auth, payments, admin dashboards, tests and hosting patterns—so you can focus on product differentiation.',
    paragraphs: [
      'Open SaaS fills a practical gap: many early SaaS projects stall on repetitive infrastructure tasks—auth flows, billing, dashboards, file uploads, and deployment plumbing. By shipping a curated, modern starter kit, Open SaaS lets teams skip the repetitive and start building the unique capabilities that make a product valuable.',
      'The project pairs a pragmatic stack (React frontend, Node/Express backend or an opinionated framework) with production patterns: TypeScript end‑to‑end, CI examples, Playwright tests, and documentation. Importantly, everything is open source so you own the code, can self‑host, and adapt the stack as requirements evolve.',
      'This guide will reverse‑engineer the public site and expand on practical adoption strategies: when to use the starter kit, how to customize auth and payments, essential production hardening, and how to measure success during pilot and scale phases.'
    ]
  },
  {
    id: 'why-opensaas',
    title: 'Why Use an Open SaaS Starter Kit?',
    summary: 'The key advantage is time‑to‑value: validation, prototypes and early revenue come faster when the plumbing is prebuilt.',
    paragraphs: [
      'Speed to Prototype: Using a starter kit reduces the time it takes to demonstrate product value to customers and investors. Rather than spending weeks on authentication or payment integration, teams can ship a working MVP within days.',
      'Consistent Best Practices: Thoughtful opinionation—TypeScript full‑stack, testing patterns, CI pipelines and observability—means your prototype does not become technical debt later. Templates that bake in good practices help teams scale safely.',
      'Ownership and Flexibility: Because the code is open source, you avoid vendor lock‑in. You can self‑host, push to your GitHub, or hand the repo to an engineering team to build on top of.',
      'Community and Contributions: A healthy starter ecosystem often has a community that contributes templates, extensions, and integrations—accelerating feature building beyond the base kit.'
    ]
  },
  {
    id: 'core-features',
    title: 'Core Features You Expect from Open SaaS',
    summary: 'Open SaaS collects common SaaS features into an integrated starter: auth, payments, admin, AI hooks and developer ergonomics.',
    paragraphs: [
      'DIY Auth — Full stack authentication flows including sign up, sign in, email verification, password resets, and role‑based access. Owning auth reduces surprise during audits and keeps user data under your control.',
      'Payments — Examples with Stripe or Lemon Squeezy. Pre‑wired checkout, webhooks, and subscription models mean you can start accepting payments without wiring complex billing logic yourself.',
      'Admin Dashboard — Built‑in admin interface with metrics, user management, and content moderation panels. A good admin dashboard reduces time to surface critical operational data, especially in early customer support scenarios.',
      'AI Readiness — A baseline for integrating with LLMs and AI workflows: example prompts, safe LLM orchestration patterns, and advice on prompt engineering and data privacy.',
      'Full‑stack Type Safety — TypeScript support from front to back with auto‑generated types; contracts are consistent across boundaries which reduces runtime surprises.',
      'File Uploads, Email, and Jobs — Practical utilities (S3 presigned uploads, email sending, scheduled cron jobs) that reflect common product needs.',
      'E2E Tests & CI — Playwright tests and GitHub Actions examples help avoid regressions and set a culture of quality early.',
      'Open Source Philosophy — The codebase, docs and deployment examples are freely available, with a contribution path for teams that want to extend the kit.'
    ]
  },
  {
    id: 'prototype-to-prod',
    title: 'From Prototype to Production: Practical Path',
    summary: 'How to take a project created from Open SaaS and make it reliable, secure and scalable for paying customers.',
    paragraphs: [
      'Stage the rollout: Start by deploying a demo app to validate product/market fit. Use demo flows to collect early feedback and iterate quickly. Track key metrics such as activation rate and conversion from trial to paid.',
      'Secure and harden: Run a security checklist—HTTPS enforcement, secrets management, input validation, and dependency scanning. Conduct a threat model for your data flows, especially for payment and user data.',
      'Operationalize: Add monitoring and alerting (errors, latency, and business KPIs). Set up a simple runbook for common incidents and ensure admin dashboards surface customer‑impacting issues.',
      'Scale choices: For moderate scale, managed hosting with database and CDN is often cheaper and faster. For enterprise or compliance, self‑hosting in a VPC with private networking and data residency options may be required.'
    ]
  },
  {
    id: 'auth-payments',
    title: 'Auth and Payments: Configuration Patterns',
    summary: 'Auth and billing are the two largest sources of friction for early SaaS. Use these patterns to reduce common errors.',
    paragraphs: [
      'Separation of concerns: Keep authentication and billing in separate modules with clearly defined APIs. This makes it easier to swap providers or add multi‑tenant abstractions later.',
      'Webhook handling: Centralize webhook handlers behind an authenticated backend route and verify payloads. Log all incoming webhook events and reconcile them with your internal state for reliability.',
      'Test mode and sandboxing: Use provider sandboxes for testing billing but replicate the production flow in staging with real webhooks to validate the complete lifecycle.',
      'Customer lifecycle events: Model subscription lifecycle states (trialing, active, past_due, cancelled) and publish events to your analytics so marketing and support can respond to changes.'
    ]
  },
  {
    id: 'ai-ready',
    title: 'AI-Ready Architecture: Safely Add LLM Features',
    summary: 'Design patterns for integrating LLMs and AI into a SaaS product while managing costs and data privacy.',
    paragraphs: [
      'Prompts as Code: Store prompt templates in version control and treat them as first‑class artifacts. Use parameterized prompts and simple templating to control variations by locale or persona.',
      'Function calling and orchestration: Use a middle layer that orchestrates calls to LLMs and external APIs—this prevents direct model calls from leaking secrets or uncontrolled data exfiltration.',
      'Cost control and caching: Cache expensive LLM responses for repeat queries and use cheaper embedding or retrieval layers for common lookups. Track token usage to estimate costs before scaling.',
      'Privacy: Redact or filter sensitive fields before sending user data to third‑party models. Provide users with transparency and controls over what is sent to external services.'
    ]
  },
  {
    id: 'deploy-options',
    title: 'Deployment Options & No Vendor Lock‑in',
    summary: 'Open SaaS encourages ownership: deploy yourself, or use a managed deployment, but keep your code portable.',
    paragraphs: [
      'Self‑hosting: Useful for data residency and enterprise compliance. The starter kit includes Docker/Compose examples and guidance for VPCs and database connections to simplify self deployment.',
      'Managed deploy: For fast iteration, use the provided managed deploy tooling if offered. This reduces DevOps overhead for early-stage teams.',
      'Hybrid: Some teams prefer managed hosting for the control panel and self‑hosting of sensitive subsystems. Maintain a single‑source repo and modularize infra components for portability.'
    ]
  },
  {
    id: 'testing-quality',
    title: 'Testing, CI and Operational Quality',
    summary: 'A small testing culture prevents early mistakes from becoming costly technical debt.',
    paragraphs: [
      'Unit & Integration Tests: Start with unit tests for core business logic and integration tests for critical flows like billing and auth.',
      'End‑to‑End Tests: Playwright examples in the starter kit show how to validate user journeys. Run these tests in CI after each PR to avoid regressions.',
      'Code Review & PR Templates: Encourage small, frequent changes with PR templates that surface security and performance considerations.',
      'Monitoring & Alerts: Instrument your app with basic tracing and error aggregation so teams can respond quickly to issues.'
    ]
  },
  {
    id: 'community-and-support',
    title: 'Community, Contributions and Learning',
    summary: 'Open projects gain strength from contributors: community templates, docs, and Discord support accelerate new adopters.',
    paragraphs: [
      'Community templates act as practical examples. Look for templates that map to your vertical and consider contributing back fixes and extensions you create.',
      'Documentation is the backbone: the starter kit’s docs should include setup, deployment, webhook handling, and billing flows. Good docs reduce support load and increase adoption.',
      'Support channels: Public Discord or community forums provide a safe space to ask questions and share learnings. For enterprise buyers, consider paid support or retention engineering.'
    ]
  },
  {
    id: 'case-studies',
    title: 'Representative Case Studies & Outcomes',
    summary: 'How teams used an open SaaS starter kit to accelerate outcomes and what metrics they tracked.',
    paragraphs: [
      'Rapid MVP: A founder built a subscription product in a weekend, validated demand with an initial cohort, and converted early users within two weeks by iterating on onboarding flows.',
      'Internal Tools Reuse: A small company replaced ad‑hoc spreadsheets with a scoped admin interface generated from the starter kit, reducing support time and centralizing data.',
      'Localized Launches: Teams used templates and hosting to launch country‑specific landing pages and localized pricing, accelerating regional experimentation.'
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing Signals and Cost Considerations',
    summary: 'Open SaaS itself is open source, but operational costs include hosting, DB, and optional managed services—budget these when evaluating a hosted offer.',
    paragraphs: [
      'The starter repo is free: you pay for infrastructure, add‑on services and optional managed hosting or support. Understand the recurring costs for DB, backups, CDN, and billing provider fees.',
      'If you use platform hosting, estimate bandwidth and compute costs for real traffic and account for email and webhook processing as minor but important cost items.',
      'For enterprise, include procurement timelines, legal review for open‑source licensing, and potential support contracts in your budgeting exercise.'
    ]
  },
  {
    id: 'testimonials',
    title: 'What Our Users Say',
    summary: 'Representative user quotes from maintainers and founders who used the starter kit to launch products faster.',
    paragraphs: [
      '"Using the starter kit I launched a working SaaS prototype and had paying users within a month." — Founder (composite)',
      '"The auth and billing examples saved us countless hours and helped us avoid costly mistakes in production." — CTO (composite)',
      '"We forked the starter kit and integrated it with our infra; it gave us a common foundation across teams." — Engineering Lead (composite)'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices & Checklist',
    summary: 'A short checklist to ensure your Open SaaS‑based project is ready for production customers.',
    paragraphs: [
      'Run security scanning and dependency updates regularly.',
      'Add integration tests for billing and auth flows.',
      'Set up backups and retention for customer data.',
      'Instrument business KPIs and error tracking from day one.',
      'Document deployment and rollback procedures.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Top questions about licensing, deployment and scope answered succinctly.',
    paragraphs: [
      'Is the starter kit free? Yes—the template is open source and free to use. Operational costs depend on hosting and third‑party services.',
      'Can I use this for a commercial product? Yes—check the licensing terms and ensure you comply with any attribution or license obligations.',
      'Is there a hosted option? Some communities offer managed deploy services; check the project docs for current hosting partners or community‑run offers.',
      'How do I contribute? Fork the repo, follow contribution guidelines, and open PRs for features or fixes. Join the community channel for help.'
    ]
  }
];

export default function OpenSaaS() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/open-saas`;
    } catch {
      return '/open-saas';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    sections.forEach((s) => {
      parts.push(s.summary);
      s.paragraphs.forEach((p) => parts.push(p));
    });
    const words = parts.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Open SaaS, Wasp, SaaS starter kit, open source SaaS template, auth, payments, admin dashboard');
    upsertCanonical(canonical);

    injectJSONLD('opensaas-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('opensaas-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Open SaaS — Free Open‑Source SaaS Template & Starter Kit',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: sections.map((s) => s.title)
    });

    const faqSection = sections.find((s) => s.id === 'faqs');
    const faqItems = faqSection ? faqSection.paragraphs : [];
    injectJSONLD('opensaas-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((a) => ({ '@type': 'Question', name: a.split('?')[0].trim(), acceptedAnswer: { '@type': 'Answer', text: a } }))
    });
  }, [canonical]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-border/60 bg-white">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-700">The free SaaS template with superpowers</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Open SaaS — Free, Feature��Rich, Full‑Stack Starter Kit</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">An open‑source, full‑stack React + Node starter kit that removes boilerplate so you can focus on product. Includes auth, payments, admin dashboards, tests and deployment examples.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">A practical guide to using Open SaaS and shipping reliably.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Includes deployment and AI integration guidance.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Open SaaS</p>
                <p className="mt-2 text-sm text-slate-600">Starter kit, Wasp, auth, payments, admin dashboards.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="text-slate-700 hover:text-slate-900 hover:underline" href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#register">Register</a>
              </li>
            </ul>
          </aside>

          <article className="flex flex-col gap-10 pb-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-2 text-slate-700">{section.summary}</p>
                </header>
                <div className="prose max-w-none prose-slate">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="register" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-white">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Boost SEO</h2>
                <p className="mt-2 text-slate-700">If your goal is to rank Open SaaS pages faster and attract the right audience, quality backlinks from relevant sites increase topical authority and referral traffic.</p>
              </header>
              <p className="text-lg text-slate-900">
                <a className="underline text-blue-700 hover:text-blue-800" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
