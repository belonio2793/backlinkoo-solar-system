/**
 * Automation Domain Blog Manager Component
 * Example integration showing how to use the new automation domain blog publishing system
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Target, Globe, FileText, BarChart3, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

// Import the new services
import AutomationDomainBlogPublishingService, { 
  AutomationDomainBlogRequest, 
  AutomationDomainBlogResult 
} from '@/services/automationDomainBlogPublishingService';
import { AutomationTemplateService } from '@/services/automationTemplateService';
import { RotationConfig } from '@/services/automationTemplateRotationService';

interface Domain {
  id: string;
  domain: string;
  blog_enabled: boolean;
  dns_verified: boolean;
  netlify_verified: boolean;
}

const AutomationDomainBlogManager: React.FC<{ campaignId: string }> = ({ campaignId }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    keyword: '',
    targetUrl: '',
    anchorText: '',
    contentPrompt: ''
  });
  const [rotationStrategy, setRotationStrategy] = useState<'sequential' | 'random' | 'keyword-based'>('sequential');
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishingResult, setPublishingResult] = useState<AutomationDomainBlogResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Available templates
  const availableTemplates = AutomationTemplateService.getAllTemplates();

  // Load domains on component mount
  useEffect(() => {
    loadAvailableDomains();
  }, []);

  const loadAvailableDomains = async () => {
    try {
      setIsLoading(true);
      // In real implementation, this would fetch from your domains API
      const mockDomains: Domain[] = [
        { id: '1', domain: 'example1.com', blog_enabled: true, dns_verified: true, netlify_verified: true },
        { id: '2', domain: 'example2.com', blog_enabled: true, dns_verified: true, netlify_verified: true },
        { id: '3', domain: 'example3.com', blog_enabled: true, dns_verified: true, netlify_verified: true },
      ];
      setDomains(mockDomains);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const handleTemplateToggle = (templateId: number) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.keyword.trim()) errors.push('Keyword is required');
    if (!formData.targetUrl.trim()) errors.push('Target URL is required');
    if (!formData.anchorText.trim()) errors.push('Anchor text is required');
    if (selectedDomains.length === 0) errors.push('Select at least one domain');
    
    try {
      new URL(formData.targetUrl);
    } catch {
      errors.push('Target URL must be a valid URL');
    }
    
    return errors;
  };

  const handlePublish = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }

    setIsPublishing(true);
    setPublishingProgress(0);
    setPublishingResult(null);

    try {
      // Configure rotation settings
      const rotationConfig: RotationConfig = {
        strategy: rotationStrategy,
        templatePool: selectedTemplates.length > 0 ? selectedTemplates : undefined,
        enablePerformanceOptimization: true
      };

      // Create publishing request
      const publishingRequest: AutomationDomainBlogRequest = {
        campaignId,
        domainIds: selectedDomains,
        keyword: formData.keyword,
        targetUrl: formData.targetUrl,
        anchorText: formData.anchorText,
        contentPrompt: formData.contentPrompt || undefined,
        rotationConfig,
        formattingOptions: {
          includeBacklink: true,
          backlinkPosition: 'natural',
          optimizeForSEO: true,
          includeTableOfContents: true
        },
        urlOptions: {
          includeDate: false,
          addUtmParameters: true,
          campaignId,
          trackingEnabled: true,
          randomizeSlug: true
        },
        publishingOptions: {
          generateContent: true,
          autoPublish: true,
          notifyOnCompletion: true
        }
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setPublishingProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 1000);

      // Execute publishing
      const result = await AutomationDomainBlogPublishingService.publishAutomationDomainBlogs(
        publishingRequest
      );

      clearInterval(progressInterval);
      setPublishingProgress(100);
      setPublishingResult(result);

      console.log('🎉 Publishing completed:', result);

    } catch (error) {
      console.error('❌ Publishing failed:', error);
      setPublishingResult({
        success: false,
        campaignId,
        totalDomains: selectedDomains.length,
        successfulPublications: [],
        failedPublications: selectedDomains.map(domainId => ({
          automationDomainId: 'unknown',
          domainId,
          domain: domains.find(d => d.id === domainId)?.domain || 'Unknown',
          error: error instanceof Error ? error.message : String(error),
          stage: 'publishing',
          retryable: true
        })),
        summary: {
          templatesUsed: {},
          averageProcessingTime: 0,
          totalWordCount: 0,
          seoScore: 0
        }
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!publishingResult) return;

    try {
      setIsPublishing(true);
      const retryResult = await AutomationDomainBlogPublishingService.retryFailedPublications(campaignId);
      setPublishingResult(retryResult);
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading domains...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Automation Domain Blog Publishing
          </CardTitle>
          <CardDescription>
            Automatically generate and publish blog posts across multiple domains with template rotation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Campaign Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Target Keyword *</Label>
              <Input
                id="keyword"
                placeholder="digital marketing"
                value={formData.keyword}
                onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                placeholder="https://example.com"
                value={formData.targetUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchorText">Anchor Text *</Label>
              <Input
                id="anchorText"
                placeholder="best digital marketing tools"
                value={formData.anchorText}
                onChange={(e) => setFormData(prev => ({ ...prev, anchorText: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rotationStrategy">Template Rotation</Label>
              <Select 
                value={rotationStrategy} 
                onValueChange={(value: any) => setRotationStrategy(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="keyword-based">Keyword-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Prompt */}
          <div className="space-y-2">
            <Label htmlFor="contentPrompt">Custom Content Prompt (Optional)</Label>
            <textarea
              id="contentPrompt"
              className="w-full min-h-[100px] p-3 border rounded-md resize-vertical"
              placeholder="Provide specific instructions for content generation..."
              value={formData.contentPrompt}
              onChange={(e) => setFormData(prev => ({ ...prev, contentPrompt: e.target.value }))}
            />
          </div>

          {/* Domain Selection */}
          <div className="space-y-3">
            <Label>Select Domains ({selectedDomains.length} selected)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {domains.map(domain => (
                <div 
                  key={domain.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDomains.includes(domain.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDomainToggle(domain.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedDomains.includes(domain.id)}
                      onChange={() => {}} // Handled by parent onClick
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{domain.domain}</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Blog Ready
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>
              Template Pool (Leave empty to use all) 
              {selectedTemplates.length > 0 && ` - ${selectedTemplates.length} selected`}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplates.includes(template.id) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTemplateToggle(template.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => {}} // Handled by parent onClick
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Template {template.id}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publishing Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Ready to publish to {selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''}
              {selectedTemplates.length > 0 && ` using ${selectedTemplates.length} template${selectedTemplates.length !== 1 ? 's' : ''}`}
            </div>
            <Button 
              onClick={handlePublish}
              disabled={isPublishing || selectedDomains.length === 0}
              className="px-6"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Publish Blogs
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Progress */}
      {isPublishing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Publishing Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={publishingProgress} className="h-2" />
              <p className="text-sm text-gray-600 text-center">
                Processing {selectedDomains.length} domains... {publishingProgress}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publishing Results */}
      {publishingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Publishing Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {publishingResult.successfulPublications.length}
                </div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {publishingResult.failedPublications.length}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {publishingResult.summary.totalWordCount.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Total Words</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(publishingResult.summary.seoScore)}%
                </div>
                <div className="text-sm text-purple-700">Avg SEO Score</div>
              </div>
            </div>

            {/* Successful Publications */}
            {publishingResult.successfulPublications.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Successful Publications
                </h4>
                <div className="space-y-1">
                  {publishingResult.successfulPublications.map(pub => (
                    <div key={pub.automationDomainId} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                      <div>
                        <span className="font-medium">{pub.domain}</span>
                        <span className="text-gray-600 ml-2">({pub.templateName})</span>
                      </div>
                      <a 
                        href={pub.publishedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        View Post →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Publications */}
            {publishingResult.failedPublications.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-red-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Failed Publications
                  </h4>
                  {publishingResult.failedPublications.some(f => f.retryable) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRetryFailed}
                      disabled={isPublishing}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry Failed
                    </Button>
                  )}
                </div>
                <div className="space-y-1">
                  {publishingResult.failedPublications.map((failure, index) => (
                    <div key={index} className="p-2 bg-red-50 rounded text-sm">
                      <div className="font-medium text-red-700">{failure.domain}</div>
                      <div className="text-red-600">{failure.error}</div>
                      <div className="text-xs text-red-500 mt-1">
                        Stage: {failure.stage} • {failure.retryable ? 'Retryable' : 'Manual fix required'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template Distribution */}
            {Object.keys(publishingResult.summary.templatesUsed).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Template Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(publishingResult.summary.templatesUsed).map(([templateId, count]) => {
                    const template = AutomationTemplateService.getTemplate(Number(templateId));
                    return (
                      <div key={templateId} className="p-2 bg-gray-50 rounded text-sm text-center">
                        <div className="font-medium">{template?.name || `Template ${templateId}`}</div>
                        <div className="text-gray-600">{count} posts</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomationDomainBlogManager;
