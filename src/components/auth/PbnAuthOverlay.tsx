import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { CleanAuthForm } from '@/components/shared/CleanAuthForm';
import { Infinity } from 'lucide-react';
import { SuperIntelligentAIBulletin } from '@/components/shared/SuperIntelligentAIBulletin';

interface PbnAuthOverlayProps {
  context: 'domains' | 'automation';
  onAuthSuccess?: () => void;
}

export function PbnAuthOverlay({ context, onAuthSuccess }: PbnAuthOverlayProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pbn' | 'footprints' | 'metrics' | 'signin' | 'signup'>('pbn');

  const isDomains = context === 'domains';
  const primaryCtaLabel = isDomains ? 'Go to Automation' : 'Go to Domains';
  const primaryCtaHref = isDomains ? '/automation' : '/domains';
  const secondaryLabel = isDomains ? 'Open backlinkoo.com/automation' : 'Open backlinkoo.com/domains';
  const secondaryHref = isDomains ? 'https://backlinkoo.com/automation' : 'https://backlinkoo.com/domains';

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-white shadow p-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <div className="border-b px-4 pt-3 flex items-center">
            <div className="flex-1">
              <Button variant="ghost" className="text-sm font-medium text-gray-700" onClick={() => setTab('pbn')} aria-label="Open PBN Managers">PBN Managers</Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setTab('signin')}>Sign In</Button>
              <Button variant="ghost" onClick={() => setTab('signup')}>Create Account</Button>
            </div>
          </div>

          <TabsContent value="pbn" className="p-6">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Infinity className="h-5 w-5 text-primary" />
                  <CardTitle>Private Blog Network (PBN) Managers</CardTitle>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  This is for professional SEO providers and link-building specialists who manage domains and content distribution networks. Add domains, automate content distribution, and launch link building campaigns in one place.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                  <li>Add domains and verify ownership, then enable automated content distribution.</li>
                  <li>SEO baked-in: schema, metadata, internal linking suggestions, and clean HTML.</li>
                </ul>

                <SuperIntelligentAIBulletin />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={() => navigate(primaryCtaHref)}>{primaryCtaLabel}</Button>
                  <Button variant="outline" onClick={() => window.open(secondaryHref, '_blank', 'noopener,noreferrer')}>{secondaryLabel}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signin" className="p-6">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-center mb-2">Sign in to continue</h2>
              <p className="text-center text-sm text-gray-600 mb-4">Access {isDomains ? 'your domains dashboard' : 'link building automation'}.</p>
              <CleanAuthForm
                defaultTab="login"
                hideTabs
                onAuthSuccess={() => onAuthSuccess?.()}
              />
            </div>
          </TabsContent>

          <TabsContent value="signup" className="p-6">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-center mb-2">Create your account</h2>
              <p className="text-center text-sm text-gray-600 mb-4">Start using {isDomains ? 'Domain Management' : 'Automation'} now.</p>
              <CleanAuthForm
                defaultTab="signup"
                hideTabs
                onAuthSuccess={() => onAuthSuccess?.()}
              />
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>,
    document.body
  );
}
