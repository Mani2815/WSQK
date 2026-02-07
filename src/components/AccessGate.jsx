import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessGate = ({ onAccessGranted }) => {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const CORRECT_ANSWER = 'UP THE HILL';
  const MAX_ATTEMPTS = 3;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answer.trim().toUpperCase() === CORRECT_ANSWER) {
      setIsUnlocking(true);
      setError('');

      // Play success sequence
      setTimeout(() => {
        onAccessGranted();
      }, 2000);
    } else {
      setAttempts(prev => prev + 1);
      setError('ACCESS DENIED - INCORRECT ANSWER');
      setAnswer('');

      if (attempts + 1 >= MAX_ATTEMPTS) {
        setError('SYSTEM LOCKOUT - WAIT 10 SECONDS');
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 10000);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-12 h-full gap-1">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-terminal-green"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.01,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scanlines */}
      <div className="crt-scanlines absolute inset-0 opacity-30" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-2xl px-6"
      >
        {/* Logo Area */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <div className="text-6xl md:text-8xl mb-4">📻</div>

            {/* WSQK Logo with 3D Effect */}
            <h1
              className="font-pixel text-5xl md:text-7xl text-white phosphor-glow mb-2 relative"
              style={{
                textShadow: `
                  3px 3px 0px rgba(0, 0, 0, 0.8),
                  5px 5px 0px rgba(0, 0, 0, 0.6),
                  0 0 30px rgba(0, 255, 65, 0.5),
                  0 0 60px rgba(0, 255, 65, 0.3)
                `,
                letterSpacing: '0.05em'
              }}
            >
              WSQK
            </h1>

            {/* The Squawk in script style */}
            <div
              className="text-terminal-green font-mono text-2xl md:text-4xl mb-2"
              style={{
                fontFamily: 'cursive',
                fontStyle: 'italic',
                textShadow: '0 0 20px rgba(0, 255, 65, 0.6)'
              }}
            >
              The Squawk
            </div>

            {/* 94.5 FM */}
            <div
              className="text-terminal-amber font-pixel text-xl md:text-3xl tracking-wider"
              style={{
                textShadow: '0 0 15px rgba(255, 176, 0, 0.8)'
              }}
            >
              94.5 FM
            </div>

            <div className="text-terminal-green font-mono text-xs mt-3 opacity-70">
              CLASSIFIED • EST. 1983 • HAWKINS, INDIANA
            </div>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="border-2 border-terminal-red bg-terminal-red bg-opacity-20 p-3 mb-8"
          >
            <div className="text-terminal-red font-mono text-xs md:text-sm blink">
              ⚠ AUTHORIZED PERSONNEL ONLY ⚠
            </div>
            <div className="text-terminal-amber font-mono text-xs mt-1">
              U.S. DEPARTMENT OF ENERGY • SECURITY CLEARANCE REQUIRED
            </div>
          </motion.div>
        </div>

        {/* Riddle Box */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className={`
            border-4 p-6 md:p-8 bg-black bg-opacity-80 mb-6
            ${isUnlocking ? 'border-terminal-green' : 'border-terminal-amber'}
          `}
          style={{
            boxShadow: isUnlocking
              ? '0 0 40px rgba(0, 255, 65, 0.6)'
              : '0 0 30px rgba(255, 176, 0, 0.4)'
          }}
        >
          {!isUnlocking ? (
            <>
              <div className="text-terminal-amber font-mono text-xs mb-4 text-center">
                SECURITY PROTOCOL ACTIVE
              </div>

              <div className="text-terminal-green font-mono text-sm md:text-base leading-relaxed mb-6 text-center">
                "To cross between worlds, you must go against gravity.<br />
                Where do you run when the sky itself is the obstacle?"
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="ENTER ANSWER..."
                  disabled={attempts >= MAX_ATTEMPTS}
                  className={`
                    w-full retro-input text-center font-mono text-lg mb-4
                    ${attempts >= MAX_ATTEMPTS ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={attempts >= MAX_ATTEMPTS || !answer.trim()}
                  className={`
                    w-full retro-button py-3 font-pixel text-lg
                    ${attempts >= MAX_ATTEMPTS || !answer.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  SUBMIT ACCESS CODE
                </button>
              </form>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-center"
                  >
                    <div className="text-terminal-red font-mono text-sm blink-fast">
                      {error}
                    </div>
                    <div className="text-terminal-amber font-mono text-xs mt-2">
                      Attempts: {attempts}/{MAX_ATTEMPTS}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
                className="text-terminal-green font-pixel text-2xl mb-4"
              >
                ACCESS GRANTED
              </motion.div>
              <div className="text-terminal-green font-mono text-sm">
                Initializing WSQK - The Squawk 94.5 FM...
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-terminal-green rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Hint System */}
        {attempts > 0 && !isUnlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-terminal-amber font-mono text-xs opacity-70"
          >
            HINT: Think of where Will ran to escape the Demogorgon...
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8 space-y-2"
        >
          <div className="text-terminal-green font-mono text-xs opacity-50">
            HAWKINS NATIONAL LABORATORY
          </div>
          <div className="text-terminal-amber font-mono text-xs opacity-50">
            UPSIDE DOWN RESEARCH DIVISION
          </div>
          <div className="text-terminal-green font-mono text-xs opacity-30">
            DR. MARTIN BRENNER - DIRECTOR
          </div>
        </motion.div>
      </motion.div>

      {/* Static Overlay */}
      <div className="absolute inset-0 crt-static opacity-20 pointer-events-none" />
    </div>
  );
};

export default AccessGate;