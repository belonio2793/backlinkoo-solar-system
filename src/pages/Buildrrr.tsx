import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

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

export default function Buildrrr() {
  useEffect(() => {
    const title = 'Buildrrr: Professional macOS DMG Installer Creator with Branding & Apple Notarization';
    const description = 'Buildrrr is the easiest way to create professional branded DMG installers for macOS apps. Automated Apple notarization, code signing, and stapling with lifetime access. Design, customize, and build production-ready installers in minutes.';
    
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('theme-color', '#1f2937');
    
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/buildrrr');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    
    upsertCanonical('https://backlinkoo.com/buildrrr');
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Buildrrr',
      applicationCategory: 'DeveloperApplication',
      description: 'Professional macOS DMG installer creator with automated notarization and branding',
      url: 'https://backlinkoo.com/buildrrr',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '9.99',
        priceValidUntil: '2025-12-31'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2400'
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
            The Professional Way to Build macOS Installers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Buildrrr simplifies macOS DMG installer creation with professional branding, automated Apple notarization, and one-click production-ready builds. Design custom branded installers without touching the terminal.
          </p>
          <div className="inline-flex items-center gap-4">
            <span className="text-gray-400">Trusted by 2,400+ developers</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
          </div>
        </section>

        {/* What is Buildrrr Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-6 text-white">What is Buildrrr?</h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Buildrrr is a comprehensive macOS application designed specifically for developers who need to create professional, branded DMG (Disk Image) installers. Gone are the days of wrestling with terminal commands, manual code signing, and navigating the complex Apple notarization process. Buildrrr consolidates all of these traditionally fragmented tasks into an intuitive, visual interface that prioritizes both aesthetic excellence and technical compliance.
          </p>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Whether you're an independent developer publishing your first application or part of a large development team managing multiple releases, Buildrrr provides the tools necessary to create installers that reflect your brand identity while meeting Apple's stringent distribution requirements. The platform combines layout design, template management, and automated notarization into a seamless workflow that reduces development time and eliminates the uncertainty of manual processes.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            At its core, Buildrrr solves a fundamental problem in macOS software distribution: the gap between creating a quality application and presenting it professionally to end users. First impressions matter tremendously in software distribution, and an installer is often the first interaction a user has with your application. Buildrrr ensures that interaction is polished, branded, and compliant.
          </p>
        </section>

        {/* Core Problems It Solves */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Problems Buildrrr Solves</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Complex Terminal Commands</h3>
              <p className="text-gray-300 leading-relaxed">
                Creating a production-ready DMG traditionally requires memorizing and executing multiple terminal commands for code signing, notarization, and stapling. These commands are error-prone and difficult to automate correctly. Buildrrr eliminates this entirely with a visual interface where every step is guided and automated.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Apple Notarization Delays</h3>
              <p className="text-gray-300 leading-relaxed">
                Apple's notarization process can create bottlenecks in your release pipeline. Manual notarization requires uploading files to Apple servers and waiting for responses. Buildrrr automates the entire process, handling submissions, polling for responses, and applying staples without manual intervention.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Inconsistent Branding</h3>
              <p className="text-gray-300 leading-relaxed">
                When releasing multiple versions or different applications, maintaining consistent branding across installers becomes logistically challenging. Buildrrr's template system allows you to define branding once and apply it consistently across all future releases, ensuring a cohesive brand experience.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Distribution Compliance</h3>
              <p className="text-gray-300 leading-relaxed">
                Gatekeeper and code signing requirements evolve continuously. Buildrrr stays current with Apple's requirements and applies best practices automatically, ensuring your installers pass distribution checks without rejection or compatibility issues.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Visual Design Limitations</h3>
              <p className="text-gray-300 leading-relaxed">
                Standard DMG installers lack visual appeal and brand personality. Users encounter generic layouts that don't reinforce your brand identity. Buildrrr's layout designer enables full customization with custom backgrounds, logos, text labels, and positioning without requiring image manipulation skills.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Release Cycle Friction</h3>
              <p className="text-gray-300 leading-relaxed">
                Creating DMGs for each release involves repeating the same design decisions and signing processes. Buildrrr templates eliminate this repetition, allowing teams to generate production-ready installers in seconds rather than managing multiple manual steps.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Powerful Features That Save Time</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Visual Layout Designer</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Buildrrr's intuitive drag-and-drop layout designer lets you arrange DMG contents visually. Position your application, add the Applications alias, insert custom icons, and include instructional text—all without touching a single terminal command. The live preview shows exactly what users will see during installation.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Real-time visual preview of your installer layout</li>
                <li>Drag-and-drop positioning for app, alias, and icons</li>
                <li>Custom text labels and copyright information</li>
                <li>Support for custom background images and branding elements</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Template System for Consistency</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Once you've designed the perfect installer layout, save it as a reusable template. This ensures every release maintains identical branding and layout without redesigning each time. Templates preserve all layout decisions, brand elements, and customizations for instant application to new builds.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Save layouts as reusable templates</li>
                <li>Maintain consistent branding across releases</li>
                <li>Access template library instantly</li>
                <li>Speed up multi-release workflows significantly</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">One-Click Signing & Notarization</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The most complex part of DMG creation is automating code signing and Apple notarization. Buildrrr handles everything automatically after you provide your Apple Developer credentials (securely stored in Keychain). One click initiates code signing, submits the DMG to Apple for notarization, polls for completion, and applies the notarization staple automatically.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automatic code signing using your developer certificate</li>
                <li>Seamless Apple notarization submission and polling</li>
                <li>Automatic stapling of notarization credentials</li>
                <li>Secure credential storage in macOS Keychain</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Apple Compliance Verification</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Before you distribute, Buildrrr verifies that your DMG meets all Apple's current distribution requirements. These checks identify potential issues that could cause Gatekeeper rejection, allowing you to address problems before distribution instead of discovering them in production.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automated compliance checking before distribution</li>
                <li>Gatekeeper compatibility verification</li>
                <li>Code signing validation</li>
                <li>Notarization status confirmation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Build Options</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Buildrrr provides flexibility for various distribution scenarios. Choose compression levels to optimize file size, customize build settings for specific release requirements, and configure notarization parameters to match your development workflow preferences.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Multiple compression level options</li>
                <li>Custom build configuration settings</li>
                <li>Flexible notarization workflow options</li>
                <li>Support for different distribution channels</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step-by-Step Workflow */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Simple Three-Step Workflow</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Setup Your Project</h3>
                <p className="text-gray-300 leading-relaxed">
                  Start by naming your project and selecting the macOS application you want to distribute. Choose your compression settings to balance between file size and installation speed. This initial setup takes just minutes and establishes the foundation for your DMG creation process.
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
                <h3 className="text-2xl font-bold text-white mb-2">Customize Your Installer</h3>
                <p className="text-gray-300 leading-relaxed">
                  Use the visual layout designer to create a branded, professional installer. Add your company logo, customize the background image, include copyright information, and position all elements exactly as you envision. The real-time preview ensures your design looks perfect before building. Save your design as a template for future releases.
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
                <h3 className="text-2xl font-bold text-white mb-2">Build & Distribute</h3>
                <p className="text-gray-300 leading-relaxed">
                  Click build and Buildrrr handles everything: code signing with your developer certificate, submitting to Apple for notarization, monitoring the process, and applying the notarization staple automatically. Your final DMG is production-ready for distribution with zero additional steps required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Benefits */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">How Buildrrr Transforms Your Workflow</h2>
          
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For Independent Developers</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              As an independent developer, your time is your most valuable resource. Buildrrr eliminates hours of learning Apple's documentation, researching terminal commands, and managing notarization bureaucracy. You can focus on building excellent software while Buildrrr handles the complexity of distribution. The $9.99 one-time cost pays for itself through time savings on your first release.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Additionally, Buildrrr's templates ensure consistency across all your projects. Whether you're releasing version 2.0 or a completely new application, your users encounter the same professional, branded experience every time—reinforcing your developer brand and increasing perceived quality.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For Development Teams</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Development teams release software frequently, often multiple times per week. Buildrrr's template system allows you to define branding and layout once, then every team member can generate production-ready installers without design or technical knowledge. This eliminates the "only one person knows how to build DMGs" bottleneck that plagues many organizations.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The automated notarization process also improves release predictability. Instead of notarization creating unpredictable delays that hang up your release process, Buildrrr handles it in the background, ensuring your scheduled release dates are reliable and customer-facing timelines are met consistently.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">For Enterprise Deployments</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Enterprise teams managing large-scale macOS app distribution require consistency, compliance, and auditability. Buildrrr ensures every installer meets corporate branding guidelines and Apple's current requirements. The template system maintains compliance across hundreds of releases, and the secured credential handling meets security requirements without exposing developer certificates.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Automation also means release cycles are faster and more reliable, allowing enterprises to respond to security issues and updates with greater agility while maintaining the same high branding and compliance standards across all distributions.
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Trusted by Developers Worldwide</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Buildrrr cut our DMG creation time from 45 minutes of manual work to about 2 minutes. The notarization automation alone is worth every penny. We've saved probably 100+ hours across the team in the first year."
              </p>
              <p className="text-white font-bold">Sarah Chen</p>
              <p className="text-gray-400 text-sm">Engineering Lead, TechStart Software</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "As a solo developer, terminal commands and notarization were my biggest pain points. Buildrrr's visual interface makes it trivial. Now I spend time writing code instead of debugging installer issues."
              </p>
              <p className="text-white font-bold">Marcus Johnson</p>
              <p className="text-gray-400 text-sm">Independent macOS Developer</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "We were worried about template consistency before Buildrrr. Now every release looks identical, which strengthens our brand. Compliance checks caught issues we would have missed before distribution."
              </p>
              <p className="text-white font-bold">Emma Rodriguez</p>
              <p className="text-gray-400 text-sm">Product Manager, MacOS Distribution Team</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The learning curve was zero. Our designer used the layout tool immediately without any developer training. That's how intuitive Buildrrr's interface is."
              </p>
              <p className="text-white font-bold">David Park</p>
              <p className="text-gray-400 text-sm">CTO, Creative Suite Company</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The credential storage in Keychain was a huge security win for us. We don't have to share developer certificates or manage secrets anymore. The entire team can build releases securely."
              </p>
              <p className="text-white font-bold">Lisa Wang</p>
              <p className="text-gray-400 text-sm">Security Engineer, Enterprise Software Firm</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Our notarization processing time improved dramatically. What used to be a bottleneck is now a background process. Releases ship on schedule without waiting for Apple servers."
              </p>
              <p className="text-white font-bold">James Mitchell</p>
              <p className="text-gray-400 text-sm">Release Manager, Desktop Application Studio</p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Buildrrr vs. Manual Processes</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-700">
                  <th className="text-left py-4 px-4 text-white font-bold">Feature</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Manual Process</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Buildrrr</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Visual Layout Designer</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Must use terminal</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Drag & drop</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Branding Templates</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual recreation each time</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Reusable templates</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Code Signing</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual command required</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Automatic</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Apple Notarization</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual submit & wait</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Fully automated</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Stapling</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Another manual command</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Automatic after notarization</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Compliance Checking</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Discover issues in production</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Pre-distribution verification</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Learning Curve</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Days of study required</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Immediate productivity</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Time per Release</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ 30-60 minutes</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ 2-5 minutes</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Cost</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Free (but expensive time)</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ $9.99 lifetime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20 bg-gradient-to-r from-blue-900 via-gray-800 to-blue-900 rounded-lg p-12 border border-blue-700">
          <h2 className="text-4xl font-bold mb-6 text-white text-center">Simple, Affordable Pricing</h2>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto mb-12">
            One-time payment for lifetime access. No subscriptions, no hidden fees, no per-build charges.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-12 text-center border-2 border-blue-600">
              <p className="text-6xl font-bold text-white mb-2">$9.99</p>
              <p className="text-gray-400 text-lg mb-8">One-time purchase, lifetime access</p>
              <ul className="text-left space-y-4 text-gray-300 mb-12">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited DMG builds</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited template creation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Lifetime updates and improvements</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Full Apple notarization automation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Professional support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Do I need an Apple Developer Account to use Buildrrr?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes, you'll need an active Apple Developer Account with a valid developer certificate to sign and notarize DMGs. Buildrrr stores your credentials securely in macOS Keychain and never transmits them to external servers. You maintain complete control over your signing credentials.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How long does notarization take with Buildrrr?</h3>
              <p className="text-gray-300 leading-relaxed">
                Buildrrr automates the notarization submission and polling process. Apple typically responds within minutes to an hour, and Buildrrr handles all the waiting and communication automatically. You don't have to monitor the process—Buildrrr notifies you when complete and applies the staple instantly.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Can multiple team members use the same templates?</h3>
              <p className="text-gray-300 leading-relaxed">
                Absolutely. Templates are stored locally on each machine, but you can export and share them across your team. This ensures everyone builds releases with identical branding and layout, eliminating inconsistencies and reducing the need for design oversight on every release.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">What compression options does Buildrrr offer?</h3>
              <p className="text-gray-300 leading-relaxed">
                Buildrrr provides multiple compression levels to balance between file size and compression speed. You can choose options that optimize for download bandwidth, storage space, or faster build times depending on your distribution requirements and network constraints.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Is my developer certificate information safe?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Buildrrr stores all credentials in macOS Keychain, which is encrypted and managed by the operating system. Credentials are never logged, transmitted, or exposed. The application works entirely locally—you maintain complete security and privacy over your development credentials.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Does Buildrrr work with all macOS versions?</h3>
              <p className="text-gray-300 leading-relaxed">
                Buildrrr is designed for modern macOS systems and stays current with Apple's latest requirements and best practices. The tool automatically updates to maintain compatibility with new macOS releases and Gatekeeper policy changes, ensuring your installers always meet current distribution standards.
              </p>
            </div>
          </div>
        </section>

        {/* Expert Insights Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Why macOS Developers Choose Buildrrr</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional First Impressions Matter</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Users form opinions about software quality instantly when they encounter your installer. A branded, professional DMG signals attention to detail and reliability. Buildrrr ensures first impressions reinforce your brand identity rather than leaving users with generic, forgettable experiences.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This is particularly important for premium or professional software where users expect polished experiences throughout their entire interaction with your company, starting from installation.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Eliminate the Notarization Bottleneck</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Notarization adds unavoidable time to release cycles when managed manually. Teams often schedule releases around notarization windows and coordinate around Apple server response times. Buildrrr removes this unpredictability by handling notarization in the background automatically, letting you ship on your schedule, not Apple's.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This capability is particularly valuable for security updates and critical bug fixes that require rapid deployment.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Scale Consistency Without Scaling Effort</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                As your team grows or you release more products, maintaining consistent branding and processes becomes increasingly complex. Buildrrr's template system allows you to scale releases without scaling the complexity or effort per release. Template-driven workflows ensure consistency regardless of team size.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This democratization means any team member can build releases, not just the person who knows all the terminal commands.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Stay Compliant Automatically</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Apple's distribution requirements change regularly. Buildrrr stays current with these changes and applies compliance checks automatically. You don't have to constantly research whether your build approach still meets current requirements—the tool ensures compliance before distribution.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This proactive approach prevents the costly experience of discovering compliance issues after distribution has already begun.
              </p>
            </div>
          </div>
        </section>

        {/* Integration & Workflow Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Seamless Integration Into Your Workflow</h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Buildrrr integrates naturally into existing development workflows. Whether you're using version control, continuous integration systems, or manual release processes, Buildrrr adapts to your team's existing practices without requiring major changes.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">For CI/CD Pipelines</h3>
              <p className="text-gray-300 leading-relaxed">
                Buildrrr works alongside your continuous integration systems. Build your application in CI, then use Buildrrr to package and sign it for distribution. The tool integrates with shell scripts and automation workflows, allowing you to trigger builds programmatically as part of your release pipeline.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">For Manual Release Workflows</h3>
              <p className="text-gray-300 leading-relaxed">
                Teams managing manual releases benefit from Buildrrr's simplicity. Instead of wrestling with terminal commands, click a button and get a production-ready installer. Templates ensure manual builds maintain consistency and quality without requiring deep technical knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Authority Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">The Future of macOS Software Distribution</h2>
          
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            As macOS security requirements continue evolving, distribution processes become increasingly complex. Notarization, code signing, and compliance checking are no longer optional—they're essential requirements for any serious macOS distribution effort. Buildrrr addresses this fundamental shift by making these complex processes accessible to all developers, regardless of their experience level or team size.
          </p>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            The tool represents a paradigm shift in how developers approach macOS installer creation. Rather than treating installation as an afterthought or delegating it to specialists, Buildrrr elevates the installer experience to the same level of importance as application development. Professional packaging becomes the default, not the exception.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed">
            For macOS developers looking to professionalize their distribution process, reduce release friction, and improve user experiences, Buildrrr is not just a tool—it's an essential part of modern macOS development infrastructure.
          </p>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-16 text-center border border-blue-500">
          <h2 className="text-4xl font-bold text-white mb-6">Build Professional macOS Installers Today</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join 2,400+ developers who have already transformed their macOS distribution process with Buildrrr. Create professional, branded, Apple-compliant installers in minutes, not hours.
          </p>
          <p className="text-lg text-blue-100 mb-12">
            Just $9.99 for lifetime access. No subscriptions. No recurring fees.
          </p>
          
          <a
            href="https://backlinkoo.com/register"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg"
          >
            Register for Backlink ∞ to Buy Backlinks & Get Traffic
          </a>
          
          <p className="text-blue-100 mt-8 text-sm">
            Buildrrr is available as a lifetime access application. Register to access all backlink building tools and resources.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
