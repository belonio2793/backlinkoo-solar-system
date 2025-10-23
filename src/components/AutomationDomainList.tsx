import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface DomainRecord {
  id: string;
  domain: string;
  dns_verified: boolean;
  netlify_verified: boolean;
  status?: string;
}

export default function AutomationDomainList({ userId }: { userId?: string | null }) {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!userId) {
        setDomains([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        const from = (page - 1) * pageSize;
        const to = page * pageSize - 1;
        const { data, error, count } = await supabase
          .from('domains')
          .select('id, domain, dns_verified, netlify_verified, status', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(from, to);
        if (error) throw error;
        if (!mounted) return;
        setDomains((data || []) as DomainRecord[]);
        setTotal(typeof count === 'number' ? count : (data || []).length);
      } catch (e) {
        console.error('Failed to load domains:', e);
        setDomains([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [userId, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Ensure backlinkoo.com is always shown as a static placeholder at the top
  const displayList = domains;

  return (
    <div>
      <div className="p-3 bg-white border rounded">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs font-medium text-gray-700">Available Domains ({total})</div>
            <div className="text-xs text-gray-500">Your validated domains for publishing</div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(1)} disabled={page === 1 || loading}>First</Button>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>Prev</Button>
            <div className="text-xs text-gray-600">Page {page} / {totalPages}</div>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>Next</Button>
            <Button size="sm" variant="outline" onClick={() => setPage(totalPages)} disabled={page === totalPages || loading}>Last</Button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
          {loading ? (
            <div className="text-xs text-gray-500">Loading domains...</div>
          ) : displayList.length === 0 ? (
            <div className="text-xs text-gray-500">No validated domains yet. Go to Domains to connect one.</div>
          ) : (
            displayList.map(d => (
              <div key={d.id} className={`flex items-center justify-between p-2 rounded bg-gray-50`}>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{d.domain}</div>
                </div>
                <div className="text-xs text-gray-500">{d.status || ''}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
