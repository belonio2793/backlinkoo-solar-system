import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DirectEmailService } from '@/services/directEmailService';
import { Mail, User, Type, Plus, Minus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

export default function Contact() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    if (user && (key === 'name' || key === 'email')) return;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user) {
      const fullName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || '';
      const derivedName = fullName || (user.email ? user.email.split('@')[0] : '');
      setForm(prev => ({
        ...prev,
        name: derivedName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const validate = () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: 'Valid email required', variant: 'destructive' });
      return false;
    }
    if (!form.subject.trim()) {
      toast({ title: 'Subject required', variant: 'destructive' });
      return false;
    }
    if (!form.message.trim()) {
      toast({ title: 'Message required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const composed = `From: ${form.name || 'Anonymous'} <${form.email}>\n\n${form.message}`;
      const result = await DirectEmailService.sendEmail({
        to: 'support@backlinkoo.com',
        subject: form.subject,
        message: composed
      });
      if (result.success) {
        toast({ title: 'Message sent', description: 'We will get back to you shortly.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast({ title: 'Failed to send', description: result.error || 'Please try again later.', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Unable to send message.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-6 w-6" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input id="name" placeholder="Your name" className={`pl-9 ${user ? 'pointer-events-none bg-gray-50' : ''}`} value={form.name} readOnly={!!user} onChange={(e) => handleChange('name', e.target.value)} />
                    {user && (
                      <div className="absolute inset-0 rounded-md" />
                    )}
                    {user && (
                      <div className="absolute right-2 top-2">
                        <Badge variant="secondary" className="text-[10px]">From account</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input id="email" type="email" required placeholder="you@example.com" className={`pl-9 ${user ? 'pointer-events-none bg-gray-50' : ''}`} value={form.email} readOnly={!!user} onChange={(e) => handleChange('email', e.target.value)} />
                    {user && (
                      <div className="absolute inset-0 rounded-md" />
                    )}
                    {user && (
                      <div className="absolute right-2 top-2">
                        <Badge variant="secondary" className="text-[10px]">From account</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <div className="relative">
                  <Type className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input id="subject" required placeholder="How can we help?" className="pl-9" value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" required rows={6} placeholder="Write your message..." value={form.message} onChange={(e) => handleChange('message', e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100 shadow-md">
            <CardHeader className="bg-white/60 rounded-t-lg border-b">
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="group flex items-center justify-between px-4 py-3 rounded-md bg-white/80 hover:bg-white border transition shadow-sm [&>svg]:hidden">
                    <span className="text-left">How quickly will you respond?</span>
                    <span className="ml-4">
                      <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                      <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white/70 border rounded-md px-4 py-3 mt-2">
                    We typically reply within 24 hours on business days. Premium users receive priority support.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="group flex items-center justify-between px-4 py-3 rounded-md bg-white/80 hover:bg-white border transition shadow-sm [&>svg]:hidden">
                    <span className="text-left">Do I need an account to contact support?</span>
                    <span className="ml-4">
                      <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                      <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white/70 border rounded-md px-4 py-3 mt-2">
                    No. However, if you are signed in we automatically use your account name and email for faster assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-none">
                  <AccordionTrigger className="group flex items-center justify-between px-4 py-3 rounded-md bg-white/80 hover:bg-white border transition shadow-sm [&>svg]:hidden">
                    <span className="text-left">What information should I include?</span>
                    <span className="ml-4">
                      <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                      <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white/70 border rounded-md px-4 py-3 mt-2">
                    Include a short description, relevant URLs, screenshots, and the email tied to your account if applicable.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
