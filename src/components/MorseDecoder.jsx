import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';

const MORSE_TO_TEXT = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
  '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
  '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
  '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
  '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
  '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
  '---..': '8', '----.': '9', '/': ' '
};

const MorseDecoder = ({ isPossessed }) => {
  const [morseInput, setMorseInput] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tapMode, setTapMode] = useState(false);
  const [tapStartTime, setTapStartTime] = useState(null);
  const tapTimeoutRef = useRef(null);

  // Decode morse to text
  const decodeMorse = (morse) => {
    const words = morse.split('/');
    const decoded = words.map(word => {
      const letters = word.trim().split(' ');
      return letters.map(letter => MORSE_TO_TEXT[letter] || '').join('');
    }).join(' ');
    return decoded;
  };

  // Handle morse input change
  const handleMorseChange = (e) => {
    const input = e.target.value;
    setMorseInput(input);
    setDecodedText(decodeMorse(input));
  };

  // Handle tap/click for morse input
  const handleTapStart = () => {
    if (!tapMode) return;
    setTapStartTime(Date.now());
    soundEngine.playMorseBeep('dot', isPossessed);
  };

  const handleTapEnd = () => {
    if (!tapMode || !tapStartTime) return;
    
    const duration = Date.now() - tapStartTime;
    const symbol = duration > 300 ? '-' : '.';
    
    setMorseInput(prev => prev + symbol);
    setTapStartTime(null);
    
    // Clear timeout if exists
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    // Auto-add space after pause
    tapTimeoutRef.current = setTimeout(() => {
      setMorseInput(prev => prev + ' ');
    }, 1000);
  };

  // Decode current input
  useEffect(() => {
    setDecodedText(decodeMorse(morseInput));
  }, [morseInput]);

  // Quick insert buttons
  const insertSymbol = (symbol) => {
    setMorseInput(prev => prev + symbol);
    soundEngine.playMorseBeep(symbol === '.' ? 'dot' : 'dash', isPossessed);
  };

  const insertSpace = () => {
    setMorseInput(prev => prev + ' ');
  };

  const insertSlash = () => {
    setMorseInput(prev => prev + ' / ');
  };

  const clearInput = () => {
    setMorseInput('');
    setDecodedText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`
          w-3 h-3 rounded-full
          ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
          ${isListening ? 'animate-pulse' : 'pulse-glow'}
        `} />
        <h2 className={`
          font-mono text-lg md:text-xl terminal-text
          ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
        `} data-text="MORSE DECODER">
          MORSE DECODER
        </h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setTapMode(false)}
          className={`
            px-3 py-1 text-xs font-mono border
            ${!tapMode 
              ? `${isPossessed ? 'bg-terminal-red border-terminal-red' : 'bg-terminal-green border-terminal-green'} text-black` 
              : `bg-transparent ${isPossessed ? 'text-terminal-red border-terminal-red' : 'text-terminal-green border-terminal-green'}`}
          `}
        >
          TEXT MODE
        </button>
        <button
          onClick={() => setTapMode(true)}
          className={`
            px-3 py-1 text-xs font-mono border
            ${tapMode 
              ? `${isPossessed ? 'bg-terminal-red border-terminal-red' : 'bg-terminal-green border-terminal-green'} text-black` 
              : `bg-transparent ${isPossessed ? 'text-terminal-red border-terminal-red' : 'text-terminal-green border-terminal-green'}`}
          `}
        >
          TAP MODE
        </button>
      </div>

      {/* Input Area */}
      {tapMode ? (
        <>
          {/* Tap Pad */}
          <div
            onMouseDown={handleTapStart}
            onMouseUp={handleTapEnd}
            onTouchStart={handleTapStart}
            onTouchEnd={handleTapEnd}
            className={`
              w-full h-32 flex items-center justify-center
              border-4 cursor-pointer select-none
              ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
              bg-black bg-opacity-80
              transition-all
              ${tapStartTime ? 'bg-opacity-40' : 'bg-opacity-80'}
            `}
            style={{
              boxShadow: tapStartTime 
                ? `inset 0 0 50px ${isPossessed ? '#ff0066' : '#00ff41'}`
                : 'none'
            }}
          >
            <div className={`
              font-pixel text-xl
              ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
            `}>
              {tapStartTime ? 'TRANSMITTING...' : 'TAP TO INPUT'}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => insertSymbol('.')} className="retro-button text-xs px-3 py-1">
              • DOT
            </button>
            <button onClick={() => insertSymbol('-')} className="retro-button text-xs px-3 py-1">
              ━ DASH
            </button>
            <button onClick={insertSpace} className="retro-button text-xs px-3 py-1">
              SPACE
            </button>
            <button onClick={insertSlash} className="retro-button text-xs px-3 py-1">
              / WORD
            </button>
            <button onClick={clearInput} className="retro-button text-xs px-3 py-1 ml-auto">
              CLEAR
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Text Input */}
          <textarea
            value={morseInput}
            onChange={handleMorseChange}
            placeholder="Enter morse code: .- -... -.-."
            className={`
              w-full h-32 retro-input resize-none
              ${isPossessed ? 'possessed text-terminal-red border-terminal-red' : ''}
            `}
          />
          <button onClick={clearInput} className="retro-button text-xs px-3 py-1">
            CLEAR INPUT
          </button>
        </>
      )}

      {/* Morse Display */}
      <div className="bg-black bg-opacity-80 p-4 border-2"
        style={{ borderColor: isPossessed ? '#ff0066' : '#00ff41' }}
      >
        <div className="text-center mb-2">
          <span className={`
            font-mono text-xs terminal-text
            ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
          `}>
            MORSE INPUT
          </span>
        </div>
        <div className={`
          font-mono text-lg terminal-text text-center min-h-[2rem]
          ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
        `}>
          {morseInput || '...'}
        </div>
      </div>

      {/* Decoded Output */}
      <div className="bg-black bg-opacity-80 p-4 border-2"
        style={{ borderColor: isPossessed ? '#ff0066' : '#ffb000' }}
      >
        <div className="text-center mb-2">
          <span className={`
            font-mono text-xs terminal-text
            ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
          `}>
            DECODED MESSAGE
          </span>
        </div>
        <div className={`
          font-mono text-xl terminal-text text-center min-h-[2rem] phosphor-glow
          ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
        `} data-text={decodedText || 'READY'}>
          {decodedText || 'READY'}
        </div>
      </div>

      {/* Status */}
      <div className={`
        text-xs font-mono terminal-text text-center
        ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
      `}>
        {tapMode ? '⬤ TAP MODE ACTIVE' : '⬤ TEXT MODE ACTIVE'} • {morseInput.length} SYMBOLS
      </div>
    </motion.div>
  );
};

export default MorseDecoder;
