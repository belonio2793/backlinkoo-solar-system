import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link as RouterLink } from 'react-router-dom';
import { BookOpen, LifeBuoy, MessageCircle, Mail, Search, Shield } from 'lucide-react';

const FAQ = [
  {
    q: 'How do I track my keyword rankings?',
    a: 'Go to Rank Tracker, add your domain and keywords, then view daily position charts and SERP deltas. Use the premium tracker for hourly refresh and device/location splits.'
  },
  {
    q: 'How does link building automation work?',
    a: 'Create a campaign, set targets and anchors, then launch. The system generates content, publishes contextually relevant links, and reports live progress and discovered URLs.'
  },
  {
    q: 'How do I connect my domain?',
    a: 'Open Domains, add your root domain, verify ownership, and enable automatic publishing. The system keeps templates clean and indexable with schema and internal links.'
  },
  {
    q: 'Where can I see system status and incidents?',
    a: 'Visit the System Status page for realtime checks, API reachability, and recent incidents.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use role‑based access controls and scoped tokens. See our Privacy Policy and Security notes for details.'
  },
];

const categories = [
  { title: 'Getting Started', icon: BookOpen, items: [
    { label: 'Account & Login', to: '/login' },
    { label: 'Keyword Research', to: '/keyword-research' },
    { label: 'Rank Tracker', to: '/rank-tracker' },
  ]},
  { title: 'Campaigns', icon: LifeBuoy, items: [
    { label: 'Create a Campaign', to: '/learn#campaigns' },
    { label: 'Automation Overview', to: '/automation-link-building' },
    { label: 'Backlink Reports', to: '/backlink-report' },
  ]},
  { title: 'Policies', icon: Shield, items: [
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
  ]},
];

export default function Help() {
  const [query, setQuery] = React.useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="container mx-auto px-6 py-10">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Help Center</h1>
        <p className="text-muted-foreground">Guides, FAQs, and support resources to get the most out of Backlink ∞.</p>
        <div className="mt-6 relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles" className="pl-9" aria-label="Search help" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <Badge variant="secondary">No spam</Badge>
          <Badge variant="secondary">Fast replies</Badge>
          <Badge variant="secondary">Real humans</Badge>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filtered.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.a}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <Card key={cat.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <cat.icon className="h-4 w-4" /> {cat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {cat.items.map((it) => (
                  <li key={it.label}>
                    <RouterLink className="text-primary hover:underline" to={it.to}>{it.label}</RouterLink>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="max-w-3xl mx-auto mt-12">
        <Alert>
          <AlertTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Still need help?</AlertTitle>
          <AlertDescription className="mt-2">
            Reach us anytime: <a className="text-primary hover:underline" href="mailto:support@backlinkoo.com"><Mail className="inline h-4 w-4 mr-1" />support@backlinkoo.com</a> or join our <a className="text-primary hover:underline" href="https://discord.gg/Kb3zTpBvSE" target="_blank" rel="noreferrer">Discord</a>.
            You can also explore in‑product tips in <RouterLink className="text-primary hover:underline" to="/learn">Learn</RouterLink>.
          </AlertDescription>
        </Alert>
      </section>
    </main>
  );
}
