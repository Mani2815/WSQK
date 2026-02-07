import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { textToMorse } from '../utils/morseEncoder';

const InputBox = ({ onEncode, onTransmit, isPossessed }) => {
  const [text, setText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const morse = textToMorse(text);
    onEncode(text);
    onTransmit(morse);
    setIsTransmitting(true);

    // Reset transmitting state after animation
    setTimeout(() => {
      setIsTransmitting(false);
    }, 2000);
  };

  const handleClear = () => {
    setText('');
    onTransmit('');
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`
          w-3 h-3 rounded-full
          ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
          ${isTransmitting ? 'animate-pulse' : 'pulse-glow'}
        `} />
        <h2 className={`
          font-mono text-lg md:text-xl terminal-text
          ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
        `} data-text="MESSAGE INPUT">
          MESSAGE INPUT
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isPossessed ? 'T̴̰͌H̸̰̓Ẹ̴̈́ ̷̰̾V̶̘̈O̶̰͝I̸̺̾D̸̰̈́ ̷̰̾L̸̰͌I̸̺̾S̶̘̈T̴̰͌Ḛ̶͝N̸̰̓S̶̘̈...' : 'Enter message to transmit...'}
            className={`
              w-full retro-input
              ${isPossessed ? 'possessed text-terminal-red border-terminal-red' : ''}
              ${isPossessed ? 'jitter' : ''}
            `}
            disabled={isTransmitting}
          />
          {isPossessed && (
            <div className="absolute inset-0 bg-red-500 opacity-10 pointer-events-none animate-pulse" />
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            disabled={!text.trim() || isTransmitting}
            className={`
              retro-button flex-1 min-w-[120px]
              ${isPossessed ? 'possessed' : ''}
              ${isTransmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isTransmitting ? 'TRANSMITTING...' : 'TRANSMIT'}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={isTransmitting}
            className={`
              retro-button
              ${isPossessed ? 'possessed' : ''}
              ${isTransmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            CLEAR
          </button>
        </div>
      </form>

      {/* Character count */}
      <div className={`
        text-xs font-mono terminal-text
        ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
        text-right
      `}>
        {text.length > 0 && `${text.length} CHARS • ${textToMorse(text).length} MORSE SYMBOLS`}
      </div>
    </motion.div>
  );
};

export default InputBox;
