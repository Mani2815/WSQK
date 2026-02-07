/**
 * Sound Engine - Manages audio using Web Audio API and Howler.js
 */

class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.oscillator = null;
    this.gainNode = null;
    this.initialized = false;
  }

  /**
   * Initialize audio context
   */
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.initialized = true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  /**
   * Play morse code beep
   * @param {string} type - 'dot' or 'dash'
   * @param {boolean} isPossessed - Whether in possessed mode
   */
  playMorseBeep(type = 'dot', isPossessed = false) {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Set frequency
    let frequency = type === 'dot' ? 800 : 600;
    if (isPossessed) {
      frequency = frequency * (0.5 + Math.random() * 0.8); // Distort in possessed mode
    }
    
    oscillator.frequency.value = frequency;
    oscillator.type = isPossessed ? 'sawtooth' : 'sine';
    
    // Set duration
    const duration = type === 'dot' ? 0.15 : 0.4;
    
    // Configure gain envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play static noise
   * @param {number} duration - Duration in seconds
   * @param {number} intensity - Intensity level (0-1)
   */
  playStatic(duration = 0.5, intensity = 0.3) {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * intensity;
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = intensity;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
  }

  /**
   * Play interference hum
   * @param {number} duration - Duration in seconds
   */
  playInterference(duration = 2) {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const lfoGain = this.audioContext.createGain();
    const lfo = this.audioContext.createOscillator();
    
    // Main oscillator
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 60;
    
    // LFO for amplitude modulation
    lfo.type = 'sine';
    lfo.frequency.value = 3;
    lfoGain.gain.value = 0.3;
    
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    
    gainNode.gain.value = 0.2;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    lfo.start();
    
    setTimeout(() => {
      oscillator.stop();
      lfo.stop();
    }, duration * 1000);
  }

  /**
   * Play possession sound effect
   */
  playPossessionSound() {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;

    // Create descending glitch sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1);
    
    // Add static
    setTimeout(() => this.playStatic(0.5, 0.5), 200);
  }

  /**
   * Play recovery sound effect
   */
  playRecoverySound() {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;

    // Create ascending successful sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = null;
    }
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();

export default soundEngine;
