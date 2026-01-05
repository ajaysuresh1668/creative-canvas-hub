import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="glass-card border-b border-border/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Navigation */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:inline">Free Edit Hub</span>
            </Link>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {icon}
            </div>
            <div className="hidden md:block text-left">
              <h1 className="text-lg font-bold gradient-text">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="glass" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
