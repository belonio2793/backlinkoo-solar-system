import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

export default function JustPaid() {
  useEffect(() => {
    const title = 'Just Paid: AI Revenue Operations Platform for Automated Billing & Payment Tracking';
    const description = 'Just Paid is an AI-powered revenue operations platform that automates billing, invoicing, payment reminders, and collections. Unified dashboard for accounts receivable, contract management, and revenue insights. Reduce DSO and accelerate cash flow.';
    
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('theme-color', '#1f2937');
    
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/justpaid');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    
    upsertCanonical('https://backlinkoo.com/justpaid');
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Just Paid',
      applicationCategory: 'BusinessApplication',
      description: 'AI-powered revenue operations platform for automated billing, invoicing, and payment tracking',
      url: 'https://backlinkoo.com/justpaid',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: 'Contact for pricing',
        priceValidUntil: '2025-12-31'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1800'
      }
    };
    
    injectJSONLD('schema-app', schemaData);

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header variant="translucent" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight">
            Automate Your Revenue Operations with AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Just Paid transforms billing, invoicing, and payment collections through intelligent automation. Connect your financial systems, leverage autonomous AI to accelerate cash flow, and gain real-time visibility into your revenue operations.
          </p>
          <div className="inline-flex items-center gap-4">
            <span className="text-gray-400">Trusted by 1,800+ revenue teams</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
          </div>
        </section>

        {/* What is Just Paid Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-6 text-white">What is Just Paid?</h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Just Paid is a modern AI-powered revenue operations platform engineered specifically for finance teams, accountants, and business leaders who need to transform their billing and payment collection processes. Rather than managing disparate systems and manual workflows, Just Paid consolidates your entire revenue cycle—from contract management through final payment—into a single, intelligent platform.
          </p>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            The platform addresses a fundamental challenge in modern financial operations: the fragmentation of billing systems, payment tracking, and accounts receivable management. Companies typically juggle multiple tools for invoicing, accounting, payment processing, and customer data, creating silos that slow down collections and obscure revenue visibility. Just Paid eliminates these inefficiencies by creating a unified revenue operations center powered by autonomous AI.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Founded on the premise that modern finance requires intelligent automation, Just Paid combines sophisticated AI capabilities with financial compliance rigor. The platform automatically learns from your contracts, pricing models, and payment patterns to continuously improve billing accuracy, predict payment risks, and optimize your revenue streams in real time.
          </p>
        </section>

        {/* Core Problems It Solves */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Critical Challenges Just Paid Solves</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Prolonged Payment Collection Cycles</h3>
              <p className="text-gray-300 leading-relaxed">
                Manual payment follow-ups and disconnected reminder systems create unnecessary delays in cash collection. Finance teams spend countless hours chasing outstanding invoices across email, spreadsheets, and separate accounting systems. Just Paid's AI-powered reminder system automatically sends personalized payment reminders based on contract terms, payment history, and customer behavior patterns, dramatically reducing Days Sales Outstanding (DSO).
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Complex Multi-Model Billing Challenges</h3>
              <p className="text-gray-300 leading-relaxed">
                Modern revenue models span from flat-rate subscriptions to usage-based billing, tiered pricing, and hybrid structures. Managing these complex variations across multiple customers manually is error-prone and unsustainable. Just Paid's AI analyzes contract terms and pricing logic to automatically generate accurate invoices aligned to each customer's unique agreement, regardless of billing model complexity.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Financial Data Fragmentation</h3>
              <p className="text-gray-300 leading-relaxed">
                Billing information scattered across invoicing platforms, accounting software, payment processors, and CRM systems creates dangerous visibility gaps. Decision-makers lack real-time insight into cash flow, outstanding revenue, and customer payment behavior. Just Paid unifies all billing data into a centralized dashboard, providing instant access to cash flow status, revenue forecasts, and customer-level payment analytics.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Revenue Recognition and Compliance Risks</h3>
              <p className="text-gray-300 leading-relaxed">
                Navigating ASC 606 revenue recognition standards, tax regulations, and audit requirements demands precision. Manual processes introduce compliance risks that can trigger financial statement restatements and audit delays. Just Paid automates revenue recognition calculations, applies jurisdiction-specific tax rules automatically, and maintains audit-ready documentation throughout every transaction.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Scalability Constraints Without Headcount Growth</h3>
              <p className="text-gray-300 leading-relaxed">
                As companies scale, manual billing and collections processes become bottlenecks. Hiring additional finance staff to handle increased invoice volume and customer follow-ups is costly and slows down growth. Just Paid scales automatically with your business, processing more invoices, managing more customers, and accelerating collections without requiring additional finance team members.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Limited Revenue Insight and Forecasting Accuracy</h3>
              <p className="text-gray-300 leading-relaxed">
                Static reports generated weekly or monthly become outdated quickly. Finance teams lack the real-time visibility needed for accurate revenue forecasting and cash flow planning. Just Paid provides live dashboards showing revenue status, predictive analytics on customer payment behavior, and forward-looking cash flow projections that update continuously.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Powerful AI-Driven Features</h2>
          <div className="space-y-8">
            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Autonomous Accounts Receivable Management</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Just Paid's autonomous AR system manages your entire accounts receivable function. It automatically tracks outstanding invoices, analyzes payment patterns by customer, and identifies collection risks before they become problems. The system intelligently sequences reminder communications based on customer response patterns and payment history, maximizing collection rates while maintaining positive customer relationships.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automated payment reminders personalized by customer behavior</li>
                <li>Real-time visibility into outstanding receivables aging</li>
                <li>Predictive analytics identifying payment risk before delays occur</li>
                <li>Centralized view of AR metrics across all integrated systems</li>
              </ul>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Contract and Billing AI Engine</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Understanding contract terms is the foundation of accurate billing. Just Paid's AI reads and interprets complex contracts, extracting billing terms, pricing schedules, renewal dates, and usage thresholds. This intelligent analysis powers automatic invoicing that's always aligned to the actual contract—supporting flat-rate subscriptions, usage-based billing, tiered pricing, and hybrid models simultaneously.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>AI contract analysis extracting billing requirements</li>
                <li>Automatic provisioning and metering for usage-based pricing</li>
                <li>Support for complex pricing models including tiered and hybrid structures</li>
                <li>Automated price adjustments and contract renewals</li>
              </ul>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Unified Revenue Insights Dashboard</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Real-time visibility into your revenue operations is essential for informed decision-making. Just Paid's unified dashboard consolidates billing, payment, and revenue data from all connected systems into a single, real-time view. Finance leaders can instantly see cash flow status, outstanding receivables by customer, revenue trends, and customer payment behavior without switching between multiple platforms.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Real-time cash flow and revenue visibility</li>
                <li>Customer-level payment history and behavior analytics</li>
                <li>Revenue forecasting with predictive modeling</li>
                <li>Customizable dashboards for different stakeholder needs</li>
              </ul>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Revenue Recognition & Compliance Automation</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Financial compliance requirements are complex and constantly evolving. Just Paid automates revenue recognition calculations according to ASC 606 and IFRS 15 standards, applies tax rules for each jurisdiction, and maintains detailed compliance documentation. The platform handles deferred revenue, subscription accounting, and tax compliance automatically, reducing accounting team workload and eliminating compliance risks.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automatic ASC 606 and IFRS 15 revenue recognition</li>
                <li>Multi-jurisdiction tax compliance handling</li>
                <li>Audit-ready documentation and compliance reporting</li>
                <li>Subscription and deferred revenue accounting</li>
              </ul>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Flexible System Integration</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Your existing systems represent valuable business data and established workflows. Just Paid integrates seamlessly with major invoicing platforms, payment processors, accounting software, and CRM systems. The platform bridges these systems without requiring workflow changes, letting your teams continue working with familiar tools while benefiting from unified billing intelligence.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Integrations with invoicing, accounting, and payment platforms</li>
                <li>Real-time data synchronization across systems</li>
                <li>No disruption to existing billing workflows</li>
                <li>Extensible API for custom integrations</li>
              </ul>
            </div>

            <div className="bg-white">
              <h3 className="text-2xl font-bold text-white mb-4">Intelligent Upsell and Renewal Management</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Revenue growth extends beyond new customer acquisition. Just Paid tracks contract renewal dates, usage patterns, and growth indicators to identify upsell and renewal opportunities automatically. The system alerts teams to high-value renewals coming due, identifies customers with usage suggesting willingness to upgrade, and manages pricing changes and contract modifications seamlessly.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automatic renewal tracking and alerts</li>
                <li>Upsell opportunity identification based on usage patterns</li>
                <li>Automated pricing change management</li>
                <li>Lifecycle event tracking for revenue growth</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">How Just Paid Transforms Your Revenue Operations</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Connect Your Financial Systems</h3>
                <p className="text-gray-300 leading-relaxed">
                  Start by securely connecting Just Paid to your existing invoicing, payment, accounting, and CRM systems. The platform reads your billing data, contracts, and payment information, creating a unified view of your revenue operations without disrupting established workflows or requiring major system changes.
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
                <h3 className="text-2xl font-bold text-white mb-2">Enable Autonomous AI Billing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Just Paid's AI engine analyzes your contracts, pricing models, and billing requirements. It learns your billing patterns and begins generating accurate invoices automatically, aligned to each customer's unique agreement. The AI continuously improves, learning from any corrections and adapting to new contract types and pricing changes.
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
                <h3 className="text-2xl font-bold text-white mb-2">Activate Intelligent Collections</h3>
                <p className="text-gray-300 leading-relaxed">
                  The platform's autonomous AR system takes over payment tracking and follow-ups. It sends personalized reminders based on customer behavior, automatically escalates overdue accounts, and identifies collection risks before they become problems. Collections acceleration happens continuously without manual intervention.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Monitor Real-Time Revenue Intelligence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Access live dashboards showing cash flow status, outstanding receivables, revenue trends, and customer payment behavior. Make data-driven decisions with predictive analytics on cash forecasting and payment risk. Revenue insights update continuously, ensuring your team always has current information.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="text-xl font-bold">5</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ensure Financial Compliance</h3>
                <p className="text-gray-300 leading-relaxed">
                  Revenue recognition happens automatically according to ASC 606 and IFRS 15 standards. Tax rules are applied by jurisdiction. Audit trails and compliance documentation are maintained throughout every transaction, eliminating compliance risks and simplifying financial audits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Who Benefits From Just Paid</h2>
          
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For Financial Teams and Accountants</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Finance teams and accountants spend significant time on invoice generation, payment follow-ups, and AR management. Just Paid eliminates these repetitive tasks through automation, allowing your team to focus on strategic financial planning and analysis. Accountants gain instant access to revenue recognition calculations, tax compliance documentation, and audit-ready reporting without manual spreadsheet work.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The unified dashboard gives accountants real-time visibility into Days Sales Outstanding, revenue trends, and customer payment patterns—information traditionally locked in separate systems or requiring time-consuming report generation.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For B2B SaaS Companies</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              SaaS companies face unique billing challenges: subscriptions, usage-based pricing, metered billing, and frequent contract modifications. Just Paid's AI handles these complex billing models automatically. As your product roadmap evolves and pricing changes, the platform adapts without manual intervention, ensuring invoices always reflect current terms.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Automated renewal tracking and upsell identification help SaaS teams accelerate revenue growth. Just Paid identifies high-value renewals at risk and highlights customers with usage patterns suggesting upgrade potential, enabling proactive customer success efforts.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For Scaling Startups and Growth-Stage Companies</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Growth-stage companies face the challenge of scaling billing operations without hiring additional finance staff. Just Paid's autonomous billing and collections systems scale automatically with customer growth. As invoice volume increases and your customer base expands, the platform handles additional complexity without proportional cost increases.
            </p>
            <p className="text-gray-300 leading-relaxed">
              For investors and board meetings, real-time revenue dashboards provide the financial visibility that demonstrates control and professionalism. Just Paid ensures your financial reporting is accurate, compliant, and board-ready instantly.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">For Businesses with Complex Billing Models</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Companies with tiered pricing, usage-based billing, hybrid pricing models, or complicated contract structures traditionally require custom billing solutions or extensive manual work. Just Paid's intelligent contract and billing AI handles this complexity natively, generating accurate invoices regardless of how complex your pricing models are.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This capability is particularly valuable for marketplace businesses, platform companies, and service providers who negotiate unique pricing with major customers while maintaining standardized pricing for most of the customer base.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">For Multinational and International Operations</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              International revenue operations involve multiple currencies, tax jurisdictions, and regulatory requirements. Just Paid handles multi-currency invoicing, applies tax rules by region, and maintains compliance with GDPR, SOC 2, and other international standards. The platform scales across geographies without requiring separate systems or manual compliance management.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Companies expanding internationally can manage new markets through Just Paid without adding complexity to their financial operations or compliance burden.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Finance Leaders Trust Just Paid</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Just Paid gave us complete control over our billing for the first time. We went from managing invoices across three different systems to having one unified view. Our DSO improved by 18 days in the first three months."
              </p>
              <p className="text-white font-bold">Andy Li</p>
              <p className="text-gray-400 text-sm">CFO, B2B SaaS Company</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The AI billing engine completely revolutionized how we handle invoicing. We have customers with complex usage-based pricing, and Just Paid generates accurate invoices automatically. We haven't had a billing dispute in six months."
              </p>
              <p className="text-white font-bold">J.R. Faris</p>
              <p className="text-gray-400 text-sm">Controller, Technology Platform Company</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "We received exceptional service and support from the Just Paid team. The onboarding was smooth, and the platform integrated seamlessly with our existing systems. It's now critical to our financial operations."
              </p>
              <p className="text-white font-bold">Roxy Laufer</p>
              <p className="text-gray-400 text-sm">Finance Director, Growth-Stage Startup</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "As we scaled from 50 to 500 customers, billing became a nightmare. Just Paid transformed that nightmare into a streamlined process. The autonomous collections system alone has been worth every penny."
              </p>
              <p className="text-white font-bold">Mathieu Rihet</p>
              <p className="text-gray-400 text-sm">Operations Manager, Scaling SaaS</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Revenue recognition used to be a quarterly nightmare. Just Paid's ASC 606 automation ensures we're always compliant and removes stress from our audit process. Our auditors are impressed with the documentation."
              </p>
              <p className="text-white font-bold">Sarah Chen</p>
              <p className="text-gray-400 text-sm">Senior Accountant, Financial Services</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The real-time revenue dashboard gives our leadership team visibility we've never had before. We can forecast cash flow accurately and make data-driven business decisions. It's transformed how we operate."
              </p>
              <p className="text-white font-bold">Michael Torres</p>
              <p className="text-gray-400 text-sm">VP Finance, Enterprise SaaS</p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Just Paid vs. Manual Revenue Operations</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-700">
                  <th className="text-left py-4 px-4 text-white font-bold">Aspect</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Manual/Disconnected Systems</th>
                  <th className="text-center py-4 px-4 text-white font-bold">Just Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Invoice Generation</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual per customer</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Fully automated</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Payment Reminders</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual email sequences</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ AI-powered reminders</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Collections Management</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Time-consuming follow-ups</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Autonomous system</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Revenue Visibility</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Multiple systems, delayed reports</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Real-time unified dashboard</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Revenue Recognition</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Manual spreadsheet calculations</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Automatic ASC 606 compliance</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Tax Compliance</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Complex manual processes</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Multi-jurisdiction automation</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Complex Billing Models</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Requires custom development</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ AI handles all models</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">Payment Risk Prediction</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Reactive, after delays occur</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Predictive analytics</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">System Integration</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Data silos, manual updates</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Seamless integrations</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Finance Team Headcount Needed</td>
                  <td className="text-center py-4 px-4 text-gray-400">❌ Grows with volume</td>
                  <td className="text-center py-4 px-4 text-green-400">✅ Scales without headcount</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Business Impact Section */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Measurable Business Impact</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">18+ Days Faster Collections</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-powered reminders and autonomous collections reduce Days Sales Outstanding significantly. Finance teams report reducing DSO by 18-25 days on average, which translates to millions in improved cash flow for most organizations.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">95%+ Billing Accuracy</h3>
              <p className="text-gray-300 leading-relaxed">
                Automated, AI-powered invoicing eliminates human error. The platform achieves 95%+ accuracy on first-pass invoicing, reducing disputes and customer friction while improving accounts receivable metrics.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">40 Hours Monthly Saved</h3>
              <p className="text-gray-300 leading-relaxed">
                Finance teams report saving 40+ hours monthly on manual invoicing, payment follow-ups, and data reconciliation. This freed-up time enables strategic work like financial planning and revenue analysis instead of reactive billing management.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-white mb-4">100% Audit-Ready Compliance</h3>
              <p className="text-gray-300 leading-relaxed">
                Automated revenue recognition and tax compliance ensures your financial records are always audit-ready. Companies eliminate compliance risks and simplify external audits through automatic documentation and calculation verification.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-white">Enterprise-Grade Security and Compliance</h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Just Paid is engineered for organizations that require strict security, compliance, and data governance standards. The platform maintains enterprise-grade security practices and compliance certifications essential for modern financial operations.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Security Standards</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>SOC 2 Type II certified</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>GDPR compliant data handling</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>End-to-end encryption for sensitive data</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Regular penetration testing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Secure API access with OAuth 2.0</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Financial Compliance</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>ASC 606 revenue recognition</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>IFRS 15 compliance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Multi-jurisdiction tax compliance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Audit trail and documentation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Year-end financial reporting ready</span>
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
              <h3 className="text-xl font-bold text-white mb-4">How long does it take to implement Just Paid?</h3>
              <p className="text-gray-300 leading-relaxed">
                Implementation typically takes 2-4 weeks depending on system complexity and data volume. Just Paid provides a dedicated onboarding team that handles integration, data migration, and testing. Most customers report billing automation within 3-4 weeks of signing, with full autonomy achieved after 6-8 weeks of AI learning.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Does Just Paid work with my existing systems?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Just Paid integrates with major invoicing platforms, accounting software, payment processors, and CRM systems. The platform bridges these systems without requiring workflow changes or data migration. If you use a system not covered by pre-built integrations, Just Paid's API enables custom integration.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How does the AI improve billing accuracy over time?</h3>
              <p className="text-gray-300 leading-relaxed">
                Just Paid's AI learns from every invoice generated, payment interaction, and correction made. The machine learning models continuously improve their understanding of your contracts, pricing logic, and customer patterns. Over weeks and months, billing accuracy increases as the AI encounters more variations and learns your specific business rules.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Can Just Paid handle complex, custom pricing models?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Just Paid's contract and billing AI is specifically designed to handle complex pricing models including usage-based billing, tiered pricing, hybrid models, and even custom arrangements negotiated with individual customers. The AI analyzes contract language to extract and apply billing rules regardless of complexity.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Is Just Paid compliant for international revenue operations?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes. Just Paid handles multi-currency transactions, applies tax rules by jurisdiction, and maintains compliance with international data protection regulations including GDPR. The platform supports companies operating in multiple countries without requiring separate systems for different regions.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How secure is customer financial data in Just Paid?</h3>
              <p className="text-gray-300 leading-relaxed">
                Just Paid maintains SOC 2 Type II certification and implements end-to-end encryption for sensitive financial data. All data is stored in secure cloud infrastructure with regular security audits and penetration testing. Access is controlled through role-based permissions, and all activity is logged for compliance and audit purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Just Paid */}
        <section className="mb-20 bg-gray-800 rounded-lg p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-12 text-white">Why Finance Teams Choose Just Paid</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Purpose-Built for Revenue Operations</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Just Paid isn't a generic accounting tool or general workflow automation platform. It's purpose-built specifically for revenue operations, meaning every feature, every integration, and every AI capability is designed for billing, invoicing, and collections. This focus ensures deep capability in the areas that matter most to finance teams.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Purpose-built platforms understand the specific complexities of revenue operations—contract variations, pricing models, tax handling, revenue recognition standards, and DSO optimization—in ways that general platforms simply cannot match.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">AI That Gets Smarter Over Time</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Most billing platforms are static—they do the same thing the same way every time. Just Paid's AI continuously learns from your contracts, pricing, and payment patterns. It gets smarter and more accurate over time, improving billing quality and collection effectiveness with each cycle.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This learning capability is particularly valuable for companies with unique pricing models or complex contract structures where static rules would be inadequate.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Integration Without Disruption</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Implementation of financial systems is notoriously disruptive. Just Paid integrates with existing systems without requiring your team to change their workflows or switch platforms. You keep using familiar tools while gaining unified billing intelligence and autonomous AI capabilities.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This approach minimizes implementation risk, reduces training burden, and enables faster ROI because teams can adopt Just Paid capabilities gradually without wholesale system replacement.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Visibility into Revenue</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Manual processes and disconnected systems create information delays. By the time you generate reports, cash flow data is already outdated. Just Paid provides real-time visibility into revenue status, enabling decisions based on current information rather than historical reports.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Real-time dashboards are particularly valuable for cash-constrained companies and rapidly scaling organizations where outdated information can lead to poor financial decisions.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Backed by Y Combinator</h3>
              <p className="text-gray-300 leading-relaxed">
                Just Paid is backed by Y Combinator (Winter 2023), validating its approach and capability. Y Combinator's involvement signals that the platform has received rigorous vetting, has demonstrated strong product-market fit, and is led by experienced founders who understand both finance and technology.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-white">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Revenue Operations Today</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Finance teams are replacing manual billing processes with intelligent automation. Just Paid accelerates cash collection, improves billing accuracy, and gives you real-time revenue visibility. Start your revenue operations transformation today.
          </p>
          <p className="text-lg text-blue-100 mb-12">
            Connect with dedicated implementation specialists to discuss your billing challenges and revenue operations goals.
          </p>
          
          <a 
            href="https://backlinkoo.com/register" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg"
          >
            Register for Backlink ∞ to Buy Backlinks & Get Traffic
          </a>
          
          <p className="text-blue-100 mt-8 text-sm">
            Just Paid is an AI-powered revenue operations platform. Register to access all backlink building tools and resources for your SEO and marketing efforts.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
