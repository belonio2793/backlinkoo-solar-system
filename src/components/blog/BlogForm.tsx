import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DirectOpenAIService } from '@/services/directOpenAI';
import { AnimatedBlogHeadline } from '@/components/AnimatedBlogHeadline';
import { Loader2, Link, Target, Globe } from 'lucide-react';

interface BlogFormProps {
  onContentGenerated: (content: any) => void;
}

export function BlogForm({ onContentGenerated }: BlogFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  // Persist fields to survive unexpected remounts (reported "auto delete" issue)
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    try {
      const k = sessionStorage.getItem('blogForm.keyword');
      const a = sessionStorage.getItem('blogForm.anchorText');
      const t = sessionStorage.getItem('blogForm.targetUrl');
      if (k) setKeyword(k);
      if (a) setAnchorText(a);
      if (t) setTargetUrl(t);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('blogForm.keyword', keyword);
      sessionStorage.setItem('blogForm.anchorText', anchorText);
      sessionStorage.setItem('blogForm.targetUrl', targetUrl);
    } catch {}
  }, [keyword, anchorText, targetUrl]);
  const { toast } = useToast();

  // Refs to preserve focus if a re-render causes an unintended blur
  const formRef = useRef<HTMLDivElement | null>(null);
  const keywordRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLInputElement | null>(null);
  const targetRef = useRef<HTMLInputElement | null>(null);

  // Track which field the user intends to keep focused
  const [focusedField, setFocusedField] = useState<null | 'keyword' | 'anchor' | 'target'>(null);

  // Refocus after any render if no element inside the form currently has focus
  useEffect(() => {
    if (!focusedField) return;
    const active = document.activeElement as HTMLElement | null;
    if (active && formRef.current && formRef.current.contains(active)) return;
    const map = { keyword: keywordRef, anchor: anchorRef, target: targetRef } as const;
    const ref = map[focusedField];
    // delay to allow re-mounts to complete
    const id = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  });

  // Track selection ranges to restore them when we refocus
  const keywordSel = useRef<{ start: number | null; end: number | null }>({ start: null, end: null });
  const anchorSel = useRef<{ start: number | null; end: number | null }>({ start: null, end: null });
  const targetSel = useRef<{ start: number | null; end: number | null }>({ start: null, end: null });

  const preserveFocusOnUnintendedBlur = (ref: React.RefObject<HTMLInputElement>) => (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (next) return;
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || (formRef.current && !formRef.current.contains(active))) {
        const el = ref.current;
        if (el) {
          el.focus({ preventScroll: true });
          // Restore selection if we have it
          const sel = ref === keywordRef ? keywordSel.current : ref === anchorRef ? anchorSel.current : targetSel.current;
          if (typeof sel.start === 'number' && typeof sel.end === 'number') {
            try { el.setSelectionRange(sel.start, sel.end); } catch {}
          }
        }
      }
    });
  };

  const formatUrl = (url: string): string => {
    if (!url) return url;
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl;
    if (trimmedUrl.startsWith('www.') || /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(trimmedUrl)) return `https://${trimmedUrl}`;
    return `https://${trimmedUrl}`;
  };

  const handleTargetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(e.target.value);
  };

  const handleTargetUrlBlur = () => {
    if (targetUrl) {
      const formattedUrl = formatUrl(targetUrl);
      if (formattedUrl !== targetUrl) setTargetUrl(formattedUrl);
    }
  };

  const generateContent = async () => {
    if (!keyword || !anchorText || !targetUrl) {
      toast({ title: 'Missing Information', description: 'Please provide keyword, anchor text, and target URL', variant: 'destructive' });
      return;
    }

    const formattedUrl = formatUrl(targetUrl);
    if (formattedUrl !== targetUrl) setTargetUrl(formattedUrl);

    try {
      new URL(formattedUrl);
    } catch {
      toast({ title: 'Invalid URL', description: 'Please provide a valid target URL', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Processing...');

    try {
      const result = await DirectOpenAIService.generateBlogPost(
        { keyword, anchorText, targetUrl: formattedUrl },
        { source: 'homepage', onProgress: () => setStatusMessage('Processing...') }
      );

      if (result.success) {
        onContentGenerated({ ...result, inputs: { keyword, anchorText, targetUrl: formattedUrl } });
        setKeyword('');
        setAnchorText('');
        setTargetUrl('');
      } else {
        throw new Error(result.error || 'Blog generation failed');
      }
    } catch (error) {
      console.error('Blog generation failed:', error);
      toast({ title: 'Generation Failed', description: error instanceof Error ? error.message : 'Failed to generate blog post. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
      setStatusMessage(null);
    }
  };

  return (
    <div ref={formRef} className="w-full px-4 space-y-6 ui-freeze-on-input">
      <AnimatedBlogHeadline />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="keyword" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-emerald-200">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            Keyword
          </Label>
          <div className="relative group">
            <Input
              id="keyword"
              ref={keywordRef}
              placeholder="e.g., best SEO practices, digital marketing tips"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setFocusedField('keyword')}
              onBlur={preserveFocusOnUnintendedBlur(keywordRef)}
              onSelect={(e) => {
                const el = e.currentTarget;
                keywordSel.current.start = el.selectionStart;
                keywordSel.current.end = el.selectionEnd;
              }}
              onKeyUp={(e) => {
                const el = e.currentTarget;
                keywordSel.current.start = el.selectionStart;
                keywordSel.current.end = el.selectionEnd;
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-12 px-5 text-sm border border-input rounded-full bg-white/90 backdrop-blur-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center">
              <Target className="h-2.5 w-2.5 text-emerald-600" />
            </div>
            The main topic your blog post will focus on
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anchorText" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-amber-200">
              <Link className="h-5 w-5 text-amber-600" />
            </div>
            Anchor Text
          </Label>
          <div className="relative group">
            <Input
              id="anchorText"
              ref={anchorRef}
              placeholder="e.g., professional SEO services, learn more here"
              value={anchorText}
              onChange={(e) => setAnchorText(e.target.value)}
              onFocus={() => setFocusedField('anchor')}
              onBlur={preserveFocusOnUnintendedBlur(anchorRef)}
              onSelect={(e) => {
                const el = e.currentTarget;
                anchorSel.current.start = el.selectionStart;
                anchorSel.current.end = el.selectionEnd;
              }}
              onKeyUp={(e) => {
                const el = e.currentTarget;
                anchorSel.current.start = el.selectionStart;
                anchorSel.current.end = el.selectionEnd;
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-12 px-5 text-sm border border-input rounded-full bg-white/90 backdrop-blur-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center">
              <Link className="h-2.5 w-2.5 text-amber-600" />
            </div>
            The clickable text that will link to your URL
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="p-1.5 bg-white rounded-lg shadow-sm border border-blue-200">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          Target URL
        </Label>
        <div className="relative group">
          <Input
            id="targetUrl"
            ref={targetRef}
            placeholder="your-website.com/landing-page"
            value={targetUrl}
            onChange={handleTargetUrlChange}
            onFocus={() => setFocusedField('target')}
            onBlur={(e) => {
              preserveFocusOnUnintendedBlur(targetRef)(e);
              handleTargetUrlBlur();
            }}
            onSelect={(e) => {
              const el = e.currentTarget;
              targetSel.current.start = el.selectionStart;
              targetSel.current.end = el.selectionEnd;
            }}
            onKeyUp={(e) => {
              const el = e.currentTarget;
              targetSel.current.start = el.selectionStart;
              targetSel.current.end = el.selectionEnd;
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-12 px-5 text-sm border border-input rounded-full bg-white/90 backdrop-blur-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            type="url"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-blue-50 border border-blue-300 flex items-center justify-center">
            <Globe className="h-2.5 w-2.5 text-blue-600" />
          </div>
          The destination URL where the anchor text will link to.
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={generateContent}
          disabled={isGenerating || !keyword || !anchorText || !targetUrl}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-0 rounded-lg text-white"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <span>Claim Now</span>
          )}
        </Button>
        {isGenerating && (
          <div className="mt-2 text-xs text-gray-500 font-light text-center animate-pulse">{statusMessage}</div>
        )}
      </div>

      <div className="flex justify-center pt-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <span>Instant Generation</span>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          <span>100% Free</span>
          <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
          <span>No Credit Card</span>
        </div>
      </div>
    </div>
  );
}
