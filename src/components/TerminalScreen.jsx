import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TerminalScreen = ({ children, isPossessed }) => {
  const screenRef = useRef(null);

  useEffect(() => {
    if (isPossessed && screenRef.current) {
      // Random glitch bursts
      const glitchInterval = setInterval(() => {
        gsap.to(screenRef.current, {
          duration: 0.1,
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          skewX: Math.random() * 5 - 2.5,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }, Math.random() * 2000 + 500);

      return () => clearInterval(glitchInterval);
    } else if (screenRef.current) {
      // Reset position when not possessed
      gsap.to(screenRef.current, {
        duration: 0.3,
        x: 0,
        y: 0,
        skewX: 0,
        ease: 'power2.out'
      });
    }
  }, [isPossessed]);

  return (
    <motion.div
      ref={screenRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className={`
        flex-1 
        border-4 
        ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
        bg-black bg-opacity-90
        p-4 md:p-8
        relative
        overflow-hidden
        ${isPossessed ? 'shake' : ''}
      `}
      style={{
        boxShadow: isPossessed 
          ? '0 0 30px rgba(255, 0, 0, 0.5), inset 0 0 50px rgba(255, 0, 102, 0.1)'
          : '0 0 30px rgba(0, 255, 65, 0.3), inset 0 0 50px rgba(0, 255, 65, 0.1)'
      }}
    >
      {/* Terminal scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 65, 0.1) 50%)',
          backgroundSize: '100% 4px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col gap-6">
        {children}
      </div>

      {/* Screen flicker effect */}
      {isPossessed && (
        <div className="absolute inset-0 bg-white opacity-0 pointer-events-none animate-flicker" />
      )}
    </motion.div>
  );
};

export default TerminalScreen;
