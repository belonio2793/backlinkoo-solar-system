import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Layout, Zap, Palette, Share2, BarChart3, Lock, Layers, GitBranch, Sparkles, CheckCircle, ArrowRight, Users, Rocket, BookOpen, Image as ImageIcon } from 'lucide-react';
import '@/styles/heygrid.css';

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
  let el = document.head.querySelector(`script[data-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('data-jsonld', id);
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export default function HeyGrid() {
  useEffect(() => {
    const title = 'HeyGrid - Advanced Link-in-Bio Tool with Infinite Grid Layout | Create Beautiful Link Hubs';
    const description = 'HeyGrid is a powerful link-in-bio tool featuring unlimited grid layout customization, multimedia support, and drag-and-drop design. Perfect for influencers, creators, and brands to showcase all links in one beautiful, interactive page.';
    const keywords = 'heygrid, link in bio, link-in-bio tool, grid layout, link hub, social media links, bio link tool, influencer tools, creator tools, customize links';

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', keywords);
    upsertMeta('viewport', 'width=device-width, initial-scale=1.0');
    upsertMeta('theme-color', '#000000');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/heygrid');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    upsertCanonical('https://backlinkoo.com/heygrid');

    injectJSONLD('schema-org', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'HeyGrid',
      applicationCategory: 'BusinessApplication',
      description: description,
      url: 'https://heygrid.io',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        ratingCount: '2156'
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="heygrid-page bg-white text-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="heygrid-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white">
              <p className="text-sm font-semibold text-emerald-400">Advanced Link-in-Bio Platform</p>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-white">
              HeyGrid: Unlimited Links, Infinite Possibilities
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your Instagram bio, TikTok profile, or any social media presence with HeyGrid's infinite grid layout. Create beautiful, interactive link hubs that engage your audience and drive conversions without limitations.
            </p>
            

            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400">100%</div>
                <p className="text-sm text-slate-600 mt-2">Customizable Grid</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-400">∞</div>
                <p className="text-sm text-slate-600 mt-2">Unlimited Links</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">50K+</div>
                <p className="text-sm text-slate-600 mt-2">Active Creators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is HeyGrid Section */}
      <section className="heygrid-what py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">What is HeyGrid?</h2>
            
            <div className="prose max-w-none mb-12">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                HeyGrid revolutionizes the link-in-bio experience by breaking free from traditional single-column constraints. Unlike basic link aggregators that force your content into rigid, vertical layouts, HeyGrid embraces a dynamic, infinite grid system that lets your personality and brand shine through visually rich, multi-dimensional link presentations.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Built specifically for content creators, influencers, entrepreneurs, and brands, HeyGrid transforms the humble bio link into a powerful marketing tool. It's the bridge between your social media presence and your business goals—a beautiful, interactive landing page that lives in your bio and drives meaningful engagement with your audience.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                The platform combines cutting-edge design flexibility with intuitive user experience. Whether you're promoting products, sharing content, growing your email list, or driving traffic to multiple destinations, HeyGrid adapts to your needs without requiring coding skills or design experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <div className="flex items-start gap-4">
                  <Layout className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Infinite Grid Layout</h3>
                    <p className="text-slate-600">Organize unlimited links in a dynamic grid format with complete control over sizing, spacing, and arrangement. No constraints, no limitations.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Drag-and-Drop Editor</h3>
                    <p className="text-slate-600">Intuitive interface lets you arrange, resize, and customize every element without touching a single line of code.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="heygrid-features py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Powerful Features for Maximum Impact</h2>
            <p className="text-xl text-slate-600 text-center mb-16">Everything you need to create stunning, conversion-focused link hubs that engage your audience.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: ImageIcon,
                  title: 'Rich Media Support',
                  description: 'Embed images, videos, YouTube clips, Spotify tracks, and interactive content. Bring your links to life with multimedia.'
                },
                {
                  icon: Palette,
                  title: 'Complete Customization',
                  description: 'Full control over colors, fonts, backgrounds, and branding. Match your unique aesthetic perfectly.'
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Track clicks, engagement metrics, and user behavior to understand what drives conversions.'
                },
                {
                  icon: Zap,
                  title: 'Mobile-First Design',
                  description: 'Optimized for all devices with responsive layouts that look stunning everywhere your audience is.'
                },
                {
                  icon: Share2,
                  title: 'Social Integration',
                  description: 'Connect with Instagram, TikTok, Twitter, and other platforms. Sync and share seamlessly.'
                },
                {
                  icon: Lock,
                  title: 'SEO & Performance',
                  description: 'Fast-loading pages, SEO optimization, and performance monitoring built-in for better visibility.'
                }
              ].map((feature, idx) => (
                <Card key={idx} className="bg-white">
                  <div className="flex items-start gap-4">
                    <feature.icon className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why HeyGrid Section */}
      <section className="heygrid-why py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Why Choose HeyGrid?</h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h2>Beyond Traditional Link-in-Bio Tools</h2>
                  <p className="text-slate-700 leading-relaxed">
                    Traditional link-in-bio tools limit you to a boring vertical list. HeyGrid breaks those constraints with an infinite grid that lets you create stunning visual presentations. Your links become a destination, not just a list.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Designed for Engagement and Conversion</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Interactive grids naturally encourage exploration. When visitors see a beautifully arranged collection of options rather than a list, they spend more time engaging with your content and are more likely to click through to your destinations.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">No Technical Skills Required</h3>
                  <p className="text-slate-700 leading-relaxed">
                    The intuitive drag-and-drop editor means anyone can create professional-grade link hubs. No coding, no design background, no learning curve. Create beautiful pages in minutes, not hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Complete Brand Control</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Customize every aspect to match your brand identity. Colors, fonts, backgrounds, layouts—everything is configurable. Your link hub reflects your unique personality and professional standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h2>Data-Driven Optimization</h2>
                  <p className="text-slate-700 leading-relaxed">
                    Comprehensive analytics show exactly which links get clicks and when. Make informed decisions about layout, content, and strategy based on real user behavior data.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Perfect for All Creator Types</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Whether you're an influencer promoting products, a small business driving sales, a creator monetizing content, or a brand building community, HeyGrid adapts to your specific needs and goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="heygrid-use-cases py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Perfect for Every Creator and Brand</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  Influencers & Content Creators
                </h3>
                <p className="text-slate-700">Centralize your presence across platforms. Link to your YouTube, Twitch, podcasts, merchandise, and more—all in one visually appealing hub.</p>
              </Card>

              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🏪</span>
                  E-Commerce & Small Business
                </h3>
                <p className="text-slate-700">Drive traffic to your store, showcase products, offer promotions, and collect customer information—all from a single bio link.</p>
              </Card>

              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  Digital Marketers & Agencies
                </h3>
                <p className="text-slate-700">Create landing pages for campaigns, offer funnels, lead generation tools, and client portfolios with white-label customization.</p>
              </Card>

              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎤</span>
                  Musicians & Artists
                </h3>
                <p className="text-slate-700">Showcase your music, embed streaming players, sell merchandise, connect with fans, and gather contact information for your fanbase.</p>
              </Card>

              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">💼</span>
                  Professionals & Consultants
                </h3>
                <p className="text-slate-700">Create professional landing pages, book consultations, share your portfolio, display testimonials, and manage client relationships.</p>
              </Card>

              <Card className="bg-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  Educators & Online Courses
                </h3>
                <p className="text-slate-700">Organize course materials, link to lesson platforms, sell courses, gather student information, and build your educational brand.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="heygrid-how py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">How HeyGrid Works</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600/30 border border-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-400">1</div>
                <div className="flex-grow">
                  <h2>Sign Up in Seconds</h2>
                  <p className="text-slate-600">Create your account and connect your social profiles. No credit card required, start free immediately.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600/30 border border-teal-500 rounded-full flex items-center justify-center text-2xl font-bold text-teal-400">2</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Design Your Grid</h3>
                  <p className="text-slate-600">Use the drag-and-drop editor to arrange tiles, add links, upload media, and customize colors and fonts to match your brand.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-600/30 border border-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-400">3</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Get Your Custom URL</h3>
                  <p className="text-slate-600">Receive a unique HeyGrid URL or use your own custom domain. It's yours to share, monetize, and optimize.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600/30 border border-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-green-400">4</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Share & Track</h3>
                  <p className="text-slate-600">Add your link to your Instagram bio, TikTok profile, or other platforms. Watch analytics track every click and interaction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="heygrid-benefits py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Why HeyGrid Outperforms Traditional Tools</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-lg font-bold">Feature</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-emerald-400">HeyGrid</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-slate-600">Basic Link Tools</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-slate-600">Custom Pages</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Grid Layout</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-gray-500">✗</td>
                    <td className="text-center py-4 px-4 text-gray-500">Partial</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Drag-Drop Editor</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-gray-500">Limited</td>
                    <td className="text-center py-4 px-4 text-gray-500">No</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Multimedia Embeds</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-gray-500">Limited</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Advanced Analytics</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Basic</td>
                    <td className="text-center py-4 px-4 text-gray-500">Varies</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">No Code Required</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-gray-500">No</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Mobile Responsive</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Custom Domain</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Premium Only</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Benefits Section */}
      <section className="heygrid-engagement py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Maximize Engagement with HeyGrid</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white">
                <BarChart3 className="w-8 h-8 text-emerald-400 mb-4" />
                <h2>Higher Click-Through Rates</h2>
                <p className="text-slate-700">Interactive grids with visual hierarchy naturally guide users to click. Creators report 40-60% higher CTR compared to basic link lists.</p>
              </Card>

              <Card className="bg-white">
                <Users className="w-8 h-8 text-teal-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Increased Audience Time</h3>
                <p className="text-slate-700">Beautiful presentations encourage exploration. Users spend longer engaging with your content, increasing conversion opportunities.</p>
              </Card>

              <Card className="bg-white">
                <Rocket className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Better Monetization</h3>
                <p className="text-slate-700">Showcase products, services, and sponsorships more effectively. Turn your bio link into a revenue-generating asset.</p>
              </Card>

              <Card className="bg-white">
                <BookOpen className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Professional Branding</h3>
                <p className="text-slate-700">Replace generic link-in-bio tools with a custom branded experience that reflects your professional standards and unique style.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Backlink Infinity */}
      <section className="heygrid-cta py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Drive Traffic Beyond Your Bio Link</h2>
            
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              HeyGrid helps you create stunning link hubs that drive clicks, but reaching even more people requires strategic SEO and backlink authority. Backlink ∞ amplifies your online presence by building the authority signals that search engines reward.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-emerald-900/20 border-emerald-500/30 p-6">
                <Rocket className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h2>Organic Discovery</h2>
                <p className="text-sm text-slate-600">Quality backlinks improve your search rankings, bringing organic traffic directly to your HeyGrid page and website.</p>
              </Card>

              <Card className="bg-teal-900/20 border-teal-500/30 p-6">
                <BarChart3 className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Domain Authority</h3>
                <p className="text-sm text-slate-600">Build authority with strategic backlinks from reputable sources that increase your site's credibility across the web.</p>
              </Card>

              <Card className="bg-cyan-900/20 border-cyan-500/30 p-6">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Long-Term Traffic</h3>
                <p className="text-sm text-slate-600">Unlike paid ads that stop when your budget ends, backlinks deliver compounding traffic growth over time.</p>
              </Card>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold mb-4">Why Creators Choose Backlink ∞</h3>
              <ul className="text-left space-y-3 text-slate-700 max-w-2xl mx-auto">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  High-authority domains linking to your content
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Contextually relevant backlinks in your niche
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  White-hat SEO strategies that Google rewards
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Transparent reporting and dedicated support
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-slate-700">
                Create beautiful link hubs with HeyGrid, then amplify their reach with strategic backlinks from Backlink ∞.
              </p>
              <Button 
                className="px-10 py-8 text-xl bg-white"
                onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              >
                <span>Register for Backlink ∞</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Start building authority and driving organic traffic to your links
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="heygrid-final-cta py-16 md:py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2>Ready to Transform Your Bio Link?</h2>
            <p className="text-slate-600 mb-6">Create a stunning, conversion-focused link hub with HeyGrid. Join 50,000+ creators already using HeyGrid to engage audiences and grow their business.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
