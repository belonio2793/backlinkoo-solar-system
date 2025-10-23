import React, { useState } from 'react';
import { migrateAllPublishedToBlogPosts } from '@/utils/syncBlogPostTables';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

const BlogMigration: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; migrated: number; skipped: number; errors: number; message: string }>(null);

  const handleMigrate = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await migrateAllPublishedToBlogPosts(200);
      setResult(res);
    } catch (e: any) {
      setResult({ success: false, migrated: 0, skipped: 0, errors: 1, message: e?.message || 'Unknown error' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Migrate published_blog_posts to blog_posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This tool copies all rows from published_blog_posts into blog_posts (skipping existing slugs). It does not drop tables.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleMigrate} disabled={running} className="bg-blue-600 hover:bg-blue-700">
                {running ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Migrating...</> : 'Run Migration'}
              </Button>
              <Button variant="outline" onClick={() => (window as any).migrateAllPublishedToBlogPosts?.(200)} disabled={running}>
                Run via window.migrateAllPublishedToBlogPosts()
              </Button>
            </div>

            {result && (
              <Alert variant={result.success ? 'default' : 'destructive'} className="mt-4">
                <AlertTitle className="flex items-center gap-2">
                  {result.success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {result.success ? 'Migration Complete' : 'Migration Failed'}
                </AlertTitle>
                <AlertDescription>
                  {result.message}
                  <div className="mt-2 text-sm text-gray-700">Migrated: {result.migrated} • Skipped: {result.skipped} • Errors: {result.errors}</div>
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-gray-500 border-t pt-4 mt-4">
              Optional next steps:
              <ul className="list-disc ml-5 mt-1">
                <li>Disable writes to published_blog_posts (code updated already)</li>
                <li>Optionally drop published_blog_posts via SQL in Supabase when safe</li>
                <li>Confirm RLS on blog_posts allows expected reads/writes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogMigration;
