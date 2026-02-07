# Quick Setup Guide - Ultimate Edition

## Installation Steps

### 1. Extract the Project
Extract the ZIP file to your desired location.

### 2. Open Terminal
Navigate to the project folder:
```bash
cd upside-down-communicator-ultimate
```

### 3. Install Dependencies
```bash
npm install
```

This will install all required packages including the new components.

### 4. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## What You'll See

### Core Interface
1. **Header**: "UPSIDE DOWN COMMUNICATOR - Ultimate Edition"
2. **Signal Strength Meter**: Real-time connection indicator (top-right)
3. **Settings Button**: Gear icon (⚙) in top-right
4. **Sanity Meter**: Analog meter with digital readout
5. **View Toggle**: Switch between ENCODER and DECODER modes
6. **Terminal Screens**: Main interface with CRT effects

### New Ultimate Features

#### Bottom Interface
- **📊 STATS** (bottom-left): Statistics dashboard
- **📜 ARCHIVE** (bottom-right): Message history
- **🔊** (bottom-right): Ambient sound controller

#### Main View - Encoder
- Contact selector with 8 characters
- Text input with morse encoder
- Emergency broadcast buttons
- Signal output displays

#### Main View - Decoder
- Switch to decoder tab
- Text mode or tap mode for morse input
- Real-time morse-to-text decoding

#### Right Panel
- Terminal logs (real-time system events)
- Theme customizer (5 color schemes)

## Testing Guide

### Test 1: Basic Message Transmission
1. Type "HELLO" in encoder
2. Select a contact (e.g., ELEVEN)
3. Click TRANSMIT
4. Watch LED blink, waveform animate, patterns display
5. Hear morse beep sounds
6. Check terminal logs for confirmation

### Test 2: Emergency Broadcast
1. Click any emergency button (HELP, DANGER, etc.)
2. Message transmits instantly
3. Check logs and archive

### Test 3: Message Archive
1. Send multiple messages
2. Click 📜 ARCHIVE button
3. See all past messages with timestamps
4. Click ▶ to replay a message
5. Click EXPORT to save as JSON

### Test 4: Morse Decoder
1. Switch to DECODER tab
2. **Text Mode**: Type `.... . .-.. .-.. ---` (HELLO in morse)
3. **Tap Mode**: Click quick for dot, hold for dash
4. Watch real-time decoding

### Test 5: Sanity System
1. Watch sanity meter decay
2. Notice color changes:
   - Green (stable)
   - Yellow (unstable)
   - Orange (critical)
   - Red (danger)
3. Wait for 0% or adjust decay rate in settings

### Test 6: Possessed Mode
1. When sanity hits 0%
2. Screen turns red and glitches
3. UI becomes unstable
4. Recovery puzzle appears
5. Enter Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
6. Watch recovery animation

### Test 7: Settings Panel
1. Click ⚙ (top-right)
2. Adjust sanity decay rate
3. Change effects intensity
4. Toggle CRT effects
5. Toggle sound effects
6. See changes apply immediately

### Test 8: Statistics Dashboard
1. Click 📊 STATS
2. View messages sent
3. See session time
4. Check possession/recovery counts
5. View activity chart

### Test 9: Theme Customizer
1. Scroll to Theme Customizer panel
2. Try each theme:
   - Classic Green
   - Amber Alert
   - Red Danger
   - Blue Ice
   - Purple Void
3. Watch entire UI update

### Test 10: Ambient Sound
1. Click 🔊 button
2. Toggle power ON
3. Adjust volume slider
4. Select different sound types:
   - Radio Static
   - Lab Equipment
   - Dimensional Rift
5. Hear atmospheric effects

### Test 11: Interactive Tutorial
1. On first visit, tutorial auto-starts
2. Use ← → arrows to navigate
3. Read all 8 steps
4. Click GET STARTED
5. Re-enable in settings if needed

## Quick Feature Reference

### Keyboard Shortcuts
- **↑↓←→**: Konami code navigation
- **B, A**: Konami code inputs
- **Enter**: Submit/transmit
- **Escape**: Close modals
- **←→**: Tutorial navigation

### UI Buttons
- **⚙**: Settings panel
- **📊**: Statistics
- **📜**: Message archive
- **🔊/🔇**: Ambient sound
- **ENCODER/DECODER**: Mode toggle
- **Emergency buttons**: One-click transmission

### Data Persistence
All these are automatically saved:
- Messages (when auto-save enabled)
- Statistics
- Settings preferences
- Theme selection
- Tutorial completion status

## Troubleshooting

### Port 3000 in Use
```bash
# Edit vite.config.js
server: {
  port: 3001, // Change port
}
```

### Audio Not Playing
1. Click anywhere on page first
2. Check Settings → Sound Effects
3. Verify browser permissions

### Features Not Appearing
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Check console for errors
4. Verify all files extracted

### Styles Not Loading
1. Ensure in correct directory
2. Run `npm install` again
3. Check terminal for errors
4. Verify Tailwind config

### Settings Not Saving
1. Check localStorage permissions
2. Try different browser
3. Clear old localStorage:
```javascript
// In browser console
localStorage.clear();
```

## Building for Production

```bash
# Build
npm run build

# Preview
npm run preview

# Output in dist/ folder
```

## Quick Tips

1. **First Time?** Let the tutorial guide you
2. **Practice Mode?** Set sanity decay to 0.1x
3. **Full Immersion?** Enable ambient sound
4. **Track Progress?** Check stats dashboard regularly
5. **Save Everything?** Enable auto-save in settings
6. **Learn Morse?** Use decoder in tap mode
7. **Find Bugs?** Check browser console

## Component Overview

### Encoder View
- Contact selector
- Text input
- Emergency broadcast
- Signal output

### Decoder View
- Morse input (text/tap)
- Real-time decoding
- Audio feedback

### Side Panels
- Terminal logs (system events)
- Theme customizer (colors)

### Floating Buttons
- Settings (top-right)
- Statistics (bottom-left)
- Archive (bottom-right)
- Ambient sound (bottom-right)

## Next Steps

1. ✅ Complete tutorial
2. ✅ Send first message
3. ✅ Try emergency broadcast
4. ✅ Decode some morse
5. ✅ Customize your theme
6. ✅ Adjust settings to preference
7. ✅ Explore all 13 new features
8. ✅ Track your statistics
9. ✅ Experience possession mode
10. ✅ Master the Konami code

## Performance Tips

For best experience:
- Use modern browser (Chrome, Firefox, Edge, Safari)
- Close unnecessary tabs
- Disable other extensions if laggy
- Reduce effects intensity if needed
- Use hardware acceleration

## Getting Help

1. Read this SETUP guide
2. Check main README.md
3. Review tutorial in app
4. Check browser console
5. Verify all dependencies installed

## Enjoy the Ultimate Edition!

You now have access to:
- ✅ All original features
- ✅ 13 new components
- ✅ Complete customization
- ✅ Full data tracking
- ✅ Enhanced audio/visual
- ✅ Interactive tutorial
- ✅ Professional statistics
- ✅ Message persistence

**Welcome to the most complete Upside Down communication experience!** 🌀

---

*For detailed documentation, see README.md*  
*For issues, check browser console*  
*For fun, try all the features!*
