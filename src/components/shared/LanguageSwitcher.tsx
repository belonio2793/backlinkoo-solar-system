import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "zh-CN", label: "中文", short: "中文" },
  { code: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "ar", label: "العربية", short: "AR" },
  { code: "bn", label: "বাংলা", short: "BN" },
  { code: "pt", label: "Português", short: "PT" },
  { code: "ur", label: "اردو", short: "UR" }
] as const;

type LanguageCode = (typeof LANGS)[number]["code"];

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  const path = "; path=/";
  document.cookie = name + "=" + value + expires + path;
  const hostParts = window.location.hostname.split(".");
  if (hostParts.length > 1) {
    const rootDomain = "." + hostParts.slice(-2).join(".");
    document.cookie = name + "=" + value + expires + path + "; domain=" + rootDomain;
  }
}

function deleteCookie(name: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const past = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const path = "; path=/";
  document.cookie = name + "=" + past + path;
  const hostParts = window.location.hostname.split(".");
  if (hostParts.length > 1) {
    const rootDomain = "." + hostParts.slice(-2).join(".");
    document.cookie = name + "=" + past + path + "; domain=" + rootDomain;
  }
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getActiveLangFromCookie(): LanguageCode {
  const value = getCookie("googtrans");
  if (!value) return "en";
  const parts = value.split("/").filter(Boolean);
  const lang = (parts[1] || parts[0]) as LanguageCode | undefined;
  return lang || "en";
}

function loadGoogleTranslateOnce() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__googleTranslateLoaded) return;
  (window as any).__googleTranslateLoaded = true;
  (window as any).googleTranslateElementInit = function googleTranslateElementInit() {
    try {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGS.map((lang) => lang.code)
            .filter((code) => code !== "en")
            .join(","),
          autoDisplay: false,
          layout: 0
        },
        "google_translate_element"
      );
    } catch (error) {
      console.warn("Google Translate init failed", error);
    }
  };
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export function LanguageSwitcher() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const initializingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [active, setActive] = useState<LanguageCode>(() =>
    typeof document === "undefined" ? "en" : getActiveLangFromCookie()
  );

  useEffect(() => {
    loadGoogleTranslateOnce();
    if (typeof document === "undefined") return;
    if (!document.getElementById("google_translate_element")) {
      const el = document.createElement("div");
      el.id = "google_translate_element";
      el.style.position = "fixed";
      el.style.visibility = "hidden";
      el.style.height = "0";
      el.style.width = "0";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = window.setInterval(() => {
      const current = getActiveLangFromCookie();
      setActive((prev) => (prev !== current ? current : prev));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const updatePosition = () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const width = 240; // w-60
      const left = Math.min(Math.max(8, rect.right - width), (window.innerWidth - width - 8));
      const top = rect.bottom + 8; // position below the button (south)
      setMenuPos({ top, left });
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const applyViaCombo = useCallback((lang: LanguageCode) => {
    if (typeof document === "undefined") return false;
    const combo: HTMLSelectElement | null = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      return true;
    }
    return false;
  }, []);

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      const resetFlag = () => {
        initializingRef.current = false;
      };

      if (lang === "en") {
        deleteCookie("googtrans");
        setActive("en");
        setTimeout(() => {
          resetFlag();
          window.location.reload();
        }, 50);
        return;
      }

      const applied = applyViaCombo(lang);
      if (!applied) {
        setCookie("googtrans", `/en/${lang}`);
        setCookie("googtrans", `/auto/${lang}`);
        setActive(lang);
        setTimeout(() => {
          resetFlag();
          window.location.reload();
        }, 80);
      } else {
        setActive(lang);
        setTimeout(resetFlag, 300);
      }
    },
    [applyViaCombo]
  );

  const items = useMemo(() => LANGS, []);
  const activeLang = useMemo(
    () => items.find((item) => item.code === active) || items[0],
    [items, active]
  );

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex items-baseline gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="font-semibold leading-none">{activeLang?.short}</span>
        <span className="hidden sm:inline text-xs text-muted-foreground leading-none">{activeLang?.label}</span>
        <ChevronDown
          className={`h-4 w-4 self-center ml-1 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 2147483647 }}
          className="z-[9999] w-60 origin-top-right rounded-md border border-border bg-popover shadow-lg"
        >
          <div className="max-h-[60vh] overflow-auto p-1">
            {items.map((lang) => {
              const isActive = lang.code === active;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setLanguage(lang.code);
                  }}
                  aria-selected={isActive}
                  role="option"
                >
                  <span className="truncate">{lang.label}</span>
                  <span className="text-xs text-muted-foreground">{lang.short}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default LanguageSwitcher;
