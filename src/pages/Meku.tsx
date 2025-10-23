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

const metaTitle = 'Meku — Build Beautiful Web Apps from a Prompt (Complete Guide)';
const metaDescription =
  'Meku is an AI-first platform that turns prompts into production-ready web apps. This in-depth guide covers features, community projects, workflow, hosting, integrations, pricing signals, comparisons and best practices to help you decide.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Meku at a glance',
    summary:
      'Meku is an AI-driven web app builder: describe an app in plain language and Meku generates a working, deployable project. It combines prompt-driven creation, customization, and hosting so builders move from idea to live product quickly.',
    paragraphs: [
      'Meku positions itself as an end-to-end platform for rapid web app creation. The core idea is simple yet powerful: replace wiring together multiple tools with a single conversation. You tell Meku what you want—an ecommerce storefront, a SaaS dashboard, or a portfolio site—and it generates a scaffolded, customized app complete with frontend, backend, and deployment configuration.',
      'The platform is aimed at creators who value speed and quality: product builders, solo founders, designers, and developer teams who want to prototype faster or launch small apps without an extensive infrastructure setup. Meku pairs the creative flexibility of prompts with production‑grade outputs—live previews, GitHub pushes, and hosting—so prototypes convert to real apps smoothly.',
      'This guide breaks down Meku’s features, community ecosystem, production readiness, costs, integrations, and practical adoption strategies. It aims to satisfy the range of search intents a prospective user might have: discovery, evaluation, technical due diligence, and hands‑on how‑to guidance.'
    ]
  },
  {
    id: 'hero-concept',
    title: 'Build Beautiful Web Apps with Simple Prompt',
    summary: 'Meku’s hero promise is direct: craft stunning web apps from a prompt and deploy them in minutes. The product blends design, code and hosting into a single interface.',
    paragraphs: [
      'At the heart of Meku is a conversational UI: a prompt box that accepts plain language requests ("Build an e‑commerce site for handmade candles with product pages, cart, and Stripe checkout") and returns a working app preview. This approach dramatically shortens the loop between idea and prototype, putting more iterations and experimentation within reach.',
      'The platform emphasizes visual quality as much as functionality. Meku ships modern UI templates and design defaults so the first version already looks polished. For teams, this reduces the handoff burden: designers can describe visual intent and engineers can refine the generated code, preserving momentum.',
      'Beyond the initial generation, Meku supports iterative workflows: refine prompts, ask for UI tweaks, add features, and push changes to GitHub or host directly on Meku’s infrastructure. This conversational loop enables continuous design and development without constant context switching.'
    ]
  },
  {
    id: 'how-it-works',
    title: 'How Meku works: From prompt to production',
    summary: 'A pragmatic walkthrough of the typical Meku workflow and how each stage maps to deliverables and outcomes.',
    paragraphs: [
      '1) Describe your idea: Start with a high‑level prompt describing the app type, key pages, or integrations. Include details like authentication, database needs, or payment providers if you want them scaffolded.',
      '2) Review the first version: Meku generates a working preview with UI, routing, and basic logic. This first iteration is intentionally opinionated to reduce decision fatigue—defaults are chosen to be sensible and modern.',
      '3) Customize in conversation: Use the same prompt box to refine margins, change color palettes, add components, or request new endpoints. Meku’s generator iterates the project and updates the preview quickly.',
      '4) Export, host, or push: When ready, you can export a zip, push to your GitHub repo, or deploy to Meku’s hosting. For teams, pushing to GitHub allows further engineering workflows, CI, and long‑term maintenance while Meku handles the initial heavy lifting.'
    ]
  },
  {
    id: 'featured-projects',
    title: 'Featured projects from the Meku community',
    summary: 'Meku promotes community creativity by showcasing projects people built with the platform—many are remixable templates that accelerate new projects.',
    paragraphs: [
      'The community gallery is more than inspiration: each featured project is a working template that you can remix and adapt. These projects range from simple landing pages to complex SaaS dashboards with authentication and database models.',
      'A strong community gallery reduces time to first value. Instead of building a project from scratch, browse a similar project, remix it, and focus on product differentiation rather than plumbing. Remix counts indicate which templates others found valuable and are useful signals for discovery.',
      'For organizations, the gallery serves as a quick product discovery tool for prototyping. Leaders can test landing pages, apply branding, and validate demand without committing engineering teams to full scaffolding work.'
    ]
  },
  {
    id: 'features',
    title: 'Key features: Design, code, and host in one place',
    summary: 'Meku combines generation, customization, integrations and hosting into a single workflow to minimize tool friction.',
    paragraphs: [
      'All‑in‑one generation: Meku generates full‑stack projects with frontend, backend routes, and basic data models where applicable. The generated code follows modern patterns so engineers can extend it reliably.',
      'Instant previews and live updates: Preview your app as it’s generated; iterate in the prompt and see updates instantly, shortening the feedback loop and enabling fast experimentation.',
      'GitHub integration: Push generated projects to your repository with a single action. This provides continuity for engineering practices—code reviews, CI/CD and long‑term maintenance—while letting Meku handle initial scaffolding.',
      'Supabase and DB integrations: Optional integrations with managed backends like Supabase give generated apps persistence with minimal configuration—auth, storage, and real‑time features become accessible immediately.',
      'Design defaults and templates: Meku applies design systems to generated apps so the first version is visually coherent. You can tweak colors, fonts, and spacing via prompts or a design panel if available.',
      'Export and host options: Download source files, push to GitHub, or host on Meku’s platform with one click. Hosting handles TLS, CDN and basic scaling so early apps look and perform like production sites.'
    ]
  },
  {
    id: 'build-customize-host',
    title: 'Customize and extend: Practical guidance',
    summary: 'How to move beyond the first generation: maintainability patterns, code ownership, and practical extension strategies.',
    paragraphs: [
      'Treat the generated app as a scaffold: Meku gives you a structured starting point, but engineers should clean up and document shared contracts (APIs, data models) before scaling. Remove unused components and write small integration tests to guard core flows.',
      'Adopt Git workflows early: push the initial project to a GitHub repo and set up branches for iterative development. Use code owners and PR templates to keep generated code maintainable as teams add features.',
      'Externalize secrets and configuration: move API keys and credentials into environment variables or a secrets manager for production deployments. Meku’s hosting may provide an environment manager; if you self‑host, integrate with your existing secrets process.',
      'Monitor and iterate: attach basic telemetry (errors, latency, and usage metrics) to the deployed app so you can prioritize fixes and feature improvements based on real user behavior.'
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations: Connect the systems your product needs',
    summary: 'Meku emphasizes practical integrations so generated apps are not just prototypes but usable products with real workflows.',
    paragraphs: [
      'GitHub: One‑click repo push and future CI pipelines. Treat Meku as the initial commit and then evolve the repository with standard software engineering processes.',
      'Supabase and databases: If you need persistence, Meku can scaffold DB schemas and Supabase configuration. This gives you auth, storage, and realtime without managing servers.',
      'Third‑party APIs: Add payment providers, email delivery, analytics, or external SaaS via prompt directives or a configuration panel. Meku’s generator can include placeholder integration code that developers later wire to production credentials.',
      'Headless CMS and content: For content‑heavy sites, scaffold headless CMS hooks or static export options so content teams work with familiar tools while developers maintain app logic.'
    ]
  },
  {
    id: 'community-and-marketplace',
    title: 'Community, templates and marketplace',
    summary: 'A vibrant community and a library of remixable projects accelerate learning and reduce duplication of effort.',
    paragraphs: [
      'Community templates: Shared projects act as learning artifacts and as baselines for new projects. Popular templates often evolve into maintained starter kits that reflect best practices for certain verticals (ecommerce, dashboards, blogs).',
      'Remix culture: The platform encourages remixing—forking a community project and adapting it—which lowers friction for experimentation and helps maintain a culture of rapid prototyping and iterative improvement.',
      'Market signals: Templates with many remixes indicate reusable, high‑value primitives. Use remix counts as a discovery signal when choosing a baseline for your project.'
    ]
  },
  {
    id: 'production-readiness',
    title: 'Production readiness: What to expect',
    summary: 'Generated apps can be production‑ready with appropriate follow‑up: testing, secrets management, and monitoring.',
    paragraphs: [
      'Performance considerations: Generated code aims to use performant frameworks by default, but profiling and load testing are essential before high‑traffic launches. Optimize images, enable CDNs, and cache API responses where appropriate.',
      'Security basics: Ensure authentication flows are properly configured, sanitize inputs, and add rate limiting to public APIs. Meku-generated projects include sensible defaults, but security reviews should be part of the release checklist.',
      'Operational readiness: Set up logs, alerts and runbooks. A Meku-hosted deployment may offer basic metrics, but enterprise apps should integrate with established observability stacks for full lifecycle maintenance.'
    ]
  },
  {
    id: 'pricing-signals',
    title: 'Pricing signals and procurement guidance',
    summary: 'Understand the cost factors—credits, hosting tiers, and enterprise features—before committing to wide adoption.',
    paragraphs: [
      'Credits and usage: Many AI‑driven platforms use credits to meter generation. Estimate usage by pilot projects—how many pages and iterations you expect during prototyping and early releases.',
      'Hosting tiers: Compare the cost of Meku hosting versus self‑hosting; for low traffic prototypes, platform hosting is cost‑effective, but for scale you may prefer to host in your cloud for better pricing predictability.',
      'Enterprise features: Consider SLAs, VPC or private networking, single‑tenant options and support tiers if you operate in regulated industries or require strict uptime guarantees.'
    ]
  },
  {
    id: 'comparison',
    title: 'How Meku compares to other builders',
    summary: 'Meku is optimized for prompt‑driven, end‑to‑end app generation; understand where it fits relative to low‑code platforms and manual development.',
    paragraphs: [
      'Low‑code platforms offer visual editors and reusable components but often require manual wiring for backend flows. Meku bridges the gap by generating full‑stack projects from prompts and providing a chat‑based refinement loop.',
      'Traditional engineering gives full control but at higher time cost. Meku reduces that initial time cost while allowing teams to take over the codebase when needed, combining speed with eventual ownership.',
      'If your priority is rapid validation and shipping small to medium apps quickly, Meku provides a compelling path. For complex, heavily regulated systems, Meku can accelerate prototyping but should be paired with standard engineering rigour for productionization.'
    ]
  },
  {
    id: 'case-studies',
    title: 'Representative use cases and outcomes',
    summary: 'Examples of how teams use Meku to accelerate projects and measure outcomes.',
    paragraphs: [
      'Launching landing pages: A marketing team used Meku to produce localized landing pages for a campaign in hours rather than days, iterating quickly on messaging and conversion flow.',
      'MVP for product ideas: A founder prototyped a curated marketplace, validated demand via early signups, and then exported the project to a GitHub repo for continued development.',
      'Internal tools and admin panels: Meku generated an internal dashboard for operations with auth, basic reporting and integrations to existing APIs—delivering a usable admin tool in a fraction of the usual time.'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best practices for prompt-driven app building',
    summary: 'Guidelines to get high‑quality outputs and maintain long‑term code health.',
    paragraphs: [
      'Iterative prompting: Start broad, then refine. Begin with a high‑level prompt to generate a working scaffold, then iterate to add details. Iteration yields better structure than attempting to describe every detail upfront.',
      'Specify integrations early: If your app needs a payment provider or database schema, include that in your initial prompt so the scaffold accounts for necessary models and endpoints.',
      'Review and refactor: Treat generated code as a fast scaffold—refactor to align with team standards, add tests, and enforce linting.',
      'Document decisions: Record prompt iterations, design choices, and tradeoffs in the repository so future maintainers understand why code is structured a certain way.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently asked questions',
    summary: 'Short answers to common evaluation and operational questions.',
    paragraphs: [
      'Can I export projects? Yes—Meku supports downloading project files and pushing to GitHub for continued development.',
      'Is the code production ready? Meku generates opinionated, modern code. Production readiness depends on additional engineering practices: testing, security reviews, and performance tuning.',
      'Can I run Meku locally or self‑host? Check Meku’s documentation for self‑hosting options; many teams prefer exported code in their own infrastructure for long‑term control.',
      'How are templates and remixes licensed? Review the community license terms—many templates are open to remix, but confirm licensing if you plan commercial distribution.'
    ]
  }
];

export default function Meku() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/meku`;
    } catch {
      return '/meku';
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
    upsertMeta('keywords', 'Meku, Meku.dev, AI web app builder, prompt-driven apps, remix templates, deploy web apps');
    upsertCanonical(canonical);

    injectJSONLD('meku-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('meku-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Meku — Build Beautiful Web Apps with Simple Prompt',
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
    injectJSONLD('meku-faq', {
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
        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 md:p-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">Create and Deploy with AI</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Build Beautiful Web Apps with Simple Prompt</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Turn an idea into a production-ready web app in minutes. Meku combines prompt-driven generation, instant previews, and hosting to help you ship faster.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Comprehensive guidance for discovery, evaluation, and adoption of Meku.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Includes community signals, templates, and production tips.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Meku</p>
                <p className="mt-2 text-sm text-slate-600">AI web app generation, templates, and hosting.</p>
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

            <section id="register" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Accelerate Organic Growth</h2>
                <p className="mt-2 text-slate-700">If you want pages like this to rank faster, strategic backlinks from authoritative sites increase topical authority and referral traffic.</p>
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
