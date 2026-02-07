import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { morseToTimings, getMorseColor, morseToWaveform } from '../utils/morseEncoder';
import { soundEngine } from '../utils/soundEngine';

const SignalOutput = ({ morse, inputText, isPossessed }) => {
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timings, setTimings] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Parse morse to timings
  useEffect(() => {
    if (morse) {
      const parsedTimings = morseToTimings(morse);
      setTimings(parsedTimings);
      setCurrentSignalIndex(0);
      drawWaveform();
    }
  }, [morse]);

  // Draw waveform on canvas
  const drawWaveform = () => {
    if (!canvasRef.current || !morse) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const waveform = morseToWaveform(morse);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    ctx.strokeStyle = isPossessed ? '#ff0066' : '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.4;
    const step = canvas.width / waveform.length;

    waveform.forEach((value, index) => {
      const x = index * step;
      const y = centerY + value * amplitude;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = isPossessed ? '#ff0066' : '#00ff41';
    ctx.shadowBlur = 10;
    ctx.stroke();
  };

  // Play morse sequence
  const playMorseSequence = () => {
    if (isPlaying || timings.length === 0) return;

    setIsPlaying(true);
    setCurrentSignalIndex(0);

    let currentTime = 0;
    
    timings.forEach((timing, index) => {
      setTimeout(() => {
        setCurrentSignalIndex(index);
        
        // Play sound for dots and dashes
        if (timing.type === 'dot' || timing.type === 'dash') {
          soundEngine.playMorseBeep(timing.type, isPossessed);
        }
        
        // End of sequence
        if (index === timings.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setCurrentSignalIndex(0);
          }, timing.duration);
        }
      }, currentTime);
      
      currentTime += timing.duration;
    });
  };

  // Auto-play on new morse
  useEffect(() => {
    if (morse && !isPlaying) {
      setTimeout(() => playMorseSequence(), 500);
    }
  }, [morse]);

  // Redraw waveform when possessed state changes
  useEffect(() => {
    drawWaveform();
  }, [isPossessed]);

  if (!morse) return null;

  const currentTiming = timings[currentSignalIndex];
  const isActive = currentTiming && (currentTiming.type === 'dot' || currentTiming.type === 'dash');

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="space-y-6 border-t-2 pt-6"
      style={{ borderColor: isPossessed ? '#ff0066' : '#00ff41' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`
            w-3 h-3 rounded-full
            ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
            ${isActive ? 'animate-pulse' : 'pulse-glow'}
          `} />
          <h2 className={`
            font-mono text-lg md:text-xl terminal-text
            ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
          `} data-text="ENCODED SIGNAL">
            ENCODED SIGNAL
          </h2>
        </div>
        
        <button
          onClick={playMorseSequence}
          disabled={isPlaying}
          className={`
            retro-button text-xs
            ${isPossessed ? 'possessed' : ''}
            ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isPlaying ? 'PLAYING...' : 'REPLAY'}
        </button>
      </div>

      {/* LED Visual Display */}
      <div className="bg-black bg-opacity-80 p-6 border-2"
        style={{ borderColor: isPossessed ? '#ff0066' : '#00ff41' }}
      >
        <div className="text-center mb-4">
          <span className={`
            font-mono text-sm terminal-text
            ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
          `}>
            LED SEQUENCE
          </span>
        </div>
        
        <div className="flex justify-center">
          <div 
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-full
              transition-all duration-200
              ${isActive ? (currentTiming.type === 'dot' ? 'led-dot' : 'led-dash') : ''}
            `}
            style={{
              backgroundColor: isActive 
                ? (isPossessed ? '#ff0066' : '#00ff41')
                : 'rgba(0, 255, 65, 0.2)',
              boxShadow: isActive 
                ? `0 0 30px ${isPossessed ? '#ff0066' : '#00ff41'}`
                : 'none'
            }}
          />
        </div>
      </div>

      {/* Morse Code Pattern Grid */}
      <div className="bg-black bg-opacity-80 p-6 border-2"
        style={{ borderColor: isPossessed ? '#ff0066' : '#00ff41' }}
      >
        <div className="text-center mb-4">
          <span className={`
            font-mono text-sm terminal-text
            ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
          `}>
            PATTERN GRID
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {morse.split('').map((char, index) => {
            if (char === ' ' || char === '/') {
              return <div key={index} className="w-3" />;
            }
            
            const isCurrentSymbol = timings[currentSignalIndex] && 
              index === morse.substring(0, currentSignalIndex).replace(/[ /]/g, '').length;
            
            return (
              <div
                key={index}
                className={`
                  ${char === '.' ? 'w-2 h-2' : 'w-6 h-2'}
                  rounded-sm
                  transition-all duration-200
                  ${isCurrentSymbol && isActive ? 'scale-150' : ''}
                `}
                style={{
                  backgroundColor: isCurrentSymbol && isActive
                    ? getMorseColor(char, isPossessed)
                    : `${getMorseColor(char, isPossessed)}40`,
                  boxShadow: isCurrentSymbol && isActive
                    ? `0 0 10px ${getMorseColor(char, isPossessed)}`
                    : 'none'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Waveform Display */}
      <div className="bg-black bg-opacity-80 p-6 border-2"
        style={{ borderColor: isPossessed ? '#ff0066' : '#00ff41' }}
      >
        <div className="text-center mb-4">
          <span className={`
            font-mono text-sm terminal-text
            ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
          `}>
            WAVEFORM ANALYSIS
          </span>
        </div>
        
        <canvas 
          ref={canvasRef}
          className="w-full"
          style={{ 
            height: '100px',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {/* Status */}
      <div className={`
        text-xs font-mono terminal-text text-center
        ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
      `}>
        {isPlaying ? (
          <span className="blink-fast">● TRANSMITTING SIGNAL</span>
        ) : (
          <span>⬤ READY FOR TRANSMISSION</span>
        )}
      </div>
    </motion.div>
  );
};

export default SignalOutput;
