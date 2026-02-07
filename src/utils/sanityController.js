/**
 * Sanity Controller - Manages sanity meter state and decay
 */

export class SanityController {
  constructor(initialSanity = 100) {
    this.sanity = initialSanity;
    this.maxSanity = 100;
    this.decayRate = 0.5; // Points per second
    this.lastUpdate = Date.now();
    this.isPaused = false;
  }

  /**
   * Update sanity based on time elapsed
   * @returns {number} Current sanity level
   */
  update() {
    if (this.isPaused) return this.sanity;
    
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
    this.lastUpdate = now;
    
    this.sanity = Math.max(0, this.sanity - (this.decayRate * deltaTime));
    
    return this.sanity;
  }

  /**
   * Reset sanity to maximum
   */
  reset() {
    this.sanity = this.maxSanity;
    this.lastUpdate = Date.now();
  }

  /**
   * Set sanity to specific value
   * @param {number} value - New sanity value
   */
  setSanity(value) {
    this.sanity = Math.max(0, Math.min(this.maxSanity, value));
  }

  /**
   * Pause sanity decay
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume sanity decay
   */
  resume() {
    this.isPaused = false;
    this.lastUpdate = Date.now();
  }

  /**
   * Get current sanity level
   * @returns {number} Sanity level (0-100)
   */
  getSanity() {
    return this.sanity;
  }

  /**
   * Check if possessed (sanity at 0)
   * @returns {boolean} Whether possessed
   */
  isPossessed() {
    return this.sanity <= 0;
  }

  /**
   * Get sanity state
   * @returns {string} State description
   */
  getState() {
    if (this.sanity > 70) return 'stable';
    if (this.sanity > 40) return 'unstable';
    if (this.sanity > 20) return 'critical';
    if (this.sanity > 0) return 'danger';
    return 'possessed';
  }

  /**
   * Get shake intensity based on sanity
   * @returns {number} Shake intensity (0-1)
   */
  getShakeIntensity() {
    return Math.max(0, (100 - this.sanity) / 100);
  }

  /**
   * Decrease sanity by specific amount
   * @param {number} amount - Amount to decrease
   */
  damage(amount) {
    this.sanity = Math.max(0, this.sanity - amount);
  }

  /**
   * Increase sanity by specific amount
   * @param {number} amount - Amount to increase
   */
  heal(amount) {
    this.sanity = Math.min(this.maxSanity, this.sanity + amount);
  }
}

/**
 * Get color based on sanity level
 * @param {number} sanity - Sanity level (0-100)
 * @returns {string} Color code
 */
export const getSanityColor = (sanity) => {
  if (sanity > 70) return '#00ff41';
  if (sanity > 40) return '#ffb000';
  if (sanity > 20) return '#ff6600';
  return '#ff0000';
};

/**
 * Get warning message based on sanity level
 * @param {number} sanity - Sanity level (0-100)
 * @returns {string} Warning message
 */
export const getSanityWarning = (sanity) => {
  if (sanity > 70) return 'SYSTEM STABLE';
  if (sanity > 40) return 'INTERFERENCE DETECTED';
  if (sanity > 20) return 'CRITICAL WARNING';
  if (sanity > 0) return 'DIMENSIONAL BREACH';
  return 'POSSESSED';
};

export default {
  SanityController,
  getSanityColor,
  getSanityWarning
};
