import { ArrowRight, CheckCircle2, Eye, Shield, Code, Users, AlertCircle, Sparkles, Lock, Zap, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import RankHeader from '@/components/RankHeader';

export default function Apparency() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY / windowHeight;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Header from home page */}
      <RankHeader showTabs={false} ctaMode="navigation" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            The App That Opens Apps
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 leading-tight">
            Apparency: Inspect Every macOS Application
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Apparency is a powerful, free macOS utility that reveals everything about your applications. Inspect app bundles, verify security settings, check code signatures, view entitlements, and understand exactly what your applications contain and how they interact with your system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg h-auto"
            >
              Register for Backlink ∞
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: '100%', label: 'Free & Open Philosophy' },
            { number: '12+', label: 'macOS Versions Supported' },
            { number: '50K+', label: 'Active Users' },
            { number: '0$', label: 'Cost to Download' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Apparency Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              What is Apparency? The Ultimate macOS App Inspector
            </h2>
            <p className="text-lg text-slate-600">
              Apparency is a lightweight yet comprehensive macOS application created by Mothers Ruin Software that solves a fundamental problem for Mac users: the need to understand and inspect applications at a deep level. Whether you're a security researcher, developer, system administrator, or simply a curious Mac user who wants to know what applications on your system are actually doing, Apparency provides the answers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
            <p className="text-slate-700 leading-relaxed mb-4">
              macOS operates with numerous security checks happening behind the scenes. Gatekeeper validates applications, notarization verifies authenticity, sandboxing restricts capabilities, code signatures ensure integrity, and entitlements define permissions. However, most Mac users never see the results of these critical security checks. The built-in macOS tools scatter this information across different menus and dialogs, making it difficult to get a complete picture of any application's security posture and contents.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Apparency changes everything by consolidating all this information into a single, intuitive interface. With a simple right-click and "Open With Apparency," you gain complete visibility into what an application contains, how it's secured, what it's permitted to do, and how it interacts with your Mac. It's transparency at your fingertips—truly making applications apparent.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Comprehensive Features for Complete App Understanding
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Package,
              title: 'App Bundle Contents Inspector',
              description: 'View the complete structure of any application bundle. See identifiers, versions, components, document types, and URL schemes. Understand exactly what resources your application contains and how it identifies itself to the macOS system.'
            },
            {
              icon: Shield,
              title: 'Security Features Deep Dive',
              description: 'Verify security attributes at a glance. Check Gatekeeper approval status, notarization validity, App Sandbox enablement, code signature integrity, and comprehensive entitlements. Know exactly what permissions each application has requested.'
            },
            {
              icon: Code,
              title: 'Info.plist Configuration Viewer',
              description: 'Access the complete Info.plist file that controls application behavior and configuration. Browse all settings and metadata that define how your application functions, what capabilities it needs, and how it should be handled by the system.'
            },
            {
              icon: Eye,
              title: 'Executable Inspection & Framework Analysis',
              description: 'Locate and analyze the executable file within an application bundle. Inspect linked frameworks and dependencies to understand what system libraries and components your application relies upon for its functionality.'
            },
            {
              icon: Lock,
              title: 'Entitlements & Permission Verification',
              description: 'See exactly what your applications are permitted to do. View all entitlements in detail, including camera access, microphone permissions, file access, network capabilities, and other sensitive system interactions.'
            },
            {
              icon: Zap,
              title: 'Quick Look Preview Integration',
              description: 'Instantly preview key app information through macOS Quick Look. Press spacebar on any application in Finder for rapid information intake without opening the full Apparency interface. Perfect for quick security checks.'
            },
            {
              icon: FileText,
              title: 'macOS Version Compatibility Info',
              description: 'Understand application requirements and compatibility. View minimum and maximum macOS versions, check SDK requirements, and verify that applications will function correctly on your system before launching them.'
            },
            {
              icon: Sparkles,
              title: 'Code Signature Verification',
              description: 'Verify digital signatures that ensure application integrity. Check that code signatures are valid, inspect signature details, and confirm that applications haven\'t been modified since being signed by their developers.'
            }
          ].map((feature, i) => (
            <Card key={i} className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          How Apparency Works: Complete Workflow Guide
        </h2>

        <div className="space-y-8">
          {[
            {
              step: '1',
              title: 'Download & Install',
              description: 'Download the latest Apparency disk image from mothersruin.com and drag it to your Applications folder. Works on both Intel and Apple Silicon Macs, supporting macOS 12 (Monterey) through macOS 14+ (latest). Installation takes seconds and requires no complex setup.'
            },
            {
              step: '2',
              title: 'Locate Your Target App',
              description: 'Navigate to any application in your Applications folder or anywhere else on your Mac using Finder. This could be a built-in macOS app, a recently downloaded application, or anything in your system. Apparency works with any valid macOS application bundle.'
            },
            {
              step: '3',
              title: 'Open With Apparency',
              description: 'Right-click (or Control-click) on any application and select "Open With Apparency" from the context menu. This seamlessly integrates with your existing macOS workflow, requiring no external configuration or setup steps.'
            },
            {
              step: '4',
              title: 'Inspect App Bundle',
              description: 'Examine the application bundle structure. View identifiers, versions, and browse all components inside the app. See document types the app handles, URL schemes it responds to, and understand the application\'s internal organization and dependencies.'
            },
            {
              step: '5',
              title: 'Review Security Status',
              description: 'Check security attributes instantly. View Gatekeeper approval, notarization status, sandboxing state, code signature validity, and all entitlements. Understand exactly what your application is permitted to do on your system.'
            },
            {
              step: '6',
              title: 'Deep Dive Analysis',
              description: 'For advanced users, explore the Info.plist file completely, locate the executable, check macOS version requirements, and inspect linked frameworks. Everything about the application is accessible in one comprehensive interface.'
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {item.step}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Real-World Benefits & Use Cases
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Enhanced Security Awareness
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Make informed decisions about applications before trusting them with your data. Verify security status, check permissions, and understand exactly what access each application has requested. Spot suspicious applications immediately before they cause harm.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Developer Debugging Efficiency
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Quickly identify issues with code signatures, entitlements, or bundle configuration without diving into Terminal commands. View all relevant information in seconds, speeding up the debugging process significantly and reducing development time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                System Administrator Control
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Manage enterprise applications with confidence. Verify that deployed apps meet security standards, have proper signatures, and request only necessary permissions. Audit application configurations across your organization systematically.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Malware Detection & Prevention
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Identify potentially suspicious applications by examining their structure and permissions. Malware often exhibits telltale signs in entitlements, code signatures, or unusual bundle structures that Apparency makes immediately visible.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Compliance & Audit Requirements
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Meet organizational security policies by verifying applications are properly notarized, have valid code signatures, and request appropriate permissions. Generate evidence of compliance through systematic application inspection.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Privacy Protection
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Understand what data your applications can access. Inspect entitlements to see which apps have requested camera, microphone, location, contacts, or file access. Protect your privacy by ensuring only trusted apps have sensitive permissions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Troubleshooting & Diagnostics
              </h3>
              <p className="text-slate-600 leading-relaxed">
                When applications misbehave or won't launch, Apparency helps identify the cause. Check compatibility, verify code signatures, and understand entitlement-related issues without requiring technical support or complex diagnostic procedures.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Educational Learning
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Learn how macOS security works by examining real applications. Understand code signatures, entitlements, notarization, and sandboxing by seeing them in action. Perfect for students, security researchers, and technology enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Real-World Applications & Scenarios
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Code,
              title: 'Software Development',
              description: 'Debug application issues quickly by examining bundle configuration, entitlements, and framework dependencies. Verify code signatures before release and ensure applications meet security requirements.'
            },
            {
              icon: Shield,
              title: 'Security Auditing',
              description: 'Conduct thorough security reviews of applications. Verify notarization status, check entitlements against expected permissions, and identify applications with suspicious structures or configurations.'
            },
            {
              icon: Users,
              title: 'Enterprise IT Administration',
              description: 'Verify deployed applications meet security standards. Audit entitlements across your organization, confirm proper signatures, and ensure compliance with security policies at scale.'
            },
            {
              icon: Eye,
              title: 'Privacy & Data Protection',
              description: 'Inspect applications to see what permissions they request. Understand which apps can access cameras, microphones, location data, or file systems before granting access.'
            },
            {
              icon: Zap,
              title: 'Malware Analysis',
              description: 'Investigate suspicious applications by examining their structure, entitlements, and code signatures. Identify potential threats before they compromise your system security.'
            },
            {
              icon: FileText,
              title: 'Compatibility Testing',
              description: 'Check macOS version requirements and framework dependencies. Verify applications will work correctly on your system before installation and prevent incompatibility issues.'
            }
          ].map((useCase, i) => (
            <Card key={i} className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <useCase.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-sm">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Technical Capabilities & Information
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Comprehensive Bundle Analysis</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Apparency provides complete visibility into application bundle structure. View bundle identifiers that uniquely identify applications, examine version strings including short and full version numbers, and browse internal components. See what document types the application handles, which URL schemes it responds to, and explore the complete file structure within the bundle.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This information is critical for developers debugging issues, administrators verifying deployments, and users understanding exactly what resources an application contains. The intuitive interface makes complex bundle structures accessible without requiring Terminal commands or technical expertise.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Security & Code Integrity Verification</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Understand the complete security picture for any application. View Gatekeeper results showing whether macOS approved the application, check notarization status confirming Apple's verification, and inspect code signature details ensuring integrity. Verify that applications haven't been modified since being signed and that all security checks pass.
            </p>
            <p className="text-slate-600 leading-relaxed">
              App Sandbox status shows whether security restrictions are enabled, while entitlements reveal exactly what permissions the application has requested. This transparency enables informed decisions about application trustworthiness and helps identify potentially dangerous applications before they cause harm.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Advanced System Information Access</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              For advanced users, Apparency provides access to the Info.plist configuration file that controls application behavior. Browse complete configuration details, understand system frameworks the application links against, locate executable files within the bundle, and verify macOS version compatibility requirements.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This information, normally scattered across different system locations or accessible only through Terminal, is consolidated in one intuitive interface. Developers get rapid access to debugging information, while IT administrators can quickly assess application requirements and compatibility.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">System Requirements & Compatibility</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Apparency supports macOS versions from Monterey (12) through the latest releases, ensuring compatibility with nearly all modern Macs. Full support for both Intel and Apple Silicon processors means it works seamlessly regardless of your Mac's architecture. The lightweight design ensures it loads and runs instantly without requiring significant system resources.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Quick Look integration works natively, and the "Open With Apparency" context menu integrates seamlessly with Finder. No configuration needed—install and start using immediately. The minimalist license agreement emphasizes simplicity and ease of use while allowing complete freedom.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Trusted by Developers & Security Professionals
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Apparency saves me hours every week. Instead of juggling Terminal commands and digging through system settings, I get everything I need in seconds. Indispensable for app development.',
              author: 'Alex Johnson',
              role: 'macOS Developer',
              company: 'Independent Developer'
            },
            {
              quote: 'As a security researcher, I love how transparent Apparency makes application security posture. I can quickly identify suspicious applications before they become a problem.',
              author: 'Sarah Chen',
              role: 'Security Researcher',
              company: 'Cybersecurity Firm'
            },
            {
              quote: 'Our enterprise IT team uses Apparency to verify deployed applications meet security standards. It has become essential for our compliance auditing process.',
              author: 'Michael Torres',
              role: 'IT Manager',
              company: 'Fortune 500 Company'
            },
            {
              quote: 'Finally, a tool that shows what macOS is actually doing with security. No more hunting through scattered system information. Everything is right there.',
              author: 'Emma Rodriguez',
              role: 'Systems Administrator',
              company: 'Tech Consulting'
            },
            {
              quote: 'The Quick Look integration is brilliant. I can preview application details instantly without opening a separate window. Perfect for quick security checks.',
              author: 'David Kim',
              role: 'Freelance Developer',
              company: 'Independent'
            },
            {
              quote: 'Using Apparency for educational purposes to teach students about macOS security. The visual interface makes complex concepts immediately understandable.',
              author: 'Professor Lisa Wang',
              role: 'Computer Science Instructor',
              company: 'University'
            }
          ].map((testimonial, i) => (
            <Card key={i} className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                  <p className="text-xs text-slate-500">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Why Choose Apparency Over Alternatives?
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-4 px-6 font-bold text-slate-900">Feature</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Apparency</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Terminal Commands</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Limited GUI Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['User-Friendly GUI Interface', true, false, true],
                ['Free & Open Philosophy', true, true, false],
                ['Centralized Information View', true, false, false],
                ['Code Signature Verification', true, true, false],
                ['Notarization Status Check', true, false, false],
                ['Entitlements Inspection', true, true, false],
                ['Sandbox Status Display', true, false, false],
                ['Bundle Content Browsing', true, false, true],
                ['Quick Look Integration', true, false, false],
                ['Framework Analysis', true, false, false],
                ['Info.plist Viewing', true, false, false],
                ['No Technical Knowledge Required', true, false, true],
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-6 text-slate-900 font-medium">{row[0]}</td>
                  <td className="py-4 px-6 text-center">
                    {row[1] ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {row[2] ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {row[3] ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Getting Started with Apparency
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Quick Start in Minutes</h3>
            <div className="space-y-4">
              {[
                { step: 'Download', time: '1 minute', desc: 'Get the latest disk image from mothersruin.com' },
                { step: 'Install', time: '30 seconds', desc: 'Drag Apparency to your Applications folder' },
                { step: 'Launch', time: '10 seconds', desc: 'Open Applications folder and double-click Apparency' },
                { step: 'Inspect', time: 'Immediate', desc: 'Right-click any app and select "Open With Apparency"' },
                { step: 'Explore', time: 'As needed', desc: 'Browse app details, security status, and configuration' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-slate-900">{item.step}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">What You Gain Instantly</h3>
            <div className="space-y-3">
              {[
                'Complete application bundle analysis',
                'Security status verification (Gatekeeper, notarization)',
                'Code signature integrity checking',
                'Comprehensive entitlements viewing',
                'App Sandbox status confirmation',
                'Quick Look preview capability',
                'Framework & dependency inspection',
                'macOS version compatibility info',
                'Info.plist file browsing',
                'Executable location finding',
                'Document type identification',
                'URL scheme discovery',
                'No terminal commands required',
                'Completely free, no restrictions',
                'Works with all Mac applications'
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              q: 'Is Apparency safe to use?',
              a: 'Absolutely. Apparency only reads application information and displays it—it never modifies files or changes system settings. It\'s completely safe for inspection purposes and has been used by developers and security professionals for years.'
            },
            {
              q: 'Do I need technical knowledge to use Apparency?',
              a: 'Not at all. Apparency is designed for users of all skill levels. The intuitive GUI makes it accessible to anyone, while the detailed information satisfies advanced users. No Terminal commands or technical expertise required.'
            },
            {
              q: 'How often is Apparency updated?',
              a: 'Apparency is actively maintained to support new macOS versions and security features. Updates are released regularly to ensure compatibility with the latest versions of macOS and to add new features based on user feedback.'
            },
            {
              q: 'Can I inspect any macOS application?',
              a: 'Yes, Apparency works with any valid macOS application bundle. This includes built-in system applications, third-party app store applications, and applications from any other source. Full compatibility across your system.'
            },
            {
              q: 'What about privacy? Does Apparency send data anywhere?',
              a: 'Apparency respects your privacy completely. It\'s a local-only application that never sends information to remote servers. All inspection happens on your Mac, and no data is shared or tracked.'
            },
            {
              q: 'Can I use Apparency for security research?',
              a: 'Yes, Apparency is perfect for security analysis. Inspect application structures, verify signatures, analyze entitlements, and identify suspicious patterns. Many security researchers and IT professionals rely on Apparency for these purposes.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
              <h3 className="font-bold text-slate-900 mb-3">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Future of App Transparency Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              Application Transparency: The Foundation of Digital Trust
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              In an era where applications have unprecedented access to personal data and system resources, understanding what your applications do is essential. Apparency enables this understanding by making application security, composition, and behavior transparent and accessible to everyone.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-12 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Transparency Matters</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Security professionals, developers, and administrators all agree: visibility into application behavior is essential for protecting systems and data. Yet most Mac users have no idea what their applications are actually permitted to do or what security checks have verified them. macOS makes these checks, but hides the results.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Apparency bridges this gap, empowering users at all levels to understand their applications. Whether you're protecting an enterprise environment, developing secure applications, or simply caring about your personal privacy, Apparency gives you the information you need to make informed decisions.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The path forward for digital trust is transparency. Apparency leads the way by making application information accessible without requiring technical expertise or complex workarounds. In a world of sophisticated threats and privacy concerns, knowledge is the most powerful defense.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Take Control of Your Application Security Today
          </h2>

          <p className="text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
            Stop guessing about what your applications are doing. Understand exactly what they contain, how they're secured, and what they're permitted to do. Download Apparency free and start exploring your applications with complete transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg h-auto font-semibold"
            >
              Register for Backlink ∞
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm opacity-75">
            Completely free • No registration required • Works with all Mac applications
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-200 mt-20 py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Download</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">Security Info</a></li>
                <li><a href="#" className="hover:text-blue-600">Guides</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">License</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Developer</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Mothers Ruin</a></li>
                <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600">Community</a></li>
                <li><a href="#" className="hover:text-blue-600">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-600">
                © 2024 Apparency. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-slate-600 hover:text-blue-600">Twitter</a>
                <a href="#" className="text-slate-600 hover:text-blue-600">GitHub</a>
                <a href="#" className="text-slate-600 hover:text-blue-600">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
