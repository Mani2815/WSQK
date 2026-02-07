import { useState } from 'react';
import { motion } from 'framer-motion';

const CONTACTS = [
  { id: 1, name: 'MIKE', status: 'online', avatar: '🎮', signal: 5 },
  { id: 2, name: 'ELEVEN', status: 'online', avatar: '⚡', signal: 4 },
  { id: 3, name: 'DUSTIN', status: 'online', avatar: '📻', signal: 5 },
  { id: 4, name: 'LUCAS', status: 'offline', avatar: '🎯', signal: 0 },
  { id: 5, name: 'WILL', status: 'possessed', avatar: '👁', signal: 3 },
  { id: 6, name: 'MAX', status: 'online', avatar: '🛹', signal: 4 },
  { id: 7, name: 'STEVE', status: 'online', avatar: '🏏', signal: 5 },
  { id: 8, name: 'NANCY', status: 'offline', avatar: '📰', signal: 0 },
];

const ContactSelector = ({ onSelect, selectedContact, isPossessed }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const getStatusColor = (status) => {
    if (isPossessed) return '#ff0066';
    switch (status) {
      case 'online': return '#00ff41';
      case 'offline': return '#666666';
      case 'possessed': return '#ff0066';
      default: return '#ffb000';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'ONLINE';
      case 'offline': return 'OFFLINE';
      case 'possessed': return 'POSSESSED';
      default: return 'UNKNOWN';
    }
  };

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
        `} data-text="SELECT RECIPIENT">
          SELECT RECIPIENT
        </h2>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CONTACTS.map((contact) => {
          const isSelected = selectedContact?.id === contact.id;
          const isHovered = hoveredId === contact.id;
          const isAvailable = contact.status !== 'offline';

          return (
            <motion.button
              key={contact.id}
              onClick={() => isAvailable && onSelect(contact)}
              onMouseEnter={() => setHoveredId(contact.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={!isAvailable}
              className={`
                relative p-3 border-2
                ${isSelected 
                  ? `${isPossessed ? 'border-terminal-red bg-terminal-red' : 'border-terminal-green bg-terminal-green'} bg-opacity-20`
                  : `${isPossessed ? 'border-terminal-red' : 'border-terminal-green'} bg-black`}
                ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                bg-opacity-80
                transition-all
                ${isPossessed && isAvailable ? 'shake' : ''}
              `}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
            >
              {/* Avatar */}
              <div className="text-3xl mb-2">{contact.avatar}</div>

              {/* Name */}
              <div className={`
                font-pixel text-xs mb-1
                ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
              `}>
                {contact.name}
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-1 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: getStatusColor(contact.status),
                    boxShadow: `0 0 5px ${getStatusColor(contact.status)}`
                  }}
                />
                <span 
                  className="font-mono text-xs"
                  style={{ color: getStatusColor(contact.status) }}
                >
                  {getStatusText(contact.status)}
                </span>
              </div>

              {/* Signal Strength */}
              {contact.status !== 'offline' && (
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className={`
                        w-1
                        ${bar <= contact.signal ? 'opacity-100' : 'opacity-20'}
                      `}
                      style={{
                        height: `${bar * 2 + 2}px`,
                        backgroundColor: isPossessed ? '#ff0066' : '#00ff41'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: isPossessed ? '#ff0066' : '#00ff41',
                    boxShadow: `0 0 10px ${isPossessed ? '#ff0066' : '#00ff41'}`
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <span className="text-black text-xs">✓</span>
                </motion.div>
              )}

              {/* Hover glow */}
              {isHovered && isAvailable && (
                <div 
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${isPossessed ? '#ff0066' : '#00ff41'}`
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Contact Info */}
      {selectedContact && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-3 border text-center font-mono text-sm
            ${isPossessed ? 'border-terminal-red text-terminal-red' : 'border-terminal-green text-terminal-green'}
            bg-black bg-opacity-80
          `}
        >
          Transmitting to: <span className="font-bold">{selectedContact.name}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ContactSelector;
