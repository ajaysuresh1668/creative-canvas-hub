import React, { useEffect, useState } from 'react';

const BackgroundEffects: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle gradient orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-secondary/8 via-secondary/3 to-transparent rounded-full blur-[100px] animate-pulse-glow animation-delay-400" />
      <div className="absolute top-[45%] right-[20%] w-[350px] h-[350px] bg-gradient-radial from-accent/6 via-accent/2 to-transparent rounded-full blur-[80px] animate-pulse-glow animation-delay-800" />
      <div className="absolute bottom-[25%] left-[20%] w-[380px] h-[380px] bg-gradient-radial from-success/5 via-success/2 to-transparent rounded-full blur-[90px] animate-pulse-glow animation-delay-600" />
      
      {/* Interactive glow following cursor */}
      <div 
        className="absolute w-[250px] h-[250px] bg-gradient-radial from-primary/4 via-accent/2 to-transparent rounded-full blur-[50px] transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 125,
          top: mousePosition.y - 125,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
    </div>
  );
};

export default BackgroundEffects;
