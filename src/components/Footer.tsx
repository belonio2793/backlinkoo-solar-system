import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";
import { FooterNavigationService, FOOTER_NAV_CONFIGS } from "@/utils/footerNavigation";
import { scrollToTop } from "@/utils/scrollToTop";
import { FeatureShowcaseModal } from "@/components/FeatureShowcaseModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PriceTicker } from '@/components/PriceTicker';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Twitter, Github, Mail, Linkedin } from 'lucide-react';

let _learnPrefetched = false;
export const Footer = () => {
  const prefetchLearn = () => {
    try {
      if (_learnPrefetched) return;
      _learnPrefetched = true;
      // Prefetch Learn page bundle when user shows interest
      void import(/* webpackPrefetch: true */ '../pages/Learn');
    } catch (e) { /* ignore */ }
  };
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<any>(null);
  const [pendingActionDescription, setPendingActionDescription] = useState<string>("");
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [initialFeature, setInitialFeature] = useState<"campaigns" | "automation" | "keyword_research" | "rank_tracker" | "community">("campaigns");
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [pbnOpen, setPbnOpen] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const footerLinkClass = 'text-sm font-normal text-muted-foreground';
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [authRedirectOnSuccess, setAuthRedirectOnSuccess] = useState(false);

  useEffect(() => {
    if (user && showLoginModal) {
      setShowLoginModal(false);
      setPendingNavigation(null);
      setPendingActionDescription("");
    }
  }, [user, showLoginModal]);

  const handleSmartNavigation = (config: any, actionDescription?: string) => {
    FooterNavigationService.handleNavigation({
      config,
      user,
      navigate,
      onAuthRequired: (pendingNav) => {
        setPendingNavigation(pendingNav);
        setPendingActionDescription(actionDescription || "this feature");
        setShowLoginModal(true);
      }
    });
  };

  const handleAuthSuccess = (authenticatedUser: any) => {
    setShowLoginModal(false);
    if (pendingNavigation) {
      FooterNavigationService.handleNavigation({
        config: { ...pendingNavigation, requiresAuth: false },
        user: authenticatedUser,
        navigate,
        onAuthRequired: () => {}
      });
      setPendingNavigation(null);
    } else if (authRedirectOnSuccess) {
      setAuthRedirectOnSuccess(false);
      navigate('/dashboard');
    }
  };

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const email = (newsletterEmail || '').trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    setAuthRedirectOnSuccess(true);
    setPendingNavigation(null);
    setPendingActionDescription('Create Account');
    setShowLoginModal(true);
  };

  return (
    <>
      <footer className="relative z-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand & description */}
            <div className="col-span-1 lg:col-span-2">
              <div onClick={() => { scrollToTop(); navigate('/'); }} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTop(); navigate('/'); } }} className="inline-flex items-center gap-3 mb-4" aria-label="Backlinkoo home">
                <div className="rounded-md bg-primary/10 p-2">
                  <span className="text-primary font-extrabold text-lg">∞</span>
                </div>
                <span className="text-lg font-semibold text-foreground">Backlink ∞</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">Backlink ∞ provides industry-leading link building and ranking tools for teams and agencies. Track, analyze, and acquire high‑quality backlinks with transparent reporting.</p>

              <div className="mt-6 flex items-center gap-3">
                <a href="https://twitter.com/backlinkoo" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={footerLinkClass}>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://github.com/backlinkoo" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={footerLinkClass}>
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:support@backlinkoo.com" aria-label="Email" className={footerLinkClass}>
                  <Mail className="h-5 w-5" />
                </a>
                <a href="https://t.me/backlinkoo" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={footerLinkClass}>
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

              <form onSubmit={handleSubscribe} className="mt-6 flex items-center gap-2 max-w-md">
                <Input
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="rounded-md"
                  aria-label="Enter your email to create an account"
                />
                <Button type="submit" className="whitespace-nowrap">
                  Sign up
                </Button>
              </form>
            </div>

            {/* Navigation columns */}
            <div className="grid grid-cols-2 gap-6 lg:col-span-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button onClick={() => { setInitialFeature('campaigns'); setFeatureModalOpen(true); }} className={footerLinkClass}>Campaign Management</button></li>
                  <li><button onClick={() => { setInitialFeature('automation'); setFeatureModalOpen(true); }} className={footerLinkClass}>Link Building Automation</button></li>
                  <li><Link to="/rank-tracker" className={footerLinkClass}>Rank Tracker</Link></li>
                  <li><Link to="/keyword-research" className={footerLinkClass}>Keyword Research</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/about" className={footerLinkClass}>About</Link></li>
                  <li><Link to="/learn" className={footerLinkClass}>Learn</Link></li>
                  <li><Link to="/contact" className={footerLinkClass}>Contact</Link></li>
                  <li><button onClick={() => setUpdatesOpen(true)} className={footerLinkClass}>Upcoming Updates</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/affiliates" className={footerLinkClass}>Affiliates</Link></li>
                  <li><Link to="/terms-of-service" className={footerLinkClass}>Terms</Link></li>
                  <li><Link to="/privacy-policy" className={footerLinkClass}>Privacy</Link></li>
                  <li><button onClick={() => handleSmartNavigation(FOOTER_NAV_CONFIGS.BACKLINK_REPORTS, 'Backlink Reports')} className={footerLinkClass}>Backlink Reports</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/help" className={footerLinkClass}>Help Center</Link></li>
                  <li><a href="https://discord.gg/Kb3zTpBvSE" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Discord</a></li>
                  <li><a href="https://t.me/backlinkoo" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Telegram</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Backlink ∞ — All rights reserved.</div>
            <div className="flex items-center gap-3">
              <button onClick={() => { scrollToTop(); }} className={footerLinkClass}>Back to top</button>
              <a href="/sitemap.xml" className={footerLinkClass}>Sitemap</a>
            </div>
          </div>

        </div>

        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen pt-8">
          <PriceTicker />
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setPendingNavigation(null);
            setPendingActionDescription("");
            setAuthRedirectOnSuccess(false);
          }}
          onAuthSuccess={handleAuthSuccess}
          defaultTab="signup"
          pendingAction={pendingActionDescription}
          prefillEmail={newsletterEmail}
        />

        <FeatureShowcaseModal
          open={featureModalOpen}
          initialFeature={initialFeature}
          onOpenChange={setFeatureModalOpen}
        />

        <Dialog open={updatesOpen} onOpenChange={setUpdatesOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Upcoming Updates</DialogTitle>
              <DialogDescription>Preview of features we’re rolling out next</DialogDescription>
            </DialogHeader>

            <ul className="space-y-4">
              <li className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-medium text-foreground">Real comment sections + contextual links</h4>
                <p className="mt-1 text-sm text-muted-foreground">All posts generated with our Link Building Automation may include a real comment section and a simulated environment with strategic contextual link placements with anchor text and designated URL targeting.</p>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-medium text-foreground">Marketplace</h4>
                <p className="mt-1 text-sm text-muted-foreground">Marketplace: Sellers can view and fulfill orders based on domain metric requirements; buyers can submit link campaign requests with quantity and minimum link metric requirements.</p>
              </li>
            </ul>

            <DialogFooter>
              <Button onClick={() => setUpdatesOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={pbnOpen} onOpenChange={setPbnOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>PBN Managers</DialogTitle>
              <DialogDescription>Utilize our private blog network builder software to onboard your domains and deliver contextual, in-content links at scale.</DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-5">
              <Alert>
                <AlertTitle>Professional Use</AlertTitle>
                <AlertDescription>
                  This is for professional search engine optimization providers and link-building specialists who own or manage domains to integrate with our hosting and content distribution network.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Add your domains to our managed hosting and content distribution network to build and operate your own private blog network. Our system streamlines scheduling, content generation, optimization, and publishing across your portfolio while preserving editorial quality and unique topical relevance.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Add domains and verify ownership, then enable automated content distribution.</li>
                  <li>Generate unique, context-rich articles with embedded anchors and target URLs.</li>
                  <li>SEO baked-in: schema, headings, internal linking suggestions, and clean HTML.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-medium text-foreground">Link Building Automation</h4>
                <p className="mt-1 text-sm text-muted-foreground">Launch campaigns that publish links instantly and report progress in real time. Multiple indexing pipelines work behind the scenes so your links are discovered and cached faster than typical DIY approaches.</p>
              </div>

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPbnOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </footer>
    </>
  );
};
