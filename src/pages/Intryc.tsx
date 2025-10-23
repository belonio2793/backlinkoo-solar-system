import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Award, Target, Zap, TrendingUp, Users, Lightbulb, Clock } from 'lucide-react';
import '@/styles/intryc.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'Intryc: Complete Guide to AI-Powered Customer Experience QA Platform';
const metaDescription = 'Discover Intryc, the AI-powered platform transforming customer experience through automated quality assurance, real-time coaching, and actionable insights. Learn features, benefits, and ROI.';

export default function Intryc() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/intryc`;
    } catch {
      return '/intryc';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Intryc, AI quality assurance, customer experience platform, agent training, QA automation, customer support QA, AI coaching');
    upsertCanonical(canonical);

    injectJSONLD('intryc-schema', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Intryc',
      'description': 'AI-powered customer experience quality assurance platform with automated QA, insights, and agent coaching.',
      'url': 'https://intryc.com',
      'applicationCategory': 'BusinessApplication',
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'USD',
        'price': 'Contact for pricing'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '247'
      }
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-16 md:py-24">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Customer Experience Platform</Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
                Intryc: Transform Your Customer Experience with AI-Powered Quality Assurance
              </h1>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                The comprehensive platform that automates quality assurance, delivers real-time coaching, and generates actionable insights to elevate customer experience at scale.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <TrendingUp className="w-10 h-10 text-blue-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">40% Audit Output Increase</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Proven results from enterprise customers</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <Zap className="w-10 h-10 text-amber-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">130% Insights Improvement</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enhanced continuous improvement visibility</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <Clock className="w-10 h-10 text-green-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">50% Onboarding Time Saved</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Faster agent readiness and ramp</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What is Intryc Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">
              What is Intryc?
            </h2>
            
            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Intryc is a revolutionary, AI-powered customer experience (CX) quality assurance platform designed to help organizations scale their QA processes, elevate agent performance, and drive continuous improvement through intelligent automation and real-time insights. Unlike traditional QA tools that rely on manual, time-consuming processes, Intryc leverages advanced artificial intelligence to evaluate customer interactions, provide personalized coaching, and deliver actionable analytics—all within a single, unified platform.
              </p>

              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Founded and backed by Y Combinator, Intryc represents the next generation of customer support infrastructure. The platform is purpose-built for enterprises managing large-scale customer support operations, from global teams to hybrid human-AI agent environments. By combining automation with human-centered insights, Intryc enables quality assurance leaders, training managers, and CX executives to make data-driven decisions that directly impact customer satisfaction and business outcomes.
              </p>

              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Whether you're managing a small customer support team or a large, distributed organization with hundreds of agents, Intryc provides the intelligence and automation you need to maintain consistent quality standards, accelerate agent development, and uncover opportunities for process improvement that might otherwise go unnoticed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="w-5 h-5 text-blue-600" />
                    The Customer Experience Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    Traditional quality assurance processes are labor-intensive, inconsistent, and struggle to keep pace with scaling operations. Manual ticket reviews consume enormous amounts of time, inconsistent scoring undermines insights, and delayed feedback slows agent development. Organizations lack real-time visibility into performance drivers, making it difficult to identify and address root causes of customer dissatisfaction quickly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    The Intryc Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    Intryc replaces manual, inconsistent QA with intelligent automation that scales effortlessly. AI-powered evaluation ensures consistent, accurate scoring across all interactions. Real-time coaching feedback accelerates agent development, while advanced insights reveal hidden patterns and opportunities for improvement. Organizations gain the visibility and intelligence they need to optimize CX operations strategically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Core Features that Drive Results
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Zap className="w-6 h-6 text-blue-600" />
                    AutoQA: AI-Powered Quality Assurance at Scale
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    AutoQA is Intryc's flagship feature, leveraging advanced machine learning to automatically evaluate customer interactions against your organization's quality standards. Rather than assigning auditors to manually review every ticket—a process that's both expensive and prone to inconsistency—AutoQA applies intelligent scoring to interactions, providing consistent, accurate evaluations that scale with your operation.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    The system learns from your organization's unique quality benchmarks and continuously improves its evaluation accuracy over time. AutoQA can assess interactions across multiple channels—email, chat, phone, social media—and provides detailed scoring breakdowns that help identify specific areas of strength and improvement. This eliminates the bottleneck of manual reviews while ensuring standardized quality assessment across your entire operation.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Automated evaluation of all customer interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Consistent, unbiased scoring based on defined standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Multi-channel support (email, chat, phone, social)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Detailed evaluation metrics and breakdowns</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Users className="w-6 h-6 text-purple-600" />
                    AI Simulations: Real-World Agent Training
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    AI Simulations enable customer service agents to practice handling real-world scenarios in a safe, controlled environment before engaging actual customers. Using artificial intelligence to generate realistic customer interactions, Intryc allows agents to hone their skills, develop confidence, and become familiar with common issues and edge cases—dramatically reducing time-to-productivity.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    These simulations are tailored to your organization's specific customer base, industry challenges, and service protocols. Rather than relying on generic training materials or shadowing, agents practice with scenarios that mirror the actual challenges they'll face. The platform provides instant, personalized feedback on each interaction, helping agents learn from mistakes immediately and reinforcing positive behaviors.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Realistic, scenario-based training simulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Personalized feedback for each agent interaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Customized to match your industry and customer base</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Accelerates agent onboarding by 50% or more</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    Evaluation Insights: Data-Driven Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Evaluation Insights transforms raw QA data into actionable intelligence. Rather than presenting isolated evaluation scores, Intryc's analytics engine aggregates data across your entire operation to identify patterns, trends, and root causes. This allows CX leaders to understand not just what's happening, but why—enabling strategic interventions that address underlying issues rather than symptoms.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    With comprehensive performance dashboards, drill-down analysis, and trend reporting, leaders gain real-time visibility into agent performance, team dynamics, and process effectiveness. The platform helps answer critical questions: Which categories of issues cause the most customer dissatisfaction? Where are onboarding deficiencies most evident? Which teams demonstrate the best practices? Armed with these insights, organizations make data-informed decisions that drive continuous improvement.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Performance dashboards and trend analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Root cause analysis for quality issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Team and individual agent performance tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Custom report generation and export</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Award className="w-6 h-6 text-orange-600" />
                    AutoCoaching: Personalized Agent Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    AutoCoaching transforms QA insights into personalized development opportunities. Rather than waiting for a quarterly review, agents receive real-time, targeted coaching based on their specific performance data. The platform automatically generates coaching content tied directly to their evaluation results, helping them understand what they did well and where they need to improve.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    This immediate feedback loop accelerates learning and behavioral change. Research consistently shows that feedback delivered close in time to performance is far more effective at driving improvement than delayed reviews. By providing coaching at the moment of performance analysis, Intryc ensures that agents learn from their work experiences and continuously refine their skills.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Real-time feedback tied to performance data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Personalized coaching content for each agent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Reduces onboarding coaching hours by 12-15 hours/week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Continuous improvement through iterative feedback</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Integrations */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">
              Seamless Integration with Your Existing Tools
            </h2>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-12 leading-relaxed">
              Intryc is designed to integrate seamlessly with your existing customer support infrastructure. Rather than requiring a complete platform overhaul, Intryc connects with the tools you already use, making implementation straightforward and reducing deployment friction.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">20+ Supported Integrations</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Intryc integrates with major helpdesk and knowledge base platforms, including Zendesk, Intercom, Freshdesk, Kustomer, and many others. One-click integration allows you to connect your existing data sources immediately, with no complex configuration required.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Zendesk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Intercom</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Freshdesk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Kustomer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>HubSpot Service Hub</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Salesforce Service Cloud</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Custom Integrations Available</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Using a proprietary or less common support platform? Intryc's flexible integration architecture supports custom implementations, ensuring you're never locked into a specific tool ecosystem. The Intryc team works with you to build connectors that match your infrastructure.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>API-first architecture for custom builds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Webhook support for real-time data flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dedicated integration support team</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Customer Success & ROI */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Proven Results from Industry Leaders
            </h2>

            <div className="space-y-8 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-start gap-3">
                    <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    Deel: Global Payroll Company Success Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Deel, a rapidly growing global payroll and HR platform serving thousands of customers worldwide, implemented Intryc to address critical QA challenges across its rapidly expanding customer support organization. With teams distributed globally and customer interactions in multiple languages, maintaining consistent quality standards was increasingly difficult.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-3">The Challenge</h4>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    As Deel scaled, their customer support team grew exponentially. Manual QA processes consumed massive amounts of time from QA leads and team managers, yet provided only sporadic, subjective feedback. Without consistent evaluation, agents received inconsistent coaching, leading to variable customer experience quality. The company lacked visibility into performance trends and struggled to identify areas for process improvement across their global operation.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-3">The Results</h4>
                  <ul className="space-y-2 mb-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-lg font-bold text-blue-600 flex-shrink-0">40%</span>
                      <span>Increase in audit output while maintaining quality standards</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg font-bold text-green-600 flex-shrink-0">130%</span>
                      <span>Improvement in continuous improvement insights across teams</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg font-bold text-purple-600 flex-shrink-0">Significant</span>
                      <span>Reduction in QA team manual workload and coaching time</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg font-bold text-orange-600 flex-shrink-0">Cross-functional</span>
                      <span>Alignment on quality standards across Product, Support, Enablement, and SOPs</span>
                    </li>
                  </ul>

                  <p className="text-slate-700 dark:text-slate-300 italic">
                    "Since adopting Intryc, we've increased our audit output by 40% and enhanced continuous improvement insights by 130%, spanning Product, Support infrastructure, Enablement, and SOPs. The Intryc team provided exceptional support during implementation and we're excited to expand collaboration, especially around evolving AI capabilities." — Deel Customer Success Team
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Why Enterprises Choose Intryc</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Efficiency Gains
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Eliminate 50%+ of manual QA work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Save 12-15 hours/week in coaching time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Accelerate agent onboarding by 50%</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Quality Improvements
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Consistent quality evaluation across all agents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Identify and address root causes faster</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Improve customer satisfaction scores</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Deep Dive */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Advanced Capabilities Built for Scale
            </h2>

            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Role-Based Solutions for Every Team</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Intryc recognizes that different stakeholders have different needs. The platform provides customized experiences tailored to each role in your organization.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">For CX Managers</h5>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Real-time team performance dashboards</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Strategic insights for operational decisions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Trend analysis and forecasting</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">For L&D Managers</h5>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Onboarding program optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Training content generation and delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Agent development tracking</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">For QA Administrators</h5>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Scorecard customization and management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Sampling strategy configuration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Workflow and process automation</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">For Support Agents</h5>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Real-time performance feedback</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Personalized coaching and development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Skill simulation training</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise-Grade Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Handling customer support data requires rigorous security standards. Intryc is built with enterprise security at its core.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>SOC 2 Type II Certified</strong> - Independently audited security controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>GDPR Compliant</strong> - Full compliance with European data protection regulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Data Encryption</strong> - End-to-end encryption for data in transit and at rest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Role-Based Access Control</strong> - Granular permissions for team members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Audit Logging</strong> - Complete audit trails for all platform activities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Implementation & Support */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Implementation & Ongoing Support
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Fast Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Intryc is designed for rapid implementation. With one-click integrations to your existing helpdesk and knowledge base, you can be up and running in days, not months. The platform includes pre-built templates and configuration wizards that streamline setup.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Typical deployment: 5-10 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dedicated implementation specialist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Comprehensive onboarding training</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="w-5 h-5 text-purple-600" />
                    Expert Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    The Intryc team provides ongoing support to ensure you maximize value from the platform. From initial setup through advanced optimization, you have access to a team of CX experts.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>24/7 technical support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Quarterly business reviews and strategy sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Continuous improvement recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  How long does implementation typically take?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Most organizations are fully up and running within 5-10 business days. Intryc's one-click integration with popular helpdesk platforms significantly accelerates setup. Your dedicated implementation specialist will work with your team to configure scorecards, set up workflows, and train your staff. For more complex custom integrations, the timeline may extend slightly, but the Intryc team works to minimize disruption to your operations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  Can Intryc evaluate both human agents and AI agents?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes. Intryc is uniquely designed to audit and evaluate both human and AI agents using the same quality standards. As organizations increasingly deploy AI customer service agents alongside human teams, Intryc provides consistent evaluation across both, enabling quality assurance at scale in hybrid environments.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  What if we use a custom or proprietary support platform?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  While Intryc offers one-click integration with 20+ major platforms, we understand some organizations use custom or specialized systems. Intryc's API-first architecture enables custom integrations. Our integration specialists work directly with your development team to build connectors that work with your platform. Contact the Intryc team to discuss your specific requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  How does Intryc's AI learn to evaluate quality?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Intryc's evaluation engine is trained using industry best practices and your organization's quality standards. During implementation, you define your quality rubric and provide examples of ideal interactions. The AI learns from this training data and applies consistent evaluation across all future interactions. The system continuously improves as it evaluates more interactions, learning from corrections and feedback to increase accuracy over time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  Is my customer data secure?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Security is paramount in customer support operations. Intryc is SOC 2 Type II certified, GDPR compliant, and implements industry-standard encryption for data in transit and at rest. All customer data is isolated and protected with role-based access controls. Intryc also maintains comprehensive audit logs of all platform activities for security and compliance purposes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  How does AutoCoaching help improve agent performance?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  AutoCoaching delivers real-time, personalized feedback immediately after interactions are evaluated. Rather than waiting weeks for a manager to provide coaching, agents receive targeted feedback tied directly to their performance data. This immediate feedback loop accelerates learning and behavioral change. The platform automatically generates coaching content addressing specific performance gaps, reducing the time QA leads spend on manual coaching preparation by 12-15 hours per week per team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  What's the ROI of implementing Intryc?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organizations typically realize significant ROI within the first three months. Benefits include: 40%+ increase in audit coverage, 12-15 hours/week saved in coaching time, 50% reduction in onboarding time, improved CSAT scores through better agent quality, and reduced manual QA workload. Most customers achieve ROI within their first year. Schedule a consultation with Intryc to discuss your specific opportunity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
          <div className="container max-w-5xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your Customer Experience?
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Learn how Intryc can help you scale QA, accelerate agent development, and drive continuous improvement across your customer support organization. Start your transformation today.
            </p>

            <div className="max-w-2xl mx-auto">
              <BacklinkInfinityCTA
                cta={{
                  title: 'Ready to Build Backlinks and Grow Your SEO Authority?',
                  description: 'Join Backlink ∞ and access our powerful platform to build high-quality backlinks, track your rankings, and dominate search results for your target keywords.',
                  href: 'https://backlinkoo.com/register',
                  buttonText: 'Register for Backlink ∞'
                }}
              />
            </div>

            <p className="text-sm text-blue-100 mt-8">
              Take the next step in your SEO journey. Register now and get started with Backlink ∞.
            </p>
          </div>
        </section>

        {/* Additional Content Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              Why Intryc Stands Out in the CX QA Market
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                In a crowded marketplace of customer experience tools, Intryc distinguishes itself through several key differentiators that matter to enterprises managing large-scale support operations.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Comprehensive Platform, Not Point Solutions</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Rather than offering separate tools for QA, coaching, and analytics that require integration overhead, Intryc provides integrated QA, insights, and coaching within a single platform. This unified approach eliminates data silos, ensures consistency across workflows, and dramatically reduces implementation complexity compared to cobbling together multiple point solutions.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Built for Both Human and AI Agents</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                As organizations increasingly adopt AI agents for customer support, Intryc addresses the emerging need to evaluate both human and AI agents against consistent quality standards. The platform's evaluation framework works seamlessly with both, enabling organizations to scale QA across hybrid support teams without fundamental architectural changes.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Y Combinator Backing and Proven Traction</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Intryc's backing by Y Combinator, one of the world's most respected startup accelerators, validates the company's vision and execution. The platform has already proven itself with customers like Deel, demonstrating measurable, substantial improvements in QA efficiency and insights. This proven track record provides confidence in the platform's ability to deliver results.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Extensible, Integrations-First Architecture</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Intryc doesn't force you to replace your existing tools. Instead, it integrates seamlessly with 20+ leading helpdesk and knowledge management platforms through one-click connectors. For organizations with custom systems, the API-first architecture enables custom integrations without requiring Intryc or your team to perform extensive development work.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Focus on Outcomes, Not Just Features</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Intryc is intensely focused on delivering measurable business outcomes. The platform provides the metrics and insights organizations need to understand ROI, track progress toward goals, and continuously optimize their CX operations. This outcomes-driven approach appeals to CFOs and executives who need to justify software investments.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Enterprise Security and Compliance from Day One</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Rather than bolting on security after the fact, Intryc was built with enterprise security and compliance requirements embedded in its architecture. SOC 2 Type II certification, GDPR compliance, data encryption, and comprehensive audit logging come standard—not as premium add-ons.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Expert Implementation and Ongoing Support</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Intryc's implementation specialists don't just set up the platform and disappear. The team provides comprehensive onboarding training, works with your organization to optimize configurations for your specific needs, and provides ongoing support through quarterly business reviews and continuous improvement recommendations. This partnership approach ensures long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">
                Elevate Your Customer Experience with Intryc
              </h2>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  In today's competitive landscape, customer experience has become a primary differentiator for businesses. Organizations that deliver consistently excellent customer interactions build loyalty, generate positive word-of-mouth, and increase lifetime customer value. Conversely, poor customer experience directly damages reputation and drives churn.
                </p>

                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  Intryc empowers organizations to maintain high standards of customer experience at scale. By automating quality assurance, delivering real-time coaching, and generating actionable insights, the platform enables support teams to focus on what matters most: delighting customers. The proven results from customers like Deel demonstrate that Intryc delivers measurable improvements in efficiency, quality, and outcomes.
                </p>

                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  Whether you're struggling to maintain consistent quality as you scale, looking to reduce the burden of manual QA work, seeking to accelerate agent onboarding, or simply wanting to understand what's driving customer dissatisfaction, Intryc provides the capabilities and insights you need.
                </p>

                <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                  The question isn't whether you can afford to implement Intryc—it's whether you can afford not to.
                </p>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Transform Your Customer Experience Today
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-6">
                      Schedule a demo with the Intryc team to see how the platform can address your specific customer experience challenges and deliver measurable ROI.
                    </p>
                    <BacklinkInfinityCTA
                      cta={{
                        title: 'Build High-Quality Backlinks',
                        description: 'Join thousands of SEO professionals using Backlink ∞ to accelerate their rankings and dominate search results.',
                        href: 'https://backlinkoo.com/register',
                        buttonText: 'Register for Backlink ∞'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
