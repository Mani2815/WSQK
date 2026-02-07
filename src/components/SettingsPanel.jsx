import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPanel = ({
  settings,
  onSettingsChange,
  isPossessed,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <>
      {/* Settings Button near Signal */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute top-4 right-32
          w-10 h-10 border-2 flex items-center justify-center
          ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
          bg-black z-[500]
        `}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className={`text-xl ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}`}>
          ⚙
        </span>
      </motion.button>

      {/* Dropdown Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-16 right-32 
              w-80 bg-black border-4 p-4 rounded-sm
              ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
              z-[600]
            `}
            style={{
              boxShadow: isPossessed
                ? '0 0 20px rgba(255, 0, 102, 0.4)'
                : '0 0 20px rgba(0, 255, 50, 0.3)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`
                  font-pixel text-lg
                  ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
                `}
              >
                SETTINGS
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`text-xl ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}`}
              >
                ✕
              </button>
            </div>

            {/* --- Settings List --- */}
            <div className="space-y-4">
              {/* Sanity Decay Speed */}
              <div>
                <label className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  SANITY DECAY SPEED
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={settings.sanityDecayRate}
                  onChange={(e) => handleChange('sanityDecayRate', parseFloat(e.target.value))}
                  className="w-full accent-terminal-green"
                />
              </div>

              {/* Visual Effects */}
              <div>
                <label className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  VISUAL EFFECTS INTENSITY
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.effectsIntensity}
                  onChange={(e) => handleChange('effectsIntensity', parseInt(e.target.value))}
                  className="w-full accent-terminal-green"
                />
              </div>

              {/* CRT Toggle */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  CRT SCREEN EFFECTS
                </span>
                <button
                  onClick={() => handleChange('crtEnabled', !settings.crtEnabled)}
                  className={`
                    w-16 h-8 border-2 relative transition-all
                    ${settings.crtEnabled
                      ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'}`
                      : 'border-terminal-amber bg-black'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-black"
                    animate={{ x: settings.crtEnabled ? 8 : 0 }}
                  />
                </button>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  SOUND EFFECTS
                </span>
                <button
                  onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                  className={`
                    w-16 h-8 border-2 relative transition-all
                    ${settings.soundEnabled
                      ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'}`
                      : 'border-terminal-amber bg-black'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-black"
                    animate={{ x: settings.soundEnabled ? 8 : 0 }}
                  />
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  AUTO-SAVE MESSAGES
                </span>
                <button
                  onClick={() => handleChange('autoSave', !settings.autoSave)}
                  className={`
                    w-16 h-8 border-2 relative transition-all
                    ${settings.autoSave
                      ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'}`
                      : 'border-terminal-amber bg-black'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-black"
                    animate={{ x: settings.autoSave ? 8 : 0 }}
                  />
                </button>
              </div>

              {/* Show Tutorial */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-sm ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  SHOW TUTORIAL
                </span>
                <button
                  onClick={() => handleChange('showTutorial', !settings.showTutorial)}
                  className={`
                    w-16 h-8 border-2 relative transition-all
                    ${settings.showTutorial
                      ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'}`
                      : 'border-terminal-amber bg-black'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-black"
                    animate={{ x: settings.showTutorial ? 8 : 0 }}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={onReset}
              className={`
                w-full retro-button py-2 mt-4
                ${isPossessed ? 'possessed' : ''}
              `}
            >
              RESET TO DEFAULTS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
