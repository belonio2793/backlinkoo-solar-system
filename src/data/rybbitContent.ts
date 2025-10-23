export const rybbitHero = {
  title: 'Rybbit: The Open-Source Privacy-First Analytics Alternative to Google Analytics',
  subtitle: 'Comprehensive 2025 Guide to Features, Pricing, Self-Hosting, and Why Privacy-Conscious Teams Choose Rybbit',
};

export const rybbitStats = [
  { label: 'Companies Using', value: '2,000+' },
  { label: 'Events Monthly Free Tier', value: '10,000' },
  { label: 'Data Retention (Pro)', value: '5+ Years' },
  { label: 'Open Source', value: 'Yes' },
];

export const rybbitSections = [
  {
    id: 'overview',
    title: 'What is Rybbit? Understanding the Open-Source Analytics Revolution',
    description:
      'Rybbit represents a paradigm shift in how organizations approach web and product analytics. Unlike traditional platforms that rely on third-party servers and cookie-based tracking, Rybbit delivers a self-hosted, open-source solution that puts data ownership and privacy compliance at the center of its architecture.',
    paragraphs: [
      'In an era where GDPR, CCPA, and privacy regulations dominate the digital landscape, Rybbit emerges as the answer to a critical problem: how can organizations gain deep insights into user behavior without sacrificing privacy or violating regulatory requirements? Rybbit is an open-source, lightweight, and cookieless web and product analytics platform designed specifically for teams that refuse to compromise on privacy or transparency.',
      'Founded on principles of openness and data sovereignty, Rybbit allows teams to deploy analytics infrastructure on their own servers, maintain complete control over user data, and achieve full regulatory compliance. This architectural approach contrasts sharply with Google Analytics, which stores user data on Google\'s servers, and other third-party platforms like Mixpanel, Amplitude, and PostHog, which may offer self-hosting but with additional complexity and cost.',
      'Rybbit\'s core value proposition resonates with privacy-conscious organizations, developers who value open-source transparency, and enterprises requiring strict data residency controls. The platform has rapidly gained traction with over 2,000 companies leveraging it for real-time analytics, making it one of the fastest-growing analytics solutions for teams prioritizing privacy.',
      'What sets Rybbit apart is not merely its privacy-first positioning—it\'s the comprehensive feature set delivered within that framework. From real-time analytics dashboards to session replay, web vitals monitoring, funnel analysis, and advanced user segmentation, Rybbit provides enterprise-grade analytics capabilities that rival expensive legacy platforms.',
    ],
  },
  {
    id: 'core-features',
    title: 'Core Features: What Makes Rybbit Essential for Modern Analytics',
    description:
      'Rybbit\'s feature architecture is built on the principle that analytics should be comprehensive, accessible, and privacy-respecting. Each feature is engineered to answer critical business questions while maintaining strict data privacy standards.',
    paragraphs: [
      'Real-Time Analytics: Monitor user activity as it happens. Rybbit\'s real-time dashboard provides instant visibility into visitor counts, active sessions, geographic distribution, device types, and user engagement patterns. This allows teams to respond immediately to performance issues, monitor campaign impact, and detect anomalies in user behavior with zero delay.',
      'Session Replay: Understanding user experience requires more than aggregate metrics. Rybbit\'s session replay feature allows you to watch actual user sessions, revealing navigation patterns, interaction points, friction areas, and abandonment triggers. This visual understanding accelerates UX optimization and identifies product issues that metrics alone cannot surface.',
      'Web Vitals and Core Metrics: Performance directly impacts user experience and SEO rankings. Rybbit automatically monitors Core Web Vitals—Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS)—alongside custom performance metrics. Teams gain actionable insights into page speed, interactivity, and stability.',
      'User Profiles and Journey Mapping: Every user tells a story. Rybbit\'s user profile system captures comprehensive data: first and last seen timestamps, total sessions, pageview counts, device information, referrer sources, and custom attributes. Journey mapping visualizes each user\'s path through your product, revealing decision points and conversion triggers.',
      'Event Tracking and Custom Events: Beyond page views, sophisticated analytics requires granular event tracking. Rybbit supports unlimited custom events—button clicks, form submissions, video plays, purchase completions—with rich contextual data. Teams can track form_id, page_section, user_segment, A/B test variants, and any dimension relevant to their business.',
      'Conversion Funnels and Goal Tracking: Define conversion goals (newsletter signups, free trial starts, purchase completions) and visualize drop-off patterns through multi-step funnels. Understand where users abandon the conversion process and optimize each step for maximum effectiveness.',
      'Retention and Cohort Analysis: Track user retention across cohorts, understand repeat usage patterns, identify power users, and measure long-term engagement trends. This analysis is crucial for understanding product-market fit and lifetime value.',
      'Advanced User Segmentation: Create dynamic segments based on behavior, attributes, or custom properties. Analyze segment-specific metrics, identify high-value user patterns, and tailor product experiences accordingly.',
    ],
  },
  {
    id: 'privacy-compliance',
    title: 'Privacy by Design: How Rybbit Simplifies Regulatory Compliance',
    description:
      'Privacy regulations have fundamentally reshaped how organizations can collect and process user data. Rybbit\'s architecture makes compliance straightforward and automatic.',
    paragraphs: [
      'GDPR and CCPA Compliance: Rybbit\'s cookieless, fingerprint-free architecture means no consent banners are required. The platform doesn\'t identify individuals across sessions or store persistent identifiers. This fundamental design choice eliminates entire categories of compliance burden that plague traditional analytics platforms.',
      'Data Residency Control: Organizations handling sensitive industries—healthcare, finance, government—often require data residency within specific jurisdictions. With Rybbit\'s self-hosted option, data remains within your infrastructure, under your control, accessible only through your authentication systems.',
      'No Third-Party Data Sharing: Rybbit doesn\'t sell data, share with advertisers, or feed your analytics into broader ad networks. Your analytics data is yours alone. This transparency builds customer trust and aligns with ethical data practices.',
      'Transparent Open-Source Code: The entire Rybbit codebase is available for audit. Security researchers, compliance officers, and technical teams can inspect exactly how data is collected, processed, and stored. This transparency is impossible with proprietary platforms.',
      'Automatic GDPR-Compliant Data Deletion: Implement automatic data retention policies and user deletion requests. Rybbit handles the infrastructure so your team doesn\'t need custom engineering to maintain compliance.',
    ],
  },
  {
    id: 'pricing-comparison',
    title: 'Rybbit Pricing: Transparent, Scalable, and Fair',
    description:
      'Rybbit\'s pricing model prioritizes transparency and eliminates surprise bills. The free tier is genuinely useful, and paid tiers scale with your business.',
    paragraphs: [
      'Free Tier: 10,000 Events/Month - Perfect for Getting Started: The free tier includes 10,000 events per month with no credit card required. This is sufficient for small websites (50-500 monthly visitors) or evaluation purposes. Early-stage startups can launch analytics immediately without cost barriers.',
      'Standard Plan: $19/Month - For Growing Teams: Unlimited websites, comprehensive event tracking, funnels, journeys, and standard retention. This tier unlocks multi-site analytics for small to medium businesses scaling their product analytics.',
      'Pro Plan: $39/Month - For Enterprise Teams: Everything in Standard plus session replay, extended data retention (5+ years), priority support, and advanced features. Designed for teams managing complex products or requiring long-term data analysis.',
      'Custom Event Volume: Unlike platforms that charge per event, Rybbit uses a fixed monthly plan. For organizations exceeding typical event volumes, custom pricing is available. This prevents bill shock and enables predictable budgeting.',
      'Self-Hosted Option: Deploy Rybbit on your infrastructure to eliminate recurring software costs while maintaining data control. The open-source model means no licensing fees—you pay only for infrastructure.',
      'Fair Pricing Philosophy: Rybbit explicitly avoids manipulative pricing tactics common in SaaS. No hidden features, no surprise charges for standard capabilities, no forced upsells.',
    ],
  },
  {
    id: 'self-hosting',
    title: 'Self-Hosting and Deployment: Taking Control of Your Analytics Infrastructure',
    description:
      'Self-hosting analytics provides maximum control, security, and customization. Rybbit makes self-hosting accessible to teams of all sizes.',
    paragraphs: [
      'Why Self-Host?: When you self-host Rybbit, your analytics data never leaves your infrastructure. This is critical for organizations with strict data governance requirements, competitive sensitivity, or regulatory constraints. You eliminate dependency on external vendors, reduce attack surface, and gain complete audit trails.',
      'Deployment Options: Rybbit supports multiple deployment scenarios. Docker containers enable rapid deployment on any infrastructure. Kubernetes manifests facilitate scaling within container orchestration platforms. Traditional server deployments work for teams preferring direct control. Cloud platforms like AWS, Google Cloud, and Azure integrate seamlessly.',
      'Infrastructure Requirements: Rybbit is engineered for efficiency. A single server with modest resources (2 CPUs, 2GB RAM) handles millions of monthly events. This lightweight architecture means self-hosting is economical—often cheaper than cloud subscription platforms over time.',
      'Database Management: Rybbit uses PostgreSQL for data storage, a battle-tested relational database. Self-hosting gives you database administration flexibility: backups, replication, optimization, and disaster recovery aligned with your requirements.',
      'Monitoring and Operations: Open-source deployment provides visibility into analytics infrastructure health. Monitor API response times, database performance, storage utilization, and system metrics. Integrate with existing monitoring systems using Prometheus, Datadog, or New Relic.',
      'Community Support and Documentation: The open-source Rybbit community provides extensive documentation, deployment guides, and troubleshooting resources. For teams requiring commercial support, vendors offer managed hosting options.',
    ],
  },
  {
    id: 'integrations-ecosystem',
    title: 'Integrations and Ecosystem: Rybbit Works With Your Tech Stack',
    description:
      'Modern products use diverse technology stacks. Rybbit integrates seamlessly with popular frameworks, platforms, and tools.',
    paragraphs: [
      'Framework Integration: Rybbit provides SDKs for all major JavaScript frameworks. React, Vue, Angular, Svelte, and Next.js developers can install npm packages and begin tracking within minutes. Framework-specific documentation ensures integration aligns with framework conventions and best practices.',
      'Web Platforms and CMS: WordPress, WooCommerce, Shopify, Webflow, Docusaurus, and Ghost integrations bring analytics to non-developer platforms. Plugin installation typically requires minimal configuration, making Rybbit accessible to non-technical teams.',
      'E-commerce Platforms: Shopify and WooCommerce integrations automatically track product views, cart additions, purchases, and custom events relevant to e-commerce businesses. Understanding customer journey from discovery through purchase is straightforward.',
      'API-First Architecture: Rybbit\'s comprehensive API enables custom integrations beyond pre-built connectors. Send events from backend services, mobile applications, IoT devices, or any system generating data. API documentation is extensive and maintained by the active development community.',
      'Data Export and Integration: Export analytics data in standard formats (JSON, CSV) or via API calls. Integrate Rybbit data with BI tools like Metabase, Tableau, or Looker. Build custom dashboards that combine Rybbit analytics with other business metrics.',
      'Webhook Support: React to user behavior in real-time. When users complete specific events or meet engagement criteria, Rybbit can trigger webhooks to downstream systems. Automate follow-up communications, trigger alerts, or update customer profiles in real-time.',
    ],
  },
  {
    id: 'comparison',
    title: 'Rybbit vs. Alternatives: How It Compares to Google Analytics, PostHog, Mixpanel, and Amplitude',
    description:
      'Understanding how Rybbit compares to established analytics platforms helps teams make informed decisions.',
    paragraphs: [
      'vs. Google Analytics: Google Analytics is free but tracks users across the internet for advertising purposes. Data is stored on Google servers, creating privacy concerns and regulatory complications in Europe. Rybbit offers superior privacy, eliminates cookie consent requirements, provides better session replay, and gives you complete data ownership. The tradeoff: Google Analytics\' massive user base means more integrations exist.',
      'vs. PostHog: PostHog is an excellent open-source product analytics platform. Both Rybbit and PostHog prioritize privacy and offer self-hosting. Rybbit emphasizes simplicity and lightweight architecture, making it ideal for small to mid-market teams. PostHog offers more extensive feature depth and enterprise capabilities, making it better for complex product teams with advanced feature flag and experimentation requirements.',
      'vs. Mixpanel: Mixpanel focuses on product analytics with sophisticated cohort analysis and user segmentation. However, Mixpanel is proprietary, expensive ($1,500+/month for meaningful usage), and complex to implement. Rybbit offers comparable analytics capabilities at a fraction of the cost with superior privacy.',
      'vs. Amplitude: Like Mixpanel, Amplitude is powerful but proprietary and expensive. Amplitude excels at behavioral cohorts and predictive analytics. Rybbit prioritizes simplicity, privacy, and cost-efficiency. For teams needing Amplitude\'s predictive capabilities, the choice depends on whether advanced analytics or privacy and cost are priorities.',
      'Rybbit\'s Competitive Advantages: Open-source transparency, genuine cookieless design, GDPR-compliant by default, self-hosting option, affordable pricing, and lightweight architecture. Rybbit sacrifices some enterprise features (like Amplitude\'s predictive models) in favor of simplicity and privacy.',
      'When to Choose Rybbit: Privacy-first organizations, teams requiring data control, budget-conscious companies, and businesses serving international audiences benefit most from Rybbit. When to consider alternatives: Teams needing advanced predictive analytics, complex experimentation platforms, or extensive third-party integrations might find specialized platforms valuable.',
    ],
  },
  {
    id: 'implementation',
    title: 'Implementation and Best Practices: Getting Maximum Value from Rybbit',
    description:
      'Successful analytics implementation requires thoughtful strategy. These practices maximize the value Rybbit delivers.',
    paragraphs: [
      'Define Your Metrics Framework: Before implementation, define key success metrics aligned with business objectives. What does success look like? User acquisition? Engagement? Conversion rates? Revenue? Document these metrics and their definitions to ensure consistent measurement.',
      'Strategic Event Design: Plan custom events thoughtfully. Poorly designed events create noise; well-designed events reveal insights. Each event should answer a specific business question. Avoid tracking events you won\'t analyze.',
      'Segmentation Strategy: Plan user segments aligned with business goals. Geographic segments, user type segments, cohort segments, and behavioral segments each reveal different insights. Smart segmentation transforms raw metrics into actionable intelligence.',
      'Real-Time Monitoring: Set up dashboards monitoring critical metrics continuously. When user engagement drops or errors spike, immediate visibility enables rapid response.',
      'Comparative Analysis: Compare metrics across segments, time periods, and feature variants. Understand what drives differences in user behavior. A/B tests reveal causation; segmentation analysis reveals correlation.',
      'Regular Review Cadence: Establish rhythms for analytics review. Weekly dashboards for operational metrics, monthly reviews for trend analysis, quarterly deep dives for strategic insights. Consistent review prevents insights from being generated but unactionable.',
      'Privacy-First Implementation: Even with cookieless tracking, implement analytics ethically. Be transparent with users about what data you collect. Respect user preferences and honor deletion requests promptly.',
      'Data Quality: Implement data validation in your tracking code. Ensure events contain expected fields, verify event names follow naming conventions, and audit sample event data regularly.',
    ],
  },
  {
    id: 'use-cases',
    title: 'Real-World Use Cases: How Organizations Leverage Rybbit Analytics',
    description:
      'From e-commerce to SaaS to media platforms, Rybbit powers analytics for diverse business types.',
    paragraphs: [
      'E-commerce Optimization: Online retailers use Rybbit to track product discovery journeys, shopping cart behavior, purchase completion, and post-purchase engagement. Understanding which products drive traffic, where cart abandonment occurs, and what customer segments convert best enables data-driven merchandising and marketing optimization.',
      'SaaS Onboarding: Software companies track free trial activation, feature adoption, engagement patterns, and retention by cohort. This reveals whether onboarding drives feature adoption and which features correlate with long-term retention.',
      'Content Publishing: Media platforms monitor article performance, reader engagement, scroll depth, comment activity, and retention. Rybbit helps publishers understand which topics resonate, how to improve reader experience, and which content drives repeat visitation.',
      'Mobile App Analytics: Developers integrating Rybbit into mobile apps (via web views or API) track user flows, feature usage, conversion funnels, and crash patterns. Session replay on web reveals user experience friction.',
      'Privacy-Compliant Enterprise Analytics: Large organizations handling sensitive data deploy Rybbit on private infrastructure to analyze user behavior without regulatory risk. Financial services, healthcare providers, and government agencies benefit from Rybbit\'s compliance-by-design architecture.',
      'Open-Source Community Engagement: Open-source projects use Rybbit to understand contributor patterns, user adoption, and community engagement. The transparency of open-source aligned with privacy-first analytics is a natural fit.',
    ],
  },
  {
    id: 'security',
    title: 'Security and Data Protection: Rybbit\'s Commitment to Safe Analytics',
    description:
      'Security is foundational to analytics platforms handling user behavior data. Rybbit implements comprehensive security practices.',
    paragraphs: [
      'Transport Security: All data transmission occurs over encrypted HTTPS/TLS connections. Man-in-the-middle attacks and eavesdropping are prevented through industry-standard encryption.',
      'Authentication and Authorization: Rybbit implements robust authentication systems. Multi-factor authentication, API keys with scoping, and role-based access control ensure only authorized team members can access analytics.',
      'Audit Logging: Every data access and configuration change is logged. Audit trails provide accountability and enable detection of unauthorized access attempts.',
      'Data Encryption: Data stored in Rybbit databases can be encrypted at rest. Self-hosted deployments can implement full-disk encryption and database-level encryption aligned with their security requirements.',
      'Regular Security Updates: The open-source community continuously audits Rybbit code. Security vulnerabilities are identified and patched rapidly. Self-hosted deployments can apply updates on their schedule.',
      'Third-Party Audits: For organizations requiring external validation, third-party security audits can assess Rybbit deployments. The open-source nature enables thorough security review.',
      'Responsible Disclosure: The Rybbit community follows responsible disclosure practices. Security researchers can report vulnerabilities privately, receiving fixes before public disclosure.',
    ],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions About Rybbit',
    description:
      'Common questions about Rybbit implementation, privacy, pricing, and comparison to alternatives.',
    paragraphs: [
      'Does Rybbit require cookie consent banners? No. Rybbit\'s cookieless design means no consent banners are required. This simplifies implementation and improves user experience.',
      'Can I migrate from Google Analytics to Rybbit? Yes. Export Google Analytics data, implement Rybbit tracking on your website, and gradually deprecate Google Analytics. Rybbit\'s comprehensive feature set covers most Google Analytics use cases.',
      'Is Rybbit suitable for high-traffic websites? Absolutely. Rybbit\'s efficient architecture handles millions of events monthly. Self-hosted deployments can scale horizontally across multiple servers for massive traffic.',
      'What\'s the learning curve for Rybbit? Rybbit is designed for simplicity. Non-technical users can configure basic analytics within minutes. Advanced users can leverage the API and custom events for sophisticated analysis.',
      'Can I track e-commerce transactions? Yes. Rybbit supports custom events for purchase tracking. Integrate with Shopify, WooCommerce, or implement custom event tracking via API.',
      'Does Rybbit work with single-page applications? Yes. Rybbit\'s JavaScript SDK tracks page changes in SPAs. Framework SDKs handle route navigation automatically.',
      'What data retention is available? Free tier retains data for 30 days. Standard tier retains data for 1 year. Pro tier retains data for 5+ years. Self-hosted deployments control their retention.',
      'Can I host Rybbit on my infrastructure? Yes. Rybbit is open-source and self-hosting is fully supported. Deploy on AWS, Google Cloud, Azure, or private data centers.',
      'How does Rybbit handle data deletion requests? Rybbit\'s API supports bulk data deletion for GDPR compliance. Individual user data can be deleted on request.',
      'What support options are available? Community support is available via GitHub, documentation, and forums. Commercial support and managed hosting options exist for organizations requiring SLAs.',
    ],
  },
  {
    id: 'future-roadmap',
    title: 'The Future of Analytics: Rybbit\'s Vision and Product Roadmap',
    description:
      'As the analytics landscape evolves, Rybbit continues innovating while maintaining core commitments to privacy and simplicity.',
    paragraphs: [
      'AI-Powered Insights: Future releases will incorporate machine learning to surface unexpected patterns automatically. Anomaly detection, predictive churn identification, and intelligent segmentation suggestions will reduce manual analysis.',
      'Advanced Experimentation: A/B testing and multivariate testing capabilities will enable teams to run experiments natively within Rybbit, reducing dependency on external experimentation platforms.',
      'Enhanced Mobile Support: Native mobile SDKs for iOS and Android will enable comprehensive analytics in native applications without compromising privacy.',
      'Visual Query Builder: Non-technical team members will build custom reports through intuitive visual interfaces without writing code.',
      'Expanded Integration Ecosystem: More first-party integrations with popular CMS, e-commerce, and business platforms will continue expanding Rybbit\'s accessibility.',
      'Community-Driven Development: The open-source community will continue driving feature development. Organizations implementing Rybbit can contribute features aligned with their needs.',
      'Privacy Innovation: As privacy regulations evolve, Rybbit will continue pioneering privacy-respecting analytics techniques that competitors cannot match.',
    ],
  },
  {
    id: 'conclusion',
    title: 'Conclusion: Why Rybbit Represents the Future of Analytics',
    description:
      'The analytics industry is undergoing fundamental transformation. Privacy regulations, user expectations, and competitive pressure are shifting how organizations approach data.',
    paragraphs: [
      'Rybbit stands at the center of this transformation. By combining open-source transparency, genuine privacy protection, comprehensive features, and sustainable pricing, Rybbit offers something unique: analytics without compromise.',
      'Whether you\'re a small startup needing analytics without complexity, an enterprise requiring absolute data control, or a privacy-conscious organization refusing to participate in ad-tech ecosystems, Rybbit delivers.',
      'The transition from traditional analytics to privacy-first alternatives is not inevitable yet—but the momentum is clear. Regulatory pressure increases. Users demand privacy. Teams want data they truly own.',
      'Rybbit is ready. The platform is mature, the community is active, and the features are comprehensive. For teams ready to move beyond analytics platforms designed primarily for advertisers, Rybbit offers a compelling alternative.',
      'Start with the free tier. Evaluate Rybbit for your use case. Experience analytics built on principles you can stand behind. The future of privacy-first analytics is here, and it\'s called Rybbit.',
    ],
  },
];

export const rybbitGlossary = [
  { term: 'Cookieless Tracking', definition: 'Analytics that do not rely on persistent identifiers or cookies, enabling privacy-compliant data collection without user consent forms.' },
  { term: 'Session Replay', definition: 'Feature allowing playback of actual user sessions to understand user experience, navigation patterns, and usability issues.' },
  { term: 'Core Web Vitals', definition: 'Google\'s metrics measuring user experience: Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).' },
  { term: 'Funnel Analysis', definition: 'Visualization of multi-step user journeys to identify drop-off points and optimize conversion.' },
  { term: 'Cohort Analysis', definition: 'Grouping users by shared characteristics or behaviors to compare performance across groups.' },
  { term: 'Event Tracking', definition: 'Recording specific user actions (clicks, form submissions, purchases) beyond basic page views.' },
  { term: 'Data Residency', definition: 'Requirement that data remains within specific geographic regions or jurisdictions for compliance purposes.' },
  { term: 'GDPR/CCPA Compliance', definition: 'Meeting regulatory requirements for user data privacy in Europe (GDPR) and California (CCPA).' },
  { term: 'User Segmentation', definition: 'Dividing users into groups based on characteristics or behaviors for targeted analysis.' },
  { term: 'Real-Time Analytics', definition: 'Instant visibility into current user activity and metrics with minimal delay.' },
];
