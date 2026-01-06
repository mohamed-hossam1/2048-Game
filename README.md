

# 2048 Game

A modern, responsive implementation of the classic 2048 puzzle game built with vanilla JavaScript ES6 modules and CSS Grid. This implementation features smooth animations, touch support for mobile devices, and a clean, minimalist design.

## Features

- **Classic 2048 Gameplay**: Slide tiles to combine numbers and reach 2048
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Touch Support**: Swipe gestures for mobile gameplay
- **Keyboard Controls**: Arrow keys for desktop gameplay
- **Smooth Animations**: CSS transitions and animations for tile movements
- **Score Tracking**: Keep track of your current score
- **Game Over Detection**: Detects when no more moves are possible
- **Modern Design**: Clean, minimalist interface with gradient color scheme

## How to Play

1. **Objective**: Combine tiles with the same number to reach 2048
2. **Controls**:
   - **Desktop**: Use arrow keys (↑, ↓, ←, →) to move tiles
   - **Mobile**: Swipe in any direction to move tiles
3. **Rules**:
   - Tiles slide as far as possible in the chosen direction
   - When two tiles with the same number touch, they merge into one
   - After each move, a new tile (2 or 4) appears randomly
   - The game ends when the board is full and no moves are possible

## Technologies Used

- **HTML5**: Semantic markup for game structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Vanilla JavaScript with modules
- **CSS Grid**: For game board layout
- **CSS Animations**: Smooth tile movements and merging effects

## Project Structure

```
├── index.html               # Main HTML file
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── script.js           # Main game logic
│   ├── Grid.js             # Grid class for game board
│   └── Tile.js             # Tile class for individual tiles
├── assets/
│   └── icons/
│       └── icon.png        # Game icon
└── README.md               # This file
```

## Code Architecture

### Grid Class (`Grid.js`)
- Manages the 4x4 game board
- Handles cell creation and positioning
- Provides methods for finding empty cells
- Organizes cells by rows and columns for movement logic

### Tile Class (`Tile.js`)
- Represents individual game tiles
- Manages tile appearance, positioning, and animations
- Handles tile merging and removal
- Applies color schemes based on tile values

### Main Script (`script.js`)
- Handles user input (keyboard and touch)
- Manages game state and logic
- Coordinates tile movements and merging
- Detects game over conditions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamed-hossam1/2048-Game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd 2048-Game
   ```

3. Open `index.html` in your browser


## Demo

Play the game online at: https://2048-game-mo.netlify.app/

## Customization

### Custom Colors
Modify the `tileStyles` array in `Tile.js` to change tile colors:

```javascript
const tileStyles = [
  {bg: '#c5b3fbff', text: '#333333', size: '9vmin' },
  {bg: '#b69ef4ff', text: '#333333', size: '9vmin' },
  // ... more styles
];
```

### Grid Size
Change the `GRID_SIZE` constant in `Grid.js` to modify board dimensions:

```javascript
const GRID_SIZE = 4 // Change to 3, 5, 6, etc.
```

## Game Features in Detail

### Movement System
- Tiles slide to the farthest possible position
- Tiles with equal values merge when they collide
- Merged tiles cannot merge again in the same turn
- New tiles appear after each successful move

### Animation System
- Smooth CSS transitions for tile movements
- Merge animations with scaling effects
- Responsive animations that adapt to screen size

### Touch Support
- Swipe detection for mobile devices
- Prevents default touch behaviors during gameplay
- Works alongside keyboard controls


---

Challenge yourself to reach 2048 and beyond! 🎮
