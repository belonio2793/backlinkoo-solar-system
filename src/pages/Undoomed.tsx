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

const metaTitle = 'UNDOOMED — Stop Doomscrolling & Reclaim Focus (2025 Guide)';
const metaDescription = 'Stop doomscrolling and refocus with a respectful companion that guides your next step.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'UNDOOMED: A Respectful Companion to Stop Doomscrolling',
    summary:
      'UNDOOMED is a lightweight, privacy‑first application designed to reduce endless social feeds and restore intentional time on the web. It is built as a calm, on‑device companion that filters addictive content, nudges healthier behavior, and provides simple, actionable statistics so you can reclaim focus without shame.',
    paragraphs: [
      'Doomscrolling — the compulsion to endlessly consume short, emotionally charged content — is a modern attention problem with outsized consequences. UNDOOMED approaches this challenge with a simple thesis: you don\'t need another punitive app or a social‑engineering coach; you need a respectful interface that reduces the triggers that create endless loops and gives you clear, supportive next steps.',
      'Undoomed avoids judgement. It works locally on your device, applies powerful filters to hide the most addictive areas of social apps (shorts, autoplay, Explore tabs), and surfaces calmer, productive spaces such as direct messages and subscriptions. The result is a quieter digital environment where intention, not dopamine, guides your choices.',
      'This page walks through UNDOOMED\'s philosophy, core features, use cases, privacy model, and practical adoption tips. Whether you are a parent who wants gentle controls for your family, a professional seeking fewer distractions, or a curious individual wanting to measure and improve how you spend time online, UNDOOMED is designed to be useful, unobtrusive, and kind.'
    ]
  },
  {
    id: 'concept',
    title: 'Design Concept: Respect, Control, and Clarity',
    summary: 'UNDOOMED is built around three pillars: respect for users, simple control over attention triggers, and clear measurement of progress.',
    paragraphs: [
      'Respect: UNDOOMED frames interruption as a design problem, not a moral failing. Rather than imposing guilt or intrusive tracking, the product opts for gentle nudges and optional guidance. The interface is calm and neutral, avoiding alarmist language and coercive patterns.',
      'Control: At the core are powerful filters and lightweight controls. Users choose which parts of a site are visible and which are hidden: short clips, autoplay, Explore-style discover feeds, and more. Controls are intentionally granular: you can hide a single feature on one site while keeping other areas accessible.',
      'Clarity: Measurement is focused and human. Instead of complex dashboards that overwhelm, UNDOOMED surfaces a Clarity Score and simple trends (24h, 7d, 30d) so people can observe progress and make small, realistic habit changes. The goal is to reinforce positive behavior, not to create punitive audits.'
    ]
  },
  {
    id: 'features',
    title: 'Key Features — Filters, Limits, and One‑Tap Breaks',
    summary: "UNDOOMED's feature set emphasizes quiet control: filter out attention traps, apply time limits, secure settings with parental locks, and measure meaningful progress.",
    paragraphs: [
      'Powerful Filters: The primary mechanism is filtering. UNDOOMED can hide short clips, For You feeds, Reels/Shorts/Stories carousels, autoplay, and Explore or Discover tabs across the major social platforms. By removing the most algorithmically amplified surfaces you reduce low‑effort consumption without banning whole apps.',
      'Messages Only Mode: An opt‑in mode that collapses a site to its conversation and subscription areas. If your intent is to check messages or follow specific channels, this mode surfaces those spaces and hides the rest, reducing the chance you end up on an endless scroll.',
      'Time Limits: Flexible per‑site or global time limits let you choose how much passive scrolling is acceptable. Limits can apply per hour or per day, and you can decide whether they restrict all use or only the endless feed components. When a limit hits, UNDOOMED offers a choice — close the feed, switch to a productive action, or acknowledge and continue with a gentle reminder.',
      'Clear Statistics & Clarity Score: UNDOOMED aggregates usage into clear, actionable metrics: time spent in endless feeds, number of interruptions, and a rolling Clarity Score that tracks progress over 24 hours, 7 days and 30 days. The focus is on trend and momentum rather than blame.',
      'Parental Lock (Optional): For households, an optional parental lock secures filter settings behind a 4‑digit PIN that is salted and hashed and stored on the device. This keeps preferences private and prevents easy circumvention while preserving on‑device privacy.',
      'Private by Design: UNDOOMED requires no account, does not sync data to the cloud, and contains no ads or third‑party trackers. All personalization and data remain local to the device, reducing privacy concerns that often accompany attention management tools.',
      'Thoughtful UI & Accessibility: The app ships with light and dark modes, accessible typography, high contrast options, and smooth animations that convey state changes without startling the user. The aim is a calm, humane experience.',
      'Multi‑Platform Support: UNDOOMED works with major social websites by opening them inside an embedded browser surface where filters and controls are applied. Users can pin the specific sites they use and configure per‑site behaviors.',
      'One‑Tap Break: A persistent, one‑tap break action interrupts endless feeds with a gentle prompt and suggests a clear next step — take a timed break, switch to messages, or open an app for a meaningful activity. That small interruption is often enough to disrupt the autopilot loop.'
    ]
  },
  {
    id: 'how-it-works',
    title: 'How It Works — Local Filters, Minimal Permissions',
    summary: 'UNDOOMED operates primarily on device, applying DOM‑level filters and presenting a curated view of web apps without requiring an account or cloud backend.',
    paragraphs: [
      'Architecture: UNDOOMED opens sites inside an embedded view and applies targeted rules to hide selectors that correspond to shorts, autoplay elements, and recommendation panels. These rules are maintained by the app and updated regularly to keep pace with UI changes, but the filtering itself executes locally.',
      'Privacy and Permissions: Because the app manipulates page content locally, it does not need to collect browsing history or personal tokens. Permissions are limited to what is necessary to render the embedded site and maintain local preferences. Optional analytics are only available if explicitly enabled by the user and remain on the device.',
      'Customization: Users can pin preferred sites and save per‑site filter sets. For example, you might allow autoplay on a hobby channel while blocking it on a news feed. This customization balances convenience with attention control.',
      'Fail‑safe Behavior: If a site changes layout and filters no longer match, UNDOOMED falls back to a safe mode that surfaces a minimal, readonly view rather than exposing the full site. This prevents accidental reintroduction of attention traps while rules are being updated.'
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security: No Cloud, No Trackers',
    summary: 'UNDOOMED intentionally minimizes data collection. The privacy posture is simple: keep everything on device unless the user opts in to more features.',
    paragraphs: [
      'No Accounts Required: UNDOOMED does not require a login or an email address. Personalization lives locally, which eliminates many data leakage vectors and simplifies consent.',
      'On‑Device Storage: Settings, pin lists, and filtered rule sets are stored in the device\'s secure storage. Parental PINs use salted hashing and leverage platform secure enclaves where available.',
      'Opt‑In Metrics: The app can store optional, anonymized usage metrics solely on the device for trend visualization. If a user chooses to export or backup settings, they are explicitly asked for permission to place a copy into cloud storage of their choice.',
      'Transparency: UNDOOMED makes its filtering rules and permissions transparent. Users can inspect which elements are being hidden, temporarily disable filters, or report false positives so the rule set improves over time.'
    ]
  },
  {
    id: 'parental-lock',
    title: 'Parental Lock: Gentle Household Controls',
    summary: 'An optional parental lock protects filter configuration so that households can agree on norms without easy circumvention.',
    paragraphs: [
      'Approach: The parental lock is intentionally lightweight: a 4‑digit PIN that gates access to sensitive settings. This prevents casual bypass while avoiding the friction of heavy parental control systems.',
      'Implementation: A salted hash of the PIN is stored in the device secure storage; the app never stores or transmits plain PINs. Parents can set or reset the PIN through on‑device flows, and recovery options are documented within the app to avoid lockout situations.',
      'Household Practices: UNDOOMED is not designed to replace parental conversations. It is a tool to support shared agreements: parents and children who discuss limits and agree on them tend to have better outcomes than those who rely solely on enforcement.'
    ]
  },
  {
    id: 'time-limits-behavior',
    title: 'Time Limits & Behavior Change: Gentle, Effective Interventions',
    summary: 'UNDOOMED uses small, consistent interventions rather than heavy-handed blocking to encourage sustainable habits.',
    paragraphs: [
      'Micro‑limits: Short, hourly limits encourage momentary awareness — a gentle reminder that you can reassert control before an hour of passive consumption accumulates. These are especially useful for professionals who want to preserve focused blocks throughout the workday.',
      'Daily Budgets: A daily limit is useful for broader habit formation. Rather than an all‑or‑nothing ban, UNDOOMED lets you define a daily budget for passive consumption and surfaces a supportive prompt as you approach it.',
      'Choice Architecture: When a limit triggers, UNDOOMED offers meaningful alternatives: switch to messages only, take a five‑minute timed break, or open a curated list of productive activities. Giving agency reframes the experience from enforcement to mindful choice.',
      'Progress Over Perfection: The Clarity Score and trend graphs reward incremental improvement. Seeing a rising Clarity Score over weeks is a stronger motivator than a punitive usage report.'
    ]
  },
  {
    id: 'clarity-score',
    title: 'Clarity Score & Statistics: Simple Signals That Guide Change',
    summary: 'Rather than complex analytics, UNDOOMED surfaces a few human‑readable signals that matter for attention and wellbeing.',
    paragraphs: [
      'What the Score Measures: The Clarity Score is a simple composite metric built from time spent in endless feeds, frequency of interruptions, and adherence to chosen limits. The score is intentionally coarse — enough to show momentum without inviting obsessive tracking.',
      'Trend Views: The app shows 24‑hour, 7‑day and 30‑day trends so users can connect a behavior to real life: did reducing shorts on a commute lower evening reactivity? Did a week of Messages Only mode improve morning focus? These trends create narratives users can act on.',
      'Actionable Insights: Instead of raw numbers, UNDOOMED highlights one or two simple recommendations after each week — for example, lower an hourly cap or try Messages Only mode on certain sites. These micro‑recommendations are designed to be tried quickly and evaluated.'
    ]
  },
  {
    id: 'use-cases',
    title: 'Who Benefits from UNDOOMED?',
    summary: 'UNDOOMED is intentionally broad: it helps people who want less mindless browsing and more intentional online time—students, parents, professionals, and anyone curious about their attention.',
    paragraphs: [
      'Students: UNDOOMED helps students protect study blocks by hiding distraction surfaces and enabling Messages Only mode for necessary communications. Coupled with hourly micro‑limits, it creates pockets of deep work that are essential for learning.',
      'Parents: Parents can use UNDOOMED to reduce impulsive exposure to short, emotionally intense clips for younger family members, while keeping communication channels open for safety and connection.',
      'Professionals: For knowledge workers and creatives, UNDOOMED reduces shallow scrolling during the workday and supports scheduled break strategies where short, intentional breaks replace passive doomscrolling.',
      'Digital Minimalists & Curious Users: Not everyone wants to give up social platforms entirely. UNDOOMED is also a tool for people experimenting with a more deliberate digital diet—test filters, measure results, and iterate without heavy commitment.'
    ]
  },
  {
    id: 'comparisons',
    title: 'How UNDOOMED Compares to Other Tools',
    summary: 'UNDOOMED lives between full parental control suites and app‑blocking utilities. Its strength is local filtering combined with a humane UX.',
    paragraphs: [
      'Full Parental Control Suites: Those systems target compliance and monitoring. UNDOOMED is not about surveillance; it\'s about built‑in friction and habit shaping with privacy by default.',
      'App Blockers and Focus Timers: Tools like strict app blockers create hard walls that some users need, but others find brittle. UNDOOMED favors softer interventions and curated visibility to preserve utility while reducing addictive loops.',
      'Browser Extensions: Extensions can be powerful but often require permissions and do not work reliably on mobile. UNDOOMED is designed as a cross‑platform companion that works where people actually consume short‑form content: mobile and embedded web views.'
    ]
  },
  {
    id: 'adoption',
    title: 'Adoption & Setup: Start Small, Iterate Quickly',
    summary: 'A pragmatic rollout encourages trying a few targeted filters and monitoring changes for a week before adjusting.',
    paragraphs: [
      'Start with an Experiment: Pick one site and enable Messages Only on it for a week. Track the Clarity Score and notice changes in interruptions and time spent. Small, transparent experiments are easier to sustain.',
      'Tune Filters: Use the in‑app inspect tool to refine filters if some content still appears. The app provides a temporary disable toggle to confirm when a rule is hiding desired content.',
      'Use Parental Lock Sparingly: For families, set the PIN after discussing boundaries. Document the agreement so the lock complements, rather than replaces, conversations about healthy digital habits.'
    ]
  },
  {
    id: 'testimonials',
    title: 'What People Say',
    summary: 'Early users praise UNDOOMED for its lightweight approach, privacy focus, and immediate effects on attention.',
    paragraphs: [
      '“Subtle, respectful nudges that actually helped me stop infinite scrolling. Clean and fast.” — Ava L., early user',
      '“Love the lightweight feel. Privacy‑first and no guilt—exactly what I needed.” — Noah P., professional',
      '“Simple idea, well executed. A couple more customization options would make it perfect for me.” — Maya S., student',
      '“It\'s a tiny app with a big effect on my attention. Highly recommend.” — Leo G., parent'
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing & Upgrade Options',
    summary: 'UNDOOMED offers a generous free tier with optional plus and pro subscriptions for advanced features and trends.',
    paragraphs: [
      'Free: Core filters and basic on‑device functionality are available for free. The app is fully usable without creating an account and without ever transmitting your personal data off the device.',
      'Plus: Adds richer local statistics and trend visualizations (24h/7d/30d Clarity Score details). Suggested price points in the market are about €0.99 per month or €4.99 per year, purchased through the platform store.',
      'Pro: Combines Plus with advanced per‑site rules, scheduled filter profiles and enhanced focus tools. A reasonable market price is around €1.99 per month or €8.99 per year, handled via Apple/Google store purchases. All purchases are account store purchases and do not require a UNDOOMED account.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Short, direct answers to common questions about subscriptions, privacy, and device support.',
    paragraphs: [
      'Is there a subscription? Yes. UNDOOMED offers a free tier for core filters. Plus and Pro tiers are available as small, optional subscriptions through the relevant app stores. No account is required.',
      'How do I manage or cancel a subscription? Manage subscriptions through your Apple ID or Google Play subscriptions page. UNDOOMED does not handle billing or store user payment details.',
      'Where is my data stored? All settings, trends and PINs are stored on your device. Data is not shared or synced unless you explicitly export a backup.',
      'Can UNDOOMED break site functionality? Filters are conservative by default. If a page relies on hidden content, the app provides an easy disable toggle for that site and a safe mode fallback so essential functions remain available.'
    ]
  }
];

export default function Undoomed() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/undoomed`;
    } catch {
      return '/undoomed';
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
    upsertMeta('keywords', 'UNDOOMED, stop doomscrolling, attention, filters, clarity score, privacy, parental lock');
    upsertCanonical(canonical);

    injectJSONLD('undoomed-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('undoomed-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'UNDOOMED — Stop Doomscrolling & Reclaim Focus',
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
    injectJSONLD('undoomed-faq', {
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
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">UNDOOMED — Stop Doomscrolling</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">UNDOOMED — Reclaim Attention with Gentle, Private Controls</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">A privacy‑first companion that removes the most addictive surfaces on the web, surfaces productive spaces, and helps you build sustainable, deliberate habits without judgement.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">A comprehensive guide to UNDOOMED's design, features, and use cases.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Privacy‑first attention tools and practical adoption tips.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">UNDOOMED</p>
                <p className="mt-2 text-sm text-slate-600">Stop doomscrolling • attention • clarity</p>
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
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Scale Organic Reach</h2>
                <p className="mt-2 text-slate-700">If you want pages like this one to rank faster, backlinks from relevant and authoritative sites increase topical authority and drive referral traffic.</p>
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
