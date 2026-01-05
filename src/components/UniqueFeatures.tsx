import React from 'react';
import { 
  Wand2, Sparkles, Palette, Layers, Zap, Eye, 
  Fingerprint, Brain, Infinity, Shield, Clock, Rocket
} from 'lucide-react';

const uniqueFeatures = [
  {
    icon: Wand2,
    title: 'AI Auto-Enhance',
    description: 'One-click magic that analyzes and improves your content automatically',
    color: 'from-primary to-accent',
  },
  {
    icon: Fingerprint,
    title: 'No Account Required',
    description: 'Start editing immediately - your files never leave your device',
    color: 'from-secondary to-primary',
  },
  {
    icon: Brain,
    title: 'Smart Suggestions',
    description: 'Intelligent recommendations based on your editing patterns',
    color: 'from-accent to-secondary',
  },
  {
    icon: Layers,
    title: 'Non-Destructive Edits',
    description: 'Unlimited undo/redo with full edit history preserved',
    color: 'from-success to-primary',
  },
  {
    icon: Infinity,
    title: 'Unlimited Usage',
    description: 'No daily limits, no file size caps, no restrictions',
    color: 'from-warning to-secondary',
  },
  {
    icon: Rocket,
    title: 'Instant Processing',
    description: 'Real-time previews with zero lag or loading screens',
    color: 'from-info to-accent',
  },
];

const UniqueFeatures: React.FC = () => {
  return (
    <section className="relative py-16 overflow-hidden" id="unique-features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">What Makes Us Different</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Features You Won't Find{' '}
            <span className="gradient-text">Anywhere Else</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built tools that solve real problems, not just checkbox features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {uniqueFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card/30 border border-border/30 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background glow */}
              <div className={`absolute -inset-10 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Corner decoration */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-150 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueFeatures;
