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

const metaTitle = 'Trupeer: The AI Video Platform for Product Teams — Complete Guide (2025)';
const metaDescription = 'A definitive guide to Trupeer — AI-powered video and guide creation for product teams. Learn features, workflows, translations, knowledge base, security, pricing signals, and migration strategies to accelerate documentation and onboarding.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const trupeerSections: Section[] = [
  {
    id: 'overview',
    title: 'Trupeer at a glance',
    summary:
      'Trupeer is an AI-first video platform that transforms rough screen recordings into polished product videos and step-by-step guides. It targets product, support, sales, and training teams that need rapid, branded, and multilingual content.',
    paragraphs: [
      'Trupeer’s core proposition is simple: save time while raising the quality of product content. Rather than rely on manual editing or separate authoring tools, teams capture a raw recording, then let Trupeer’s AI refine scripts, add studio-quality voiceovers, generate automated zooms, and produce accessible guides. The result is content that looks professional, remains on-brand, and is usable across onboarding, knowledge bases, demos, and marketing.',
      'This guide walks through the platform’s capabilities, practical workflows, translation and localization options, knowledge-base integration, analytics, security posture, and the business cases that justify adopting Trupeer. It is designed to satisfy different search intents—from technical evaluators seeking integration details to product leaders interested in efficiency gains.'
    ]
  },
  {
    id: 'how-it-works',
    title: 'How Trupeer works: From rough recording to finished asset',
    summary: 'Understand the minimal steps that take a raw screen recording to a branded video, translated guide, and embedded page.',
    paragraphs: [
      'Record: Use Trupeer’s native recorder or a browser extension to capture a screen, window, or tab. Unlike single-take tools, Trupeer captures context—clicks, cursor movements, and speech—so the AI can later align narration and visual focus.',
      'Generate: Upload or import the recording and let Trupeer transcribe the audio, polish the script, and propose a narrated track. The platform’s AI removes stutters and filler words, corrects grammar, and suggests concise phrasing that improves clarity and viewer comprehension.',
      'Enhance: Trupeer automatically applies professional edits—dynamic zooms to highlight important UI elements, annotations that point to clickable targets, and brand overlays that ensure consistent visual identity. Studio-quality voiceovers are generated in multiple languages and styles, providing options for local markets.',
      'Publish: Output to shareable pages, embed in product docs, or add to a centralized knowledge base with AI video search. Trupeer also produces chaptered guides and step-by-step checkpoints, turning one recording into many consumable learning assets.'
    ]
  },
  {
    id: 'core-features',
    title: 'Core features',
    summary: 'Trupeer combines AI-assisted script polishing, voice synthesis, intelligent zoom effects, avatars, brand templates, recording tools, translation, and a searchable knowledge base.',
    paragraphs: [
      'AI Script Refinement: Automatically edit spoken language into clear, concise narration. The AI suggests rewrites that reduce ambiguity and align phrasing with brand tone—helpful for non-writers or nervous presenters.',
      'Studio Voiceovers: High-fidelity synthetic voices in many languages and accents. These voices are tuned for clarity and cadence, making videos accessible and polished without hiring external narrators.',
      'Automated Zoom & Focus: The platform detects the most relevant UI elements in a recording and applies smooth zoom and highlight transitions so viewers can immediately identify the action being described.',
      'AI Avatars: Optional avatars provide a humanized presence in videos. Select from a variety of personas or create a branded avatar to maintain a consistent face across tutorials.',
      'Brand Templates: Save colors, logos, fonts, and layout presets to ensure every video adheres to company guidelines—useful for distributed teams and consistent branding.',
      'Native Screen Recorder: A lightweight extension or native capture that captures desktop, tab, and microphone with automatic synchronization for speech and pointer actions.',
      'Translation & Localization: Translate both audio and on-screen text into 40+ languages with contextual localization, not just literal translation, preserving idioms and UI references.',
      'Knowledge Base & AI Video Search: Organize videos and guides in a central repository with semantic search over video content so users can find the exact step or moment they need.',
      'Sharing & Embed: Publish shareable pages, embed videos in external docs, and track viewer engagement with analytics to measure effectiveness.'
    ]
  },
  {
    id: 'workflows',
    title: 'Typical workflows and use cases',
    summary: 'Trupeer powers product launches, onboarding, customer education, release notes, sales demos, and internal training—teams get a turnkey path from capture to consumption.',
    paragraphs: [
      'Product onboarding: Convert tutorial sequences into short, consumable guides that new users follow step-by-step. Link these guides to in-app help banners or onboarding checklists to reduce churn and support tickets.',
      'Customer support: Agents create short diagnostic videos showing how to reproduce issues or how to apply hotfixes. Instead of typing long troubleshooting steps, a quick video can show exact clicks and confirm expectations.',
      'Sales enablement: Build polished demo reels and feature highlight videos for sales collateral. With brand templates and voiceovers, sales teams can generate tailored content for prospects quickly.',
      'Training and knowledge transfer: Create SOPs and training modules for internal teams. Paired with AI video search, new hires find answers faster and managers reduce repetitive coaching time.',
      'Release notes and change logs: Produce short videos summarizing new features and important UX changes for users who prefer visual walkthroughs over written changelogs.'
    ]
  },
  {
    id: 'translation-localization',
    title: 'Translation and localization at scale',
    summary: 'High-impact product teams operate globally. Trupeer’s localization pipeline makes it feasible to produce multilingual assets quickly and retain local nuance.',
    paragraphs: [
      'Contextual translation: Trupeer translates UI labels, commands, and spoken language with an awareness of product context. This reduces confusing literal translations that break workflows in other languages.',
      'Localized voiceover: Produce voiceovers in target languages with native-sounding cadence and tone. The voices are selectable by nationality and speaking style so each market hears content that feels natural.',
      'Cultural checks: Beyond language, localization benefits from cultural adjustments—date formats, example content, and localized imagery. Trupeer supports custom templates per market to align visuals and references with local expectations.',
      'Automated subtitling: Generate time-synced captions and downloadable subtitle files, improving accessibility and SEO by providing transcript text that search engines can index.'
    ]
  },
  {
    id: 'knowledge-base',
    title: 'AI video search and centralized knowledge',
    summary: 'A searchable repository that indexes video content semantically so teams find moments and steps, not just video titles.',
    paragraphs: [
      'Semantic indexing: Trupeer analyzes spoken words, on-screen text, and metadata to create a rich index. Users can search questions and find timestamps where the answer appears—saving time compared to scanning full-length videos.',
      'Composable pages: Convert videos into pages that combine chapters, transcripts, screenshots, and step lists. These pages are shareable and embeddable, enabling knowledge distribution across product docs, LMS systems, and external portals.',
      'Viewer analytics: Measure how users interact with content—which chapters get the most views, where drop-offs occur, and which translations perform best. These signals guide future content investment and reveal gaps in documentation.'
    ]
  },
  {
    id: 'security-compliance',
    title: 'Security, compliance and enterprise readiness',
    summary: 'Trupeer targets enterprise workflows with SSO, role-based access, exportability, and compliance features for regulated organizations.',
    paragraphs: [
      'Identity and access: SAML/SSO, SCIM provisioning, and granular RBAC controls limit access to sensitive video content and administrative features.',
      'Data portability: Export transcripts, videos, and metadata for auditing, backups, or migrations—ensuring that content ownership remains with the customer.',
      'Enterprise controls: Admin logs, retention policies, and review workflows support governance needs. For air-gapped or highly regulated customers, self-hosting or private deployment models are available.',
      'Compliance certifications: Trupeer communicates compliance posture to enterprise buyers with standard audit artifacts and controls documentation that align with common frameworks.'
    ]
  },
  {
    id: 'analytics-and-impact',
    title: 'Measuring impact: Analytics and ROI',
    summary: 'Quantify the business value of video content with viewer metrics, content performance, and operational savings.',
    paragraphs: [
      'View and engagement metrics: Track views, average view time, completion rates, and chapter-level engagement to understand which tutorials drive outcomes.',
      'Support savings: Track the correlation between published guides and ticket volume reductions. A single, well-targeted guide can lower repetitive tickets for common tasks.',
      'Onboarding efficiency: Reduce time-to-first-value for new customers by providing visual walkthroughs and contextual help, measurable by shorter onboarding time and increased feature adoption.',
      'Content reuse value: Each recording can produce multiple assets—localized versions, short social cutdowns, and embedded help cards—multiplying value without proportional production cost.'
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation and integrations',
    summary: 'Trupeer integrates with common workflows—LMS, docs platforms, support desks, CMS, and embeds—making distribution seamless.',
    paragraphs: [
      'Embed support: Published pages and videos include simple embed codes that work across docs platforms and CMSs. This portability simplifies distribution into knowledge bases and product pages.',
      'Support desk integration: Link videos directly to help-center articles or tickets, so agents can drop a visual answer into a customer thread.',
      'LMS and internal portals: Export structured modules that align with learning paths, including chapters, quizzes, and completion tracking when needed.',
      'APIs and webhooks: Events such as "video published" or "translation ready" push into downstream systems to trigger notifications or analytics pipelines.'
    ]
  },
  {
    id: 'pricing-and-plans',
    title: 'Pricing signals and selecting a plan',
    summary: 'Pricing typically scales by usage: MAU, storage, minutes processed, and support levels. Consider operational cost savings when evaluating ROI.',
    paragraphs: [
      'Entry tiers often provide free trials or limited free minutes so teams can evaluate the editing and voice quality without an upfront commitment. For mid-market teams, monthly plans increase minutes, seats, and storage allowances.',
      'Enterprise plans add higher throughput, dedicated support, compliance attestations, and self-hosting options. When comparing costs, tally the time savings across teams—replacing manual editing, outside vendors, or multi-tool workflows can justify subscription expenses quickly.',
      'Decision checkpoint: run a 30-day pilot with defined KPIs—reduction in time-to-publish, ticket deflection, and content reuse rates—so you measure concrete benefits before committing.'
    ]
  },
  {
    id: 'case-studies',
    title: 'Representative customer stories',
    summary: 'Composite testimonials and observed customer outcomes that reflect typical adoption patterns and results.',
    paragraphs: [
      'Speed gains: A product team that used to produce a short tutorial in 4–6 hours moved to a 3–5 minute production cycle using Trupeer’s recorder and AI edits, freeing designers and PMs for higher-value work.',
      'Localization at scale: A global support organization rapidly localized onboarding content into multiple languages, reducing regional ticket volume and improving CSAT scores.',
      'Knowledge consolidation: A company replaced multiple scattered video folders and links with a searchable knowledge base, reducing friction for support and product discovery.'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best practices for creating effective product videos',
    summary: 'Recommendations for script length, chaptering, localization priorities, and analytics-driven iteration.',
    paragraphs: [
      'Keep videos focused: Aim for short, task-focused videos (60–180 seconds) for procedural steps, and longer deep-dive videos for conceptual topics. Shorter videos increase completion rates and make chaptering easier.',
      'Use clear narration and on-screen cues: Pair concise narration with visual cues—highlighted cursor movement, zooms, and text annotations—to accommodate both audio and silent viewers.',
      'Localize high-impact content first: Prioritize onboarding and high-ticket-deflection guides for translation to maximize ROI in regional markets.',
      'Iterate using analytics: Use viewer metrics to find chapters with drop-off; update scripts or add clarifying screenshots to those segments.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently asked questions',
    summary: 'Common technical and procurement questions and concise answers.',
    paragraphs: [
      'Can I self-host or run Trupeer in an air-gapped environment? Some enterprise plans provide self-hosting or private deployments; consult the sales documentation to review requirements and parity.',
      'How accurate are the AI voiceovers? Voices are tuned for natural cadence and clarity; results are excellent for most languages, but teams might choose human voiceovers for brand-critical campaigns.',
      'Does Trupeer support accessibility features? Yes—auto-generated captions and transcripts are available for all videos, improving accessibility and discoverability.',
      'What file formats are supported for export? Trupeer exports common video formats and provides subtitle files (SRT, VTT) and embeddable page URLs for distribution.'
    ]
  }
];

export default function Trupeer() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/trupeer`;
    } catch {
      return '/trupeer';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    trupeerSections.forEach((s) => {
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
    upsertMeta('keywords', 'Trupeer, AI video, product tutorials, guide generator, localization, AI avatars, knowledge base');
    upsertCanonical(canonical);

    injectJSONLD('trupeer-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('trupeer-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Trupeer: AI Video Platform for Product Teams',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: trupeerSections.map((s) => s.title)
    });

    const faqSection = trupeerSections.find((s) => s.id === 'faqs');
    const faqItems = faqSection ? faqSection.paragraphs : [];
    injectJSONLD('trupeer-faq', {
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
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">AI Video Platform for Product Teams</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Trupeer: Turn Screen Recordings into Branded Videos & Guides</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Create professional product videos, step-by-step guides, and multilingual documentation in minutes—powered by AI script editing, voiceover, automated zooms, avatars, and a searchable knowledge base.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">In-depth guidance to help teams evaluate and adopt AI-powered video workflows.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Current best practices for production, localization, and governance.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Trupeer</p>
                <p className="mt-2 text-sm text-slate-600">A product-focused guide to AI video and documentation workflows.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {trupeerSections.map((s) => (
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
            {trupeerSections.map((section) => (
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
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Boost Organic Reach</h2>
                <p className="mt-2 text-slate-700">If you want product pages like this to rank faster and attract the right audience, strategic backlinks from relevant sites increase topical authority and referral traffic.</p>
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
