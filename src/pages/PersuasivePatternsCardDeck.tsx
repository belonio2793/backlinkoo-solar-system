import { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

const metaTitle = 'Persuasive Patterns Card Deck — UX Psychology Tools for Better Product Decisions';
const metaDescription = 'Explore the Persuasive Patterns Card Deck: a practical toolkit of psychological patterns, examples, and experiments that help designers, product teams, and marketers craft more persuasive, ethical user experiences.';

export default function PersuasivePatternsCardDeckPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/persuasive-patterns-card-deck`;
    } catch {
      return '/persuasive-patterns-card-deck';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Persuasive Patterns, card deck, UX psychology, conversion design, behavioral design, persuasive design');
    upsertCanonical(canonical);

    injectJSONLD('persuasive-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('persuasive-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('persuasive-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What are Persuasive Patterns?', acceptedAnswer: { '@type': 'Answer', text: 'Persuasive Patterns are repeatable UX techniques and micro-interactions grounded in behavioral psychology that help guide user decisions while maintaining ethical standards.' } },
        { '@type': 'Question', name: 'Who benefits from the card deck?', acceptedAnswer: { '@type': 'Answer', text: 'Designers, product managers, marketers, researchers, and educators who want a practical, example-driven tool to design and test persuasive, ethical experiences.' } },
        { '@type': 'Question', name: 'Is the card deck ethical to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — the deck emphasizes respectful, consent-minded approaches; it encourages testing, transparency, and avoiding dark patterns.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Persuasive Patterns Card Deck — Practical UX Psychology for Better Product Decisions</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">A curated card deck of evidence-based UX patterns, examples, and prompts to help teams design persuasive, human-centered experiences—ethical, testable, and ready for team workshops.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">UX Patterns</Badge>
            <Badge className="bg-slate-100 text-slate-800">Behavioral Design</Badge>
            <Badge className="bg-slate-100 text-slate-800">Workshops & Testing</Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 sticky top-28 self-start">
            <Card>
              <CardHeader>
                <CardTitle>On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="text-sm space-y-2">
                  <a href="#overview" className="block text-blue-700">Overview</a>
                  <a href="#contents" className="block text-blue-700">What's in the deck</a>
                  <a href="#patterns" className="block text-blue-700">Key patterns</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workshops" className="block text-blue-700">Workshops & exercises</a>
                  <a href="#ethics" className="block text-blue-700">Ethics & best practices</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">The Persuasive Patterns Card Deck is a hands-on toolkit that brings behavioral science into product decisions. Use it for ideation, pattern discovery, and running focused experiments that respect users and improve outcomes.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="overview">
              <h2>Overview</h2>

              <p>The Persuasive Patterns Card Deck is designed to make behavioral design approachable and actionable. Rather than dense academic texts or long blog posts, the deck presents bite-sized patterns on durable cards with: a clear name, a short description, psychological rationale, practical examples, and prompts for testing. The format helps teams rapidly scan options, align on language, and pick patterns to prototype and measure.</p>

              <p>The idea is simple: good product decisions combine evidence and iteration. The card deck gives teams a shared vocabulary to discuss influence techniques and a practical way to translate them into experiments. Whether you are improving onboarding completion, increasing retention, or refining checkout flows, the deck helps you identify interventions grounded in human behavior.</p>

              <p>This guide expands on the deck—explaining core patterns, offering use cases, and describing workshop exercises that help teams apply the patterns responsibly. It also covers measurement frameworks and ethical guardrails to ensure persuasion is used to help users, not manipulate them.</p>
            </section>

            <section id="contents">
              <h2>What’s in the Deck</h2>

              <p>The deck typically contains 50–80 cards grouped by theme. Each card includes:</p>
              <ul>
                <li><strong>Pattern name:</strong> A concise, memorable label used by teams in conversation.</li>
                <li><strong>Essence:</strong> A one-sentence description of what the pattern does.</li>
                <li><strong>Why it works:</strong> A brief psychological principle or research-backed rationale.</li>
                <li><strong>Examples:</strong> Real-world interfaces where the pattern appears.</li>
                <li><strong>Test prompt:</strong> A suggested A/B or usability test hypothesis and metrics to measure.</li>
                <li><strong>Ethical note:</strong> Guidance on consent, transparency, and avoiding harm.</li>
              </ul>

              <p>Categories commonly included are: social proof, scarcity & urgency, friction reduction, commitment devices, progress indicators, defaults & preselection, microcopy nudges, visual affordances, and cognitive load reduction.</p>
            </section>

            <section id="patterns">
              <h2>Key Patterns Explained</h2>

              <h3>Social Proof</h3>
              <p>Essence: Show that others like the product or have taken the action you want the user to take. Why it works: Humans are social animals and often look to others to determine correct behavior in uncertain situations.</p>
              <p>Examples: "Popular with teams like yours," counts of users, buyer testimonials tied to real profiles. Test prompt: Add a small, credible indicator of peer usage on a landing page and measure sign-up lift and funnel drop-off.</p>

              <h3>Commitment & Consistency</h3>
              <p>Essence: Use small initial commitments to increase the likelihood of larger future actions. Why it works: People strive for internal consistency with their previous commitments.</p>
              <p>Examples: Asking for a low-friction micro-commitment (email address, short quiz) before pitching premium features. Test prompt: Compare funnel completion rates with and without an initial micro-commitment.</p>

              <h3>Defaults & Preselection</h3>
              <p>Essence: Set the option that benefits the user (and business) as the default while keeping choices transparent. Why it works: People often accept defaults to reduce effort and cognitive load.</p>
              <p>Examples: Prechecked preferences for accessibility features that improve experience, opt-out vs opt-in choices. Test prompt: Evaluate conversion and satisfaction when a helpful default is applied vs manual selection.</p>

              <h2>Friction Reduction</h2>
              <p>Essence: Remove unnecessary steps and make critical actions easier. Why it works: Every interaction adds cognitive and time cost — reducing friction increases action likelihood.</p>
              <p>Examples: Autofill from browser, single-click purchases, or progressive disclosure of complexity. Test prompt: Remove a non-essential field from signup and measure completion rate and quality of signups.</p>

              <h3>Scarcity & Urgency (Used Carefully)</h3>
              <p>Essence: Communicate limited availability or time-bound offers to create actionable urgency. Why it works: Scarcity triggers a perceived loss aversion and prioritization.</p>
              <p>Examples: Limited seats, low stock indicators, deadline-based discounts. Ethical note: Ensure claims are truthful and avoid manufactured urgency. Test prompt: Trial real, time-limited offers vs evergreen pricing and measure conversion uplift and cancellation rates.</p>

              <h3>Progress & Milestones</h3>
              <p>Essence: Show progress and celebrate micro-wins to motivate continued action. Why it works: Progress indicators provide feedback loops and maintain motivation through visible progress.</p>
              <p>Examples: Onboarding progress bars, streaks in habit apps. Test prompt: Add a progress bar to onboarding flows and evaluate churn at key steps.</p>

              <h3>Microcopy & Framing</h3>
              <p>Essence: Use precise words and framing that reduce anxiety and clarify value. Why it works: The words you use shape expectations and reduce friction by clarifying intentions.</p>
              <p>Examples: Rewriting "Create account" to "Create free account — no credit card" to reduce perceived risk. Test prompt: Run microcopy variants on CTAs and measure click-through and downstream conversion.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases & Practical Applications</h2>

              <h2>Onboarding Optimization</h2>
              <p>Use the deck to identify low-risk patterns that reduce drop-off: show social proof early, add a progress indicator, and ask for one micro-commitment to increase completion rates.</p>

              <h3>Checkout & Pricing</h3>
              <p>Test default selections for popular plans, provide clear microcopy about refunds, and use scarcity only when it is factual. Combine price anchoring with clear comparisons to help users choose quickly.</p>

              <h3>Retention & Habit Formation</h3>
              <p>Leverage commitment devices, streaks, and reminders tied to personal goals. Use small, frequent milestones and celebrate progress to sustain engagement.</p>

              <h3>User Research & Ideation</h3>
              <p>Use the deck during research synthesis to map observed behavior to potential interventions. The cards act as hypothesis prompts for rapid prototyping and testing.</p>
            </section>

            <section id="workshops">
              <h2>Workshops & Team Exercises</h2>

              <p>The card deck is especially effective in collaborative settings. Here are a few workshop recipes to get practical outcomes in a short time.</p>

              <h2>30-Minute Pattern Storm</h2>
              <ol>
                <li>Pick a single user problem (e.g., signup drop-off).</li>
                <li>Shuffle the deck and draw 8–12 cards quickly.</li>
                <li>Each team member selects two cards they believe could address the problem and explains why.</li>
                <li>Vote on the top two patterns and draft quick experiments.</li>
              </ol>

              <h3>Mapping Patterns to Journey</h3>
              <ol>
                <li>Create a simple journey map with key touchpoints.</li>
                <li>Place candidate patterns at each touchpoint to visualize potential interventions.</li>
                <li>Prioritize based on expected impact and implementation cost.</li>
              </ol>

              <h3>Ethical Check-in Sprint</h3>
              <ol>
                <li>For chosen patterns, use the ethical notes on cards to discuss potential harm or user confusion.</li>
                <li>Define guardrails (consent, transparency, undo paths) and add them to experiment designs.</li>
                <li>Document outcomes and share learnings across teams.</li>
              </ol>
            </section>

            <section id="measurement">
              <h2>Measuring Impact: Hypotheses & Metrics</h2>

              <p>Every persuasive pattern should be treated as a hypothesis. A measured approach includes:</p>
              <ul>
                <li><strong>Clear hypothesis:</strong> Define the expected behavior change and the metric you will use to test it.</li>
                <li><strong>Primary metric:</strong> A single, clear KPI such as signup completion, retention, or revenue per user.</li>
                <li><strong>Guardrail metrics:</strong> Monitor metrics that indicate harm or confusion (support tickets, cancellations, time-to-first-value).</li>
                <li><strong>Statistical rigor:</strong> Run tests with sufficient sample sizes and avoid p-hacking by predefining success criteria.</li>
                <li><strong>Qualitative follow-up:</strong> Use short interviews or session recordings to understand why the pattern did or didn’t work.</li>
              </ul>

              <p>This balanced approach ensures that persuasive design is both effective and user-centered.</p>
            </section>

            <section id="ethics">
              <h2>Ethics & Avoiding Dark Patterns</h2>

              <p>Persuasive design carries responsibility. The card deck includes ethical notes for each pattern and encourages teams to adopt the following guardrails:</p>
              <ul>
                <li><strong>Intent check:</strong> Is this pattern helping the user achieve a goal or primarily serving short-term business metrics?</li>
                <li><strong>Transparency:</strong> Be clear about costs, data use, and any limits of an offer.</li>
                <li><strong>Choice preservation:</strong> Allow users to opt out or undo decisions easily.</li>
                <li><strong>Data minimization:</strong> Collect only what you need to deliver value or personalization.</li>
                <li><strong>Inclusive design:</strong> Consider accessibility and cultural differences when applying patterns globally.</li>
              </ul>

              <p>Teams should document ethical decisions alongside experiments and include stakeholders from legal, research, and customer success when necessary.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Examples</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>SaaS Onboarding — Faster Activation</CardTitle>
                </CardHeader>
                <CardContent>
                  "A SaaS product used the deck to identify micro-commitments and progress indicators that reduced time-to-activation by 23%. By pairing social proof and a clearer milestone UI, new users reached core value faster." — Growth Lead
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>eCommerce Checkout — Reduced Cart Abandonment</CardTitle>
                </CardHeader>
                <CardContent>
                  "Applying friction reduction and clear microcopy around returns boosted checkout completion. Honest scarcity (limited stock) aligned with real inventory and increased conversions without backlash." — Product Manager
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Publishing Platform — Increased Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  "A publisher used pattern mapping to test pricing frames and defaults. The result was a clearer path to subscription and a higher lifetime value among trial converters." — Head of Revenue
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>What Practitioners Say</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"The card deck turned our design critiques into concrete experiment ideas. It’s a great shorthand for cross-functional teams." — UX Lead</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"I use a card during user research synthesis to map interventions to observed friction points — it’s a game-changer for prioritization." — Researcher</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"As a product manager, the test prompts save time when building experiments and writing hypotheses." — Product Manager</blockquote>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Who should buy the Persuasive Patterns Card Deck?</summary><p className="mt-2">Teams of designers, product managers, marketing professionals, and researchers who want a practical resource to generate and test behaviorally-informed interventions.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is the deck research-backed?</summary><p className="mt-2">Yes — patterns are distilled from academic and applied research in psychology, behavioral economics, and HCI, and include references or rationale to guide practitioners.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can the patterns be misused?</summary><p className="mt-2">Any persuasive technique can be misused. The deck emphasizes ethical use, and each card includes an ethical note and testing prompts to reduce harm.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Promote Your Product & Workshops</h2>
              <p>If you sell workshops, run consulting, or publish case studies using the Persuasive Patterns Card Deck, discoverability matters. Backlink ∞ helps authors, agencies, and creators build targeted backlinks and SEO strategies that drive organic traffic to product pages, event listings, and resource libraries.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">The Persuasive Patterns Card Deck is a practical bridge between behavioral science and product practice. Use it to generate testable hypotheses, align cross-functional teams, and run focused experiments that respect users and advance product goals. When paired with good measurement and ethical guardrails, persuasive design becomes a responsible tool for creating value.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
