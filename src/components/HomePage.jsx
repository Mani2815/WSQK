import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HomePage = ({ onEnter }) => {
  const [glitchText, setGlitchText] = useState('wsqk');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = 'wsqk';
      const corrupted = glitchChars.split('').map(char =>
        Math.random() > 0.9 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char
      ).join('');
      setGlitchText(corrupted);
      setTimeout(() => setGlitchText('wsqk'), 100);
    }, 3000);

    const warningInterval = setInterval(() => {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 500);
    }, 5000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(warningInterval);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative crt-screen">
      <div className="crt-scanlines" />
      <div className="crt-scanline-moving" />
      <div className="crt-noise opacity-20" />
      <div className="crt-static" />

      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-terminal-green" />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 flex justify-around p-4">
        {Array.from({ length: 26 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#ff6600', '#00ffff'][i % 5]
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showWarning ? 1 : 0, y: showWarning ? 0 : -50 }}
          className="absolute top-20 bg-terminal-red border-4 border-terminal-red p-4 blink-fast"
        >
          <div className="font-pixel text-black text-xl md:text-2xl">
            ⚠ DIMENSIONAL BREACH DETECTED ⚠
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="mb-12"
        >
          <h1
            className="text-7xl md:text-9xl font-pixel text-terminal-green phosphor-glow text-center mb-2 glitch-text"
            data-text={glitchText}
            style={{ letterSpacing: '0.15em' }}
          >
            {glitchText}
          </h1>
          <h2 className="text-3xl md:text-5xl font-retro text-terminal-red text-center phosphor-glow" style={{ fontStyle: 'italic', fontWeight: '300' }}>
            The Squawk 94.5
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-terminal-amber text-lg md:text-xl terminal-text mb-2">
            Hawkins National Laboratory
          </p>
          <p className="font-mono text-terminal-green text-sm md:text-base terminal-text">
            Secure Communication Division - Clearance Level 4
          </p>
        </motion.div>

        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="retro-button px-12 py-6 text-2xl font-pixel relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 10px #00ff41',
                '0 0 20px #00ff41, 0 0 30px #00ff41',
                '0 0 10px #00ff41',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ENTER SYSTEM
          </motion.span>

          <motion.div
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-terminal-green text-2xl">→</span>
          </motion.div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 max-w-2xl text-center"
        >
          <p className="font-mono text-terminal-red text-sm md:text-base terminal-text blink">
            ⚠ WARNING: Prolonged exposure to dimensional frequencies may result in
            reality distortion, temporal displacement, and interdimensional awareness.
          </p>
          <p className="font-mono text-terminal-amber text-xs md:text-sm terminal-text mt-4">
            Authorized personnel only • Protocol 11 in effect
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute bottom-20 font-mono text-terminal-red text-xs md:text-sm"
        >
          👁️ ENTITY DETECTED IN VICINITY 👁️
        </motion.div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-around px-8 font-mono text-xs text-terminal-green opacity-70">
          <span>LAT: 41.1306° N</span>
          <span>LONG: 85.8379° W</span>
          <span>ELEVATION: -100m</span>
          <span>STATUS: ACTIVE</span>
        </div>
      </div>

      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-terminal-green rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default HomePage;
