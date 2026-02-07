import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Welcome to the Upside Down',
    description: 'This is a dimension-safe communication system. Your mission: send messages across the void.',
    icon: '🌀',
  },
  {
    id: 2,
    title: 'Enter Your Message',
    description: 'Type any text in the input box. Your message will be converted to morse code signals.',
    icon: '📝',
    highlight: 'input'
  },
  {
    id: 3,
    title: 'Transmit the Signal',
    description: 'Click TRANSMIT to encode your message. Watch as it becomes LED patterns, waveforms, and audio beeps.',
    icon: '📡',
    highlight: 'transmit'
  },
  {
    id: 4,
    title: 'Watch Your Sanity',
    description: 'The Sanity Meter shows your connection stability. It decays over time. Don\'t let it reach zero!',
    icon: '⚠️',
    highlight: 'sanity'
  },
  {
    id: 5,
    title: 'Possessed Mode',
    description: 'When sanity hits 0%, the system becomes POSSESSED. Reality glitches, colors invert, and chaos ensues.',
    icon: '👁️',
  },
  {
    id: 6,
    title: 'Recovery System',
    description: 'Enter the Konami Code (↑↑↓↓←→←→BA) to restore the system and reset your sanity.',
    icon: '🔄',
  },
  {
    id: 7,
    title: 'Emergency Broadcast',
    description: 'Use quick emergency messages for instant transmission when time is critical.',
    icon: '🆘',
  },
  {
    id: 8,
    title: 'Ready to Begin',
    description: 'You\'re now prepared to communicate with the Upside Down. Stay vigilant, and may the lights guide you.',
    icon: '✨',
  },
];

const TutorialGuide = ({ isVisible, onClose, isPossessed }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVisible) return;

      if (e.key === 'ArrowRight' && currentStep < TUTORIAL_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, currentStep, onClose]);

  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop (Top-most layer) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-[99990]"
          />

          {/* Modal Wrapper (Perfect center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-[99999]"
          >
            {/* Modal Box */}
            <div
              className={`
                w-full max-w-lg bg-black border-4 p-8 relative
                ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                z-[100000]
              `}
              style={{
                boxShadow: isPossessed
                  ? '0 0 60px rgba(255, 0, 102, 0.6)'
                  : '0 0 60px rgba(0, 255, 65, 0.4)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`
                  absolute top-4 right-4 text-2xl
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
                `}
              >
                ✕
              </button>

              {/* Step Icon */}
              <motion.div
                key={step.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-6xl text-center mb-6"
              >
                {step.icon}
              </motion.div>

              {/* Step Content */}
              <motion.div
                key={step.id + '-content'}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2
                  className={`
                    font-pixel text-xl mb-4 text-center
                    ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
                  `}
                  data-text={step.title}
                >
                  {step.title}
                </h2>

                <p
                  className={`
                    font-mono text-sm md:text-base text-center mb-6 leading-relaxed
                    ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                  `}
                >
                  {step.description}
                </p>
              </motion.div>

              {/* Progress Bar */}
              <div
                className={`
                  w-full h-2 border-2 mb-6
                  ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                  bg-black
                `}
              >
                <motion.div
                  className={`h-full ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  style={{
                    boxShadow: `0 0 10px ${isPossessed ? '#ff0066' : '#00ff41'}`
                  }}
                />
              </div>

              {/* Progress Count */}
              <div
                className={`
                  text-center font-mono text-xs mb-6
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                `}
              >
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`
                    retro-button flex-1
                    ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isPossessed ? 'possessed' : ''}
                  `}
                >
                  ← BACK
                </button>

                {currentStep < TUTORIAL_STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className={`
                      retro-button flex-1
                      ${isPossessed ? 'possessed' : ''}
                    `}
                  >
                    NEXT →
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className={`
                      retro-button flex-1
                      ${isPossessed ? 'possessed' : ''}
                    `}
                  >
                    GET STARTED →
                  </button>
                )}
              </div>

              {/* Keyboard Hints */}
              <div
                className={`
                  mt-4 text-center text-xs font-mono opacity-70
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                `}
              >
                Use ← → arrow keys or ESC to close
              </div>

              {/* CRT Overlay */}
              <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-30" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TutorialGuide;
