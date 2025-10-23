import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DeleteGenerated() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending'|'done'|'missing'>('pending');

  useEffect(() => {
    try {
      const key = `generated-page:${slug}`;
      const exists = typeof localStorage !== 'undefined' && localStorage.getItem(key) != null;
      if (exists) {
        localStorage.removeItem(key);
        setStatus('done');
      } else {
        setStatus('missing');
      }
    } catch {
      setStatus('missing');
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-12 text-slate-800">
        <h1 className="text-2xl font-bold">Delete Generated Page</h1>
        {status === 'pending' && <p className="mt-2">Processing…</p>}
        {status === 'done' && (
          <div className="mt-3">
            <p>Deleted local copy for slug: <strong>{slug}</strong>.</p>
            <div className="mt-4 flex gap-3">
              <button className="px-3 py-2 rounded bg-emerald-600 text-white" onClick={() => navigate(-1)}>Go Back</button>
              <Link className="px-3 py-2 rounded bg-slate-800 text-white" to="/generate">Open Generator</Link>
            </div>
          </div>
        )}
        {status === 'missing' && (
          <div className="mt-3">
            <p>No stored page found for slug: <strong>{slug}</strong>. It may already be removed or was never saved in this browser.</p>
            <div className="mt-4">
              <Link className="px-3 py-2 rounded bg-slate-800 text-white" to="/generate">Open Generator</Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
