import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlobalBlogGenerator } from '@/components/GlobalBlogGenerator';
import { SocialProofTestimonials, LiveUserActivity, UsageStats } from '@/components/SocialProofElements';
import { useAuthStatus } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

import { 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  TrendingUp,
  Users,
  Zap,
  Target,
  BarChart3,
  CheckCircle
} from 'lucide-react';

export function BlogCreator() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStatus();
  const [generatedPost, setGeneratedPost] = useState<any>(null);

  const handleBlogGenerated = (blogPost: any) => {
    setGeneratedPost(blogPost);
    setTimeout(() => {
      navigate(`/blog/${blogPost.slug}`);
    }, 2000);
  };

  const features = [
    {
      icon: Globe,
      title: "Global Context",
      description: "AI analyzes worldwide trends and user inputs to create relevant content"
    },
    {
      icon: Target,
      title: "Natural Backlinks",
      description: "Contextual links that feel organic and provide genuine value to readers"
    },
    {
      icon: BarChart3,
      title: "SEO Optimized",
      description: "Content structured for maximum search engine visibility and ranking"
    },
    {
      icon: Zap,
      title: "Instant Publishing",
      description: "Posts are immediately available and indexed for optimal SEO impact"
    }
  ];

  const benefits = [
    "📈 Boost search rankings with high-quality backlinks",
    "🌍 Content optimized for global audiences",
    "⚡ Generate posts in under 60 seconds",
    "🎯 Natural anchor text integration",
    "📊 Built-in SEO score optimization",
    "🔗 Multi-link strategies for maximum impact"
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Sidebar - Features & Benefits */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Why Global Generation?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <UsageStats layout="vertical" />
            </div>

            {/* Center - Main Generator */}
            <div className="lg:col-span-2">
              <GlobalBlogGenerator 
                variant="blog"
                showAdvancedOptions={true}
                onSuccess={handleBlogGenerated}
              />
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by SEO Professionals Worldwide
              </h2>
              <p className="text-gray-600">
                See what our users are saying about our global blog generation platform
              </p>
            </div>
            
            <SocialProofTestimonials variant="full" />
          </div>

          {/* Call to Action */}
          {!isLoggedIn && (
            <div className="mt-16 bg-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Scale Your SEO?
              </h2>
              <p className="text-xl opacity-90 mb-6">
                Join thousands of professionals using our platform to build high-quality backlinks
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => navigate('/login')}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Full Access
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
