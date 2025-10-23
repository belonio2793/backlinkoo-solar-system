import React, { useMemo, useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, ArrowLeft, ArrowRight, CheckCircle2, Copy, Link as LinkIcon, FileInput, Shield } from "lucide-react";
import { toast } from "sonner";
import { PLATFORM_CONFIG, preparePlatform, getPlatformFieldMap } from "@/services/homefast";

type HomeFastOptions = {
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
};

interface FastSubmissionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeys: string[];
  options: HomeFastOptions;
}

export default function FastSubmissionWizard({ open, onOpenChange, selectedKeys, options, autoRun = false, delayMs = 10000 }: FastSubmissionWizardProps & { autoRun?: boolean; delayMs?: number; }) {
  const items = useMemo(() => selectedKeys.map((key) => ({ key, cfg: PLATFORM_CONFIG[key] })), [selectedKeys]);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const windowRef = useRef<Window | null>(null);
  const stepRunRef = useRef<Record<number, boolean>>({});
  const timersRef = useRef<number[]>([]);

  const currentKey = items[index]?.key;
  const current = useMemo(() => (currentKey ? preparePlatform(currentKey, options) : null), [currentKey, options]);
  const fieldMap = useMemo(() => (currentKey ? getPlatformFieldMap(currentKey) : {} as Record<string, string[]>), [currentKey]);
  const total = items.length || 1;
  const progress = Math.round(((index + (completed[currentKey] ? 1 : 0)) / total) * 100);

  const copy = (val: string) => navigator.clipboard.writeText(val).then(() => toast.success("Copied"));

  const goNext = () => {
    if (index < items.length - 1) setIndex(index + 1);
    else onOpenChange(false);
  };
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  const markSubmitted = () => {
    if (currentKey) setCompleted((c) => ({ ...c, [currentKey]: true }));
    toast.success("Marked submitted");
  };

  useEffect(() => {
    if (!open) return;
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, [open, index]);

  useEffect(() => {
    if (!open || !autoRun || !current) return;
    if (stepRunRef.current[index]) return;
    stepRunRef.current[index] = true;

    try {
      const targetUrl = current.link;
      if (!windowRef.current || windowRef.current.closed) {
        windowRef.current = window.open(targetUrl, '_blank');
      } else {
        try { windowRef.current.location.href = targetUrl; } catch {}
      }
      const t1 = window.setTimeout(() => {
        try {
          if (windowRef.current && current.payload?.bookmarklet) {
            windowRef.current.location.href = current.payload.bookmarklet as unknown as string;
          }
        } catch {}
      }, 2000);
      timersRef.current.push(t1);

      const t2 = window.setTimeout(() => {
        markSubmitted();
        goNext();
      }, Math.max(2000, delayMs));
      timersRef.current.push(t2);
    } catch {}
  }, [open, autoRun, index, current, delayMs]);

  const valueForKey = (k: string): string => {
    const p = current?.payload || {} as any;
    switch (k) {
      case 'url': return p.url || '';
      case 'name': return p.productName || '';
      case 'email': return p.email || '';
      case 'contact': return p.contactName || '';
      case 'tagline': return p.tagline || '';
      case 'summary':
      case 'description': return p.summary || '';
      case 'password':
      case 'confirmPassword': return (p.signup && p.signup.password) || '';
      case 'phone': return (p.signup && p.signup.phone) || '';
      case 'companySize': return (p.signup && p.signup.companySize) || '';
      case 'country': return (p.signup && p.signup.country) || '';
      case 'role':
      case 'title': return (p.signup && p.signup.role) || '';
      default:
        if (typeof p[k] === 'string') return p[k];
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1100px] md:max-w-[1200px] lg:max-w-[1400px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Guided Submission
            {current?.cfg?.label && (
              <span className="inline-flex items-center gap-2 text-sm font-normal">
                <img src={current?.cfg?.icon} alt="" className="w-4 h-4" />
                {current?.cfg?.label}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            One platform at a time with clear field mapping. Manual inserts where APIs are unavailable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">Progress</div>
              <div className="text-sm text-slate-600">{index + 1} / {total}</div>
            </div>
            <Progress value={progress} />
          </div>

          {current && (
            <div className="rounded border bg-white p-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{current.cfg?.label}</Badge>
                  <Badge variant="outline">
                    {current.cfg?.submissionMode === 'api' ? 'API' : current.cfg?.submissionMode === 'hybrid' ? 'API + manual' : 'Manual override'}
                  </Badge>
                  {current.cfg?.apiDocs && (
                    <a href={current.cfg.apiDocs} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1">
                      API docs <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={current.link} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded border inline-flex items-center gap-1 hover:bg-slate-50">
                    <LinkIcon className="w-3 h-3" /> Open Form
                  </a>
                  {current.payload?.bookmarklet && (
                    <button onClick={() => copy(current.payload.bookmarklet)} className="text-xs px-2 py-1 rounded border inline-flex items-center gap-1 hover:bg-slate-50">
                      <FileInput className="w-3 h-3" /> Copy Autofill
                    </button>
                  )}
                  {current.payload?.captchaHelper && (
                    <button onClick={() => copy(current.payload.captchaHelper)} className="text-xs px-2 py-1 rounded border inline-flex items-center gap-1 hover:bg-slate-50">
                      <Shield className="w-3 h-3" /> CAPTCHA Endpoint
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-700">
                {current.cfg?.help || current.guidance}
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2 bg-slate-50 border rounded p-2 text-xs">
                {Object.entries(fieldMap).map(([k, terms]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-600">{k}</div>
                      <button onClick={() => copy(valueForKey(k))} className="text-[10px] px-1.5 py-0.5 rounded border inline-flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy value
                      </button>
                    </div>
                    <div className="text-slate-500">{(terms as string[]).join(', ')}</div>
                    <div className="whitespace-pre-wrap break-words bg-white border rounded p-2">{valueForKey(k)}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2">
                {!completed[currentKey || ""] && (
                  <Button variant="outline" onClick={markSubmitted} className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Mark Submitted
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={goPrev} disabled={index === 0} className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            <Button onClick={goNext} className="inline-flex items-center gap-2" disabled={!currentKey || (!completed[currentKey] && current?.cfg?.submissionMode !== 'api') }>
              <ArrowRight className="w-4 h-4" /> {index === items.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
