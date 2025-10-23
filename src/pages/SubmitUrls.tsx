import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface SubmissionResult { url: string; ok: boolean; status: number | null; error: string | null }

const SubmitUrls: React.FC = () => {
  const [text, setText] = useState('');
  const [type, setType] = useState<'URL_UPDATED' | 'URL_DELETED'>('URL_UPDATED');
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<SubmissionResult[] | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const { toast } = useToast();

  const urls = useMemo(() => text.split(/\r?\n/).map(s => s.trim()).filter(Boolean), [text]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/.netlify/functions/google-indexing-submit');
        const data = await res.json();
        if (data && typeof data.configured === 'boolean') {
          setConfigured(data.configured);
          setMissing(Array.isArray(data.missing) ? data.missing : []);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function onSubmit() {
    setSubmitting(true);
    setResults(null);
    try {
      const res = await fetch('/.netlify/functions/google-indexing-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const err = data?.error || `Request failed (${res.status})`;
        setResults(null);
        toast({ title: 'Submission failed', description: String(err) });
        if (Array.isArray(data?.missing)) {
          setMissing(data.missing);
          setConfigured(false);
        }
        return;
      }
      setResults(Array.isArray(data.results) ? data.results : []);
      toast({ title: 'Submitted', description: `Submitted ${data.success}/${data.total} URLs (${type})` });
    } catch (e: any) {
      toast({ title: 'Submission error', description: e?.message || String(e) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="container max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Google Indexing: Submit URLs</CardTitle>
            <CardDescription>Paste URLs (one per line). Uses a serverless function that authenticates with a Google service account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {configured === false && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <div className="font-medium">Server configuration required</div>
                <ul className="list-disc pl-5 mt-1">
                  {missing.map((m, i) => (<li key={i}>{m}</li>))}
                </ul>
                <div className="mt-2">Ensure the service account is added as an owner of your site in Search Console.</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="urls">URLs</Label>
              <Textarea id="urls" placeholder="https://example.com/page-1\nhttps://example.com/page-2" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
              <div className="text-xs text-muted-foreground">{urls.length} URL(s)</div>
            </div>

            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL_UPDATED">URL_UPDATED</SelectItem>
                  <SelectItem value="URL_DELETED">URL_DELETED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button onClick={onSubmit} disabled={!urls.length || submitting}>
                {submitting ? 'Submitting…' : 'Submit URLs'}
              </Button>
              <Button variant="secondary" onClick={() => { setText(''); setResults(null); }}>Clear</Button>
            </div>

            {Array.isArray(results) && results.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Results</div>
                <div className="space-y-2">
                  {results.map((r, i) => (
                    <div key={i} className={`rounded-md border p-2 text-sm ${r.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}>
                      <div className="font-mono break-all">{r.url}</div>
                      <div className="text-xs opacity-80">{r.ok ? 'OK' : `Error`} {typeof r.status === 'number' ? `(HTTP ${r.status})` : ''}</div>
                      {!r.ok && r.error && (<div className="text-xs mt-1">{r.error}</div>)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitUrls;
