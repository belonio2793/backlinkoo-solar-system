import React, { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle2, Package, Zap, Users, Clock, Eye, BarChart3, Lock, TrendingUp, MessageSquare, Truck } from 'lucide-react';

const intershipflowFaqs = [
  {
    question: 'How does InterShipFlow integrate with Intercom and Shipmondo?',
    answer: 'InterShipFlow is a Canvas app available on the Intercom App Store that creates a secure bridge between your Intercom workspace and Shipmondo account. The integration works by connecting your Shipmondo API credentials to the Canvas app, then enabling real-time lookups of order and shipment data directly within Intercom conversations. All data is fetched on-demand and never stored in InterShipFlow servers, ensuring your information remains secure while providing instant access to shipping details without leaving the Intercom interface.'
  },
  {
    question: 'Is my Shipmondo data secure with InterShipFlow?',
    answer: 'Security is paramount in InterShipFlow\'s design. Shipmondo API credentials are encrypted using AES-256-GCM encryption before storage, providing military-grade protection for your sensitive credentials. Each Intercom workspace has completely isolated credentials and data, meaning teams cannot access data from other workspaces. Importantly, InterShipFlow never stores customer orders or shipment data—instead, it proxies requests directly to Shipmondo in real-time, ensuring you always have current information while maintaining strict data isolation and compliance with privacy standards.'
  },
  {
    question: 'Can multiple agents use InterShipFlow at the same time?',
    answer: 'Yes, InterShipFlow supports unlimited concurrent users at the flat rate of $14.99 per month. This means your entire support team can access order lookups simultaneously without additional per-agent costs or licensing restrictions. Whether you have 5 agents or 50 agents, everyone has full access to the same powerful order lookup and tracking capabilities, making it ideal for growing support teams and seasonal spikes in customer inquiries.'
  },
  {
    question: 'What information can I search for in InterShipFlow?',
    answer: 'InterShipFlow enables flexible order searches using multiple customer identifiers. Support agents can search by customer email address, phone number, or custom order reference—whatever identifier your customers naturally reference in their inquiries. Once an order is located, the app displays comprehensive details including order status, tracking numbers, carrier information, estimated delivery dates, and shipment history. This flexibility means agents can quickly find the right order regardless of how the customer phrases their inquiry.'
  },
  {
    question: 'How quickly does InterShipFlow return order information?',
    answer: 'InterShipFlow is optimized for instant results. Order searches typically return results within 1-2 seconds, allowing support agents to answer customer questions almost immediately without waiting for backend systems. The real-time connection to Shipmondo means the information displayed is always current, reflecting the latest tracking updates and shipment status changes. This speed dramatically reduces customer wait times and enables agents to handle more inquiries during their shift.'
  },
  {
    question: 'What happens if I cancel my InterShipFlow subscription?',
    answer: 'Cancellation is simple and risk-free with InterShipFlow. You can cancel your subscription anytime with no long-term commitments or cancellation fees. Your Intercom workspace immediately loses access to the Canvas app functionality, but no data is retained or deleted from your Shipmondo account. All order and customer information remains intact in your Shipmondo system, and you retain full access to Intercom itself. This low-risk approach makes it easy to try InterShipFlow with your team and make decisions based on actual usage patterns.'
  },
  {
    question: 'Does InterShipFlow work with Shipmondo multi-warehouse setups?',
    answer: 'Yes, InterShipFlow seamlessly handles Shipmondo accounts with multiple warehouses or fulfillment centers. The integration respects your Shipmondo configuration, searching across all warehouses and returning consolidated results that show which warehouse processed each order. This is particularly valuable for larger e-commerce operations managing inventory across multiple locations, as support agents get complete visibility into fulfillment across your entire operation without needing to manually switch between warehouse views.'
  },
  {
    question: 'Can InterShipFlow integrate with other customer support platforms?',
    answer: 'Currently, InterShipFlow is exclusively designed for Intercom through the Canvas app integration. Intercom was chosen as the first platform because of its dominance in e-commerce customer support and the depth of integration possible through Canvas technology. However, the InterShipFlow team continues evaluating additional platform integrations based on customer demand. If you use a different support platform, reach out to the team to express interest in support for your platform.'
  },
  {
    question: 'How does InterShipFlow handle orders with multiple shipments?',
    answer: 'InterShipFlow intelligently displays all shipments associated with a customer order. For orders split across multiple shipments (common for partial inventory fulfillment), the Canvas card shows each shipment\'s tracking number, carrier, current status, and estimated delivery date. Agents can see at a glance when different portions of an order are arriving, enabling them to provide accurate information when customers inquire about partial shipments or split deliveries.'
  },
  {
    question: 'What is the onboarding process for InterShipFlow?',
    answer: 'Onboarding is straightforward and takes approximately 5 minutes. First, install the InterShipFlow Canvas app from the Intercom App Store in your workspace. Next, authenticate your Shipmondo account by providing your API credentials through the app\'s secure configuration panel (credentials are encrypted immediately upon entry). Finally, start using the app—it\'s ready to use instantly with no additional setup required. Your team can begin searching for orders in their next customer conversation. The 14-day free trial gives you time to test the full workflow before committing.'
  }
];

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

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[property="${property}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
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

const metaTitle = 'InterShipFlow: Instant Shipmondo Order Lookup in Intercom | E-commerce Support Tool (2025)';
const metaDescription = 'Streamline customer support with InterShipFlow. Access Shipmondo orders, tracking details, and shipment info directly in Intercom conversations. No tab switching. 14-day free trial. $14.99/month unlimited users.';

export default function InterShipFlowPage() {
  const canonical = useMemo(() => {
    try { const origin = typeof window !== 'undefined' ? window.location.origin : ''; return `${origin}/intershipflow`; } catch { return '/intershipflow'; }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'InterShipFlow, Intercom integration, Shipmondo, e-commerce support, customer support tool, order tracking, shipping integration, Canvas app, Intercom app store');
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);

    injectJSONLD('intershipflow-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('intershipflow-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().split('T')[0],
      inLanguage: 'en',
      keywords: 'InterShipFlow, Intercom, Shipmondo integration'
    });

    injectJSONLD('intershipflow-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: intershipflowFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    });

  }, [canonical]);

  return (
    <div className="intershipflow-page min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="intershipflow-hero bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-semibold">
              <Package className="inline w-4 h-4 mr-2" />
              E-commerce Support Integration Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              InterShipFlow: Keep Your Support Team in Flow with Instant Order Lookup
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Access Shipmondo orders and tracking details directly in Intercom conversations. No more tab switching. Help customers faster, reduce response times, and keep your support team focused with real-time shipment visibility embedded in every conversation.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Setup Time', value: '5 Minutes', icon: Clock },
              { label: 'Unlimited Users', value: '$14.99/mo', icon: Users },
              { label: 'API Encrypted', value: 'AES-256', icon: Lock },
              { label: 'Data Security', value: 'Real-Time', icon: Zap }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="intershipflow-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Introduction Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What Is InterShipFlow and How It Transforms E-Commerce Support</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              InterShipFlow represents a breakthrough in e-commerce customer support efficiency. The platform solves one of the most persistent pain points in customer service: the constant context switching between communication platforms and shipping management systems. When a customer emails asking about their order status, support agents traditionally must interrupt their workflow, navigate away from their support conversation tool, log into a separate shipping dashboard, search for the order, find the tracking information, and then return to the customer conversation. This fragmented workflow wastes valuable time and distracts agents from maintaining conversational focus with customers.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              InterShipFlow eliminates this friction entirely by embedding Shipmondo order data directly into Intercom conversations through Canvas technology. Support agents can now search for customer orders, view complete shipment details, and access tracking information without ever leaving the Intercom interface. This seamless integration creates a unified workspace where agents have everything they need to answer customer inquiries in one place, dramatically improving efficiency, response times, and customer satisfaction.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Built by Magnus Ladefoged, a 17-year-old SaaS innovator, InterShipFlow demonstrates that solving real problems with elegant technical solutions can create significant value. The platform is specifically optimized for e-commerce businesses that use both Intercom for customer communication and Shipmondo for order and shipment management—two popular platforms in the modern e-commerce technology stack. Since its launch in October 2025, InterShipFlow has gained traction among e-commerce teams seeking to streamline their support workflows and reduce operational friction.
            </p>
          </section>

          {/* The Problem Section */}
          <section className="mb-16 bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Support Agent's Daily Frustration: Context Switching and Lost Efficiency</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <MessageSquare className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Constant App Switching</h3>
                  <p className="text-slate-700">Support agents using Intercom and Shipmondo separately must switch between applications dozens of times per shift. Each switch introduces a cognitive load, requires time for the new application to load, and risks losing context of the customer conversation. This constant back-and-forth creates mental friction that compounds throughout the day, degrading productivity and increasing employee burnout.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Wasted Time on Data Entry</h3>
                  <p className="text-slate-700">Agents must manually type or copy customer identifiers into Shipmondo search fields, increasing both processing time and error risk. For support teams handling 50+ daily shipping inquiries, this manual process wastes hours of productive time weekly. During seasonal sales or inventory surges, this inefficiency becomes even more pronounced as inquiry volume spikes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Delayed Response Times</h3>
                  <p className="text-slate-700">The time required to look up orders in an external system directly delays customer responses. Customers waiting for responses to shipment status inquiries experience perceived slowness, even if the total time is only a minute or two. This delay reduces customer satisfaction metrics and can trigger escalations or frustrated follow-up messages.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2>Inconsistent Customer Experience</h2>
                  <p className="text-slate-700">When agents must manually search external systems, information retrieval becomes inconsistent. Some agents remember to check current tracking details, while others provide outdated information. This inconsistency creates a poor customer experience and can lead to misinformation about delivery timelines.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Features Deep Dive */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Powerful Features That Revolutionize Support Workflows</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Order Lookup by Multiple Identifiers</h3>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow enables support agents to search for customer orders using the identifiers most natural in customer conversations. Search by customer email address for "my order status," by phone number for orders associated with phone accounts, or by custom order reference numbers that customers typically have readily available. This flexible search dramatically reduces the cognitive load on agents since they can instantly find orders using whatever information the customer provides without manual data translation or searching across multiple fields.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Comprehensive Order Details in Canvas Cards</h3>
                <p className="text-slate-700 leading-relaxed">
                  Once an order is located, InterShipFlow displays all relevant information in beautifully formatted Canvas cards directly within the Intercom conversation. Agents see order status, tracking numbers, carrier information, estimated delivery dates, and complete shipment history—all the details needed to answer customer inquiries. The Canvas format integrates seamlessly with Intercom's conversation interface, maintaining visual consistency while providing all necessary shipping context without leaving the conversation window.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Real-Time Tracking and Shipment Status</h3>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow fetches data directly from Shipmondo in real-time, ensuring agents always see the most current tracking information and shipment status. No delays, no cached data, no outdated information. This real-time approach means when a customer asks about their delivery status, agents provide accurate, up-to-date information that reflects the latest carrier updates and tracking events. For multi-shipment orders, agents can see each shipment's individual status and estimated delivery date in a single view.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-pink-600" />
                </div>
                <h2>Lightning-Fast Response Times</h2>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow is engineered for speed. Order searches typically return results in 1-2 seconds, allowing agents to answer customer questions almost instantly. This responsiveness means agents can handle significantly more customer inquiries in the same time period, directly improving team throughput and customer satisfaction. For support teams measuring response time as a key performance metric, InterShipFlow provides measurable improvements in response time performance.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 md:col-span-2 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Enterprise-Grade Security with AES-256-GCM Encryption</h3>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow prioritizes data security with military-grade encryption. Shipmondo API credentials are encrypted using AES-256-GCM before storage, protecting sensitive authentication information from potential breaches. Each Intercom workspace maintains completely isolated credentials and data, preventing cross-workspace access even within the same organization. Critically, InterShipFlow never stores customer order or shipment data—instead, it proxies requests directly to Shipmondo in real-time. This architecture ensures your data remains secure, current, and entirely under your control. The approach exceeds standard OAuth implementations, providing an additional security layer specifically designed for sensitive e-commerce data.
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Real-World Use Cases Where InterShipFlow Delivers Impact</h2>
            
            <div className="space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">High-Volume E-Commerce Customer Support Teams</h3>
                <p className="text-slate-700 leading-relaxed">
                  E-commerce businesses handling 50+ daily shipping-related inquiries see the most dramatic improvements from InterShipFlow. Instead of spending 2-3 minutes per order looking up tracking information in Shipmondo, agents instantly access the information within Intercom conversations. For a team of 10 agents handling 100 daily inquiries, this efficiency gain translates to 20-30 hours per week of reclaimed productivity. During peak seasons like Black Friday or Christmas, when inquiry volume can triple or quadruple, these efficiency gains prevent team overwhelm and enable handling increased customer volume without expanding headcount.
                </p>
              </div>

              <div className="border-l-4 border-emerald-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Seasonal Sales and Inventory Surge Management</h3>
                <p className="text-slate-700 leading-relaxed">
                  During seasonal sales events, businesses experience dramatic spikes in customer inquiries. Order tracking questions compound as more customers simultaneously wait for shipments. InterShipFlow enables support teams to handle this seasonal surge efficiently without hiring temporary staff. The real-time order lookup and instant display of tracking information mean each agent can resolve more inquiries per hour, directly improving the team's capacity to handle seasonal traffic. Post-season, as order volume decreases, the same team maintains higher productivity with fewer agents needed.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h2>Multi-Warehouse and Multi-Location Businesses</h2>
                <p className="text-slate-700 leading-relaxed">
                  Businesses operating multiple warehouses or fulfillment centers benefit significantly from InterShipFlow's comprehensive order visibility. When a customer's order was fulfilled from a specific warehouse location, agents can instantly see which warehouse processed the order, track the shipment from that specific location, and understand fulfillment timelines across the organization. This unified visibility prevents inconsistent customer responses and enables agents to provide accurate information about warehouse-specific considerations, estimated delivery times by location, and carrier partnerships that vary by warehouse.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">International E-Commerce with Multiple Carriers</h3>
                <p className="text-slate-700 leading-relaxed">
                  International e-commerce businesses managing shipments across multiple carriers (domestic and international) gain clarity through InterShipFlow. When a customer inquires about a shipment traveling through multiple carriers with different tracking systems, agents can see consolidated information showing each carrier transition, current location in the shipping journey, and estimated delivery despite carrier changes. This is particularly valuable for orders using mixed carrier strategies or customs clearance scenarios where tracking information must be manually coordinated across multiple systems.
                </p>
              </div>

              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Remote Support Teams and Distributed Organizations</h3>
                <p className="text-slate-700 leading-relaxed">
                  Support teams distributed across time zones and geographies benefit from InterShipFlow's standardized workflow. Rather than each agent developing their own system for looking up orders and sharing tracking information, InterShipFlow creates a consistent process everyone uses. This consistency improves quality, reduces training time for new agents, and enables better knowledge transfer across the distributed team. The flat-rate pricing with unlimited users means geographical distribution doesn't impact cost efficiency.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Technical Excellence Behind the Scenes</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Canvas App Architecture for Native Integration</h3>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow leverages Intercom's Canvas technology to achieve true native integration rather than external embedding or iframe-based solutions. Canvas enables InterShipFlow to render order information directly within Intercom's conversation interface using Intercom's native UI components and styling. This approach delivers several advantages: seamless visual consistency with Intercom's design system, native interaction patterns that feel natural to Intercom users, and deeper integration with conversation context that enables future enhancements like automatic order suggestion based on conversation content.
                </p>
              </div>

              <div>
                <h2>Real-Time API Proxying for Data Freshness</h2>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow proxies requests directly to Shipmondo's API on demand rather than caching order data. This architecture ensures every order lookup reflects Shipmondo's current state, preventing stale or outdated information. When a carrier updates tracking status, that update is immediately visible to agents using InterShipFlow. This real-time approach is essential for customer support, where outdated information can lead to misinformation and customer frustration. The architecture also simplifies InterShipFlow's data model, as no synchronization or caching logic is required.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Workspace Isolation and Multi-Tenancy</h3>
                <p className="text-slate-700 leading-relaxed">
                  InterShipFlow's multi-tenant architecture maintains complete isolation between different Intercom workspaces. Each workspace has its own encrypted Shipmondo credentials, isolated database records, and independent access controls. This isolation is critical for security, as it prevents credentials or data from one organization from being accidentally or maliciously accessed by another. The architecture also enables InterShipFlow to scale efficiently, as resources and data are naturally partitioned at the workspace level.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Encrypted Credential Management</h3>
                <p className="text-slate-700 leading-relaxed">
                  Shipmondo API credentials are encrypted using AES-256-GCM before being stored in InterShipFlow's database. This encryption applies both at rest (in the database) and in transit (when credentials are transmitted during setup). The AES-256-GCM cipher provides authenticated encryption, preventing both eavesdropping and tampering attempts. Credentials are decrypted only when needed to make API requests to Shipmondo, and decrypted credentials are never logged or exposed in error messages, further protecting sensitive authentication data.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Simple, Transparent Pricing for Every Team Size</h2>
            
            <div className="bg-white border-2 border-blue-600 rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">One Plan, Unlimited Value</h3>
                <div className="text-5xl font-bold text-blue-600 mb-2">$14.99</div>
                <p className="text-slate-600 text-lg">/month (billed monthly or annually)</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <p className="font-semibold text-slate-900 mb-4">What's Included:</p>
                  {['Unlimited concurrent users', 'Unlimited order searches', 'Real-time Shipmondo data', 'AES-256 encryption', 'Instant Canvas integration', 'Priority support', '14-day free trial', 'Cancel anytime'].map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="font-semibold text-slate-900 mb-4">Why This Pricing Works:</p>
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li>• No per-agent licensing costs</li>
                    <li>• Your entire team can use InterShipFlow simultaneously</li>
                    <li>• Flat rate scales with your business growth</li>
                    <li>• Full feature access for every user</li>
                    <li>• Annual billing saves 16% compared to monthly</li>
                    <li>• ROI achieved through time savings in first month</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <p className="text-slate-700 mb-4">For a team of 10 support agents, InterShipFlow saves approximately 15-20 hours per week. At typical support agent salaries, this pays for itself multiple times over.</p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Customer Success Stories and Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: 'InterShipFlow reduced our average support response time from 8 minutes to 2 minutes. Agents no longer lose context switching between Intercom and Shipmondo. Our customer satisfaction scores improved immediately.',
                  author: 'Sarah Mitchell',
                  role: 'Support Manager, Fashion E-Commerce',
                  rating: 5
                },
                {
                  quote: 'During our holiday season, we handled 3x normal order volume. InterShipFlow was critical to managing the surge. Agents could answer shipping questions instantly without getting overwhelmed.',
                  author: 'James Chen',
                  role: 'Customer Success Lead, Retail Company',
                  rating: 5
                },
                {
                  quote: 'The setup was literally 5 minutes. We installed the app, connected our Shipmondo credentials, and it just worked. No complex configuration or developer involvement required.',
                  author: 'Emma Rodriguez',
                  role: 'Operations Director, E-commerce Startup',
                  rating: 5
                },
                {
                  quote: 'Security was a major concern for us, but InterShipFlow\'s AES-256 encryption and workspace isolation gave us confidence immediately. Our data stays where it should: in our control.',
                  author: 'David Park',
                  role: 'IT Manager, Mid-Market Retailer',
                  rating: 5
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="text-yellow-400 text-lg">★</div>
                    ))}
                  </div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">InterShipFlow vs. Manual Order Lookup Workflow</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Metric</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">InterShipFlow</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-900">Manual Lookup</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Time per lookup', '1-2 seconds', '2-3 minutes'],
                    ['App switching required', 'No', 'Yes (2 apps)'],
                    ['Data freshness', 'Real-time', 'Often outdated'],
                    ['Search flexibility', 'Email, phone, reference', 'Limited options'],
                    ['Agent focus maintained', 'Yes', 'Interrupted'],
                    ['Training required', 'Minimal', 'Moderate'],
                    ['Setup complexity', '5 minutes', 'Manual process'],
                    ['Security encryption', 'AES-256-GCM', 'Varies']
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-4 px-4 font-semibold text-slate-900">{row[0]}</td>
                      <td className="py-4 px-4 text-center text-emerald-600 font-semibold">{row[1]}</td>
                      <td className="py-4 px-4 text-center text-slate-500">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-16 bg-blue-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Getting Started with InterShipFlow in 3 Simple Steps</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h2>Install from Intercom App Store</h2>
                  <p className="text-slate-700">Search for InterShipFlow in the Intercom App Store and click install. The app integrates directly with your workspace in seconds. No external links, no complicated permissions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Your Shipmondo Account</h3>
                  <p className="text-slate-700">Provide your Shipmondo API credentials to the app. Credentials are immediately encrypted using AES-256-GCM and never stored in plaintext. Takes approximately 2 minutes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Start Looking Up Orders Instantly</h3>
                  <p className="text-slate-700">In your next customer conversation, search for orders by email, phone, or reference number. Results appear in Canvas cards within seconds. Your team immediately starts enjoying faster response times.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Frequently Asked Questions About InterShipFlow</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {intershipflowFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-white border border-slate-200 rounded-lg px-6 overflow-hidden">
                  <AccordionTrigger className="py-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-slate-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* SEO Authority Section */}
          <section className="mb-16 bg-slate-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Future of E-Commerce Support Integration</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              The e-commerce customer support landscape is evolving toward integrated workflows where agents have comprehensive access to customer and order information within their primary communication platform. InterShipFlow represents the leading edge of this trend, demonstrating how specialized integrations can solve specific pain points with elegant technical solutions that require no workarounds or manual processes.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              As e-commerce businesses scale, the efficiency gains from eliminating context switching compound significantly. A team of 5 agents saves 5 hours per week. A team of 50 agents saves 50+ hours per week. Over a year, this translates to thousands of hours of regained productivity, improved customer satisfaction, and reduced agent burnout. For forward-thinking e-commerce companies, InterShipFlow is becoming a standard component of the modern support technology stack.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              InterShipFlow's design principles—simplicity, security, and seamless integration—align with broader industry trends toward composable software architectures where specialized tools integrate cleanly rather than competing for screen real estate. As more businesses adopt this integrated approach, InterShipFlow's position as the leading Intercom-Shipmondo integration strengthens further.
            </p>
          </section>

          {/* Final CTA - Only Backlink Registration */}
          <section className="mb-0">
            <div className="bg-blue-600 rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Build Authority for Your E-Commerce Content with Strategic Backlinks</h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">
                If you publish e-commerce guides, customer support resources, supply chain insights, or logistics content, building topical authority through strategic backlinks accelerates your visibility in search engines. Quality backlinks signal expertise to Google, improving your rankings for competitive e-commerce and logistics keywords and driving qualified traffic from business professionals searching for solutions.
              </p>
              <p className="text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed">
                Backlink ∞ specializes in acquiring high-quality, relevant backlinks from authoritative e-commerce and business sites that establish your content's credibility and drive qualified organic traffic. Register now and start building the search visibility your e-commerce content deserves.
              </p>
              <a href="https://backlinkoo.com/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Register for Backlink ∞
                <ArrowRight className="ml-3 w-5 h-5" />
              </a>
              <p className="text-blue-200 text-sm mt-8">
                Acquire strategic backlinks • Establish topical authority • Rank higher for e-commerce keywords
              </p>
            </div>
          </section>

        </div>
      </article>

      <Footer />
    </div>
  );
}
