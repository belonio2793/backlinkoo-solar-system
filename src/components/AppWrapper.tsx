import { useReferralTracking as useReferralTrackingHook } from '@/hooks/useAffiliate';
import { ReportSyncProvider } from '@/contexts/ReportSyncContext';
import { RouteSync } from '@/components/RouteSync';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PageLoadingFallback } from '@/utils/lazyPageLoader';

// Import critical components (needed for layout/auth)
import AdminAuthGuard from '@/components/AdminAuthGuard';
import ScrollToTop from '@/components/ScrollToTop';
import { EmailVerificationGuard } from '@/components/EmailVerificationGuard';
import { TrialNotificationBanner } from '@/components/TrialNotificationBanner';
import { GuestDashboard } from '@/components/GuestDashboard';
import { EnhancedAILive } from '@/components/EnhancedAILive';
import TrendingKeywordsSidebar from '@/components/TrendingKeywordsSidebar';
import { EnhancedDashboardRouter } from '@/components/EnhancedDashboardRouter';
import { UserBlogManagement } from '@/components/UserBlogManagement';
import { BlogEditPage } from '@/pages/BlogEditPage';
import DynamicPageLoader from '@/components/DynamicPageLoader';

// Lazy load all page components to reduce initial bundle
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const EmailConfirmation = lazy(() => import('@/pages/EmailConfirmation'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const BlogPreview = lazy(() => import('@/pages/BlogPreview'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogCreator = lazy(() => import('@/pages/BlogCreator'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const AIContentTest = lazy(() => import('@/pages/AIContentTest'));
const TestBlogClaim = lazy(() => import('@/pages/TestBlogClaim'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const PaymentCancelled = lazy(() => import('@/pages/PaymentCancelled'));
const SubscriptionSuccess = lazy(() => import('@/pages/SubscriptionSuccess'));
const SubscriptionCancelled = lazy(() => import('@/pages/SubscriptionCancelled'));
const CampaignDeliverables = lazy(async () => {
  const module = await import('@/pages/CampaignDeliverables');
  return { default: module.CampaignDeliverables };
});
const EmailMarketing = lazy(() => import('@/pages/EmailMarketing'));
const BacklinkReport = lazy(() => import('@/pages/BacklinkReport'));
const ReportViewer = lazy(() => import('@/pages/ReportViewer'));
const NoHandsSEO = lazy(() => import('@/pages/NoHandsSEO'));
const PromotionMaterials = lazy(() => import('@/pages/PromotionMaterials'));
const Learn = lazy(() => import('@/pages/Learn'));
const KeywordResearch = lazy(() => import('@/pages/KeywordResearch'));
const RankTracker = lazy(() => import('@/pages/RankTracker'));
const RankTrackerPremium = lazy(() => import('@/pages/RankTrackerPremium'));
const Help = lazy(() => import('@/pages/Help'));
const SystemStatus = lazy(() => import('@/pages/System'));
const Orchids = lazy(() => import('@/pages/Orchids'));
const Replyke = lazy(() => import('@/pages/Replyke'));
const Plane = lazy(() => import('@/pages/Plane'));
const Trupeer = lazy(() => import('@/pages/Trupeer'));
const Traycer = lazy(() => import('@/pages/Traycer'));
const SigmaMindAI = lazy(() => import('@/pages/SigmaMindAI'));
const Celaro = lazy(() => import('@/pages/Celaro'));
const InputLock = lazy(() => import('@/pages/InputLock'));
const Meku = lazy(() => import('@/pages/Meku'));
const OpenSaaS = lazy(() => import('@/pages/OpenSaaS'));
const Layercode = lazy(() => import('@/pages/Layercode'));
const Undoomed = lazy(() => import('@/pages/Undoomed'));
const Getillustrations = lazy(() => import('@/pages/Getillustrations'));
const ThumblifyAI = lazy(() => import('@/pages/ThumblifyAI'));
const About = lazy(() => import('@/pages/About'));
const Claude = lazy(() => import('@/pages/Claude'));
const OpenStatus = lazy(() => import('@/pages/OpenStatus'));
const DaftMusic = lazy(() => import('@/pages/DaftMusic'));
const SupamailAI = lazy(() => import('@/pages/SupamailAI'));
const TinyFast = lazy(() => import('@/pages/TinyFast'));
const KiboUI = lazy(() => import('@/pages/KiboUI'));
const HeyGrid = lazy(() => import('@/pages/HeyGrid'));
const Rybbit = lazy(() => import('@/pages/Rybbit'));
const Nora = lazy(() => import('@/pages/Nora'));
const Scorecard = lazy(() => import('@/pages/Scorecard'));
const PrivateResumeBuilder = lazy(() => import('@/pages/PrivateResumeBuilder'));
const Monocle = lazy(() => import('@/pages/Monocle'));
const Genspark = lazy(() => import('@/pages/Genspark'));
const GensparkToObsidian = lazy(() => import('@/pages/GensparkToObsidian'));
const Zed = lazy(() => import('@/pages/Zed'));
const FileRenamerAI = lazy(() => import('@/pages/FileRenamerAI'));
const Any2K = lazy(() => import('@/pages/Any2K'));
const SignalStation = lazy(() => import('@/pages/SignalStation'));
const FlouState = lazy(() => import('@/pages/FlouState'));
const InterShipFlow = lazy(() => import('@/pages/InterShipFlow'));
const ParityDeals = lazy(() => import('@/pages/ParityDeals'));
const Redis = lazy(() => import('@/pages/Redis'));
const Lazy = lazy(() => import('@/pages/Lazy'));
const Dappier = lazy(() => import('@/pages/Dappier'));
const RelaceRepos = lazy(() => import('@/pages/RelaceRepos'));
const Basalt = lazy(() => import('@/pages/Basalt'));
const Apparency = lazy(() => import('@/pages/Apparency'));
const Basecamp = lazy(() => import('@/pages/Basecamp'));
const Emergent = lazy(() => import('@/pages/Emergent'));
const Flask = lazy(() => import('@/pages/Flask'));
const LambdaTest = lazy(() => import('@/pages/LambdaTest'));
const Waydev = lazy(() => import('@/pages/Waydev'));
const Supercut = lazy(() => import('@/pages/Supercut'));
const Cal = lazy(() => import('@/pages/Cal'));
const Aidy = lazy(() => import('@/pages/Aidy'));
const N8n = lazy(() => import('@/pages/N8n'));
const Loopple = lazy(() => import('@/pages/Loopple'));
const Buildrrr = lazy(() => import('@/pages/Buildrrr'));
const JustPaid = lazy(() => import('@/pages/JustPaid'));
const Mittalmar = lazy(() => import('@/pages/Mittalmar'));
const Intryc = lazy(() => import('@/pages/Intryc'));
const Blai = lazy(() => import('@/pages/Blai'));
const DadReply = lazy(() => import('@/pages/DadReply'));
const Androidify = lazy(() => import('@/pages/Androidify'));
const DotTechDomains = lazy(() => import('@/pages/DotTechDomains'));
const SonuraStudio = lazy(() => import('@/pages/SonuraStudio'));
const Leadchee = lazy(() => import('@/pages/Leadchee'));
const ExtrovertReview = lazy(() => import('@/pages/ExtrovertReview'));
const FirstSignAiReview = lazy(() => import('@/pages/FirstSignAiReview'));
const PaltecaReview = lazy(() => import('@/pages/PaltecaReview'));
const GrapesStudio = lazy(() => import('@/pages/GrapesStudio'));
const TightStudio = lazy(() => import('@/pages/TightStudio'));
const NyraAIReview = lazy(() => import('@/pages/NyraAIReview'));
const TaskletReview = lazy(() => import('@/pages/TaskletReview'));
const TheBriefReview = lazy(() => import('@/pages/TheBriefReview'));
const ProhostAIReview = lazy(() => import('@/pages/ProhostAIReview'));
const PromptiusAI = lazy(() => import('@/pages/PromptiusAI'));
const Rately = lazy(() => import('@/pages/Rately'));
const Plural = lazy(() => import('@/pages/Plural'));
const GlueAIPage = lazy(() => import('@/pages/GlueAI'));
const Launchie = lazy(() => import('@/pages/Launchie'));
const Whistl = lazy(() => import('@/pages/Whistl'));
const Spottr = lazy(() => import('@/pages/Spottr'));
const EraseVideo = lazy(() => import('@/pages/EraseVideo'));
const Bloom = lazy(() => import('@/pages/Bloom'));
const AmpFree = lazy(() => import('@/pages/AmpFree'));
const Your360AI = lazy(() => import('@/pages/Your360AI'));
const BeatovenAI = lazy(() => import('@/pages/BeatovenAI'));
const Director = lazy(() => import('@/pages/Director'));
const FreshlySqueezed = lazy(() => import('@/pages/FreshlySqueezed'));
const HandsOff = lazy(() => import('@/pages/HandsOff'));
const RoosterMeReview = lazy(() => import('@/pages/RoosterMeReview'));
const PitchLab = lazy(() => import('@/pages/PitchLab'));
const ProximityLockSystem = lazy(() => import('@/pages/ProximityLockSystem'));
const Contact = lazy(() => import('@/pages/Contact'));
const DebugRoute = lazy(() => import('@/pages/DebugRoute'));
const PageOnePower = lazy(() => import('@/pages/PageOnePower'));
const AffiliateProgram = lazy(() => import('@/pages/Affiliate'));
const Automation = lazy(() => import('@/pages/Automation'));
const DomainsPage = lazy(() => import('@/pages/DomainsPage'));

export const AppWrapper = () => {
  useReferralTrackingHook();
  useLocation();

  return (
    <ReportSyncProvider>
      <RouteSync />
      <TrialNotificationBanner />
      <ScrollToTop />
      <TrendingKeywordsSidebar variant="floating" hideFloatingTrigger={true} />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/auth/confirm" element={<EmailConfirmation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<PasswordReset />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/preview/:slug" element={<BlogPreview />} />
          <Route path="/pageonepower" element={<PageOnePower />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/create" element={<BlogCreator />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/trial-dashboard" element={<GuestDashboard />} />
          <Route path="/ai-test" element={<AIContentTest />} />
          <Route path="/test-blog-claim" element={<TestBlogClaim />} />
          <Route path="/ai-live" element={<EnhancedAILive />} />

          {/* Public product pages */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/keyword-research" element={<KeywordResearch />} />
          <Route path="/rank-tracker" element={<RankTracker />} />
          <Route path="/rank-tracker/premium" element={<RankTrackerPremium />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/claude" element={<Claude />} />
          <Route path="/openstatus" element={<OpenStatus />} />
          <Route path="/daftmusic" element={<DaftMusic />} />
          <Route path="/techdomains" element={<DotTechDomains />} />
          <Route path="/supamail-ai" element={<SupamailAI />} />
          <Route path="/tinyfast" element={<TinyFast />} />
          <Route path="/kiboui" element={<KiboUI />} />
          <Route path="/heygrid" element={<HeyGrid />} />
          <Route path="/rybbit" element={<Rybbit />} />
          <Route path="/nora" element={<Nora />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/privateresumebuilder" element={<PrivateResumeBuilder />} />
          <Route path="/monocle-macos" element={<Monocle />} />
          <Route path="/genspark" element={<Genspark />} />
          <Route path="/genspark-to-obsidian" element={<GensparkToObsidian />} />
          <Route path="/zed" element={<Zed />} />
          <Route path="/filerenamerai" element={<FileRenamerAI />} />
          <Route path="/any2k" element={<Any2K />} />
          <Route path="/signalstation" element={<SignalStation />} />
          <Route path="/floustate" element={<FlouState />} />
          <Route path="/intershipflow" element={<InterShipFlow />} />
          <Route path="/paritydeals" element={<ParityDeals />} />
          <Route path="/relacerepos" element={<RelaceRepos />} />
          <Route path="/redis" element={<Redis />} />
          <Route path="/lazy" element={<Lazy />} />
          <Route path="/dappier" element={<Dappier />} />
          <Route path="/basalt" element={<Basalt />} />
          <Route path="/apparency" element={<Apparency />} />
          <Route path="/basecamp" element={<Basecamp />} />
          <Route path="/emergent" element={<Emergent />} />
          <Route path="/flask" element={<Flask />} />
          <Route path="/lambdatest" element={<LambdaTest />} />
          <Route path="/waydev" element={<Waydev />} />
          <Route path="/supercut" element={<Supercut />} />
          <Route path="/cal" element={<Cal />} />
          <Route path="/aidy" element={<Aidy />} />
          <Route path="/n8n" element={<N8n />} />
          <Route path="/loopple" element={<Loopple />} />
          <Route path="/buildrrr" element={<Buildrrr />} />
          <Route path="/justpaid" element={<JustPaid />} />
          <Route path="/mittalmar" element={<Mittalmar />} />
          <Route path="/help" element={<Help />} />
          <Route path="/system" element={<SystemStatus />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/orchids" element={<Orchids />} />
          <Route path="/replyke" element={<Replyke />} />
          <Route path="/plane" element={<Plane />} />
          <Route path="/trupeer" element={<Trupeer />} />
          <Route path="/traycer" element={<Traycer />} />
          <Route path="/sigmamind-ai" element={<SigmaMindAI />} />
          <Route path="/celaro" element={<Celaro />} />
          <Route path="/input-lock" element={<InputLock />} />
          <Route path="/meku" element={<Meku />} />
          <Route path="/open-saas" element={<OpenSaaS />} />
          <Route path="/layercode" element={<Layercode />} />
          <Route path="/undoomed" element={<Undoomed />} />
          <Route path="/getillustrations" element={<Getillustrations />} />
          <Route path="/thumblify-ai" element={<ThumblifyAI />} />
          <Route path="/intryc" element={<Intryc />} />
          <Route path="/blai" element={<Blai />} />
          <Route path="/dadreply" element={<DadReply />} />
          <Route path="/androidify" element={<Androidify />} />
          <Route path="/_debug/location" element={<DebugRoute />} />
          <Route path="/sonurostudio" element={<SonuraStudio />} />
          <Route path="/leadchee" element={<Leadchee />} />
          <Route path="/grapesstudioai" element={<GrapesStudio />} />
          <Route path="/tightstudio" element={<TightStudio />} />
          <Route path="/nyra-ai-review" element={<NyraAIReview />} />
          <Route path="/tasklet-review" element={<TaskletReview />} />
          <Route path="/the-brief-review" element={<TheBriefReview />} />
          <Route path="/prohost-ai-review" element={<ProhostAIReview />} />
          <Route path="/prohostai-review" element={<ProhostAIReview />} />
          <Route path="/thebriefreview" element={<TheBriefReview />} />
          <Route path="/promptius-ai" element={<PromptiusAI />} />
          <Route path="/promptiusai" element={<PromptiusAI />} />
          <Route path="/glue-ai" element={<GlueAIPage />} />
          <Route path="/glueai" element={<GlueAIPage />} />
          <Route path="/rately" element={<Rately />} />
          <Route path="/plural" element={<Plural />} />
          <Route path="/launchie" element={<Launchie />} />
          <Route path="/whistl" element={<Whistl />} />
          <Route path="/spottr" element={<Spottr />} />
          <Route path="/erasevideo" element={<EraseVideo />} />
          <Route path="/bloom" element={<Bloom />} />
          <Route path="/ampfree" element={<AmpFree />} />
          <Route path="/your360ai" element={<Your360AI />} />
          <Route path="/beatovenai" element={<BeatovenAI />} />
          <Route path="/director" element={<Director />} />
          <Route path="/pitchlab" element={<PitchLab />} />
          <Route path="/proximitylocksystem" element={<ProximityLockSystem />} />
          <Route path="/extrovertreview" element={<ExtrovertReview />} />
          <Route path="/firstsignaireview" element={<FirstSignAiReview />} />
          <Route path="/palteca" element={<PaltecaReview />} />
          <Route path="/freshly-squeezed" element={<FreshlySqueezed />} />
          <Route path="/hands-off" element={<HandsOff />} />
          <Route path="/roosterme-review" element={<RoosterMeReview />} />
          <Route path="*" element={<DynamicPageLoader />} />

          {/* Protected routes - require authentication and email verification */}
          <Route path="/dashboard" element={<EnhancedDashboardRouter />} />
          <Route path="/my-dashboard" element={<EnhancedDashboardRouter />} />
          <Route
            path="/my-blog"
            element={
              <EmailVerificationGuard>
                <UserBlogManagement />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/blog/:postId/edit"
            element={
              <EmailVerificationGuard>
                <BlogEditPage />
              </EmailVerificationGuard>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminDashboard />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/automation"
            element={
              <EmailVerificationGuard>
                <Automation />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/domains"
            element={
              <EmailVerificationGuard>
                <DomainsPage />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/payment-success"
            element={
              <EmailVerificationGuard>
                <PaymentSuccess />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/payment-cancelled"
            element={
              <EmailVerificationGuard>
                <PaymentCancelled />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/subscription-success"
            element={
              <EmailVerificationGuard>
                <SubscriptionSuccess />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/subscription-cancelled"
            element={
              <EmailVerificationGuard>
                <SubscriptionCancelled />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/campaign/:campaignId"
            element={
              <EmailVerificationGuard>
                <CampaignDeliverables />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/email"
            element={
              <EmailVerificationGuard>
                <EmailMarketing />
              </EmailVerificationGuard>
            }
          />
          <Route path="/backlink-report" element={<BacklinkReport />} />
          <Route path="/report" element={<BacklinkReport />} />
          <Route path="/report/:reportId" element={<ReportViewer />} />
          <Route
            path="/automation-link-building"
            element={
              <EmailVerificationGuard>
                <NoHandsSEO />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/affiliate"
            element={
              <EmailVerificationGuard>
                <AffiliateProgram />
              </EmailVerificationGuard>
            }
          />
          <Route path="/affiliates" element={<AffiliateProgram />} />
          <Route
            path="/affiliate/promotion-materials"
            element={
              <EmailVerificationGuard>
                <PromotionMaterials />
              </EmailVerificationGuard>
            }
          />
        </Routes>
      </Suspense>
    </ReportSyncProvider>
  );
};
