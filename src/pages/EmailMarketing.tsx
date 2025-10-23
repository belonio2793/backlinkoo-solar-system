import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Mail,
  Settings,
  Upload,
  Send,
  BarChart3,
  Shield,
  CheckCircle,
  AlertCircle,
  Users,
  Eye,
  Download,
  Globe,
  Infinity,
  ArrowLeft,
  Server,
  Key,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SMTPConfiguration } from '@/components/email/SMTPConfiguration';
import { DNSVerification } from '@/components/email/DNSVerification';
import { ContactManager } from '@/components/email/ContactManager';
import { EmailComposer } from '@/components/email/EmailComposer';
import { CampaignDashboard } from '@/components/email/CampaignDashboard';
import { EmailPreview } from '@/components/email/EmailPreview';

export default function EmailMarketing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [smtpStatus, setSMTPStatus] = useState<'pending' | 'configured' | 'verified'>('pending');
  const [dnsStatus, setDNSStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [contactCount, setContactCount] = useState(0);
  const [campaignStats, setCampaignStats] = useState({
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0
  });

  // Mock real-time stats update
  useEffect(() => {
    const interval = setInterval(() => {
      if (campaignStats.sent > 0) {
        setCampaignStats(prev => ({
          ...prev,
          delivered: Math.min(prev.delivered + Math.floor(Math.random() * 3), prev.sent),
          opened: Math.floor(prev.sent * (0.2 + Math.random() * 0.15)),
          clicked: Math.floor(prev.sent * (0.05 + Math.random() * 0.08))
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [campaignStats.sent]);

  const getStatusColor = (status: string) => {
    if (status === 'verified' || status === 'configured') return 'text-green-600 bg-green-50';
    if (status === 'pending') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'verified' || status === 'configured') return <CheckCircle className="h-3 w-3" />;
    if (status === 'pending') return <AlertCircle className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="smtp" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                SMTP Setup
              </TabsTrigger>
              <TabsTrigger value="dns" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                DNS Verification
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Compose
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <CampaignDashboard 
                stats={campaignStats}
                onStatsUpdate={setCampaignStats}
              />
            </TabsContent>

            <TabsContent value="smtp" className="space-y-6">
              <SMTPConfiguration 
                status={smtpStatus}
                onStatusChange={setSMTPStatus}
              />
            </TabsContent>

            <TabsContent value="dns" className="space-y-6">
              <DNSVerification 
                status={dnsStatus}
                onStatusChange={setDNSStatus}
              />
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <ContactManager 
                onContactCountChange={setContactCount}
              />
            </TabsContent>

            <TabsContent value="compose" className="space-y-6">
              <EmailComposer 
                contactCount={contactCount}
                smtpConfigured={smtpStatus === 'configured'}
                dnsVerified={dnsStatus === 'verified'}
                onCampaignStart={(stats) => setCampaignStats(stats)}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <EmailPreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
