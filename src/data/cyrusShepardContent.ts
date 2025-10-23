export type Stat = { label: string; value: string; description: string };
export type TimelineEvent = { year: string; title: string; description: string };
export type FAQ = { question: string; answer: string };
export type GlossaryEntry = { term: string; definition: string };
export type CyrusSection = { id: string; title: string; summary: string; paragraphs: string[] };

export const cyrusStats: Stat[] = [
  {
    label: 'Primary Focus',
    value: 'Data-Driven SEO Leadership',
    description: 'Founder of Zyppy SEO delivering experiment-led consulting for SaaS brands, publishers, and ambitious in-house teams.'
  },
  {
    label: 'Flagship Research',
    value: 'Title Tags · AI Overviews · Disavow Tests',
    description: 'Documented how Google rewrites title tags, analyzed AI Overviews traffic shifts, and ran the disavow-every-link experiment to clarify risk.'
  },
  {
    label: 'Client Reach',
    value: 'Startups → Fortune 500',
    description: 'Builds instrumentation-first roadmaps for venture-backed SaaS, ecommerce marketplaces, and enterprise content programs.'
  },
  {
    label: 'Community Roles',
    value: 'Moz Educator & Conference Speaker',
    description: 'Regular Whiteboard Friday host, MozCon presenter, and SMX speaker mentoring practitioners on measurement-first SEO.'
  },
  {
    label: 'Content Library',
    value: 'Zyppy Research Index',
    description: 'Publishes step-by-step studies, frameworks, and the Zyppy List directory to connect vetted marketing professionals.'
  },
  {
    label: 'Operating Ethos',
    value: 'Experiment > Assumption',
    description: 'Advocates transparent reporting, ethical link earning, and reproducible experiments before scaling automation.'
  }
];

export const cyrusTimeline: TimelineEvent[] = [
  {
    year: '2009',
    title: 'Early Experiments Go Live',
    description: 'Launches personal sites to observe how schema, internal links, and rewrite tests influence Google SERPs.'
  },
  {
    year: '2012',
    title: 'Joins Moz as SEO Lead',
    description: 'Heads Moz SEO and content programs, turning research into Whiteboard Friday lessons and community training tracks.'
  },
  {
    year: '2014 – 2016',
    title: 'Community Mentorship Era',
    description: 'Guides Moz community members, speaks at MozCon and SMX, and codifies measurable SEO frameworks for teams worldwide.'
  },
  {
    year: '2018',
    title: 'Launches Zyppy SEO',
    description: 'Creates a consultancy and research lab focused on evidence-backed audits, growth experiments, and advisory retainers.'
  },
  {
    year: '2020',
    title: 'Title Tag Rewrite Study',
    description: 'Releases the data-backed report showing Google rewrites roughly 60% of titles and shares control levers for practitioners.'
  },
  {
    year: '2023',
    title: 'Introduces Zyppy List',
    description: 'Publishes a curated directory for marketing professionals, aligning vetted vendors with Cyrus’s quality benchmarks.'
  },
  {
    year: '2024',
    title: 'AI Overviews Research',
    description: 'Analyzes how Google’s AI Overviews redistribute clicks, offering mitigation playbooks for publishers and SaaS companies.'
  }
];

export const cyrusFaqs: FAQ[] = [
  {
    question: 'What engagements does Cyrus Shepard typically lead?',
    answer: 'He advises growth-stage SaaS, publishers, and ecommerce brands on evidence-backed SEO programs, combining audits, experimentation roadmaps, and executive-ready reporting cadences.'
  },
  {
    question: 'Why are Cyrus Shepard’s studies widely cited?',
    answer: 'Each study documents methodology, datasets, and limitations, making findings like the title tag rewrite analysis or AI Overviews research easy for in-house teams to replicate and validate.'
  },
  {
    question: 'How does Cyrus approach link earning and digital PR?',
    answer: 'He prioritizes ethical outreach, original assets, and relationship-driven placements—expanding beyond HARO through targeted industry directories, newsrooms, and the Zyppy List network.'
  },
  {
    question: 'Can internal teams apply his playbooks without a full engagement?',
    answer: 'Yes. Cyrus packages frameworks with instrumentation checklists, query-cluster dashboards, and governance guides so internal teams can run controlled tests independently.'
  },
  {
    question: 'Where can I follow Cyrus Shepard’s latest research?',
    answer: 'Start with Zyppy.com, subscribe to his newsletter, review his Moz archives, and follow @CyrusShepard on LinkedIn, X, and Bluesky for study releases and conference recaps.'
  },
  {
    question: 'Does he collaborate with in-house data or engineering teams?',
    answer: 'Absolutely. Cyrus is known for partnering with analysts and developers to operationalize schema, internal linking automation, and measurement pipelines grounded in reliable data.'
  }
];

export const cyrusGlossary: GlossaryEntry[] = [
  {
    term: 'AI Overviews',
    definition: 'Google’s generative SERP layer that surfaces synthesized answers; Cyrus studies how these results siphon or redistribute traffic.'
  },
  {
    term: 'Query Clustering',
    definition: 'Grouping semantically related search queries to inform page-level intent targeting and dashboard reporting in Cyrus’s playbooks.'
  },
  {
    term: 'Selective Link Priority',
    definition: 'An outreach rubric that scores prospects by topical fit, authority, and relationship viability before pitching—a Cyrus Shepard staple.'
  },
  {
    term: 'Ranch-Style SEO',
    definition: 'Cyrus’s metaphor for building durable, relationship-focused link ecosystems rather than chasing disposable placements.'
  },
  {
    term: 'Title Tag Rewrite Rate',
    definition: 'The percentage of page titles Google rewrites in SERPs; Cyrus quantified this to help teams regain control of messaging.'
  },
  {
    term: 'Disavow Experiment',
    definition: 'Cyrus’s 2020 test where he disavowed every link to his site to understand algorithmic tolerance, recovery timelines, and reporting gaps.'
  },
  {
    term: 'Zyppy List',
    definition: 'A curated directory for marketing professionals launched by Cyrus to match vetted vendors with brands seeking ethical SEO support.'
  },
  {
    term: 'Whiteboard Friday',
    definition: 'Moz’s flagship educational series where Cyrus distilled research, frameworks, and instrumentation tips for the SEO community.'
  }
];

export const cyrusSameAs: string[] = [
  'https://zyppy.com/cyrus/',
  'https://www.linkedin.com/in/cyrusshepard/',
  'https://x.com/CyrusShepard',
  'https://bsky.app/profile/zyppy.com',
  'https://moz.com/community/q/user/cyrus-shepard',
  'https://moz.com/community/q/user/cyrus-shepard-0'
];

export const cyrusSections: CyrusSection[] = [
  {
    id: 'overview',
    title: 'Who Is Cyrus Shepard?',
    summary: 'Founder of Zyppy SEO, educator, and researcher known for evidence-backed studies, transparent reporting, and ethical link acquisition.',
    paragraphs: [
      'Cyrus Shepard is widely recognized for transforming complicated search concepts into practical strategies. From Moz to Zyppy SEO, his work centers on rigorous testing, transparent methodology, and repeatable systems that internal teams can operate. Brands rely on his frameworks because they prioritize user value and measurable outcomes over shortcuts.',
      'His philosophy treats SEO as helpful marketing: align with intent, answer fast, and keep readers engaged through clarity and structure. This approach is reflected in studies on title tag rewriting, internal linking at scale, and AI Overviews—each designed so practitioners can reproduce the findings and adapt them to their own stacks.',
      'Today, Cyrus advises startups and Fortune 500 organizations alike. He brings an experimentation mindset to roadmaps, uses dashboards to communicate change, and emphasizes ethical outreach—earning links through original assets, relationships, and consistent editorial quality.'
    ]
  },
  {
    id: 'research-approach',
    title: 'Research Approach & Methodology',
    summary: 'Design tests that isolate variables, document limits, and translate results into actions teams can implement within weeks.',
    paragraphs: [
      'Every study starts with a falsifiable question, a clean dataset, and an explicit success metric. Cyrus prioritizes leading indicators—CTR shifts, intent satisfaction, and internal navigation quality—alongside lagging metrics like rankings and organic sessions.',
      'He shares collection methods, sampling notes, and caveats, making it easier for teams to reproduce results. This ethos underpins his articles about title rewrites, indexation behavior, and selective link priority.',
      'The outcome is not simply a report, but a playbook: dashboards to monitor change, on-page adjustments to test, and outreach patterns to scale.'
    ]
  },
  {
    id: 'link-earning',
    title: 'Link Earning, Not Link Chasing',
    summary: 'Relationship-first outreach, original resources, and durable placements that strengthen topical authority.',
    paragraphs: [
      'Cyrus prioritizes placements that serve audiences, not algorithms. He recommends story-led pitching to relevant publications, industry directories, and partner ecosystems—backed by assets worth referencing.',
      'Rather than generic HARO blasts, he emphasizes targeted lists, expert quotes, and ongoing contributor relationships. The goal is a resilient network that compounds over time.',
      'Measurement focuses on referral quality, topical proximity, and contribution to key pages—not vanity metrics—so efforts continuously improve.'
    ]
  },
  {
    id: 'content-architecture',
    title: 'Content Architecture & Intent Design',
    summary: 'Resolve cannibalization, cluster queries, and build navigable paths that satisfy intent quickly without sacrificing depth.',
    paragraphs: [
      'Cyrus’s architectures balance clarity and breadth: each page targets a distinct intent, cross-linked with contextual anchors and descriptive labels. Clusters map to user journeys, not just keywords.',
      'He treats titles, headings, and summaries as commitments to readers—minimizing rewrites, clarifying scope, and enhancing snippet accuracy. Structured data supports richer SERP features and better CTR.',
      'Long-form articles integrate skimmable patterns—callouts, key takeaways, definitions—so experts and newcomers alike find value without friction.'
    ]
  },
  {
    id: 'measurement',
    title: 'Measurement, Reporting & Executive Readouts',
    summary: 'Dashboards, leading indicators, and narrative summaries that align SEO initiatives with business outcomes.',
    paragraphs: [
      'Cyrus operationalizes measurement with query clusters, page groups, and decision-oriented dashboards. Executives see the impact of experiments via clear narratives that connect metrics to revenue levers.',
      'He encourages cadence: monthly reviews, quarterly resets, and continuous backlog grooming based on observed wins, neutral results, or negative signals.',
      'This discipline keeps teams aligned while preserving the freedom to explore promising ideas that surface from data.'
    ]
  },
  {
    id: 'community',
    title: 'Community, Education & Mentorship',
    summary: 'Whiteboard Friday alumnus, MozCon and SMX speaker, and ongoing mentor who uplifts the field with reproducible work.',
    paragraphs: [
      'Cyrus invests in education—sharing frameworks, toolkits, and cautionary notes so teams avoid common traps. His guidance centers on clarity, ethics, and resilient growth.',
      'Through Zyppy List and research publications, he connects qualified professionals and raises quality bars across the ecosystem.',
      'Practitioners value his calm insistence on proof: measure, report, and iterate until teams confidently own the process.'
    ]
  }
];
