import React, { useState, useEffect } from 'react';
import Seo from "@/components/Seo";
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/daftmusic.css';
import {
  ChevronDown,
  Music,
  Zap,
  Shield,
  Sparkles,
  CheckCircle,
  Apple,
  RefreshCw,
  Volume2,
  ListMusic,
  Search,
  Heart,
  Play,
  Smartphone,
  BarChart3,
  ArrowRight,
  Globe,
  Lock,
  Cpu,
} from 'lucide-react';
import { Footer } from '@/components/Footer';

const DaftMusic = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Update page title for SEO
    document.title = 'Daft Music - Fast Apple Music Player for Mac | Premium Experience';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Daft Music is a beautiful, fast Apple Music player for Mac with liquid glass interface, Last.fm scrobbling, and privacy-first design. Enjoy your music library with native macOS performance.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Daft Music is a beautiful, fast Apple Music player for Mac with liquid glass interface, Last.fm scrobbling, and privacy-first design. Enjoy your music library with native macOS performance.';
      document.head.appendChild(meta);
    }

    // Add OpenGraph meta tags
    const ogMetas = [
      { property: 'og:title', content: 'Daft Music - Premium Apple Music Player for macOS' },
      { property: 'og:description', content: 'Experience Apple Music like never before with Daft Music. Enjoy lightning-fast performance, elegant design, and powerful features.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Daft Music' },
      { name: 'twitter:description', content: 'Beautiful Apple Music player for Mac with exceptional performance' },
      { name: 'keywords', content: 'Daft Music, Apple Music player, macOS music app, music player Mac, Apple Music client' }
    ];

    ogMetas.forEach(meta => {
      let element = document.querySelector(`meta[${meta.property ? 'property' : 'name'}="${meta.property || meta.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (meta.property) {
          element.setAttribute('property', meta.property);
        } else {
          element.setAttribute('name', meta.name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', meta.content);
    });

    // Add JSON-LD structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Daft Music',
      'description': 'A beautiful, fast Apple Music player for macOS with native performance and elegant design',
      'url': 'https://daftmusic.app',
      'applicationCategory': 'Multimedia',
      'operatingSystem': 'macOS',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'name': 'Free'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '2500'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'OBRHOFF Software Labs GmbH',
        'url': 'https://daftmusic.app'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    window.scrollTo(0, 0);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="daftmusic-page min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="hero relative pt-20 pb-32 px-6 overflow-hidden">

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Badge className="dm-badge">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium macOS Music Experience
            </Badge>
          </div>

          <h1 className="hero-title">
            Music that <span className="hero-accent">Feels Right</span>
          </h1>

          <p className="hero-subtitle">
            Daft Music transforms your Apple Music experience on macOS. With lightning-fast performance,
            a simple, elegant interface, and powerful features like Last.fm scrobbling, discover
            why thousands of music lovers have made the switch from the standard Apple Music app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="btn">
                Register for Backlink ∞
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <div className="card">
            <p className="text-sm text-muted mb-4">Why music enthusiasts choose Daft Music:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Native Performance', 'Privacy-First', 'Elegant Design', 'Full Scrobbling'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 dm-accent" />
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Daft Music Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">What is Daft Music?</h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              Daft Music is a revolutionary third-party Apple Music client designed specifically for macOS, 
              offering music enthusiasts a faster, more elegant alternative to the native Apple Music app. 
              Developed by OBRHOFF Software Labs GmbH, Daft Music has quickly gained recognition for combining 
              exceptional performance with a thoughtfully designed interface that respects user privacy while 
              delivering an unmatched listening experience.
            </p>
            <p>
              Unlike bloated music applications, Daft Music focuses exclusively on what matters: making your 
              music collection feel effortless to explore, intuitive to control, and enjoyable to experience. 
              Built natively for macOS using modern frameworks, the application delivers remarkable speed even 
              when managing extensive music libraries with thousands of songs, albums, and playlists.
            </p>
            <p>
              The application seamlessly integrates with your existing Apple Music subscription, giving you 
              complete access to Apple Music's vast catalog of over 100 million songs while providing a superior 
              user interface and feature set that the standard Apple Music app lacks. From casual listeners to 
              dedicated music collectors, Daft Music caters to anyone seeking a more refined way to experience 
              their music on the Mac.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Exceptional Features</h2>
            <p className="text-xl text-gray-400">
              Comprehensive functionality designed for the modern music listener
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Native macOS Performance',
                description:
                  'Built from the ground up for macOS using native frameworks, Daft Music delivers lightning-fast performance regardless of your library size. Experience instant navigation, smooth playback, and responsive controls that rival professional audio software.',
                highlights: ['Instant loading', 'Smooth scrolling', 'Zero lag', 'Optimized memory usage'],
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Liquid Glass Design',
                description:
                  'Daft Music features a sophisticated frosted glass aesthetic that seamlessly integrates with modern macOS design philosophy. The elegant interface reduces visual clutter while maintaining exceptional legibility and visual hierarchy.',
                highlights: ['Frosted glass effect', 'Dark mode optimized', 'Subtle animations', 'Professional aesthetics'],
              },
              {
                icon: <ListMusic className="w-8 h-8" />,
                title: 'Powerful Library Management',
                description:
                  'Organize and explore your music collection with unprecedented ease. Daft Music provides intuitive views for Artists, Albums, Songs, and Playlists with advanced sorting, filtering, and pinning capabilities to suit your browsing preferences.',
                highlights: ['Smart filtering', 'Quick search', 'Custom pinning', 'Flexible sorting'],
              },
              {
                icon: <Volume2 className="w-8 h-8" />,
                title: 'Last.fm Scrobbling Integration',
                description:
                  'Automatically track your listening history with integrated Last.fm support. No plugins or manual configuration needed—your music taste is documented and analyzed effortlessly, enriching your music discovery and statistics.',
                highlights: ['Automatic tracking', 'No configuration', 'Music statistics', 'Discovery insights'],
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Privacy-First Philosophy',
                description:
                  'Daft Music respects your privacy with a strict no-tracking, no-data-collection policy. Your listening habits remain yours alone, and the application requires no personal data to deliver its full feature set.',
                highlights: ['No tracking', 'No analytics', 'No personal data', 'User control'],
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Reliable AirPlay Support',
                description:
                  'Experience more stable and consistent AirPlay connectivity compared to the standard Apple Music app. Stream to AirPlay speakers, Apple TV, and other compatible devices with improved reliability and connection stability.',
                highlights: ['Stable connections', 'Faster switching', 'Better reliability', 'Multi-device support'],
              },
            ].map((feature, idx) => (
              <Card key={idx} className="card">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-lg dm-badge">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight) => (
                      <Badge key={highlight} className="dm-badge">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section id="design" className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Design Excellence Meets Functionality</h2>
              <p className="text-gray-300 mb-6">
                Daft Music represents a paradigm shift in how music applications should be designed. 
                Rather than cramming features into complex interfaces, Daft Music embraces minimalism 
                and clarity, allowing your music to take center stage.
              </p>
              <div className="space-y-4">
                {[
                  'Beautiful liquid glass aesthetic integrated seamlessly with macOS',
                  'Intuitive navigation that requires minimal learning curve',
                  'Responsive controls with subtle animations enhancing interaction',
                  'Optimized for both light and dark mode viewing',
                  'Accessibility features ensuring inclusive design for all users',
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Music className="w-24 h-24 text-purple-400 mx-auto mb-4 opacity-80" />
                <p className="text-gray-400">Liquid Glass Interface</p>
                <p className="text-sm text-gray-500 mt-2">Modern, elegant, and responsive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Availability Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">
              Flexible options to suit your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free Trial',
                price: '$0',
                period: 'Forever',
                description: 'Experience Daft Music completely free with limited playback',
                features: ['Browse your library', 'Explore Apple Music catalog', 'Last.fm integration', 'Queue management'],
              },
              {
                name: 'Monthly',
                price: '$1.99',
                period: 'per month',
                description: 'Unlimited full-length playback with premium features',
                features: ['Unlimited playback', 'Full Last.fm scrobbling', 'AirPlay support', 'Priority updates'],
                badge: 'Most Popular',
              },
              {
                name: 'Annual',
                price: '$17.99',
                period: 'per year',
                description: 'Best value for committed music enthusiasts',
                features: ['Unlimited playback', 'Full Last.fm scrobbling', 'AirPlay support', 'Priority updates'],
              },
            ].map((plan, idx) => (
              <Card key={idx} className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border-purple-500/20 hover:border-purple-400/30 transition ${plan.badge ? 'ring-2 ring-purple-500/50' : ''}`}>
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/50">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-purple-400">{plan.price}</div>
                    <div className="text-gray-400 text-sm">{plan.period}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              All plans require an active Apple Music subscription. Daft Music is available exclusively on the Mac App Store.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Perfect For Every Music Lover</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Casual Listeners',
                description: 'Simply want a faster, more beautiful way to enjoy Apple Music without unnecessary complexity.',
              },
              {
                title: 'Music Collectors',
                description: 'Manage extensive libraries with ease using intelligent organization, filtering, and search capabilities.',
              },
              {
                title: 'Last.fm Enthusiasts',
                description: 'Track listening history and music statistics automatically with seamless Last.fm integration.',
              },
              {
                title: 'Mac Power Users',
                description: 'Appreciate native macOS integration, keyboard shortcuts, and applications built with Apple ecosystem in mind.',
              },
              {
                title: 'Privacy-Conscious Users',
                description: 'Value applications that respect personal data and operate without tracking or analytics.',
              },
              {
                title: 'Professional Musicians',
                description: 'Benefit from reliable performance and stable AirPlay connectivity for monitoring and reference listening.',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 hover:border-purple-400/30 transition">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  {useCase.title}
                </h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Do I need an Apple Music subscription to use Daft Music?',
                answer: 'Yes, an active Apple Music subscription is required to stream full-length tracks. The free tier allows you to browse your library and explore the catalog, but requires the paid subscription for playback.',
              },
              {
                question: 'Is Daft Music available on iOS or Windows?',
                answer: 'Currently, Daft Music is exclusively available for macOS through the Mac App Store. The developers have designed it specifically for the Mac platform to leverage native macOS features and performance.',
              },
              {
                question: 'Does Daft Music collect any personal data?',
                answer: 'No. Daft Music is completely privacy-focused with zero tracking, zero analytics, and zero data collection. Your listening history belongs to you alone.',
              },
              {
                question: 'How does Last.fm scrobbling work?',
                answer: 'Simply connect your Last.fm account in Daft Music settings. All your plays are automatically tracked and sent to Last.fm without additional action or configuration.',
              },
              {
                question: 'Can I sync my playlists from Apple Music?',
                answer: 'Yes. Daft Music fully integrates with your Apple Music account, giving you complete access to all your playlists, library, and preferences synced from iCloud Music Library.',
              },
              {
                question: 'What languages does Daft Music support?',
                answer: 'Daft Music supports English, Danish, Dutch, French, German, Japanese, Korean, Polish, Portuguese, Spanish, and Swedish for a global user base.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes. You can use Daft Music free with limited playback. Upgrade to the monthly ($1.99) or annual ($17.99) plan for unlimited playback and full features.',
              },
              {
                question: 'How does Daft Music perform with large libraries?',
                answer: 'Daft Music is optimized for performance regardless of library size. Even with thousands of songs, the application maintains instant responsiveness and smooth scrolling.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-400/30 transition"
              >
                <button
                  onClick={() => setExpandedFeature(expandedFeature === `faq-${idx}` ? null : `faq-${idx}`)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition"
                >
                  <h3 className="font-semibold text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedFeature === `faq-${idx}` ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFeature === `faq-${idx}` && (
                  <div className="px-6 py-4 bg-white/5 border-t border-purple-500/20">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Get Started with Daft Music</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Three simple steps to transform your Apple Music experience
          </p>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Download from Mac App Store',
                description: 'Visit the Mac App Store and search for Daft Music, or visit daftmusic.app to download directly.',
              },
              {
                step: '2',
                title: 'Sign In with Apple ID',
                description: 'Launch the app and authenticate with your Apple ID to connect your Apple Music account and library.',
              },
              {
                step: '3',
                title: 'Start Listening',
                description: 'Browse your library, explore the Apple Music catalog, and enjoy the beautiful interface.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 bg-white/5 border border-purple-500/20 rounded-lg p-6 hover:border-purple-400/30 transition">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backlink Integration CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  SEO Enhancement
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Boost Your Digital Presence</h2>
                <p className="text-gray-300 mb-6">
                  If you're building music applications, sharing music content, or operating in the digital music space, 
                  your online visibility is crucial. Daft Music demonstrates excellence in design and user experience—your 
                  brand and content deserve the same level of visibility and authority.
                </p>
                <p className="text-gray-300 mb-8">
                  Backlink ∞ combines white-hat link building with comprehensive SEO strategies to establish domain authority 
                  and drive qualified organic traffic to your digital properties.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Premium domain backlinks from music and tech industry leaders',
                    'Comprehensive SEO authority development for tech products',
                    'Organic traffic generation through strategic rankings',
                    'Full transparency with detailed reporting and analytics',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-lg">
                    Register for Backlink ∞
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">3-6 Months</div>
                    <p className="text-gray-400">Average time to reach top 10 rankings</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-400 mb-2">+350%</div>
                    <p className="text-gray-400">Average organic traffic increase</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
                    <p className="text-gray-400">White-hat ethical practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 border-t border-purple-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference Today</h2>
          <p className="text-lg text-gray-400 mb-8">
            Download Daft Music and discover a better way to enjoy Apple Music on your Mac. Register for Backlink ∞ to amplify your digital presence.
          </p>
          <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg">
              Register for Backlink ∞
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DaftMusic;
