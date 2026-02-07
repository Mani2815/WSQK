import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

const KONAMI_DISPLAY = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];

const RecoveryPuzzle = ({ onRecover, isPossessed }) => {
  const [inputSequence, setInputSequence] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPossessed) return;

      // Add to sequence
      const newSequence = [...inputRef.current, e.code];
      
      // Keep only last 10 inputs
      if (newSequence.length > 10) {
        newSequence.shift();
      }
      
      inputRef.current = newSequence;
      setInputSequence(newSequence);

      // Check if sequence matches Konami code
      if (newSequence.length === 10) {
        const matches = newSequence.every((key, index) => key === KONAMI_CODE[index]);
        
        if (matches) {
          setShowSuccess(true);
          setTimeout(() => {
            onRecover();
          }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPossessed, onRecover]);

  if (!isPossessed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-100 pointer-events-none"
    >
      <div className="bg-black bg-opacity-90 p-8 border-4 border-terminal-red pointer-events-auto max-w-2xl mx-4"
        style={{
          boxShadow: '0 0 50px rgba(255, 0, 102, 0.5)'
        }}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-center"
            >
              <h2 className="text-4xl font-pixel text-terminal-green mb-4 phosphor-glow">
                RECOVERY SUCCESSFUL
              </h2>
              <p className="text-xl font-mono text-terminal-green terminal-text">
                System restoring...
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-16 h-16 border-4 border-terminal-green rounded-full animate-spin"
                  style={{
                    borderTopColor: 'transparent',
                    boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="puzzle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <motion.h2
                className="text-3xl md:text-4xl font-pixel text-terminal-red mb-6 glitch-text"
                data-text="DIMENSIONAL BREACH"
                animate={{
                  textShadow: [
                    '0 0 10px #ff0066',
                    '0 0 20px #ff0066, 0 0 30px #ff0066',
                    '0 0 10px #ff0066',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                DIMENSIONAL BREACH
              </motion.h2>

              <p className="text-lg font-mono text-terminal-red mb-8 terminal-text">
                Enter recovery sequence to restore system
              </p>

              {/* Konami Code Display */}
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {KONAMI_DISPLAY.map((key, index) => {
                    const isEntered = inputSequence[index] === KONAMI_CODE[index];
                    const isCurrent = index === inputSequence.length;
                    const isWrong = inputSequence[index] && inputSequence[index] !== KONAMI_CODE[index];
                    
                    return (
                      <motion.div
                        key={index}
                        className={`
                          w-12 h-12 md:w-14 md:h-14
                          flex items-center justify-center
                          font-pixel text-xl md:text-2xl
                          border-2
                          ${isEntered ? 'border-terminal-green text-terminal-green' : 
                            isWrong ? 'border-terminal-red text-terminal-red shake' :
                            isCurrent ? 'border-terminal-amber text-terminal-amber pulse-glow' :
                            'border-terminal-red text-terminal-red opacity-50'}
                        `}
                        style={{
                          backgroundColor: isEntered ? 'rgba(0, 255, 65, 0.1)' :
                                         isWrong ? 'rgba(255, 0, 0, 0.1)' :
                                         'rgba(0, 0, 0, 0.8)',
                          boxShadow: isEntered ? '0 0 15px rgba(0, 255, 65, 0.5)' :
                                    isCurrent ? '0 0 15px rgba(255, 176, 0, 0.5)' :
                                    'none'
                        }}
                        animate={isCurrent ? {
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{
                          duration: 0.5,
                          repeat: isCurrent ? Infinity : 0,
                        }}
                      >
                        {key}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center gap-1">
                  {KONAMI_CODE.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        w-8 h-1
                        ${index < inputSequence.length ? 'bg-terminal-green' : 'bg-terminal-red opacity-30'}
                      `}
                      style={{
                        boxShadow: index < inputSequence.length ? '0 0 5px #00ff41' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-sm font-mono text-terminal-amber terminal-text space-y-2">
                <p>Use keyboard arrow keys and B, A keys</p>
                <p className="text-xs opacity-70">
                  Progress: {inputSequence.length} / {KONAMI_CODE.length}
                </p>
              </div>

              {/* Wrong input warning */}
              <AnimatePresence>
                {inputSequence.length > 0 && 
                 inputSequence.some((key, idx) => key !== KONAMI_CODE[idx]) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 text-terminal-red font-mono text-sm blink-fast"
                  >
                    ⚠ INCORRECT SEQUENCE - TRY AGAIN
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecoveryPuzzle;
