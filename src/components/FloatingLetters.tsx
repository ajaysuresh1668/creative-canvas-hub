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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const allElements = [...staticLetters, ...symbols];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Letters */}
      {allElements.map((letter, index) => (
        <span
          key={index}
          className={`floating-letter ${letter.color} ${letter.size} font-black select-none`}
          style={{
            top: letter.top,
            left: letter.left,
            animationDelay: `${index * 0.2}s`,
            transform: `rotate(${letter.rotation || 0}deg)`,
            textShadow: '0 0 30px currentColor',
          }}
        >
          {letter.char}
        </span>
      ))}
      
      {/* Main gradient orbs - super vibrant */}
      <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent rounded-full blur-[100px] animate-pulse-glow animation-delay-400" />
      <div className="absolute top-[50%] right-[25%] w-[400px] h-[400px] bg-gradient-radial from-accent/12 via-accent/4 to-transparent rounded-full blur-[80px] animate-pulse-glow animation-delay-800" />
      <div className="absolute bottom-[30%] left-[25%] w-[450px] h-[450px] bg-gradient-radial from-success/10 via-success/3 to-transparent rounded-full blur-[90px] animate-pulse-glow animation-delay-600" />
      
      {/* Secondary orbs */}
      <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-gradient-radial from-warning/12 via-warning/4 to-transparent rounded-full blur-[70px] animate-pulse-glow animation-delay-200" />
      <div className="absolute bottom-[10%] left-[5%] w-[250px] h-[250px] bg-gradient-radial from-info/15 via-info/5 to-transparent rounded-full blur-[60px] animate-pulse-glow animation-delay-1000" />
      <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] bg-gradient-radial from-primary/10 via-primary/3 to-transparent rounded-full blur-[50px] animate-pulse-glow animation-delay-500" />
      <div className="absolute bottom-[50%] right-[5%] w-[180px] h-[180px] bg-gradient-radial from-secondary/12 via-secondary/4 to-transparent rounded-full blur-[45px] animate-pulse-glow animation-delay-800" />
      
      {/* Interactive glow following cursor */}
      <div 
        className="absolute w-[300px] h-[300px] bg-gradient-radial from-primary/8 via-accent/4 to-transparent rounded-full blur-[60px] transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      />
      
      {/* Animated gradient lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-shimmer" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-shimmer animation-delay-500" />
      <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-accent/30 to-transparent animate-shimmer animation-delay-200" />
      <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-shimmer animation-delay-800" />
      
      {/* Diagonal decorative lines */}
      <div className="absolute top-[20%] left-[10%] w-[200px] h-[1px] bg-gradient-to-r from-primary/30 to-transparent rotate-45 animate-pulse" />
      <div className="absolute bottom-[25%] right-[15%] w-[150px] h-[1px] bg-gradient-to-r from-secondary/30 to-transparent -rotate-45 animate-pulse animation-delay-400" />
      <div className="absolute top-[60%] left-[70%] w-[180px] h-[1px] bg-gradient-to-r from-accent/25 to-transparent rotate-12 animate-pulse animation-delay-600" />
    </div>
  );
};

export default FloatingLetters;
