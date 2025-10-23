import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Code, Users, AlertCircle, Sparkles, Cpu, Eye, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import RankHeader from '@/components/RankHeader';

export default function Basalt() {
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
            Ship AI Agents Your Users Will Trust
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 leading-tight">
            The Complete AI Agent Platform
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Basalt is the end-to-end platform designed to help teams build, evaluate, monitor, and continuously improve AI agents that deliver reliable results in production. Transform how you develop AI-powered features with comprehensive tooling for every stage of the lifecycle.
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
            { number: '50+', label: 'AI Evaluators & Templates' },
            { number: '100%', label: 'Production Monitoring' },
            { number: '10x', label: 'Faster Deployment' },
            { number: '99.9%', label: 'Reliability Rate' }
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

      {/* What is Basalt Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              What is Basalt? Understanding the AI Agent Revolution
            </h2>
            <p className="text-lg text-slate-600">
              In today's rapidly evolving AI landscape, organizations face a critical challenge: how to develop, deploy, and maintain AI agents that users can actually trust. Basalt emerges as a comprehensive solution to this fundamental problem, offering an integrated platform that bridges the gap between AI development and production reliability.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
            <p className="text-slate-700 leading-relaxed mb-4">
              Basalt is not just another AI tool—it's a complete end-to-end platform that encompasses the entire lifecycle of AI agent development. From initial prompt crafting and iterative refinement to rigorous evaluation, seamless deployment, and continuous production monitoring, Basalt provides teams with all the necessary components to ship high-quality AI agents with confidence.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The platform bridges critical gaps that have historically plagued AI development: the struggle between moving fast and maintaining quality, the challenge of collaborating across technical and non-technical teams, and the difficulty of ensuring consistent performance in production environments. Basalt democratizes AI development by providing powerful automation and intuitive tools that make advanced AI engineering accessible to teams of all skill levels.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Core Features That Transform AI Development
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Code,
              title: 'No-Code Prompt Playground',
              description: 'Draft, test, and iterate on prompts without writing a single line of code. The intuitive playground interface allows product managers, designers, and non-technical team members to actively participate in prompt development and optimization.'
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Copilot Assistance',
              description: 'Leverage built-in AI copilots that provide intelligent suggestions for prompt improvement, helping you achieve better results faster. The copilot learns from your patterns and provides contextual recommendations based on your specific use case.'
            },
            {
              icon: Gauge,
              title: 'Automated Evaluation & Testing',
              description: 'Scale your testing capabilities with 50+ AI evaluator templates that automatically assess prompt performance. Generate comprehensive test cases, run evaluations against multiple scenarios, and receive human feedback all within the platform.'
            },
            {
              icon: BarChart3,
              title: 'Multi-Model Optimization',
              description: 'Test your agents across different AI models simultaneously. Version your prompts, compare results across models like GPT-4, Claude, and others, ensuring you choose the optimal model for your specific requirements.'
            },
            {
              icon: Eye,
              title: 'Production Monitoring & Tracing',
              description: 'Monitor your AI agents in real-time as they operate in production. Capture detailed traces of each execution, identify issues before users are affected, and maintain comprehensive audit logs for compliance and debugging.'
            },
            {
              icon: Users,
              title: 'Collaborative Development',
              description: 'Enable cross-functional collaboration with tools designed for teams. Product managers, engineers, and domain experts can work together seamlessly, with role-based access and integrated feedback systems.'
            },
            {
              icon: Zap,
              title: 'Seamless SDK Integration',
              description: 'Deploy AI features with dedicated SDKs for TypeScript/JavaScript and Python. Manage versioning, rollouts, and updates directly from your codebase with minimal friction and maximum control.'
            },
            {
              icon: AlertCircle,
              title: 'Production Alerting',
              description: 'Set custom criteria for production errors and receive immediate alerts when issues occur. Establish quality thresholds and automatically monitor for deviations in agent performance and reliability.'
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
          How Basalt Works: The Complete Workflow
        </h2>

        <div className="space-y-8">
          {[
            {
              step: '1',
              title: 'Build & Prototype',
              description: 'Start in the intuitive no-code prompt playground where you can draft initial prompts, experiment with different approaches, and get real-time feedback. The AI copilot assists with suggestions and improvements, accelerating your prototyping phase from weeks to days.'
            },
            {
              step: '2',
              title: 'Evaluate at Scale',
              description: 'Generate comprehensive test cases and run automated evaluations using 50+ AI evaluator templates. Test your agents against realistic scenarios, measure performance against your quality standards, and gather feedback from human reviewers to ensure reliability.'
            },
            {
              step: '3',
              title: 'Optimize & Iterate',
              description: 'Use evaluation results to identify improvement opportunities. The platform surfaces exact issues in your prompts, suggests refinements, and allows you to test variations across different models. Compare results side-by-side to find the optimal configuration.'
            },
            {
              step: '4',
              title: 'Deploy with Confidence',
              description: 'Integrate your verified agents into production using the Basalt SDK. Manage versions, control rollouts, and maintain multiple environments with simple configuration. The SDK handles complexity so your team can focus on feature quality.'
            },
            {
              step: '5',
              title: 'Monitor & Maintain',
              description: 'Track agent performance in production with real-time monitoring and detailed execution traces. Set up alerts for quality issues, monitor user satisfaction metrics, and maintain comprehensive audit trails. Identify problems before they impact users.'
            },
            {
              step: '6',
              title: 'Continuously Improve',
              description: 'Use production insights to drive ongoing improvements. Identify patterns in failures, test refinements safely with A/B testing, and roll out improvements confidently. The platform enables rapid iteration even in production environments.'
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
          Transformative Benefits for AI Teams
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Accelerated Time-to-Market
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Automate repetitive tasks and streamline workflows that traditionally took months. With Basalt's comprehensive tooling, teams can move from concept to production-ready agents in weeks rather than quarters, gaining competitive advantage in the rapidly evolving AI market.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Superior Quality Assurance
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Continuous evaluation and monitoring ensure your agents consistently meet quality standards. Automated testing catches issues early, preventing costly mistakes and ensuring users experience reliable, trustworthy AI features every time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Enhanced Team Collaboration
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Break down silos between product, engineering, and domain experts. The platform enables non-technical stakeholders to actively participate in AI development, democratizing expertise and ensuring diverse perspectives shape your AI agents.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Reduced Operational Risk
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive monitoring and alerting systems catch production issues before they become problems. Detailed execution traces enable rapid debugging, and versioning allows you to quickly roll back if needed, minimizing customer impact.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Cost Optimization
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Reduce unnecessary API calls and token consumption by optimizing prompts before deployment. A/B testing capabilities help you identify the most cost-effective approaches while maintaining quality, directly improving your bottom line.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Competitive Innovation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Stay ahead of competitors by rapidly iterating on AI features. The platform's tools for testing across models and evaluating new approaches enable you to experiment faster and bring innovations to market before competitors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Enterprise-Grade Security
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Built with enterprise requirements in mind, Basalt provides comprehensive security controls, audit logging, and compliance features. Maintain detailed records of all changes and decisions for regulatory compliance and internal governance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Sustainable Growth
              </h3>
              <p className="text-slate-600 leading-relaxed">
                As your AI initiatives scale, Basalt scales with you. The platform supports teams of any size, from small startups to large enterprises, with infrastructure designed for reliability and performance even under demanding production workloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Real-World Use Cases
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: 'Customer Support Automation',
              description: 'Deploy AI-powered support agents that understand customer intent and provide accurate solutions. Continuously monitor performance and improve response quality based on customer satisfaction metrics and interaction patterns.'
            },
            {
              icon: BarChart3,
              title: 'Content Generation at Scale',
              description: 'Build AI systems that generate high-quality content across multiple formats. Test variations, evaluate quality, and optimize for different use cases—from product descriptions to marketing copy to technical documentation.'
            },
            {
              icon: Zap,
              title: 'Data Analysis & Insights',
              description: 'Create agents that extract insights from complex data sources. Verify accuracy through automated evaluation, monitor performance across different data types, and continuously improve analysis quality based on business outcomes.'
            },
            {
              icon: Users,
              title: 'Lead Qualification & Scoring',
              description: 'Deploy agents that qualify leads and score prospects with consistency and accuracy. A/B test different qualification criteria, monitor conversion impact, and continuously refine based on sales team feedback.'
            },
            {
              icon: Shield,
              title: 'Compliance & Risk Assessment',
              description: 'Build agents that identify risks and ensure compliance with regulations. Use comprehensive evaluation to verify accuracy, maintain audit logs for regulatory requirements, and continuously improve detection capabilities.'
            },
            {
              icon: Eye,
              title: 'Product Recommendations',
              description: 'Deploy recommendation engines that provide personalized suggestions. Monitor engagement metrics, A/B test different approaches, and continuously improve recommendations based on user behavior and feedback.'
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

      {/* Technical Excellence Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Technical Excellence at Scale
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Developer-Friendly SDKs</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Basalt provides comprehensive SDKs for TypeScript/JavaScript and Python, making integration into your existing projects straightforward. The SDKs handle versioning, deployment, and monitoring automatically, so your team can focus on building features rather than managing infrastructure.
            </p>
            <p className="text-slate-600 leading-relaxed">
              With support for multiple programming languages and frameworks, Basalt integrates seamlessly into diverse technology stacks, whether you're using React, Node.js, Python FastAPI, or any other modern technology stack. The consistent API across languages ensures your team can move between projects without relearning integration patterns.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Advanced Evaluation Framework</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              The 50+ AI evaluator templates provide out-of-the-box evaluation for common scenarios, from semantic correctness to factual accuracy to user satisfaction. These templates can be customized for your specific requirements, allowing you to define quality standards that match your business objectives.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Beyond automated evaluation, Basalt supports human-in-the-loop workflows where subject matter experts can review and provide feedback on agent outputs. This hybrid approach combines the speed of automation with the nuance of human judgment, ensuring your quality standards remain appropriately sophisticated.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Comprehensive Monitoring & Observability</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Production monitoring goes beyond simple uptime checks. Basalt captures detailed execution traces showing exactly what your agents did, which models they used, which versions of prompts were called, and what the results were. This comprehensive traceability enables rapid debugging and continuous optimization.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Real-time alerting allows you to set custom criteria for what constitutes a problem. Whether it's a performance degradation, error rate spike, or quality threshold breach, Basalt detects issues immediately and notifies your team, enabling rapid response before users are impacted.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Model Testing & Optimization</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Instead of betting on a single AI model, Basalt lets you test your agents across multiple models simultaneously. This allows you to understand how different models perform on your specific use cases, ensuring you choose the optimal model for your requirements and budget.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The platform tracks model versions and performance over time, showing you which models perform best for different tasks. As new models become available, you can easily test and evaluate them, staying on the cutting edge of AI capabilities while maintaining stability in production.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Trusted by Leading Teams
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Basalt transformed how we develop AI features. What used to take months now takes weeks, and we have far more confidence in production quality.',
              author: 'Sarah Chen',
              role: 'VP of Engineering',
              company: 'AI-First Startup'
            },
            {
              quote: 'The evaluation framework is exceptional. We can automatically catch quality issues before they reach users, significantly reducing support tickets.',
              author: 'Marcus Rodriguez',
              role: 'Product Manager',
              company: 'Enterprise SaaS Company'
            },
            {
              quote: 'Cross-functional collaboration became natural with Basalt. Now our product managers can directly contribute to prompt development without writing code.',
              author: 'Emily Watson',
              role: 'Product Operations Lead',
              company: 'Tech Scale-up'
            },
            {
              quote: 'Production monitoring caught a subtle drift in our agent behavior that we definitely would have missed. The real-time alerting is invaluable.',
              author: 'David Kim',
              role: 'Principal Engineer',
              company: 'Fortune 500 Tech Company'
            },
            {
              quote: 'The ability to A/B test different agent approaches saved us thousands in API costs while improving quality. It pays for itself immediately.',
              author: 'Jessica Liu',
              role: 'AI Team Lead',
              company: 'FinTech Unicorn'
            },
            {
              quote: 'Deployment is trivial with the SDK. We can roll out updates confidently knowing we have comprehensive monitoring and the ability to rollback instantly.',
              author: 'Michael Torres',
              role: 'DevOps Engineer',
              company: 'Logistics Platform'
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
          Why Choose Basalt?
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-4 px-6 font-bold text-slate-900">Capability</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Basalt</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Manual Approach</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Limited Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['End-to-End Platform', true, false, false],
                ['No-Code Prompt Builder', true, false, true],
                ['Automated Evaluation at Scale', true, false, false],
                ['Production Monitoring', true, false, false],
                ['Real-Time Alerting', true, false, false],
                ['Multi-Model Testing', true, false, false],
                ['AI Copilot Assistance', true, false, false],
                ['50+ Evaluator Templates', true, false, false],
                ['Human-in-the-Loop Workflows', true, false, false],
                ['SDK Integration', true, false, false],
                ['Version Management', true, false, true],
                ['Comprehensive Audit Logs', true, false, false],
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
          Getting Started with Basalt
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Quick Start Path</h3>
            <div className="space-y-4">
              {[
                { step: 'Sign Up', time: '5 minutes', desc: 'Create your Basalt account and set up your first workspace' },
                { step: 'Create Your First Agent', time: '15 minutes', desc: 'Use the no-code playground to prototype your initial agent' },
                { step: 'Define Evaluation Criteria', time: '10 minutes', desc: 'Select appropriate evaluators for your use case' },
                { step: 'Deploy to Production', time: '20 minutes', desc: 'Integrate using the SDK and deploy your agent' },
                { step: 'Monitor & Optimize', time: 'Ongoing', desc: 'Watch real-time metrics and iterate based on performance' }
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
            <h3 className="text-2xl font-bold text-slate-900">What You Get</h3>
            <div className="space-y-3">
              {[
                'Full access to the no-code prompt playground',
                'Unlimited evaluations with all 50+ templates',
                'Real-time production monitoring and alerting',
                'TypeScript/JavaScript and Python SDKs',
                'Dedicated support for integration',
                'Access to AI copilot for prompt suggestions',
                'Comprehensive audit logs and analytics',
                'A/B testing capabilities for agent workflows',
                'Version management and rollback features',
                'Multi-model testing and comparison',
                'Human-in-the-loop evaluation workflows',
                'Enterprise-grade security and compliance features'
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
              q: 'Do I need to be a machine learning expert to use Basalt?',
              a: 'Not at all. Basalt is designed for teams with varying skill levels. The no-code prompt playground allows non-technical team members to participate in AI development. At the same time, advanced users appreciate the comprehensive SDKs and monitoring capabilities for sophisticated deployments.'
            },
            {
              q: 'Can I test across multiple AI models?',
              a: 'Yes, that\'s one of Basalt\'s key strengths. You can test your agents across different models (GPT-4, Claude, etc.) to understand how they perform on your specific use cases. This helps you choose the optimal model for your requirements and budget.'
            },
            {
              q: 'What about production monitoring? How detailed is it?',
              a: 'Basalt provides comprehensive execution traces showing exactly what your agents did, which models they used, which prompt versions were called, and what results were generated. You can set custom criteria for alerts and monitor performance metrics in real-time.'
            },
            {
              q: 'How quickly can I deploy an agent?',
              a: 'With the Basalt SDK, deployment takes minutes. You can integrate into your codebase, set up monitoring, and deploy to production same day. The platform handles versioning and rollback management automatically.'
            },
            {
              q: 'Is there a learning curve for the platform?',
              a: 'The core concepts are straightforward and well-documented. Most teams are productive within a few hours. Comprehensive documentation, tutorials, and support are available to accelerate your team\'s adoption.'
            },
            {
              q: 'How does Basalt handle enterprise security requirements?',
              a: 'Basalt is built with enterprise requirements in mind. It provides comprehensive audit logging, role-based access controls, encryption, compliance certifications, and dedicated security features. Detailed records of all changes and decisions support regulatory compliance.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
              <h3 className="font-bold text-slate-900 mb-3">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Future of AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              The Future of AI Development Starts Here
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              The landscape of AI development is rapidly evolving. Organizations that can move fast while maintaining quality will dominate their markets. Basalt enables exactly that: the ability to ship high-quality AI agents quickly, while maintaining the reliability and trustworthiness that users demand.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-12 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Timing Matters</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              The organizations winning with AI are those that have solved the fundamental challenges: how to develop and deploy agents reliably, how to monitor their behavior in production, and how to iterate rapidly based on real-world performance. These capabilities are no longer nice-to-have—they're essential for competitive success.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Basalt removes the barriers that have historically prevented teams from solving these challenges. By providing an integrated platform with all necessary tools and capabilities, Basalt lets teams focus on their core business problems rather than building infrastructure.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Whether you're building customer support AI, content generation systems, data analysis agents, or any other AI-powered feature, Basalt provides the foundation for success at scale. The question isn't whether you'll need these capabilities—it's how quickly you can implement them and start realizing the benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to Transform Your AI Development?
          </h2>

          <p className="text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
            Join forward-thinking teams that are using Basalt to ship AI agents faster, with better quality, and more confidence. Start building more reliable AI features today and see the difference that a comprehensive platform can make.
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
            Start for free • No credit card required • Full access to all features
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
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">Security</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Guides</a></li>
                <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600">SDKs</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookies</a></li>
                <li><a href="#" className="hover:text-blue-600">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-600">
                © 2024 Basalt. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-slate-600 hover:text-blue-600">Twitter</a>
                <a href="#" className="text-slate-600 hover:text-blue-600">LinkedIn</a>
                <a href="#" className="text-slate-600 hover:text-blue-600">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
