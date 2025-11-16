import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Map, MapPin, Phone, Globe, Users, TrendingUp, Star, Zap, Building2, BarChart3, Briefcase } from 'lucide-react';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';

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
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

function useProgress(selector: string) {
  React.useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.scrape-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector(selector) as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [selector]);
}

const metaTitle = 'Local SEO Services 2025: Complete Guide to Local Search Ranking';
const metaDescription = 'Comprehensive guide to local SEO services covering Google Business Profile, local citations, reviews, local link building, and proven strategies to dominate local search rankings.';

export default function LocalSEOServices() {
  useProgress('#local-seo-content');

  const canonical = React.useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/local-seo-services`;
    } catch {
      return '/local-seo-services';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'local SEO services, Google Business Profile, local citations, local search ranking, local link building, review management, local SEO agency');
    upsertCanonical(canonical);

    injectJSONLD('local-seo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('local-seo-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Local SEO Services Guide', item: '/local-seo-services' },
      ],
    });

    injectJSONLD('local-seo-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What are local SEO services?', acceptedAnswer: { '@type': 'Answer', text: 'Local SEO services optimize a business website and online presence to rank in local search results and Google Maps for location-based keywords.' } },
        { '@type': 'Question', name: 'How long does local SEO take?', acceptedAnswer: { '@type': 'Answer', text: 'Most businesses see measurable results within 3-6 months, with significant improvements by 6-12 months. Results vary based on competition and starting point.' } },
        { '@type': 'Question', name: 'What is the most important local SEO factor?', acceptedAnswer: { '@type': 'Answer', text: 'Google Business Profile optimization is the single most important factor, followed by local citations, customer reviews, and website relevance.' } },
      ],
    });
  }, [canonical]);

  const nav = [
    { id: 'intro', label: 'Overview' },
    { id: 'what-is', label: 'What Is Local SEO' },
    { id: 'google-business', label: 'Google Business Profile' },
    { id: 'citations', label: 'Local Citations' },
    { id: 'reviews', label: 'Review Management' },
    { id: 'local-keywords', label: 'Local Keywords' },
    { id: 'link-building', label: 'Local Link Building' },
    { id: 'technical', label: 'Technical Local SEO' },
    { id: 'content', label: 'Local Content' },
    { id: 'map-pack', label: 'Map Pack Strategy' },
    { id: 'schema', label: 'Schema Markup' },
    { id: 'tools', label: 'Tools & Resources' },
    { id: 'strategy', label: 'Strategy Framework' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Get Help' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <div className="scrape-progress" aria-hidden="true"><div className="scrape-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="scrape-hero" aria-labelledby="page-title">
          <p className="scrape-kicker">Business Growth</p>
          <h1 id="page-title" className="scrape-title">Local SEO Services</h1>
          <p className="scrape-subtitle">The complete guide to mastering local search. Learn proven strategies to dominate Google Maps, local search results, and capture high-intent local customers searching for your services.</p>
          <div className="scrape-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Local SEO Experts</span>
            <span>Read time: 55+ minutes</span>
          </div>
          <div className="scrape-hero__cta">
            <Button asChild size="lg" variant="primaryGradient" className="rounded-full">
              <a href="#map-pack">View Strategy</a>
            </Button>
            <Button variant="softOutline" asChild size="lg" className="rounded-full">
              <a href="#faq">Learn More</a>
            </Button>
            <Badge className="ml-3" variant="secondary">2025 Edition</Badge>
          </div>
        </header>

        <div className="scrape-layout">
          <nav className="scrape-toc" aria-label="On this page">
            <div className="scrape-toc__title">On this page</div>
            <ul>
              {nav.map((n) => (<li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>))}
            </ul>
          </nav>

          <article id="local-seo-content" className="scrape-article prose prose-slate max-w-none" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            <section id="intro" className="scrape-section">
              <h2>Local SEO Services: Dominate Your Geographic Market</h2>
              <p>Local SEO services are strategic marketing solutions designed to increase your business's visibility in local search results, Google Maps, and directory listings. Unlike traditional SEO that targets broad, national keywords, local SEO optimizes your online presence for location-based searches—the exact moment potential customers in your area are looking for your services.</p>
              <p>With 46% of Google searches having local intent, local SEO has become critical for businesses serving specific geographic areas. Whether you operate a dental practice in Denver, a plumbing service in Austin, or a restaurant in Miami, local SEO services help you capture high-intent customers actively searching for what you offer in your location.</p>
              <p>This comprehensive guide covers everything from Google Business Profile optimization to local link building, citation management, review strategy, and proven tactics to rank in the coveted Google Maps "Map Pack"—the three local results that appear at the top of location-based searches.</p>
            </section>

            <section id="what-is" className="scrape-section">
              <h2>What Are Local SEO Services?</h2>
              <p>Local SEO services encompass a suite of strategies and tactics designed to improve your business's online visibility within a specific geographic area. This includes optimizing your website, online listings, and digital reputation to rank prominently in:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Google Maps:</strong> The local "Map Pack" showing 3 businesses with their location, reviews, and contact info</li>
                <li><strong>Google Local 3-Pack:</strong> Featured local results appearing at the top of search results for "[service] near me" queries</li>
                <li><strong>Organic Local Results:</strong> Traditional organic search results with a local emphasis</li>
                <li><strong>Directory Listings:</strong> Your business information across Yelp, Apple Maps, Waze, and industry-specific directories</li>
                <li><strong>Review Sites:</strong> Google Reviews, Trustpilot, industry ratings platforms where customers discover and evaluate you</li>
              </ul>

              <h3 className="mt-6 font-semibold">The Local Search Funnel</h3>
              <p className="mt-2 text-sm">Understand how customers find local businesses:</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Awareness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>Customer searches "[service] near me" or "[service] in [city]"</p>
                    <p className="text-gray-600">Found through Google Maps, local results</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>Clicks your Google Business Profile or website</p>
                    <p className="text-gray-600">Reviews influence decision</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>Reads reviews, checks hours, views services</p>
                    <p className="text-gray-600">Calls or requests appointment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Conversion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <p>Visits your location or books service</p>
                    <p className="text-gray-600">Becomes paying customer</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="google-business" className="scrape-section">
              <h2>Google Business Profile: The Foundation of Local SEO</h2>
              <p>Your Google Business Profile (GBP) is the single most important asset in local SEO. It's the information that appears in Google Maps, local results, and the Knowledge Panel when customers search your business name. Google heavily weights GBP signals when ranking local results.</p>

              <h3 className="mt-6 font-semibold">Complete GBP Optimization Checklist</h3>
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Claim or verify your GBP profile</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Accurate business name (match all listings exactly)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Complete physical address (no PO boxes for location-based)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Verified phone number (primary contact)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Website URL pointing to homepage</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Business category (primary + up to 9 secondary)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Accurate business hours with holiday hours</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-600" />
                      Visual Content & Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> High-quality logo (clear, professional)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Business cover photo (compelling visual)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> 10+ interior and exterior photos</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Regular fresh content and posts (2-4 per month)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Service or product photos when applicable</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Team member photos (adds trust and personality)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Respond to all reviews (positive and negative)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-indigo-600" />
                      Description & Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Compelling business description (750 characters, location keywords)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Relevant business attributes (wheelchair accessible, online booking, etc.)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Service areas listed (if applicable)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Appointment availability and booking options</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Payment methods accepted</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Products or services offered with descriptions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Google Posts and Q&A Management</h3>
              <p className="mt-2 text-sm">Google Posts allow you to share updates directly in your GBP listing. Q&A enables customers to ask questions with you providing direct answers. Both drive engagement and improve visibility:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong>Google Posts:</strong> 2-4 per month announcing events, promotions, new services, or company updates</li>
                <li><strong>Q&A Management:</strong> Proactively answer questions about hours, services, pricing, policies</li>
                <li><strong>Content Freshness:</strong> Google prioritizes active, updated GBP profiles in rankings</li>
              </ul>
            </section>

            <section id="citations" className="scrape-section">
              <h2>Local Citations: Building Business Directories Footprint</h2>
              <p>A local citation is any mention of your business name, address, and phone number (NAP) on the internet. Citations help local search engines verify your business legitimacy and location. Consistent, accurate citations across directories significantly impact local rankings.</p>

              <h3 className="mt-6 font-semibold">Citation Building Strategy</h3>
              <Tabs defaultValue="major" className="mt-4">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="major">Major Directories</TabsTrigger>
                  <TabsTrigger value="local">Local Directories</TabsTrigger>
                  <TabsTrigger value="industry">Industry Specific</TabsTrigger>
                </TabsList>
                <TabsContent value="major" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">Tier 1 (Essential):</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong><a href="https://www.yelp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yelp</a></strong> - Dominant local business directory, high ranking weight</li>
                      <li><strong><a href="https://www.apple.com/maps/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apple Maps</a></strong> - Critical for iOS users, growing search volume</li>
                      <li><strong><a href="https://www.waze.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Waze</a></strong> - Preferred navigation app for local discovery</li>
                      <li><strong><a href="https://www.manta.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Manta</a></strong> - Business directory with strong local authority</li>
                      <li><strong><a href="https://www.mapquest.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MapQuest</a></strong> - Established local search platform</li>
                    </ul>
                    <p className="font-semibold mt-3">Tier 2 (Important):</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong><a href="https://www.bing.com/maps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bing Maps</a></strong> - Bing's local search alternative</li>
                      <li><strong><a href="https://www.duckduckgo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DuckDuckGo Maps</a></strong> - Privacy-focused search engine</li>
                      <li><strong><a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Trustpilot</a></strong> - Review platform with local discovery</li>
                      <li><strong>BBB (Better Business Bureau)</strong> - Trust signal, especially for service businesses</li>
                      <li><strong><a href="https://www.yellowpages.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yellow Pages</a></strong> - Long-established business directory</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="local" className="mt-4">
                  <p className="text-sm mb-3">Industry and regional directories specific to your area. Examples include:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Local chamber of commerce directories</li>
                    <li>Regional business associations</li>
                    <li>City-specific business listings</li>
                    <li>State tourism and visitor bureaus</li>
                    <li>Local classified ads platforms</li>
                    <li>Community event and business portals</li>
                  </ul>
                </TabsContent>
                <TabsContent value="industry" className="mt-4">
                  <p className="text-sm mb-3">Niche directories specific to your industry provide high-relevance citations:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Legal:</strong> Avvo, JustDial, State Bar directories</li>
                    <li><strong>Medical:</strong> Healthgrades, Zocdoc, WebMD physician finder</li>
                    <li><strong>Real Estate:</strong> Zillow, Redfin, Realtor.com, local MLS</li>
                    <li><strong>Restaurants:</strong> OpenTable, GrubHub, Uber Eats, DoorDash</li>
                    <li><strong>Hotels:</strong> TripAdvisor, Booking.com, Hotels.com</li>
                    <li><strong>Contractors:</strong> Angie's List, Home Advisor, Thumbtack</li>
                  </ul>
                </TabsContent>
              </Tabs>

              <h3 className="mt-6 font-semibold">NAP Consistency Critical</h3>
              <p className="mt-2 text-sm">Your business name, address, and phone must be consistent across all citations. Variations confuse search engines:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li>Use same business name format everywhere (including periods, "&" vs "and")</li>
                <li>Use same address format (avoid "St." vs "Street", "Suite" vs "Ste.")</li>
                <li>Same phone number across all listings</li>
                <li>Audit existing citations for inconsistencies and update</li>
                <li>Use citation management tools like Bright Local or Semrush Local</li>
              </ul>
            </section>

            <section id="reviews" className="scrape-section">
              <h2>Review Management and Reputation Strategy</h2>
              <p>Customer reviews are a critical ranking factor and trust signal. Businesses with more reviews, higher ratings, and recent activity rank significantly higher in local search results. Additionally, reviews dramatically impact click-through rates—4-star average businesses get 2x more clicks than 2-star competitors.</p>

              <h3 className="mt-6 font-semibold">Review Generation Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-600" />
                      Systematic Review Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Post-Purchase:</strong> Email/SMS review request within 24 hours of service delivery</p>
                    <p><strong>In-Person:</strong> QR codes in stores/offices linking directly to Google reviews form</p>
                    <p><strong>Receipt Reminders:</strong> Include review request on receipts with direct links</p>
                    <p><strong>Follow-up:</strong> Automated email sequence for non-responders (3-5 reminders)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      Multiple Review Platforms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Primary:</strong> Google Reviews (highest ranking weight)</p>
                    <p><strong>Industry Specific:</strong> Yelp, Healthgrades, Avvo, etc.</p>
                    <p><strong>Broader Reputation:</strong> Trustpilot, Facebook, TripAdvisor</p>
                    <p><strong>Niche Platforms:</strong> Industry-specific review sites relevant to your business</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Response Strategy</h3>
              <p className="mt-2 text-sm">How you respond to reviews directly impacts your ranking and reputation:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-2">
                <li><strong>Respond to All Reviews:</strong> Aim for 100% response rate within 48 hours</li>
                <li><strong>Thank Positive Reviews:</strong> Brief, genuine responses thanking specific feedback</li>
                <li><strong>Address Negative Reviews:</strong> Professional, empathetic responses offering solutions privately</li>
                <li><strong>Invite Conversation:</strong> Ask for phone call to resolve issues offline</li>
                <li><strong>Use Keywords:</strong> Naturally incorporate service keywords in responses (for visibility)</li>
                <li><strong>Demonstrate Care:</strong> Show you're responsive and committed to improvement</li>
              </ul>
            </section>

            <section id="local-keywords" className="scrape-section">
              <h2>Local Keyword Research and Targeting</h2>
              <p>Local keyword research identifies the specific search terms customers use when looking for your services in your area. "Plumber near me" converts differently than "24-hour emergency plumbing in Denver"—both are local keywords with different intent and competition.</p>

              <h3 className="mt-6 font-semibold">Local Keyword Categories</h3>
              <div className="space-y-3 text-sm mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Geo+Service Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Examples: "dentist in Austin", "pizza near me", "car repair Denver"
                  <p className="text-xs text-gray-600 mt-1">Target city/neighborhood + service. Highest local intent and conversion.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Review Opportunity Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Examples: "best restaurants in Chicago", "top rated HVAC Dallas"
                  <p className="text-xs text-gray-600 mt-1">Targets comparison and review searchers. High review volume amplifies these.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Problem/Solution Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Examples: "roof leak repair Austin", "water damage restoration Denver"
                  <p className="text-xs text-gray-600 mt-1">Problem-focused searches with urgent intent. Create content addressing specific problems.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Near Me Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">Examples: "dentist near me", "Chinese food near me"
                  <p className="text-xs text-gray-600 mt-1">Mobile searches with immediate need. Optimize GBP and technical SEO for these.</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Keyword Research Tools</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-3">
                <li><strong><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush</a></strong> – Local keyword research with local ranking difficulty</li>
                <li><strong><a href="https://moz.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moz Local</a></strong> – Dedicated local SEO keyword tool</li>
                <li><strong><a href="https://www.ahrefs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ahrefs</a></strong> – Comprehensive keyword research with SERP analysis</li>
                <li><strong><a href="https://www.brightlocal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bright Local</a></strong> – Local SEO specialized platform</li>
                <li><strong>Google Search Console</strong> – See actual local search queries driving traffic</li>
              </ul>
            </section>

            <section id="link-building" className="scrape-section">
              <h2>Local Link Building and Community Authority</h2>
              <p>Links from local websites and organizations signal local relevance to Google. A link from your local chamber of commerce is more valuable than a national directory link. Building relationships with local businesses, community organizations, and local media creates natural link-building opportunities.</p>

              <h3 className="mt-6 font-semibold">Local Link Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Community & Association Links</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Chamber of Commerce</strong> – Join and get listed on chamber website</p>
                    <p><strong>Industry Associations</strong> – Member directories in professional organizations</p>
                    <p><strong>Local Nonprofits</strong> – Sponsor local charities, get links on their sites</p>
                    <p><strong>Business Improvement Districts</strong> – Local BID websites and directories</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Content & Relationships</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Local News Coverage</strong> – Press releases and media relationships</p>
                    <p><strong>Local Blogs</strong> – Guest posts on local industry blogs</p>
                    <p><strong>Event Sponsorship</strong> – Links from event websites</p>
                    <p><strong>Resource Pages</strong> – Get added to local "best of" lists</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Earning Local Links Naturally</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                <li><strong>Become a Local Expert:</strong> Publish helpful local content, get quoted in local news</li>
                <li><strong>Sponsor Community Events:</strong> Youth sports, charity fundraisers, community festivals</li>
                <li><strong>Partner with Complementary Businesses:</strong> Cross-promote and link with non-competing local businesses</li>
                <li><strong>Create Local Scholarships:</strong> Award scholarships, get links from schools</li>
                <li><strong>Host Local Events:</strong> Webinars, workshops, seminars that draw local attendance and media</li>
              </ul>
            </section>

            <section id="technical" className="scrape-section">
              <h2>Technical Local SEO and Schema Markup</h2>
              <p>Technical optimization ensures search engines can properly understand and index your local business information. This includes implementing proper schema markup, ensuring mobile optimization, and maintaining site structure that supports local relevance.</p>

              <h3 className="mt-6 font-semibold">Essential Local Schema Markup</h3>
              <Tabs defaultValue="organization" className="mt-4">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                  <TabsTrigger value="localbusiness">Local Business</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                </TabsList>
                <TabsContent value="organization" className="mt-4 text-sm">
                  <p>Organization schema tells Google about your company, including location, contact info, and social profiles:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Business name, logo, contact info</li>
                    <li>Social media profiles and links</li>
                    <li>Physical address with full geo-coordinates</li>
                    <li>Founded date and service areas</li>
                  </ul>
                </TabsContent>
                <TabsContent value="localbusiness" className="mt-4 text-sm">
                  <p>LocalBusiness schema is more specific, communicating operating hours, service areas, and business type:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Service categories and types</li>
                    <li>Operating hours (including holidays)</li>
                    <li>Service area (geo-radius or specific areas)</li>
                    <li>Price range and payment methods</li>
                    <li>Aggregated ratings and review count</li>
                  </ul>
                </TabsContent>
                <TabsContent value="address" className="mt-4 text-sm">
                  <p>Explicit PostalAddress markup helps search engines parse location data:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Street address</li>
                    <li>City, state, postal code</li>
                    <li>Country code</li>
                    <li>Geo-coordinates (latitude/longitude)</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </section>

            <section id="content" className="scrape-section">
              <h2>Location Pages and Local Content Strategy</h2>
              <p>If you serve multiple locations, dedicated location pages dramatically improve local rankings. Each location page targets location-specific keywords and includes location-relevant content, testimonials, team members, and local imagery.</p>

              <h3 className="mt-6 font-semibold">Location Page Structure</h3>
              <div className="space-y-3 text-sm mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Elements</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Unique Title & Meta:</strong> "[Service] in [City], [State]" + unique description</p>
                    <p><strong>Location Hero Section:</strong> High-quality photo of that specific location</p>
                    <p><strong>Unique Content:</strong> 500-1000 words specific to that location, community, and services</p>
                    <p><strong>Local Team:</strong> Photos and bios of team members at this location</p>
                    <p><strong>Local Testimonials:</strong> Reviews and case studies from local customers</p>
                    <p><strong>Local Schema:</strong> Full LocalBusiness schema with this location's details</p>
                    <p><strong>Local Events:</strong> Community events, sponsorships, or involvement</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Location Page Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Unique Content Per Page:</strong> Don't use template language; customize each page</li>
                <li><strong>Target Location Keywords:</strong> Include city/area name naturally in content</li>
                <li><strong>Serve Local Traffic:</strong> Highlight what makes that location special</li>
                <li><strong>Local Imagery:</strong> Photos of the specific location, not generic stock photos</li>
                <li><strong>Link to Location Pages:</strong> Internal links from homepage and service pages to location pages</li>
                <li><strong>Mobile Optimized:</strong> Location pages receive high mobile traffic; ensure fast load times</li>
              </ul>
            </section>

            <section id="map-pack" className="scrape-section">
              <h2>Google Maps Pack Strategy and Local Ranking Factors</h2>
              <p>The Google Maps "Local Pack"—three business results with maps, reviews, and contact info—appears at the top of location-based searches. Ranking here is critical; it gets 35-40% of all local clicks. Understanding Google's ranking factors is essential for local SEO success.</p>

              <h3 className="mt-6 font-semibold">Google Maps Ranking Factors (in priority order)</h3>
              <div className="space-y-3 text-sm mt-4">
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-emerald-900">Tier 1 – Critical Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong className="block">1. Google Business Profile Optimization</strong> Accurate info, complete details, recent activity, photo uploads</p>
                    <p><strong className="block">2. Relevance</strong> Business category, keywords in GBP, content relevance to search query</p>
                    <p><strong className="block">3. Distance</strong> Proximity of business to search location (can't be changed unless relocate)</p>
                    <p><strong className="block">4. Customer Reviews</strong> Quantity, recency, and ratings. More reviews with higher ratings rank higher</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-blue-900">Tier 2 – Important Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong className="block">5. Local Citations</strong> Quantity and consistency of NAP across directories</p>
                    <p><strong className="block">6. Website Relevance</strong> On-page SEO, local keywords, local content quality</p>
                    <p><strong className="block">7. Links</strong> Both national and local backlinks signal authority</p>
                    <p><strong className="block">8. Review Velocity</strong> Recent reviews matter more; consistent review generation helps</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 font-semibold">Map Pack Ranking Improvement Roadmap</h3>
              <div className="space-y-2 text-sm mt-4">
                <div className="border-l-4 border-emerald-500 pl-4 py-2">
                  <p className="font-semibold">Month 1-2: Quick Wins</p>
                  <p>Optimize GBP completely. Get 10-20 new reviews. Fix citation inconsistencies.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold">Month 2-3: Foundation</p>
                  <p>Create location pages. Implement local schema. Add local citations in 10+ directories.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="font-semibold">Month 3-6: Growth</p>
                  <p>Ongoing review generation system. Local content creation. Local link building.</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="font-semibold">Month 6+: Dominance</p>
                  <p>Maintain momentum. Monitor rankings. Competitive analysis. Continuous optimization.</p>
                </div>
              </div>
            </section>

            <section id="schema" className="scrape-section">
              <h2>Advanced Schema Markup for Local SEO</h2>
              <p>Schema markup helps search engines understand your business information, service offerings, and customer reviews. Well-implemented schema can increase your visibility in rich results and improve click-through rates by 20-30%.</p>

              <h3 className="mt-6 font-semibold">Recommended Schema Types</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>LocalBusiness/SpecificType:</strong> Plumber, Restaurant, Dentist, etc. with location details</li>
                <li><strong>PostalAddress:</strong> Full address with latitude/longitude</li>
                <li><strong>ContactPoint:</strong> Phone number with type (customer service, technical support)</li>
                <li><strong>OpeningHoursSpecification:</strong> Detailed hours including holidays and special hours</li>
                <li><strong>AggregateRating:</strong> Display ratings and review count</li>
                <li><strong>Review:</strong> Individual customer reviews with ratings</li>
                <li><strong>Service:</strong> Services offered with descriptions and pricing</li>
                <li><strong>FAQPage:</strong> Common questions about services, hours, location</li>
              </ul>

              <h3 className="mt-6 font-semibold">Testing and Validation</h3>
              <p className="mt-2 text-sm">Always test your schema using:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Rich Results Test</a> – Official validation tool</li>
                <li><a href="https://validator.schema.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schema.org Validator</a> – Comprehensive schema validation</li>
              </ul>
            </section>

            <section id="tools" className="scrape-section">
              <h2>Essential Local SEO Tools and Resources</h2>
              <p>Professional local SEO requires the right tools to research, implement, monitor, and optimize. Here are the essential platforms:</p>

              <h3 className="mt-6 font-semibold">Citation and Reputation Tools</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.brightlocal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bright Local</a></strong> – Citation management, review monitoring, rank tracking, and local SEO audits</li>
                <li><strong><a href="https://www.yext.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yext</a></strong> – Business listing management across 200+ directories</li>
                <li><strong><a href="https://www.semrush.com/local/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush Local</a></strong> – Local keyword research, local SEO audits, ranking tracking</li>
              </ul>

              <h3 className="mt-6 font-semibold">Local Rank Tracking</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.brightlocal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bright Local Rank Tracker</a></strong> – Track Google Maps and local ranking positions</li>
                <li><strong><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Semrush Rank Tracker</a></strong> – Local and national ranking tracking with insights</li>
                <li><strong><a href="https://moz.com/local" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moz Local</a></strong> – Local listing management and rank tracking</li>
              </ul>

              <h3 className="mt-6 font-semibold">Review Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong><a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Business Profile</a></strong> – Free review management and response</li>
                <li><strong><a href="https://www.brightlocal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bright Local Review Generator</a></strong> – Automated review request campaigns</li>
                <li><strong><a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="text-blue-606 hover:underline">Trustpilot</a></strong> – Review platform with collection tools</li>
              </ul>
            </section>

            <section id="strategy" className="scrape-section">
              <h2>12-Month Local SEO Strategy Framework</h2>
              <p>This proven framework outlines how to systematically improve local rankings over 12 months, with specific milestones and metrics:</p>

              <Tabs defaultValue="q1" className="mt-4">
                <TabsList className="flex flex-wrap gap-1">
                  <TabsTrigger value="q1">Q1: Foundation</TabsTrigger>
                  <TabsTrigger value="q2">Q2: Growth</TabsTrigger>
                  <TabsTrigger value="q3">Q3: Momentum</TabsTrigger>
                  <TabsTrigger value="q4">Q4: Dominance</TabsTrigger>
                </TabsList>
                <TabsContent value="q1" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Q1 Objectives</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p className="font-semibold">GBP Optimization</p>
                        <ul className="list-disc pl-6"><li>Claim/verify GBP profile</li><li>Complete all business information fields</li><li>Upload 10-15 high-quality photos</li><li>Implement GBP Posts (2-4 per month)</li></ul>
                        <p className="font-semibold mt-2">Citation Foundation</p>
                        <ul className="list-disc pl-6"><li>Audit current citations for consistency</li><li>Add to 5-10 major directories (Yelp, Manta, Yellow Pages)</li><li>Verify accurate NAP everywhere</li></ul>
                        <p className="font-semibold mt-2">Review System Setup</p>
                        <ul className="list-disc pl-6"><li>Create review generation process</li><li>Request reviews from 20-30 happy customers</li><li>Set up response workflow</li></ul>
                        <p className="font-semibold mt-2">Expected Results:</p>
                        <p>20-30 new reviews, consistent citations, improved GBP visibility</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="q2" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Q2 Objectives</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p className="font-semibold">Content & Technical</p>
                        <ul className="list-disc pl-6"><li>Create location pages (if multi-location)</li><li>Implement local schema markup</li><li>Optimize homepage for local keywords</li><li>Improve site speed (Core Web Vitals)</li></ul>
                        <p className="font-semibold mt-2">Citation Expansion</p>
                        <ul className="list-disc pl-6"><li>Add to 10-15 more directories</li><li>Target local and industry-specific listings</li><li>Continue citation consistency auditing</li></ul>
                        <p className="font-semibold mt-2">Link Building</p>
                        <ul className="list-disc pl-6"><li>Join Chamber of Commerce</li><li>Pursue 5-10 local link opportunities</li><li>Create partnership links with complementary businesses</li></ul>
                        <p className="font-semibold mt-2">Expected Results:</p>
                        <p>Map pack visibility improvement, 40-50 total reviews, strong citation foundation</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="q3" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Q3 Objectives</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p className="font-semibold">Content Acceleration</p>
                        <ul className="list-disc pl-6"><li>Publish local blog content (2-4 per month)</li><li>Optimize for long-tail local keywords</li><li>Create location-specific case studies</li></ul>
                        <p className="font-semibold mt-2">Review Momentum</p>
                        <ul className="list-disc pl-6"><li>Systematic monthly review requests</li><li>Target 15-20 new reviews per month</li><li>Maintain 100% review response rate</li></ul>
                        <p className="font-semibold mt-2">Local Authority</p>
                        <ul className="list-disc pl-6"><li>Pursue local media coverage</li><li>Sponsor local events</li><li>Participate in community activities</li></ul>
                        <p className="font-semibold mt-2">Expected Results:</p>
                        <p>Ranking improvements for competitive keywords, 80-100 total reviews, strong local presence</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="q4" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Q4: Objectives & Beyond</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p className="font-semibold">Optimization & Refinement</p>
                        <ul className="list-disc pl-6"><li>Refine keyword targeting based on 9 months data</li><li>Double down on high-performing content</li><li>Improve underperforming pages</li></ul>
                        <p className="font-semibold mt-2">Competitive Dominance</p>
                        <ul className="list-disc pl-6"><li>Analyze and outrank top 3 competitors</li><li>Build on strongest differentiators</li><li>Defend rankings with continuous optimization</li></ul>
                        <p className="font-semibold mt-2">System Sustainability</p>
                        <ul className="list-disc pl-6"><li>Establish ongoing review generation process</li><li>Monthly content calendar and updates</li><li>Quarterly audits and optimization</li></ul>
                        <p className="font-semibold mt-2">Expected Results:</p>
                        <p>Map pack leadership, 120+ reviews, dominant local authority, consistent lead/customer flow</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <section id="case-studies" className="scrape-section">
              <h2>Real Local SEO Case Studies and Results</h2>
              <div className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dental Practice: From Invisible to Map Pack Domination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Starting Position:</strong> No Google Business Profile claimed, 2 reviews, inconsistent citations, invisible in local search.</p>
                    <p><strong>Strategy:</strong> Claimed and optimized GBP, added 15 major citations, implemented systematic review generation, optimized website for local keywords, built local links through partnerships.</p>
                    <p><strong>Timeline:</strong> 6 months to first position.</p>
                    <p><strong>Results:</strong> Ranked #1 in Google Maps for target keywords. 87 Google reviews (4.8 stars). New patient inquiries increased 240%. Estimated revenue impact: +$180,000 annually.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Location Plumbing Company: Unified Local Authority</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Challenge:</strong> 5 locations with inconsistent online presence, conflicting information across web, poor reviews and low visibility in all markets.</p>
                    <p><strong>Strategy:</strong> Unified NAP across all locations, created dedicated location pages, individual GBP optimization for each location, location-specific review generation, local content for each service area.</p>
                    <p><strong>Timeline:</strong> 9 months for consistent multi-location ranking improvement.</p>
                    <p><strong>Results:</strong> All 5 locations ranking in Map Pack. 350 total reviews across all locations. Emergency service calls increased 165%. Overall business revenue +$420,000 annually.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Local Restaurant: Reviews and Dominance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Starting Point:</strong> 15 reviews (3.2 stars), inconsistent hours, incomplete GBP, not visible in local pack.</p>
                    <p><strong>Strategy:</strong> Fixed GBP information, trained staff on systematic post-transaction review requests, implemented review response strategy addressing negative feedback, created monthly GBP posts about specials and events.</p>
                    <p><strong>Timeline:</strong> 5 months to rank in local pack, 8 months to #1 position.</p>
                    <p><strong>Results:</strong> 200+ reviews (4.7 stars), #1 in local pack for key dining keywords. Reservation inquiries +180%. Customer foot traffic increased 95%.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="faq" className="scrape-section">
              <h2>Local SEO Services FAQ</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>How long does it take to rank in Google Maps?</AccordionTrigger>
                  <AccordionContent>
                    Most businesses see measurable results within 3-6 months with proper optimization. Ranking in the top 3 (Map Pack) typically takes 6-12 months depending on competition and your starting point. Highly competitive markets may take longer. The good news: once you establish authority and reviews, rankings become more stable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2">
                  <AccordionTrigger>What is the most important local SEO factor?</AccordionTrigger>
                  <AccordionContent>
                    Google Business Profile optimization is the single most important factor. A complete, optimized GBP with regular updates and customer reviews is essential. Distance, relevance, and customer reviews are the next most important factors. Together, these three account for approximately 80 percent of local ranking weight.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3">
                  <AccordionTrigger>Do I need a website for local SEO?</AccordionTrigger>
                  <AccordionContent>
                    While a Google Business Profile alone can generate rankings, a quality website significantly improves results. A website allows you to target more keywords, provide detailed information, collect customer reviews, and establish topical authority. It also gives you control over your online narrative versus relying entirely on third-party platforms.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4">
                  <AccordionTrigger>How many reviews do I need to rank?</AccordionTrigger>
                  <AccordionContent>
                    While quantity matters, quality and recency matter more. Even 5-10 recent, high-quality reviews can outrank competitors with 100+ older reviews. The key is establishing a consistent review generation process that produces fresh reviews monthly. This signals to Google that your business is active and customers are satisfied.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5">
                  <AccordionTrigger>Should I use a different business name for SEO?</AccordionTrigger>
                  <AccordionContent>
                    No. Your business name must be accurate and consistent everywhere. Google penalizes "keyword stuffing" in business names (e.g., "Denver's Best Plumber &amp; HVAC &amp; Water Heater Repair"). Use your actual business name consistently across GBP, website, and all citations. Target keywords through content and optimization, not name manipulation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6">
                  <AccordionTrigger>Can I rank for multiple cities?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Use location pages for each city, ensure NAP consistency by location, create location-specific content and reviews, and build local citations in each market. Many service-based businesses rank in multiple cities by treating each market strategically. Multi-location businesses often use dedicated service area pages instead of individual location pages.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Dominate Local Search With High-Authority Backlinks"
                description="After optimizing your local SEO foundation, accelerate rankings with powerful local and national backlinks from Backlink ∞. Combine local SEO excellence with strategic link building for unstoppable local dominance. Our backlinks service helps you capture high-intent local customers and establish authority in your market. Get started with Backlink ∞ today."
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
