/**
 * Glitch Controller - Manages various glitch effects
 */

/**
 * Apply random glitch transform
 * @returns {object} Transform style object
 */
export const getRandomGlitchTransform = () => {
  const transforms = [
    `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
    `skew(${Math.random() * 10 - 5}deg, ${Math.random() * 10 - 5}deg)`,
    `scale(${0.95 + Math.random() * 0.1})`,
    `rotate(${Math.random() * 4 - 2}deg)`,
  ];
  
  return {
    transform: transforms[Math.floor(Math.random() * transforms.length)]
  };
};

/**
 * Get chromatic aberration filter
 * @param {number} intensity - Intensity level (0-1)
 * @returns {string} CSS filter string
 */
export const getChromaticAberration = (intensity = 0.5) => {
  const offset = intensity * 5;
  return `drop-shadow(${offset}px 0 0 red) drop-shadow(-${offset}px 0 0 cyan)`;
};

/**
 * Get random RGB split values
 * @param {number} intensity - Intensity level (0-1)
 * @returns {object} RGB split offsets
 */
export const getRGBSplit = (intensity = 0.5) => {
  return {
    r: { x: Math.random() * intensity * 10 - intensity * 5, y: 0 },
    g: { x: 0, y: 0 },
    b: { x: -Math.random() * intensity * 10 + intensity * 5, y: 0 }
  };
};

/**
 * Generate random glitch text
 * @param {string} text - Original text
 * @param {number} intensity - Glitch intensity (0-1)
 * @returns {string} Glitched text
 */
export const glitchText = (text, intensity = 0.5) => {
  if (Math.random() > intensity) return text;
  
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  let result = '';
  
  for (let char of text) {
    if (Math.random() < intensity * 0.3) {
      result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
    } else {
      result += char;
    }
  }
  
  return result;
};

/**
 * Get random distortion filter
 * @returns {string} CSS filter
 */
export const getDistortionFilter = () => {
  const filters = [
    'hue-rotate(180deg)',
    'saturate(3)',
    'invert(1)',
    'contrast(2)',
    'brightness(1.5)',
  ];
  
  return filters[Math.floor(Math.random() * filters.length)];
};

/**
 * Generate screen tear effect positions
 * @param {number} count - Number of tears
 * @returns {Array} Array of tear positions
 */
export const generateScreenTears = (count = 5) => {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    height: Math.random() * 20 + 5,
    offset: Math.random() * 100 - 50,
    opacity: Math.random() * 0.5 + 0.3
  }));
};

/**
 * Apply corruption to color
 * @param {string} color - Original color
 * @param {boolean} isPossessed - Whether in possessed mode
 * @returns {string} Modified color
 */
export const corruptColor = (color, isPossessed) => {
  if (!isPossessed) return color;
  
  const corruptions = {
    '#00ff41': '#ff0066',
    '#ffb000': '#00ffff',
    '#ffffff': '#ff00ff',
    'green': 'red',
    'amber': 'cyan'
  };
  
  return corruptions[color] || color;
};

/**
 * Get glitch animation duration
 * @param {number} sanity - Current sanity level (0-100)
 * @returns {number} Animation duration in ms
 */
export const getGlitchDuration = (sanity) => {
  return Math.max(100, 500 - (100 - sanity) * 3);
};

export default {
  getRandomGlitchTransform,
  getChromaticAberration,
  getRGBSplit,
  glitchText,
  getDistortionFilter,
  generateScreenTears,
  corruptColor,
  getGlitchDuration
};
