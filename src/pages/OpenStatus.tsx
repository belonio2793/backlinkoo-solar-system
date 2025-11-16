import React, { useState, useEffect } from 'react';
import Seo from "@/components/Seo";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Globe,
  Activity,
  Code,
  Bell,
  CheckCircle,
  Zap,
  Shield,
  GitBranch,
  Terminal,
  AlertTriangle,
  TrendingUp,
  Smartphone,
  BarChart3,
  ArrowRight,
  Clock,
  Users,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const OpenStatus = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Update page title for SEO
    document.title = 'OpenStatus - Open Source Uptime Monitoring & Status Pages';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'OpenStatus is an open-source uptime monitoring platform with public status pages, latency tracking, and alerting. Monitor APIs, websites, and services globally with comprehensive monitoring as code.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OpenStatus is an open-source uptime monitoring platform with public status pages, latency tracking, and alerting. Monitor APIs, websites, and services globally with comprehensive monitoring as code.';
      document.head.appendChild(meta);
    }

    // Add OpenGraph meta tags
    const ogMetas = [
      { property: 'og:title', content: 'OpenStatus - Open Source Uptime Monitoring' },
      { property: 'og:description', content: 'Monitor your API and website worldwide with transparent status pages and real-time alerts.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'OpenStatus' },
      { name: 'twitter:description', content: 'Open source uptime monitoring and status pages' },
      { name: 'keywords', content: 'OpenStatus, uptime monitoring, status pages, API monitoring, website monitoring, incident tracking, alerting' }
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
      'name': 'OpenStatus',
      'description': 'Open source uptime monitoring platform with status pages and global monitoring',
      'url': 'https://openstatus.dev',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'name': 'Free'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'OpenStatus',
        'url': 'https://openstatus.dev'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Scroll to top
    window.scrollTo(0, 0);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Open Source & Transparent
            </Badge>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Showcase Your{' '}
            <span className="bg-white">
              Uptime with Confidence
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Monitor your APIs and websites worldwide with OpenStatus. Detect performance issues before 
            your users do, maintain transparent status pages, and receive real-time alerts across all channels. 
            Built for developers who value transparency and reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-lg">
                Register for Backlink ∞
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <div className="bg-white/5 border border-blue-500/20 rounded-lg p-6 backdrop-blur">
            <p className="text-sm text-gray-400 mb-4">Trusted by developers for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['API Monitoring', 'Status Pages', 'Incident Alerting', 'Global Coverage'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Choose OpenStatus?</h2>
            <p className="text-xl text-gray-400">
              A comprehensive uptime monitoring solution built with transparency and developer experience in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Monitoring Coverage',
                description:
                  'Monitor your services from multiple locations worldwide. Track latency from Amsterdam, US, and Sydney to identify regional performance issues before they impact users across different geographies.',
                highlights: ['Multi-region monitoring', 'Latency tracking', 'Geographic insights'],
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Transparent Status Pages',
                description:
                  'Publish beautiful, customizable status pages with your own domain. Keep users informed about uptime, incidents, and maintenance windows. Reduce support inquiries through proactive communication.',
                highlights: ['Custom domains', 'User subscriptions', 'Incident tracking'],
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Monitoring as Code',
                description:
                  'Define your monitors using YAML configuration. Version control your monitoring setup, integrate with CI/CD pipelines, and manage infrastructure-as-code principles for reliability.',
                highlights: ['YAML configuration', 'CI/CD integration', 'Version control'],
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: 'Multi-Channel Alerting',
                description:
                  'Get alerted instantly via email, SMS, Slack, Discord, and more. Configure escalation policies to route alerts to the right team members based on severity and timing.',
                highlights: ['Multiple channels', 'Smart escalation', 'Real-time notifications'],
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Comprehensive Analytics',
                description:
                  'Track uptime percentages, latency metrics, and incident history. Export synthetic monitoring data via OpenTelemetry to your existing observability stack for unified visibility.',
                highlights: ['Uptime tracking', 'OpenTelemetry export', 'Historical data'],
              },
              {
                icon: <GitBranch className="w-8 h-8" />,
                title: 'Open Source & Community',
                description:
                  'Built on open-source principles with a transparent development roadmap. Contribute to the project, customize for your needs, and benefit from community-driven improvements and features.',
                highlights: ['Open source', 'Community-driven', 'Customizable'],
              },
            ].map((benefit, idx) => (
              <Card key={idx} className="bg-white" onClick={() => setExpandedFeature(expandedFeature === benefit.title ? null : benefit.title)}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-400 transition">
                      {benefit.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{benefit.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {benefit.highlights.map((highlight) => (
                      <Badge key={highlight} className="bg-blue-500/20 text-blue-300 border-blue-400/30">
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

      {/* Monitoring Features Section */}
      <section id="monitoring" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Comprehensive Monitoring Capabilities</h2>
            <p className="text-xl text-gray-400">
              Monitor any service type with flexible, powerful monitoring options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Latency Monitoring',
                description: 'Track response times from multiple global regions. Identify performance degradation instantly and understand how your services perform across different latitudes.',
                icon: <TrendingUp className="w-6 h-6" />,
                items: ['Global vantage points', 'Real-time metrics', 'Trend analysis', 'Regional insights'],
              },
              {
                title: 'Monitor Anything',
                description: 'Comprehensive endpoint coverage supporting APIs, DNS records, SSL certificates, SMTP servers, ping checks, and webpage monitoring. One platform for all monitoring needs.',
                icon: <Zap className="w-6 h-6" />,
                items: ['API endpoints', 'DNS monitoring', 'SSL certificates', 'SMTP, Ping, Webhooks'],
              },
              {
                title: 'Synthetic Monitoring',
                description: 'Simulate real user interactions to detect issues before actual users experience them. Proactive monitoring prevents business impact and maintains uptime SLAs.',
                icon: <Activity className="w-6 h-6" />,
                items: ['User simulation', 'Proactive detection', 'Issue prevention', 'Performance baseline'],
              },
              {
                title: 'Status Page Publishing',
                description: 'Create beautiful, branded status pages that build trust. Share uptime history, incident timelines, and maintenance windows with users. Reduce support overhead with transparency.',
                icon: <Smartphone className="w-6 h-6" />,
                items: ['Custom branding', 'Incident timeline', 'User subscriptions', 'Email notifications'],
              },
              {
                title: 'Alerting & Escalation',
                description: 'Configure intelligent alerting with escalation policies. Route alerts based on severity, time of day, and team member availability. Ensure critical issues reach the right person immediately.',
                icon: <AlertTriangle className="w-6 h-6" />,
                items: ['Smart routing', 'Time-based rules', 'Escalation chains', 'Multiple channels'],
              },
              {
                title: 'YAML Configuration',
                description: 'Define monitors using simple YAML syntax. Version control your monitoring setup, review changes as code, and maintain consistency across your infrastructure.',
                icon: <Terminal className="w-6 h-6" />,
                items: ['Code-based config', 'Git integration', 'Reproducible setup', 'Team collaboration'],
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Ecosystem Section */}
      <section id="integrations" className="py-24 px-6 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3>Powerful Integrations</h3>
            <p className="text-xl text-gray-400">
              Connect OpenStatus with your favorite tools and platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                category: 'Alerting & Communication',
                integrations: ['Slack', 'Discord', 'Email', 'SMS', 'Webhooks', 'PagerDuty'],
              },
              {
                category: 'Observability & Analytics',
                integrations: ['OpenTelemetry', 'Datadog', 'New Relic', 'Prometheus', 'Grafana', 'Custom APIs'],
              },
              {
                category: 'DevOps & Automation',
                integrations: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes'],
              },
              {
                category: 'Project Management',
                integrations: ['Jira', 'Linear', 'Asana', 'Monday.com', 'Notion', 'Changelog'],
              },
            ].map((group, idx) => (
              <Card key={idx} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <GitBranch className="w-6 h-6 text-blue-400" />
                    {group.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.integrations.map((integration) => (
                      <div key={integration} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{integration}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Real-World Applications</h2>
          <div className="space-y-6">
            {[
              {
                title: 'SaaS Companies',
                description: 'Maintain user trust by publishing transparent status pages. Reduce support tickets by keeping users informed about issues and maintenance windows.',
              },
              {
                title: 'Enterprise Infrastructure',
                description: 'Monitor critical APIs and services across multiple regions. Detect regional outages quickly and coordinate response efforts with built-in alerting.',
              },
              {
                title: 'DevOps Teams',
                description: 'Define monitors as code within your CI/CD pipelines. Automate monitoring setup alongside infrastructure deployment using Terraform and Kubernetes.',
              },
              {
                title: 'Fintech & Banking',
                description: 'Maintain regulatory compliance with detailed uptime records. Monitor payment APIs and critical systems with high-frequency checks and comprehensive alerting.',
              },
              {
                title: 'Content Delivery Networks',
                description: 'Track CDN performance globally. Monitor edge server health and latency metrics to ensure optimal content delivery worldwide.',
              },
              {
                title: 'IoT & Connected Services',
                description: 'Monitor distributed IoT endpoints and connected services. Track device health across geographies with latency and availability monitoring.',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="bg-white">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  {useCase.title}
                </h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Is OpenStatus really open source?',
                answer: 'Yes, OpenStatus is proudly open source. The source code is available on GitHub for community contributions, customization, and transparency. You can self-host or use the managed service.',
              },
              {
                question: 'How many regions can I monitor from?',
                answer: 'OpenStatus supports monitoring from multiple global regions including Amsterdam (AMS), US East (IAD), and Sydney (SYD). You can select which regions to monitor for each endpoint.',
              },
              {
                question: 'Can I use OpenStatus without coding?',
                answer: 'Absolutely. The web dashboard provides a user-friendly interface for setting up monitors and status pages. The YAML configuration option is available for developers who prefer code-based management.',
              },
              {
                question: 'What types of endpoints can I monitor?',
                answer: 'OpenStatus supports monitoring APIs, DNS records, SSL certificates, SMTP servers, ping checks, webpages, and custom endpoints. Virtually any service type is supported.',
              },
              {
                question: 'Does OpenStatus offer paid support?',
                answer: 'OpenStatus provides free and paid tiers. Visit the pricing page for detailed information about support levels, limits, and enterprise options.',
              },
              {
                question: 'How do alerts work in OpenStatus?',
                answer: 'When a monitor detects an issue, OpenStatus sends alerts through configured channels (email, SMS, Slack, Discord, webhooks, etc.). You can set escalation policies to route alerts appropriately.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-400/30 transition"
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
                  <div className="px-6 py-4 bg-white/5 border-t border-blue-500/20">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h3>Getting Started with OpenStatus</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Quick steps to begin monitoring your services
          </p>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up for OpenStatus and get instant access to the dashboard. Start with a free tier and scale as needed.',
              },
              {
                step: '2',
                title: 'Add Your First Monitor',
                description: 'Configure a monitor for your API or website. Choose from multiple types (HTTP, DNS, SSL) and select monitoring regions.',
              },
              {
                step: '3',
                title: 'Configure Alerts',
                description: 'Set up notifications across your preferred channels (Slack, email, SMS). Define escalation policies for critical issues.',
              },
              {
                step: '4',
                title: 'Publish Your Status Page',
                description: 'Create a branded status page and share it with users. Enable subscriptions so customers stay informed.',
              },
              {
                step: '5',
                title: 'Integrate & Automate',
                description: 'Connect with your observability stack via OpenTelemetry. Integrate with CI/CD for automated monitoring deployment.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 bg-white/5 border border-blue-500/20 rounded-lg p-6 hover:border-blue-400/30 transition">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
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
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  SEO Enhancement
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Amplify Your Digital Presence</h2>
                <p className="text-gray-300 mb-6">
                  You're building a reliable monitoring infrastructure with OpenStatus. Now ensure your brand, 
                  content, and technical insights reach their full audience through strategic SEO and high-authority backlinks.
                </p>
                <p className="text-gray-300 mb-8">
                  Backlink ∞ combines white-hat link building with comprehensive SEO strategies to establish domain authority 
                  and drive qualified organic traffic to your site.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Premium domain backlinks from relevant technology and DevOps niches',
                    'Comprehensive SEO authority development for monitoring tools',
                    'Organic traffic generation through search rankings',
                    'Full transparency with detailed reporting and analytics',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg">
                    Register for Backlink ∞
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
              <div className="bg-white">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">3-6 Months</div>
                    <p className="text-gray-400">Average time to reach top 10 rankings</p>
                  </div>
                  <div className="h-px bg-white" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">+350%</div>
                    <p className="text-gray-400">Average organic traffic increase</p>
                  </div>
                  <div className="h-px bg-white" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                    <p className="text-gray-400">White-hat ethical practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 border-t border-blue-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Monitoring Today</h2>
          <p className="text-lg text-gray-400 mb-8">
            Deploy OpenStatus for transparent uptime monitoring and register for Backlink ∞ to boost your visibility
          </p>
          <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
              Register for Backlink ∞
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OpenStatus;
