import React, { useState, useEffect } from 'react';
import Seo from "@/components/Seo";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/claude.css';
import {
  ChevronDown,
  Zap,
  Brain,
  Code2,
  BookOpen,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  MessageCircle,
  Cpu,
  Lightbulb,
  Target,
  TrendingUp,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const Claude = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Update page title for SEO
    document.title = 'Claude by Anthropic - AI Thinking Partner for Complex Problems';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Claude is an advanced AI assistant by Anthropic designed to help solve complex problems, analyze data, write code, and collaborate on challenging projects with safety and reliability.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Claude is an advanced AI assistant by Anthropic designed to help solve complex problems, analyze data, write code, and collaborate on challenging projects with safety and reliability.';
      document.head.appendChild(meta);
    }

    // Add OpenGraph meta tags
    const ogMetas = [
      { property: 'og:title', content: 'Claude by Anthropic - Your AI Thinking Partner' },
      { property: 'og:description', content: 'An advanced AI assistant for complex problem-solving, code generation, data analysis, and strategic collaboration.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Claude by Anthropic' },
      { name: 'twitter:description', content: 'Your AI thinking partner for complex problems' },
      { name: 'keywords', content: 'Claude AI, Anthropic, AI assistant, machine learning, coding, data analysis, AI thinking partner' }
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
      'name': 'Claude',
      'description': 'An advanced AI assistant for complex problem-solving, code generation, and data analysis',
      'url': 'https://claude.ai',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web, iOS, macOS, Windows',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'name': 'Free'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '10000'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'Anthropic',
        'url': 'https://www.anthropic.com',
        'logo': 'https://www.anthropic.com/favicon.ico'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Scroll to top
    window.scrollTo(0, 0);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Simple subtle background */}

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced AI Thinking Partner
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
            Meet Your{' '}
            <span className="text-blue-600">
              Thinking Partner
            </span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Claude is an AI assistant designed to help you tackle complex problems, analyze vast datasets, write 
            sophisticated code, and collaborate on challenging projects. Powered by Anthropic's Constitutional AI 
            approach, Claude delivers helpful, honest, and harmless responses built for enterprise reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg">
                Power Your SEO with Backlink ∞
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <p className="text-sm text-slate-600 mb-4">Trusted by leading enterprises for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Data Analysis', 'Code Generation', 'Research', 'Strategic Planning'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section id="capabilities" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Powerful AI Capabilities</h2>
            <p className="text-lg text-slate-600">
              Claude combines cutting-edge AI technology with practical utility across numerous domains. Each capability
              is built on Constitutional AI for safe, reliable, and ethical responses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Code2 className="w-8 h-8" />,
                title: 'Advanced Code Generation & Analysis',
                description:
                  'Write, debug, explain, and optimize code across multiple programming languages. Claude understands complex architectural patterns and can help modernize legacy systems with precision and clarity.',
                highlights: ['Multi-language support', 'Architecture design', 'Legacy modernization'],
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Complex Problem Solving',
                description:
                  'Tackle intricate business challenges through deep reasoning. Claude excels at breaking down complex problems into manageable components and providing strategic recommendations grounded in analysis.',
                highlights: ['Strategic reasoning', 'Data-driven decisions', 'Pattern recognition'],
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Research & Content Creation',
                description:
                  'Generate comprehensive research summaries, detailed content pieces, and structured documentation. Claude produces well-cited, original content suitable for publications and strategic initiatives.',
                highlights: ['Original content', 'Citations & sources', 'Long-form writing'],
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Creative & Strategic Ideation',
                description:
                  'Brainstorm innovative solutions, develop marketing strategies, and create compelling narratives. Claude helps teams conceptualize new products and strategies with fresh perspectives.',
                highlights: ['Brainstorming', 'Concept development', 'Strategic planning'],
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Data Analysis & Visualization',
                description:
                  'Process and analyze large datasets, identify trends, and create interactive visualizations. Claude can work with structured data to uncover insights and generate actionable recommendations.',
                highlights: ['Data processing', 'Trend analysis', 'Interactive reports'],
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'Collaborative Problem-Solving',
                description:
                  'Serve as a thinking partner for cross-functional teams. Claude facilitates brainstorming sessions, refines ideas iteratively, and provides perspectives that enhance team productivity.',
                highlights: ['Team collaboration', 'Iterative refinement', 'Multi-perspective analysis'],
              },
            ].map((capability, idx) => (
              <Card key={idx} className="bg-white border-slate-200 hover:border-blue-300 transition group cursor-pointer" onClick={() => setExpandedFeature(expandedFeature === capability.title ? null : capability.title)}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                      {capability.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition text-slate-900">
                      {capability.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{capability.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {capability.highlights.map((highlight) => (
                      <Badge
                        key={highlight}
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
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

      {/* Claude Models Section */}
      <section id="models" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Claude Model Family</h2>
            <p className="text-lg text-slate-600">
              Choose the perfect Claude model optimized for your specific use case
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Claude Opus 4.1',
                tagline: 'Maximum Intelligence',
                description: 'The most capable model for complex reasoning, deep analysis, and strategic decision-making.',
                strengths: ['Deep research', 'Complex reasoning', 'System architecture', 'Strategic analysis'],
                color: 'from-purple-500 to-pink-500',
                icon: <Brain className="w-6 h-6" />,
              },
              {
                name: 'Claude Sonnet 4.5',
                tagline: 'Balanced Performance',
                description: 'Ideal for everyday work combining strong reasoning with speed. Perfect for writing, analysis, and automation tasks.',
                strengths: ['Writing tasks', 'Fast analysis', 'Task automation', 'Balanced speed'],
                color: 'from-amber-500 to-orange-500',
                icon: <Zap className="w-6 h-6" />,
                badge: 'Most Popular',
              },
              {
                name: 'Claude Haiku 4.5',
                tagline: 'Speed & Efficiency',
                description: 'Lightweight yet capable model designed for quick answers, real-time tasks, and high-volume operations.',
                strengths: ['Quick answers', 'Real-time tasks', 'Cost-efficient', 'High throughput'],
                color: 'from-blue-500 to-cyan-500',
                icon: <Lightbulb className="w-6 h-6" />,
              },
            ].map((model, idx) => (
              <Card
                key={idx}
                className="relative overflow-hidden bg-white border-slate-200 hover:border-slate-300 transition group"
              >
                {model.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {model.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-blue-100 p-2.5 mb-4 text-blue-600`}>
                    {model.icon}
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{model.name}</CardTitle>
                  <p className="text-blue-600 text-sm font-semibold mt-2">{model.tagline}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">{model.description}</p>
                  <div className="space-y-2 mb-6">
                    {model.strengths.map((strength) => (
                      <div key={strength} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-700">{strength}</span>
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
      <section id="use-cases" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Industry Applications</h2>
            <p className="text-lg text-slate-600">
              Claude transforms workflows across diverse sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                industry: 'Software Development',
                use_cases: ['Code generation and review', 'Architecture design', 'Legacy modernization', 'Technical documentation'],
                icon: <Code2 className="w-6 h-6" />,
              },
              {
                industry: 'Finance & Banking',
                use_cases: ['Risk analysis', 'Regulatory compliance', 'Market research', 'Financial modeling'],
                icon: <TrendingUp className="w-6 h-6" />,
              },
              {
                industry: 'Customer Support',
                use_cases: ['Intelligent routing', 'Response generation', 'Issue resolution', 'Knowledge management'],
                icon: <MessageCircle className="w-6 h-6" />,
              },
              {
                industry: 'Education & Research',
                use_cases: ['Research assistance', 'Content creation', 'Explanations', 'Learning support'],
                icon: <BookOpen className="w-6 h-6" />,
              },
              {
                industry: 'Marketing & Content',
                use_cases: ['Campaign strategy', 'Content writing', 'SEO optimization', 'Brand messaging'],
                icon: <Target className="w-6 h-6" />,
              },
              {
                industry: 'Government & Policy',
                use_cases: ['Policy analysis', 'Data synthesis', 'Document review', 'Strategic planning'],
                icon: <Shield className="w-6 h-6" />,
              },
            ].map((sector, idx) => (
              <Card key={idx} className="bg-white border-slate-200 hover:border-blue-300 transition">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                      {sector.icon}
                    </div>
                    <CardTitle className="text-slate-900">{sector.industry}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sector.use_cases.map((use_case, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{use_case}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Built on Constitutional AI</h2>
              <p className="text-slate-600 mb-6">
                Anthropic developed Claude using Constitutional AI, a novel approach that aligns the model 
                with human values and safety considerations. This methodology ensures Claude delivers responses 
                that are not only intelligent but also responsible and ethical.
              </p>
              <div className="space-y-4">
                {[
                  'Helpful: Designed to assist with complex tasks and provide clear, actionable insights.',
                  'Honest: Acknowledges limitations and provides accurate information without hallucination.',
                  'Harmless: Built with safety guardrails to prevent misuse and harmful outputs.',
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Shield className="w-24 h-24 text-blue-600 mx-auto mb-4 opacity-80" />
                <p className="text-slate-700">Constitutional AI Framework</p>
                <p className="text-sm text-slate-600 mt-2">Ethical, safe, and reliable AI assistant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Industry-Leading Performance</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: '200,000',
                label: 'Token Context Window',
                description: 'Process entire documents and lengthy conversations with full context awareness',
              },
              {
                metric: '99.9%',
                label: 'Uptime SLA',
                description: 'Enterprise-grade reliability for mission-critical applications',
              },
              {
                metric: '10x',
                label: 'Faster Training',
                description: 'Constitutional AI enables rapid iteration and continuous improvements',
              },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-slate-50 border-slate-200 text-center">
                <CardContent className="pt-8">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {stat.metric}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{stat.label}</h3>
                  <p className="text-slate-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Claude Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Access Claude Today</h2>
            <p className="text-lg text-slate-600 mb-8">
              Start using Claude for free or integrate it into your enterprise workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Backlink ∞ Pro SEO
                </Button>
              </a>
            </div>
            <div className="bg-slate-100 rounded-lg p-6 border border-slate-200 inline-block">
              <p className="text-sm text-slate-700">
                Free tier available • Enterprise plans • API access • Custom integrations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section for Backlink ∞ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-slate-900">Amplify Your Digital Presence with SEO Mastery</h2>
                <p className="text-lg text-slate-600 mb-6">
                  While Claude powers your content creation and analysis, Backlink ∞ ensures your valuable insights 
                  reach their maximum audience through proven SEO strategies and high-authority backlinks.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Strategic backlink placements from premium domains',
                    'Comprehensive SEO authority development',
                    'Traffic generation through optimized content distribution',
                    'White-hat link building techniques',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-700">{benefit}</span>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">350%+</div>
                    <p className="text-slate-600">Average traffic increase with SEO backlinks</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">Top 10</div>
                    <p className="text-slate-600">Search rankings achievable in 90 days</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                    <p className="text-slate-600">White-hat, ethical link building</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'What makes Claude different from other AI assistants?',
                answer:
                  'Claude is built on Constitutional AI, Anthropic\'s proprietary safety framework. This approach ensures Claude is not only highly capable but also trustworthy, honest, and aligned with human values. Claude excels at complex reasoning, long-form content creation, and maintaining context across extended conversations.',
              },
              {
                question: 'How much does Claude cost?',
                answer:
                  'Claude offers a free tier with daily usage limits. For advanced usage, Claude.ai offers reasonable subscription rates. Businesses can access Claude via API with enterprise pricing options. Visit anthropic.com for detailed pricing.',
              },
              {
                question: 'Can Claude access the internet?',
                answer:
                  'Claude cannot directly browse the internet, but it can be integrated with tools and APIs that extend its capabilities. The latest versions support function calling for external integrations and real-time data retrieval.',
              },
              {
                question: 'Is Claude suitable for enterprise use?',
                answer:
                  'Yes. Claude is designed for enterprise deployment with API access, SOC 2 compliance, dedicated support, and SLA guarantees. Many Fortune 500 companies rely on Claude for mission-critical applications.',
              },
              {
                question: 'How can I integrate Claude into my application?',
                answer:
                  'Anthropic provides comprehensive API documentation and SDKs for Python and JavaScript. You can build applications using the Claude API with straightforward integration, prompt engineering, and function calling capabilities.',
              },
              {
                question: 'What is the context window size?',
                answer:
                  'Claude 3 Opus and Sonnet models support a 200,000-token context window, enabling processing of full documents, lengthy conversations, and comprehensive project files without token limitations affecting analysis quality.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 transition bg-white"
              >
                <button
                  onClick={() => setExpandedFeature(expandedFeature === `faq-${idx}` ? null : `faq-${idx}`)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <h3 className="font-semibold text-left text-slate-900">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform text-slate-600 ${
                      expandedFeature === `faq-${idx}` ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFeature === `faq-${idx}` && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Start using Claude today and register for Backlink ∞ to amplify your digital presence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                Get Backlinks & Traffic
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Additional Context & Benefits Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Why Choose Claude?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                <Shield className="w-6 h-6 text-blue-600" />
                Enterprise-Grade Security
              </h3>
              <p className="text-slate-600">
                Anthropic has implemented rigorous safety protocols through Constitutional AI. Claude respects user privacy,
                maintains data confidentiality, and operates within ethical guidelines suitable for enterprise deployment.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                <Brain className="w-6 h-6 text-blue-600" />
                Advanced Reasoning
              </h3>
              <p className="text-slate-600">
                Claude excels at complex reasoning tasks, breaking down multi-layered problems and providing nuanced solutions.
                The model's deep understanding enables sophisticated analysis across diverse domains.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                <Code2 className="w-6 h-6 text-blue-600" />
                Programming Excellence
              </h3>
              <p className="text-slate-600">
                From writing production-ready code to debugging complex systems, Claude demonstrates mastery across
                multiple programming languages and frameworks. Perfect for developers and architects.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Creative Excellence
              </h3>
              <p className="text-slate-600">
                Claude balances analytical rigor with creative thinking. It generates original ideas, compelling narratives,
                and strategic innovations that drive business results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison & Integration Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-slate-900">Claude in Action</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">
            Real-world applications across industries demonstrating Claude's transformative impact
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  Software Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Generate and review production code across languages</p>
                <p className="text-sm text-slate-600">Design scalable system architectures</p>
                <p className="text-sm text-slate-600">Modernize legacy codebases efficiently</p>
                <p className="text-sm text-slate-600">Debug complex issues with detailed explanations</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Business Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Analyze market trends and competitive landscapes</p>
                <p className="text-sm text-slate-600">Generate strategic business recommendations</p>
                <p className="text-sm text-slate-600">Process financial data and identify patterns</p>
                <p className="text-sm text-slate-600">Create compelling data-driven narratives</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Content & Research
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Conduct deep research and synthesize findings</p>
                <p className="text-sm text-slate-600">Create original, well-cited content</p>
                <p className="text-sm text-slate-600">Generate comprehensive documentation</p>
                <p className="text-sm text-slate-600">Develop training materials and guides</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Getting Started with Claude</h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Quick steps to begin leveraging Claude for your needs
          </p>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Choose Your Access Method',
                description: 'Visit claude.ai for the free web interface, download Claude Desktop for macOS/Windows, or integrate via API for enterprise solutions.',
              },
              {
                step: '2',
                title: 'Start with Clear Prompts',
                description: 'Provide detailed context and specific instructions. Claude performs best with well-structured prompts that clearly explain your objectives and requirements.',
              },
              {
                step: '3',
                title: 'Iterate and Refine',
                description: 'Use Claude in a conversational manner. Provide feedback, ask for clarifications, and refine outputs iteratively to achieve your desired results.',
              },
              {
                step: '4',
                title: 'Explore Advanced Features',
                description: 'As you become proficient, leverage artifacts for long-form outputs, function calling for integrations, and system prompts for customized behavior.',
              },
              {
                step: '5',
                title: 'Scale with API Integration',
                description: 'For production use, integrate Claude via the Anthropic API. Scale your applications with enterprise support and custom deployment options.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 bg-white/5 border border-white/10 rounded-lg p-6 hover:border-amber-400/30 transition">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
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
          <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  SEO Enhancement
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Maximize Your Content's Reach</h2>
                <p className="text-gray-300 mb-6">
                  You've learned about Claude's incredible capabilities. Now ensure your valuable insights—whether created
                  with or without Claude—reach their full potential audience through strategic SEO and high-authority backlinks.
                </p>
                <p className="text-gray-300 mb-8">
                  Backlink ∞ combines white-hat link building with comprehensive SEO strategies to establish domain authority
                  and drive qualified organic traffic to your content.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Premium domain backlinks from relevant niches',
                    'Comprehensive SEO authority development',
                    'Organic traffic generation and ranking improvements',
                    'Full transparency with reporting and analytics',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg">
                    Register for Backlink ∞ Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-8">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-400 mb-2">3-6 Months</div>
                    <p className="text-gray-400">Average time to reach top 10 rankings</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">+350%</div>
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

      <Footer />
    </div>
  );
};

export default Claude;
