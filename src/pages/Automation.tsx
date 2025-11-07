import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Target, FileText, Link, BarChart3, CheckCircle, Info, Clock, Wand2, Globe } from 'lucide-react';
import { getOrchestrator } from '@/services/automationOrchestrator';
import { campaignMonitoringService } from '@/services/campaignMonitoringService';
import { realTimeFeedService } from '@/services/realTimeFeedService';
import { workingCampaignProcessor } from '@/services/workingCampaignProcessor';
import CampaignMonitoringErrorBoundary from '@/components/CampaignMonitoringErrorBoundary';
import NetworkStatusIndicator from '@/components/NetworkStatusIndicator';
import AutomationReporting from '@/components/AutomationReporting';
import AutomationPostsList from '@/components/AutomationPostsList';
import AutomationServiceStatus from '@/components/AutomationServiceStatus';
import CampaignProgressTracker, { CampaignProgress } from '@/components/CampaignProgressTracker';
import LiveCampaignStatus from '@/components/LiveCampaignStatus';
import CampaignManagerTabbed from '@/components/CampaignManagerTabbed';
import FormCompletionCelebration from '@/components/FormCompletionCelebration';
import DevelopmentModeIndicator from '@/components/DevelopmentModeIndicator';
import BacklinkNotification from '@/components/BacklinkNotification';
import DatabaseSchemaFixer from '@/components/DatabaseSchemaFixer';
import EnhancedCampaignCreator from '@/components/EnhancedCampaignCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AutomationDomainsSwitcher from '@/components/shared/AutomationDomainsSwitcher';
import HowItWorksModal from '@/components/shared/HowItWorksModal';
import { PbnAuthOverlay } from '@/components/auth/PbnAuthOverlay';
import { useAuthState } from '@/hooks/useAuthState';
import { useCampaignFormPersistence } from '@/hooks/useCampaignFormPersistence';
import { useSmartCampaignFlow } from '@/hooks/useSmartCampaignFlow';
import { useAuthModal } from '@/contexts/ModalContext';
import { supabase } from '@/integrations/supabase/client';
import { extractErrorMessage } from '@/utils/errorExtractor';
import AutomationDomainList from '@/components/AutomationDomainList';
// Enhanced feed hooks removed - using simpler state management

const Automation = () => {
  const [statusMessages, setStatusMessages] = useState<Array<{message: string, type: 'success' | 'error' | 'info', id: string}>>([]);
  const { isAuthenticated, isLoading: authLoading, user } = useAuthState();
  const { savedFormData, saveFormData, clearFormData, hasValidSavedData } = useCampaignFormPersistence();
  const smartFlow = useSmartCampaignFlow();
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [validatedDomains, setValidatedDomains] = useState<string[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [postsCount, setPostsCount] = useState<number | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState<CampaignProgress | null>(null);
  const [progressUnsubscribe, setProgressUnsubscribe] = useState<(() => void) | null>(null);
  const [lastCreatedCampaign, setLastCreatedCampaign] = useState<any>(null);
  const [hasShownRestoreMessage, setHasShownRestoreMessage] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastFormValidState, setLastFormValidState] = useState(false);
  const [useEnhancedCreator, setUseEnhancedCreator] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Modal state for authentication
  const { openLoginModal, openSignupModal, hasActiveModal } = useAuthModal();
  // Avoid flashing the PBN auth overlay on quick route changes or while auth is loading
  const [showPbnOverlay, setShowPbnOverlay] = useState(false);
  useEffect(() => {
    let t: any = null;
    // Only show after short delay if there is no user, auth isn't loading and no other modal is active
    if (!user && !authLoading && !hasActiveModal) {
      t = setTimeout(() => setShowPbnOverlay(true), 300);
    } else {
      setShowPbnOverlay(false);
    }
    return () => { if (t) clearTimeout(t); };
  }, [user, authLoading, hasActiveModal]);
  const [formData, setFormData] = useState({
    name: '',
    targetUrl: '',
    keyword: '',
    anchorText: '',
    model: 'gpt-3.5-turbo',
    theme: ''
  });

  const orchestrator = getOrchestrator();

  // Add status message helper
  const addStatusMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Use a more robust unique id to avoid duplicates when messages are created in the same millisecond
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    setStatusMessages(prev => [...prev.slice(-4), { message, type, id }]); // Keep last 5 messages

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setStatusMessages(prev => prev.filter(msg => msg.id !== id));
    }, 5000);
  };

  // Keep background cursor ref and handlers near top so Hooks order remains stable
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    const onEnter = () => el.style.setProperty('--cursor-show', '1');
    const onLeave = () => el.style.setProperty('--cursor-show', '0');

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Load saved form data when component mounts or when saved data changes
  useEffect(() => {
    if (hasValidSavedData(savedFormData) && !hasShownRestoreMessage) {
      setFormData(savedFormData);
      addStatusMessage('Form data restored - you can continue with your campaign', 'info');
      setHasShownRestoreMessage(true);

      // Update smart flow with restored data
      smartFlow.updateFlowState(savedFormData);
    }
  }, [savedFormData, hasValidSavedData, hasShownRestoreMessage, smartFlow]);

  // Initialize smart flow on mount
  useEffect(() => {
    smartFlow.updateFlowState(formData);
  }, []);

  // Load total posts count for user (across all campaigns)
  useEffect(() => {
    const loadCount = async () => {
      try {
        if (!user?.id) { setPostsCount(0); return; }
        const { count, error } = await supabase
          .from('automation_posts')
          .select('id', { head: true, count: 'exact' })
          .eq('user_id', user.id);
        if (error) throw error;
        setPostsCount(count ?? 0);
      } catch (e) {
        console.warn('posts count error', e);
        setPostsCount(0);
      }
    };
    loadCount();
  }, [user?.id]);

  // Load validated custom domains for publishing
  useEffect(() => {
    const loadDomains = async () => {
      if (!user?.id) return;
      setDomainsLoading(true);
      try {
        const { data, error } = await supabase
          .from('domains')
          .select('domain, dns_verified, netlify_verified, user_id')
          .eq('user_id', user.id)
          .eq('dns_verified', true)
          .eq('netlify_verified', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setValidatedDomains((data || []).map(d => d.domain));
      } catch (e) {
        console.error('Failed to load validated domains:', e);
        try { addStatusMessage(`Failed to load validated domains: ${formatErrorMessage(e)}`, 'error'); } catch {}
        // Capture context for diagnostics
        try { console.debug('[Automation] loadDomains context', { userId: user?.id, query: { dns_verified: true, netlify_verified: true } }); } catch {}
        setValidatedDomains([]);
      } finally {
        setDomainsLoading(false);
      }
    };
    loadDomains();
  }, [user?.id]);

  // Migrate old URLs and seed theme previews (once per session)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const flag = 'themes_fix_run_v1';
    if (localStorage.getItem(flag) === 'done') return;
    (async () => {
      try {
        // Skipping Supabase edge migration in Netlify-only mode.
        addStatusMessage('Theme setup skipped (Netlify mode).', 'info');
      } catch (e) {
        console.warn('Theme migration/seed skipped', e);
      } finally {
        try { localStorage.setItem(flag, 'done'); } catch {}
      }
    })();
  }, [isAuthenticated, user?.id]);

  // Start campaign monitoring when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Load active campaigns for Live Monitor
      const loadActiveCampaigns = async () => {
        try {
          const campaigns = await orchestrator.getUserCampaigns();
          const active = campaigns.filter(c => c.status === 'active');
          setActiveCampaigns(active);

          if (active.length > 0) {
            addStatusMessage(`Found ${active.length} active campaign(s)`, 'info');
          }
        } catch (error) {
          console.error('Error loading active campaigns:', error);
        }
      };

      // Start monitoring with a small delay to ensure other services are ready
      const startMonitoring = setTimeout(async () => {
        campaignMonitoringService.startMonitoring();
        addStatusMessage('Campaign monitoring service started', 'info');

        // Load campaigns and check immediately
        await loadActiveCampaigns();

        // Force an immediate check for stuck campaigns
        setTimeout(async () => {
          await campaignMonitoringService.forceCheck();
          addStatusMessage('Initial campaign health check completed', 'info');
        }, 1000);
      }, 2000);

      return () => {
        clearTimeout(startMonitoring);
      };
    } else {
      // Stop monitoring when user logs out
      campaignMonitoringService.stopMonitoring();
      setActiveCampaigns([]);
    }
  }, [isAuthenticated]);


  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Update smart flow state
    smartFlow.updateFlowState(newFormData);

    // Check if form just became valid for celebration
    const isNowValid = smartFlow.hasValidForm(newFormData);
    if (isNowValid && !lastFormValidState && !isAuthenticated) {
      setShowCelebration(true);
    }
    setLastFormValidState(isNowValid);
  };

  const validateForm = () => {
    if (!formData.targetUrl || !formData.keyword || !formData.anchorText) {
      addStatusMessage('Please fill in all required fields', 'error');
      return false;
    }

    // Basic URL validation
    try {
      new URL(formData.targetUrl);
    } catch {
      addStatusMessage('Please enter a valid target URL', 'error');
      return false;
    }

    return true;
  };

  const formatErrorMessage = extractErrorMessage;

  const handleCreateCampaign = async () => {
    // Check if user needs authentication first
    if (!isAuthenticated) {
      saveFormData(formData);
      addStatusMessage('Please sign in to continue with your campaign', 'info');

      // Open authentication modal with campaign context
      openLoginModal({
        onAuthSuccess: handleAuthSuccess,
        pendingAction: `your ${formData.keyword || 'link building'} campaign`
      });
      return;
    }

    await smartFlow.handleCampaignAction(
      formData,
      createCampaign,
      () => {} // Auth is handled via modal
    );
  };

  const createCampaign = async () => {
    setIsCreating(true);

    // Don't open Enhanced Feed popup - keep it inline
    // setShowEnhancedFeed(true);

    try {
      // Ensure URL is properly formatted before creating campaign
      const formattedUrl = smartFlow.autoFormatUrl(formData.targetUrl);

      // Update form data if URL was auto-formatted
      if (formattedUrl !== formData.targetUrl) {
        setFormData(prev => ({ ...prev, targetUrl: formattedUrl }));
        addStatusMessage('URL auto-formatted for campaign creation', 'info');
      }

      // Decide model and theme values; pick random options if not provided (UI hidden)
      const availableModels = ['gpt-3.5-turbo', 'gpt-4'];
      const availableThemes = ['', 'elegant-editorial', 'minimal-clean', 'modern-business', 'tech-focus'];

      const chosenModel = formData.model && availableModels.includes(formData.model)
        ? formData.model
        : availableModels[Math.floor(Math.random() * availableModels.length)];

      const chosenTheme = formData.theme && availableThemes.includes(formData.theme)
        ? formData.theme
        : availableThemes[Math.floor(Math.random() * availableThemes.length)];

      // Insert campaign row into Supabase automation table
      const insertPayload: any = {
        user_id: user?.id || null,
        name: formData.name || formData.keyword,
        target_url: formattedUrl,
        keywords: formData.keyword ? [formData.keyword] : [],
        anchor_texts: formData.anchorText ? [formData.anchorText] : [],
        status: 'active'
      };

      const { data: created, error: insertError, status } = await supabase
        .from('automation_campaigns')
        .insert(insertPayload)
        .select()
        .single();

      if (insertError) {
        // Detailed diagnostics for failed inserts
        try { console.error('automation_campaigns insert failed', { payload: insertPayload, status, error: insertError }); } catch {}
        try { addStatusMessage(`Failed to create campaign: ${insertError.message || String(insertError)}`, 'error'); } catch {}
        throw insertError;
      }

      // Create campaign in orchestrator (pass DB id)
      const campaign = await orchestrator.createCampaign({
        id: created.id,
        target_url: formattedUrl,
        keyword: formData.keyword,
        anchor_text: formData.anchorText,
        model: chosenModel,
        theme: chosenTheme
      });

      // Subscribe to progress updates
      const unsubscribe = orchestrator.subscribeToProgress(campaign.id, (progress) => {
        setCampaignProgress(progress);
      });

      setProgressUnsubscribe(() => unsubscribe);
      // Don't show full screen progress - keep inline progress
      // setShowProgress(true);

      // Store the created campaign for live status
      setLastCreatedCampaign(campaign);
      // Notify other components (e.g., list) to refresh
      try { window.dispatchEvent(new Event('automation:campaign:created')); } catch {}

      // Unified publishing: Netlify automation-post only
      addStatusMessage('Starting campaign publishing via Netlify…', 'info');

      try {
        addStatusMessage('Invoking automation-post…', 'info');
        let publishedAny = false;

        try {
          const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
          const { data: gen, error: genErr } = await netlifyInvoker.invoke('automation-post', {
            body: { campaign_id: campaign.id }
          });

          if (!genErr && gen) {
            const published = (gen as any)?.publishedUrls || (gen as any)?.data?.publishedUrls || (gen as any)?.published_url || (gen as any)?.post?.url;
            if (Array.isArray(published) && published.length) {
              addStatusMessage(`Published ${published.length} post(s).`, 'success');
              publishedAny = true;
              try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}
            } else if (published) {
              addStatusMessage(`Post published: ${published}`, 'success');
              publishedAny = true;
              try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}
            }
          } else {
            const errMsg = genErr ? (genErr.message || String(genErr)) : (gen ? JSON.stringify(gen) : 'No response');
            console.warn('automation-post: error or no data', errMsg, genErr, gen);
            addStatusMessage(`automation-post error: ${errMsg}`, 'error');
          }
        } catch (netErr) {
          console.warn('automation-post invoke failed:', netErr);
          addStatusMessage('automation-post invocation failed.', 'error');
        }

        if (!publishedAny) {
          addStatusMessage('No posts were published. Please retry or check function logs.', 'error');
        }
      } catch (e) {
        console.error('Publishing pipeline error:', e);
        addStatusMessage('Publishing pipeline failed.', 'error');
      }

      // Add campaign to active campaigns for enhanced feed
      setActiveCampaigns(prev => [...prev, campaign]);

      // Emit real-time feed event for campaign creation
      realTimeFeedService.emitCampaignCreated(
        campaign.id,
        campaign.name || formData.keyword,
        formData.keyword,
        formattedUrl,
        user?.id
      );

      // Clear saved form data since campaign was created successfully
      clearFormData();
      setHasShownRestoreMessage(false);

      // Reset form
      setFormData({
        name: '',
        targetUrl: '',
        keyword: '',
        anchorText: '',
        model: 'gpt-3.5-turbo',
        theme: ''
      });

      addStatusMessage('Campaign created and post generation started.', 'success');

    } catch (error) {
      console.error('Campaign creation error:', extractErrorMessage(error));
      
      // Handle specific authentication errors - open modal
      if (error instanceof Error && error.message.includes('not authenticated')) {
        saveFormData(formData);
        addStatusMessage('Please sign in to continue with your campaign', 'error');
        openLoginModal({
          onAuthSuccess: handleAuthSuccess,
          pendingAction: `your ${formData.keyword || 'link building'} campaign`
        });
        return;
      }
      
      addStatusMessage(`Campaign creation failed: ${extractErrorMessage(error)}`, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    console.log('🎯 Auth success for automation, user:', user?.email);
    addStatusMessage('Successfully signed in! Starting your campaign...', 'success');

    // Use a small delay to let the user see the success message
    setTimeout(async () => {
      await smartFlow.handleSuccessfulAuth(createCampaign);
    }, 1000);
  };


  const handleRetryCampaign = () => {
    // Reset campaign progress and allow user to create a new campaign
    setCampaignProgress(null);

    // Cleanup subscription
    if (progressUnsubscribe) {
      progressUnsubscribe();
      setProgressUnsubscribe(null);
    }

    addStatusMessage('Ready to create a new campaign', 'info');
  };

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (progressUnsubscribe) {
        progressUnsubscribe();
      }
    };
  }, [progressUnsubscribe]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-gray-900 font-medium">Loading automation system...</p>
            {hasValidSavedData(savedFormData) && (
              <p className="text-sm text-blue-600 mt-2">
                Restoring your saved campaign for "{savedFormData.keyword}"
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main ref={bgRef} className="flex-1 bg-background px-3 py-4 sm:px-5 lg:px-6 xl:px-8 relative">
        <div className="w-full max-w-6xl mx-auto space-y-4">
          <HowItWorksModal open={howItWorksOpen} onOpenChange={setHowItWorksOpen} />


          {/* Switcher between Automation and Domains */}
          <div className="mb-2 flex justify-center">
            <AutomationDomainsSwitcher />
          </div>

          {/* Page Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Info className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" title="Learn How It Works" onClick={() => setHowItWorksOpen(true)} />
                Link Building Automation
              </h1>
              <NetworkStatusIndicator />
            </div>
            {user && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span>Signed in as {user.email}</span>
              </div>
            )}

          </div>

        {/* Saved form data notification */}
        {hasValidSavedData(savedFormData) && !isAuthenticated && (
          <Alert className="border-blue-200 bg-blue-50">
            <Target className="h-4 w-4" />
            <AlertDescription className="text-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  You have a saved campaign ready: <strong>"{savedFormData.keyword}"</strong>
                  <div className="text-sm mt-1 opacity-90">
                    Target: {savedFormData.targetUrl} • Anchor: {savedFormData.anchorText}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-4 border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => openLoginModal({
                    onAuthSuccess: handleAuthSuccess,
                    pendingAction: `your ${savedFormData.keyword || 'saved'} campaign`
                  })}
                >
                  Sign In to Continue
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Development Mode Indicator */}
        <DevelopmentModeIndicator />


        {/* Database Schema Fixer removed for cleaner UI */}

        {/* Status Messages removed per request */}
        {null}


        {/* Main Content - Top Row: Campaign Creation, Activity, Live Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 xl:gap-6 items-stretch">
          {/* Campaign Creation (Left Column) */}
          <div className="lg:col-span-1 flex flex-col min-h-0 h-full">
            <Tabs defaultValue="create" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  New Campaign
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Status
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Posts{typeof postsCount === 'number' ? ` (${postsCount})` : ''}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="mt-1 space-y-2 flex-1 flex flex-col">

                {/* Conditional Campaign Creator */}
                {useEnhancedCreator ? (
                  <EnhancedCampaignCreator
                    onCampaignCreate={async (campaignData) => {
                      // Update form data with enhanced campaign data
                      setFormData(prev => ({
                        ...prev,
                        targetUrl: campaignData.targetUrl,
                        keyword: campaignData.keyword,
                        anchorText: campaignData.anchorText
                      }));

                      // Create campaign using existing logic
                      await createCampaign();
                    }}
                    isCreating={isCreating}
                  />
                ) : (
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5" />
                      Create a New Campaign
                    </CardTitle>
                    <CardDescription>
                      Launch a new link building campaign with automated content generation and backlinks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 py-4">
                    {/* Form Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                        <span>Form Progress</span>
                        <span>{Math.round(((3 - smartFlow.analyzeFormData(formData).missingFields.length) / 3) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            smartFlow.hasValidForm(formData) ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${((3 - smartFlow.analyzeFormData(formData).missingFields.length) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Campaign Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input
                        id="name"
                        placeholder="SaaS Backlinks"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Optional display name for your campaign</p>
                    </div>

                    {/* Target URL Field */}
                    <div className="space-y-2">
                      <Label htmlFor="targetUrl">Target URL *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="targetUrl"
                          placeholder="https://example.com or example.com"
                          value={formData.targetUrl}
                          onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                          onKeyDown={(e) => {
                            // Ctrl/Cmd + Enter to auto-format
                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                              e.preventDefault();
                              const formattedUrl = smartFlow.autoFormatUrl(formData.targetUrl);
                              if (formattedUrl !== formData.targetUrl) {
                                handleInputChange('targetUrl', formattedUrl);
                                addStatusMessage('URL formatted with Ctrl+Enter shortcut', 'success');
                              }
                            }
                          }}
                          onBlur={(e) => {
                            // Auto-format URL when user leaves the field
                            const formattedUrl = smartFlow.autoFormatUrl(e.target.value);
                            if (formattedUrl !== e.target.value) {
                              handleInputChange('targetUrl', formattedUrl);
                              addStatusMessage('URL automatically formatted with https://', 'info');
                            }
                          }}
                          onPaste={(e) => {
                            // Auto-format pasted content after a short delay
                            // Capture value synchronously to avoid React event pooling nullifying event
                            const pastedAt = e.currentTarget.value;
                            setTimeout(() => {
                              const formattedUrl = smartFlow.autoFormatUrl(pastedAt);
                              if (formattedUrl !== pastedAt) {
                                handleInputChange('targetUrl', formattedUrl);
                                addStatusMessage('Pasted URL automatically formatted with https://', 'info');
                              }
                            }, 10);
                          }}
                          className={`flex-1 ${smartFlow.analyzeFormData(formData).missingFields.includes('Target URL') ||
                                    smartFlow.analyzeFormData(formData).missingFields.includes('Valid Target URL') ?
                                    'border-amber-300 focus:border-amber-500' : ''}`}
                        />
                        {formData.targetUrl && !formData.targetUrl.startsWith('http') && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const formattedUrl = smartFlow.autoFormatUrl(formData.targetUrl);
                              if (formattedUrl !== formData.targetUrl) {
                                handleInputChange('targetUrl', formattedUrl);
                                addStatusMessage('URL formatted with https://', 'success');
                              }
                            }}
                            className="px-3"
                            title="Add https:// to URL"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        The URL where your backlink will point
                      </p>
                      {formData.targetUrl && !formData.targetUrl.startsWith('http') && formData.targetUrl.includes('.') && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                          <Wand2 className="h-3 w-3" />
                          Will auto-format to: {smartFlow.autoFormatUrl(formData.targetUrl)}
                        </p>
                      )}
                      {smartFlow.analyzeFormData(formData).missingFields.includes('Valid Target URL') && formData.targetUrl &&
                       !formData.targetUrl.includes('.') && (
                        <p className="text-xs text-amber-600">
                          Please enter a valid domain (e.g., example.com)
                        </p>
                      )}
                    </div>

                    {/* Keyword Field */}
                    <div className="space-y-2">
                      <Label htmlFor="keyword">Keyword *</Label>
                      <Input
                        id="keyword"
                        placeholder="digital marketing"
                        value={formData.keyword}
                        onChange={(e) => handleInputChange('keyword', e.target.value)}
                        className={smartFlow.analyzeFormData(formData).missingFields.includes('Keyword') ?
                                  'border-amber-300 focus:border-amber-500' : ''}
                      />
                      <p className="text-sm text-gray-500">The main topic for content generation</p>
                      {formData.keyword && formData.keyword.length > 50 && (
                        <p className="text-sm text-amber-600">Consider using a shorter, more focused keyword</p>
                      )}
                    </div>

                    {/* Anchor Text Field */}
                    <div className="space-y-2">
                      <Label htmlFor="anchorText">Anchor Text *</Label>
                      <Input
                        id="anchorText"
                        placeholder="best digital marketing tools"
                        value={formData.anchorText}
                        onChange={(e) => handleInputChange('anchorText', e.target.value)}
                        className={smartFlow.analyzeFormData(formData).missingFields.includes('Anchor Text') ?
                                  'border-amber-300 focus:border-amber-500' : ''}
                      />
                      <p className="text-sm text-gray-500">The clickable text for your backlink</p>
                      {formData.anchorText && (
                        <div className="flex justify-between text-xs">
                          <span className={formData.anchorText.length > 60 ? 'text-amber-600' : 'text-gray-500'}>
                            {formData.anchorText.length} characters
                          </span>
                          {formData.anchorText.length > 60 && (
                            <span className="text-amber-600">Consider shorter anchor text for better SEO</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Model & Theme are intentionally hidden in simplified UI. Values will be randomized server-side if required. */}

                    {/* Smart Flow Contextual Messages */}
                    {smartFlow.getContextualMessages(formData).map((msg: any, index: number) => (
                      <Alert key={index} className={
                        msg.type === 'success' ? 'border-green-200 bg-green-50' :
                        msg.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                        'border-blue-200 bg-blue-50'
                      }>
                        <Info className="h-4 w-4" />
                        <AlertDescription className={
                          msg.type === 'success' ? 'text-green-700' :
                          msg.type === 'warning' ? 'text-yellow-700' :
                          'text-blue-700'
                        }>
                          {msg.message}
                        </AlertDescription>
                      </Alert>
                    ))}

                    {/* Create Campaign Button */}
                    <Button
                      onClick={handleCreateCampaign}
                      disabled={(smartFlow.getButtonState(formData).disabled || isCreating) && isAuthenticated}
                      className="w-full h-12 text-lg font-medium transition-all duration-300"
                      size="lg"
                      variant={smartFlow.getButtonState(formData).variant}
                    >
                      <div className="flex items-center justify-center transition-all duration-200">
                        {(isCreating || smartFlow.getButtonState(formData).icon === 'loader') ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span className="animate-pulse">{smartFlow.getButtonState(formData).text}</span>
                          </>
                        ) : (
                          <>
                            <Target className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                              smartFlow.hasValidForm(formData) ? 'rotate-0' : 'rotate-45'
                            }`} />
                            <span>
                              {!isAuthenticated && smartFlow.hasValidForm(formData)
                                ? 'Sign In & Create Campaign'
                                : smartFlow.getButtonState(formData).text
                              }
                            </span>
                          </>
                        )}
                      </div>
                    </Button>

                    {/* Button description */}
                    {smartFlow.getButtonState(formData).description && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {smartFlow.getButtonState(formData).description}
                      </p>
                    )}

                    {!isAuthenticated && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          You'll need to sign in or create an account to start campaigns. Your form data will be saved automatically.
                        </AlertDescription>
                      </Alert>
                    )}


                    {/* Campaign Status Summary */}
                    {lastCreatedCampaign && (
                      <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-900">Campaign Active</h4>
                            <p className="text-sm text-green-700">
                              "{lastCreatedCampaign.keywords?.[0] || lastCreatedCampaign.name}" is running
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Monitoring live</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                )}

                {/* User Campaigns List moved above Activity */}
              </TabsContent>

              <TabsContent value="status" className="mt-1 space-y-3 flex-1 flex flex-col">
                <AutomationServiceStatus />
              </TabsContent>

              <TabsContent value="posts" className="mt-1 space-y-3 flex-1 flex flex-col">
                <AutomationPostsList />
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity (Middle Column) */}
          <div className="lg:col-span-1">
            <CampaignManagerTabbed
              onStatusUpdate={(message, type) => addStatusMessage(message, type)}
              currentCampaignProgress={campaignProgress}
              onRetryProgress={handleRetryCampaign}
            />
          </div>

        </div>

        {/* Publishing Platforms - Full Width Second Row */}
        <div className="w-full">
          <Card className="h-fit">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link className="w-5 h-5" />
                Publishing Platforms
              </CardTitle>
              <CardDescription>
                Available platforms for automatic content publishing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2.5">
                <div className="bg-gray-50 border rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-medium text-sm text-gray-900">Active Publishing Methods</h3>
                    <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">{validatedDomains.length} Available</div>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1.5">
                    <div className="flex items-center justify-between p-2.5 bg-white border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">Your Domains</div>
                          <div className="text-xs text-gray-600">Publish blogs on your connected domains</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-blue-700">Custom</div>
                        <div className="text-xs text-gray-500">
                          <a href="/domains" className="text-blue-600 hover:underline">Setup →</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Validated Domains List */}
                  <div className="mt-2">
                    <AutomationDomainList userId={user?.id} />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Domain-Based Blog Publishing</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Set up your domains in the <a href="/domains" className="font-medium underline">Domains section</a> to automatically publish blogs with your custom branding and SEO optimization.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="/domains"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          <Globe className="h-3 w-3" />
                          Manage Domains
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Form Completion Celebration */}
        <FormCompletionCelebration
          isVisible={showCelebration}
          onComplete={() => setShowCelebration(false)}
        />

        </div>
      </main>


      <Footer />

      {/* Backlink Publication Notifications */}
      <BacklinkNotification isVisible={isAuthenticated} />
    </div>
  );
};

export default Automation;
