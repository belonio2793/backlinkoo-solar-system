import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
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

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  } else {
    el.textContent = text;
  }
}

export default function Mittalmar() {
  useEffect(() => {
    const title = 'Mittalmar YouTube Software: Data-Driven Niche Discovery & Channel Growth';
    const description = 'Mittalmar is the intelligent YouTube software ecosystem for data-driven niche discovery, viral format identification, and competitive intelligence. Cut research time by 90%, track trending channels, and grow faster with actionable insights.';
    
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('theme-color', '#1f2937');
    
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/mittalmar');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    
    upsertCanonical('https://backlinkoo.com/mittalmar');
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Mittalmar YouTube Software',
      applicationCategory: 'ContentCreationApplication',
      description: 'Data-driven YouTube software ecosystem for niche discovery, viral format identification, and channel growth',
      url: 'https://backlinkoo.com/mittalmar',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '19.99',
        pricingPattern: 'https://schema.org/PriceSpecification',
        priceValidUntil: '2025-12-31'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '3200'
      }
    };
    
    injectJSONLD('schema-app', schemaData);

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header variant="translucent" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight">
            Cut YouTube Research Time by 90% with Data-Driven Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Mittalmar is the most intelligent YouTube software ecosystem for niche discovery, viral format identification, and competitive intelligence. Turn data-driven insights into explosive channel growth with living dashboards that track 5,000+ videos in real time.
          </p>
          <div className="inline-flex items-center gap-4">
            <span className="text-gray-400">Trusted by 3,200+ content creators</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
          </div>
        </section>

        {/* What is Mittalmar Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-6 text-white">What is Mittalmar YouTube Software?</h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Mittalmar represents a fundamental shift in how YouTube creators approach channel growth. Rather than spending countless hours manually researching YouTube trends, analyzing competitor channels, and guessing which content formats will resonate, Mittalmar provides a comprehensive data-driven ecosystem that automates niche discovery and surfaces actionable insights instantly.
          </p>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            The platform consolidates niche research, viral format identification, competitor intelligence, content planning, and performance tracking into a unified dashboard. Creators access real-time data on emerging YouTube opportunities, proven video formats, trending topics, and competitive landscapes—all without the days of manual research that traditionally precedes successful channel launches or pivot strategies.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Mittalmar's core philosophy is straightforward: YouTube success flows from understanding which niches are growing, which formats drive engagement, which competitors are gaining traction, and where the whitespace opportunities exist. By automating the discovery of these insights through data analysis of 5,000+ videos, Mittalmar empowers creators to make strategic decisions backed by real performance data rather than gut feelings or trend chasing.
          </p>
        </section>

        {/* Core Problems It Solves */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">The YouTube Creation Challenges Mittalmar Solves</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Endless Manual Niche Research</h3>
              <p className="text-gray-300 leading-relaxed">
                Traditional niche research involves spending 20-40 hours browsing YouTube, reading channel descriptions, analyzing comment sections, and guessing which niches might be viable. Mittalmar eliminates this research bottleneck by automatically identifying hidden niches and emerging opportunities within seconds. The platform analyzes massive datasets of YouTube channels and videos to surface niches that are exploding in growth but haven't yet saturated with competition.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Missed Viral Format Opportunities</h3>
              <p className="text-gray-300 leading-relaxed">
                Viral video formats change constantly. By the time creators identify what's working, the format has often become oversaturated. Mittalmar's real-time analysis identifies viral formats and trending topics before they reach saturation. Living dashboards update continuously to show which video structures, thumbnail styles, and content approaches are currently driving the highest engagement and growth.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Blind Competitive Landscape</h3>
              <p className="text-gray-300 leading-relaxed">
                Most creators have no systematic way to track competitor channel growth or understand what strategies successful competitors are using. Mittalmar provides day-by-day competitive tracking showing which channels are growing fastest, what content they're producing, which formats they're using, and what audiences they're building. This intelligence transforms strategy from guesswork into informed decision-making.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Fragmented Research Workflow</h3>
              <p className="text-gray-300 leading-relaxed">
                Content creators traditionally use multiple tools: YouTube's native analytics, spreadsheets for tracking ideas, Google Docs for planning, separate research notes, and email for collaboration. This fragmentation makes it impossible to maintain a coherent strategy or quickly iterate based on market shifts. Mittalmar consolidates everything into a unified ecosystem where research, planning, and tracking happen in one integrated platform.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Outdated Market Intelligence</h3>
              <p className="text-gray-300 leading-relaxed">
                YouTube markets move quickly. What's trending today may be saturated in a week. Most research tools provide static snapshots or weekly updates. Mittalmar's living dashboards update in real time, ensuring creators always have current intelligence on market conditions. This enables fast pivots when opportunities emerge and helps creators stay ahead of saturation.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Scaling Without Consistency</h3>
              <p className="text-gray-300 leading-relaxed">
                As creators produce more content or teams grow larger, maintaining strategic consistency becomes difficult. Different team members make different decisions about content direction. Mittalmar's living databases and shared insights enable consistent strategy across all content, helping teams stay aligned on niche focus, format choices, and competitive positioning regardless of size.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Powerful Features That Drive Growth</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Living Niche Dashboards with 5,000+ Video Data</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Mittalmar's core intelligence engine analyzes 5,000+ videos continuously, tracking which niches are growing, which topics are trending, and where white space opportunities exist. Unlike static research, living dashboards update automatically as new data flows in. Creators see real-time signals about emerging opportunities before broader audience awareness shifts the competitive landscape.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Real-time niche discovery powered by 5,000+ video analysis</li>
                <li>Automatic identification of high-growth emerging niches</li>
                <li>Living dashboards that update continuously with fresh data</li>
                <li>Visual outlier detection highlighting trending opportunities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Viral Format Identification and Trend Analysis</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The algorithm identifies which video formats are currently driving the highest engagement, which thumbnail styles convert best, and which content structures resonate most with audiences. Rather than creators guessing about format, they leverage data on what's actually working right now. This intelligence adapts daily as viral trends shift, enabling creators to stay ahead of format saturation.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Identify viral video formats before they saturate</li>
                <li>Thumbnail style analysis showing what drives clicks</li>
                <li>Content structure insights showing what engages audiences</li>
                <li>Trend trajectory analysis predicting format saturation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Day-by-Day Competitor Intelligence</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Track competitors continuously to understand their growth trajectories and strategies. See which channels are accelerating, what content they're producing, which formats they're using, and how their audiences are responding. This competitive intelligence transforms channel strategy from reactive to proactive, enabling creators to anticipate shifts and adjust their approach before competitors become threats.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Daily competitor channel growth tracking</li>
                <li>Content analysis showing what competitors are producing</li>
                <li>Subscriber and engagement trend comparison</li>
                <li>Strategic pattern identification across competitor portfolios</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Video Collections and Content Curation</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Organize research into visual collections, grouping videos by topic, format, thumbnail style, or any other criteria. This curation system creates inspiration boards that guide content creation. Instead of scattered notes across multiple tools, collections provide organized visual reference for thumbnails, titles, formats, and strategies that creators want to emulate or adapt.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Create visual collections of inspiring videos</li>
                <li>Organize by format, niche, thumbnail style, or topic</li>
                <li>Share collections with team members</li>
                <li>Use as reference during content planning and production</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Niche Database Building and Organization</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Build a living database of potential niches, organized with growth metrics, competition levels, and opportunity scores. As you explore niches, the database learns and organizes information, creating a searchable repository of niche opportunities. This approach transforms research from ad-hoc exploration into systematic niche evaluation and comparative analysis.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Searchable niche database organized by opportunity</li>
                <li>Growth metrics and competition scoring per niche</li>
                <li>Automatic niche validation using live data</li>
                <li>Comparative analysis across potential niche opportunities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Browser Extension for YouTube Integration</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The YouTube Market Research Helper browser extension brings Mittalmar insights directly into the YouTube interface. As creators browse YouTube's homepage, the extension highlights outlier videos and trending content, making it easy to identify viral signals without leaving YouTube. This integration keeps research frictionless and continuous throughout creators' regular YouTube browsing.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Browser extension integrates directly with YouTube</li>
                <li>Real-time outlier identification on YouTube homepage</li>
                <li>Quick research without leaving YouTube interface</li>
                <li>Seamless data capture during regular YouTube browsing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">How Mittalmar Powers Channel Growth</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Access Living Niche Intelligence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Sign up for Mittalmar and immediately access living dashboards showing real-time niche data. Explore 5,000+ videos of data to identify emerging opportunities and hidden niches. The platform surfaces high-growth niches with lower competition, highlighting exactly where the whitespace opportunities exist for new channels or strategic pivots.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Study Viral Formats and Competitor Strategies</h3>
                <p className="text-gray-300 leading-relaxed">
                  Use Mittalmar's viral format analysis to understand which content structures, thumbnail styles, and topic approaches are currently driving engagement. Analyze competitor channels day-by-day to understand their growth strategies. Build video collections of inspiring content that demonstrates proven success in your target niche.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Plan Content with Data-Driven Confidence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Create your content strategy grounded in real data about what works in your chosen niche. Plan videos using proven formats, titles, and thumbnail approaches identified through Mittalmar's analysis. Know exactly what audience expectations are before you create, eliminating guesswork from your content production pipeline.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Monitor Market Shifts in Real Time</h3>
                <p className="text-gray-300 leading-relaxed">
                  Living dashboards continue providing intelligence as markets evolve. Watch for format saturation before it hits mainstream. Receive alerts when competitors accelerate or when new opportunities emerge. Adjust your strategy as real-time data reveals emerging trends or shifting audience preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">5</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Scale with Team Alignment</h3>
                <p className="text-gray-300 leading-relaxed">
                  Share insights, collections, and niche databases with team members. Everyone operates from the same data foundation, ensuring consistent strategy across all content produced. Team plans enable collaboration while maintaining unified decision-making grounded in real market intelligence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Who Wins with Mittalmar</h2>
          
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">New YouTube Creators Planning Their First Channel</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              New creators face a critical decision: which niche should I target? Mittalmar removes guesswork from this decision by analyzing real data about niche growth, competition, and opportunity. Rather than launching a channel in a saturated niche, new creators identify emerging opportunities with genuine growth potential. The free niche guide combined with data-driven insights helps new creators avoid months of wasted effort in the wrong niche.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The platform accelerates the learning curve for new creators by providing immediate exposure to proven formats and successful competitor strategies. Instead of spending months studying YouTube, new creators understand what works in their niche within days.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Established Creators Planning Strategic Pivots</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Mature creators often need to pivot into new niches or diversify their content portfolio. Mittalmar's competitor tracking and viral format analysis help established creators understand new niche dynamics quickly. Rather than spending weeks researching unfamiliar territories, they leverage data to make informed decisions about pivot direction and content approach.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Living dashboards help established creators recognize when their current niche is saturating before growth stalls. This enables proactive diversification rather than reactive channel revival after audience growth stops.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">YouTube Teams Managing Multiple Channels</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Teams managing multiple YouTube channels benefit enormously from Mittalmar's unified intelligence platform. Different team members access the same niche data, viral format insights, and competitor tracking, ensuring consistent strategy across all channels. Video collections and niche databases enable knowledge sharing within teams, preventing siloed insights and duplicated research.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Team plans with onboarding support make it easy to get entire production teams aligned on strategy and data-driven decision-making. This coordination enables scaling content production without losing strategic coherence.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Content Agencies Serving Multiple Clients</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Agencies managing YouTube channels for multiple clients use Mittalmar to quickly understand each client's niche landscape and competitive positioning. Rather than conducting weeks of research for each new client engagement, agencies instantly access data on client niches, identify growth opportunities, and understand competitive threats.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This capability enables agencies to provide higher-value strategic consulting while reducing research hours per client. Team features allow different account managers to work on different client niches while maintaining coherent client strategies.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Data-Driven Creators Optimizing Every Decision</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Creators who obsess over optimization use Mittalmar to make every content decision grounded in data. Rather than guessing about thumbnail styles, video length, or topic approach, they research exactly what works in their specific niche. This data-driven optimization approach dramatically improves content performance and viewer engagement.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The browser extension keeps research continuous throughout their YouTube browsing, enabling constant learning about market shifts and emerging format innovations. This sustained data gathering translates directly into optimized content strategy over time.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Creator Success Stories with Mittalmar</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Mittalmar saved me months of research. I found my niche in three days using the living dashboards, validated it with competitor data, and launched with full confidence. My first 100 videos got 50K subscribers because I understood exactly what my audience wanted."
              </p>
              <p className="text-white font-bold">Footy Heaven</p>
              <p className="text-gray-400 text-sm">Sports Content Creator, 500K+ subscribers</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The viral format identification is incredible. I was making videos with a format getting zero traction. Mittalmar showed me what format was actually trending in my niche. Changed my approach, and my next video got 10x more views."
              </p>
              <p className="text-white font-bold">Lore Of The Rings</p>
              <p className="text-gray-400 text-sm">Entertainment Analyst, 800K+ subscribers</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Competitor tracking changed my strategy completely. I saw which competitors were accelerating and understood exactly what they were doing differently. Borrowed their best practices, adapted them to my style, and now I'm growing faster than channels that were ahead of me."
              </p>
              <p className="text-white font-bold">LaJuan</p>
              <p className="text-gray-400 text-sm">Lifestyle Creator, 350K+ subscribers</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Managing a team producing 20 videos per week, Mittalmar keeps us all aligned on strategy. Everyone sees the same niche data, viral formats, and competitor intel. Consistency across all content is now our competitive advantage."
              </p>
              <p className="text-white font-bold">Derrick</p>
              <p className="text-gray-400 text-sm">Agency Director, 2M+ total subscribers across 15 channels</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The video collections feature is perfect for organizing inspiration. I group by thumbnail style, video length, hook approach—everything I care about. Creating content with data-backed design decisions improved my click-through rate by 40%."
              </p>
              <p className="text-white font-bold">Belinda</p>
              <p className="text-gray-400 text-sm">Educational Content Creator, 650K+ subscribers</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "I've tried every YouTube research tool out there. Mittalmar is the only one that gives me real data instead of guesses. The living dashboards mean I'm never surprised by market shifts. I'm always three months ahead of trends."
              </p>
              <p className="text-white font-bold">Marcus Chen</p>
              <p className="text-gray-400 text-sm">Tech Reviewer, 1.2M+ subscribers</p>
            </div>
          </div>
        </section>

        {/* Business Impact Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Measurable Results From Data-Driven Strategy</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">90% Reduction in Research Time</h3>
              <p className="text-gray-300 leading-relaxed">
                Instead of 30-40 hours of manual niche research, creators identify opportunities in 3-4 hours. This research acceleration means faster channel launches, quicker pivots when strategy adjustments are needed, and more time spent on actual content creation rather than research.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">3-5x Higher First-Month Performance</h3>
              <p className="text-gray-300 leading-relaxed">
                Channels launched with data-driven niche selection and proven format templates outperform channels launched with guesses. Creators report 3-5x higher view counts, better subscriber conversion, and faster path to monetization when decisions are grounded in Mittalmar data.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">40% Higher Engagement Rates</h3>
              <p className="text-gray-300 leading-relaxed">
                When creators optimize every element—thumbnail style, video format, topic approach, hook style—engagement improves significantly. Creators report 40% higher engagement rates on average when using format and audience insights from Mittalmar during content planning and production.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">Faster Monetization Path</h3>
              <p className="text-gray-300 leading-relaxed">
                Channels reaching 1,000 subscribers and 4,000 watch hours for monetization typically achieve these milestones 3-4 months faster when using data-driven strategy. This translates to faster entry into YouTube Partner Program and quicker path to meaningful revenue from channel growth.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20 bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900 rounded-lg p-12 border border-blue-700">
          <h2 className="text-4xl font-bold mb-6 text-white text-center">Affordable Plans for Every Creator</h2>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto mb-12">
            Start free for 7 days with full access. Cancel anytime with no obligations. Upgrade when you're ready to scale.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-2xl font-bold text-white mb-2">Starter</p>
              <p className="text-4xl font-bold text-white mb-2">$19.99</p>
              <p className="text-gray-400 text-sm mb-8">per month</p>
              <ul className="text-left space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Niche discovery</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Video collections</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Live tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Up to 25 competitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Browser extension</span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm">Perfect for new creators</p>
            </div>

            <div className="bg-blue-600 rounded-lg p-8 text-center border-2 border-blue-400 transform scale-105">
              <div className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 w-fit mx-auto">MOST POPULAR</div>
              <p className="text-2xl font-bold text-white mb-2">Professional</p>
              <p className="text-4xl font-bold text-white mb-2">$69.69</p>
              <p className="text-gray-200 text-sm mb-8">per month</p>
              <ul className="text-left space-y-3 text-gray-100 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-white">✓</span>
                  <span>All Starter features</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white">✓</span>
                  <span>20 big databases</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white">✓</span>
                  <span>100 auto-searches</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white">✓</span>
                  <span>Up to 100 competitors</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white">✓</span>
                  <span>Onboarding & support</span>
                </li>
              </ul>
              <p className="text-gray-200 text-sm">For serious creators</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-2xl font-bold text-white mb-2">Team</p>
              <p className="text-3xl font-bold text-white mb-2">Custom</p>
              <p className="text-gray-400 text-sm mb-8">pricing</p>
              <ul className="text-left space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>All Professional features</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Team for up to 5 members</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited usage</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited power</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm">For growing teams</p>
            </div>
          </div>

          <p className="text-center text-gray-300 mt-12">
            Start with the free 7-day trial. No credit card required. Cancel anytime.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Common Questions About Mittalmar</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How does Mittalmar stay current with YouTube trends?</h3>
              <p className="text-gray-300 leading-relaxed">
                Mittalmar continuously analyzes 5,000+ videos across YouTube, tracking which videos are going viral, which formats are trending, and how audience preferences shift. Living dashboards update in real time with fresh data, ensuring creators always have current intelligence rather than stale research. The algorithm learns from new viral signals constantly, adapting to emerging formats and topics.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Can I use Mittalmar for multiple YouTube channels?</h3>
              <p className="text-gray-300 leading-relaxed">
                Absolutely. Team plans enable managing multiple channels with shared insights. All channels access the same niche data, viral format intelligence, and competitor tracking, ensuring consistent strategy. Team members can collaborate on shared video collections and niche databases, enabling knowledge sharing across all channels managed under one account.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How accurate is the competitor tracking?</h3>
              <p className="text-gray-300 leading-relaxed">
                Competitor tracking updates daily with YouTube's official subscriber counts, view counts, and upload activity. The platform shows real growth trajectories and content patterns, enabling accurate competitive analysis. Track up to 25 competitors (Starter), 100 competitors (Professional), or unlimited (Team), depending on your plan.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">What's the difference between Starter and Professional plans?</h3>
              <p className="text-gray-300 leading-relaxed">
                Starter includes essential features (niche discovery, video collections, up to 25 competitors) ideal for new creators. Professional adds significantly more power: 20 big databases, 100 auto-searches, up to 100 competitors, onboarding support, and Studio features. Professional is for serious creators optimizing every decision. Team plans add organizational features for 5+ person teams.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Is there really a free trial without credit card?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Mittalmar offers a completely free 7-day trial with full feature access. You explore all capabilities—niche discovery, video collections, competitor tracking—without providing credit card information. Cancel anytime with zero obligations. This risk-free trial lets you evaluate whether Mittalmar works for your YouTube strategy before committing financially.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Can I export my research or data?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Your niche databases, video collections, and research insights can be exported and shared with team members. This enables collaboration and ensures your research remains yours. Team members can access shared collections and databases, enabling distributed content planning while maintaining unified strategy.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Mittalmar */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Why Data-Driven Creators Choose Mittalmar</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Living Intelligence, Not Static Research</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Most YouTube research tools provide snapshots—data from a few weeks ago. By the time creators make decisions, markets have shifted. Mittalmar's living dashboards update continuously, ensuring creators operate on current intelligence. This real-time advantage is particularly valuable in fast-moving YouTube markets where viral trends peak and decline quickly.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Living intelligence enables creators to spot opportunities before they're obvious and recognize saturation before growth stalls. This forward-looking capability translates directly into faster growth and less wasted effort on declining opportunities.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Integrated Ecosystem vs. Scattered Tools</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Traditional YouTube creators use 5-10 different tools: YouTube Analytics for performance, spreadsheets for ideas, Google Drive for planning, email for communication. This fragmentation makes strategy coherent and research takes forever. Mittalmar consolidates everything: research, competitive analysis, content planning, collaboration—all in one integrated platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This integration doesn't just save tool switching time—it enables holistic strategy grounded in unified data rather than fragmented insights from multiple sources.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Browser Extension Keeps Research Frictionless</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Most creators spend time on YouTube anyway. Rather than context-switching to separate research tools, Mittalmar's browser extension brings research directly into the YouTube interface. Viral signals are highlighted automatically as creators browse, making research a natural byproduct of regular YouTube viewing rather than a separate activity requiring dedicated time.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This frictionless research approach dramatically increases how frequently creators update their market understanding, enabling faster recognition of emerging trends and format changes.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Visual Collections Accelerate Content Planning</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Creating content guides from scattered notes is tedious. Mittalmar's video collections enable visual curation of inspiring content organized by format, thumbnail style, or topic. This visual approach makes planning faster and enables team members to understand proven approaches at a glance rather than reading lengthy notes.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Collections transform research from documentation into visual inspiration boards that guide production teams through execution.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Affordable Without Compromising Quality</h3>
              <p className="text-gray-300 leading-relaxed">
                Many YouTube research tools cost $100+ monthly, limiting access to well-funded creators. Mittalmar's $19.99 starter plan makes data-driven research accessible to emerging creators. Even the $69.69 Professional plan is affordable compared to alternatives, democratizing access to research tools that were previously only available to large agencies.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This affordability means new creators can make strategic, data-driven decisions from launch rather than relying on guesses until they've grown large enough to afford premium tools.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-16 text-center border border-blue-500">
          <h2 className="text-4xl font-bold text-white mb-6">Start Growing With Data Today</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Top YouTube creators use Mittalmar to make every content decision grounded in real data. Join thousands of creators cutting research time by 90%, launching in the right niche, and growing faster than ever before.
          </p>
          <p className="text-lg text-blue-100 mb-12">
            Seven-day free trial. No credit card. Cancel anytime.
          </p>
          
          <a 
            href="https://backlinkoo.com/register" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg"
          >
            Register for Backlink ∞ to Buy Backlinks & Get Traffic
          </a>
          
          <p className="text-blue-100 mt-8 text-sm">
            Mittalmar is data-driven YouTube intelligence for channel growth. Register to access all backlink building tools and resources for scaling your online presence through SEO and content strategy.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
