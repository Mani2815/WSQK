import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SignalStrengthMeter = ({ sanity, isPossessed }) => {
  const [signalBars, setSignalBars] = useState(5);
  const [interference, setInterference] = useState(0);

  useEffect(() => {
    // Calculate signal strength based on sanity
    const baseSignal = Math.floor((sanity / 100) * 5);
    const randomFluctuation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const bars = Math.max(0, Math.min(5, baseSignal + randomFluctuation));
    
    setSignalBars(bars);
    setInterference((100 - sanity) / 100);
  }, [sanity]);

  const getSignalColor = () => {
    if (isPossessed) return '#ff0066';
    if (signalBars >= 4) return '#00ff41';
    if (signalBars >= 2) return '#ffb000';
    return '#ff0000';
  };

  const getSignalStatus = () => {
    if (isPossessed) return 'CORRUPTED';
    if (signalBars >= 4) return 'STRONG';
    if (signalBars >= 2) return 'WEAK';
    return 'CRITICAL';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Signal Bars */}
      <div className="flex items-end gap-1">
        {[1, 2, 3, 4, 5].map((bar) => {
          const isActive = bar <= signalBars;
          const height = bar * 4 + 8;
          
          return (
            <motion.div
              key={bar}
              className={`
                w-2
                ${isActive ? (isPossessed ? 'animate-pulse' : '') : ''}
              `}
              style={{
                height: `${height}px`,
                backgroundColor: isActive ? getSignalColor() : 'rgba(0, 255, 65, 0.2)',
                boxShadow: isActive ? `0 0 5px ${getSignalColor()}` : 'none'
              }}
              animate={isActive && isPossessed ? {
                opacity: [1, 0.5, 1],
              } : {}}
              transition={{
                duration: 0.3,
                repeat: Infinity,
              }}
            />
          );
        })}
      </div>

      {/* Status Text */}
      <div className="flex flex-col">
        <span 
          className={`
            font-mono text-xs terminal-text
            ${isPossessed ? 'text-terminal-red blink-fast' : ''}
          `}
          style={{ color: getSignalColor() }}
        >
          {getSignalStatus()}
        </span>
        <span className="font-mono text-xs text-terminal-amber opacity-70">
          SIGNAL
        </span>
      </div>

      {/* Interference Indicator */}
      {interference > 0.3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`
            ml-2 text-xs font-mono terminal-text
            ${isPossessed ? 'text-terminal-red blink' : 'text-terminal-amber'}
          `}
        >
          ⚠ INTERFERENCE
        </motion.div>
      )}
    </div>
  );
};

export default SignalStrengthMeter;
