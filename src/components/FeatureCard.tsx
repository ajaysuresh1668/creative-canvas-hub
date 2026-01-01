import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
  primary: 'from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border-primary/20',
  secondary: 'from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10 border-secondary/20',
  accent: 'from-accent/20 to-accent/5 hover:from-accent/30 hover:to-accent/10 border-accent/20',
};

const iconStyles = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  accent: 'bg-accent/20 text-accent',
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
      className={`group relative rounded-3xl bg-gradient-to-br ${gradientStyles[gradient]} border backdrop-blur-sm p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${iconStyles[gradient]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6">{description}</p>

      {/* Features List */}
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${gradient === 'primary' ? 'bg-primary' : gradient === 'secondary' ? 'bg-secondary' : 'bg-accent'}`} />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link to={href}>
        <Button variant="glass" className="w-full group/btn">
          Open Editor
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default FeatureCard;
