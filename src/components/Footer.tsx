import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const footerLinks = {
  tools: [
    { name: 'Text Editor', href: '/text-editor' },
    { name: 'Image Editor', href: '/image-editor' },
    { name: 'Video Editor', href: '/video-editor' },
    { name: 'Audio Editor', href: '/audio-editor' },
    { name: 'Document Editor', href: '/document-editor' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border/20 bg-card/30 backdrop-blur-sm">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
                <Sparkles className="w-5 h-5 text-primary-foreground relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-xl font-bold gradient-text">Free Edit Hub</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm sm:text-base leading-relaxed">
              The ultimate free editing suite for all your creative needs. No subscriptions, no watermarks, just pure editing power.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-border/30 hover:border-primary/30 group">
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-border/30 hover:border-primary/30 group">
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-border/30 hover:border-primary/30 group">
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <ThemeToggle />
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Tools</h4>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Free Edit Hub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-secondary fill-secondary animate-pulse" /> for creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
