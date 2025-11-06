import { useReferralTracking as useReferralTrackingHook } from '@/hooks/useAffiliate';
import { ReportSyncProvider } from '@/contexts/ReportSyncContext';
import { RouteSync } from '@/components/RouteSync';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PageLoadingFallback } from '@/utils/lazyPageLoader';

// Import critical components (needed for layout/auth/special handling)
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

// Lazy load only pages with special routing needs
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const EmailConfirmation = lazy(() => import('@/pages/EmailConfirmation'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const BlogPreview = lazy(async () => {
  const module = await import('@/pages/BlogPreview');
  return { default: module.BlogPreview };
});
const BlogPost = lazy(async () => {
  const module = await import('@/pages/BlogPost');
  return { default: module.BlogPost };
});
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
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const Automation = lazy(() => import('@/pages/Automation'));
const DomainsPage = lazy(() => import('@/pages/DomainsPage'));
const AffiliateProgram = lazy(() => import('@/pages/Affiliate'));
const KeywordResearch = lazy(() => import('@/pages/KeywordResearch'));

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
          {/* Auth Routes - Special handling */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/auth/confirm" element={<EmailConfirmation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<PasswordReset />} />

          {/* Blog Routes - Dynamic slug handling */}
          <Route path="/preview/:slug" element={<BlogPreview />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/:postId/edit" element={<EmailVerificationGuard><BlogEditPage /></EmailVerificationGuard>} />

          {/* Dashboard & Admin Routes - Auth guards required */}
          <Route path="/dashboard" element={<EnhancedDashboardRouter />} />
          <Route path="/my-dashboard" element={<EnhancedDashboardRouter />} />
          <Route path="/my-blog" element={<EmailVerificationGuard><UserBlogManagement /></EmailVerificationGuard>} />
          <Route path="/admin" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />

          {/* Protected Feature Routes */}
          <Route path="/automation" element={<EmailVerificationGuard><Automation /></EmailVerificationGuard>} />
          <Route path="/domains" element={<EmailVerificationGuard><DomainsPage /></EmailVerificationGuard>} />
          <Route path="/email" element={<EmailVerificationGuard><EmailMarketing /></EmailVerificationGuard>} />

          {/* Payment & Subscription Routes */}
          <Route path="/payment-success" element={<EmailVerificationGuard><PaymentSuccess /></EmailVerificationGuard>} />
          <Route path="/payment-cancelled" element={<EmailVerificationGuard><PaymentCancelled /></EmailVerificationGuard>} />
          <Route path="/subscription-success" element={<EmailVerificationGuard><SubscriptionSuccess /></EmailVerificationGuard>} />
          <Route path="/subscription-cancelled" element={<EmailVerificationGuard><SubscriptionCancelled /></EmailVerificationGuard>} />

          {/* Campaign & Report Routes - Dynamic params */}
          <Route path="/campaign/:campaignId" element={<EmailVerificationGuard><CampaignDeliverables /></EmailVerificationGuard>} />
          <Route path="/report" element={<BacklinkReport />} />
          <Route path="/report/:reportId" element={<ReportViewer />} />

          {/* Special Routes - Custom logic */}
          <Route path="/backlink-report" element={<BacklinkReport />} />
          <Route path="/automation-link-building" element={<EmailVerificationGuard><NoHandsSEO /></EmailVerificationGuard>} />
          <Route path="/affiliate" element={<EmailVerificationGuard><AffiliateProgram /></EmailVerificationGuard>} />
          <Route path="/affiliates" element={<AffiliateProgram />} />
          <Route path="/affiliate/promotion-materials" element={<EmailVerificationGuard><PromotionMaterials /></EmailVerificationGuard>} />
          <Route path="/trial-dashboard" element={<GuestDashboard />} />
          <Route path="/ai-live" element={<EnhancedAILive />} />
          <Route path="/keyword-research" element={<KeywordResearch />} />

          {/* Catch-All Route - Auto-discovers and routes to any page in /src/pages */}
          {/* Add new pages to /src/pages and they'll automatically be available without route changes */}
          <Route path="*" element={<DynamicPageLoader />} />
        </Routes>
      </Suspense>
    </ReportSyncProvider>
  );
};
