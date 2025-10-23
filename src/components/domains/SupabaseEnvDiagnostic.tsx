import React, { useState } from 'react';

export default function SupabaseEnvDiagnostic() {
  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  const supabaseAnonPresent = !!supabaseAnon;
  const supabaseUrlPresent = !!supabaseUrl;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function mask(str?: string) {
    if (!str) return 'missing';
    if (str.length <= 8) return str;
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  }

  const runAuthTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not configured');
      const base = supabaseUrl.replace(/\/$/, '');
      const tokenUrl = `${base}/auth/v1/token?grant_type=password`;
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (supabaseAnon) {
        headers['apikey'] = supabaseAnon;
        headers['Authorization'] = `Bearer ${supabaseAnon}`;
      }
      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: email.trim(), password })
      });
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch { json = { raw: text }; }
      setResult({ status: res.status, body: json });
      if (!res.ok) setError(json?.msg || json?.error || json || `HTTP ${res.status}`);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="p-4 bg-white border rounded shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium">Supabase Environment Diagnostic</div>
            <div className="text-xs text-muted-foreground">Shows masked env visibility and allows an in-browser auth test.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-xs text-gray-500">VITE_SUPABASE_URL</div>
            <div className="font-mono">{supabaseUrlPresent ? mask(supabaseUrl) : 'missing'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">VITE_SUPABASE_ANON_KEY</div>
            <div className="font-mono">{supabaseAnonPresent ? mask(supabaseAnon) : 'missing'}</div>
          </div>
        </div>

        <form onSubmit={runAuthTest} className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded p-2 text-sm" placeholder="test email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="border rounded p-2 text-sm" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm" disabled={loading}>Run auth test</button>
            <button type="button" className="px-3 py-1.5 bg-gray-100 rounded text-sm" onClick={() => { setEmail(''); setPassword(''); setResult(null); setError(null); }}>Reset</button>
            <div className="text-xs text-gray-500 ml-auto">Use a test user or leave blank to see config status.</div>
          </div>
        </form>

        <div className="mt-3 text-sm">
          {loading && <div className="text-xs text-gray-600">Running...</div>}
          {error && <div className="text-xs text-red-600 break-words">Error: {String(error)}</div>}
          {result && (
            <div className="mt-2 text-xs">
              <div>Status: {result.status}</div>
              <pre className="whitespace-pre-wrap text-xs bg-gray-50 border rounded p-2 mt-1">{JSON.stringify(result.body, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
