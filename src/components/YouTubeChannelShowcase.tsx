import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, ArrowLeft, ArrowRight, Youtube } from 'lucide-react';

interface YtVideo {
  id: string;
  title: string;
  publishedAt?: string;
  url: string;
  thumbnail: string;
}

interface FeedResponse {
  channelId?: string;
  uploadsPlaylistId?: string;
  count?: number;
  videos: YtVideo[];
  error?: string;
}

export default function YouTubeChannelShowcase({ handle = 'backlinkoo', manualVideoUrls }: { handle?: string; manualVideoUrls?: string[] }) {
  const [videos, setVideos] = useState<YtVideo[]>([]);
  const [channelId, setChannelId] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const extractId = (u: string): string | null => {
    try {
      const url = new URL(u);
      if (url.hostname === 'youtu.be') return url.pathname.slice(1);
      if (url.searchParams.get('v')) return url.searchParams.get('v');
      const m = url.pathname.match(/\/embed\/([\w-]{6,})/);
      return m ? m[1] : null;
    } catch {
      const m = u.match(/v=([\w-]{6,})/);
      return m ? m[1] : null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      try {
        if (manualVideoUrls && manualVideoUrls.length) {
          const mapped: YtVideo[] = manualVideoUrls
            .map((u) => extractId(u))
            .filter(Boolean)
            .map((id) => ({
              id: id as string,
              title: 'YouTube Video',
              publishedAt: undefined,
              url: `https://www.youtube.com/watch?v=${id}`,
              thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
            }));
          if (!mounted) return;
          setVideos(mapped);
          setChannelId(undefined);
          setActive(0);
        } else {
          const res = await fetch(`/api/youtube-channel-feed?handle=${encodeURIComponent(handle)}`);
          const data: FeedResponse = await res.json();
          if (!mounted) return;
          setVideos(Array.isArray(data.videos) ? data.videos : []);
          setChannelId(data.channelId);
          setActive(0);
        }
      } catch (_) {
        if (!mounted) return;
        setVideos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => { mounted = false; };
  }, [handle, manualVideoUrls && manualVideoUrls.join('|')]);

  // Auto-rotate featured video like a carousel when dialog is closed
  useEffect(() => {
    if (open || videos.length < 2) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % videos.length);
    }, 6000);
    return () => clearInterval(id);
  }, [open, videos.length]);

  const uploadsPlaylistId = useMemo(() => channelId ? `UU${channelId.slice(2)}` : undefined, [channelId]);
  const featured = videos[active];

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 340;
    el.scrollBy({ left: dir * step * 1.25, behavior: 'smooth' });
  };

  return (
    <section className="relative py-3 md:py-4 px-4 md:px-6 bg-gradient-to-br from-[hsl(var(--primary)/0.06)] via-white to-[hsl(var(--accent)/0.06)] border-y border-border/50">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-gray-900">Backlink{' '}<span className="text-blue-600 mx-0.5">∞</span>{' '}on YouTube</h2>
            <p className="text-xs text-gray-600 text-opacity-75">Deep-dives, demos, and ranking insights. Tap to play.</p>
          </div>
          <div className="flex items-center gap-2">
            {uploadsPlaylistId && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex text-xs h-8"
              >
                <a href={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&autoplay=1&rel=0`} target="_blank" rel="noopener noreferrer">
                  <Play className="h-3 w-3 mr-1" /> Play All
                </a>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <a href={`https://www.youtube.com/@${handle}`} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-3 w-3 mr-1" /> Channel
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Featured cinematic card */}
        <div className="relative group rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
          <div className="aspect-video relative max-h-56">
            {featured ? (
              <>
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 flex items-end justify-between gap-2">
                  <div className="max-w-2xl">
                    <Badge variant="secondary" className="mb-0.5 bg-white text-gray-900 text-xs px-1.5 py-0">Featured</Badge>
                    <h3 className="text-white text-xs sm:text-sm font-semibold leading-tight drop-shadow line-clamp-2">{featured.title}</h3>
                  </div>
                  <Button onClick={() => setOpen(true)} size="sm" className="shadow-md h-7 text-xs">
                    <Play className="h-3 w-3 mr-1" /> Watch
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">{loading ? 'Loading videos…' : 'No videos found.'}</div>
            )}
          </div>
        </div>

        {/* Horizontal mosaic ribbon */}
        <div className="relative mt-2">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <Button size="icon" variant="ghost" onClick={() => scrollBy(-1)} aria-label="Scroll left">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <Button size="icon" variant="ghost" onClick={() => scrollBy(1)} aria-label="Scroll right">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div
            ref={scrollerRef}
            className="relative overflow-x-auto hide-scrollbar pr-2 -mr-2"
          >
            <div className="flex gap-1.5 snap-x snap-mandatory">
              {videos.map((v, idx) => (
                <button
                  key={v.id}
                  data-card
                  onClick={() => { setActive(idx); setOpen(true); }}
                  className={`group relative shrink-0 w-[78%] sm:w-[100px] md:w-[110px] snap-start rounded-md overflow-hidden border ${idx === active ? 'border-primary/50' : 'border-border/50'} bg-white shadow-xs hover:shadow-sm transition-all`}
                >
                  <div className="aspect-video relative">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-1">
                      <div className="inline-flex items-center px-1 py-0.5 rounded-full bg-black/70 text-white text-xs">
                        <Play className="h-2 w-2 mr-0.5" /> Tap
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-left text-xs font-medium text-white drop-shadow">{v.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {featured && (
              <div className="aspect-video w-full">
                <iframe
                  key={featured.id}
                  src={`https://www.youtube.com/embed/${featured.id}?autoplay=1&rel=0`}
                  title={featured.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
