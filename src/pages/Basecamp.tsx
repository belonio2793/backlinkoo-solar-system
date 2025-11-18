import { ArrowRight, CheckCircle2, Briefcase, MessageSquare, Calendar, BarChart3, Users, Lock, Zap, FileText, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import RankHeader from '@/components/RankHeader';

export default function Basecamp() {
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
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-white"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Header from home page */}
      <RankHeader showTabs={false} ctaMode="navigation" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Refreshingly Straightforward Project Management
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
            Basecamp: The Calm, Organized Way to Manage Projects
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Basecamp is a web-based project management and team collaboration platform that brings clarity and organization to your work. With a 21-year track record, Basecamp provides everything your team needs in one place—projects, to-dos, discussions, file sharing, calendars, and client collaboration tools—without the overwhelming complexity of traditional project management software.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              className="bg-white"
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
            { number: '21', label: 'Years of Proven Excellence' },
            { number: '100K+', label: 'Active Teams Worldwide' },
            { number: '25', label: 'Consecutive Profitable Years' },
            { number: '30', label: 'Day Free Trial' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors">
              <div className="text-3xl font-bold bg-white">
                {stat.number}
              </div>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Basecamp Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              What is Basecamp? The Antidote to Project Management Chaos
            </h2>
            <p className="text-lg text-slate-600">
              In today's workplace, teams are drowning in communication tools. Slack for chat, Asana for tasks, Google Drive for files, Notion for documentation, Zoom for meetings—the list goes on. Each tool adds complexity, context-switching, and cost. Basecamp reimagines project management with a radical idea: put everything your team needs to collaborate and ship work in one calm, organized place.
            </p>
          </div>

          <div className="bg-white">
            <p className="text-slate-700 leading-relaxed mb-4">
              Basecamp is a complete project management platform created by 37signals, a company with 25+ years of profitability, zero debt, and a commitment to sustainable business practices. With over two decades of real-world experience managing thousands of teams across every industry imaginable, Basecamp has refined the art of helping teams work better together without unnecessary complexity.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The philosophy behind Basecamp is simple: great project management doesn't require overwhelming features or complicated interfaces. It requires clarity, organization, and a place where all work and conversations live together contextually. Basecamp delivers this vision by consolidating projects, to-do lists, discussions, file sharing, calendars, and client collaboration into one intuitive platform that teams can master in minutes, not weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Core Features That Transform Team Collaboration
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Briefcase,
              title: 'Unified Project Workspace',
              description: 'Each project is a complete hub where all related work lives together. Tasks, discussions, files, decisions, and deliverables are organized in one place. Team members immediately understand what needs doing, who owns what, and what progress has been made—no context switching required.'
            },
            {
              icon: MessageSquare,
              title: 'Organized Discussions & Messaging',
              description: 'Keep conversations organized and on-topic with message boards attached to projects. The Hey! menu centralizes all notifications in one never-annoying place. Pings enable quick 1:1 or small-group chats for direct communication without resorting to separate messaging apps.'
            },
            {
              icon: Target,
              title: 'Smart To-Do Lists & Kanban Views',
              description: 'Assign tasks with due dates, priorities, and responsible team members. Card tables provide Kanban-style views for visual progress tracking. Every to-do connects to its parent project, ensuring context is always available and work is never orphaned or forgotten.'
            },
            {
              icon: Calendar,
              title: 'Integrated Calendars & Scheduling',
              description: 'Shared calendars keep all deadlines visible and synchronized. See when items are due, coordinate team schedules, and never miss important project milestones. Calendar integration prevents scheduling conflicts and keeps everyone aligned on timelines.'
            },
            {
              icon: BarChart3,
              title: 'Visual Project Status & Reporting',
              description: 'The Lineup visualizes where all projects stand at a glance. Mission Control indicators show which projects need attention. Hill Charts display progress and momentum for detailed status insights. Reports give you confidence to hold teams accountable with data-driven visibility.'
            },
            {
              icon: FileText,
              title: 'Centralized File Storage & Sharing',
              description: 'Store, organize, and share documents without leaving your project workspace. Version history tracks changes, and discussions around files keep context intact. Files stay connected to the work they support, eliminating the need for separate file management tools.'
            },
            {
              icon: Users,
              title: 'Client Collaboration & Controlled Visibility',
              description: 'Invite clients directly into projects with granular permission controls. Share specific discussions, files, and updates while keeping sensitive internal work private. Clients see a complete record of questions, responses, and decisions—improving transparency and reducing miscommunication.'
            },
            {
              icon: Zap,
              title: 'Integrated Automation & Workflows',
              description: 'Automatic check-ins gather progress updates without the overhead of status meetings. Recurring tasks handle repetitive work. Integration with third-party tools via Doors and a powerful API enables custom workflows that adapt to your team\'s unique processes.'
            }
          ].map((feature, i) => (
            <Card key={i} className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white">
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
          How Basecamp Works: From Signup to Productivity
        </h2>

        <div className="space-y-8">
          {[
            {
              step: '1',
              title: 'Sign Up for Free Trial',
              description: 'Start your free 30-day trial with no credit card required. In 10 seconds after signup, the clarity begins. You immediately see a calm home screen that aggregates your projects, assignments, and upcoming work—a serene starting point each day.'
            },
            {
              step: '2',
              title: 'Create Your First Project',
              description: 'Set up a project and Basecamp automatically organizes the workspace. Invite your team members and start defining the work. Everything in the project—tasks, discussions, files, decisions—stays connected and contextual.'
            },
            {
              step: '3',
              title: 'Organize Tasks & Discussions',
              description: 'Add to-dos with assignees and due dates. Create message boards to discuss project direction and decisions. As conversations happen, they attach to the project, creating a permanent record that new team members can reference to understand context.'
            },
            {
              step: '4',
              title: 'Share Files & Collaborate',
              description: 'Upload documents, designs, and assets directly to projects. Comment on files and have discussions around deliverables. Version history ensures you always know what changed and when, while file organization keeps related assets together.'
            },
            {
              step: '5',
              title: 'Monitor Progress Visually',
              description: 'Use the Lineup to see all projects at a glance. Check Hill Charts for momentum and progress indicators. View reports that show productivity trends and project health. Visual tools replace guesswork with accurate, real-time status.'
            },
            {
              step: '6',
              title: 'Manage Clients & Stakeholders',
              description: 'Invite clients directly to specific projects with controlled visibility. Decide exactly what clients can see and access. Clients stay informed through shared updates and can submit feedback that becomes part of the official project record.'
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white">
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
          Real-World Benefits for Modern Teams
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Reduced Tool Fragmentation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Replace Slack, Asana, Dropbox, Google Docs, Notion, and other tools with one unified platform. Eliminate context-switching, reduce subscription costs, and simplify your technology stack. One tool, one place to look, one source of truth.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Faster Team Onboarding
              </h3>
              <p className="text-slate-600 leading-relaxed">
                New team members become productive in minutes. The intuitive interface requires no training, and all context exists in one place. Instead of learning multiple tools and hunting for information, they see everything immediately and can start contributing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Improved Client Relationships
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Keep clients informed and engaged without exposing internal discussions. Clients see decisions, progress, and deliverables in context. Transparent communication reduces miscommunication and builds trust through shared understanding of project status.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Significant Cost Savings
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Basecamp's straightforward pricing ($15 per user or $299/month unlimited) is typically cheaper than maintaining multiple SaaS tools. Replace 5-10 tools with Basecamp and watch your software budget shrink while productivity increases.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Better Communication & Alignment
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Organize conversations by topic and project instead of letting them scatter across channels. Every discussion has context, history is searchable, and nothing gets lost. Teams stay aligned because the complete picture is always visible.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Reduced Meeting Overhead
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Automatic check-ins replace status meetings. Visual dashboards answer questions without scheduling calls. Asynchronous updates let distributed teams work across time zones effectively. Reclaim hours weekly that were spent in meetings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Enhanced Accountability
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Clear task assignments, due dates, and progress visibility create natural accountability. Reports show who completed what and when. Transparent tracking helps teams self-organize and hold themselves to high standards.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Long-Term Platform Stability
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Basecamp is backed by 37signals—profitable for 25 straight years, privately held, and debt-free. Your data is secure with a company committed to long-term sustainability, not venture-capital-driven growth that might change the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Industries & Team Types Using Basecamp Successfully
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Briefcase,
              title: 'Creative & Design Agencies',
              description: 'Manage multiple client projects simultaneously with organized workspaces. Share creative assets, gather feedback, and keep project decisions documented. Perfect for designer and developer collaboration with client involvement.'
            },
            {
              icon: Target,
              title: 'Marketing Teams',
              description: 'Coordinate campaigns across multiple channels with clear task assignments and deadlines. Track content calendars, manage deliverables, and keep stakeholders informed. Message boards keep strategic discussions organized.'
            },
            {
              icon: Users,
              title: 'Software Development Teams',
              description: 'Manage feature development, bug fixes, and releases in organized projects. Connect discussions to code decisions. Share documentation and keep non-technical stakeholders informed through client collaboration features.'
            },
            {
              icon: Eye,
              title: 'Client Services & Consulting',
              description: 'Work directly with clients in shared projects with controlled visibility. Maintain deliverable lists and timelines. Create permanent records of decisions and feedback. Basecamp becomes your client portal without additional tools.'
            },
            {
              icon: Zap,
              title: 'Startups & Growing Companies',
              description: 'Cost-effective alternative to expensive project management suites. Simple enough for small teams, scalable for growth. All-in-one solution prevents tool sprawl as teams expand.'
            },
            {
              icon: FileText,
              title: 'Remote & Distributed Teams',
              description: 'Asynchronous collaboration across time zones. Automatic check-ins replace status meetings. All information is centralized and searchable, enabling distributed teams to work effectively without constant communication.'
            }
          ].map((useCase, i) => (
            <Card key={i} className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-white">
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

      {/* Security & Reliability Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Enterprise-Grade Security & Data Protection
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Data Security & Redundancy
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your data is stored in multiple, redundant data centers across the United States with geographic distribution for disaster recovery. Basecamp backs up your data several times daily, with backups replicated both locally and off-site in different geographic regions. This redundancy ensures your data is always protected and recoverable, even in worst-case scenarios.
            </p>
            <p className="text-slate-600 leading-relaxed">
              All data is encrypted in transit and at rest, following industry-standard security practices. 37signals maintains a comprehensive security program and publishes detailed security documentation so you understand exactly how your data is protected.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600" />
              Data Transparency & Control
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              You maintain complete control over your data. Basecamp provides self-service data export tools that allow you to download your data in usable formats anytime. Whether you want a backup or decide to switch platforms, the ability to export is always available without restrictions or complicated procedures.
            </p>
            <p className="text-slate-600 leading-relaxed">
              37signals publishes a public employee handbook and maintains transparent communications about company operations. This openness extends to data practices—you know exactly who can access your information and under what circumstances.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Company Stability & Longevity</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              37signals has been in business since 1999 and has maintained profitability for 25 consecutive years. The company is privately held, debt-free, and focused on sustainable growth rather than venture-capital-driven expansion. This means Basecamp remains committed to serving customers long-term without pressure to sell or drastically change the product.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Founded by authors of bestselling books including REWORK, Remote, and It Doesn't Have to Be Crazy at Work, 37signals has a proven track record of thoughtful product development and customer-centric decision making. Your investment in Basecamp is backed by a stable, principled company committed to your success.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">API & Integration Capabilities</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Basecamp provides a full-featured API with comprehensive documentation, enabling custom integrations with your existing tools. The Doors feature allows linking to external applications while keeping your core work centralized in Basecamp. Pre-built integrations exist for invoicing, accounting, time tracking, reporting, planning, and more.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The API is well-documented and actively maintained, allowing you to build custom workflows that adapt to your team's unique needs without being locked into Basecamp's built-in features alone.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Success Stories from Real Teams
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Basecamp eliminated our need for six different tools. We save thousands monthly while our team is actually more productive because everything is in one place.',
              author: 'Jennifer Lee',
              role: 'Project Manager',
              company: 'Digital Agency'
            },
            {
              quote: 'The client collaboration features are incredible. Our clients feel more involved and informed than ever, which has improved our retention rates significantly.',
              author: 'Robert Martinez',
              role: 'Agency Owner',
              company: 'Design Studio'
            },
            {
              quote: 'As someone who manages a remote-first team across 8 time zones, Basecamp\'s asynchronous communication features are game-changing. No more mandatory early morning meetings.',
              author: 'Sarah Patel',
              role: 'Executive Director',
              company: 'Global Tech Company'
            },
            {
              quote: 'The simplicity is refreshing. We onboarded 40 new team members and nobody needed training. The interface is self-explanatory and people start being productive immediately.',
              author: 'David Chen',
              role: 'Operations Manager',
              company: 'Growing Startup'
            },
            {
              quote: 'Finally, a project management tool designed for humans, not for consultants trying to justify complexity. Basecamp just works.',
              author: 'Emma Thompson',
              role: 'Creative Director',
              company: 'Branding Firm'
            },
            {
              quote: 'The Lineup visual shows our true project status at a glance. No more guessing games about where things stand. Reports actually mean something.',
              author: 'Marcus Johnson',
              role: 'VP Operations',
              company: 'Marketing Company'
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
          Why Teams Choose Basecamp Over Alternatives
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-4 px-6 font-bold text-slate-900">Feature</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Basecamp</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Asana/Monday</th>
                <th className="text-center py-4 px-6 font-bold text-slate-900">Slack + Other Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['All-in-One Platform', true, false, false],
                ['Integrated File Storage', true, true, false],
                ['Client Collaboration Built-In', true, false, false],
                ['Simple, Intuitive Interface', true, false, false],
                ['Affordable Pricing', true, false, false],
                ['Project Discussions & Messaging', true, false, true],
                ['Visual Status Reports', true, true, false],
                ['Automatic Check-Ins', true, false, false],
                ['No Training Required', true, false, false],
                ['Long-Term Stability', true, false, false],
                ['Data Export Available', true, true, true],
                ['API for Custom Integrations', true, true, false],
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

      {/* Pricing & Getting Started Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Simple Pricing & Getting Started
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Transparent Pricing Plans</h3>
            <div className="space-y-4">
              {[
                { plan: 'Per User Plan', price: '$15/user/month', features: ['All features included', '500 GB storage', 'Free guest invitations', 'Perfect for small teams'] },
                { plan: 'Pro Unlimited Plan', price: '$299/month', features: ['Unlimited users', '5 TB storage', 'Priority support', 'Perfect for growing teams'] }
              ].map((pricing, i) => (
                <div key={i} className="p-6 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
                  <p className="font-semibold text-slate-900 mb-1">{pricing.plan}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-3">{pricing.price}</p>
                  <ul className="space-y-2">
                    {pricing.features.map((feature, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Quick Start in Minutes</h3>
            <div className="space-y-4">
              {[
                { step: 'Sign Up', time: '2 minutes', desc: 'Start your free 30-day trial immediately' },
                { step: 'Create Project', time: '5 minutes', desc: 'Set up your first project and invite team' },
                { step: 'Start Working', time: 'Immediate', desc: 'Add tasks, share files, discuss openly' },
                { step: 'Experience Clarity', time: 'Day 1', desc: 'See how much productivity increases' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white">
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
        </div>

        <div className="mt-12 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-slate-700 mb-4">
            <strong>Special offer:</strong> Try Basecamp free for 30 days. No credit card required. Full access to all features. Cancel anytime.
          </p>
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
              q: 'Can we invite clients to Basecamp?',
              a: 'Absolutely! Basecamp is designed for client collaboration. You control exactly what clients can see—share specific projects, discussions, and files while keeping internal work private. Clients get visibility without access to sensitive information.'
            },
            {
              q: 'How does Basecamp compare to Asana or Monday.com?',
              a: 'Basecamp is simpler and more affordable. It replaces multiple tools (Asana + Slack + Dropbox) with one integrated platform. No complex setup or training required. Basecamp focuses on collaboration clarity rather than enterprise complexity.'
            },
            {
              q: 'Is Basecamp suitable for large organizations?',
              a: 'Yes, many large organizations use Basecamp successfully. The Pro Unlimited plan ($299/month) supports unlimited team members. Basecamp scales well while maintaining its signature simplicity. Larger organizations appreciate the cost savings and reduced tool complexity.'
            },
            {
              q: 'How secure is my data in Basecamp?',
              a: 'Very secure. Data is encrypted in transit and at rest, backed up multiple times daily to geographically redundant data centers, and stored with cross-regional replication. You can export your data anytime. 37signals publishes detailed security documentation.'
            },
            {
              q: 'Can we integrate Basecamp with other tools?',
              a: 'Yes, Basecamp has a full-featured API and supports integrations through "Doors" for external tools. Pre-built integrations exist for invoicing, accounting, time tracking, and more. Custom integrations are possible via the API.'
            },
            {
              q: 'What if we want to leave Basecamp?',
              a: 'No problem. Basecamp provides self-service data export tools that allow you to download all your data in usable formats anytime. You\'re never locked in, and switching away is straightforward.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
              <h3 className="font-bold text-slate-900 mb-3">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Future of Work Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              The Future of Team Collaboration: Simplicity Over Complexity
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              The trend toward tool fragmentation has failed teams. In the pursuit of specialized features, organizations accumulated 10, 15, or even 20 different SaaS applications. The result is chaos—information scattered across platforms, context constantly lost, and teams spending more time managing tools than doing actual work.
            </p>
          </div>

          <div className="bg-white">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">The Basecamp Philosophy</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Basecamp represents a revolutionary return to simplicity. Instead of asking "what feature is missing?", Basecamp asks "what feature is actually needed?". The result is a platform that does fewer things, but does them exceptionally well. Projects stay organized. Discussions stay contextualized. Files stay connected to the work they support. Clients stay informed without seeing sensitive information.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              With over two decades of real-world experience managing teams across every industry, 37signals has refined project management down to its essentials. Every feature in Basecamp exists because teams consistently asked for it. Every feature that would add complexity has been rejected, no matter how trendy.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The future of work belongs to teams that embrace simplicity. Teams that consolidate rather than fragment. Teams that value clarity over complexity. Basecamp leads that future by proving that great project management doesn't require overwhelming features��it requires organization, communication, and a place where all work lives together meaningfully.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="bg-white">
          <h2 className="text-4xl font-bold">
            Experience Project Management Clarity
          </h2>

          <p className="text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
            Stop managing multiple tools. Stop hunting for information scattered across platforms. Start with Basecamp and experience how refreshingly straightforward project management can be. Your team deserves better.
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
            Try free for 30 days • No credit card required • Full feature access
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
                <li><a href="#" className="hover:text-blue-600">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-blue-600">Free Trial</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Help & Docs</a></li>
                <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600">Status Page</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">About 37signals</a></li>
                <li><a href="#" className="hover:text-blue-600">Security</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Learning</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">REWORK Book</a></li>
                <li><a href="#" className="hover:text-blue-600">Remote Book</a></li>
                <li><a href="#" className="hover:text-blue-600">Live Classes</a></li>
                <li><a href="#" className="hover:text-blue-600">Guides</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-600">
                © 2024 Basecamp. Made by 37signals. Profitable for 25+ years.
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

// Add missing import
import { Sparkles } from 'lucide-react';
