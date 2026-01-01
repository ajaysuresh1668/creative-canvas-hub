import React from 'react';

const letters = [
  { char: 'E', top: '10%', left: '5%', color: 'text-primary/20' },
  { char: 'D', top: '20%', left: '85%', color: 'text-secondary/20' },
  { char: 'I', top: '60%', left: '10%', color: 'text-accent/20' },
  { char: 'T', top: '70%', left: '90%', color: 'text-primary/20' },
  { char: 'F', top: '15%', left: '45%', color: 'text-secondary/15' },
  { char: 'R', top: '80%', left: '50%', color: 'text-accent/15' },
  { char: 'E', top: '40%', left: '3%', color: 'text-primary/15' },
  { char: 'H', top: '30%', left: '75%', color: 'text-secondary/15' },
  { char: 'U', top: '55%', left: '80%', color: 'text-accent/20' },
  { char: 'B', top: '85%', left: '20%', color: 'text-primary/15' },
  { char: 'A', top: '5%', left: '65%', color: 'text-secondary/10' },
  { char: 'X', top: '45%', left: '95%', color: 'text-accent/10' },
];

const FloatingLetters: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`floating-letter ${letter.color}`}
          style={{
            top: letter.top,
            left: letter.left,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          {letter.char}
        </span>
      ))}
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow animation-delay-800" />
    </div>
  );
};

export default FloatingLetters;
