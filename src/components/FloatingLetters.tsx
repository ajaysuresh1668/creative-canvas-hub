import React, { useEffect, useState } from 'react';

interface FloatingElement {
  char: string;
  top: string;
  left: string;
  color: string;
  size: string;
  rotation?: number;
  delay?: number;
}

const staticLetters: FloatingElement[] = [
  { char: 'E', top: '5%', left: '3%', color: 'text-primary/30', size: 'text-7xl md:text-9xl', rotation: -15 },
  { char: 'D', top: '12%', left: '88%', color: 'text-secondary/30', size: 'text-6xl md:text-8xl', rotation: 10 },
  { char: 'I', top: '52%', left: '5%', color: 'text-accent/30', size: 'text-8xl md:text-9xl', rotation: 5 },
  { char: 'T', top: '70%', left: '92%', color: 'text-primary/25', size: 'text-7xl md:text-8xl', rotation: -8 },
  { char: 'F', top: '10%', left: '42%', color: 'text-secondary/25', size: 'text-6xl md:text-7xl', rotation: 12 },
  { char: 'R', top: '78%', left: '48%', color: 'text-accent/25', size: 'text-7xl md:text-8xl', rotation: -5 },
  { char: 'E', top: '32%', left: '2%', color: 'text-primary/25', size: 'text-6xl md:text-7xl', rotation: 8 },
  { char: 'H', top: '22%', left: '78%', color: 'text-secondary/25', size: 'text-8xl md:text-9xl', rotation: -12 },
  { char: 'U', top: '45%', left: '85%', color: 'text-accent/30', size: 'text-6xl md:text-8xl', rotation: 15 },
  { char: 'B', top: '85%', left: '15%', color: 'text-primary/25', size: 'text-7xl md:text-8xl', rotation: -10 },
  { char: 'A', top: '3%', left: '62%', color: 'text-secondary/20', size: 'text-5xl md:text-6xl', rotation: 5 },
  { char: 'X', top: '40%', left: '95%', color: 'text-accent/20', size: 'text-6xl md:text-7xl', rotation: -15 },
  { char: 'P', top: '60%', left: '18%', color: 'text-primary/20', size: 'text-5xl md:text-6xl', rotation: 8 },
  { char: 'C', top: '88%', left: '72%', color: 'text-secondary/25', size: 'text-6xl md:text-7xl', rotation: -5 },
  { char: 'M', top: '15%', left: '25%', color: 'text-accent/20', size: 'text-5xl md:text-6xl', rotation: 12 },
  { char: 'V', top: '55%', left: '62%', color: 'text-primary/15', size: 'text-7xl md:text-8xl', rotation: -8 },
  { char: 'S', top: '38%', left: '35%', color: 'text-secondary/15', size: 'text-6xl md:text-7xl', rotation: 10 },
  { char: 'W', top: '75%', left: '38%', color: 'text-accent/20', size: 'text-5xl md:text-6xl', rotation: -12 },
];

const symbols: FloatingElement[] = [
  { char: '✦', top: '18%', left: '55%', color: 'text-primary/40', size: 'text-4xl md:text-5xl' },
  { char: '◆', top: '65%', left: '28%', color: 'text-secondary/35', size: 'text-3xl md:text-4xl' },
  { char: '●', top: '78%', left: '82%', color: 'text-accent/30', size: 'text-4xl md:text-5xl' },
  { char: '★', top: '28%', left: '68%', color: 'text-primary/30', size: 'text-5xl md:text-6xl' },
  { char: '◇', top: '92%', left: '58%', color: 'text-secondary/20', size: 'text-3xl md:text-4xl' },
  { char: '○', top: '3%', left: '18%', color: 'text-accent/35', size: 'text-4xl md:text-5xl' },
  { char: '△', top: '48%', left: '12%', color: 'text-primary/25', size: 'text-3xl md:text-4xl' },
  { char: '□', top: '35%', left: '92%', color: 'text-secondary/25', size: 'text-4xl md:text-5xl' },
  { char: '◈', top: '82%', left: '5%', color: 'text-accent/30', size: 'text-3xl md:text-4xl' },
  { char: '✧', top: '8%', left: '75%', color: 'text-primary/35', size: 'text-4xl md:text-5xl' },
  { char: '❖', top: '58%', left: '72%', color: 'text-secondary/25', size: 'text-3xl md:text-4xl' },
  { char: '⬡', top: '25%', left: '8%', color: 'text-accent/20', size: 'text-5xl md:text-6xl' },
  { char: '⬢', top: '68%', left: '52%', color: 'text-primary/20', size: 'text-4xl md:text-5xl' },
  { char: '⊕', top: '42%', left: '45%', color: 'text-secondary/20', size: 'text-3xl md:text-4xl' },
  { char: '⊗', top: '95%', left: '32%', color: 'text-accent/25', size: 'text-3xl md:text-4xl' },
];

const FloatingLetters: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Reduce elements when mouse is on screen
  const visibleLetters = isHovered ? staticLetters.slice(0, 8) : staticLetters;
  const visibleSymbols = isHovered ? symbols.slice(0, 6) : symbols;
  const allElements = [...visibleLetters, ...visibleSymbols];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Letters - reduced animation on hover */}
      {allElements.map((letter, index) => (
        <span
          key={index}
          className={`floating-letter ${letter.color} ${letter.size} font-black select-none transition-opacity duration-500`}
          style={{
            top: letter.top,
            left: letter.left,
            animationDelay: `${index * 0.2}s`,
            transform: `rotate(${letter.rotation || 0}deg)`,
            textShadow: '0 0 30px currentColor',
            opacity: isHovered ? 0.4 : 1,
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {letter.char}
        </span>
      ))}
      
      {/* Main gradient orbs - reduced on hover */}
      <div className={`absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-[100px] transition-opacity duration-500 ${isHovered ? 'opacity-50 animate-none' : 'animate-pulse-glow'}`} />
      <div className={`absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent rounded-full blur-[100px] transition-opacity duration-500 animation-delay-400 ${isHovered ? 'opacity-50 animate-none' : 'animate-pulse-glow'}`} />
      <div className={`absolute top-[50%] right-[25%] w-[400px] h-[400px] bg-gradient-radial from-accent/12 via-accent/4 to-transparent rounded-full blur-[80px] transition-opacity duration-500 animation-delay-800 ${isHovered ? 'opacity-50 animate-none' : 'animate-pulse-glow'}`} />
      <div className={`absolute bottom-[30%] left-[25%] w-[450px] h-[450px] bg-gradient-radial from-success/10 via-success/3 to-transparent rounded-full blur-[90px] transition-opacity duration-500 animation-delay-600 ${isHovered ? 'opacity-50 animate-none' : 'animate-pulse-glow'}`} />
      
      {/* Interactive glow following cursor - more subtle */}
      <div 
        className="absolute w-[200px] h-[200px] bg-gradient-radial from-primary/5 via-accent/3 to-transparent rounded-full blur-[40px] transition-all duration-700 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          opacity: isHovered ? 0.3 : 0.6,
        }}
      />
      
      {/* Animated gradient lines - hidden on hover */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'animate-shimmer'}`} />
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent transition-opacity duration-500 animation-delay-500 ${isHovered ? 'opacity-20' : 'animate-shimmer'}`} />
    </div>
  );
};

export default FloatingLetters;
