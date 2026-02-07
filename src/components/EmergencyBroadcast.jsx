import { motion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { textToMorse } from '../utils/morseEncoder';

const EMERGENCY_MESSAGES = [
  { id: 1, text: 'HELP', icon: '🆘', color: '#ff0000' },
  { id: 2, text: 'DANGER', icon: '⚠️', color: '#ff6600' },
  { id: 3, text: 'SAFE', icon: '✓', color: '#00ff41' },
  { id: 4, text: 'HIDE', icon: '👁️', color: '#ffb000' },
  { id: 5, text: 'RUN', icon: '🏃', color: '#ff0000' },
  { id: 6, text: 'ELEVEN', icon: '11', color: '#ff0066' },
];

const EmergencyBroadcast = ({ onTransmit, isPossessed }) => {
  const handleEmergency = (message) => {
    const morse = textToMorse(message.text);
    soundEngine.playStatic(0.2, 0.5);
    setTimeout(() => {
      onTransmit(morse, message.text);
      soundEngine.playRecoverySound();
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <motion.div 
          className={`
            w-3 h-3 rounded-full
            ${isPossessed ? 'bg-terminal-red' : 'bg-red-600'}
          `}
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
        <h2 className={`
          font-mono text-lg terminal-text
          ${isPossessed ? 'text-terminal-red glitch-text' : 'text-red-600'}
        `} data-text="EMERGENCY BROADCAST">
          EMERGENCY BROADCAST
        </h2>
      </div>

      {/* Emergency Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EMERGENCY_MESSAGES.map((msg, index) => (
          <motion.button
            key={msg.id}
            onClick={() => handleEmergency(msg)}
            className={`
              relative p-4 border-2 font-pixel text-sm
              bg-black bg-opacity-80
              transition-all
              hover:bg-opacity-50
              ${isPossessed ? 'shake' : ''}
            `}
            style={{
              borderColor: isPossessed ? '#ff0066' : msg.color,
              color: isPossessed ? '#ff0066' : msg.color,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Warning Stripes */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  ${msg.color} 10px,
                  ${msg.color} 20px
                )`
              }}
            />
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-2xl">{msg.icon}</span>
              <span className="text-xs tracking-wider">{msg.text}</span>
            </div>

            {/* Glow effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px ${msg.color}`
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Warning */}
      <div className={`
        text-xs font-mono terminal-text text-center
        ${isPossessed ? 'text-terminal-red blink' : 'text-terminal-amber'}
      `}>
        ⚠ ONE-CLICK EMERGENCY TRANSMISSION ⚠
      </div>
    </motion.div>
  );
};

export default EmergencyBroadcast;
