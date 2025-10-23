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

const metaTitle = 'Celaro — The Creative Project Tracker: Flows, Forecasting & Focus (2025 Guide)';
const metaDescription =
  'Celaro is a project tracker built for creative teams. This comprehensive guide explains Flows, daily planning, time tracking, forecasting, resource management, and how Celaro helps teams enter flow and ship reliably.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Celaro: The Creative Project Tracker',
    summary:
      'Celaro is a project tracker purpose‑built for creative teams—designers, developers, product managers and studios that value speed, clarity and uninterrupted flow. It focuses on minimalism, keyboard‑first interfaces, and structured workflows called Flows.',
    paragraphs: [
      'At its heart, Celaro is an opinionated project tracker that trades generic complexity for a focused, delightfully fast experience. While many trackers aim to be everything to everyone, Celaro concentrates on how creative teams actually work: day planning, short cycles, meaningful forecasts, and lightweight time tracking that informs resource decisions rather than burdens teams with admin.',
      'The product emphasizes two complementary goals: help individuals get into a state of flow for sustained output, and give teams clear forecasted visibility so leaders can plan and adapt. To accomplish this, Celaro blends a distraction‑free UI, keyboard power, and flow constructs—reusable templates and step sequences that encode how work moves from idea to done.',
      'This guide breaks down Celaro’s key features, explains practical workflows for adoption, compares the platform to alternatives, and outlines the governance and procurement signals teams should consider when evaluating a focused creative project tracker.'
    ]
  },
  {
    id: 'hero-concept',
    title: 'Design Philosophy: Flow, Focus, and Speed',
    summary: 'Celaro’s experience is driven by a simple thesis: great work requires flow. Everything in the product is built to support uninterrupted, high‑quality work and to minimize context switching.',
    paragraphs: [
      'Flow is a cognitive state where ideas move seamlessly to execution. Celaro designs around that state: a keyboard‑friendly command palette, rapid task entry, and view modes that surface only the information you need to act right now. The goal is to reduce friction between intention and execution.',
      'The product’s minimal aesthetic is deliberate. Visual simplicity removes distraction, allowing teams to focus on craft. Yet under the hood Celaro provides structured features—Flows, Forecasting, Resource Management—that scale from a solo creator to a multi‑team studio without adding needless complexity.',
      'Speed is both perceived and real: keyboard shortcuts, minimal modals, and predictable navigation enable power users to move faster than with heavyweight, mouse‑driven tools. For teams, that speed compounds into more value delivered per week.'
    ]
  },
  {
    id: 'flows',
    title: 'Flows: Structure That Enables Creativity',
    summary: 'Flows are Celaro’s signature construct—reusable sequences of steps, checkpoints, and handoffs that encode how a project progresses.',
    paragraphs: [
      'Flows formalize repeatable work. A Flow can represent a design review, a sprint kickoff, a launch checklist, or a client intake process. Each Flow encapsulates tasks, owner handoffs, optional time estimates, and checkpoints to make the project predictable without being prescriptive.',
      'By capturing the rhythm of work, Flows reduce the cognitive load required to start and maintain a project. Rather than recreating the same checklist each time, teams instantiate a Flow and adjust the steps contextually. Over time, Flows become a company’s living playbook.',
      'Flows integrate with daily planning: when individuals begin their day, they can pick a Flow instance and see the next logical tasks to own. This keeps the individual focused while preserving team‑level visibility across multiple active Flows.'
    ]
  },
  {
    id: 'daily-planning',
    title: 'Daily Planning: The Small Habit That Changes Everything',
    summary: 'Celaro encourages short, intentional daily planning that aligns individual focus with team priorities.',
    paragraphs: [
      'Daily planning is not complex: it’s about choosing the most meaningful work for the day. Celaro provides a lightweight daily planning view where creators can surface high‑impact tasks, block time, and note dependencies. The interface encourages concise commitments rather than long, unrealistic todo lists.',
      'Pair daily planning with quick check‑ins. Teams can share short status notes—what they accomplished yesterday, what they plan today, and any blockers—reducing the need for lengthy synchronous standups and freeing time for deep work.',
      'For managers, aggregated daily plans reveal true capacity and allow for adaptive reallocation. Instead of guessing where effort goes, leaders can see the commitments people made and forecast likely outcomes for the week.'
    ]
  },
  {
    id: 'time-tracking',
    title: 'Time Tracking & Forecasting: Insight Without Overhead',
    summary: 'Measure to manage: Celaro provides unobtrusive time tracking and forecasting tools that inform planning without creating excessive admin work.',
    paragraphs: [
      'Time tracking is valuable only if it is low‑friction and directly informs decisions. Celaro’s approach is to make tracking optional, easy, and contextual. Start/stop controls live next to tasks, and quick manual entry is supported. The goal is to collect signal, not audit every minute.',
      'Forecasting translates tracked effort and estimates into a clear picture of upcoming capacity. Project leads can view how current commitments map to available hours and spot bottlenecks early—before they become blockers.',
      'Combine forecasting with Flows to model how repeating work consumes time. This helps teams price scoping decisions, set realistic deadlines, and align resourcing with expected delivery windows.'
    ]
  },
  {
    id: 'resource-management',
    title: 'Resource Management: People, Budgets and Priorities',
    summary: 'Understand who is available, where budgets are allocated, and how priorities should shift to meet deadlines.',
    paragraphs: [
      'Celaro treats resourcing as a living view. Assignments are first‑class metadata on tasks and Flow instances, and the resource panel surfaces onboarding, vacations, and overloaded team members to prevent overcommitment.',
      'Budget tracking is integrated for projects that require cost oversight. Link estimates and actual tracked time to budget lines so stakeholders can see marginal costs and adjust scope or timeline as needed.',
      'Prioritization is operationalized through the Flow orchestration. When capacity tightens, teams can reassign lower priority Flow steps automatically or reschedule commitments so that critical work stays on track.'
    ]
  },
  {
    id: 'designers-developers',
    title: 'For Designers and Developers: A Shared Tool That Respects Craft',
    summary: 'Celaro is purposefully built for teams where creators and builders collaborate—offering features that respect designers’ workflows and developers’ need for clarity.',
    paragraphs: [
      'Designers appreciate Celaro for its visual clarity and the way Flows capture iterative review cycles. The platform enables quick handoffs—a design review Flow, for instance, can include steps for prototype links, annotations, and sign‑off conditions.',
      'Developers value predictable tickets, clear acceptance criteria, and minimal context loss. Celaro’s task model supports code links, PR references, and short technical notes that stay close to the task without cluttering the primary view.',
      'Shared Flows reduce miscommunication. Both designers and developers work from the same sequence of steps, which ensures that handoffs contain the exact artifacts and expectations needed for the next stage.'
    ]
  },
  {
    id: 'work-in-present',
    title: 'Work In The Present. Plan For The Future.',
    summary: 'Celaro balances immediate execution with long‑term foresight—so teams can focus today while maintaining a reliable roadmap for tomorrow.',
    paragraphs: [
      'The present is where value is produced; the future is where value is realized. Celaro’s interface makes acting in the present effortless while providing compact forecasts that drive roadmap conversations. This approach reduces the tension between day‑to‑day delivery and strategic planning.',
      'Use short horizon forecasts to inform weekly capacity planning. These forecasts are based on tracked time, Flow templates, and existing commitments. Leaders can then translate capacity into realistic delivery promises for stakeholders.',
      'Over time, the combination of good daily habits and accurate forecasting creates a predictable cadence: fewer emergency firefights, more reliable launches, and sustainable team throughput.'
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations: Connect Where You Already Work',
    summary: 'Celaro integrates with common design and developer ecosystems so work stays linked and friction remains low.',
    paragraphs: [
      'Design tool links: Attach Figma prototypes and artboards directly to tasks and Flow steps so reviewers jump to the correct frame without searching. This preserves context and accelerates feedback cycles.',
      'Version control and PRs: Link GitHub pull requests and commits to tasks to preserve traceability between code changes and the underlying ticket or Flow step.',
      'Calendar sync: Bidirectional calendar sync allows teams to block time for daily planning and to capture external constraints like launch dates or stakeholder availabilities.',
      'Third‑party integrations: Zapier or webhooks support automation into CRMs, billing, or other systems for cross‑team orchestration.'
    ]
  },
  {
    id: 'onboarding-adoption',
    title: 'Adoption & Onboarding: How Teams Get Started',
    summary: 'A pragmatic adoption path starts small—pilot with one team, use Flows to standardize repeatable work, then expand via templates and governance.',
    paragraphs: [
      'Pilot with a single high‑value Flow. Choose a recurring process such as a design review or release checklist. Implement the Flow, run it for several cycles, and measure outcomes: time to complete, number of iterations, and alignment quality.',
      'Create starter templates and documentation for common team patterns. Encourage teams to adapt templates rather than rebuild from scratch—this accelerates consistency and shortens onboarding.',
      'Train power users who become Celaro champions. These early adopters help peers migrate their workflows and provide feedback for Flow improvements that benefit the whole organization.'
    ]
  },
  {
    id: 'comparison',
    title: 'How Celaro Compares to Traditional Trackers',
    summary: 'Celaro is opinionated: it avoids being a general purpose swiss‑army tool and instead focuses on the needs of creative teams. That focus is its strength.',
    paragraphs: [
      'Many mainstream trackers prioritize configurability and breadth, which serves large engineering orgs well. Celaro’s narrower scope provides a lighter, more joyful experience for teams where creative flow and rapid iteration matter more than complex workflow engines.',
      'Unlike heavy enterprise tools that require admins and months of configuration, Celaro shines when teams want to ship visually and iteratively with minimal setup. If your team needs enterprise escalation, advanced SSO, or dense project governance, Celaro can integrate with those systems while preserving a simple day‑to‑day surface.',
      'For studios and small product teams, Celaro reduces context switching and helps creators finish more high‑quality work with less cognitive debt.'
    ]
  },
  {
    id: 'pricing-signals',
    title: 'Pricing signals and procurement',
    summary: 'Celaro’s pricing strategy typically targets small teams and studios with simple plans and optional business tiers for larger customers.',
    paragraphs: [
      'When evaluating cost, measure not only subscription fees but the team velocity gains and reduced coordination costs. A faster, clearer workflow often offsets subscription expense through saved time in reviews, fewer status meetings, and shorter feedback loops.',
      'Ask vendors for pilot terms that provide enough usage for a meaningful test: a month with real projects, ideally with a small seats bundle and support. This produces concrete ROI evidence for procurement teams.',
      'For larger organizations, investigate seats, guest contributors, and integrations pricing to ensure the rollout remains predictable as adoption grows.'
    ]
  },
  {
    id: 'testimonials',
    title: 'Community Voices & Designer Testimonials',
    summary: 'Representative sentiments from designers, product managers and small studios who adopted Celaro.',
    paragraphs: [
      '"Celaro reduced friction in our design reviews—no more hunting for the latest frames, and reviews happen faster with clearer acceptance criteria." — Product Designer (composite)',
      '"We replaced a complicated ticket system with Celaro for our small studio. We ship faster and enjoy the process more." — Studio Lead (composite)',
      '"Daily planning became a simple habit rather than a chore; the team is calmer and deadlines are more reliable." — Engineering Manager (composite)'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices to Maximize Flow',
    summary: 'Operational habits and design patterns that help teams get the most from Celaro.',
    paragraphs: [
      'Keep tasks small and focused: small tasks are easier to estimate, complete and review. They reduce handoff friction and shorten feedback loops.',
      'Use Flow templates for repeated work: encode review processes, client handoffs, and launch checklists as templates so every iteration starts from a reliable baseline.',
      'Block focus time: Pair daily planning with intentional calendar blocks to protect deep work. Teams that protect maker time ship higher quality work more consistently.',
      'Review analytics weekly: Track Flow throughput, average completion times, and forecast accuracy to surface process improvements.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Short answers to common questions about Celaro’s fit, features, and adoption.',
    paragraphs: [
      'Is Celaro only for designers? No. While Celaro is tailored for creative teams, its features support cross‑functional work involving engineers, product managers and operations.',
      'Can Celaro replace our existing tracker? It can for many small to mid‑size teams. For enterprise customers with complex requirements, Celaro often complements existing systems by handling creative workflows while deeper integrations manage governance.',
      'Does Celaro support time tracking? Yes—lightweight time tracking and forecasting are built in to inform planning decisions rather than enforce time audits.',
      'Is there a free trial? Celaro frequently offers a free start tier for small teams and trial periods to evaluate core flows—refer to the pricing page for current offers.'
    ]
  }
];

export default function Celaro() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/celaro`;
    } catch {
      return '/celaro';
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
    upsertMeta('keywords', 'Celaro, creative project tracker, flows, time tracking, daily planning, resource management');
    upsertCanonical(canonical);

    injectJSONLD('celaro-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('celaro-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Celaro — The Creative Project Tracker',
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
    injectJSONLD('celaro-faq', {
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
        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-pink-50 via-white to-yellow-50 p-6 md:p-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-700">The Creative Project Tracker</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Celaro — A Project Tracker Designed To Make You Flow</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Build predictable projects without killing creativity. Celaro helps teams plan, track and forecast work in a fast, minimal, keyboard‑friendly interface so individuals and teams can focus on craft.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">A deep dive into flows, planning, and creative velocity.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Best practices and practical adoption guidance.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Celaro</p>
                <p className="mt-2 text-sm text-slate-600">Creative project tracking, flows, and forecasting.</p>
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

            <section id="register" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6 shadow-sm md:p-8">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Scale Organic Reach</h2>
                <p className="mt-2 text-slate-700">If you want product pages like this one to rank faster, backlinks from relevant and authoritative sites increase topical authority and drive referral traffic.</p>
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
