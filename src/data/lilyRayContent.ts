export type Section = { id: string; title: string; summary: string; paragraphs: string[] };
export type Stat = { label: string; value: string; description: string };
export type TimelineEvent = { year: string; title: string; description: string };
export type FAQ = { question: string; answer: string };
export type GlossaryEntry = { term: string; definition: string };

export const lilyStats: Stat[] = [
  { label: 'Primary Roles', value: 'SEO, Research, Speaker', description: 'Leader in SEO strategy with a background in research and public speaking.' },
  { label: 'Other Interests', value: 'DJ, Drummer, Fitness', description: 'Creative pursuits that shape a unique public persona and storytelling style.' },
  { label: 'Location', value: 'Brooklyn, NYC', description: 'Base of operations and frequent conference presence globally.' },
  { label: 'Perspective', value: 'Evidence & Community', description: 'Brings data, audits, and community learning together to influence best practices.' },
];

export const lilyTimeline: TimelineEvent[] = [
  { year: 'Early Work', title: 'Foundations in SEO troubleshooting', description: 'Hands-on fixes and learnings that formed a practitioner-first approach.' },
  { year: 'Leadership', title: 'Industry roles and research', description: 'Senior positions focusing on strategy, research, and cross-channel visibility.' },
  { year: 'Public Voice', title: 'Speaking and content', description: 'Podcasts, webinars, and thought leadership pieces that translate research into action.' },
];

export const lilyFaqs: FAQ[] = [
  { question: 'Who is Lily Ray?', answer: 'Lily Ray is an SEO professional, researcher, and public speaker based in Brooklyn, NY—known for data-driven SEO and a background in creative pursuits such as DJing and drumming.' },
  { question: 'What services does she provide?', answer: 'SEO strategy, research, speaking, and advisory work, including speaking at conferences and producing in-depth analyses for organic search teams.' },
  { question: 'How can I contact Lily?', answer: 'Use the Contact page on Lily’s site or reach out via professional channels listed on her site (LinkedIn, Twitter).' },
];

export const lilyGlossary: GlossaryEntry[] = [
  { term: 'E-E-A-T', definition: 'Experience, Expertise, Authoritativeness, and Trustworthiness — quality signals that help evaluate content.' },
  { term: 'Navboost', definition: 'A term used to describe Google systems that emphasize user engagement signals.' },
  { term: 'Topical Authority', definition: 'The depth and breadth of content a site has on a given subject, used to establish trust in search.' },
];

export const lilySections: Section[] = [
  {
    id: 'overview',
    title: 'Lily Ray: SEO Research, Strategy, and Public Voice',
    summary: 'A comprehensive resource aligned with the “Lily Ray” query: biography, frameworks, research, and practical playbooks for modern SEO.',
    paragraphs: [
      'Lily Ray is a prominent figure in the SEO community whose work blends research, strategy, and public education. She is based in Brooklyn, NYC and is known for translating complex search phenomena into actionable guidance for teams.',
      'This page synthesizes public signals and Lily’s known contributions into operational advice: how to audit quality, manage algorithmic changes, and prioritize the work that moves the needle for organic visibility.'
    ],
  },
  {
    id: 'who-is-lily',
    title: 'Who Is Lily Ray?',
    summary: 'Background, roles, and unique public persona.',
    paragraphs: [
      'Lily’s background combines research-driven SEO with a public-facing presence that includes speaking, podcasts, and creative work. Her profile is notable for combining technical rigor with a human voice.',
      'Beyond SEO, Lily is a DJ and drummer—creative interests that inform a broader perspective on culture and audience engagement.'
    ],
  },
  {
    id: 'research-and-methods',
    title: 'Research Methods and What Matters',
    summary: 'How Lily approaches research: signals, experiments, and evidence.',
    paragraphs: [
      'Data-informed analysis is central. Lily’s work surfaces patterns from public datasets, search behavior, and case studies that offer clues about algorithmic emphasis.',
      'Practical tests—A/B style snippet experiments, content pruning trials, and structural template audits—help translate observations into repeatable tactics.'
    ],
  },
  {
    id: 'content-and-voice',
    title: 'Content, Voice, and E-E-A-T',
    summary: 'Balancing authoritative content with a human voice to win trust and clicks.',
    paragraphs: [
      'E-E-A-T remains a guiding principle: show real expertise, document experience, and make trust signals clear. Lily models this by publishing research-backed posts and engaging with the community.',
      'Human tone matters: combine formal evidence with approachable narratives to convert expert attention into actionable follow-through by readers.'
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement: Practical KPIs and Leading Indicators',
    summary: 'Metrics that reveal momentum before revenue shows up.',
    paragraphs: [
      'Track impressions and CTR by cluster, dwell time on hub pages, and citation velocity for assets. These metrics surface momentum and help prioritize resources.',
      'Use controlled experiments where possible to isolate the effects of snippet changes, schema additions, and outreach campaigns.'
    ],
  },
  {
    id: 'cta',
    title: 'Next Steps and Resources',
    summary: 'How to work with Lily’s ideas and where to find her work.',
    paragraphs: [
      'Explore Lily’s site for articles, videos, and speaking events. Use the contact page for speaking or advisory inquiries.',
      'Adopt the playbooks below: QRG-derived audits, hub-and-spoke architecture, and evidence-first link building.'
    ],
  },
];
