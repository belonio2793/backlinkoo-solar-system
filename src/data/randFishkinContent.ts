export interface RandFishkinSection {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
}

export interface RandFishkinStat {
  label: string;
  value: string;
  description: string;
}

export interface RandFishkinTimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface RandFishkinFAQ {
  question: string;
  answer: string;
}

export interface RandFishkinGlossaryEntry {
  term: string;
  definition: string;
}

export const randFishkinSections: RandFishkinSection[] = [
  {
    id: 'overview',
    title: 'Rand Fishkin at a Glance',
    summary: 'An executive overview of Rand Fishkin—co‑founder of Moz and SparkToro—covering his philosophy, research contributions, and impact on modern SEO.',
    paragraphs: [
      'Rand Fishkin is one of the most widely recognized figures in search, audience research, and brand strategy. Best known for co‑founding Moz and later SparkToro, he has influenced how practitioners think about search intent, content quality, and the evolving SERP. His work popularized practical SEO education (notably Whiteboard Friday) and reframed marketing to include audience discovery beyond keywords. This page is a comprehensive, practitioner‑first deep dive designed to satisfy the “Rand Fishkin” keyword with authoritative, original analysis.',
      'The public brand around Rand blends research, approachable storytelling, and product thinking. Moz brought metrics like Domain Authority into the mainstream; SparkToro operationalized audience discovery by revealing what an audience follows, reads, and talks about. Across both companies, Rand’s philosophy has been consistent: transparency, empathy for users, and empirical rigor. That ethos informs this page’s layout—clear sections, semantic headings, and in‑depth modules that map to real searcher intent.',
      'While this resource is inspired by publicly available materials (including Rand’s social presence at x.com/randfish and long‑form essays), the writing here is original and synthesis‑driven. We avoid speculation and prioritize verifiable, widely cited facts: Moz’s early rise in the SEO community, SparkToro’s audience research methodology, and Rand’s widely referenced analyses like the “zero‑click searches” study. Where opinion is included, it is presented as informed interpretation, with practical checklists and frameworks operators can adapt.',
      'Readers will find a balanced focus: history and milestones, audience research workflows, content and link acquisition strategies, product lessons from building two companies, and a forward‑looking view of search and social discovery. The goal is not to idolize the person, but to extract durable, reusable systems—the kind that work in startups, agencies, and in‑house teams alike.',
    ],
  },
  {
    id: 'search-intent',
    title: 'Owning the “Rand Fishkin” Keyword',
    summary: 'Mapping navigational, informational, and commercial intents for the Rand Fishkin query and addressing each with structured content.',
    paragraphs: [
      'Searchers who type “Rand Fishkin” exhibit three dominant intents: navigate to his active profiles (SparkToro, X/Twitter, LinkedIn), learn about his background and ideas, or evaluate the tools/companies he founded. This page meets those intents with a clearly labeled overview, links to primary properties, a biography‑to‑timeline arc, and operator‑grade playbooks for SEO and audience research. Rich internal anchors and schema help search engines interpret topical depth while keeping the experience human‑centered.',
      'Semantically related phrases include “SparkToro,” “Moz founder,” “Lost and Founder,” “zero‑click searches,” “audience research,” “Whiteboard Friday,” and “marketing flywheel.” We naturally incorporate these entities to reinforce topical authority without keyword stuffing. The writing emphasizes E‑E‑A‑T principles through citations of public work, reproducible methods, and transparent caveats. The result is a resource that answers broad curiosity and specialized practitioner questions in a single scrollable destination.',
      'Because many users arrive via mobile, the design favors scannability: a sticky table of contents, callout cards for data‑backed insights, and readable typography. At the same time, long‑form sections provide depth on methodology, such as how to conduct audience research using SparkToro‑like approaches, or how to evaluate SERP features when planning for brand demand capture and content distribution.',
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline and Milestones',
    summary: 'A chronological narrative of notable events across Moz, SparkToro, and widely referenced research.',
    paragraphs: [
      'Rand Fishkin’s public trajectory tracks the evolution of modern SEO. Early blogging and community engagement led to the founding of SEOmoz (later Moz), a hub for tools, education, and community. Whiteboard Friday became a weekly ritual for practitioners, translating complex concepts into accessible visuals. The brand’s unique blend of software, community, and teaching helped professionalize SEO and made measurement central to the craft.',
      'After transitioning out of Moz leadership, Rand co‑founded SparkToro with Casey Henry. Where Moz focused on ranking signals, SparkToro focused on audience signals: the sources an audience follows, the podcasts they listen to, the websites they visit. This framed marketing as “find your people first—then craft channel strategy,” complementing SEO with PR, content, and partnerships. The product emerged alongside essays on audience‑first marketing and data‑light research that teams can run quickly.',
      'Throughout, Rand published widely shared analyses about the changing SERP. The “zero‑click searches” study highlighted how often Google satisfied queries on the results page, changing traffic expectations for publishers. Rather than fatalism, the practical takeaway was to align content with searcher journeys and diversify discovery beyond search alone—via email, social, community, and partnerships. This multi‑channel stance threads through his more recent work at SparkToro.',
    ],
  },
  {
    id: 'principles',
    title: 'Core Principles',
    summary: 'Operating beliefs that recur across Rand’s writing, talks, and product design choices.',
    paragraphs: [
      'Transparency over theater. Rand’s brands have long favored candid reporting—sharing wins, losses, and internal metrics. For teams, this translates to open post‑mortems, public changelogs, and customer‑visible roadmaps when appropriate.',
      'Audience before channel. Rather than chasing tactics, define the people you need to reach, understand their beliefs and habits, and let that drive channel selection, messaging, and creative. SparkToro operationalizes this idea.',
      'Compoundable assets win. Invest in evergreen content, relationships, and product improvements that accrue advantage over time. “Hard to copy, worth doing” is a useful bar: select activities that create moats beyond budget and brute force.',
      'Ethical, user‑respectful marketing. Avoid manipulative patterns, deceptive UX, or data practices that erode trust. Growth that compromises user respect is fragile; brand is built through consistent, respectful interactions.',
    ],
  },
  {
    id: 'audience-research',
    title: 'Audience Research: A Practical Playbook',
    summary: 'How to run audience discovery studies inspired by SparkToro’s methodology and Rand’s guidance.',
    paragraphs: [
      'Define the high‑value audience. Start with the group whose attention would most transform outcomes (buyers, amplifiers, gatekeepers). Write a one‑paragraph description capturing their role, goals, and constraints.',
      'Enumerate sources of influence. Catalog accounts, publications, podcasts, newsletters, and communities your audience already trusts. This replaces guesswork with a tactical map for distribution and partnerships.',
      'Extract language and mental models. Pay close attention to the phrases, objections, and metaphors your audience uses. Mirror that language in headlines, landing pages, and outreach—clarity beats cleverness.',
      'Design lightweight experiments. Before large investments, test messages and offers where your audience lives: comment thoughtfully, run small newsletter placements, share a data snippet. Measure replies, shares, and qualified traffic.',
      'Close loops with owned channels. Convert attention into durable relationships through email, community, and product onboarding. Measure not just clicks, but conversations and retention. Discovery without capture limits ROI.',
    ],
  },
  {
    id: 'content-links',
    title: 'Content and Link Acquisition—The Durable Way',
    summary: 'Lessons from community‑building and research‑driven content that earns links without spam.',
    paragraphs: [
      'Publish research with methodological notes. Whether proprietary or curated, explain how you obtained data and where its limitations lie. Transparency increases citation rates and reduces backlash.',
      'Teach in public. Whiteboard‑style content—clear diagrams, worked examples, and “why this works”—earns links because it solves real problems. Prioritize canonical guides over generic listicles.',
      'Be discoverable to journalists and curators. Create an “evidence hub” with quotable stats, definitions, and visuals under a permissive license. Maintain a press page with headshots, bios, and contact paths.',
      'Avoid transactional link schemes. Spammy tactics jeopardize brand equity and risk manual actions. Relationship‑first outreach, small co‑marketing projects, and community participation outperform cold link swaps.',
    ],
  },
  {
    id: 'product-lessons',
    title: 'Product Lessons from Moz and SparkToro',
    summary: 'Company‑building insights distilled from two products with different missions and markets.',
    paragraphs: [
      'Positioning determines roadmap. When the product’s promise is crisply framed (e.g., “find the audiences that matter”), prioritization becomes easier and marketing more credible. Avoid vague, catch‑all messaging.',
      'Price for value, not complexity. SparkToro’s pricing emphasizes usefulness and clarity over feature bloat. Clear tiers and usage limits reduce cognitive load and churn risk.',
      'Distribution is part of the product. Education, integrations, and partnerships expand the surface area where value is discovered. Moz’s community and SparkToro’s research posts are not side projects—they are distribution engines.',
      'Culture is a strategy. Psychological safety, candid retros, and respect for work‑life balance improve decision quality and retention. Healthy teams ship better products and support them well.',
    ],
  },
  {
    id: 'zero-click',
    title: 'Zero‑Click Searches and the Modern SERP',
    summary: 'Implications of answers‑in‑SERP behavior for content strategy, measurement, and expectations.',
    paragraphs: [
      'A significant share of queries now resolve without a traditional click, especially on mobile. Featured snippets, direct answers, and knowledge panels satisfy intent on Google’s surface. Rather than treat this as doom, reframe it as segmentation: some intents are capture‑worthy, others are brand‑exposure wins.',
      'Strategies that excel in this environment: align pages to task completion, not just keywords; build recognizable brand elements that show up in SERP features; and diversify discovery by investing in channels where clicks are native—email, community, and product‑embedded education.',
      'Measurement should reflect reality. Track assisted conversions, branded search lift, and direct traffic trends alongside organic landing pages. Tie reporting to business outcomes, not only last‑click sessions.',
    ],
  },
  {
    id: 'faq-ready',
    title: 'FAQ‑Ready Answers',
    summary: 'Direct, people‑also‑ask‑style responses for common questions about Rand Fishkin and his work.',
    paragraphs: [
      'Who is Rand Fishkin? An entrepreneur, author, and speaker known for co‑founding Moz and SparkToro. He writes about audience research, ethical marketing, and sustainable growth.',
      'What is SparkToro? A platform for audience research that shows what a given audience follows, visits, and engages with—useful for PR, content placement, and partnership strategy.',
      'What is Lost and Founder? A book by Rand Fishkin about the realities of building a venture‑backed startup, emphasizing transparency, founder mental health, and alternative growth paths.',
      'What was Whiteboard Friday? A weekly educational series started at Moz that popularized approachable, visual explanations of SEO topics.',
    ],
  },
];

export const randFishkinStats: RandFishkinStat[] = [
  { label: 'Companies', value: 'Moz, SparkToro', description: 'Co‑founded two widely known companies serving marketers and founders.' },
  { label: 'Signature Works', value: 'Whiteboard Friday, Zero‑Click, Lost and Founder', description: 'Education series, data‑driven research, and a founder memoir.' },
  { label: 'Focus', value: 'Audience Research & Ethical Growth', description: 'Emphasizes finding true audiences and building respectful brands.' },
  { label: 'Channels', value: 'Blog, X/Twitter, Talks, Research', description: 'Multi‑format publishing with a bias toward transparency.' },
];

export const randFishkinTimeline: RandFishkinTimelineEvent[] = [
  { year: '2004–2012', title: 'SEOmoz Community and Tools', description: 'Built a community and toolset that helped codify modern SEO practices; launched Whiteboard Friday.' },
  { year: '2013–2017', title: 'Moz Growth & Leadership', description: 'Transitioned brand, expanded software suite, and continued public education efforts.' },
  { year: '2018', title: 'Lost and Founder', description: 'Published a candid look at venture‑backed startup life and alternatives to blitzscaling.' },
  { year: '2018–Present', title: 'SparkToro', description: 'Co‑founded SparkToro to make audience research accessible and actionable for marketers and founders.' },
  { year: '2019–Present', title: 'Zero‑Click Analyses', description: 'Published data‑backed analyses of SERP behavior and its impact on publisher traffic.' },
];

export const randFishkinFaqs: RandFishkinFAQ[] = [
  { question: 'Is Rand Fishkin still active in SEO?', answer: 'Yes. While focused on audience research at SparkToro, Rand routinely publishes analyses on search, brand, and distribution.' },
  { question: 'How is SparkToro used?', answer: 'Teams use SparkToro to identify influential sources, research audience language, and plan placements across podcasts, newsletters, and websites.' },
  { question: 'What are ethical alternatives to aggressive growth tactics?', answer: 'Invest in research‑driven content, partnerships, community, and product education—strategies that compound without compromising user trust.' },
  { question: 'Does zero‑click mean SEO is dead?', answer: 'No. It means align content with tasks, diversify discovery, and measure beyond last‑click. Organic remains a core channel when matched to the right intents.' },
];

export const randFishkinGlossary: RandFishkinGlossaryEntry[] = [
  { term: 'Audience Research', definition: 'A process of discovering the sources, language, and beliefs of a target group to guide channel and message selection.' },
  { term: 'Zero‑Click Searches', definition: 'Queries that resolve without a traditional site click due to SERP features providing direct answers.' },
  { term: 'Whiteboard Friday', definition: 'Moz’s long‑running video series explaining SEO concepts in an accessible, visual format.' },
  { term: 'Domain Authority (DA)', definition: 'A Moz metric estimating the likelihood of a domain ranking relative to others; useful for comparison, not an absolute measure.' },
  { term: 'Audience‑First Marketing', definition: 'A strategy that prioritizes finding and serving the right people before optimizing specific channels.' },
];
