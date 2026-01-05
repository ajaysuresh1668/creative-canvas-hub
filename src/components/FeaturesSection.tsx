import React from 'react';
import FeatureCard from './FeatureCard';
import { Type, Image, Video, Music, FileText, Wand2, Sparkles, Zap, Shield } from 'lucide-react';

const features = [
  {
    title: 'Text Editor',
    description: 'Rich text editing with AI-powered formatting suggestions.',
    icon: Type,
    features: [
      'Smart text transformation',
      'Reading time analysis',
      'Multiple export formats',
      'Auto-save & history',
    ],
    href: '/text-editor',
    gradient: 'primary' as const,
  },
  {
    title: 'Image Editor',
    description: 'Professional editing with unique filters and effects.',
    icon: Image,
    features: [
      '12+ artistic presets',
      'HSL & blur controls',
      'One-click enhancements',
      'Batch export options',
    ],
    href: '/image-editor',
    gradient: 'secondary' as const,
  },
  {
    title: 'Video Editor',
    description: 'Cinematic editing with timeline and speed controls.',
    icon: Video,
    features: [
      'Frame-perfect trimming',
      '8 cinematic filters',
      'Variable speed (0.25x-3x)',
      'HD export ready',
    ],
    href: '/video-editor',
    gradient: 'accent' as const,
  },
  {
    title: 'Audio Editor',
    description: 'Studio-quality audio tools with visual waveforms.',
    icon: Music,
    features: [
      'Visual waveform editing',
      '8 EQ presets',
      'Reverb & echo effects',
      'Pitch shifting',
    ],
    href: '/audio-editor',
    gradient: 'primary' as const,
  },
  {
    title: 'Document Editor',
    description: 'Complete document suite with Markdown support.',
    icon: FileText,
    features: [
      'Markdown preview',
      'Find & replace',
      'Code block formatting',
      'Multi-format export',
    ],
    href: '/document-editor',
    gradient: 'secondary' as const,
  },
];

const uniqueFeatures = [
  {
    icon: Wand2,
    title: 'AI-Powered',
    description: 'Smart suggestions and auto-enhancements',
    color: 'text-primary',
  },
  {
    icon: Sparkles,
    title: 'No Watermarks',
    description: 'Clean exports every single time',
    color: 'text-secondary',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Real-time previews, zero waiting',
    color: 'text-accent',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your files stay on your device',
    color: 'text-success',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-24" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">All-in-One Editing Suite</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            All Your Editing Tools,{' '}
            <span className="gradient-text-secondary">One Place</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From quick text edits to complex video projects, we've got everything you need.
          </p>
        </div>

        {/* Unique Features Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {uniqueFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-muted/20 border border-border/20 hover:border-primary/30 transition-all duration-300 group cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className={`w-8 h-8 ${feature.color} mb-2 group-hover:scale-110 transition-transform`} />
              <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
