import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import AccessGate from './components/AccessGate';
import TerminalScreen from './components/TerminalScreen';
import InputBox from './components/InputBox';
import SignalOutput from './components/SignalOutput';
import SanityMeter from './components/SanityMeter';
import CorruptionOverlay from './components/CorruptionOverlay';
import RecoveryPuzzle from './components/RecoveryPuzzle';
import MessageArchive from './components/MessageArchive';
import MorseDecoder from './components/MorseDecoder';
import SignalStrengthMeter from './components/SignalStrengthMeter';
import EmergencyBroadcast from './components/EmergencyBroadcast';
import AmbientSoundController from './components/AmbientSoundController';
import TerminalLogs from './components/TerminalLogs';
import ContactSelector from './components/ContactSelector';
import SettingsPanel from './components/SettingsPanel';
import StatisticsDashboard from './components/StatisticsDashboard';
import ThemeCustomizer from './components/ThemeCustomizer';
import TutorialGuide from './components/TutorialGuide';
import { SanityController } from './utils/sanityController';
import { soundEngine } from './utils/soundEngine';

function App() {
  // Access control
  const [hasAccess, setHasAccess] = useState(false);

  // Core state
  const [inputText, setInputText] = useState('');
  const [encodedMorse, setEncodedMorse] = useState('');
  const [sanity, setSanity] = useState(100);
  const [isPossessed, setIsPossessed] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [possessionTimer, setPossessionTimer] = useState(null);
  const [activeView, setActiveView] = useState('encoder');

  // Messages and logs
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // Settings
  const [settings, setSettings] = useState({
    sanityDecayRate: 0.5,
    effectsIntensity: 100,
    crtEnabled: true,
    soundEnabled: true,
    autoSave: true,
    showTutorial: true,
  });

  // Statistics
  const [stats, setStats] = useState({
    messagesSent: 0,
    timeInApp: 0,
    possessions: 0,
    recoveries: 0,
    avgSanity: 100,
    longestMessage: 0,
    mostUsedChars: [
      { char: 'E', count: 0 },
      { char: 'L', count: 0 },
      { char: 'V', count: 0 },
      { char: 'N', count: 0 },
    ],
    activityByHour: new Array(24).fill(0),
  });

  // UI state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('classic');

  const sanityControllerRef = useRef(new SanityController(100));
  const appRef = useRef(null);
  const sessionStartRef = useRef(Date.now());

  // Theme colors mapping
  const THEME_COLORS = {
    classic: { primary: '#00ff41', secondary: '#ffb000', danger: '#ff0000' },
    amber: { primary: '#ffb000', secondary: '#ff6600', danger: '#ff0000' },
    red: { primary: '#ff0000', secondary: '#ff6600', danger: '#ff0066' },
    blue: { primary: '#00ffff', secondary: '#0099ff', danger: '#ff0066' },
    purple: { primary: '#9900ff', secondary: '#ff00ff', danger: '#ff0066' },
  };

  // Apply theme colors
  useEffect(() => {
    const colors = THEME_COLORS[currentTheme];
    if (colors) {
      document.documentElement.style.setProperty('--color-terminal-green', colors.primary);
      document.documentElement.style.setProperty('--color-terminal-amber', colors.secondary);
      document.documentElement.style.setProperty('--color-terminal-red', colors.danger);
    }
  }, [currentTheme]);

  // Initialize
  useEffect(() => {
    if (!hasAccess) return;

    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial && settings.showTutorial) {
      setShowTutorial(true);
    }

    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedStats = localStorage.getItem('stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const initSound = () => {
      soundEngine.init();
      document.removeEventListener('click', initSound);
    };
    document.addEventListener('click', initSound);

    addLog('success', 'WSQK Signal Relay initialized - Connection established');
    addLog('info', 'Frequency locked at 94.5 FM');
    addLog('info', 'Hawkins National Laboratory uplink active');

    return () => {
      document.removeEventListener('click', initSound);
      updateSessionTime();
    };
  }, [hasAccess]);

  const updateSessionTime = () => {
    const sessionTime = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    setStats(prev => ({
      ...prev,
      timeInApp: prev.timeInApp + sessionTime
    }));
  };

  useEffect(() => {
    if (settings.autoSave && messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages, settings.autoSave]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (!hasAccess) return;

    sanityControllerRef.current.decayRate = settings.sanityDecayRate;

    const interval = setInterval(() => {
      if (!isPossessed) {
        const newSanity = sanityControllerRef.current.update();
        setSanity(newSanity);

        setStats(prev => ({
          ...prev,
          avgSanity: (prev.avgSanity + newSanity) / 2
        }));

        if (newSanity <= 0 && !isPossessed) {
          triggerPossession();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPossessed, settings.sanityDecayRate, hasAccess]);

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp
    };
    setLogs(prev => [...prev, newLog]);
  };

  const triggerPossession = () => {
    setIsPossessed(true);
    setShowRecovery(true);
    addLog('possession', '⚠ UPSIDE DOWN BREACH - SIGNAL HIJACKED BY ENTITY');
    addLog('error', 'Demogorgon presence detected in transmission');

    if (settings.soundEnabled) {
      soundEngine.playPossessionSound();
    }

    setStats(prev => ({
      ...prev,
      possessions: prev.possessions + 1
    }));

    if (appRef.current) {
      gsap.to(appRef.current, {
        duration: 0.5,
        scale: 1.02,
        skewX: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut'
      });
    }

    const timer = setTimeout(() => {
      if (isPossessed) {
        recoverFromPossession();
      }
    }, 30000);

    setPossessionTimer(timer);
  };

  const recoverFromPossession = () => {
    setIsPossessed(false);
    setShowRecovery(false);
    sanityControllerRef.current.reset();
    setSanity(100);
    addLog('recovery', '✓ System purged - Portal sealed');
    addLog('success', 'WSQK relay restored - Sanity stabilized at 100%');

    if (settings.soundEnabled) {
      soundEngine.playRecoverySound();
    }

    setStats(prev => ({
      ...prev,
      recoveries: prev.recoveries + 1
    }));

    if (possessionTimer) {
      clearTimeout(possessionTimer);
      setPossessionTimer(null);
    }

    if (appRef.current) {
      gsap.killTweensOf(appRef.current);
      gsap.to(appRef.current, {
        duration: 0.3,
        scale: 1,
        skewX: 0,
        ease: 'power2.out'
      });
    }
  };

  const handleEncode = (text) => {
    setInputText(text);
  };

  const handleTransmit = (morse, text = inputText) => {
    setEncodedMorse(morse);

    const newMessage = {
      id: Date.now(),
      text,
      morse,
      timestamp: Date.now(),
      contact: selectedContact?.name || 'BROADCAST'
    };

    setMessages(prev => [...prev, newMessage]);
    addLog('transmission', `Signal transmitted to ${newMessage.contact}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);

    const hour = new Date().getHours();
    setStats(prev => {
      const newActivityByHour = [...prev.activityByHour];
      newActivityByHour[hour] += 1;

      return {
        ...prev,
        messagesSent: prev.messagesSent + 1,
        longestMessage: Math.max(prev.longestMessage, text.length),
        activityByHour: newActivityByHour
      };
    });
  };

  const handleReplay = (morse) => {
    setEncodedMorse(morse);
    addLog('info', 'Replaying archived transmission');
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    addLog('info', 'Configuration updated');
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      sanityDecayRate: 0.5,
      effectsIntensity: 100,
      crtEnabled: true,
      soundEnabled: true,
      autoSave: true,
      showTutorial: true,
    };
    setSettings(defaultSettings);
    addLog('warning', 'Settings reset to factory defaults');
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
    addLog('success', 'Operator training complete - System ready');
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    addLog('info', `Color scheme changed to ${theme}`);
  };

  const handleAccessGranted = () => {
    setHasAccess(true);
    addLog('success', 'Access granted - Welcome to WSQK');
  };

  // Show access gate first
  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  // Main communicator interface
  return (
    <div
      ref={appRef}
      className={`
        w-screen h-screen 
        ${settings.crtEnabled ? 'crt-screen crt-glow crt-distortion' : ''}
        ${isPossessed ? 'crt-possessed cursor-glitch' : ''}
        overflow-hidden
      `}
    >
      {settings.crtEnabled && (
        <>
          <div className="crt-scanlines" />
          <div className="crt-scanline-moving" />
          <div className="crt-noise" />
          <div className="crt-static" />
          <div className="screen-burn" />
        </>
      )}

      <SettingsPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        isPossessed={isPossessed}
        onReset={handleResetSettings}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full flex flex-col p-2 md:p-4 overflow-y-auto"
      >
        <motion.header
          className="mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              {/* WSQK Branding */}
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl md:text-5xl">📻</div>
                <div>
                  <h1
                    className={`
                      text-3xl md:text-5xl font-pixel
                      phosphor-glow
                      ${isPossessed ? 'glitch-text text-terminal-red' : 'text-terminal-green'}
                    `}
                    data-text="WSQK"
                  >
                    WSQK
                  </h1>
                  <p className={`
                    font-mono text-sm md:text-base tracking-wider
                    ${isPossessed ? 'text-terminal-red' : 'text-terminal-amber'}
                  `}>
                    Hawkins Signal Relay
                  </p>
                </div>
              </div>

              <div className={`
                font-mono text-xs
                ${isPossessed ? 'text-terminal-red blink' : 'text-terminal-green'}
              `}>
                {isPossessed
                  ? '⚠ DIMENSIONAL BREACH - ENTITY PRESENCE DETECTED ⚠'
                  : '107.7 FM • Upside Down Communication System • Classified 1983'}
              </div>
            </div>

            <SignalStrengthMeter sanity={sanity} isPossessed={isPossessed} />
          </div>
        </motion.header>

        <SanityMeter
          sanity={sanity}
          isPossessed={isPossessed}
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveView('encoder')}
            className={`
              px-4 py-2 font-mono text-sm border-2
              ${activeView === 'encoder'
                ? `${isPossessed ? 'bg-terminal-red border-terminal-red' : 'bg-terminal-green border-terminal-green'} text-black`
                : `bg-black ${isPossessed ? 'text-terminal-red border-terminal-red' : 'text-terminal-green border-terminal-green'}`}
            `}
          >
            📡 TRANSMIT MODE
          </button>
          <button
            onClick={() => setActiveView('decoder')}
            className={`
              px-4 py-2 font-mono text-sm border-2
              ${activeView === 'decoder'
                ? `${isPossessed ? 'bg-terminal-red border-terminal-red' : 'bg-terminal-green border-terminal-green'} text-black`
                : `bg-black ${isPossessed ? 'text-terminal-red border-terminal-red' : 'text-terminal-green border-terminal-green'}`}
            `}
          >
            🎧 RECEIVE MODE
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <TerminalScreen isPossessed={isPossessed}>
            {activeView === 'encoder' ? (
              <>
                <ContactSelector
                  onSelect={setSelectedContact}
                  selectedContact={selectedContact}
                  isPossessed={isPossessed}
                />

                <InputBox
                  onEncode={handleEncode}
                  onTransmit={handleTransmit}
                  isPossessed={isPossessed}
                />

                <EmergencyBroadcast
                  onTransmit={handleTransmit}
                  isPossessed={isPossessed}
                />

                {encodedMorse && (
                  <SignalOutput
                    morse={encodedMorse}
                    inputText={inputText}
                    isPossessed={isPossessed}
                  />
                )}
              </>
            ) : (
              <MorseDecoder isPossessed={isPossessed} />
            )}
          </TerminalScreen>

          <div className="space-y-4">
            <TerminalLogs logs={logs} isPossessed={isPossessed} />
            <ThemeCustomizer
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              isPossessed={isPossessed}
            />
          </div>
        </div>
      </motion.div>

      {isPossessed && <CorruptionOverlay />}

      {showRecovery && (
        <RecoveryPuzzle
          onRecover={recoverFromPossession}
          isPossessed={isPossessed}
        />
      )}

      <MessageArchive
        messages={messages}
        onReplay={handleReplay}
        isPossessed={isPossessed}
      />

      <AmbientSoundController
        sanity={sanity}
        isPossessed={isPossessed}
      />

      <StatisticsDashboard
        stats={stats}
        isPossessed={isPossessed}
      />

      <TutorialGuide
        isVisible={showTutorial}
        onClose={handleCloseTutorial}
        isPossessed={isPossessed}
      />
    </div>
  );
}

export default App;
