import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageArchive = ({ isPossessed, messages, onReplay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(msg.timestamp).toDateString() === today;
    }
    return true;
  });

  const handleDelete = (id) => {
    // Trigger glitch animation before delete
    const element = document.getElementById(`msg-${id}`);
    if (element) {
      element.classList.add('disappear');
    }
  };

  const exportMessages = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upside-down-archive-${Date.now()}.json`;
    a.click();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          retro-button px-4 py-3
          ${isPossessed ? 'possessed' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-pixel text-xs">
          📜 ARCHIVE ({messages.length})
        </span>
      </motion.button>

      {/* Archive Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`
              fixed right-0 top-0 bottom-0 w-full md:w-96
              bg-black border-l-4
              ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
              overflow-hidden z-40
              flex flex-col
            `}
            style={{
              boxShadow: isPossessed 
                ? '-5px 0 30px rgba(255, 0, 102, 0.5)'
                : '-5px 0 30px rgba(0, 255, 65, 0.3)'
            }}
          >
            {/* Header */}
            <div className={`
              p-4 border-b-2
              ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
              bg-black bg-opacity-90
            `}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`
                  font-pixel text-lg terminal-text
                  ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
                `} data-text="MESSAGE ARCHIVE">
                  MESSAGE ARCHIVE
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`
                    text-2xl
                    ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
                  `}
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`
                    px-2 py-1 text-xs font-mono border
                    ${filter === 'all' 
                      ? 'bg-terminal-green text-black border-terminal-green' 
                      : 'bg-transparent text-terminal-green border-terminal-green'}
                  `}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilter('today')}
                  className={`
                    px-2 py-1 text-xs font-mono border
                    ${filter === 'today' 
                      ? 'bg-terminal-green text-black border-terminal-green' 
                      : 'bg-transparent text-terminal-green border-terminal-green'}
                  `}
                >
                  TODAY
                </button>
                <button
                  onClick={exportMessages}
                  className="ml-auto px-2 py-1 text-xs font-mono border border-terminal-amber text-terminal-amber"
                >
                  EXPORT
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="text-center text-terminal-amber font-mono text-sm mt-8">
                  NO MESSAGES IN ARCHIVE
                </div>
              ) : (
                <AnimatePresence>
                  {filteredMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className={`
                        border-2 p-3
                        ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                        bg-black bg-opacity-50
                        ${isPossessed ? 'shake' : ''}
                      `}
                    >
                      {/* Timestamp */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`
                          font-mono text-xs
                          ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                        `}>
                          {formatTime(msg.timestamp)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onReplay(msg.morse)}
                            className="text-xs text-terminal-green hover:text-terminal-amber"
                          >
                            ▶
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="text-xs text-terminal-red hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Message Text */}
                      <div className={`
                        font-mono text-sm terminal-text mb-2
                        ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
                      `}>
                        {msg.text}
                      </div>

                      {/* Morse Preview */}
                      <div className="flex flex-wrap gap-1">
                        {msg.morse.split('').slice(0, 30).map((char, idx) => {
                          if (char === ' ' || char === '/') return <div key={idx} className="w-1" />;
                          return (
                            <div
                              key={idx}
                              className={`
                                ${char === '.' ? 'w-1 h-1' : 'w-3 h-1'}
                                rounded-sm
                                ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
                                opacity-70
                              `}
                            />
                          );
                        })}
                        {msg.morse.length > 30 && (
                          <span className="text-xs text-terminal-amber">...</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageArchive;
