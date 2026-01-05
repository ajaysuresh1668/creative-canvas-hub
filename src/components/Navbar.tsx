import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, FileText, Image, Video, Music, FileType } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Text', href: '/text-editor', icon: FileText, color: 'text-primary' },
    { name: 'Image', href: '/image-editor', icon: Image, color: 'text-secondary' },
    { name: 'Video', href: '/video-editor', icon: Video, color: 'text-accent' },
    { name: 'Audio', href: '/audio-editor', icon: Music, color: 'text-success' },
    { name: 'Documents', href: '/document-editor', icon: FileType, color: 'text-warning' },
    { name: 'Music', href: '/music-player', icon: Music, color: 'text-info' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <Sparkles className="w-5 h-5 text-primary-foreground relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">Free Edit Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
                >
                  <Icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="glass" size="sm">
              Sign In
            </Button>
            <Button variant="glow" size="sm" className="relative overflow-hidden group">
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl hover:bg-muted/50 transition-colors border border-border/30"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${link.color}`} />
                    {link.name}
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-4 px-4">
                <Button variant="glass" size="sm" className="flex-1">
                  Sign In
                </Button>
                <Button variant="glow" size="sm" className="flex-1">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
