import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Trash2, 
  Activity, 
  Database, 
  ExternalLink,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'stopped' | 'completed' | 'failed';
  linksGenerated: number;
  linksLive: number;
  progress: number;
  targetUrl: string;
  dailyTarget: number;
  totalTarget: number;
}

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (campaignId: string, options: DeletionOptions) => Promise<void>;
  campaign: Campaign | null;
  isDeleting?: boolean;
}

interface DeletionOptions {
  confirmationText: string;
}

export default function DeleteCampaignDialog({
  open,
  onOpenChange,
  onDelete,
  campaign,
  isDeleting = false
}: DeleteCampaignDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');

  if (!campaign) return null;

  const isActive = campaign.status === 'active';
  const hasGeneratedLinks = campaign.linksGenerated > 0;
  const expectedText = 'delete';
  const isConfirmationValid = confirmationText === expectedText;
  
  const canProceed = isConfirmationValid;

  const handleClose = () => {
    // Reset all state when closing
    setConfirmationText('');
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!canProceed) return;

    const options: DeletionOptions = {
      confirmationText
    };

    try {
      await onDelete(campaign.id, options);
      handleClose();
    } catch (error) {
      console.error('Delete confirmation failed:', error);
      // Error handling is managed by parent component
    }
  };

  const getDeletionImpact = () => {
    const impacts = [];
    
    if (isActive) {
      impacts.push({
        icon: Activity,
        text: 'Campaign is currently active and will be stopped immediately',
        severity: 'high' as const
      });
    }
    
    if (hasGeneratedLinks) {
      impacts.push({
        icon: ExternalLink,
        text: `${campaign.linksGenerated} generated links will be archived`,
        severity: 'medium' as const
      });
    }
    
    impacts.push({
      icon: Database,
      text: 'All campaign data, analytics, and queue entries will be permanently removed',
      severity: 'medium' as const
    });

    if (campaign.progress > 0 && campaign.progress < 100) {
      impacts.push({
        icon: Clock,
        text: `Campaign is ${campaign.progress}% complete - progress will be lost`,
        severity: 'medium' as const
      });
    }

    return impacts;
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-6">
          {/* Left: primary message */}
          <div className="flex-shrink-0">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="h-7 w-7 text-red-700" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Permanently delete campaign</h2>
                <p className="text-sm text-gray-600 mt-1">Campaign <span className="font-medium">{campaign.name}</span> will be permanently removed from your account.</p>
                {campaign.targetUrl || campaign.target_url ? (
                  <a
                    href={campaign.target_url || campaign.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                  >
                    {campaign.target_url || campaign.targetUrl}
                  </a>
                ) : null}
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1">
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>{campaign.status?.toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">What will be removed</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>- Campaign record from automation_campaigns</li>
                    <li>- Associated queue entries and analytics</li>
                    <li>- (Optional) Published links records if present</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">This action cannot be undone. Make sure you have exported any data you need before proceeding.</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Deletion impact</h4>
                  <div className="grid gap-2">
                    {getDeletionImpact().map((impact, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded shadow-sm">
                        <impact.icon className={`h-5 w-5 ${getSeverityColor(impact.severity)}`} />
                        <div className="text-sm text-gray-700">{impact.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold mb-3">Confirm deletion</h4>
                {isActive && (
                  <Alert className="border-red-200 bg-red-50 mb-3">
                    <AlertDescription className="text-red-800 text-sm">This campaign is currently active — deleting will stop all processing immediately.</AlertDescription>
                  </Alert>
                )}

                <Label htmlFor="confirmation" className="text-xs font-medium">Type <span className="font-mono text-red-600">{expectedText}</span> to confirm</Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={expectedText}
                  className={confirmationText && !isConfirmationValid ? 'border-red-300 focus:border-red-500' : ''}
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="text-xs text-red-600 mt-2">Confirmation text does not match.</p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <AlertDialogCancel onClick={handleClose} disabled={isDeleting} className="w-full">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirm}
                    disabled={!canProceed || isDeleting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2 inline-block" /> Permanently delete
                      </>
                    )}
                  </AlertDialogAction>
                </div>

                <div className="mt-3 text-xs text-gray-500">Required: type <span className="font-mono">{expectedText}</span> to enable deletion.</div>
              </div>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
