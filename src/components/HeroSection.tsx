import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star, Shield, Clock, Download, Zap, Image, Video, Music, FileText } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 animate-fade-in border border-primary/30 hover:border-primary/50 transition-colors group cursor-pointer hover:scale-105 duration-300">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">100% Free • No Watermarks • Unlimited Access</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Main Heading with enhanced gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in animation-delay-200 leading-tight">
            <span className="block text-foreground">Edit Everything</span>
            <span className="relative inline-block">
              <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">Without Limits</span>
            </span>
          </h1>

          {/* Subheading with enhanced colors */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in animation-delay-400 leading-relaxed">
            Transform your{' '}
            <span className="text-primary font-semibold">text</span>,{' '}
            <span className="text-secondary font-semibold">images</span>,{' '}
            <span className="text-accent font-semibold">videos</span>,{' '}
            <span className="text-success font-semibold">audio</span>, and{' '}
            <span className="text-warning font-semibold">documents</span>{' '}
            with our powerful free editing suite.
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-600">
            <Link to="/image-editor">
              <Button variant="hero" size="xl" className="group relative overflow-hidden shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <span className="relative z-10 flex items-center gap-2">
                  Start Editing Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Button variant="glass" size="xl" className="group shadow-xl hover:shadow-2xl transition-shadow">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              Watch Demo
            </Button>
          </div>

          {/* Quick access editor icons */}
          <div className="flex items-center justify-center gap-4 mt-10 animate-fade-in animation-delay-800">
            {[
              { icon: FileText, to: '/text-editor', color: 'text-primary', label: 'Text' },
              { icon: Image, to: '/image-editor', color: 'text-secondary', label: 'Image' },
              { icon: Video, to: '/video-editor', color: 'text-accent', label: 'Video' },
              { icon: Music, to: '/audio-editor', color: 'text-success', label: 'Audio' },
            ].map((item) => (
              <Link key={item.label} to={item.to}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-card hover:scale-110 transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary/30">
                  <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Feature pills with enhanced hover effects */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in animation-delay-1000">
            {[
              { icon: Shield, text: 'Privacy First', color: 'text-success', bgColor: 'hover:bg-success/10' },
              { icon: Clock, text: 'Instant Processing', color: 'text-primary', bgColor: 'hover:bg-primary/10' },
              { icon: Download, text: 'All Formats', color: 'text-secondary', bgColor: 'hover:bg-secondary/10' },
              { icon: Zap, text: 'Pro Features Free', color: 'text-warning', bgColor: 'hover:bg-warning/10' },
            ].map((item) => (
              <div 
                key={item.text}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/30 hover:border-primary/50 ${item.bgColor} transition-all cursor-default hover:scale-105 duration-300 group`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Stats with enhanced styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto animate-fade-in animation-delay-1000">
            {[
              { value: '5+', label: 'Editor Types', color: 'from-primary to-accent', emoji: '🛠️' },
              { value: '100%', label: 'Free Forever', color: 'from-secondary to-primary', emoji: '💯' },
              { value: '0', label: 'Watermarks', color: 'from-accent to-secondary', emoji: '✨' },
              { value: '∞', label: 'Possibilities', color: 'from-success to-primary', emoji: '🚀' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group cursor-default hover:scale-110 transition-transform duration-300">
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Side gradient glows */}
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
    </section>
  );
};

export default HeroSection;
