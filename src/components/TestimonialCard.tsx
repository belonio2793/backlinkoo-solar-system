import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Testimonial = {
  title: string;
  url: string;
  keyword: string;
  excerpt?: string;
  // rank history sample: array of { date, rank }
  rankHistory: { date: string; rank: number }[];
  visitsHistory?: { date: string; visits: number }[];
};

export default function TestimonialCard({ t }: { t: Testimonial | null }) {
  if (!t) return null;

  const rankData = t.rankHistory.map((r) => ({ date: r.date, position: r.rank }));
  const visitsData = (t.visitsHistory && t.visitsHistory.slice()) || [];

  return (
    <Card className="mt-6 border-slate-200">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm">{t.title}</span>
            <a href={t.url} className="text-xs text-blue-600 hover:underline truncate max-w-lg" target="_blank" rel="noreferrer">
              {t.url}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">#{t.keyword}</Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-700">{t.excerpt || 'Local business reached #1 for a competitive query after focusing content and anchor outreach.'}</p>

          <div className="mt-3 text-xs text-slate-600">
            <strong>Keyword:</strong> {t.keyword}
          </div>

          {/* Social proofs */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-700">Recent social mentions</div>
            <div className="flex flex-wrap gap-2">
              {t.social && t.social.map((s: any, idx: number) => (
                <a key={idx} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-white shadow-sm hover:bg-slate-50" href={s.url} target="_blank" rel="noreferrer">
                  <img src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${(s.platform||'facebook').toLowerCase()}.svg`} alt={s.platform} className="h-4 w-4 opacity-80" />
                  <span>{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3D-ish chart wrapper */}
        <div style={{ perspective: 900 }} className="h-36">
          <div className="w-full h-full rounded-md  bg-white transform-gpu transition-transform hover:rotate-y-1 hover:scale-102" style={{ transform: 'rotateX(-6deg) translateZ(0)' }}>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={rankData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} reversed={true} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="position" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {visitsData && visitsData.length > 0 && (
          <div className="md:col-span-2">
            <div className="text-xs text-slate-600 mb-2">Traffic trend</div>
            <div className="h-36 rounded-md" style={{ perspective: 900 }}>
              <div className="w-full h-full rounded-md  bg-white transform-gpu" style={{ transform: 'rotateX(-5deg)' }}>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={visitsData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Faux posts */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(t.social || []).slice(0,3).map((s:any, i:number) => (
                <div key={i} className="p-2 bg-white border rounded shadow-sm text-xs">
                  <div className="font-semibold">{s.handle}</div>
                  <div className="text-slate-700">"We found them on {s.platform} and loved the results."</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
