import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImprovedBlogThemesService } from '@/services/improvedBlogThemesService';

const gradientFor = (variant: 'space' | 'rainbow' | 'infernal') => {
  switch (variant) {
    case 'space':
      return 'linear-gradient(135deg, #0f172a, #1e293b, #0ea5e9, #7c3aed)';
    case 'infernal':
      return 'linear-gradient(135deg, #450a0a, #7f1d1d, #ea580c, #f59e0b)';
    default:
      return 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #f59e0b)';
  }
};

const ThemePreviewCard: React.FC<{ id: string; name: string; description: string; styles: any; index?: number }>
  = ({ id, name, description, styles, index = 0 }) => {
  const sample = ImprovedBlogThemesService.createSamplePost(`${name} Theme`);
  const vars = ImprovedBlogThemesService.generateCSSVariables(styles);
  const variant = (index % 3 === 0) ? 'space' : (index % 3 === 1) ? 'rainbow' : 'infernal';

  const containerRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    const palette = ['#ffffff', '#fde68a', '#a5b4fc', '#fbcfe8'];
    const color = palette[Math.floor(Math.random() * palette.length)];
    setSparkles(prev => [...prev.slice(-18), { id, x, y, color }]);
    window.setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 700);
  };

  const handleMouseLeave = () => setSparkles([]);

  return (
    <div className="relative group h-full" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Outer animated flow border (only on hover) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0 rounded-2xl blur-[6px] animate-gradient-shift"
          style={{ backgroundImage: gradientFor(variant as any), backgroundSize: '300% 300%' }}
        />
      </div>

      {/* Main card content above the animated border */}
      <Card className="relative z-10 overflow-hidden border shadow-md hover:shadow-xl transition-all duration-500 will-change-transform h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: styles.accentColor }} />
            <span className="font-semibold">{name}</span>
            <Badge variant="secondary" className="ml-1 text-[10px] tracking-wide">{id}</Badge>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="relative rounded-xl overflow-hidden border bg-white min-w-0 flex-1 flex flex-col" style={{ ...(vars as React.CSSProperties), wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            <div className="h-24 bg-gradient-to-r animate-gradient-shift flex-shrink-0" style={{ backgroundImage: `linear-gradient(90deg, ${styles.primaryColor}, ${styles.accentColor})`, backgroundSize: '200% 200%' }} />

            <div className="p-4 sm:p-5 bg-white flex-1 flex flex-col" style={{ minHeight: 96 }}>
              <div>
                <h3
                  className="text-xl sm:text-2xl font-extrabold leading-tight mb-2 break-words"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${styles.primaryColor}, ${styles.accentColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: styles.headingFont
                  }}
                >
                  {sample.title}
                </h3>

                {sample.excerpt && (
                  <p className="text-sm mb-2 break-words" style={{ color: styles.secondaryColor, fontFamily: styles.bodyFont, display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                    {sample.excerpt}
                  </p>
                )}

                <div
                  className="text-xs sm:text-sm prose max-w-none break-words whitespace-normal"
                  style={{ color: styles.textColor, fontFamily: styles.bodyFont, display: '-webkit-box', WebkitLineClamp: 3 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: sample.content.split('</p>')[0] + '</p>' }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Badge className="text-[10px]" style={{ background: styles.primaryColor }}>SEO</Badge>
                <Badge variant="outline" className="text-[10px]">Responsive</Badge>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div
          className="w-full h-full rounded-2xl p-[3px]"
          style={{
            background: 'conic-gradient(from var(--angle), #ff7ecb 0%, #ffb86b 16%, #ffe680 33%, #8dd7ff 50%, #b299ff 66%, #ffc2e6 83%, #ff7ecb 100%)',
            animation: 'rainbowHue 8s linear infinite'
          }}
        >
          <div className="relative w-full h-full rounded-xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 overflow-auto">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Add Domains First</h4>
            <p className="text-sm leading-relaxed mb-3 text-gray-700">
              Each blog post generated will have highly relevant and unique content about your keyword, and embedded with an anchor text that is hyperlinked to your target URL.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              The premise of having a highly optimized algorithmic score transfers authority to your destination URL for any specific phrase for higher rankings when users are looking that up across search engines.
            </p>
            <div className="absolute inset-0 pointer-events-none">
              {sparkles.map(s => (
                <span key={s.id} className="sparkle absolute" style={{ left: s.x, top: s.y, color: s.color }}>
                  ✦
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeBlogExamples: React.FC = () => {
  const themes = ImprovedBlogThemesService.getAllThemes();
  return (
    <div className="space-y-4">
      <div className="text-center">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme, i) => (
          <div key={theme.id} className="animate-slide-up h-full" style={{ animationDelay: `${i * 80}ms` }}>
            <ThemePreviewCard id={theme.id} name={theme.name} description={theme.description} styles={theme.styles} index={i} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .prose h2 { font-size: 1.125rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0; }
        .prose p { margin: 0.25rem 0; line-height: 1.6; }
        .prose a { text-decoration: underline; }
        .prose { overflow-wrap: anywhere; word-break: break-word; }
        .break-words { overflow-wrap: anywhere; word-break: break-word; }
        @keyframes sparkle-pop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6) rotate(0deg); } 50% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2) rotate(25deg); } }
        .sparkle { font-size: 10px; line-height: 1; transform: translate(-50%, -50%); animation: sparkle-pop 700ms ease forwards; text-shadow: 0 0 6px rgba(255,255,255,0.7); }
      `}</style>
    </div>
  );
};

export default ThemeBlogExamples;
