import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const benefits = [
  'No subscription required',
  'No watermarks ever',
  'Unlimited exports',
  'All features included',
  'Cloud storage available',
  'Real-time collaboration',
];

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main content */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Create{' '}
            <span className="gradient-text">Something Amazing?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators who edit their content for free. No credit card required, no strings attached.
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {benefit}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button variant="hero" size="xl" className="group">
            Start Creating for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            No account needed • Start editing in seconds
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
