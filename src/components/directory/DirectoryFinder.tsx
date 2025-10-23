import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight, Copy, Search } from 'lucide-react';
import { findDirectoryCandidates, parseManualUrls, type BusinessProfileLite } from '@/utils/directoryFinder';
import { useToast } from '@/hooks/use-toast';

export interface DirectoryFinderProps {
  profile: BusinessProfileLite;
}

const inputClassName = 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500';

export default function DirectoryFinder({ profile }: DirectoryFinderProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState('seo directory listing');
  const [minDA, setMinDA] = useState(40);
  const [requireBacklinks, setRequireBacklinks] = useState(true);
  const [preferNoAuth, setPreferNoAuth] = useState(false);
  const [preferInstantPublish, setPreferInstantPublish] = useState(false);
  const [manualUrls, setManualUrls] = useState('');

  const candidates = useMemo(() => {
    return findDirectoryCandidates(profile, { query, minDA, requireBacklinks, preferInstantPublish, preferNoAuth, limit: 60 });
  }, [profile, query, minDA, requireBacklinks, preferInstantPublish, preferNoAuth]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied`, description: 'Use this in your workflow.' });
    } catch (e) {
      toast({ title: 'Clipboard unavailable', description: 'Select and copy manually.', variant: 'destructive' });
    }
  };

  const mergedManual = useMemo(() => parseManualUrls(manualUrls), [manualUrls]);

  return (
    <Card className="border border-slate-200 bg-white">
      <CardHeader>
        <CardTitle>Find more platforms</CardTitle>
        <CardDescription className="text-slate-600">
          Search and merge high‑quality directories, Web 2.0, profiles, and communities. Dedupe and rank by relevance, DA, and automation readiness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dir-query" className="text-slate-600">Search query</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input id="dir-query" className={`${inputClassName} pl-8`} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600">Min DA: {minDA}</Label>
            <input type="range" min={0} max={100} step={5} value={minDA} onChange={(e) => setMinDA(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
            <div>
              <div className="text-slate-600 text-sm">Require backlinks allowed</div>
              <div className="text-slate-500 text-xs">Filters out platforms that block links</div>
            </div>
            <Switch checked={requireBacklinks} onCheckedChange={setRequireBacklinks} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
            <div>
              <div className="text-slate-600 text-sm">Prefer no‑auth</div>
              <div className="text-slate-500 text-xs">Boosts instant/no‑auth targets</div>
            </div>
            <Switch checked={preferNoAuth} onCheckedChange={setPreferNoAuth} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
            <div>
              <div className="text-slate-600 text-sm">Prefer instant publish</div>
              <div className="text-slate-500 text-xs">Prioritize quick wins</div>
            </div>
            <Switch checked={preferInstantPublish} onCheckedChange={setPreferInstantPublish} />
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="space-y-2">
          <Label htmlFor="manual-urls" className="text-slate-600">Manual override: add URLs (one per line)</Label>
          <Textarea id="manual-urls" className={inputClassName} rows={3} placeholder="example.com\nexample.org" value={manualUrls} onChange={(e) => setManualUrls(e.target.value)} />
          {mergedManual.length > 0 && (
            <div className="text-xs text-slate-500">{mergedManual.length} custom domains will be merged into results.</div>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div>Scoring signals: Domain Authority, backlinks allowed, auth requirement, difficulty, query/category/keyword matches, and directory signals.</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-slate-600 text-sm">Top matches: <span className="text-slate-900 font-medium">{candidates.length + mergedManual.length}</span></div>
            <div className="text-slate-500 text-xs">Sorted by relevance</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[...candidates, ...mergedManual.map((d, i) => ({
              domain: d,
              name: d,
              url: `https://${d}`,
              category: 'manual',
              type: 'custom',
              da: undefined,
              backlinksAllowed: true,
              auth: 'optional' as const,
              difficulty: 'easy' as const,
              source: 'manual',
              score: 50 - i,
            }))].map((c) => (
              <Card key={`${c.source}:${c.domain}`} className="border border-slate-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-900 font-medium">{c.name}</span>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">{c.category}</Badge>
                        {typeof c.da === 'number' && (
                          <Badge className="bg-indigo-500/20 text-indigo-700">DA {c.da}</Badge>
                        )}
                        {c.backlinksAllowed === false ? (
                          <Badge className="bg-rose-500/20 text-rose-200">No links</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-700">Links OK</Badge>
                        )}
                        {c.auth && (<Badge className="bg-sky-500/20 text-sky-700">{c.auth}</Badge>)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{c.domain}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="secondary" className="gap-2 bg-slate-100 text-slate-900 hover:bg-slate-200">
                        <a href={c.url} target="_blank" rel="noopener noreferrer"><ArrowUpRight className="h-4 w-4" />Open</a>
                      </Button>
                      <Button onClick={() => handleCopy(JSON.stringify({ name: profile.name, website: profile.website, target: c.url }, null, 2), 'Payload')} variant="secondary" className="gap-2 bg-slate-100 text-slate-900 hover:bg-slate-200">
                        <Copy className="h-4 w-4" /> Copy payload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
