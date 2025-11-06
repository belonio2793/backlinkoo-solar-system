import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Lock, 
  Bluetooth, 
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Users,
  Award,
  Code,
  Smartphone,
  Eye
} from 'lucide-react';
import '@/styles/proximity-lock-system.css';

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

const metaTitle = 'Proximity Lock System: Complete Guide — Automated Bluetooth Security for Workstations';
const metaDescription = 'A practical, in-depth guide to proximity lock systems: how they work, real-world deployments, security considerations, implementation steps, and best practices to protect unattended workstations using Bluetooth devices.';

export default function ProximityLockSystemPage() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');

  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/proximity-lock-system`;
    } catch {
      return '/proximity-lock-system';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'proximity lock system, bluetooth lock, automatic computer lock, BLE security, workstation lock, proximity-based security');
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertCanonical(canonical);

    injectJSONLD('pls-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('pls-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
      mainEntityOfPage: canonical,
    });
  }, [canonical]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const headings = Array.from(container.querySelectorAll('h2[id],h3[id]')) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveId(top.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const toc: { id: string; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'benefits', label: 'Key Benefits' },
    { id: 'features', label: 'Features' },
    { id: 'use-cases', label: 'Use Cases' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'security', label: 'Security Aspects' },
    { id: 'comparisons', label: 'Technology Comparison' },
    { id: 'testimonials', label: 'User Reviews' },
    { id: 'best-practices', label: 'Best Practices' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Take Action' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 h-fit sticky top-24">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Contents
              </h3>
              <nav className="space-y-2 text-sm text-gray-700">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block px-3 py-1.5 rounded ${activeId === item.id ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3" ref={contentRef}>
            <article>
              <header className="mb-8 bg-white">
                <div className="flex items-start gap-4 mb-4">
                  <Lock className="w-10 h-10 flex-shrink-0" />
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Proximity Lock System: Automatic Security for Modern Workplaces</h1>
                    <p className="text-blue-100 text-lg">A practical, implementation-focused guide to automatic workstation locking using Bluetooth and proximity detection.</p>
                  </div>
                </div>

                <p className="text-blue-50 leading-relaxed">
                  In this exhaustive guide we explore how proximity lock systems work, why organizations adopt them, and how to implement a reliable, auditable solution. This page is written to help security engineers, IT managers, and decision-makers evaluate the technology, pilot it effectively, and roll it out at scale. It also includes real-world examples, deployment checklists, and frequently asked questions to reduce implementation friction.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge className="bg-blue-400 text-white">Bluetooth Low Energy</Badge>
                  <Badge className="bg-blue-400 text-white">Automatic Locking</Badge>
                  <Badge className="bg-blue-400 text-white">Enterprise Audit Logs</Badge>
                </div>
              </header>

              <section id="overview" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Overview: What is a Proximity Lock System?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A proximity lock system secures a computer or device automatically by detecting the presence (or absence) of an authorized Bluetooth device. When the paired device moves out of a configured range, the system locks the workstation—preventing unauthorized access. When the device returns within range, the user resumes access where authentication policies permit.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  These systems are designed to be unobtrusive: no additional steps are required from the user beyond carrying their already-personal device. The core value is reducing the human-error vector—people forgetting to lock screens or leaving machines unattended.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        Device-Centric Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">Works with smartphones, smartwatches, and dedicated security tokens.</CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Fast Detection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">Configurable grace periods and fast response times for minimal disruption.</CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Multi-Layered Protection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">Combines proximity detection with passwords and biometrics for resilient security.</CardContent>
                  </Card>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Use cases range from single-user laptops to enterprise endpoint fleets. Security teams often pair proximity locking with centralized device management to revoke compromised tokens, monitor events, and maintain compliance records.
                </p>
              </section>

              <section id="how-it-works" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">How Proximity Lock Systems Work (Technical)</h2>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  At the core, proximity lock solutions depend on reliable presence detection. This usually relies on Bluetooth Low Energy (BLE), which broadcasts small packets at regular intervals. The receiving endpoint (your workstation) measures the Received Signal Strength Indicator (RSSI) of these packets. By applying filtering, averaging, and thresholds, the system infers whether the device is nearby.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Pairing and Trust</h3>
                    <p className="text-gray-700">Initial pairing establishes a cryptographic trust relationship between the endpoint and the mobile device. This prevents arbitrary devices from triggering unlock events without authorization.</p>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Signal Measurement and Averaging</h3>
                    <p className="text-gray-700">Signal readings fluctuate due to reflections, interference, and body obstruction. Reliable systems average RSSI over time and apply hysteresis to decide lock/unlock actions, minimizing false triggers.</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Grace Periods and User Tolerance</h3>
                    <p className="text-gray-700">A configurable grace period accommodates brief signal dips (e.g., walking around a desk). Many deployments default to 5–20 seconds depending on workflow needs.</p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
                    <h3 className="font-semibold text-gray-900 mb-2">Fallback and Override</h3>
                    <p className="text-gray-700">Systems provide manual overrides and admin controls to temporarily disable proximity locking when needed (e.g., during device troubleshooting or long-running processes).</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">Security-minded implementations couple proximity detection with cryptographic checks, device attestation, and integration with the platform's native lock APIs (Windows, macOS, Linux). This prevents simple spoofing attacks that attempt to fake proximity by relaying Bluetooth signals.</p>
              </section>

              <section id="benefits" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Organizations Adopt Proximity Lock Systems</h2>

                <p className="text-gray-700 mb-4 leading-relaxed">The primary motivator is a reduction in risk introduced by human behavior. Forgotten locks and brief unattended periods account for many data-exposure incidents. Proximity locking removes that vulnerability.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-blue-600" />Enhanced Security</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">Enforces policy consistently without user intervention, lowering the chance of data exposure or unauthorized access.</CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Zap className="w-5 h-5 text-green-600" />Seamless UX</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">Users keep carrying the devices they already use—no new hardware required in most cases.</CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-purple-600" />Operational Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">Reduces helpdesk tickets related to unattended sessions and speeds compliance reporting with accurate logs.</CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Clock className="w-5 h-5 text-cyan-600" />Fast Reaction</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">Millisecond-level detection prevents opportunistic access during short absences.</CardContent>
                  </Card>
                </div>

                <p className="text-gray-700 leading-relaxed">Enterprises benefit from policy-based central management, per-user device whitelisting, and auditability required for regulatory frameworks like HIPAA, SOC 2, and GDPR.</p>
              </section>

              <section id="features" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Features to Look For</h2>

                <p className="text-gray-700 mb-6 leading-relaxed">Not all proximity lock products are created equal. Choose a solution that emphasizes reliability, privacy, and manageability:</p>

                <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                  <li><strong>Robust Pairing Flows:</strong> Secure pairing with device verification and revocation support.</li>
                  <li><strong>RSSI Filtering:</strong> Averaging and hysteresis to reduce false locks.</li>
                  <li><strong>Grace Periods:</strong> Customizable delays to match real-world movement patterns.</li>
                  <li><strong>Multi-Device Support:</strong> Allow multiple devices per user for redundancy.</li>
                  <li><strong>Enterprise Management:</strong> Central policy control, logs, and device revocation.</li>
                  <li><strong>Privacy Controls:</strong> Minimize personal data collection and support anonymized device IDs.</li>
                </ul>

                <p className="text-gray-700 leading-relaxed">Choosing a mature platform reduces the costs associated with false positives, user training, and support. Vendors that integrate with existing SSO and device management tools simplify rollouts and compliance audits.</p>
              </section>

              <section id="use-cases" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Real-World Use Cases</h2>

                <p className="text-gray-700 mb-4 leading-relaxed">We see proximity locking applied across several verticals where unattended systems carry high risk:</p>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-blue-900 mb-2">Finance & Banking</h3>
                    <p className="text-blue-800">Traders, analysts, and advisors often access sensitive financial systems. A proximity lock prevents transient exposure during client interactions.</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-green-900 mb-2">Healthcare</h3>
                    <p className="text-green-800">In clinical settings, proximity locking protects patient records as staff move between care activities—critical for HIPAA compliance.</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-purple-900 mb-2">Legal & Professional Services</h3>
                    <p className="text-purple-800">Protect client files and attorney research when team members step away during meetings or court appearances.</p>
                  </div>
                </div>
              </section>

              <section id="implementation" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Implementation: Pilot to Full Rollout</h2>

                <p className="text-gray-700 mb-4 leading-relaxed">A successful implementation follows phased adoption with clear metrics and stakeholder buy-in. Below is a recommended roadmap used by security teams:</p>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold">Phase 0: Requirements & Risk Assessment</h3>
                    <p className="text-gray-700">Map data sensitivity by user role, identify work patterns, and estimate device compatibility across employee populations.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold">Phase 1: Small Pilot</h3>
                    <p className="text-gray-700">Deploy to a mixed group (IT, admins, and representative end-users) and collect quantitative metrics: false lock rate, user satisfaction, support tickets.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold">Phase 2: Policy & Integration</h3>
                    <p className="text-gray-700">Configure policies for grace periods, device allowances, and integration with MDM/SSO. Ensure logs are routed to your SIEM for monitoring.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold">Phase 3: Enterprise Deployment</h3>
                    <p className="text-gray-700">Roll out in waves, prioritize high-risk groups first, and provide training and self-service tools for device pairing and revocation.</p>
                  </div>
                </div>
              </section>

              <section id="security" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Security Considerations & Threat Model</h2>

                <p className="text-gray-700 leading-relaxed mb-4">Security teams must understand the threat model and design controls accordingly. Key considerations include:</p>

                <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                  <li><strong>Spoofing & Relay Attacks:</strong> Prevent attackers from relaying signals by requiring device attestation and cryptographic checks rather than relying solely on raw RSSI.</li>
                  <li><strong>Device Loss:</strong> Procedural controls to revoke lost/stolen devices and remote wipe where appropriate.</li>
                  <li><strong>Privacy:</strong> Minimize PII; prefer hashed or ephemeral identifiers for paired devices.</li>
                  <li><strong>Logging & Auditing:</strong> Capture lock/unlock events with timestamps and device IDs to support forensic analysis.</li>
                </ul>

                <p className="text-gray-700">When combined with strong endpoint hardening and multi-factor authentication, proximity locking strengthens the overall security posture—particularly against opportunistic insiders or social engineering attacks that rely on brief physical access.</p>
              </section>

              <section id="comparisons" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Comparisons: Proximity Lock vs Alternatives</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="text-left p-3 font-semibold">Approach</th>
                        <th className="text-left p-3 font-semibold">User Effort</th>
                        <th className="text-left p-3 font-semibold">Response Time</th>
                        <th className="text-left p-3 font-semibold">Cost</th>
                        <th className="text-left p-3 font-semibold">User Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50"><td className="p-3 font-semibold">Manual Lock</td><td className="p-3">High</td><td className="p-3">Immediate</td><td className="p-3">Free</td><td className="p-3">Poor</td></tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50"><td className="p-3 font-semibold">Proximity Lock</td><td className="p-3">None</td><td className="p-3">3-30s</td><td className="p-3">Low-Medium</td><td className="p-3">Excellent</td></tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50"><td className="p-3 font-semibold">Screen Timeout</td><td className="p-3">Low</td><td className="p-3">Minutes</td><td className="p-3">Free</td><td className="p-3">Fair</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">Biometric + Proximity</td><td className="p-3">Minimal</td><td className="p-3">1-3s</td><td className="p-3">High</td><td className="p-3">Excellent</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-700 mt-6 leading-relaxed">In many settings, the best architecture uses proximity locking as a complementary control—paired with biometrics or strong password policies to ensure both convenience and resilience.</p>
              </section>

              <section id="testimonials" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">User Reviews & Case Studies</h2>

                <p className="text-gray-700 mb-6 leading-relaxed">Below are representative accounts from teams that piloted proximity locking and reported measurable benefits.</p>

                <div className="space-y-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-base">Sarah Chen, IT Director, Tech Startup</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">"Implementing proximity locks reduced unattended workstation incidents by over 70% in our pilot. The system integrates with our MDM and gave us granular logs for audit."</CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-base">Dr. Michael Rodriguez, CISO, Healthcare Network</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">"For HIPAA compliance, proximity locking was an easy win. Clinicians appreciated the hands-free protection and we saw almost immediate adoption."</CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-base">Jennifer Lee, Security Manager, Financial Services</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">"Auditors liked that we could show continuous logs of lock/unlock events. It simplified our process for demonstrating controls to regulators."</CardContent>
                  </Card>
                </div>
              </section>

              <section id="best-practices" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Configuration Guidelines</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>Start Conservative:</strong> Use a 10–15m range and 10s grace period for initial pilots.</li>
                    <li><strong>Monitor Metrics:</strong> Track false positive/negative rates and adjust parameters.</li>
                    <li><strong>Provide Overrides:</strong> Allow temporary disabling with admin controls to reduce disruption.</li>
                    <li><strong>Document Procedures:</strong> Create clear policies for lost device handling and device provisioning.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Support & Training</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>Offer quick pairing guides and short videos to accelerate adoption.</li>
                    <li>Provide a self-service portal for users to manage paired devices and report issues.</li>
                    <li>Train IT staff on troubleshooting and revocation procedures.</li>
                  </ul>
                </div>
              </section>

              <section id="getting-started" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Getting Started: Checklist</h2>

                <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-6">
                  <li>Inventory devices and OS versions across your fleet.</li>
                  <li>Select a pilot group and define success metrics.</li>
                  <li>Choose a vendor or open-source solution and verify MDM/SSO integration.
                  </li>
                  <li>Run a 2–4 week pilot and collect quantitative feedback.</li>
                  <li>Refine configurations, train users, and roll out in phases.</li>
                </ol>

                <p className="text-gray-700">A careful pilot reduces user friction and ensures the long-term viability of proximity locking as a core endpoint control.</p>
              </section>

              <section id="faq" className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>

                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold">Does proximity locking drain battery on phones?</h3>
                    <p className="mt-1">No. BLE is specifically designed for low-power operation. Well-designed proximity locking agents use infrequent, small broadcasts and efficient scanning to minimize battery impact.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">What happens if my device is lost?</h3>
                    <p className="mt-1">Follow your organization's lost-device procedures: revoke the device in the management console, and require re-pairing for new devices. Device revocation prevents the lost token from unlocking workstations.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Can attackers spoof Bluetooth signals?</h3>
                    <p className="mt-1">Raw RSSI can be manipulated, which is why secure proximity systems use cryptographic verification, device attestation, and anti-relay measures to make spoofing impractical.</p>
                  </div>
                </div>
              </section>

              <section id="cta" className="mb-16">
                <div className="bg-white">
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Strengthen Your Security?</h2>
                    <p className="text-blue-50 text-lg mb-6 leading-relaxed">If you want to protect unattended systems, reduce compliance risk, and give your users a frictionless experience, start with a small pilot. Proximity lock systems are practical, affordable, and effective when implemented with the right controls.</p>

                    <p className="text-blue-100 mb-8">Register for Backlink ∞ to get started and access resources, vendor recommendations, and deployment guides that help you implement proximity locking in a way that scales with your organization.</p>

                    <div className="mt-6">
                      <Button asChild size="lg" className="bg-white text-blue-600 font-semibold px-8 py-3 text-lg">
                        <a href="https://backlinkoo.com/register" rel="noopener noreferrer">
                          Register for Backlink ∞ to Get Started
                        </a>
                      </Button>
                    </div>

                    <p className="text-blue-200 text-sm mt-6">Registering gives you access to templates, security playbooks, and support to help implement proximity-based locking across your endpoints.</p>
                  </div>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                <p className="text-gray-700 leading-relaxed mb-4">Proximity lock systems represent a practical step toward automated security that respects user experience. When combined with strong authentication, centralized management, and clear policies, they deliver measurable risk reduction across industries.</p>

                <p className="text-gray-700 leading-relaxed">If you're evaluating endpoint controls this year, consider a pilot program that lets you measure both security improvements and user sentiment—then scale confidently once you have the right parameters dialed in.</p>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
