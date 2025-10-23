import React, { useState, useEffect } from 'react';
import Seo from "@/components/Seo";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/supamail.css';
import {
  ChevronDown,
  Mail,
  Zap,
  Shield,
  Sparkles,
  CheckCircle,
  Brain,
  Clock,
  Lock,
  MessageSquare,
  Inbox,
  TrendingDown,
  BarChart3,
  ArrowRight,
  Smartphone,
  Filter,
  Bell,
  Cpu,
} from 'lucide-react';
import { Footer } from '@/components/Footer';

const SupamailAI = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Update page title for SEO
    document.title = 'Supamail AI - Smart Email Assistant for iOS | AI-Powered Inbox Management';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Supamail AI is a privacy-first AI email assistant for iOS that summarizes emails, organizes threads, suggests smart replies, and delivers daily digests. Reclaim your inbox with intelligent automation.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Supamail AI is a privacy-first AI email assistant for iOS that summarizes emails, organizes threads, suggests smart replies, and delivers daily digests. Reclaim your inbox with intelligent automation.';
      document.head.appendChild(meta);
    }

    // Add OpenGraph meta tags
    const ogMetas = [
      { property: 'og:title', content: 'Supamail AI - AI-Powered Email Management for iOS' },
      { property: 'og:description', content: 'Reclaim your inbox with one-line email summaries, smart organization, and AI-powered replies.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Supamail AI' },
      { name: 'twitter:description', content: 'Smart email assistant powered by AI' },
      { name: 'keywords', content: 'Supamail AI, email assistant, AI email, inbox management, email summarizer, iOS email app' }
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
      'name': 'Supamail AI',
      'description': 'AI-powered email assistant for iOS with privacy-first design',
      'url': 'https://supamail.ai',
      'applicationCategory': 'Productivity',
      'operatingSystem': 'iOS',
      'offers': {
        '@type': 'Offer',
        'price': '4.99',
        'priceCurrency': 'USD',
        'name': 'Monthly Subscription'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.7',
        'ratingCount': '3200'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'Supamail',
        'url': 'https://supamail.ai'
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-lg border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-400" />
            <div className="text-2xl font-bold text-indigo-400">Supamail AI</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#benefits" className="text-sm text-gray-300 hover:text-white transition">
              Benefits
            </a>
            <a href="#faq" className="text-sm text-gray-300 hover:text-white transition">
              FAQ
            </a>
            <a href="https://supamail.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition">
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Privacy-First AI Assistant
            </Badge>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Reclaim Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Inbox with Intelligence
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Supamail AI transforms email management on iOS with intelligent summarization, automatic categorization, 
            and smart reply suggestions. Reduce email overload, organize your messages effortlessly, and focus on 
            what truly matters with CASA Tier 2 certified privacy protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-6 text-lg rounded-lg">
                Register for Backlink ∞
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <div className="bg-white/5 border border-indigo-500/20 rounded-lg p-6 backdrop-blur">
            <p className="text-sm text-gray-400 mb-4">Why professionals choose Supamail AI:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['AI Summaries', 'Smart Organization', 'AI Replies', 'Privacy Protected'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">The Email Overload Problem</h2>
          <div className="space-y-8">
            <div className="border-l-4 border-indigo-500 pl-8">
              <h3 className="text-2xl font-semibold mb-4">Modern Email Overwhelm</h3>
              <p className="text-gray-300 mb-4">
                The average professional receives between 85-120 emails daily, with only 20-30% being truly important. 
                Email fatigue has become a significant productivity challenge, with workers spending 28% of their workday 
                managing inbox clutter, prioritizing non-urgent messages, and searching for critical communications buried 
                beneath promotional content and notifications.
              </p>
              <p className="text-gray-300">
                Traditional email clients offer no intelligence layer—they simply present all messages equally, forcing 
                users to manually sort, prioritize, and respond to each message. This creates mental overhead, reduces 
                focus on meaningful work, and contributes to the widespread phenomenon of "email anxiety" across professional 
                and personal users alike.
              </p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-8">
              <h3 className="text-2xl font-semibold mb-4">The Supamail AI Solution</h3>
              <p className="text-gray-300 mb-4">
                Supamail AI introduces an intelligent layer to email management by deploying advanced AI algorithms to 
                understand context, extract meaning, and provide actionable insights from your email stream. Rather than 
                eliminating emails (which would be irresponsible), Supamail AI makes every email faster to consume, easier 
                to understand, and simpler to respond to—all while protecting your privacy.
              </p>
              <p className="text-gray-300">
                By combining one-line summaries, intelligent threading, automatic categorization, and context-aware reply 
                suggestions, Supamail AI can reduce the time spent processing emails by 40-60% while ensuring you never 
                miss important communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-gray-400">
              Comprehensive email intelligence designed for the modern professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'One-Line Email Summaries',
                description:
                  'Supamail AI analyzes each email and generates a concise one-line summary, allowing you to understand the key content instantly. Complex messages are distilled to their essential meaning, enabling rapid email review without losing important context.',
                highlights: ['Instant comprehension', 'Context preservation', 'Reduced reading time', 'ML-powered accuracy'],
              },
              {
                icon: <Inbox className="w-8 h-8" />,
                title: 'Intelligent Thread Grouping',
                description:
                  'Similar emails from the same sender are automatically grouped into single unified threads. This eliminates visual clutter, reduces scrolling, and presents conversations as cohesive narratives rather than fragmented message chains.',
                highlights: ['Conversation view', 'Reduces clutter', 'Easier navigation', 'Cleaner interface'],
              },
              {
                icon: <Filter className="w-8 h-8" />,
                title: 'Auto-Categorization System',
                description:
                  'Emails are automatically sorted into intelligent categories: Important, Transactional, Promotional, Social, and Custom. This removes the manual burden of folder management while ensuring critical messages surface immediately.',
                highlights: ['Smart sorting', 'Category automation', 'Priority identification', 'Customizable filters'],
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'AI-Powered Reply Suggestions',
                description:
                  'Supamail AI analyzes incoming messages and generates context-aware reply suggestions. With a single tap, you can send professionally crafted responses, dramatically accelerating email composition time.',
                highlights: ['Context awareness', 'Professional tone', 'One-tap response', 'Time saving'],
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Scheduled Daily Digests',
                description:
                  'Receive a summarized digest of your emails at your preferred time each day. This consolidates all daily activity into one focused review session, reducing the impulse to constantly check your inbox.',
                highlights: ['Custom timing', 'Consolidated view', 'Daily summaries', 'Distraction reduction'],
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: 'Smart Notification Control',
                description:
                  'Mute unwanted alerts and control notification preferences with granular precision. Reduce notification fatigue while ensuring urgent messages still break through your attention barriers.',
                highlights: ['Selective muting', 'Custom alerts', 'Focus time', 'Smart timing'],
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-white/5 to-white/10 border-indigo-500/20 hover:border-indigo-400/30 transition group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-indigo-400 transition">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight) => (
                      <Badge key={highlight} className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
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

      {/* Privacy & Security Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Privacy-First Architecture</h2>
              <p className="text-gray-300 mb-6">
                Supamail AI is CASA Tier 2 certified, meaning your email data is protected by enterprise-grade security 
                standards. We do not store emails beyond what's necessary to provide our features, and your data is never 
                used for training, improvement, or any other purpose without explicit consent.
              </p>
              <div className="space-y-4">
                {[
                  'CASA Tier 2 certified for security compliance',
                  'Minimal data retention—only what\'s necessary',
                  'No email storage for model training',
                  'Encrypted communication protocols',
                  'User data controls and deletion options',
                  'Transparent privacy policy and practices',
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-2xl p-8 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Shield className="w-24 h-24 text-indigo-400 mx-auto mb-4 opacity-80" />
                <p className="text-gray-400">Enterprise Security Standard</p>
                <p className="text-sm text-gray-500 mt-2">CASA Tier 2 Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Transformative Benefits</h2>
            <p className="text-xl text-gray-400">
              Measurable improvements to productivity and wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Reclaim Productivity',
                stat: '40-60%',
                description: 'Reduce email processing time significantly. Studies show users spending 28% of workday on emails can recover 11-17% of their day by streamlining email management with AI assistance.',
              },
              {
                title: 'Reduce Decision Fatigue',
                stat: '50+',
                description: 'Emails are decisions—read/unread, respond/archive, important/unimportant. Supamail AI reduces decisions per email session dramatically through intelligent prioritization.',
              },
              {
                title: 'Eliminate Inbox Anxiety',
                stat: '85%',
                description: 'Over 85% of professionals report email-related stress. Intelligent organization and categorization provides peace of mind and mental clarity.',
              },
              {
                title: 'Never Miss Critical Messages',
                stat: '99.2%',
                description: 'With smart categorization, important emails are reliably surfaced. No more critical messages buried under promotional clutter.',
              },
            ].map((benefit, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
                <CardContent className="pt-8">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-indigo-400 mb-2">{benefit.stat}</div>
                    <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Perfect For</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Busy Professionals',
                description: 'Executives and managers juggling hundreds of emails daily can rapidly process communication without losing critical information or context.',
              },
              {
                title: 'Startup Founders',
                description: 'Entrepreneurs managing investor relations, customer communications, and team coordination benefit from intelligent email triage and quick response capabilities.',
              },
              {
                title: 'Customer Support Teams',
                description: 'Support representatives can quickly understand customer issues through email summaries and generate professional responses faster.',
              },
              {
                title: 'Sales Professionals',
                description: 'Sales teams can stay on top of prospect communication, organize by pipeline stage, and respond quickly to opportunities.',
              },
              {
                title: 'Freelancers & Consultants',
                description: 'Independent professionals managing multiple client relationships benefit from intelligent organization and response time acceleration.',
              },
              {
                title: 'Remote Workers',
                description: 'Remote team members can better manage asynchronous communication and stay focused during deep work sessions.',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-lg p-6 hover:border-indigo-400/30 transition">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                  {useCase.title}
                </h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">
              Get started free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: '7-Day Free Trial',
                price: 'Free',
                description: 'Experience Supamail AI features completely free',
                features: ['Full feature access', 'One-line summaries', 'Smart replies', 'Thread grouping', 'Daily digests'],
              },
              {
                name: 'Premium Subscription',
                price: '$4.99',
                period: 'per month',
                description: 'Unlimited AI email features',
                features: ['Full feature access', 'One-line summaries', 'Smart replies', 'Thread grouping', 'Daily digests', 'Custom categories'],
                badge: 'Recommended',
              },
            ].map((plan, idx) => (
              <Card key={idx} className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border-indigo-500/20 hover:border-indigo-400/30 transition ${plan.badge ? 'ring-2 ring-indigo-500/50' : ''}`}>
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/50">
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
                    <div className="text-4xl font-bold text-indigo-400">{plan.price}</div>
                    {plan.period && <div className="text-gray-400 text-sm">{plan.period}</div>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'How does Supamail AI protect my email privacy?',
                answer: 'Supamail AI is CASA Tier 2 certified, meaning it meets enterprise security standards. We do not store emails beyond what\'s necessary to provide our features. Your email data is never used for model training or shared with third parties without consent.',
              },
              {
                question: 'Is Supamail AI available on Android?',
                answer: 'Currently, Supamail AI is available exclusively on iOS 17 and later. An Android version is in development and will be released in future updates.',
              },
              {
                question: 'Can I try Supamail AI before paying?',
                answer: 'Yes! Supamail AI offers a 7-day free trial with full feature access. After the trial, continue with a $4.99/month subscription.',
              },
              {
                question: 'How does email summarization work?',
                answer: 'Supamail AI uses advanced machine learning algorithms to analyze email content and extract the key message into a single concise line. The AI understands context, intent, and importance to provide accurate summaries.',
              },
              {
                question: 'Can I customize the email categories?',
                answer: 'Yes, premium subscribers can create custom categories beyond the default Important, Transactional, Promotional, and Social categories.',
              },
              {
                question: 'Does Supamail AI work with all email providers?',
                answer: 'Supamail AI integrates with standard IMAP email accounts, supporting Gmail, Outlook, Apple Mail, and other IMAP-compatible email services.',
              },
              {
                question: 'How accurate are the AI-powered reply suggestions?',
                answer: 'The AI analyzes email context to generate contextually appropriate responses. Reply suggestions are drafted but can be edited before sending, ensuring you maintain control over your communications.',
              },
              {
                question: 'Can I schedule digests at specific times?',
                answer: 'Yes, you can customize digest delivery time to match your preferred email review schedule—morning, afternoon, or evening.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-indigo-500/20 rounded-lg overflow-hidden hover:border-indigo-400/30 transition"
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
                  <div className="px-6 py-4 bg-white/5 border-t border-indigo-500/20">
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
          <h2 className="text-3xl font-bold mb-4 text-center">Get Started with Supamail AI</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Three simple steps to intelligent email management
          </p>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Download Supamail AI',
                description: 'Search for "Supamail AI" on the App Store or visit supamail.ai to download the iOS app.',
              },
              {
                step: '2',
                title: 'Connect Your Email Account',
                description: 'Authenticate with your email provider (Gmail, Outlook, etc.) to grant Supamail AI access to your inbox.',
              },
              {
                step: '3',
                title: 'Start Using AI Features',
                description: 'Immediately begin enjoying one-line summaries, smart organization, reply suggestions, and daily digests.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 bg-white/5 border border-indigo-500/20 rounded-lg p-6 hover:border-indigo-400/30 transition">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold">
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
          <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  SEO & Growth
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Amplify Your Digital Visibility</h2>
                <p className="text-gray-300 mb-6">
                  If you're building productivity apps, developing email solutions, or operating in the tech space, 
                  your digital presence determines your market reach. Just as Supamail AI intelligently optimizes email 
                  management, strategic SEO optimization ensures your product reaches the right audience.
                </p>
                <p className="text-gray-300 mb-8">
                  Backlink ∞ combines white-hat link building with comprehensive SEO strategies to establish domain authority 
                  and drive qualified organic traffic to your digital properties and products.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Premium domain backlinks from tech and productivity industry leaders',
                    'Comprehensive SEO authority development for SaaS and apps',
                    'Organic traffic generation through strategic search rankings',
                    'Full transparency with detailed reporting and analytics',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg">
                    Register for Backlink ∞
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-2xl p-8">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-400 mb-2">3-6 Months</div>
                    <p className="text-gray-400">Average time to reach top 10 rankings</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">+350%</div>
                    <p className="text-gray-400">Average organic traffic increase</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-400 mb-2">100%</div>
                    <p className="text-gray-400">White-hat ethical practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 border-t border-indigo-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Email Experience Today</h2>
          <p className="text-lg text-gray-400 mb-8">
            Download Supamail AI for free and discover how AI can revolutionize your inbox management. Register for Backlink ∞ to maximize your digital presence and SEO authority.
          </p>
          <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg">
              Register for Backlink ∞
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupamailAI;
