import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  tier?: string;
  results?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Martinez",
    role: "Digital Marketing Manager",
    company: "TechFlow Solutions",
    content: "We saw steadier month-over-month improvements in visibility and a clearer process for content and outreach.",
    rating: 5,
    avatar: "SM",
    results: "Steady Organic Growth"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder & CEO",
    company: "GrowthLab",
    content: "Moved onto the first page for several target terms over a few months. Expectations were realistic and the workflow was manageable.",
    rating: 5,
    avatar: "MC",
    results: "First-Page Visibility"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "SEO Consultant",
    company: "Digital Boost Agency",
    content: "Useful as part of a broader toolkit—especially the reporting and audit trails when clients want transparency.",
    rating: 4,
    avatar: "ER",
    results: "Clearer Reporting"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "E-commerce Director",
    company: "SalesMaster Pro",
    content: "For our small ecommerce brand, link acquisition became more predictable and less ad‑hoc. Planning is easier now.",
    rating: 5,
    avatar: "DT",
    results: "Consistent Link Velocity"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Content Marketing Lead",
    company: "InnovateCorp",
    content: "The blog drafts gave our team head starts. We still edit heavily, but it reduces blank‑page time.",
    rating: 4,
    avatar: "LP",
    results: "Time Saved on Drafts"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Marketing Director",
    company: "ScaleUp Ventures",
    content: "Helpful for organizing outreach and tracking what’s live. Rankings improved gradually alongside on‑page work.",
    rating: 5,
    avatar: "JW",
    results: "Gradual Ranking Improvements"
  },
  {
    id: 7,
    name: "Rachel Foster",
    role: "Digital Strategy Manager",
    company: "BrandBoost Inc",
    content: "Local pages gained more visibility, and inbound calls picked up slightly after on‑page fixes plus consistent links.",
    rating: 4,
    avatar: "RF",
    results: "Improved Local Visibility"
  },
  {
    id: 8,
    name: "Alex Kumar",
    role: "SEO Specialist",
    company: "RankRise Media",
    content: "Clients appreciate the transparency. It’s easier to explain what’s happening and why when we review reports.",
    rating: 5,
    avatar: "AK",
    results: "Simpler Client Updates"
  },
  {
    id: 9,
    name: "Sophie Anderson",
    role: "Growth Marketing Manager",
    company: "StartupLaunch",
    content: "We noticed early movement after a few weeks and more compounding gains over the next quarter.",
    rating: 5,
    avatar: "SA",
    results: "Early Movement, Compounding Later"
  },
  {
    id: 10,
    name: "Marcus Johnson",
    role: "VP of Marketing",
    company: "NorthPeak",
    content: "Good balance between automation and control. Nothing felt spammy, and we could adjust pacing as needed.",
    rating: 5,
    avatar: "MJ",
    results: "Balanced Automation"
  },
  {
    id: 11,
    name: "Jennifer Walsh",
    role: "SEO Manager",
    company: "RetailMax",
    content: "Local and category pages became easier to manage once we standardized the process across teams.",
    rating: 4,
    avatar: "JWA",
    results: "Smoother Multi-Page Rollout"
  },
  {
    id: 12,
    name: "Roberto Silva",
    role: "Marketing Consultant",
    company: "RSC Advisory",
    content: "Support was responsive and pragmatic—no wild promises, just steady work and clear next steps.",
    rating: 5,
    avatar: "RS",
    results: "Reliable Support"
  },
  {
    id: 13,
    name: "Amanda Lee",
    role: "Digital Marketing Strategist",
    company: "ConnectDigital",
    content: "Outreach feels more structured, and follow‑ups don’t get lost. The process suits our team pace.",
    rating: 5,
    avatar: "AL",
    results: "Predictable Outreach"
  },
  {
    id: 14,
    name: "Thomas Wright",
    role: "Founder",
    company: "EcomSuccess",
    content: "Nothing overnight, but the momentum built nicely over a couple of months.",
    rating: 5,
    avatar: "TW",
    results: "Momentum Over Months"
  },
  {
    id: 15,
    name: "Maria Gonzalez",
    role: "Head of SEO",
    company: "Horizons Group",
    content: "International rollouts were smoother once we aligned naming, anchors, and calendars across markets.",
    rating: 4,
    avatar: "MG",
    results: "Smoother Multi-Market Process"
  }
];

interface AnimatedTestimonialsProps {
  className?: string;
  autoplaySpeed?: number;
  showDots?: boolean;
  showResults?: boolean;
}

export const AnimatedTestimonials: React.FC<AnimatedTestimonialsProps> = ({
  className = '',
  autoplaySpeed = 4000,
  showDots = true,
  showResults = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, autoplaySpeed);

      return () => clearInterval(interval);
    }
  }, [isHovered, autoplaySpeed]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className={`w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Trusted by Marketing Professionals Worldwide
        </h3>
        <p className="text-gray-600">
          See what our customers are saying about their experience with Backlink ∞
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {getVisibleTestimonials().map((testimonial, index) => (
          <Card 
            key={`${testimonial.id}-${currentIndex}`}
            className={`relative overflow-hidden border-2 transition-all duration-700 transform ${
              index === 1 
                ? 'scale-105 border-primary/30 shadow-lg bg-gradient-to-br from-primary/5 to-blue-50' 
                : 'border-gray-200 hover:border-primary/20 hover:shadow-md'
            } animate-in slide-in-from-bottom-4 fade-in`}
            style={{
              animationDelay: `${index * 200}ms`,
              animationDuration: '600ms'
            }}
          >
            <CardContent className="p-6">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg text-gray-800 mb-6 leading-relaxed font-medium bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border-l-4 border-primary/30">
                "{testimonial.content}"
              </p>

              {/* Results Badge */}
              {showResults && testimonial.results && (
                <Badge
                  variant="secondary"
                  className="mb-4 bg-green-100 text-green-800 border-green-200 inline-flex items-center"
                >
                  <span className="mr-2 text-sm" aria-hidden>✅</span>
                  <span className="font-semibold text-sm">{testimonial.results}</span>
                </Badge>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Shine effect for center testimonial */}
            {index === 1 && (
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Dots Navigation */}
      {showDots && (
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Stats Row - single centered stat */}
      <div className="mt-12 flex items-center justify-center gap-6 text-center">
        <div className="p-4">
          <div className="text-2xl font-bold text-primary">24/7</div>
          <div className="text-sm text-gray-600">Expert Support</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;
