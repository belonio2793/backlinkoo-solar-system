import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check } from 'lucide-react';

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

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
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

export default function Zippcall() {
  useEffect(() => {
    const title = 'Zippcall: Fast, Private Group Voice & Video Calls — Lightweight, Secure, and Simple';
    const description = 'Zippcall is a lightweight, privacy-first group calling tool built for fast, secure voice and video conversations. Learn how Zippcall works, its features, security model, and best practices for teams, creators, and communities.';

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', 'Zippcall, group video calls, private calls, lightweight video conferencing, secure voice chat, webrtc alternatives, team communication, privacy-first calling');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/zippcall');
    upsertCanonical(typeof window !== 'undefined' ? (window.location.origin + '/zippcall') : '/zippcall');

    try {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: description,
        url: typeof window !== 'undefined' ? window.location.href : '/zippcall',
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: 'Zippcall',
          description: 'Fast, private, lightweight group calling tool',
          applicationCategory: 'CommunicationApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        }
      };
      let script = document.head.querySelector('script[data-jsonld="zippcall"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('data-jsonld', 'zippcall');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(ld);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="zippcall-page bg-white text-gray-900">
      <Header minimal />
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Zippcall: Fast, Private Group Voice &amp; Video Calls
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-8">
                Lightweight conferencing designed for privacy-first teams, creators, and communities — minimal setup, low latency, and strong privacy controls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg flex items-center justify-center gap-2">
                  Get Started with Zippcall <ChevronRight className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-900 px-8 py-3 text-lg rounded-lg">
                  Learn More
                </Button>
              </div>
            </header>
          </div>
        </section>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Quick Navigation */}
          <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12" aria-label="Article sections">
            <h2 className="text-lg font-bold text-gray-900 mb-4">On This Page</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li><a href="#what-is" className="text-blue-600 hover:text-blue-700 font-medium">What is Zippcall?</a></li>
              <li><a href="#design-goals" className="text-blue-600 hover:text-blue-700 font-medium">Key Design Goals</a></li>
              <li><a href="#features" className="text-blue-600 hover:text-blue-700 font-medium">Core Features</a></li>
              <li><a href="#security" className="text-blue-600 hover:text-blue-700 font-medium">Security Model</a></li>
              <li><a href="#deployment" className="text-blue-600 hover:text-blue-700 font-medium">Deployment Options</a></li>
              <li><a href="#faq" className="text-blue-600 hover:text-blue-700 font-medium">FAQ</a></li>
            </ul>
          </nav>

          {/* What is Zippcall */}
          <section id="what-is" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is Zippcall?</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Zippcall is a streamlined <strong>voice and video calling tool</strong> that focuses on speed, minimal resource usage, and user privacy. Unlike feature-heavy platforms that bundle recording, analytics, and cloud storage, Zippcall zeroes in on the core experience: reliable, real-time audio and video for small to medium-sized groups. The result is a responsive call with fewer distractions, faster connection times, and predictable behavior on limited hardware and unreliable networks.
              </p>
              <p>
                Built with modern web standards like WebRTC where appropriate, Zippcall optimizes codecs, simplifies the user interface, and provides mechanisms to reduce data exposure. It's a great fit for teams that want a no-friction calling experience without surrendering control of their communications to large cloud providers.
              </p>
            </div>
          </section>

          {/* Key Design Goals */}
          <section id="design-goals" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Key Design Goals</h2>
            <p className="text-lg text-gray-700 mb-8">The Zippcall design centers on several guiding principles that shape every product decision:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600" /> Speed
                </h3>
                <p className="text-gray-700">Connect quickly; reduce call setup time and handshake latency.</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="h-5 w-5 text-indigo-600" /> Privacy
                </h3>
                <p className="text-gray-700">Minimize telemetry and avoid centralized storage of call metadata whenever feasible.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" /> Reliability
                </h3>
                <p className="text-gray-700">Graceful degradation on poor networks — prioritize voice quality over high-bandwidth video when necessary.</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="h-5 w-5 text-amber-600" /> Simplicity
                </h3>
                <p className="text-gray-700">Intuitive interface with only the essential controls: mute, camera, screen share, and participant list.</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded md:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="h-5 w-5 text-purple-600" /> Compatibility
                </h3>
                <p className="text-gray-700">Run well on desktops, laptops, and recent mobile browsers without requiring heavy native installs.</p>
              </div>
            </div>
          </section>

          {/* Core Features */}
          <section id="features" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Core Features of Zippcall</h2>
            <p className="text-lg text-gray-700 mb-8">Zippcall focuses on core features that matter for day-to-day conversations and small group collaboration.</p>

            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Fast Join and Minimal Friction</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users can create and join rooms with a single link. No mandatory account is required for casual meetings, while optional account features enable persistent identity and meeting history if chosen. The quick-join experience reduces friction for guests and external collaborators.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Adaptive Media Prioritization</h3>
                <p className="text-gray-700 leading-relaxed">
                  Zippcall adapts to network conditions by prioritizing audio over video when bandwidth drops. This improves conversational continuity and reduces dropped calls. Video frames are adjusted dynamically to balance resolution and framerate against available bandwidth, ensuring that conversations remain smooth on constrained networks.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Local-First Media Handling</h3>
                <p className="text-gray-700 leading-relaxed">
                  Where possible, media streams are peer-to-peer to reduce server load and exposure of raw media to third parties. For multi-party rooms, selective forwarding units (SFUs) can be used in trusted deployments to optimize bandwidth usage while still allowing server operators to avoid storing media beyond the live session.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">4. Simple Screen Share &amp; Collaboration</h3>
                <p className="text-gray-700 leading-relaxed">
                  Share your screen with one click for demos or walkthroughs. Zippcall supports single-window or full-screen sharing and offers a low-latency option for presentations. Basic annotations and follow-along controls make it easy for presenters to guide an audience in small meetings.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">5. Lightweight UI for Focused Calls</h3>
                <p className="text-gray-700 leading-relaxed">
                  The interface emphasizes participant video, speaker detection, and easy muting. Advanced features like breakout rooms or automated transcription are intentionally excluded from the base product to maintain low cognitive load and fast performance.
                </p>
              </div>

              <div className="pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">6. Optional End-to-End Encryption</h3>
                <p className="text-gray-700 leading-relaxed">
                  For users who require stronger privacy guarantees, Zippcall offers optional <strong>end-to-end encryption</strong> for audio and video streams. When enabled, media is encrypted end-to-end in the browser so even relay infrastructure cannot decode the streams. This option is ideal for sensitive conversations where confidentiality is critical.
                </p>
              </div>
            </div>
          </section>

          {/* Security Model */}
          <section id="security" className="mb-16 scroll-mt-20 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Security Model</h2>
            <p className="text-lg text-gray-700 mb-8">Security for real-time communication focuses on three layers: transport security, media encryption, and metadata minimization.</p>
            
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <strong className="text-gray-900">Transport Security:</strong>
                  <span className="text-gray-700"> All signaling and control channels use TLS to ensure confidentiality and integrity of session setup information.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <strong className="text-gray-900">Media Encryption:</strong>
                  <span className="text-gray-700"> WebRTC's SRTP is used for media encryption by default; optional end-to-end encryption provides extra assurances where required.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <strong className="text-gray-900">Metadata Minimization:</strong>
                  <span className="text-gray-700"> The system avoids retaining call logs beyond what is necessary for operations. Where meeting persistence is enabled, data is stored encrypted and access-controlled by the user or organization.</span>
                </div>
              </li>
            </ul>
            
            <p className="text-gray-700 mt-8">Operators planning a private deployment should host signaling and SFU components within their own infrastructure to ensure administrative control over meeting routing and to comply with internal privacy policies.</p>
          </section>

          {/* Deployment */}
          <section id="deployment" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Deployment &amp; Hosting Options</h2>
            <p className="text-lg text-gray-700 mb-8">Zippcall can be deployed in several configurations to match organizational needs:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Self-Hosted</h3>
                <p className="text-gray-700">For the strongest control, run Zippcall signaling and optional SFU components on your own servers or in your private cloud account. This eliminates third-party dependencies and allows you to enforce access controls, retention policies, and network-level protections.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Managed Hosting</h3>
                <p className="text-gray-700">If you prefer a hands-off approach, managed hosting can provide uptime guarantees and simplified scaling. Choose providers that offer transparent privacy policies and clear data handling practices.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hybrid</h3>
                <p className="text-gray-700">A hybrid setup routes signaling through a managed service while keeping media peer-to-peer or relayed only through a self-hosted SFU, balancing convenience and privacy.</p>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="mb-16 scroll-mt-20 bg-blue-50 p-8 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Zippcall vs. Large Conferencing Platforms</h2>
            <p className="text-lg text-gray-700 mb-6">
              Big-name conferencing platforms are feature-rich but often come with trade-offs: heavy resource usage, pervasive analytics, and broad attack surfaces due to integrations. Zippcall differentiates by focusing on what matters for many users: fast join times, predictable media quality, and minimized data exposure.
            </p>
            
            <div className="bg-white rounded border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Use Zippcall when you want:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Low-latency calls for small teams or podcasters</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reduced complexity for guest participants</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Minimal third-party telemetry and privacy-respecting defaults</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Getting Started with Zippcall</h2>
            <ol className="space-y-4 list-decimal list-inside text-lg text-gray-700">
              <li className="ml-4"><strong>Create a room</strong> and share the link with participants.</li>
              <li className="ml-4"><strong>Test your microphone and camera</strong> using the in-browser preview tools before joining live calls.</li>
              <li className="ml-4"><strong>Choose whether to enable end-to-end encryption</strong> for the session.</li>
              <li className="ml-4"><strong>Use the adaptive media mode</strong> for challenging networks to prioritize audio quality.</li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions About Zippcall</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do participants need an account?</h3>
                <p className="text-gray-700 text-lg">No — casual participants can join via link. Persistent identity and host controls require optional accounts when an organization needs governance.</p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Is video recorded by default?</h3>
                <p className="text-gray-700 text-lg">No. Zippcall does not record sessions by default. If recording is enabled, the organizer is responsible for consent and secure storage.</p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I self-host Zippcall for the highest privacy?</h3>
                <p className="text-gray-700 text-lg">Yes. Self-hosting provides the best control over routing, logging, and data retention. It's recommended for organizations with strict compliance or privacy requirements.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What are the bandwidth requirements for Zippcall?</h3>
                <p className="text-gray-700 text-lg">Zippcall is designed for minimal bandwidth usage. Use wired connections where possible, disable HD video when bandwidth is limited, and encourage participants to mute when not speaking to reduce upstream bandwidth needs.</p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 md:p-12 text-white text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 text-blue-50">
              Zippcall offers a lightweight, privacy-first approach to group calling. Combined with strategic SEO and quality backlinks, you can amplify your project's visibility and reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-semibold">
                Try Zippcall Now
              </Button>
              <a 
                href="https://backlinkoo.com/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg rounded-lg font-semibold transition"
              >
                Amplify Your Visibility with Backlink ∞
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
