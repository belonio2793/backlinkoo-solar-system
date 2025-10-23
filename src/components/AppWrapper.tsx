import { useReferralTracking as useReferralTrackingHook } from '@/hooks/useAffiliate';
import { ReportSyncProvider } from '@/contexts/ReportSyncContext';
import { RouteSync } from '@/components/RouteSync';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import all page components
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import EmailConfirmation from '@/pages/EmailConfirmation';
import AuthCallback from '@/pages/AuthCallback';
import PasswordReset from '@/pages/PasswordReset';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import BlogPreview from '@/pages/BlogPreview';
import Blog from '@/pages/Blog';
import { BlogCreator } from '@/pages/BlogCreator';
    import { BlogPost } from '@/pages/BlogPost';
    import AIContentTest from '@/pages/AIContentTest';
    import TestBlogClaim from '@/pages/TestBlogClaim';

    import NotFound from '@/pages/NotFound';
    import AdminDashboard from '@/pages/AdminDashboard';
    import PaymentSuccess from '@/pages/PaymentSuccess';
    import PaymentCancelled from '@/pages/PaymentCancelled';
    import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
    import SubscriptionCancelled from '@/pages/SubscriptionCancelled';
    import { CampaignDeliverables } from '@/pages/CampaignDeliverables';
    import EmailMarketing from '@/pages/EmailMarketing';
    import BacklinkReport from '@/pages/BacklinkReport';
    import ReportViewer from '@/pages/ReportViewer';
    import NoHandsSEO from '@/pages/NoHandsSEO';
    import PromotionMaterials from '@/pages/PromotionMaterials';

    // Newly added public pages
    import Learn from '@/pages/Learn';
    import KeywordResearch from '@/pages/KeywordResearch';
    import RankTracker from '@/pages/RankTracker';
    import RankTrackerPremium from '@/pages/RankTrackerPremium';

    import Help from '@/pages/Help';
    import SystemStatus from '@/pages/System';
    import Orchids from '@/pages/Orchids';
    import Replyke from '@/pages/Replyke';
    import Plane from '@/pages/Plane';
    import Trupeer from '@/pages/Trupeer';
    import Traycer from '@/pages/Traycer';
    import SigmaMindAI from '@/pages/SigmaMindAI';
    import Celaro from '@/pages/Celaro';
    import InputLock from '@/pages/InputLock';
    import Meku from '@/pages/Meku';
    import OpenSaaS from '@/pages/OpenSaaS';
import Layercode from '@/pages/Layercode';
import Undoomed from '@/pages/Undoomed';
import Getillustrations from '@/pages/Getillustrations';
import ThumblifyAI from '@/pages/ThumblifyAI';

    import About from '@/pages/About';
import Claude from '@/pages/Claude';
import OpenStatus from '@/pages/OpenStatus';
import DaftMusic from '@/pages/DaftMusic';
import SupamailAI from '@/pages/SupamailAI';
import TinyFast from '@/pages/TinyFast';
import KiboUI from '@/pages/KiboUI';
import HeyGrid from '@/pages/HeyGrid';
import Rybbit from '@/pages/Rybbit';
import Nora from '@/pages/Nora';
import Scorecard from '@/pages/Scorecard';
import PrivateResumeBuilder from '@/pages/PrivateResumeBuilder';
import Monocle from '@/pages/Monocle';
import Genspark from '@/pages/Genspark';
import GensparkToObsidian from '@/pages/GensparkToObsidian';
import Zed from '@/pages/Zed';
import FileRenamerAI from '@/pages/FileRenamerAI';
import Any2K from '@/pages/Any2K';
import SignalStation from '@/pages/SignalStation';
import FlouState from '@/pages/FlouState';
import InterShipFlow from '@/pages/InterShipFlow';
import ParityDeals from '@/pages/ParityDeals';
import Redis from '@/pages/Redis';
import Lazy from '@/pages/Lazy';
import Dappier from '@/pages/Dappier';
import RelaceRepos from '@/pages/RelaceRepos';
import Basalt from '@/pages/Basalt';
import Apparency from '@/pages/Apparency';
import Basecamp from '@/pages/Basecamp';
import Emergent from '@/pages/Emergent';
import Flask from '@/pages/Flask';
import LambdaTest from '@/pages/LambdaTest';
import Waydev from '@/pages/Waydev';
import Supercut from '@/pages/Supercut';
import Cal from '@/pages/Cal';
import Aidy from '@/pages/Aidy';
import N8n from '@/pages/N8n';
import Loopple from '@/pages/Loopple';
import Buildrrr from '@/pages/Buildrrr';
import JustPaid from '@/pages/JustPaid';
import Mittalmar from '@/pages/Mittalmar';
import Intryc from '@/pages/Intryc';
import Blai from '@/pages/Blai';
import DadReply from '@/pages/DadReply';
import Androidify from '@/pages/Androidify';
// SEO pages
import DotTechDomains from '@/pages/DotTechDomains';
import SonuraStudio from '@/pages/SonuraStudio';
import Leadchee from '@/pages/Leadchee';
import ExtrovertReview from '@/pages/ExtrovertReview';
import FirstSignAiReview from '@/pages/FirstSignAiReview';
import PaltecaReview from '@/pages/PaltecaReview';
import GrapesStudio from '@/pages/GrapesStudio';
import TightStudio from '@/pages/TightStudio';
import NyraAIReview from '@/pages/NyraAIReview';
import TaskletReview from '@/pages/TaskletReview';
import TheBriefReview from '@/pages/TheBriefReview';
import ProhostAIReview from '@/pages/ProhostAIReview';
import PromptiusAI from '@/pages/PromptiusAI';
import Rately from '@/pages/Rately';
import Plural from '@/pages/Plural';
import GlueAIPage from '@/pages/GlueAI';
import Launchie from '@/pages/Launchie';
import Whistl from '@/pages/Whistl';
import Spottr from '@/pages/Spottr';
import EraseVideo from '@/pages/EraseVideo';
import Bloom from '@/pages/Bloom';
import AmpFree from '@/pages/AmpFree';
import Your360AI from '@/pages/Your360AI';
import BeatovenAI from '@/pages/BeatovenAI';
import Director from '@/pages/Director';
import FreshlySqueezed from '@/pages/FreshlySqueezed';
import HandsOff from '@/pages/HandsOff';
import RoosterMeReview from '@/pages/RoosterMeReview';
import PitchLab from '@/pages/PitchLab';
import ProximityLockSystem from '@/pages/ProximityLockSystem';

    // Import components (not pages)
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
    // removed missing CheckoutTest page
    import PageOnePower from '@/pages/PageOnePower';
    import AffiliateProgram from '@/pages/Affiliate';
import Contact from '@/pages/Contact';
import DebugRoute from '@/pages/DebugRoute';
import DynamicPageLoader from '@/components/DynamicPageLoader';

    // Newly added protected pages
    import Automation from '@/pages/Automation';
    import DomainsPage from '@/pages/DomainsPage';

    export const AppWrapper = () => {
  useReferralTrackingHook();

  // Hide floating Ask Backlink AI on the home page, keep it accessible from the menu
  // Always hide the floating trigger; assistant is accessible via the header menu only
  useLocation();

  return (
    <ReportSyncProvider>
      <RouteSync />
      <TrialNotificationBanner />
      <ScrollToTop />
      <TrendingKeywordsSidebar variant="floating" hideFloatingTrigger={true} />
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
            {/* CheckoutTest route removed: page not present */}

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
            <Route path="/the-brief-review" element={<TheBriefReview />} />
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
        <Route path="/my-blog" element={
          <EmailVerificationGuard>
            <UserBlogManagement />
          </EmailVerificationGuard>
        } />
        <Route path="/blog/:postId/edit" element={
          <EmailVerificationGuard>
            <BlogEditPage />
          </EmailVerificationGuard>
        } />

        <Route path="/admin" element={
          <AdminAuthGuard>
            <AdminDashboard />
          </AdminAuthGuard>
        } />
        {/* Protected app areas */}
        <Route path="/automation" element={
          <EmailVerificationGuard>
            <Automation />
          </EmailVerificationGuard>
        } />
        <Route path="/domains" element={
          <EmailVerificationGuard>
            <DomainsPage />
          </EmailVerificationGuard>
        } />
        <Route path="/payment-success" element={
          <EmailVerificationGuard>
            <PaymentSuccess />
          </EmailVerificationGuard>
        } />
        <Route path="/payment-cancelled" element={
          <EmailVerificationGuard>
            <PaymentCancelled />
          </EmailVerificationGuard>
        } />
        <Route path="/subscription-success" element={
          <EmailVerificationGuard>
            <SubscriptionSuccess />
          </EmailVerificationGuard>
        } />
        <Route path="/subscription-cancelled" element={
          <EmailVerificationGuard>
            <SubscriptionCancelled />
          </EmailVerificationGuard>
        } />
        <Route path="/campaign/:campaignId" element={
          <EmailVerificationGuard>
            <CampaignDeliverables />
          </EmailVerificationGuard>
        } />
        <Route path="/email" element={
          <EmailVerificationGuard>
            <EmailMarketing />
          </EmailVerificationGuard>
        } />
        <Route path="/backlink-report" element={<BacklinkReport />} />
        <Route path="/report" element={<BacklinkReport />} />
        <Route path="/report/:reportId" element={<ReportViewer />} />
        <Route path="/automation-link-building" element={
          <EmailVerificationGuard>
            <NoHandsSEO />
          </EmailVerificationGuard>
        } />
        <Route path="/affiliate" element={
          <EmailVerificationGuard>
            <AffiliateProgram />
          </EmailVerificationGuard>
        } />
        <Route path="/affiliates" element={<AffiliateProgram />} />
        <Route path="/affiliate/promotion-materials" element={
          <EmailVerificationGuard>
            <PromotionMaterials />
          </EmailVerificationGuard>
        } />
      </Routes>
    </ReportSyncProvider>
  );
};
