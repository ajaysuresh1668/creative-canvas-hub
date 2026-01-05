import React from 'react';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  href: string;
  gradient: 'primary' | 'secondary' | 'accent';
}

const gradientStyles = {
  primary: 'from-primary/15 via-primary/5 to-transparent hover:from-primary/25 hover:via-primary/10 border-primary/20 hover:border-primary/40',
  secondary: 'from-secondary/15 via-secondary/5 to-transparent hover:from-secondary/25 hover:via-secondary/10 border-secondary/20 hover:border-secondary/40',
  accent: 'from-accent/15 via-accent/5 to-transparent hover:from-accent/25 hover:via-accent/10 border-accent/20 hover:border-accent/40',
};

const iconStyles = {
  primary: 'bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-lg shadow-primary/20',
  secondary: 'bg-gradient-to-br from-secondary/30 to-secondary/10 text-secondary shadow-lg shadow-secondary/20',
  accent: 'bg-gradient-to-br from-accent/30 to-accent/10 text-accent shadow-lg shadow-accent/20',
};

const buttonStyles = {
  primary: 'hover:bg-primary/20 hover:border-primary/40',
  secondary: 'hover:bg-secondary/20 hover:border-secondary/40',
  accent: 'hover:bg-accent/20 hover:border-accent/40',
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  features,
  href,
  gradient,
}) => {
  return (
    <div
      className={`group relative rounded-3xl bg-gradient-to-br ${gradientStyles[gradient]} border backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden`}
    >
      {/* Decorative sparkle */}
      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
      
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${gradient === 'primary' ? 'from-primary/20' : gradient === 'secondary' ? 'from-secondary/20' : 'from-accent/20'} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />
      
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${iconStyles[gradient]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        <Icon className="w-7 h-7" />
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-foreground transition-colors">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">{description}</p>

      {/* Features List */}
      <ul className="space-y-2.5 mb-8">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${gradient === 'primary' ? 'bg-primary' : gradient === 'secondary' ? 'bg-secondary' : 'bg-accent'} shadow-sm ${gradient === 'primary' ? 'shadow-primary/50' : gradient === 'secondary' ? 'shadow-secondary/50' : 'shadow-accent/50'}`} />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link to={href} className="block">
        <Button variant="glass" className={`w-full group/btn ${buttonStyles[gradient]} transition-all duration-300`}>
          <span className="flex items-center gap-2">
            Open Editor
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default FeatureCard;
