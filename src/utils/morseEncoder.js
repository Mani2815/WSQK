// Morse code lookup table
const MORSE_CODE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', ' ': '/'
};

/**
 * Convert text to morse code
 * @param {string} text - Input text
 * @returns {string} Morse code representation
 */
export const textToMorse = (text) => {
  return text
    .toUpperCase()
    .split('')
    .map(char => MORSE_CODE[char] || '')
    .join(' ');
};

/**
 * Parse morse code into timing array for animations
 * @param {string} morse - Morse code string
 * @returns {Array} Array of timing objects {type: 'dot'|'dash'|'gap', duration: number}
 */
export const morseToTimings = (morse) => {
  const DOT_DURATION = 200; // ms
  const DASH_DURATION = 600; // ms
  const SYMBOL_GAP = 200; // ms
  const LETTER_GAP = 600; // ms
  const WORD_GAP = 1400; // ms

  const timings = [];
  
  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];
    
    if (char === '.') {
      timings.push({ type: 'dot', duration: DOT_DURATION });
      timings.push({ type: 'gap', duration: SYMBOL_GAP });
    } else if (char === '-') {
      timings.push({ type: 'dash', duration: DASH_DURATION });
      timings.push({ type: 'gap', duration: SYMBOL_GAP });
    } else if (char === ' ') {
      timings.push({ type: 'gap', duration: LETTER_GAP });
    } else if (char === '/') {
      timings.push({ type: 'gap', duration: WORD_GAP });
    }
  }
  
  return timings;
};

/**
 * Get color code for morse symbol (for visual representation)
 * @param {string} symbol - Morse symbol (. or -)
 * @returns {string} Color code
 */
export const getMorseColor = (symbol, isPossessed = false) => {
  if (isPossessed) {
    return symbol === '.' ? '#ff0066' : '#00ffff';
  }
  return symbol === '.' ? '#00ff41' : '#ffb000';
};

/**
 * Generate waveform data for morse code
 * @param {string} morse - Morse code string
 * @returns {Array} Waveform amplitude array
 */
export const morseToWaveform = (morse) => {
  const samples = [];
  const samplesPerSymbol = 50;
  
  for (let char of morse) {
    if (char === '.') {
      for (let i = 0; i < samplesPerSymbol; i++) {
        samples.push(Math.sin(i * 0.5) * 0.5);
      }
    } else if (char === '-') {
      for (let i = 0; i < samplesPerSymbol * 3; i++) {
        samples.push(Math.sin(i * 0.3) * 0.8);
      }
    } else {
      for (let i = 0; i < samplesPerSymbol / 2; i++) {
        samples.push(0);
      }
    }
  }
  
  return samples;
};

export default {
  textToMorse,
  morseToTimings,
  getMorseColor,
  morseToWaveform
};
