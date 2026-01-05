import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star, Shield, Clock, Download } from 'lucide-react';

// Floating letters configuration for hero section
const heroFloatingElements = [
  { char: 'E', top: '8%', left: '5%', color: 'text-primary', size: 'text-6xl', delay: 0 },
  { char: 'D', top: '15%', left: '92%', color: 'text-secondary', size: 'text-5xl', delay: 0.3 },
  { char: 'I', top: '25%', left: '8%', color: 'text-accent', size: 'text-4xl', delay: 0.6 },
  { char: 'T', top: '12%', left: '80%', color: 'text-primary', size: 'text-5xl', delay: 0.9 },
  { char: '✨', top: '20%', left: '15%', color: 'text-warning', size: 'text-3xl', delay: 1.2 },
  { char: '🎨', top: '30%', left: '88%', color: 'text-primary', size: 'text-4xl', delay: 0.4 },
  { char: 'F', top: '35%', left: '3%', color: 'text-secondary', size: 'text-5xl', delay: 0.7 },
  { char: 'R', top: '40%', left: '95%', color: 'text-accent', size: 'text-4xl', delay: 1.0 },
  { char: 'E', top: '50%', left: '6%', color: 'text-primary', size: 'text-6xl', delay: 0.2 },
  { char: 'E', top: '55%', left: '90%', color: 'text-warning', size: 'text-5xl', delay: 0.5 },
  { char: '🖼️', top: '60%', left: '10%', color: 'text-secondary', size: 'text-3xl', delay: 0.8 },
  { char: '🎬', top: '65%', left: '85%', color: 'text-accent', size: 'text-4xl', delay: 1.1 },
  { char: 'H', top: '70%', left: '4%', color: 'text-primary', size: 'text-4xl', delay: 0.3 },
  { char: 'U', top: '75%', left: '93%', color: 'text-secondary', size: 'text-5xl', delay: 0.6 },
  { char: 'B', top: '80%', left: '7%', color: 'text-accent', size: 'text-5xl', delay: 0.9 },
  { char: '🎵', top: '85%', left: '88%', color: 'text-warning', size: 'text-3xl', delay: 1.2 },
  { char: '📝', top: '18%', left: '20%', color: 'text-success', size: 'text-2xl', delay: 0.4 },
  { char: '🌟', top: '45%', left: '12%', color: 'text-warning', size: 'text-3xl', delay: 0.7 },
  { char: '💫', top: '72%', left: '18%', color: 'text-primary', size: 'text-2xl', delay: 1.0 },
  { char: '⚡', top: '28%', left: '85%', color: 'text-accent', size: 'text-3xl', delay: 0.5 },
  { char: '🔥', top: '58%', left: '92%', color: 'text-warning', size: 'text-2xl', delay: 0.8 },
  { char: '✂️', top: '82%', left: '80%', color: 'text-secondary', size: 'text-3xl', delay: 1.1 },
];

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Floating letters specific to hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {heroFloatingElements.map((element, index) => (
          <span
            key={index}
            className={`absolute ${element.color} ${element.size} font-black select-none animate-float opacity-40 hover:opacity-80 transition-opacity`}
            style={{
              top: element.top,
              left: element.left,
              animationDelay: `${element.delay}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              textShadow: '0 0 30px currentColor, 0 0 60px currentColor',
              transform: `translateX(${(mousePosition.x - window.innerWidth / 2) * 0.01}px) translateY(${(mousePosition.y - window.innerHeight / 2) * 0.01}px)`,
            }}
          >
            {element.char}
          </span>
        ))}
        
        {/* Extra animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-secondary animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-accent animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-warning animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.3s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 animate-fade-in border border-primary/30 hover:border-primary/50 transition-colors group cursor-pointer hover:scale-105 duration-300">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">100% Free • No Watermarks • Unlimited Access</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Main Heading with enhanced gradient and floating effect */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in animation-delay-200 leading-tight">
            <span className="block text-foreground hover:scale-105 transition-transform duration-300 inline-block">Edit Everything</span>
            <span className="relative inline-block group">
              <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">Without Limits</span>
              <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-primary animate-bounce hidden md:block" />
              <Star className="absolute -bottom-2 -left-6 w-6 h-6 text-warning animate-pulse hidden md:block" />
            </span>
          </h1>

          {/* Subheading with enhanced colors */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in animation-delay-400 leading-relaxed">
            Transform your{' '}
            <span className="text-primary font-semibold hover:scale-110 inline-block transition-transform cursor-default">text</span>,{' '}
            <span className="text-secondary font-semibold hover:scale-110 inline-block transition-transform cursor-default">images</span>,{' '}
            <span className="text-accent font-semibold hover:scale-110 inline-block transition-transform cursor-default">videos</span>,{' '}
            <span className="text-success font-semibold hover:scale-110 inline-block transition-transform cursor-default">audio</span>, and{' '}
            <span className="text-warning font-semibold hover:scale-110 inline-block transition-transform cursor-default">documents</span>{' '}
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

          {/* Feature pills with enhanced hover effects */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in animation-delay-800">
            {[
              { icon: Shield, text: 'Privacy First', color: 'text-success', bgColor: 'hover:bg-success/10' },
              { icon: Clock, text: 'Instant Processing', color: 'text-primary', bgColor: 'hover:bg-primary/10' },
              { icon: Download, text: 'All Formats', color: 'text-secondary', bgColor: 'hover:bg-secondary/10' },
              { icon: Star, text: 'Pro Features Free', color: 'text-warning', bgColor: 'hover:bg-warning/10' },
            ].map((item, index) => (
              <div 
                key={item.text}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/30 hover:border-primary/50 ${item.bgColor} transition-all cursor-default hover:scale-105 duration-300 group`}
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <item.icon className={`w-4 h-4 ${item.color} group-hover:animate-bounce`} />
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
                <div className="text-2xl mb-1 group-hover:animate-bounce">{stat.emoji}</div>
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
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default HeroSection;