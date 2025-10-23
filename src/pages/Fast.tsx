import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Play, Square, ExternalLink, CheckCircle2, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import runHomeFast, { PLATFORM_CONFIG } from "@/services/homefast";
import FastSubmissionWizard from "@/components/fast/FastSubmissionWizard";

type HomeFastEventType = 'start' | 'signup_required' | 'processing' | 'ready' | 'inserting' | 'done' | 'error';
interface HomeFastEvent {
  type: HomeFastEventType;
  platform: string;
  message?: string;
  payload?: Record<string, any>;
  link?: string;
  error?: string;
}
interface HomeFastOptions {
  url: string;
  productName: string;
  email: string;
  contactName?: string;
  description?: string;
  only?: string[];
  signup?: {
    password?: string;
    role?: string;
    phone?: string;
    companySize?: string;
    country?: string;
    logo?: string;
    logoFileName?: string;
  };
}

interface PlatformState {
  status: "idle" | "preparing" | "signup_required" | "processing" | "ready" | "inserting" | "completed" | "error";
  message?: string;
  payload?: Record<string, any>;
  link?: string;
  startedAt?: number;
}

const defaultPlatforms = Object.keys(PLATFORM_CONFIG);

const formatSubmissionMode = (mode?: string) => {
  if (mode === "hybrid") return "API + manual";
  if (mode === "api") return "API";
  return "Manual override";
};

const normalizeUrl = (value: string) => {
  if (!value) return "";
  let v = String(value).trim();
  if (!v) return "";
  v = v.replace(/\s+/g, "");
  if (/^\/\//.test(v)) v = "https:" + v;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  v = v.replace(/\\+/g, "/");
  try {
    const u = new URL(v);
    u.protocol = "https:";
    u.hostname = u.hostname.toLowerCase();
    if (u.port === "443" || u.port === "80") u.port = "";
    let path = u.pathname || "/";
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    u.pathname = path;
    if (u.search) {
      const sp = new URLSearchParams(u.search);
      const sorted = new URLSearchParams();
      Array.from(sp.keys()).sort().forEach((k) => {
        const val = sp.get(k);
        if (val !== null) sorted.append(k, val);
      });
      u.search = sorted.toString() ? `?${sorted.toString()}` : "";
    }
    return u.toString();
  } catch {
    return v.replace(/\/{2,}/g, "/").replace(/^https:\//, "https://");
  }
};

export default function Fast() {
  const [url, setUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(defaultPlatforms);
  const [running, setRunning] = useState(false);
  const [platforms, setPlatforms] = useState<Record<string, PlatformState>>(() => Object.fromEntries(defaultPlatforms.map(k => [k, { status: "idle" }])));
  const controllerRef = useRef<{ cancel: () => void } | null>(null);
  const [genLoading, setGenLoading] = useState(false);

  const FN_BASE: string = (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL || '/.netlify/functions';

  const selectedConfig = useMemo(() => selected.map((k) => ({ key: k, cfg: PLATFORM_CONFIG[k] })), [selected]);

  const onLogoChange = useCallback((file: File | null) => {
    setLogoFile(file);
    if (!file) { setLogoPreview(""); setLogoDataUrl(""); return; }
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }, []);

  const reset = useCallback(() => {
    setPlatforms(Object.fromEntries(Object.keys(PLATFORM_CONFIG).map(k => [k, { status: "idle" }])));
    setRunning(false);
    controllerRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (!url || !productName || !email || !password) {
      toast.error("Please fill URL, Product Name, Email and Password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (normalizedUrl !== url) setUrl(normalizedUrl);
    reset();
    setOpen(true);
    setRunning(true);
    const logoFileName = logoFile?.name || "logo.png";
    const options: HomeFastOptions = {
      url: normalizedUrl,
      productName,
      email,
      contactName,
      description,
      only: selected,
      signup: {
        password,
        role,
        phone,
        companySize,
        country,
        logo: logoDataUrl,
        logoFileName
      }
    };
    const controller = runHomeFast(options, (evt: HomeFastEvent) => {
      let shouldStop = false;
      setPlatforms((prev) => {
        const next = { ...prev };
        const cur = next[evt.platform] || { status: "idle" };
        if (evt.type === "start") {
          next[evt.platform] = { ...cur, status: "preparing", message: evt.message, link: evt.link, startedAt: Date.now() };
        } else if (evt.type === "signup_required") {
          next[evt.platform] = { ...cur, status: "signup_required", message: evt.message, link: evt.link };
        } else if (evt.type === "processing") {
          next[evt.platform] = { ...cur, status: "processing", message: evt.message, link: evt.link };
        } else if (evt.type === "ready") {
          next[evt.platform] = { ...cur, status: "ready", payload: evt.payload, message: evt.message, link: evt.link };
        } else if (evt.type === "inserting") {
          next[evt.platform] = { ...cur, status: "inserting", message: evt.message, link: evt.link };
        } else if (evt.type === "done") {
          next[evt.platform] = { ...cur, status: "completed", message: evt.message };
        } else if (evt.type === "error") {
          next[evt.platform] = { ...cur, status: "error", message: evt.error || evt.message };
        }
        if (evt.type === "done") {
          shouldStop = selected.every((key) => next[key]?.status === "completed");
        }
        return next;
      });
      if (evt.type === "error") {
        toast.error(evt.error || "HomeFast encountered an error");
        setRunning(false);
      }
      if (shouldStop) {
        toast.success("HomeFast finished preparing submissions");
        setRunning(false);
      }
    });
    controllerRef.current = controller;
  }, [url, productName, email, contactName, description, password, confirmPassword, selected, role, phone, companySize, country, logoDataUrl, logoFile, reset]);

  const stop = useCallback(() => {
    controllerRef.current?.cancel();
    setRunning(false);
    toast("HomeFast stopped");
  }, []);

  const markSubmitted = useCallback((key: string) => {
    setPlatforms(prev => {
      const cur = prev[key] || { status: "idle" };
      return { ...prev, [key]: { ...cur, status: "completed", message: "Marked as submitted manually" } };
    });
  }, []);

  const resetPlatform = useCallback((key: string) => {
    setPlatforms(prev => ({ ...prev, [key]: { status: "idle" } }));
  }, []);

  const markError = useCallback((key: string, msg?: string) => {
    setPlatforms(prev => {
      const cur = prev[key] || { status: "idle" };
      return { ...prev, [key]: { ...cur, status: "error", message: msg || "Manual override: error" } };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Change Launch Your Idea With Blast Off</h1>
        <p className="text-muted-foreground mb-8">Blast your website and application onto the top website listings and get featured immediately. Grow your userbase, get more visitors, get more customers.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Your Website URL</Label>
              <Input id="url" placeholder="https://your-site.com" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={() => setUrl((p) => normalizeUrl(p))} />
            </div>
            <div>
              <Label htmlFor="name">Product / Company Name</Label>
              <Input id="name" placeholder="Acme CRM" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="contact">Contact Name</Label>
                <Input id="contact" placeholder="Jane Founder" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password (used for platform sign-up)</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="role">Role / Title</Label>
                <Input id="role" placeholder="Founder" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+1 555 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="size">Company Size</Label>
                <Input id="size" placeholder="1-10" value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="logo">Logo (PNG/JPG)</Label>
              <div className="flex items-center gap-3">
                <input id="logo" type="file" accept="image/*" onChange={(e) => onLogoChange(e.target.files?.[0] || null)} />
                {logoPreview && <img src={logoPreview} alt="logo preview" className="h-10 w-10 rounded border object-contain bg-white" />}
                {logoDataUrl && <button className="text-xs px-2 py-1 rounded border" onClick={() => navigator.clipboard.writeText(logoDataUrl)}>Copy Logo Data URL</button>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="desc">Short Description</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    if (!url) { toast.error('Enter your URL first'); return; }
                    try {
                      setGenLoading(true);
                      const message = `Write a short description in very basic, simple, easy to understand, natural language for my ${url} I'll use for my G2, Crunchbase, Capterra, Product Hunt profile listing.`;
                      const res = await fetch(`${FN_BASE}/xai-chat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message, max_tokens: 180, temperature: 0.6 })
                      });
                      const data = await res.json();
                      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Generation failed');
                      const text = (data?.message?.content || '').trim();
                      if (text) setDescription(text);
                      toast.success('Description generated');
                    } catch (e: any) {
                      toast.error(e?.message || 'AI generation failed');
                    } finally { setGenLoading(false); }
                  }}
                  disabled={genLoading}
                >
                  {genLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate with Backlink ∞
                </Button>
              </div>
              <Textarea id="desc" rows={5} placeholder="What your product does, audience, differentiator" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="text-xs text-muted-foreground">
            Keep the runtime modal open while you work through each directory. Launch their forms manually when ready and use the prepared inputs below to complete the listings.
          </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => {
                if (!url || !productName || !email || !password) { toast.error("Please fill URL, Product Name, Email and Password"); return; }
                if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
                const nu = normalizeUrl(url);
                if (nu !== url) setUrl(nu);
                setGuidedOpen(true);
              }}>
                <Play className="w-4 h-4" /> Start
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border bg-white p-4">
              <h3 className="font-semibold mb-3">Selected Platforms</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {selectedConfig.map(({ key, cfg }) => (
                  <div key={key} className="flex items-center justify-between gap-2 rounded border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img src={cfg.icon} alt="" className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="text-sm">{cfg.label}</span>
                        <span className="text-[11px] text-muted-foreground">{formatSubmissionMode(cfg.submissionMode)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(cfg.formUrl).then(() => toast.success('Submission link copied')).catch(() => toast.error('Unable to copy link'))}
                        className="text-xs text-primary underline-offset-2 hover:underline"
                      >
                        Copy form link
                      </button>
                      {cfg.apiDocs ? (
                        <a href={cfg.apiDocs} target="_blank" rel="noreferrer" className="text-[11px] text-primary inline-flex items-center gap-1">
                          API docs <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Manual override</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <h3 className="font-semibold mb-3">Manual Selection</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setSelected((cur) => cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key])}
                    className={`px-2.5 py-1 rounded border text-xs ${selected.includes(key) ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-slate-50'}`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FastSubmissionWizard
          open={guidedOpen}
          onOpenChange={(o) => setGuidedOpen(o)}
          selectedKeys={selected}
          options={{
            url: normalizeUrl(url),
            productName,
            email,
            contactName,
            description,
            only: selected,
            signup: {
              password,
              role,
              phone,
              companySize,
              country,
              logo: logoDataUrl,
              logoFileName: logoFile?.name || "logo.png"
            }
          }}
          autoRun
          delayMs={10000}
        />

        <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); reset(); } }}>
          <DialogContent className="w-[98vw] max-w-[1100px] md:max-w-[1200px] lg:max-w-[1400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">HomeFast Runner</DialogTitle>
              <DialogDescription>
                We generate content and open each site’s official submission page. Complete any required sign‑up/sign‑in and paste the prepared content.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedConfig.map(({ key, cfg }) => {
                const st = platforms[key] || { status: "idle" };
                const statusColor = st.status === "completed" ? "text-green-600" : st.status === "error" ? "text-red-600" : st.status === "signup_required" ? "text-amber-600" : "text-slate-600";
                const progress = st.status === 'completed' ? 100 : st.status === 'ready' ? 80 : st.status === 'opening' ? 60 : st.status === 'signup_required' ? 40 : st.status === 'preparing' ? 20 : 0;
                return (
                  <div key={key} className="rounded-lg border p-3 bg-white/80 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={cfg.icon} alt="" className="w-4 h-4" />
                        <span className="font-medium">{cfg.label}</span>
                        <Badge variant="outline" className={statusColor}>{st.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Badge variant="outline">{formatSubmissionMode(cfg.submissionMode)}</Badge>
                        {cfg.apiDocs && (
                          <a href={cfg.apiDocs} target="_blank" rel="noreferrer" className="text-[11px] text-primary inline-flex items-center gap-1">
                            API docs <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <a href={st.link || cfg.formUrl} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1">
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                        {st.payload?.bookmarklet && (
                          <button
                            onClick={() => navigator.clipboard.writeText(st.payload.bookmarklet).then(() => toast.success('Autofill bookmarklet copied'))}
                            className="text-xs px-2 py-1 rounded border hover:bg-slate-50"
                          >
                            Copy Autofill
                          </button>
                        )}
                        {st.payload?.captchaHelper && (
                          <button
                            onClick={() => navigator.clipboard.writeText(st.payload.captchaHelper).then(() => toast.success('CAPTCHA endpoint copied'))}
                            className="text-xs px-2 py-1 rounded border hover:bg-slate-50"
                          >
                            Copy CAPTCHA Endpoint
                          </button>
                        )}
                        <button
                          onClick={() => markSubmitted(key)}
                          className="text-xs px-2 py-1 rounded border hover:bg-slate-50"
                        >
                          Mark Submitted
                        </button>
                        <button
                          onClick={() => resetPlatform(key)}
                          className="text-xs px-2 py-1 rounded border hover:bg-slate-50"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {st.message || cfg.help}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-slate-100 rounded h-2 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    {st.payload && (
                      <div className="mt-3 grid md:grid-cols-2 gap-2 text-xs bg-slate-50 border rounded p-2">
                        {Object.entries(st.payload).filter(([k]) => k !== 'bookmarklet').map(([k, v]) => (
                          <div key={k} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-slate-600">{k}</div>
                              <button onClick={() => navigator.clipboard.writeText(typeof v === 'string' ? v : JSON.stringify(v)).then(() => toast.success('Copied'))} className="text-[10px] px-1.5 py-0.5 rounded border">Copy</button>
                            </div>
                            <div className="whitespace-pre-wrap break-words">{typeof v === 'string' ? v : JSON.stringify(v, null, 2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                <Button onClick={() => {
                  const allDone = selected.every((k) => platforms[k]?.status === "completed" || platforms[k]?.status === "ready");
                  if (allDone) setOpen(false);
                  else toast("You can keep this open while submitting in tabs.");
                }}>
                  {running ? (<><Loader2 className="w-4 h-4 animate-spin" /> Running</>) : (<><CheckCircle2 className="w-4 h-4" /> Done</>)}
                </Button>
              </div>
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                Automated submission to third‑party sites is restricted by their policies, captchas and authentication. We safely accelerate your manual submission by preparing content and deep‑linking you to the correct forms.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
