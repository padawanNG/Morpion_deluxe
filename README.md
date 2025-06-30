# Improved Tic-Tac-Toe Game

A modern, strategic twist on the classic Tic-Tac-Toe game with placement and movement phases, multiple difficulty levels, and beautiful animations.

## Features

- **Enhanced Gameplay**: Two phases - placement (rounds 1-6) and movement (round 7+)
- **Solo Mode**: Play against AI with three difficulty levels (Easy, Medium, Hard)
- **Two Player Mode**: Local multiplayer for friends
- **Visual Effects**: Winning line animations, smooth transitions, and responsive design
- **Audio Feedback**: Sound effects for moves, wins, and bot actions
- **Dark/Light Theme**: Toggle between themes
- **Strategic Depth**: Each player has 3 numbered tokens that can be moved in the second phase

## Running on Mac

### Option 1: Download and Run Locally (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version for Mac

2. **Download the game**:
   ```bash
   # Clone or download this repository
   git clone [repository-url]
   cd improved-tic-tac-toe
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the game**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - The game will automatically open at `http://localhost:5000`
   - If it doesn't open automatically, copy this URL into your browser

### Option 2: Build for Production

If you want to create a standalone version:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

### System Requirements

- **macOS**: 10.14 or later
- **Node.js**: 18.0 or later
- **RAM**: 2GB minimum
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Troubleshooting

- **Port already in use**: If port 5000 is busy, the app will automatically use another port
- **Installation issues**: Try clearing npm cache with `npm cache clean --force`
- **Permission errors**: Use `sudo` if needed for global installations

## Game Rules

### Placement Phase (Rounds 1-6)
- Players alternate placing tokens numbered 1, 2, 3 in order
- Red player always goes first
- Each player places exactly 3 tokens

### Movement Phase (Round 7+)
- Players move their tokens cyclically (1→2→3→1...)
- Tokens can move to any empty cell on the board
- Strategic positioning becomes crucial

### Victory Condition
- Align 3 tokens in a row, column, or diagonal to win
- Winning line animates with a pulsing green glow

## Bot Difficulty Levels

- **Easy**: Plays 95% randomly, rarely takes winning moves, never blocks
- **Medium**: Uses strategic thinking 70% of the time with moderate planning
- **Hard**: Perfect strategic play with deep analysis (6-8 move lookahead)

## Development

Built with:
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand

## License

This project is open source and available under the MIT License.