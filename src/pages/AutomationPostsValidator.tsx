import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { BlogQualityMonitor } from '@/utils/blogQualityMonitor';
import { AutomationPostsAdjustmentService, AutomationPostRow } from '@/services/automationPostsAdjustmentService';
import { RefreshCw, Wand2, Scan } from 'lucide-react';

const AutomationPostsValidator: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [needsAdjustment, setNeedsAdjustment] = useState<AutomationPostRow[]>([]);
  const [report, setReport] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const scan = async () => {
    setLoading(true);
    try {
      const res = await AutomationPostsAdjustmentService.scanForIssues();
      setNeedsAdjustment(res.needsAdjustment);
      setReport(res.report);
      toast({ title: 'Scan complete', description: `${res.needsAdjustment.length} posts need adjustment` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Scan failed', description: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  };

  const adjust = async (posts: AutomationPostRow[]) => {
    setAdjusting(true);
    try {
      const res = await AutomationPostsAdjustmentService.batchAutoAdjust(posts, { maxConcurrent: 4, updateDatabase: true });
      toast({ title: 'Adjustment complete', description: `Adjusted ${res.adjustedPosts}/${res.totalPosts}` });
      await scan();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Adjustment failed', description: e?.message || String(e) });
    } finally {
      setAdjusting(false);
    }
  };

  useEffect(() => { scan(); }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" /> Automation Posts Validator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Button onClick={scan} disabled={loading} className="flex items-center gap-2">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />} {loading ? 'Scanning...' : 'Scan'}
            </Button>
            <Button onClick={() => adjust(needsAdjustment)} disabled={adjusting || needsAdjustment.length === 0} variant="secondary" className="flex items-center gap-2">
              {adjusting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} {adjusting ? 'Adjusting...' : `Auto-Adjust All (${needsAdjustment.length})`}
            </Button>
            <Button onClick={() => adjust(needsAdjustment.filter(p => selected.has(p.id)))} disabled={adjusting || selected.size===0} variant="outline">
              Adjust Selected ({selected.size})
            </Button>
          </div>

          <pre className="text-xs bg-muted p-3 rounded mb-4 whitespace-pre-wrap">{report}</pre>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><input type="checkbox" checked={selected.size===needsAdjustment.length && needsAdjustment.length>0} onChange={e => setSelected(e.target.checked ? new Set(needsAdjustment.map(p=>p.id)) : new Set())} /></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {needsAdjustment.map((p) => {
                const m = BlogQualityMonitor.analyzeContent(p.content || '', p.target_url || undefined);
                const badge = m.qualityScore >= 80 ? <Badge className="bg-green-600">Excellent</Badge> : m.qualityScore >= 60 ? <Badge className="bg-blue-600">Good</Badge> : m.qualityScore >= 40 ? <Badge className="bg-yellow-600">Poor</Badge> : <Badge variant="destructive">Critical</Badge>;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={e => { const s = new Set(selected); if (e.target.checked) s.add(p.id); else s.delete(p.id); setSelected(s); }} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{p.title || '(untitled)'}</TableCell>
                    <TableCell className="max-w-xs truncate">{p.slug}</TableCell>
                    <TableCell>{badge}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{[...m.issues, ...m.warnings].slice(0,3).join(' • ')}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={async ()=> adjust([p])}>Fix</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPostsValidator;
