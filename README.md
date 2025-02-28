# Advanced Snake Game

A modern, feature-rich implementation of the classic Snake game built with HTML5 Canvas, JavaScript, and CSS.

## Features

- **Level Progression System:** Advance through levels based on snake length
  - Level 2: 10 units
  - Level 3: 20 units
  - Level 4: 50 units
  - Level 5: 100 units

- **Dynamic Difficulty:**
  - Increasing number of obstacles with each level
  - Faster game speed at higher levels
  - Clear next-level targets displayed on screen

- **Enhanced Visuals:**
  - Color-coded snake with distinct head
  - Pulsing food animation
  - Level-specific snake colors
  - Grid layout for better orientation
  - Responsive design with smooth animations

- **Game Controls:**
  - Arrow keys for movement
  - Spacebar or button for pause/resume
  - Restart button to begin a new game

- **Progress Tracking:**
  - High score saved between sessions
  - Current score, level, and snake length displayed
  - Detailed game over screen with stats

## How to Play

1. Use the arrow keys to control the snake's direction
2. Eat the red food to grow your snake and increase your score
3. Avoid hitting the walls, obstacles, and yourself
4. Reach the length thresholds to advance to higher levels
5. Press spacebar or the Pause button to pause/resume the game

## Game Mechanics

- **Scoring:** Points earned are equal to your current level
- **Leveling Up:** Reaching specific snake length thresholds triggers level advancement
- **Obstacles:** The number of obstacles increases with each level (Level × 3)
- **Speed:** Game speed increases with each level for added challenge

## Installation

### Direct Download
1. Download the game files:
   - index.html
   - script.js
   - styles.css

2. Open index.html in any modern browser to start playing

### GitHub Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KalyanRajSahu-Snap/snake-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd snake-game
   ```

3. Open index.html in your browser or use a local server:
   ```bash
   # Using Python to create a simple HTTP server
   python -m http.server 8000
   ```

4. Then open http://localhost:8000 in your browser

## Browser Compatibility

The game works on all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

Possible future additions:
- Power-ups (speed boost, temporary invincibility, etc.)
- Multiple game modes (timed, maze, etc.)
- Customizable snake appearance
- Mobile touch controls
- Multiplayer support

## Credits

Created as a modern take on the classic Snake game. Feel free to modify and expand upon this codebase for your own projects.

## License

MIT License - Feel free to use, modify, and distribute this code for personal or commercial projects.

Enjoy the game!
