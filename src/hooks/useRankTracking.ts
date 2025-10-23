import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RankRecord {
  id: string;
  user_id: string;
  url: string;
  keyword: string;
  rank: number | null;
  page: number | null;
  position: number | null;
  status: string;
  analysis: string | null;
  checked_at: string;
  created_at: string;
  updated_at: string;
}

interface RankTrackingSummary {
  total_checks: number;
  unique_keywords: number;
  unique_urls: number;
  last_check: string | null;
  avg_rank: number | null;
}

export function useRankTracking() {
  const { user, isPremium } = useAuth();
  const [history, setHistory] = useState<RankRecord[]>([]);
  const [summary, setSummary] = useState<RankTrackingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's rank tracking history
  const fetchHistory = useCallback(async (limit = 50, offset = 0) => {
    if (!user || !isPremium) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('rank_tracking_history')
        .select('*')
        .eq('user_id', user.id)
        .order('checked_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) {
        throw fetchError;
      }

      setHistory(data || []);
    } catch (err: any) {
      console.error('Error fetching rank tracking history:', err);
      setError(err?.message || 'Failed to fetch ranking history');
    } finally {
      setLoading(false);
    }
  }, [user, isPremium]);

  // Fetch rank tracking summary
  const fetchSummary = useCallback(async () => {
    if (!user || !isPremium) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_rank_tracking_summary')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSummary(data || null);
    } catch (err: any) {
      console.error('Error fetching rank tracking summary:', err);
    }
  }, [user, isPremium]);

  // Get ranking history for a specific keyword
  const getKeywordHistory = useCallback((keyword: string) => {
    return history.filter(
      record => record.keyword.toLowerCase() === keyword.toLowerCase()
    );
  }, [history]);

  // Get ranking history for a specific URL
  const getUrlHistory = useCallback((url: string) => {
    return history.filter(record => record.url === url);
  }, [history]);

  // Delete a rank record
  const deleteRecord = useCallback(async (recordId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('rank_tracking_history')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setHistory(prev => prev.filter(record => record.id !== recordId));
      return true;
    } catch (err: any) {
      console.error('Error deleting rank record:', err);
      setError(err?.message || 'Failed to delete record');
      return false;
    }
  }, [user]);

  // Delete all records for a keyword
  const deleteKeywordRecords = useCallback(async (keyword: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('rank_tracking_history')
        .delete()
        .eq('user_id', user.id)
        .eq('keyword', keyword);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setHistory(prev =>
        prev.filter(record => record.keyword !== keyword)
      );
      return true;
    } catch (err: any) {
      console.error('Error deleting keyword records:', err);
      setError(err?.message || 'Failed to delete records');
      return false;
    }
  }, [user]);

  // Export history as CSV
  const exportAsCSV = useCallback(() => {
    if (history.length === 0) {
      setError('No ranking history to export');
      return null;
    }

    const headers = [
      'URL',
      'Keyword',
      'Rank',
      'Page',
      'Position',
      'Status',
      'Checked At'
    ];

    const rows = history.map(record => [
      record.url,
      record.keyword,
      record.rank || 'N/A',
      record.page || 'N/A',
      record.position || 'N/A',
      record.status,
      new Date(record.checked_at).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rank-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return csv;
  }, [history]);

  // Load data on mount
  useEffect(() => {
    if (user && isPremium) {
      fetchHistory();
      fetchSummary();
    }
  }, [user, isPremium, fetchHistory, fetchSummary]);

  return {
    history,
    summary,
    loading,
    error,
    fetchHistory,
    fetchSummary,
    getKeywordHistory,
    getUrlHistory,
    deleteRecord,
    deleteKeywordRecords,
    exportAsCSV,
    hasData: history.length > 0
  };
}
