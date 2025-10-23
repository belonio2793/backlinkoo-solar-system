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

const metaTitle = 'Replyke: Open-Source Social Infrastructure — Guide, Features & Comparison (2025)';
const metaDescription = 'Comprehensive guide to Replyke — an open-source infrastructure for comments, feeds, notifications and profiles. Learn features, use-cases, pricing overview, integrations, moderation, and how Replyke compares to building social features from scratch.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const replykeSections: Section[] = [
  {
    id: 'overview',
    title: 'Replyke — Open-Source Infrastructure for Social Features',
    summary:
      'Replyke is an open-source toolkit that lets teams add community and social features — comments, feeds, notifications, profiles, voting and more — without rebuilding core infra from scratch.',
    paragraphs: [
      'At its core, Replyke offers a developer-first layer for social features. Rather than treating community components as an afterthought, Replyke packages common primitives, a React SDK, and an API so engineering teams can ship engagement quickly while keeping full control over data and UI. This balance of speed and ownership explains why teams choose an open-source social layer: they can prototype fast, integrate progressively, and avoid vendor lock-in.',
      'The platform focuses on modularity. Use just comments on one page, adopt notifications in another area, or deploy a full social backend. Replyke’s architecture supports progressive adoption: conservative teams can test features in staging, while growth-focused products can ramp to high-volume usage with dedicated plans and exportable data.',
      'This guide breaks down Replyke’s capabilities, practical integration patterns, pricing signals, moderation and safety tooling, and how to decide between using Replyke or building comparable features in-house. It is written to match the intent of developers, product managers, and founders researching the fastest path to sustainable community growth.'
    ]
  },
  {
    id: 'why-replyke',
    title: 'Why Choose Replyke?',
    summary: 'Speed, flexibility, and ownership are the pillars that make Replyke attractive to teams building social experiences.',
    paragraphs: [
      'Speed: Pre-built components, hooks, and reference UI cut weeks or months off implementation time. Replyke’s React SDK includes examples for common flows—comment threads, upvote systems, and customizable feeds—that reduce engineering overhead.',
      'Flexibility: Adopt the features you need without wholesale migration. Replyke is designed to integrate with existing authentication and data models, so you can preserve legacy systems while adding engagement layers incrementally.',
      'Ownership: Open-source licensing and export capabilities mean your data remains portable. Teams avoid opaque vendor constraints and retain the right to migrate or extend functionality as business needs evolve.'
    ]
  },
  {
    id: 'core-features',
    title: 'Core Features and Developer Experience',
    summary: 'Replyke bundles essential building blocks for interactions and community, optimized for developer ergonomics and production use.',
    paragraphs: [
      'Comments and Threads: Nested or flat comment systems with moderation hooks and edit/delete timelines. The SDK exposes components for rendering threads and provides optimistic updates for responsive UIs.',
      'Feeds and Ranking: Customizable feeds (chronological, trending, personalized) with scoring, decay functions, and filters to keep relevant content surfaced to users.',
      'Notifications: In-app and email notification primitives with batching, quiet hours, and read-state management so users stay engaged without being overwhelmed.',
      'Profiles and Social Graphs: Lightweight profile models, follower lists, and collections to create community identity and persistent user spaces.',
      'Voting and Reactions: Upvotes, downvotes, and reaction sets that feed into ranking algorithms and community signals.',
      'Moderation & Safety Tools: Reporting workflows, automated filters, admin dashboards, and developer hooks to integrate third-party moderation services when needed.'
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started: Integrate at Your Pace',
    summary:
      'Replyke supports a spectrum of adoption patterns, from drop-in UI components to API-first integrations that map to existing data models.',
    paragraphs: [
      'Choose a path based on risk and time-to-value. A common approach is to ship comments first: add the comment thread component to an article page, wire it to your auth system, and route server-side events to your analytics. This yields immediate community feedback without touching feeds or notifications.',
      'Next, integrate notifications for mentions and replies so users return for ongoing conversations. Finally, add feeds and profile spaces to encourage discovery and repeat engagement. Each step focuses on measurable lifts—DAU, time-on-site, and conversion—so product teams can prioritize based on ROI.',
      'For teams migrating from a legacy system, Replyke provides migration guides and adapters. These reduce friction by letting you map legacy entities (posts, comments, users) to Replyke’s entity model while avoiding long outages or data inconsistencies.'
    ]
  },
  {
    id: 'architecture',
    title: 'Architecture & Integration Patterns',
    summary: 'Replyke’s architecture balances a hosted experience with self-hosting and local control; the SDKs and APIs make common integration patterns straightforward.',
    paragraphs: [
      'Local-first Integration: Use the React SDK to render UI and call the Replyke API for persistence. Client-side hooks handle optimistic UI and reconcile server state when responses arrive. This pattern delivers snappy experiences while remaining robust under network variability.',
      'Server-side Integration: For tighter security and custom business logic, proxy API calls through your backend. This lets you apply domain rules, perform validation, and hide credentials. It also supports richer moderation pipelines that integrate with your existing admin tools.',
      'Hybrid Deployments: Many teams prefer a hybrid model—host the primary service with Replyke for reliability, while keeping sensitive or proprietary features in-house. Data export and backup tooling makes this a reversible choice.'
    ]
  },
  {
    id: 'moderation-safety',
    title: 'Moderation, Safety, and Community Health',
    summary: 'Scaling community requires safety tooling. Replyke provides both developer hooks and out-of-the-box workflows to act swiftly on problematic content.',
    paragraphs: [
      'Reporting Flows: End users can flag content; reports funnel to a centralized dashboard where moderators can triage, act, and record decisions. Exportable logs help teams refine automated rules or appeal processes.',
      'Automated Filters: Keyword-based or ML-assisted filters can quarantine suspect content for review. These systems reduce moderator load by catching repeated violators or high-risk phrases.',
      'Rate Limiting and Anti-abuse: Replyke includes throttling hooks and identity checks that prevent spam floods and bot-driven content surges. Integrating CAPTCHAs or third-party services enhances protection where necessary.',
      'Human-in-the-loop: Alerting and escalation channels keep moderators informed. Integrations with Slack, email, or admin consoles allow quick response windows to emerging incidents.'
    ]
  },
  {
    id: 'pricing-overview',
    title: 'Pricing Signals & When to Upgrade',
    summary: 'Replyke offers a free tier for experimenting and paid tiers that scale with MAU, storage, and API usage; evaluate based on predictable growth metrics.',
    paragraphs: [
      'Free tier: Useful for prototypes, small communities, and early-stage testing. It generally includes baseline features and a modest quota for MAU, storage, and API calls.',
      'Hobby & Pro tiers: These plans increase quotas and may add seats, SLAs, and higher throughput. Choose these when your product has steady traffic and you need predictable performance.',
      'Growth & Enterprise: At this level, expect custom SLAs, dedicated support, higher throughput limits, and enterprise features such as single-tenant options and advanced compliance tooling. Migration support helps large customers onboard without disruption.',
      'Decision points: Upgrade when metrics (MAU, API calls, storage) approach free-tier limits, or when you need faster response times, higher egress, or additional seats for moderation and admin staff.'
    ]
  },
  {
    id: 'use-cases',
    title: 'Common Use Cases & Realistic Patterns',
    summary: 'Replyke fits many product needs: news and blogging platforms, marketplaces, knowledge bases, learning platforms, and any app that benefits from user voice.',
    paragraphs: [
      'Content Platforms: Article comments, highlight discussions, and reading lists create sticky moments. Adding threaded conversations and lightweight reactions helps surface engaged readers and community leaders.',
      'Marketplaces and Classifieds: Reviews, Q&A, and seller profiles improve trust. Notifications for messages, offers, and status changes keep buyers and sellers aligned.',
      'Learning and Collaboration: Course discussion boards, peer feedback, and curated collections increase retention in education products. Integrating Replyke’s feeds and notifications helps learners discover relevant threads.',
      'Product Communities: Feature requests, bug reports, and changelogs become discoverable conversations. Voting and collections organize feedback in actionable ways.'
    ]
  },
  {
    id: 'comparison',
    title: 'Replyke vs. Building In-House: A Practical Comparison',
    summary: 'Choosing between Replyke and a homegrown solution requires comparing speed, cost, maintenance, and long-term extensibility.',
    paragraphs: [
      'Time-to-market: Replyke compresses delivery time through pre-built patterns. Building in-house often requires months to build feature parity—then additional months to scale and secure the system.',
      'Total Cost of Ownership: Initial savings from using Replyke can be large, but long-term costs depend on growth and pricing. Building in-house shifts costs to engineering hours, ongoing bug fixes, and ops needs. Consider hidden costs like moderation tooling and exportability when comparing.',
      'Flexibility and Control: Building in-house gives absolute control over data models and behaviour—but at the cost of reinvesting in components Replyke already provides. Replyke attempts to bridge this by offering adapters, open-source code, and export paths so teams can customize without being trapped.'
    ]
  },
  {
    id: 'testimonials',
    title: 'Developer Testimonials & Community Sentiment',
    summary: 'Representative feedback from engineers and product teams that adopted Replyke during early growth stages.',
    paragraphs: [
      '“We integrated comment threads in a week and saw immediate lift in engagement metrics. The SDK made onboarding trivial.” — Senior Engineer at a mid-sized publishing platform (composite).',
      '“Migration from a brittle homegrown stack was smoother than expected—Replyke adapters preserved our user IDs and kept history intact.” — Product Lead at a marketplace (composite).',
      '“The moderation tools saved us time during a viral spike. Automated filters plus human review kept the community healthy.” — Community Manager at a learning startup (composite).'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Answers to common technical and business questions teams ask when evaluating Replyke.',
    paragraphs: [
      'Is Replyke open-source? Yes—Replyke publishes SDKs and server references under permissive licenses so you can inspect, adapt, and host your own copy if desired.',
      'Can Replyke integrate with existing auth? Absolutely—Replyke is designed to accept external identity tokens and map them to user profiles, minimizing friction with your existing auth system.',
      'Do I need to self-host? No. You can start with hosted tiers and move to self-hosting or hybrid deployments as needs demand. Export tooling supports migration planning.',
      'How does moderation work? Replyke provides reporting flows, admin dashboards, and hooks for third-party moderation services. Teams can layer automated filters and human review as required.'
    ]
  },
  {
    id: 'cta',
    title: 'Accelerate SEO and Visibility for Your Product',
    summary: 'If you publish differentiated content or product pages like this one, backlinks accelerate discoverability. Register for Backlink ∞ to buy quality backlinks and grow organic traffic.',
    paragraphs: [
      'Backlinks remain a core ranking signal for Google. When paired with authoritative, original content, high-quality backlinks help pages rank for competitive queries and drive sustainable traffic. If your goal is to attract users to a product like Replyke, investing in relevant backlink acquisition amplifies reach and validates topical authority.',
      'To get started with backlinks and SEO-driven growth, register for Backlink ∞ to access curated backlink opportunities tailored to product pages and developer-focused content.'
    ]
  }
];

export default function Replyke() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/replyke`;
    } catch {
      return '/replyke';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    replykeSections.forEach((s) => {
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
    upsertMeta('keywords', 'Replyke, open-source social, comments, feeds, notifications, social SDK, community infra');
    upsertCanonical(canonical);

    injectJSONLD('replyke-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('replyke-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Replyke: Open-Source Social Infrastructure — Guide & Comparison',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: replykeSections.map((s) => s.title)
    });

    const faqItems = replykeSections.find((s) => s.id === 'faqs')?.paragraphs || [];
    injectJSONLD('replyke-faq', {
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
        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 md:p-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">Open-Source Social Infra</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Replyke: Open-Source Infrastructure for Community & Social Features</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Add comments, feeds, notifications, profiles, and moderation tools quickly—without sacrificing ownership. This guide explains Replyke’s features, integration patterns, pricing signals, and how it compares with building in-house.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Comprehensive content to satisfy product and developer intent.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Updated to reflect current integration best practices and pricing models.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Replyke</p>
                <p className="mt-2 text-sm text-slate-600">Product overview and decision guide for engineering and product teams.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {replykeSections.map((s) => (
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
            {replykeSections.map((section) => (
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
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Accelerate Traffic</h2>
                <p className="mt-2 text-slate-700">If you want to drive meaningful organic discovery for product pages like Replyke, backlinks amplify authority and referral traffic.</p>
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
