import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword } from '@/utils/authValidation';
import { ArrowLeft, Github, Infinity } from 'lucide-react';

const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 533.5 544.3" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.4 34.5-25.6 63.7-54.6 83.3v68h88.2c51.6-47.6 80-117.6 80-196.1z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.3 180.8-66.1l-88.2-68c-24.5 16.5-55.6 26.3-92.6 26.3-71 0-131.2-47.9-152.8-112.1H32.5v70.7C77.7 486.8 168.8 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M119.2 325.1c-10.8-32.3-10.8-66.7 0-99 0-0.1 0-0.1 0-0.1V155.3H32.5C11.9 202.6 0 246.1 0 292.7s11.9 90.1 32.5 137.4l86.7-104.9z"/>
    <path fill="#EA4335" d="M272 107.7c39.8 0 75.6 13.7 103.8 40.5l77.9-77.9C403.2 24.7 342 0 272 0 168.8 0 77.7 57.5 32.5 144l86.7 70.7C140.8 155.6 201 107.7 272 107.7z"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTos, setAcceptTos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      toast({ title: 'Name required', description: 'Please enter your full name.', variant: 'destructive' });
      return;
    }

    if (!validateEmail(email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.isValid) {
      toast({ title: 'Invalid password', description: pwCheck.message, variant: 'destructive' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure both passwords match.', variant: 'destructive' });
      return;
    }

    if (!acceptTos) {
      toast({ title: 'Accept Terms', description: 'You must accept the Terms of Service and Privacy Policy.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.signUp({ email, password, firstName: name });

      if (!result.success) {
        toast({ title: 'Signup failed', description: result.error || 'Unable to create account.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      if (result.requiresEmailVerification) {
        toast({
          title: 'Check your inbox',
          description: 'We sent a confirmation email. Please verify your address before signing in.',
        });
        // Redirect to a friendly confirmation page or login
        navigate('/login?mode=signup');
        return;
      }

      // If signed up and immediately confirmed, navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({ title: 'Signup error', description: err?.message || 'Unexpected error. Try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + '/dashboard' }
      } as any);

      if (error) {
        toast({ title: 'Social sign in failed', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      console.error('OAuth error:', error);
      toast({ title: 'OAuth error', description: 'Failed to sign in with provider', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Benefits / Marketing */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Infinity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Create your Backlink ∞ account</h1>
                <p className="text-sm text-muted-foreground">Get access to backlink insights, rank tracking, and premium tools.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <h3 className="text-lg font-semibold">Why join?</h3>
                <ul className="mt-2 text-sm space-y-2 text-muted-foreground">
                  <li>• Real-time backlink analysis and rank tracking</li>
                  <li>• Automated reports and actionable recommendations</li>
                  <li>• Priority access to premium features</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-background/50">
                <h4 className="text-sm font-medium">Privacy</h4>
                <p className="text-xs text-muted-foreground mt-1">We never sell your data. Your account will be protected and encrypted.</p>
              </div>
            </div>
          </section>

          {/* Right: Form */}
          <section>
            <Card>
              <CardHeader className="px-6 pt-6">
                <CardTitle>Create account</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full name</label>
                    <Input placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Password</label>
                      <Input type="password" placeholder="Choose a secure password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirm password</label>
                      <Input type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox checked={acceptTos} onCheckedChange={(v: any) => setAcceptTos(!!v)} />
                    <div className="text-sm text-muted-foreground">
                      I agree to the <a className="text-primary underline" href="/terms-of-service">Terms of Service</a> and <a className="text-primary underline" href="/privacy-policy">Privacy Policy</a>.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Back
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <hr className="flex-1" />
                    <span className="text-xs text-muted-foreground">Or continue with</span>
                    <hr className="flex-1" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="softOutline" className="flex-1" onClick={() => handleOAuth('google')}>
                      <GoogleIcon className="h-4 w-4 mr-2" /> Google
                    </Button>
                    <Button variant="softOutline" className="flex-1" onClick={() => handleOAuth('github')}>
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">By continuing, you agree to our terms and consent to receive transactional emails.</p>
                </form>
              </CardContent>
            </Card>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary underline">Sign in</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
