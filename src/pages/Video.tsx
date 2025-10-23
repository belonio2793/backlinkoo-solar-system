import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Film, PenTool, Sparkles, Video as VideoIcon, Play, RotateCcw } from 'lucide-react';
import { contentFilterService } from '@/services/contentFilterService';
import { useToast } from '@/hooks/use-toast';

interface GenerationConfig {
  style: 'whiteboard' | 'cartoon';
  durationSec: number;
  fps: number;
  resolution: '720p' | '1080p' | 'square';
  title: string;
}

function getResolutionPixels(res: GenerationConfig['resolution']) {
  switch (res) {
    case '1080p': return { width: 1920, height: 1080 };
    case 'square': return { width: 1080, height: 1080 };
    case '720p':
    default:
      return { width: 1280, height: 720 };
  }
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const test = current.length ? current + ' ' + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      // If a single word is too long, hard-break it
      if (ctx.measureText(w).width > maxWidth) {
        let temp = '';
        for (const ch of w) {
          if (ctx.measureText(temp + ch).width > maxWidth) {
            lines.push(temp);
            temp = ch;
          } else {
            temp += ch;
          }
        }
        current = temp;
      } else {
        current = w;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawWhiteboardFrame(ctx: CanvasRenderingContext2D, w: number, h: number, lines: string[], revealRatio: number, title: string) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Title
  ctx.fillStyle = '#111827';
  ctx.font = `${Math.floor(h * 0.07)}px ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto`;
  ctx.textBaseline = 'top';
  ctx.fillText(title, Math.floor(w * 0.08), Math.floor(h * 0.08));

  const startY = Math.floor(h * 0.22);
  const lineHeight = Math.floor(h * 0.06);
  ctx.font = `${Math.floor(h * 0.05)}px ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto`;
  ctx.fillStyle = '#111827';

  // Compute total characters and reveal count
  const totalChars = lines.reduce((acc, l) => acc + l.length, 0);
  const shownChars = Math.max(0, Math.min(totalChars, Math.floor(totalChars * revealRatio)));

  let drawn = 0;
  let handX = Math.floor(w * 0.08);
  let handY = startY;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const remaining = Math.max(0, shownChars - drawn);
    const take = Math.min(remaining, line.length);
    const toDraw = line.slice(0, take);
    ctx.fillText(toDraw, Math.floor(w * 0.08), startY + i * lineHeight);

    // Update hand position at the end of current partial line
    const measured = ctx.measureText(toDraw);
    handX = Math.floor(w * 0.08 + measured.width);
    handY = startY + i * lineHeight;

    drawn += take;
    if (remaining <= line.length) break;
  }

  // Draw a simple marker "hand" circle
  ctx.beginPath();
  ctx.arc(handX + 10, handY + 18, Math.max(6, Math.floor(h * 0.008)), 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();
}

function drawCartoonFrame(ctx: CanvasRenderingContext2D, w: number, h: number, lines: string[], t: number, title: string) {
  // Animated gradient background
  const hue = (t * 360) % 360;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, `hsl(${(hue + 200) % 360} 90% 60%)`);
  grad.addColorStop(1, `hsl(${(hue + 260) % 360} 90% 45%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle blobs
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const rr = (i + 1) * (h * 0.06);
    ctx.beginPath();
    ctx.arc((w * (i + 1)) / 7, (h * (i + 2)) / 9, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Title with pop animation
  const pop = 0.9 + 0.1 * Math.sin(t * Math.PI * 2 * 1.5);
  ctx.save();
  ctx.translate(w * 0.1, h * 0.12);
  ctx.scale(pop, pop);
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 18;
  ctx.font = `${Math.floor(h * 0.08)}px ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto`;
  ctx.fillText(title, 0, 0);
  ctx.restore();

  // Text blocks slide-in
  ctx.font = `${Math.floor(h * 0.05)}px ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto`;
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(0,0,0,0.20)';
  ctx.shadowBlur = 10;

  const lineHeight = Math.floor(h * 0.065);
  const baseY = Math.floor(h * 0.28);

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const delay = i * 0.08;
    const localT = Math.min(1, Math.max(0, (t - delay) / 0.6));
    const slide = (1 - easeInOutCubic(localT)) * 80;
    ctx.fillText(lines[i], Math.floor(w * 0.08), baseY + i * lineHeight + slide);
  }
}

export default function VideoGeneratorPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('Explain how photosynthesis works for middle school students.');
  const [config, setConfig] = useState<GenerationConfig>({
    style: 'whiteboard',
    durationSec: 15,
    fps: 30,
    resolution: '720p',
    title: 'Educational Explainer'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number | null>(null);

  // Clean up URL blobs
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    };
  }, [videoUrl]);

  const generate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a prompt', description: 'Please provide an educational prompt to generate a video.', variant: 'destructive' });
      return;
    }

    // Content moderation
    const moderation = contentFilterService.filterContent(prompt, 'video_generation');
    if (!moderation.isAllowed) {
      toast({
        title: 'Prompt blocked',
        description: moderation.reason || 'Please adjust your prompt to meet content guidelines.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setVideoUrl(null);

    const { width, height } = getResolutionPixels(config.resolution);

    let canvas = canvasRef.current;
    if (!canvas) return;

    // Account for device pixel ratio for sharper export
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({ title: 'Canvas error', description: 'Failed to get drawing context.', variant: 'destructive' });
      setIsGenerating(false);
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fps = config.fps;
    const stream = (canvas as any).captureStream ? (canvas as any).captureStream(fps) : null;
    if (!stream) {
      toast({ title: 'Unsupported', description: 'Video capture not supported in this browser.', variant: 'destructive' });
      setIsGenerating(false);
      return;
    }

    chunksRef.current = [];

    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    let mimeType = '';
    for (const mt of mimeTypes) {
      if ((window as any).MediaRecorder && (window as any).MediaRecorder.isTypeSupported?.(mt)) {
        mimeType = mt; break;
      }
    }

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    const handleStop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsGenerating(false);
      setProgress(100);
      toast({ title: 'Video ready', description: 'Preview and download your generated video.' });
    };

    recorder.onstop = handleStop;

    // Prepare text
    ctx.font = `${Math.floor(height * 0.05)}px ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto`;
    const maxTextWidth = Math.floor(width * 0.84);
    const lines = wrapText(ctx, prompt, maxTextWidth);

    const title = config.title || 'Explainer Video';

    const durationMs = Math.max(3, config.durationSec) * 1000;
    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeInOutCubic(t);

      if (config.style === 'whiteboard') {
        drawWhiteboardFrame(ctx, width, height, lines, eased, title);
      } else {
        drawCartoonFrame(ctx, width, height, lines, t, title);
      }

      setProgress(Math.floor(t * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        // End recording shortly after last frame to flush encoder
        setTimeout(() => recorder.stop(), 200);
      }
    };

    recorder.start();
    rafRef.current = requestAnimationFrame(draw);
  }, [prompt, config, toast]);

  const download = useCallback(() => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    const ext = videoUrl.includes('webm') ? 'webm' : 'webm';
    a.download = `${config.style}-explainer.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [videoUrl, config.style]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70">
      <div className="container py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <VideoIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Video Generator</h1>
            <p className="text-muted-foreground">Create educational whiteboard or cartoon-style videos from a simple prompt.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="preview" disabled={!videoUrl}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Generate Video</CardTitle>
                  <CardDescription>Type your prompt, choose a style, and generate a professional animation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={config.title} onChange={(e) => setConfig(c => ({ ...c, title: e.target.value }))} placeholder="Short video title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} placeholder="Describe the topic or script you want visualized" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select value={config.style} onValueChange={(v: any) => setConfig(c => ({ ...c, style: v }))}>
                        <SelectTrigger><SelectValue placeholder="Choose style" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whiteboard"><div className="flex items-center gap-2"><PenTool className="h-4 w-4" /> Whiteboard Animation</div></SelectItem>
                          <SelectItem value="cartoon"><div className="flex items-center gap-2"><Film className="h-4 w-4" /> Cartoon Education</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <Select value={config.resolution} onValueChange={(v: any) => setConfig(c => ({ ...c, resolution: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">1280x720 (HD)</SelectItem>
                          <SelectItem value="1080p">1920x1080 (Full HD)</SelectItem>
                          <SelectItem value="square">1080x1080 (Square)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (seconds)</Label>
                      <Input type="number" min={5} max={90} value={config.durationSec} onChange={(e) => setConfig(c => ({ ...c, durationSec: Math.max(5, Math.min(90, Number(e.target.value)||0)) }))} />
                    </div>

                    <div className="space-y-2">
                      <Label>FPS</Label>
                      <Input type="number" min={15} max={60} value={config.fps} onChange={(e) => setConfig(c => ({ ...c, fps: Math.max(15, Math.min(60, Number(e.target.value)||0)) }))} />
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <div className="text-sm text-muted-foreground">Rendering frames... {progress}%</div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Button onClick={generate} disabled={isGenerating} className="gap-2">
                      {isGenerating ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {isGenerating ? 'Generating...' : 'Generate Video'}
                    </Button>
                    <Button variant="outline" onClick={() => setPrompt('Explain how photosynthesis works for middle school students.')} disabled={isGenerating}>Use Example</Button>
                  </div>

                  <Alert>
                    <AlertDescription>
                      Videos are generated in-browser as WebM for instant preview and download. For backend rendering (MP4) or provider integration, we can connect external APIs.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><VideoIcon className="h-5 w-5" /> Preview</CardTitle>
                  <CardDescription>Your generated video will appear here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {mp4Url ? (
                    <video src={mp4Url} controls className="w-full h-full object-contain bg-black" />
                  ) : videoUrl ? (
                    <video src={videoUrl} controls className="w-full h-full object-contain bg-black" />
                  ) : (
                      <div className="text-muted-foreground flex flex-col items-center gap-2">
                        <Play className="h-6 w-6" />
                        <span>No video yet</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={download} disabled={!videoUrl} className="gap-2"><Download className="h-4 w-4" /> Download</Button>
                    <Button variant="outline" onClick={() => setActiveTab('preview')} disabled={!videoUrl}>Open Preview Tab</Button>
                    <Button variant="outline" disabled={!videoUrl || isTranscoding} onClick={async () => {
                      if (!videoUrl) return;
                      try {
                        setIsTranscoding(true);
                        setMp4Url(null);
                        const resBlob = await fetch(videoUrl).then(r => r.blob());
                        const arrayBuf = await resBlob.arrayBuffer();
                        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
                        const dataUrl = `data:${resBlob.type || 'video/webm'};base64,${base64}`;
                        const resp = await fetch('/.netlify/functions/transcode-video', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ fileBase64: dataUrl })
                        });
                        const json = await resp.json();
                        if (!resp.ok || !json?.mp4Url) {
                          throw new Error(json?.error || 'Transcode failed');
                        }
                        setMp4Url(json.mp4Url);
                        setActiveTab('preview');
                        toast({ title: 'Cinematic MP4 ready', description: 'Rendered with 21:9, 24fps, H.264 High profile.' });
                      } catch (e: any) {
                        toast({ title: 'Transcode error', description: e?.message || 'Failed converting to MP4', variant: 'destructive' });
                      } finally {
                        setIsTranscoding(false);
                      }
                    }}> {isTranscoding ? 'Transcoding…' : 'Cinematic MP4 (Cloudinary)'} </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Film className="h-5 w-5" /> Generated Video</CardTitle>
                <CardDescription>Review your video and download the file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {mp4Url ? (
                    <video src={mp4Url} controls autoPlay className="w-full h-full object-contain" />
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">No video yet</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={download} disabled={!videoUrl} className="gap-2"><Download className="h-4 w-4" /> Download</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hidden canvas used for rendering/recording */}
        <div className="sr-only" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
