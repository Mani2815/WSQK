import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalLogs = ({ logs, isPossessed, maxLogs = 10 }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      case 'transmission': return '📡';
      case 'possession': return '👁';
      case 'recovery': return '🔄';
      default: return '>';
    }
  };

  const getLogColor = (type) => {
    if (isPossessed) return '#ff0066';
    
    switch (type) {
      case 'success': return '#00ff41';
      case 'error': return '#ff0000';
      case 'warning': return '#ffb000';
      case 'info': return '#00ffff';
      case 'transmission': return '#00ff41';
      case 'possession': return '#ff0066';
      case 'recovery': return '#00ff41';
      default: return '#00ff41';
    }
  };

  const displayLogs = logs.slice(-maxLogs);

  return (
    <div className={`
      h-48 md:h-64 overflow-y-auto
      bg-black bg-opacity-90 border-2 p-3
      ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
      relative
    `}>
      {/* Header */}
      <div className={`
        sticky top-0 bg-black pb-2 mb-2 border-b
        ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
      `}>
        <div className="flex items-center gap-2">
          <div className={`
            w-2 h-2 rounded-full
            ${isPossessed ? 'bg-terminal-red' : 'bg-terminal-green'}
            animate-pulse
          `} />
          <span className={`
            font-mono text-xs
            ${isPossessed ? 'text-terminal-red glitch-text' : 'text-terminal-green'}
          `} data-text="SYSTEM LOGS">
            SYSTEM LOGS
          </span>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-1">
        {displayLogs.length === 0 ? (
          <div className="text-terminal-amber font-mono text-xs opacity-50 text-center py-8">
            AWAITING SYSTEM EVENTS...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {displayLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  font-mono text-xs flex items-start gap-2
                  ${isPossessed && log.type !== 'possession' ? 'jitter' : ''}
                `}
                style={{ color: getLogColor(log.type) }}
              >
                <span className="opacity-50">[{log.timestamp}]</span>
                <span>{getLogIcon(log.type)}</span>
                <span className="flex-1">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
    </div>
  );
};

export default TerminalLogs;
