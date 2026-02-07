import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const StatisticsDashboard = ({ stats, isPossessed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const statCards = [
    { label: 'Messages Sent', value: stats.messagesSent, icon: '📡', color: '#00ff41' },
    { label: 'Time in App', value: formatTime(stats.timeInApp), icon: '⏱', color: '#ffb000' },
    { label: 'Possessions', value: stats.possessions, icon: '👁', color: '#ff0066' },
    { label: 'Recoveries', value: stats.recoveries, icon: '🔄', color: '#00ff41' },
    { label: 'Avg Sanity', value: `${Math.round(stats.avgSanity)}%`, icon: '📊', color: '#00ffff' },
    { label: 'Longest Message', value: `${stats.longestMessage} chars`, icon: '📝', color: '#ffb000' },
  ];

  return (
    <>
      {/* Stats Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 left-6 z-50
          retro-button px-4 py-3
          ${isPossessed ? 'possessed' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-pixel text-xs">
          📊 STATS
        </span>
      </motion.button>

      {/* Dashboard Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-80 z-60"
            />

            {/* Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`
                fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                w-full max-w-2xl bg-black border-4 p-6 z-70
                ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                max-h-[90vh] overflow-y-auto
              `}
              style={{
                boxShadow: isPossessed 
                  ? '0 0 50px rgba(255, 0, 102, 0.5)'
                  : '0 0 50px rgba(0, 255, 65, 0.3)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`
                  font-pixel text-xl
                  ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
                `} data-text="STATISTICS">
                  STATISTICS
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 border-2 bg-black bg-opacity-50
                      ${isPossessed ? 'border-terminal-red shake' : 'border-terminal-green'}
                    `}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div 
                      className="font-pixel text-2xl mb-1 phosphor-glow"
                      style={{ color: isPossessed ? '#ff0066' : stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className={`
                      font-mono text-xs
                      ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                    `}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Most Used Characters */}
              <div className={`
                border-2 p-4 mb-4
                ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                bg-black bg-opacity-50
              `}>
                <h3 className={`
                  font-mono text-sm mb-3
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                `}>
                  MOST USED CHARACTERS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stats.mostUsedChars.map((char, index) => (
                    <div
                      key={index}
                      className={`
                        px-3 py-2 border font-mono
                        ${isPossessed ? 'border-terminal-red text-terminal-red' : 'border-terminal-green text-terminal-green'}
                      `}
                    >
                      <span className="font-bold">{char.char}</span>
                      <span className="text-xs ml-2 opacity-70">×{char.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Chart (Simple bars) */}
              <div className={`
                border-2 p-4
                ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
                bg-black bg-opacity-50
              `}>
                <h3 className={`
                  font-mono text-sm mb-3
                  ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                `}>
                  ACTIVITY TIMELINE
                </h3>
                <div className="flex items-end gap-2 h-32">
                  {stats.activityByHour.map((count, hour) => {
                    const maxCount = Math.max(...stats.activityByHour);
                    const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div
                        key={hour}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div className="w-full relative"
                          style={{ height: '100%' }}
                        >
                          <div
                            className={`
                              absolute bottom-0 w-full
                              ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
                            `}
                            style={{ 
                              height: `${heightPercent}%`,
                              boxShadow: `0 0 5px ${isPossessed ? '#ff0066' : '#00ff41'}`
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs text-terminal-amber opacity-70">
                          {hour}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRT Effect */}
              <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StatisticsDashboard;
