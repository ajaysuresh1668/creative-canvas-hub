import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Sparkles, Zap, Users, Globe } from 'lucide-react';

const benefits = [
  'No subscription required',
  'No watermarks ever',
  'Unlimited exports',
  'All features included',
  'Works offline',
  'Privacy focused',
];

const stats = [
  { icon: Users, value: '10K+', label: 'Active Users' },
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: Zap, value: '1M+', label: 'Files Edited' },
];

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-radial from-accent/10 via-accent/3 to-transparent rounded-full blur-2xl animate-pulse-glow animation-delay-600" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/20 border border-border/20 hover:border-primary/30 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Start for Free Today</span>
            </div>

            {/* Main content */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Ready to Create{' '}
              <span className="gradient-text">Something Amazing?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of creators who edit their content for free. No credit card required, no strings attached.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/image-editor">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  <span className="flex items-center gap-2">
                    Start Creating for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Button variant="glass" size="xl" className="w-full sm:w-auto">
                View All Editors
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              No account needed • Start editing in seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
