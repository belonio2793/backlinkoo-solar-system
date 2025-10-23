export type Section = { id: string; title: string; summary: string; paragraphs: string[] };
export type Stat = { label: string; value: string; description: string };
export type TimelineEvent = { year: string; title: string; description: string };
export type FAQ = { question: string; answer: string };
export type GlossaryEntry = { term: string; definition: string };

export const marieStats: Stat[] = [
  { label: 'Primary Focus', value: 'Google Algorithms & AI Search', description: 'Analysis, interpretation, and guidance on Google’s ranking systems.' },
  { label: 'Signature Works', value: 'QRG Workbook, Gemini Era Book, Search News Podcast', description: 'Practical resources for operators to align with evolving ranking systems.' },
  { label: 'Formats', value: 'Consulting, Products, Community', description: 'Advisory engagements, books/workbooks, and the Search Bar community.' },
  { label: 'Approach', value: 'Evidence‑Backed, Practitioner‑Friendly', description: 'Actionable guidance grounded in Google docs, experiments, and public signals.' },
];

export const marieTimeline: TimelineEvent[] = [
  { year: 'Early Career', title: 'From SEO troubleshooting to algorithm research', description: 'Marie’s hands‑on experience with sites led to a long focus on quality and algorithmic signals.' },
  { year: 'QRG Workbooks', title: 'Operationalizing Quality Rater Guidance', description: 'Workbooks and trainings that map Quality Rater Guidelines to site improvements.' },
  { year: 'AI Era', title: 'Gemini Era and Navboost insights', description: 'Publishing observations and books on how AI changes Google’s ranking apparatus.' },
  { year: 'Community', title: 'The Search Bar & Newsletter', description: 'A community space and newsletter to share emergent signals and experiments.' },
];

export const marieFaqs: FAQ[] = [
  { question: 'Who is Marie Haynes?', answer: 'Marie Haynes is an SEO consultant and expert on Google algorithms, E‑E‑A‑T, and algorithmic quality systems. She publishes work to help practitioners understand and adapt to changes in search.' },
  { question: 'What is the QRG Workbook?', answer: 'A practical workbook that applies Google’s Quality Raters’ Guidelines into a checklist and evaluation process to improve site quality signals.' },
  { question: 'How does Navboost affect rankings?', answer: 'Navboost summarizes that Google studies user interactions (clicks, engagement) to inform ranking signals; sites that attract clicks and satisfy users are advantaged.' },
  { question: 'How can I work with Marie?', answer: 'Marie offers consulting engagements and products; use the Contact page on this site to inquire about availability and scopes.' },
];

export const marieGlossary: GlossaryEntry[] = [
  { term: 'Quality Raters’ Guidelines (QRG)', definition: "A handbook used by Google's raters to assess page quality; not a direct ranking algorithm but informative about signals Google values." },
  { term: 'E-E-A-T', definition: 'Experience, Expertise, Authoritativeness, Trustworthiness — qualitative signals Google references for assessing content quality.' },
  { term: 'Navboost', definition: 'Google’s system that considers user behavior and engagement signals to influence rankings and recommendations.' },
  { term: 'AI Overviews', definition: 'Generative or extractive summaries surfaced to users by AI systems in search results, often with citations.' },
  { term: 'Helpful Content System', definition: 'Google’s method to demote content that is not helpful to users and prioritize helpful, task‑oriented content.' },
];

export const marieSections: Section[] = [
  {
    id: 'overview',
    title: 'Marie Haynes: Understanding Google’s Algorithms in the AI Era',
    summary: 'A comprehensive resource aligned with the "Marie Haynes" query: biography, frameworks, and practitioner playbooks for navigating Google’s evolving systems.',
    paragraphs: [
      'Marie Haynes is widely respected for her clear, evidence‑driven analysis of Google’s ranking systems. Her work bridges the gap between public signals (helpful content, QRG, SpamBrain) and practical site improvements that drive business outcomes.',
      'This page synthesizes Marie’s public contributions and extends them into operational playbooks for teams: how to audit quality issues, how to prioritize fixes, and how to prepare content and technical systems for AI‑driven experiences.',
      'We focus on actionable frameworks: converting QRG into measurable checks, aligning content and product goals with engagement signals, and building defensible authority that survives algorithmic change.',
    ],
  },
  {
    id: 'who-is-marie',
    title: 'Who Is Marie Haynes?',
    summary: 'Experience, recognition, and the evolution from site audits to algorithmic interpretation.',
    paragraphs: [
      'Marie brings years of hands‑on SEO troubleshooting and a relentless focus on site quality. Her insights often translate Google’s research and documentation into operational improvements that site owners can implement quickly.',
      'She has authored work on the QRG, produced books and workbooks, hosts the Search News You Can Use podcast, and leads a community that shares early signals and experiments. Her perspective is practical: identify the highest‑impact fixes, instrument their effects, and communicate results to stakeholders.',
    ],
  },
  {
    id: 'quality-raters-guidelines',
    title: 'Quality Raters’ Guidelines: From Theory to Practice',
    summary: 'Operational steps to use QRG as a diagnostic and improvement tool for site quality.',
    paragraphs: [
      'The QRG provides a human lens on what Google’s raters consider high quality. While it does not directly map to ranking algorithms, it reveals patterns: trust signals, content depth, authority, and user satisfaction metrics.',
      'Translate QRG into a checklist: purpose clarity, author credentials, corroborating evidence, user intent alignment, and site trust signals. Apply the checklist across sample pages to prioritize systemic problems versus isolated issues.',
      'Document examples and counterexamples to calibrate team judgments. Make the QRG a cultural tool, not a one‑time audit, to maintain quality as the site scales.',
    ],
  },
  {
    id: 'navboost-and-user-behavior',
    title: 'Navboost, Engagement, and Modern Ranking Signals',
    summary: 'How user behavior feeds into algorithmic decisions and what to measure to align with those signals.',
    paragraphs: [
      'Navboost and similar systems analyze click behavior and on‑site engagement to detect useful content. This means that creating pages that attract clicks and satisfy intent can have downstream benefits beyond traditional on‑page optimization.',
      'Design title and snippet testing as part of your optimization suite. Use experiments to learn which snippets increase qualified clicks and which page experiences reduce pogo‑sticking and increase satisfaction.',
      'Combine behavioral signals with direct quality improvements: faster pages, clearer headings, and easily‑accessible answers for common tasks. The technical bar complements the content bar.',
    ],
  },
  {
    id: 'ai-search-and-gemini-era',
    title: 'AI Search & The Gemini Era: Practical Readiness Steps',
    summary: 'Prepare content and evidence to be surfaced in AI overviews and generative snippets.',
    paragraphs: [
      'AI overviews prioritize concise, factual summaries with reliable citations. Structure content to provide clear summary paragraphs and supportive detail, and include data artifacts or concise examples that answer the core query.',
      'Build FAQ clusters and attach JSON‑LD to mirror visible answers. Offer short, definitive answers that AI systems can extract without ambiguity, while linking to complete resources for users who want depth.',
      'Monitor which pages are cited by AI features and refine authoritativeness on those pages. Treat generative visibility as a distribution channel that rewards clarity and verifiability.',
    ],
  },
  {
    id: 'consulting-and-products',
    title: 'Consulting, Workbooks, and Products',
    summary: 'Marie’s offerings: how they translate theory into repeatable actions and audits.',
    paragraphs: [
      'Marie offers consulting engagements that prioritize the highest impact technical and content changes. The QRG Workbook operationalizes site review, enabling teams to scale quality control across templates and sections.',
      'Her books on the Gemini era and AI search propose frameworks to anticipate and adapt to systemic changes. These products are designed for teams to use as references during migrations, content refresh cycles, and post‑update triage.',
    ],
  },
  {
    id: 'measurement-and-postmortems',
    title: 'Measurement: Leading Indicators and Postmortems',
    summary: 'Track which signals show progress and how to learn from updates systematically.',
    paragraphs: [
      'Leading indicators include impressions for target clusters, changes in click‑through rate from SERPs, dwell time on cornerstone pages, and reductions in problematic signals like indexed soft‑404s or spammy user‑generated content.',
      'Run structured postmortems after algorithmic movements: what pages changed, which templates were affected, traffic cohorts, and link acquisition patterns. Use the results to refine templates, internal linking, and content priorities.',
    ],
  },
  {
    id: 'faq-and-next-steps',
    title: 'FAQ and How to Work With Marie',
    summary: 'Answers to common questions and practical next steps for teams interested in consulting or products.',
    paragraphs: [
      'If you need help with algorithmic recovery, quality audits, or AI readiness, start by sharing a prioritized list of affected pages, access to analytics, and a clear outcome you care about (traffic, conversions, visibility).',
      'For product purchases and community access, use the Products and Search Bar links. For consulting inquiries, the Contact page has submission details and typical engagement scopes.',
    ],
  },
];
