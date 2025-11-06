import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronRight, Send, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage { id: string; role: 'user' | 'assistant' | 'system'; content: string }

interface TrendingKeywordsSidebarProps {
  variant?: "floating" | "menu";
  hideFloatingTrigger?: boolean;
}

// Plain-text only system prompt
const system = (
  'You are a concise assistant for SEO/content/keywords. Respond in plain text only: no markdown, no code fences, no emojis. Keep answers short and direct (1–3 sentences). If steps are needed, use simple hyphen bullets. Avoid preamble.'
);

export default function TrendingKeywordsSidebar({ 
  variant = "floating",
  hideFloatingTrigger = false 
}: TrendingKeywordsSidebarProps) {

  const isFloating = variant === "floating";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome', role: 'assistant', content: 'Ask anything. I can help with content, strategy, keywords, and more.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingId, setTypingId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const fnBase = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || '';
  const endpoints = useMemo(() => ([
    fnBase ? `${fnBase}/xai-chat` : '',
    '/api/xai-chat',
    '/.netlify/functions/xai-chat'
  ].filter(Boolean) as string[]), [fnBase]);

  useEffect(() => { if (open) setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Listen for global event to open the assistant (dispatched from Header)
  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
      // focus textarea shortly after opening
      setTimeout(() => { try { textAreaRef.current?.focus(); } catch {} }, 150);
    };

    window.addEventListener('open-ask-ai', handler as EventListener);
    return () => window.removeEventListener('open-ask-ai', handler as EventListener);
  }, []);

  async function tryFetchJson(url: string, init?: RequestInit) {
    try {
      const res = await fetch(url, init);
      const text = await res.text().catch(() => '');
      if (!res.ok) return null;
      try { return JSON.parse(text); } catch { return null; }
    } catch { return null; }
  }

  // Race multiple endpoints
  async function sendToAI(history: { role: 'user'|'assistant'|'system'; content: string }[]) {
    const body = JSON.stringify({ messages: history });
    const controllers = endpoints.map(() => new AbortController());

    return await new Promise((resolve, reject) => {
      let pending = endpoints.length;
      let settled = false;

      endpoints.forEach((url, i) => {
        tryFetchJson(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: controllers[i].signal
        }).then((json) => {
          if (settled) return;
          if (json) {
            settled = true;
            controllers.forEach((c, idx) => { if (idx !== i) c.abort(); });
            resolve(json);
          } else {
            pending -= 1;
            if (pending === 0 && !settled) reject(new Error('Service unavailable'));
          }
        }).catch(() => {
          pending -= 1;
          if (pending === 0 && !settled) reject(new Error('Service unavailable'));
        });
      });
    });
  }

  function typewriterAppend(id: string, full: string, speed = 60) {
    setTypingId(id);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content: full.slice(0, i) } : m));
      if (i >= full.length) { clearInterval(interval); setTypingId(null); }
    }, Math.max(6, 1000 / speed));
  }

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    const max = 128;
    el.style.height = Math.min(max, el.scrollHeight) + 'px';
  }

  function clearChat() {
    setTypingId(null);
    setError(null);
    setInput('');
    setMessages([{ id: 'welcome', role: 'assistant', content: 'Ask anything. I can help with content, strategy, keywords, and more.' }]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    setInput('');

    const id = `m-${Date.now()}`;
    const userMsg: ChatMessage = { id, role: 'user', content: text };
    const placeholderId = `a-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = { id: placeholderId, role: 'assistant', content: '…' };

    const next = [...messages, userMsg, assistantMsg];
    setMessages(next);
    setLoading(true);

    try {
      const history = [
        { role: 'system' as const, content: system },
        ...next.map(({ role, content }) => ({ role, content }))
      ];
      const json: any = await sendToAI(history);
      if (json?.ok && json?.message?.content) {
        typewriterAppend(assistantMsg.id, String(json.message.content), 70);
      } else {
        setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: 'Sorry, I could not generate a response.' } : m));
        setError(json?.error || 'Failed to get a response');
      }
    } catch (e: any) {
      setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: 'Connection error. Please try again.' } : m));
      setError(e?.message || 'Request failed');
    } finally {
      setLoading(false);
      if (textAreaRef.current) autoGrow(textAreaRef.current);
    }
  }

  const assistantReplyCount = useMemo(
    () => messages.filter((m) => m.role === 'assistant').length,
    [messages]
  );

  const sheetContent = (
    <SheetContent side="left" className="w-[360px] sm:w-[420px] flex flex-col p-0 border-0">
      <SheetHeader className="pt-2 pl-4">
        <SheetTitle className="flex items-center gap-2">
          Ask Backlink <span className="text-blue-500">∞</span> AI
        </SheetTitle>
      </SheetHeader>

      <div className="mt-4 flex-1 flex flex-col">
        <div className="pt-4 h-full flex flex-col">
          <div className="text-sm text-muted-foreground mb-1 flex items-center justify-between px-4">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Secure assistant chat</span>
            <Button type="button" variant="ghost" size="icon" onClick={clearChat} aria-label="Clear chat">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 px-4" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block rounded-md px-3 py-2 text-sm whitespace-pre-wrap break-words ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {m.content}
                  {typingId === m.id && <span className="animate-pulse">|</span>}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {error && <div className="mt-2 text-xs text-red-600 px-4">{error}</div>}

          <form onSubmit={onSubmit} className="mt-3 flex gap-2 px-4 py-3">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); if (textAreaRef.current) autoGrow(textAreaRef.current); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
              }}
              placeholder="Start typing..."
              rows={1}
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-5 whitespace-pre-wrap break-words max-h-32 overflow-y-auto"
              aria-label="Ask AI"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </SheetContent>
  );

  // --- RENDER LOGIC ---

  // 📌 In menu mode → render only Dropdown trigger + Sheet
  if (!isFloating) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <DropdownMenuItem
          onSelect={(event) => { event.preventDefault(); setOpen(true); }}
          className="flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Ask Backlink <span className="text-blue-500">∞</span> AI
          </span>
          <Badge variant="secondary">{assistantReplyCount}</Badge>
        </DropdownMenuItem>
        {sheetContent}
      </Sheet>
    );
  }

  // 📌 In floating mode → render full floating button + Sheet
  return (
    <div className="pointer-events-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        {!hideFloatingTrigger && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-40 bg-white border rounded-r px-3 py-2 shadow flex items-center gap-2 whitespace-nowrap rainbow-outline-onhover"
          >
            <ChevronRight className="w-4 h-4 rotate-180 text-black" />
            <span className="text-xs font-medium flex items-center gap-1">Ask Backlink <span className="text-blue-500">∞</span> AI</span>
            <Badge variant="secondary">{assistantReplyCount}</Badge>
          </button>
        )}
        {sheetContent}
      </Sheet>
    </div>
  );
}
