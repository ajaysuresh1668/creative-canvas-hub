import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Zap, Sparkles, Star, Shield, Clock, Download } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 animate-fade-in border border-primary/30 hover:border-primary/50 transition-colors group cursor-pointer">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">100% Free • No Watermarks • Unlimited Access</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Main Heading with enhanced gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in animation-delay-200 leading-tight">
            <span className="block text-foreground">Edit Everything</span>
            <span className="relative inline-block">
              <span className="gradient-text">Without Limits</span>
              <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-primary animate-bounce-subtle hidden md:block" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in animation-delay-400 leading-relaxed">
            Transform your <span className="text-primary font-semibold">text</span>, <span className="text-secondary font-semibold">images</span>, <span className="text-accent font-semibold">videos</span>, <span className="text-success font-semibold">audio</span>, and <span className="text-warning font-semibold">documents</span> with our powerful free editing suite.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-600">
            <Link to="/image-editor">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Editing Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              Watch Demo
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in animation-delay-800">
            {[
              { icon: Shield, text: 'Privacy First', color: 'text-success' },
              { icon: Clock, text: 'Instant Processing', color: 'text-primary' },
              { icon: Download, text: 'All Formats', color: 'text-secondary' },
              { icon: Star, text: 'Pro Features Free', color: 'text-warning' },
            ].map((item, index) => (
              <div 
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors cursor-default"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Stats with enhanced styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto animate-fade-in animation-delay-1000">
            {[
              { value: '5+', label: 'Editor Types', color: 'from-primary to-accent' },
              { value: '100%', label: 'Free Forever', color: 'from-secondary to-primary' },
              { value: '0', label: 'Watermarks', color: 'from-accent to-secondary' },
              { value: '∞', label: 'Possibilities', color: 'from-success to-primary' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group cursor-default">
                <div className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default HeroSection;
