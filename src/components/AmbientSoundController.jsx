import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';

const SOUND_TYPES = [
  { id: 'static', name: 'Radio Static', icon: '📻', description: 'White noise interference' },
  { id: 'hum', name: 'Lab Equipment', icon: '⚡', description: 'Electromagnetic hum' },
  { id: 'interference', name: 'Dimensional Rift', icon: '🌀', description: 'Otherworldly sounds' },
];

const AmbientSoundController = ({ sanity, isPossessed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(30);
  const [activeSound, setActiveSound] = useState('static');
  const audioIntervalRef = useRef(null);

  useEffect(() => {
    if (isEnabled) {
      // Play ambient sound based on selection
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }

      const playAmbient = () => {
        const adjustedVolume = (volume / 100) * (isPossessed ? 1.5 : 1);
        
        if (activeSound === 'static') {
          soundEngine.playStatic(2, adjustedVolume * 0.3);
        } else if (activeSound === 'hum') {
          soundEngine.playInterference(2);
        } else if (activeSound === 'interference') {
          if (Math.random() > 0.5) {
            soundEngine.playStatic(1, adjustedVolume * 0.4);
          } else {
            soundEngine.playInterference(1);
          }
        }
      };

      playAmbient();
      audioIntervalRef.current = setInterval(playAmbient, 2000);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isEnabled, activeSound, volume, isPossessed]);

  const toggleSound = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      soundEngine.init();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-24 right-6 z-50
          w-12 h-12 rounded-full
          border-2 flex items-center justify-center
          ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
          ${isEnabled ? 'bg-terminal-green' : 'bg-black'}
          transition-all
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: isEnabled 
            ? '0 0 20px rgba(0, 255, 65, 0.6)' 
            : '0 0 10px rgba(0, 255, 65, 0.3)'
        }}
      >
        <span className="text-xl">
          {isEnabled ? '🔊' : '🔇'}
        </span>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`
              fixed bottom-40 right-6 z-50
              w-80 bg-black border-2 p-4
              ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
            `}
            style={{
              boxShadow: isPossessed 
                ? '0 0 30px rgba(255, 0, 102, 0.5)'
                : '0 0 30px rgba(0, 255, 65, 0.3)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`
                font-pixel text-sm
                ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
              `} data-text="AMBIENT">
                AMBIENT
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`
                  text-lg
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
                `}
              >
                ✕
              </button>
            </div>

            {/* Power Toggle */}
            <div className="mb-4 flex items-center justify-between">
              <span className={`
                font-mono text-sm
                ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
              `}>
                POWER
              </span>
              <button
                onClick={toggleSound}
                className={`
                  w-16 h-8 border-2 relative
                  ${isEnabled 
                    ? `${isPossessed ? 'border-terminal-red' : 'border-terminal-green'} bg-terminal-green`
                    : 'border-terminal-amber bg-black'}
                  transition-all
                `}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-black"
                  animate={{
                    x: isEnabled ? 8 : 0
                  }}
                />
              </button>
            </div>

            {/* Volume Control */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className={`
                  font-mono text-xs
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                `}>
                  VOLUME
                </span>
                <span className={`
                  font-mono text-xs
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
                `}>
                  {volume}%
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                disabled={!isEnabled}
                className="w-full accent-terminal-green"
              />

              {/* Visual Volume Bars */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      flex-1 h-2
                      ${i < Math.floor(volume / 10) 
                        ? (isPossessed ? 'bg-terminal-red' : 'bg-terminal-green')
                        : 'bg-gray-800'}
                    `}
                    style={{
                      opacity: i < Math.floor(volume / 10) ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sound Type Selection */}
            <div className="space-y-2">
              <span className={`
                font-mono text-xs
                ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
              `}>
                SOUND TYPE
              </span>
              
              {SOUND_TYPES.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setActiveSound(sound.id)}
                  disabled={!isEnabled}
                  className={`
                    w-full p-2 border text-left
                    ${activeSound === sound.id 
                      ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'} text-black`
                      : `${isPossessed ? 'border-terminal-red text-terminal-red' : 'border-terminal-green text-terminal-green'} bg-black`}
                    ${!isEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    transition-all
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{sound.icon}</span>
                    <div className="flex-1">
                      <div className="font-mono text-xs font-bold">{sound.name}</div>
                      <div className="font-mono text-xs opacity-70">{sound.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Status */}
            <div className={`
              mt-4 text-center text-xs font-mono
              ${isPossessed ? 'text-terminal-red blink' : 'text-terminal-amber'}
            `}>
              {isEnabled ? '● AMBIENT ACTIVE' : '○ AMBIENT DISABLED'}
            </div>

            {/* CRT Effect */}
            <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AmbientSoundController;
