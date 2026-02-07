import { motion } from 'framer-motion';

const ChristmasLights = ({ isPossessed }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  return (
    <div className="w-full py-4 bg-black bg-opacity-80 border-y-2 border-terminal-green">
      <div className="flex justify-around items-center px-4">
        {alphabet.split('').map((letter, i) => (
          <motion.div
            key={letter}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              className="w-3 h-3 rounded-full relative"
              style={{
                backgroundColor: isPossessed 
                  ? ['#ff0066', '#00ffff'][i % 2]
                  : ['#ff0000', '#00ff00', '#ffff00', '#ff6600', '#00ffff'][i % 5],
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1],
                boxShadow: [
                  `0 0 5px ${isPossessed ? '#ff0066' : '#00ff41'}`,
                  `0 0 20px ${isPossessed ? '#ff0066' : '#00ff41'}`,
                  `0 0 5px ${isPossessed ? '#ff0066' : '#00ff41'}`,
                ]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
            
            <span 
              className="font-pixel text-xs"
              style={{ 
                color: isPossessed ? '#ff0066' : '#00ff41',
                opacity: 0.7
              }}
            >
              {letter}
            </span>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-2">
        <span className="font-mono text-xs text-terminal-amber opacity-70">
          {isPossessed ? 'RUN RUN RUN RUN RUN RUN' : 'Communication via light sequence - Protocol 11'}
        </span>
      </div>
    </div>
  );
};

export default ChristmasLights;
