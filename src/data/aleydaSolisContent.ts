export type Section = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
};

export type Stat = {
  label: string;
  value: string;
  description: string;
};

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const aleydaStats: Stat[] = [
  { label: 'Primary Focus', value: 'International, Ecommerce & SaaS SEO', description: 'Strategy and execution for multi‑market, product‑led, and platform businesses.' },
  { label: 'Signature Projects', value: 'LearningSEO.io, SEOFOMO, Crawling Mondays', description: 'Education and curation initiatives with a practitioner‑first lens.' },
  { label: 'Recognition', value: 'European Search Personality (2018)', description: 'Awarded for industry impact; frequently cited by major publications.' },
  { label: 'Format', value: 'Consulting, Training, Speaking', description: 'Custom engagements, workshops, and conference keynotes worldwide.' },
];

export const aleydaTimeline: TimelineEvent[] = [
  { year: 'Early Career', title: 'From consultancy to global stage', description: 'Hands‑on SEO work evolved into specialized international and ecommerce programs.' },
  { year: 'SEOFOMO & LearningSEO', title: 'Education at scale', description: 'Curated news and structured roadmaps helped thousands learn SEO efficiently.' },
  { year: 'Crawling Mondays', title: 'Media and community', description: 'Actionable video podcast with experts demystifying technical and strategic topics.' },
  { year: 'Today', title: 'AI Search & Entity SEO', description: 'Practical guidance for GEO/AEO/LLMO while staying grounded in user needs.' },
];

export const aleydaFaqs: FAQ[] = [
  { question: 'Who is Aleyda Solis?', answer: 'An award‑winning international SEO consultant, author, and speaker known for practical roadmaps, clear communication, and education‑driven initiatives like SEOFOMO, LearningSEO.io, and Crawling Mondays.' },
  { question: 'What services does she offer?', answer: 'Strategic SEO consulting (audits, roadmaps, execution support), training and workshops, and speaking engagements for in‑house teams and events.' },
  { question: 'What industries benefit most?', answer: 'Ecommerce, SaaS, Marketplaces, and companies expanding into new countries or languages, where internationalization and product discoverability are critical.' },
  { question: 'How does she approach AI search?', answer: 'With a user‑first, evidence‑based method—mapping intents, structuring content for answer engines, and aligning entities and citations to earn visibility in AI overviews.' },
  { question: 'How can we get started?', answer: 'Define success metrics and constraints, share analytics and prior work, then request a discovery call. Expect a clear plan, ownership model, and cadence for delivery.' },
];

export const aleydaGlossary: GlossaryEntry[] = [
  { term: 'Entity SEO', definition: 'An approach that clarifies who/what a page is about using consistent naming, attributes, and corroborating mentions across the web.' },
  { term: 'GEO / AEO / LLMO', definition: 'Google/AI/LLM‑oriented optimization—structuring answers, evidence, and citations to satisfy conversational and generative experiences.' },
  { term: 'Hreflang', definition: 'Signals that map language and country variants of pages so search engines can serve the right version to each audience.' },
  { term: 'Market Entry SEO', definition: 'Research and implementation plan to win early visibility in new regions, including localization, SERP landscape, and content‑ops readiness.' },
  { term: 'Topical Authority', definition: 'A site’s demonstrated depth and consistency covering a subject through interlinked, complete resources that attract citations.' },
];

export const aleydaSections: Section[] = [
  {
    id: 'overview',
    title: 'Aleyda Solis: International SEO, AI Search, and Education',
    summary: 'A practitioner‑grade resource aligned with the “Aleyda Solis” query—biography, frameworks, and field‑tested recommendations for global SEO visibility.',
    paragraphs: [
      'Aleyda Solis is a renowned SEO consultant focused on International, Ecommerce, Marketplace, and SaaS programs. She is recognized for translating complex requirements—multi‑country architectures, product indexing, and entity alignment—into step‑by‑step plans teams can actually ship.',
      'Beyond consulting, Aleyda builds high‑leverage educational platforms. SEOFOMO curates weekly industry movements; LearningSEO.io provides a structured roadmap for mastering fundamentals; Crawling Mondays shares practical interviews and tutorials. This combination—delivery plus education—has made her guidance a default reference across the industry.',
      'This page synthesizes those strengths into a single place: who Aleyda is, how she operates, and how organizations can apply similar systems to grow qualified visibility across regions, languages, and channels.',
    ],
  },
  {
    id: 'who-is-aleyda',
    title: 'Who Is Aleyda Solis?',
    summary: 'An award‑winning SEO consultant, author, and speaker with a reputation for clarity, rigor, and trustworthy execution.',
    paragraphs: [
      'Aleyda was named the European Search Personality of the Year and is frequently featured by major outlets. Her track record spans category leaders and high‑growth challengers seeking durable organic performance. She is also the founder of Orainti, a boutique consultancy delivering senior‑level strategy, enablement, and ongoing support.',
      'What differentiates her approach is the emphasis on outcomes: discoverability that turns into audience, audience that turns into customers, and customers that stay because the product solves the right jobs. That perspective keeps SEO connected to business value, not just rankings.',
    ],
  },
  {
    id: 'international-seo',
    title: 'International SEO: Structure, Signals, and Local Relevance',
    summary: 'Design once, localize with intent, and instrument learning loops per market.',
    paragraphs: [
      'International programs succeed when architecture and operations are aligned. Choose scalable URL patterns, implement hreflang correctly, and localize for context—not just language. Market research should inform content types, SERP features to target, and partner ecosystems for each country.',
      'Entity clarity is essential. Standardize brand names, product attributes, and category taxonomies across locales to avoid duplication and dilution. Use structured data to reinforce meaning; ensure internal links connect equivalents and explain relationships.',
      'Operationally, define owners per locale with a cadence for content, technical QA, and outreach. Small, consistent upgrades compound faster than sporadic overhauls.',
    ],
  },
  {
    id: 'ai-search',
    title: 'AI Search Optimization (GEO, AEO, LLMO)',
    summary: 'Prepare content and evidence for answer engines and generative previews.',
    paragraphs: [
      'AI search experiences surface concise, trustworthy answers with citations. To earn inclusion, structure content so the “how” and “why” are explicit; clarify entities; and back claims with verifiable sources. Summaries should point to expandable sections and supporting visuals.',
      'Prioritize zero‑ambiguity phrasing in headings and key paragraphs. Consolidate related questions into FAQ clusters and attach JSON‑LD that mirrors visible content. Publish small data artifacts—benchmarks, mini‑surveys, checklists—that others can safely reference.',
      'Monitor which pages are cited in AI overviews and refine the evidence on those pages. Treat generative visibility as a distribution channel to be earned via clarity and reliability.',
    ],
  },
  {
    id: 'resources',
    title: 'LearningSEO.io, SEOFOMO, and Crawling Mondays',
    summary: 'Education initiatives that accelerate learning and keep practitioners current.',
    paragraphs: [
      'LearningSEO.io offers a roadmap for mastering search—ordered modules, practical links, and a sense of progression. It lowers the barrier to entry while keeping quality high.',
      'SEOFOMO curates the week’s most important updates: algorithm changes, research, tools, jobs, and community wins. It saves time and prevents information overload, especially for busy operators.',
      'Crawling Mondays distills technical topics and strategy into video‑first episodes with experts. The focus is actionable insights: migrations, faceted navigation, AI search experiments, and more.',
    ],
  },
  {
    id: 'consulting-method',
    title: 'Consulting Method: From Audit to Operating System',
    summary: 'A practical sequence that connects research to delivery and measurement.',
    paragraphs: [
      'Discovery aligns goals and constraints. Share analytics, product context, and prior experiments. Define what success looks like per market and per segment. This avoids chasing metrics that don’t matter.',
      'Audits prioritize compounding constraints: crawlability, duplication, internal link equity, thin or overlapping content, and missing schema. The output is an ordered backlog with ownership and expected impact.',
      'Execution is shaped as an operating system: topic clusters with owners, monthly refresh slots for key pages, and partner plans for links. Dashboards emphasize leading indicators (coverage, crawl and render status, citations) and target outcomes (qualified conversions).',
    ],
  },
  {
    id: 'link-building',
    title: 'Link Building and Digital PR: Evidence Before Outreach',
    summary: 'Editorial links compound when your page makes other pages better.',
    paragraphs: [
      'Create link‑worthy assets that close knowledge gaps: market maps, teardown studies, simple interactive tools, and localized benchmarks. Aim for pieces that editors can cite without risk.',
      'Contextual outreach references the exact paragraph where your contribution fits, offers a short quote or chart, and respects the recipient’s style. Follow‑ups are brief and spaced; alternatives are suggested when appropriate.',
      'Measure links that matter: relevant domains, on‑page placement quality, and whether new citations drive incremental qualified traffic. Optimize for relationships—not one‑off transactions.',
    ],
  },
  {
    id: 'technical-seo',
    title: 'Technical SEO: Stability, Speed, and Scale',
    summary: 'A clean foundation unlocks discoverability and makes every improvement stick.',
    paragraphs: [
      'Stability first: predictable URLs, resilient rendering, and safe deployments prevent regressions. Invest in monitoring that catches anomalies quickly—spikes in 404s, blocked resources, or template changes that affect headings and schema.',
      'Performance matters for attention and rankings. Optimize images, minimize script execution, and eliminate layout shifts. Use semantic HTML and accessible components to expand reach and trust.',
      'At scale, templates are the product. Document how each template should behave, which fields it requires, and how internal links route equity. Freeze fragile templates during major changes and test in previews before shipping.',
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement: From Signals to Outcomes',
    summary: 'Tie SEO work to business value through leading indicators and lagging results.',
    paragraphs: [
      'Track leading indicators by cluster: impressions, scroll depth on cornerstone pages, citations from relevant domains, and assisted conversions. These show momentum before revenue catches up.',
      'Use cohorts to evaluate refreshes and outreach waves. Compare performance by market and template. Communicate what changed, why, and what you will try next—this keeps teams aligned and stakeholders supportive.',
      'Publish postmortems and playbooks. Over time you will identify interventions with the highest ROI for your specific context and audience.',
    ],
  },
  {
    id: 'speaking-and-events',
    title: 'Speaking, Conferences, and Workshops',
    summary: 'Clear, example‑driven talks tailored to operator needs.',
    paragraphs: [
      'Aleyda is a frequent speaker at global conferences including MozCon, SearchLove, BrightonSEO, Pubcon, and INBOUND. Her talks emphasize practical frameworks over slogans: migrations, ecommerce filters, AI search readiness, and international rollouts.',
      'Workshops are hands‑on. Teams leave with templates, checklists, and a prioritized plan to implement immediately.',
    ],
  },
  {
    id: 'faq-and-next-steps',
    title: 'FAQ and Next Steps',
    summary: 'Direct answers and how to move forward.',
    paragraphs: [
      'If you arrived researching “Aleyda Solis,” the next step is to translate interest into action. Review the FAQ below, then decide whether you need consulting, training, or a talk for your upcoming event. The form on this page captures the essentials to get started promptly.',
    ],
  },
];
