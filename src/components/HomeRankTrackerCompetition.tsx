import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Loader2 } from 'lucide-react';

export default function HomeRankTrackerCompetition({ fnBase = '' }: { fnBase?: string }) {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const run = async () => {
    setError(null);
    const kw = keyword.trim();
    if (!kw) { setError('Enter a keyword'); return; }
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(fnBase ? `${fnBase}/homeranktrackerCompetition` : '/.netlify/functions/homeranktrackerCompetition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success !== true) {
        setError(json?.error || 'Failed to analyze competition');
      } else {
        setResults(Array.isArray(json.results) ? json.results : []);
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const data = results.map((r) => ({
    domain: r.domain || (r.url || '').replace(/https?:\/\//, '').replace(/\/$/, ''),
    backlinks: typeof r.estimated_backlinks === 'number' ? r.estimated_backlinks : 0,
    competition: typeof r.competition === 'number' ? r.competition : 0,
    position: r.position || 0,
    title: r.title || '',
    url: r.url || '',
  }));

  return (
    <Card className="rainbow-hover-target">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-2xl">Competition Checker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="enter keyword" onKeyDown={(e) => { if (e.key === 'Enter') run(); }} />
          <Button onClick={run} disabled={loading}>{loading ? (<><Loader2 className="h-4 w-4 animate-spin"/> Analyzing...</>) : 'Analyze'}</Button>
        </div>

        <div>
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
          {data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No results yet.</div>
          ) : (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Showing top {data.length} results</div>
              <ChartContainer
                config={{
                  backlinks: { label: 'Backlinks', color: 'hsl(var(--primary))' },
                  competition: { label: 'Competition', color: 'hsl(var(--secondary))' },
                }}
                className="w-full"
              >
                <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="domain" tickLine={false} axisLine={false} interval={0} angle={-20} height={60} textAnchor="end" />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} width={80} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={60} domain={[0, 100]} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="backlinks" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="competition" stroke="hsl(var(--secondary))" dot={false} strokeWidth={2} />
                  <Legend />
                </ComposedChart>
              </ChartContainer>

              <div className="grid gap-2 mt-4">
                {data.map((d) => (
                  <div key={d.url} className="flex items-center justify-between text-sm border rounded-md px-3 py-2 bg-card">
                    <div className="min-w-0">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-medium truncate underline" title={d.title}>{d.domain}</a>
                      <div className="text-xs text-muted-foreground truncate">{d.title}</div>
                    </div>
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <span title="Estimated Backlinks">{d.backlinks != null ? d.backlinks.toLocaleString() : '—'}</span>
                      <span title="Competition">{d.competition != null ? `${d.competition}/100` : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
