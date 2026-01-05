import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/30 transition-all duration-300 group overflow-hidden"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-warning transition-transform duration-300 group-hover:rotate-180" />
        ) : (
          <Moon className="w-5 h-5 text-accent transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
      
      {/* Animated background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
      </div>
      
      {/* Sparkle effect on hover */}
      <Sparkles className="absolute top-0 right-0 w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
    </button>
  );
};

export default ThemeToggle;
