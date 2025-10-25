import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAdminMetrics } from "@/hooks/useEnhancedAdminMetrics";
import { AdminNavigationHeader } from "@/components/admin/AdminNavigationHeader";
import { supabase } from '@/integrations/supabase/client';

// Direct imports - no lazy loading to avoid chunk.js
import { EnhancedAdminOverview } from '@/components/admin/EnhancedAdminOverview';
import ComprehensiveUserManagement from '@/components/admin/ComprehensiveUserManagement';
import AdminCampaignsManagement from '@/components/admin/AdminCampaignsManagement';
import { EmailSystemManagerSafe } from '@/components/admin/EmailSystemManagerSafe';
import { SMTPConfigTest } from '@/components/SMTPConfigTest';
import EmailConfigurationTester from '@/components/EmailConfigurationTester';
import { AuthEmailTest } from '@/components/AuthEmailTest';
import { EmailTest } from '@/components/EmailTest';
import { SupabaseEmailTest } from '@/components/SupabaseEmailTest';
import { SupabaseEmailGuide } from '@/components/SupabaseEmailGuide';
import CampaignManager from '@/components/CampaignManager';
import PlatformProgressFixer from '@/components/debug/PlatformProgressFixer';
import { MissingColumnsFix } from '@/components/system/MissingColumnsFix';
import CampaignMetricsDBVerifier from '@/components/CampaignMetricsDBVerifier';
import { DatabaseTestComponent } from '@/components/DatabaseTestComponent';
import { DeploymentStatus } from '@/components/DeploymentStatus';
import FullStoryTestComponent from '@/components/FullStoryTestComponent';
import { ServiceConnectionStatus } from '@/components/admin/ServiceConnectionStatus';
import { GlobalNotificationsTester } from '@/components/admin/GlobalNotificationsTester';
import { TextCleanerControls } from '@/components/admin/TextCleanerControls';
import { AdminBlogManager } from '@/components/admin/AdminBlogManager';
import { BlogManagementPanel } from '@/components/admin/BlogManagementPanel';
import { ContentFilterManager } from '@/components/admin/ContentFilterManager';
import { ContentModerationQueue } from '@/components/admin/ContentModerationQueue';
import { AIPostsManager } from '@/components/admin/AIPostsManager';
import { BlogPostClaimsManager } from '@/components/admin/BlogPostClaimsManager';
import { BlogSystemAdmin } from '@/components/admin/BlogSystemAdmin';
import { TrialPostCleanupManager } from '@/components/admin/TrialPostCleanupManager';
import { SystemsAssessmentDashboard } from '@/components/admin/SystemsAssessmentDashboard';
import { NetlifyEnvironmentManager } from '@/components/admin/NetlifyEnvironmentManager';
import { NetlifyAliasPurger } from '@/components/admin/NetlifyAliasPurger';

// Alias exports for backward compatibility
const LazyEnhancedAdminOverview = EnhancedAdminOverview;
const LazyComprehensiveUserManagement = ComprehensiveUserManagement;
const LazyAdminCampaignsManagement = AdminCampaignsManagement;
const LazyEmailSystemManagerSafe = EmailSystemManagerSafe;
const LazySMTPConfigTest = SMTPConfigTest;
const LazyEmailConfigurationTester = EmailConfigurationTester;
const LazyAuthEmailTest = AuthEmailTest;
const LazyEmailTest = EmailTest;
const LazySupabaseEmailTest = SupabaseEmailTest;
const LazySupabaseEmailGuide = SupabaseEmailGuide;
const LazyCampaignManager = CampaignManager;
const LazyPlatformProgressFixer = PlatformProgressFixer;
const LazyMissingColumnsFix = MissingColumnsFix;
const LazyCampaignMetricsDBVerifier = CampaignMetricsDBVerifier;
const LazyDatabaseTestComponent = DatabaseTestComponent;
const LazyDeploymentStatus = DeploymentStatus;
const LazyFullStoryTestComponent = FullStoryTestComponent;
const LazyServiceConnectionStatus = ServiceConnectionStatus;
const LazyGlobalNotificationsTester = GlobalNotificationsTester;
const LazyTextCleanerControls = TextCleanerControls;
const LazyAdminBlogManager = AdminBlogManager;
const LazyBlogManagementPanel = BlogManagementPanel;
const LazyContentFilterManager = ContentFilterManager;
const LazyContentModerationQueue = ContentModerationQueue;
const LazyAIPostsManager = AIPostsManager;
const LazyBlogPostClaimsManager = BlogPostClaimsManager;
const LazyBlogSystemAdmin = BlogSystemAdmin;
const LazyTrialPostCleanupManager = TrialPostCleanupManager;
const LazySystemsAssessmentDashboard = SystemsAssessmentDashboard;
const LazyNetlifyEnvironmentManager = NetlifyEnvironmentManager;
const LazyNetlifyAliasPurger = NetlifyAliasPurger;

// Admin Components
import { EnhancedSecurityDashboard } from "@/components/EnhancedSecurityDashboard";
import { CampaignManager } from "@/components/CampaignManager";
import { EmailSystemManagerSafe } from "@/components/admin/EmailSystemManagerSafe";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";
import AdminCampaignsManagement from "@/components/admin/AdminCampaignsManagement";
import { TrialPostCleanupManager } from "@/components/admin/TrialPostCleanupManager";
import { BlogManagementPanel } from "@/components/admin/BlogManagementPanel";
import { ContentFilterManager } from "@/components/admin/ContentFilterManager";
import { ContentModerationQueue } from "@/components/admin/ContentModerationQueue";
import { AIPostsManager } from "@/components/admin/AIPostsManager";
import { BlogPostClaimsManager } from "@/components/admin/BlogPostClaimsManager";
import { BlogSystemAdmin } from "@/components/admin/BlogSystemAdmin";
import { SystemsAssessmentDashboard } from "@/components/admin/SystemsAssessmentDashboard";
import { EnvironmentVariablesManager } from "@/components/admin/EnvironmentVariablesManager";
import { NetlifyEnvironmentManager } from "@/components/admin/NetlifyEnvironmentManager";
import { ServiceConnectionStatus } from "@/components/admin/ServiceConnectionStatus";
import { DirectOpenAITest } from "@/components/admin/DirectOpenAITest";
import { UserManagement } from "@/components/admin/UserManagement";
import { CampaignMetricsDBVerifier } from "@/components/CampaignMetricsDBVerifier";
import { TextCleanerControls } from "@/components/admin/TextCleanerControls";
import PlatformProgressFixer from "@/components/debug/PlatformProgressFixer";

// Testing Tools
import { AuthEmailTest } from "@/components/AuthEmailTest";
import { EmailTest } from "@/components/EmailTest";
import { SupabaseEmailTest } from "@/components/SupabaseEmailTest";
import { SupabaseEmailGuide } from "@/components/SupabaseEmailGuide";
import EmailConfigurationTester from "@/components/EmailConfigurationTester";
import FullStoryTestComponent from "@/components/FullStoryTestComponent";
import ResendDirectTest from "@/components/ResendDirectTest";
import CORSEmailAlert from "@/components/CORSEmailAlert";
import DatabaseSchemaFix from "@/components/DatabaseSchemaFix";
import { SMTPConfigTest } from "@/components/SMTPConfigTest";
import { DeploymentStatus } from "@/components/DeploymentStatus";
import { DatabaseTestComponent } from "../DatabaseTestComponent";
import { MissingColumnsFix } from "@/components/system/MissingColumnsFix";

import {
  Users,
  Activity,
  CreditCard,
  Clock,
  Infinity,
  LogOut,
  Brain,
  Settings,
  Server,
  FileText,
  Mail,
  Shield,
  Zap,
  Database,
  Globe,
  Code,
  BarChart3,
  MonitorSpeaker,
  RefreshCw,
  AlertCircle,
  Target
} from "lucide-react";

export function OrganizedAdminDashboard() {
  const { toast } = useToast();
  const { metrics, loading, error, refreshMetrics } = useEnhancedAdminMetrics();
  const [activeSection, setActiveSection] = useState("campaigns-management");
  const [adminEmail, setAdminEmail] = useState<string | undefined>();

  // Get admin user info and sync active section with URL hash
  useEffect(() => {
    const getAdminInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setAdminEmail(user.email);
        }
      } catch (error) {
        console.warn('Could not get admin user info:', error);
      }
    };

    // Initialize from hash if present
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
      if (hash) {
        setActiveSection(hash);
      }
    } catch {}

    // Listen for external hash changes
    const onHashChange = () => {
      try {
        const newHash = window.location.hash.replace('#', '');
        if (newHash) setActiveSection(newHash);
      } catch {}
    };
    window.addEventListener('hashchange', onHashChange);

    getAdminInfo();

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const handleRefreshMetrics = async () => {
    await refreshMetrics();
    toast({
      title: "Enhanced Metrics Refreshed",
      description: "Dashboard metrics have been updated with the latest real-time data."
    });
  };

  const handleSignOut = () => {
    AuthService.signOut();
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <AdminNavigationHeader
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          try {
            if (typeof window !== 'undefined') {
              window.location.hash = section;
            }
          } catch {}
        }}
        adminEmail={adminEmail}
      />
      
      <div className="container mx-auto px-4 sm:px-6 pt-2 sm:pt-3 pb-4 sm:pb-8">
        {/* Section Content */}
        {activeSection === "overview" && (
          <LazyEnhancedAdminOverview />
        )}

        {activeSection === "users" && (
          <div className="space-y-6">
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading users…</div>}>
              <LazyComprehensiveUserManagement />
            </Suspense>
          </div>
        )}

        {activeSection === "content" && (
          <Tabs defaultValue="blog-posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="ai-posts">AI Posts</TabsTrigger>
              <TabsTrigger value="blog-claims">Claims</TabsTrigger>
              <TabsTrigger value="blog-system">System</TabsTrigger>
              <TabsTrigger value="content-filter">Content Filter</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="blog-posts">
              <div className="space-y-6">
                <AdminBlogManager />
                <BlogManagementPanel />
              </div>
            </TabsContent>

            <TabsContent value="ai-posts">
              <AIPostsManager />
            </TabsContent>

            <TabsContent value="blog-claims">
              <BlogPostClaimsManager />
            </TabsContent>

            <TabsContent value="blog-system">
              <BlogSystemAdmin />
            </TabsContent>

            <TabsContent value="content-filter">
              <ContentFilterManager />
            </TabsContent>

            <TabsContent value="moderation">
              <ContentModerationQueue />
            </TabsContent>
          </Tabs>
        )}

        {activeSection === "system" && (
          <Tabs defaultValue="assessment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="assessment">Systems Assessment</TabsTrigger>
              <TabsTrigger value="environment">Environment & API Keys</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="text-cleaner">Text Cleaner</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading assessment…</div>}>
                <LazySystemsAssessmentDashboard />
              </Suspense>
            </TabsContent>

            <TabsContent value="environment">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading environment…</div>}>
                <LazyNetlifyEnvironmentManager />
              </Suspense>
            </TabsContent>

            <TabsContent value="deployment">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading deployment…</div>}>
                <LazyDeploymentStatus />
              </Suspense>
            </TabsContent>

            <TabsContent value="database">
              <div className="space-y-6">
                <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading database tools…</div>}>
                  <LazyPlatformProgressFixer />
                  <LazyMissingColumnsFix />
                  <LazyCampaignMetricsDBVerifier />
                  <LazyDatabaseTestComponent />
                </Suspense>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading cleanup…</div>}>
                      <LazyTrialPostCleanupManager />
                    </Suspense>
                    <Separator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="network">
              <div className="space-y-6">
                <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading network tools…</div>}>
                  <LazyGlobalNotificationsTester />
                  <LazyFullStoryTestComponent />
                  <LazyServiceConnectionStatus />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="text-cleaner">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading tool…</div>}>
                <LazyTextCleanerControls />
              </Suspense>
            </TabsContent>
          </Tabs>
        )}

        {activeSection === "communications" && (
          <Tabs defaultValue="campaigns-management" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="email-system">Email System</TabsTrigger>
              <TabsTrigger value="smtp-config">SMTP Config</TabsTrigger>
              <TabsTrigger value="email-test">Testing</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="campaigns-management">Campaigns Management</TabsTrigger>
            </TabsList>

            <TabsContent value="email-system">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading email system…</div>}>
                <LazyEmailSystemManagerSafe />
              </Suspense>
            </TabsContent>

            <TabsContent value="smtp-config">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading SMTP config…</div>}>
                <LazySMTPConfigTest />
              </Suspense>
            </TabsContent>

            <TabsContent value="email-test">
              <div className="space-y-6">
                <CORSEmailAlert />
                <ResendDirectTest />
                <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading email tests…</div>}>
                  <LazyEmailConfigurationTester />
                  <LazyAuthEmailTest />
                  <LazyEmailTest />
                  <LazySupabaseEmailTest />
                  <LazySupabaseEmailGuide />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="campaigns">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading campaigns…</div>}>
                <LazyCampaignManager />
              </Suspense>
            </TabsContent>

            <TabsContent value="campaigns-management">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading campaigns…</div>}>
                <LazyAdminCampaignsManagement />
              </Suspense>
            </TabsContent>
          </Tabs>
        )}

        {activeSection === "campaigns-management" && (
          <div className="space-y-6">
            <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading campaigns…</div>}>
              <LazyAdminCampaignsManagement />
            </Suspense>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-6">
            <EnhancedSecurityDashboard />
          </div>
        )}

        {activeSection === "domains" && (
          <div className="space-y-6">
            <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading domains…</div>}>
              <LazyNetlifyAliasPurger />
            </Suspense>
          </div>
        )}

      </div>
    </div>
  );
}
