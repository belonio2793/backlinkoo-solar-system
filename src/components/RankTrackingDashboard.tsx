import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRankTracking } from '@/hooks/useRankTracking';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Download,
  Calendar,
  Target,
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function RankTrackingDashboard() {
  const { isPremium } = useAuth();
  const { toast } = useToast();
  const {
    history,
    summary,
    loading,
    error,
    fetchHistory,
    deleteRecord,
    deleteKeywordRecords,
    exportAsCSV,
    hasData
  } = useRankTracking();

  const [sortBy, setSortBy] = useState<'keyword' | 'rank' | 'date'>('date');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  if (!isPremium) {
    return (
      <Card className="border-dashed border-amber-200 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
              Premium Feature
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Upgrade to Premium to view and manage your ranking history.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredHistory = filterKeyword
    ? history.filter(record =>
        record.keyword.toLowerCase().includes(filterKeyword.toLowerCase())
      )
    : history;

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'keyword') {
      return a.keyword.localeCompare(b.keyword);
    }
    if (sortBy === 'rank') {
      const rankA = a.rank ?? Infinity;
      const rankB = b.rank ?? Infinity;
      return rankA - rankB;
    }
    // Default: sort by date (newest first)
    return new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime();
  });

  const groupedByKeyword = sortedHistory.reduce((acc, record) => {
    if (!acc[record.keyword]) {
      acc[record.keyword] = [];
    }
    acc[record.keyword].push(record);
    return acc;
  }, {} as Record<string, typeof history>);

  const getRankTrend = (keyword: string): 'up' | 'down' | 'same' | 'unknown' => {
    const records = groupedByKeyword[keyword];
    if (!records || records.length < 2) return 'unknown';

    const latest = records[0];
    const previous = records[1];

    if (!latest.rank || !previous.rank) return 'unknown';

    if (latest.rank < previous.rank) return 'up';
    if (latest.rank > previous.rank) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same' | 'unknown') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-64">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-600">Loading ranking history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {summary && hasData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Checks
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {summary.total_checks}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Unique Keywords
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {summary.unique_keywords}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Unique URLs
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {summary.unique_urls}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Average Rank
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {summary.avg_rank ? Math.round(summary.avg_rank) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ranking History
            </div>
            {hasData && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportAsCSV();
                  toast({
                    title: 'Export Successful',
                    description: 'Your ranking data has been downloaded as CSV.'
                  });
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="rank">Sort by Rank</option>
              <option value="keyword">Sort by Keyword</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Ranking History */}
      {!hasData ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <Target className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                No ranking data yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start checking rankings to build your tracking history.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByKeyword).map(([keyword, records]) => {
            const trend = getRankTrend(keyword);
            const latestRecord = records[0];
            const isExpanded = expandedKeyword === keyword;

            return (
              <Card key={keyword} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedKeyword(isExpanded ? null : keyword)
                  }
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {keyword}
                        </h4>
                        {trend !== 'unknown' && getTrendIcon(trend)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {latestRecord.url}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        {latestRecord.rank !== null ? (
                          <>
                            <span className="text-2xl font-bold text-blue-600">
                              #{latestRecord.rank}
                            </span>
                            <Badge
                              variant={
                                latestRecord.status === 'found'
                                  ? 'default'
                                  : 'outline'
                              }
                            >
                              {latestRecord.status}
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="secondary">No Rank</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(latestRecord.checked_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
                    <div className="p-4 space-y-3">
                      {records.map((record, index) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Check #{records.length - index}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(record.checked_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {record.rank !== null ? `#${record.rank}` : 'N/A'}
                            </div>
                            <button
                              onClick={() => {
                                deleteRecord(record.id);
                                toast({
                                  title: 'Deleted',
                                  description:
                                    'Ranking record has been deleted.'
                                });
                              }}
                              className="text-xs text-red-600 hover:text-red-700 mt-1"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          deleteKeywordRecords(keyword);
                          setExpandedKeyword(null);
                          toast({
                            title: 'Deleted',
                            description: `All records for "${keyword}" have been deleted.`
                          });
                        }}
                        className="w-full text-center text-xs text-red-600 hover:text-red-700 py-2 border-t border-gray-200 dark:border-gray-600"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete All Records for This Keyword
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
