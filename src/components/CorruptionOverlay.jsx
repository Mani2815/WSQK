import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { generateScreenTears } from '../utils/glitchController';

const CorruptionOverlay = () => {
  const [screenTears, setScreenTears] = useState([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Generate screen tears
    setScreenTears(generateScreenTears(8));

    // Regenerate tears periodically
    const tearInterval = setInterval(() => {
      setScreenTears(generateScreenTears(8));
    }, 3000);

    return () => clearInterval(tearInterval);
  }, []);

  useEffect(() => {
    if (overlayRef.current) {
      // Random color inversions
      const colorInterval = setInterval(() => {
        gsap.to(overlayRef.current, {
          duration: 0.1,
          filter: `invert(${Math.random()}) hue-rotate(${Math.random() * 360}deg)`,
          yoyo: true,
          repeat: 1
        });
      }, 1000);

      return () => clearInterval(colorInterval);
    }
  }, []);

  return (
    <>
      {/* Main corruption overlay */}
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'difference' }}
      >
        {/* Intense static */}
        <div className="static-overlay opacity-70" />
        
        {/* Random color flashes */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: [
              'rgba(255, 0, 102, 0.1)',
              'rgba(0, 255, 255, 0.1)',
              'rgba(255, 0, 102, 0.1)',
            ]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </motion.div>

      {/* Screen tears */}
      {screenTears.map((tear, index) => (
        <motion.div
          key={index}
          className="fixed left-0 right-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-40"
          style={{
            top: `${tear.top}%`,
            height: `${tear.height}px`,
            opacity: tear.opacity,
          }}
          animate={{
            x: [0, tear.offset, -tear.offset, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}

      {/* Chromatic aberration overlay */}
      <div className="fixed inset-0 pointer-events-none z-45">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(90deg, red 0%, transparent 50%, cyan 100%)',
            mixBlendMode: 'screen'
          }}
          animate={{
            x: [-2, 2, -2],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Random pixel corruption */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white"
            style={{
              width: `${Math.random() * 5 + 1}px`,
              height: `${Math.random() * 5 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 0.5 + 0.3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scanline distortion */}
      <motion.div
        className="fixed left-0 right-0 h-1 bg-white opacity-50 pointer-events-none z-55"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Vignette intensifier */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(circle, transparent 0%, rgba(255, 0, 102, 0.3) 100%)'
        }}
      />

      {/* Flicker overlay */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-60"
        animate={{
          opacity: [0, 0.3, 0, 0.5, 0, 0.2, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
        }}
      />
    </>
  );
};

export default CorruptionOverlay;
