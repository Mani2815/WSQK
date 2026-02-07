import { motion } from 'framer-motion';
import { getSanityColor, getSanityWarning } from '../utils/sanityController';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SanityMeter = ({ sanity, isPossessed }) => {
  const needleRef = useRef(null);
  const meterRef = useRef(null);

  useEffect(() => {
    if (needleRef.current) {
      const rotation = -90 + (sanity / 100) * 180;
      gsap.to(needleRef.current, {
        duration: 0.8,
        rotation: rotation,
        transformOrigin: 'bottom center',
        ease: 'power2.out'
      });
    }
  }, [sanity]);

  useEffect(() => {
    if (meterRef.current) {
      const shakeIntensity = Math.max(0, (100 - sanity) / 100);
      
      if (shakeIntensity > 0.3) {
        gsap.to(meterRef.current, {
          duration: 0.1,
          x: `+=${Math.random() * shakeIntensity * 5 - shakeIntensity * 2.5}`,
          y: `+=${Math.random() * shakeIntensity * 5 - shakeIntensity * 2.5}`,
          yoyo: true,
          repeat: -1,
          ease: 'power2.inOut'
        });
      } else {
        gsap.killTweensOf(meterRef.current);
        gsap.to(meterRef.current, {
          duration: 0.3,
          x: 0,
          y: 0
        });
      }
    }
  }, [sanity]);

  return (
    <motion.div
      ref={meterRef}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`mb-6 ${sanity <= 20 && !isPossessed ? 'danger-pulse' : ''}`}
    >
      <div 
        className="p-6 border-4 bg-black bg-opacity-90"
        style={{ 
          borderColor: isPossessed ? '#ff0066' : getSanityColor(sanity),
          boxShadow: isPossessed 
            ? '0 0 30px rgba(255, 0, 102, 0.5)'
            : `0 0 30px ${getSanityColor(sanity)}40`
        }}
      >
        <div className="flex items-center justify-between gap-8">
          {/* Left: Analog Gauge */}
          <div className="relative" style={{ width: '200px', height: '120px' }}>
            <svg viewBox="0 0 200 120" className="w-full h-full">
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={isPossessed ? '#ff006620' : '#00ff4120'}
                strokeWidth="12"
              />
              
              <path
                d="M 20 100 A 80 80 0 0 1 60 40"
                fill="none"
                stroke="#ff0000"
                strokeWidth="12"
              />
              <path
                d="M 60 40 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="#ff6600"
                strokeWidth="12"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 140 40"
                fill="none"
                stroke="#ffb000"
                strokeWidth="12"
              />
              <path
                d="M 140 40 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#00ff41"
                strokeWidth="12"
              />
              
              {[0, 25, 50, 75, 100].map((value) => {
                const angle = -90 + (value / 100) * 180;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + Math.cos(rad) * 70;
                const y1 = 100 + Math.sin(rad) * 70;
                const x2 = 100 + Math.cos(rad) * 85;
                const y2 = 100 + Math.sin(rad) * 85;
                
                return (
                  <g key={value}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isPossessed ? '#ff0066' : '#00ff41'}
                      strokeWidth="3"
                    />
                    <text
                      x={100 + Math.cos(rad) * 95}
                      y={100 + Math.sin(rad) * 95}
                      fill={isPossessed ? '#ff0066' : '#00ff41'}
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}
              
              <g ref={needleRef} style={{ transformOrigin: '100px 100px' }}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke={isPossessed ? '#ff0066' : getSanityColor(sanity)}
                  strokeWidth="4"
                  style={{
                    filter: `drop-shadow(0 0 8px ${isPossessed ? '#ff0066' : getSanityColor(sanity)})`
                  }}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="6"
                  fill={isPossessed ? '#ff0066' : getSanityColor(sanity)}
                  style={{
                    filter: `drop-shadow(0 0 5px ${isPossessed ? '#ff0066' : getSanityColor(sanity)})`
                  }}
                />
              </g>
            </svg>
          </div>

          {/* Center: Large Percentage Display */}
          <div className="flex flex-col items-center">
            <motion.div
              className={`
                font-pixel phosphor-glow
                ${isPossessed ? 'text-terminal-red glitch-text' : ''}
                ${sanity <= 20 ? 'blink-fast' : ''}
              `}
              style={{ 
                fontSize: '80px',
                color: isPossessed ? '#ff0066' : getSanityColor(sanity),
                textShadow: `0 0 20px ${isPossessed ? '#ff0066' : getSanityColor(sanity)}`
              }}
              animate={isPossessed ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 0.5,
                repeat: isPossessed ? Infinity : 0,
              }}
              data-text={`${Math.round(sanity)}%`}
            >
              {Math.round(sanity)}%
            </motion.div>
            <div 
              className="font-mono text-base tracking-wider mt-2"
              style={{ color: isPossessed ? '#ff0066' : '#ffb000' }}
            >
              SANITY LEVEL
            </div>
          </div>

          {/* Right: Status and Progress Bar */}
          <div className="flex-1 flex flex-col gap-3">
            <div 
              className={`
                font-mono text-xl tracking-wider terminal-text
                ${isPossessed ? 'glitch-text blink-fast' : ''}
              `}
              style={{ color: isPossessed ? '#ff0066' : getSanityColor(sanity) }}
              data-text={getSanityWarning(sanity)}
            >
              {getSanityWarning(sanity)}
            </div>
            
            <div className="relative">
              <div 
                className="h-8 border-2"
                style={{ 
                  borderColor: isPossessed ? '#ff0066' : getSanityColor(sanity),
                  backgroundColor: '#000000'
                }}
              >
                <motion.div
                  className={`h-full ${sanity <= 20 ? 'animate-pulse' : ''}`}
                  style={{ 
                    width: `${sanity}%`,
                    backgroundColor: isPossessed ? '#ff0066' : getSanityColor(sanity),
                    boxShadow: `0 0 15px ${isPossessed ? '#ff0066' : getSanityColor(sanity)}`
                  }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${sanity}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-black mix-blend-difference">
                  {Math.round(sanity)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between font-mono text-xs opacity-70">
              <span style={{ color: isPossessed ? '#ff0066' : '#00ff41' }}>
                {sanity > 70 ? '● OPERATIONAL' : sanity > 40 ? '◐ DEGRADING' : sanity > 20 ? '◑ FAILING' : '○ CRITICAL'}
              </span>
              <span style={{ color: '#ffb000' }}>
                DECAY: ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {sanity <= 20 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="static-overlay opacity-50" />
        </div>
      )}
    </motion.div>
  );
};

export default SanityMeter;
