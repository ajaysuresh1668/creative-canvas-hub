import React from 'react';

const letters = [
  { char: 'E', top: '8%', left: '3%', color: 'text-primary/25', size: 'text-7xl md:text-9xl' },
  { char: 'D', top: '15%', left: '88%', color: 'text-secondary/25', size: 'text-6xl md:text-8xl' },
  { char: 'I', top: '55%', left: '8%', color: 'text-accent/25', size: 'text-8xl md:text-9xl' },
  { char: 'T', top: '72%', left: '92%', color: 'text-primary/20', size: 'text-7xl md:text-8xl' },
  { char: 'F', top: '12%', left: '42%', color: 'text-secondary/20', size: 'text-6xl md:text-7xl' },
  { char: 'R', top: '82%', left: '48%', color: 'text-accent/20', size: 'text-7xl md:text-8xl' },
  { char: 'E', top: '35%', left: '2%', color: 'text-primary/20', size: 'text-6xl md:text-7xl' },
  { char: 'H', top: '25%', left: '78%', color: 'text-secondary/20', size: 'text-8xl md:text-9xl' },
  { char: 'U', top: '48%', left: '82%', color: 'text-accent/25', size: 'text-6xl md:text-8xl' },
  { char: 'B', top: '88%', left: '18%', color: 'text-primary/20', size: 'text-7xl md:text-8xl' },
  { char: 'A', top: '5%', left: '62%', color: 'text-secondary/15', size: 'text-5xl md:text-6xl' },
  { char: 'X', top: '42%', left: '95%', color: 'text-accent/15', size: 'text-6xl md:text-7xl' },
  { char: '✦', top: '18%', left: '25%', color: 'text-primary/30', size: 'text-4xl md:text-5xl' },
  { char: '◆', top: '65%', left: '35%', color: 'text-secondary/25', size: 'text-3xl md:text-4xl' },
  { char: '●', top: '78%', left: '72%', color: 'text-accent/20', size: 'text-4xl md:text-5xl' },
  { char: '★', top: '32%', left: '55%', color: 'text-primary/20', size: 'text-5xl md:text-6xl' },
  { char: '◇', top: '92%', left: '85%', color: 'text-secondary/15', size: 'text-3xl md:text-4xl' },
  { char: '○', top: '3%', left: '15%', color: 'text-accent/25', size: 'text-4xl md:text-5xl' },
];

const FloatingLetters: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`floating-letter ${letter.color} ${letter.size}`}
          style={{
            top: letter.top,
            left: letter.left,
            animationDelay: `${index * 0.3}s`,
          }}
        >
          {letter.char}
        </span>
      ))}
      
      {/* Enhanced Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow animation-delay-400" />
      <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-accent/8 rounded-full blur-[80px] animate-pulse-glow animation-delay-800" />
      <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-primary/6 rounded-full blur-[100px] animate-pulse-glow animation-delay-600" />
      <div className="absolute top-[10%] right-[15%] w-[250px] h-[250px] bg-secondary/8 rounded-full blur-[90px] animate-pulse-glow animation-delay-200" />
      <div className="absolute bottom-[15%] left-[10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[70px] animate-pulse-glow animation-delay-1000" />
      
      {/* Animated gradient lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent animate-shimmer animation-delay-500" />
    </div>
  );
};

export default FloatingLetters;
