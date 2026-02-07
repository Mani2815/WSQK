import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const DemogorgonAlert = ({ sanity, isPossessed }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertLevel, setAlertLevel] = useState(1);

  useEffect(() => {
    if (sanity < 30) {
      setIsVisible(true);
      setAlertLevel(sanity < 10 ? 3 : sanity < 20 ? 2 : 1);
    } else {
      setIsVisible(false);
    }
  }, [sanity]);

  const getAlertMessage = () => {
    if (isPossessed) return 'ENTITY BREACH - LOCKDOWN INITIATED';
    if (alertLevel === 3) return 'CRITICAL: ENTITY IN IMMEDIATE VICINITY';
    if (alertLevel === 2) return 'WARNING: ENTITY APPROACHING';
    return 'ALERT: ANOMALOUS ACTIVITY DETECTED';
  };

  const getAlertIcon = () => {
    if (isPossessed) return '👹';
    if (alertLevel === 3) return '👁️👁️👁️';
    if (alertLevel === 2) return '👁️👁️';
    return '👁️';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`
            fixed top-24 left-1/2 transform -translate-x-1/2 z-50
            border-4 px-8 py-4
            ${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-red-600 bg-red-600'}
            ${alertLevel === 3 ? 'blink-fast' : alertLevel === 2 ? 'blink' : ''}
          `}
          style={{
            boxShadow: `0 0 40px ${isPossessed ? '#ff0066' : '#ff0000'}`
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
              className="text-4xl"
            >
              {getAlertIcon()}
            </motion.div>
            
            <div className="text-black font-pixel text-sm md:text-base">
              {getAlertMessage()}
            </div>

            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="text-2xl"
            >
              ⚠
            </motion.div>
          </div>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`
                  flex-1 h-1
                  ${level <= alertLevel ? 'bg-black' : 'bg-black opacity-30'}
                `}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemogorgonAlert;
