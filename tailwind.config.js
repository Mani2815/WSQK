/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-green': 'var(--color-terminal-green)',
        'terminal-red': 'var(--color-terminal-red)',
        'terminal-amber': 'var(--color-terminal-amber)',
        'crt-bg': '#0a0a0a',
        'upside-down': '#1a0505',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'mono': ['"VT323"', 'monospace'],
        'retro': ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 0.3s infinite',
        'shake': 'shake 0.5s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
