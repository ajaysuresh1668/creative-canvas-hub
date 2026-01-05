import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface EditorHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="glass-card border-b border-border/20 sticky top-0 z-40 backdrop-blur-xl">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Back Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <Sparkles className="w-4 h-4 text-primary-foreground relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-bold gradient-text hidden md:inline">Free Edit Hub</span>
            </Link>
          </div>

          {/* Title - Center */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border/30">
              {icon}
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="text-base sm:text-lg font-bold gradient-text">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="hidden sm:block">
              <Button variant="glass" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
