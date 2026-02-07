import { motion } from 'framer-motion';

const THEMES = [
  { 
    id: 'classic',
    name: 'Classic Green',
    primary: '#00ff41',
    secondary: '#ffb000',
    danger: '#ff0000',
    description: 'Original terminal aesthetic'
  },
  { 
    id: 'amber',
    name: 'Amber Alert',
    primary: '#ffb000',
    secondary: '#ff6600',
    danger: '#ff0000',
    description: 'Warm warning tones'
  },
  { 
    id: 'red',
    name: 'Red Danger',
    primary: '#ff0000',
    secondary: '#ff6600',
    danger: '#ff0066',
    description: 'High alert mode'
  },
  { 
    id: 'blue',
    name: 'Blue Ice',
    primary: '#00ffff',
    secondary: '#0099ff',
    danger: '#ff0066',
    description: 'Cold laboratory feel'
  },
  { 
    id: 'purple',
    name: 'Purple Void',
    primary: '#9900ff',
    secondary: '#ff00ff',
    danger: '#ff0066',
    description: 'Dimensional rift'
  },
];

const ThemeCustomizer = ({ currentTheme, onThemeChange, isPossessed }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`
          w-3 h-3 rounded-full
          ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
          pulse-glow
        `} />
        <h2 className={`
          font-mono text-lg terminal-text
          ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
        `} data-text="COLOR THEME">
          COLOR THEME
        </h2>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {THEMES.map((theme) => {
          const isSelected = currentTheme === theme.id;

          return (
            <motion.button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`
                relative p-4 border-2 text-left
                ${isSelected 
                  ? `border-opacity-100 ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'} bg-opacity-20`
                  : 'border-opacity-50'}
                bg-black bg-opacity-80
                transition-all
              `}
              style={{
                borderColor: isPossessed && !isSelected ? '#ff0066' : theme.primary
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Color Swatches */}
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 border-2 border-black"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-8 h-8 border-2 border-black"
                  style={{ backgroundColor: theme.secondary }}
                />
                <div
                  className="w-8 h-8 border-2 border-black"
                  style={{ backgroundColor: theme.danger }}
                />
              </div>

              {/* Theme Name */}
              <div className="font-pixel text-sm mb-1"
                style={{ color: isPossessed && !isSelected ? '#ff0066' : theme.primary }}
              >
                {theme.name}
              </div>

              {/* Description */}
              <div className="font-mono text-xs opacity-70"
                style={{ color: isPossessed && !isSelected ? '#ff0066' : theme.secondary }}
              >
                {theme.description}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: theme.primary,
                    boxShadow: `0 0 10px ${theme.primary}`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-black text-sm">✓</span>
                </motion.div>
              )}

              {/* Preview Effect */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.danger})`
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Note */}
      <div className={`
        text-xs font-mono terminal-text text-center
        ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
      `}>
        Theme changes apply immediately
      </div>
    </div>
  );
};

export default ThemeCustomizer;
