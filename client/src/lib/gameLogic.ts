export type Player = 'red' | 'blue';
export type GameMode = 'pvp' | 'solo';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TokenPosition {
  player: Player;
  tokenNumber: number;
}

export interface GameState {
  board: (TokenPosition | null)[][];
  currentPlayer: Player;
  round: number;
  phase: 'placement' | 'movement';
  winner: Player | null;
  gameMode: GameMode;
  humanPlayer: Player; // Only relevant in solo mode
  isBot: boolean; // True when it's the bot's turn
  difficulty?: Difficulty; // Bot difficulty level (only relevant in solo mode)
}

export const initializeGame = (gameMode: GameMode = 'pvp', difficulty: Difficulty = 'medium'): GameState => {
  // In solo mode, randomly assign human player
  const humanPlayer: Player = gameMode === 'solo' 
    ? Math.random() < 0.5 ? 'red' : 'blue' 
    : 'red';
  
  const startingPlayer: Player = 'red'; // Red always starts
  const isBot = gameMode === 'solo' && startingPlayer !== humanPlayer;

  return {
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    currentPlayer: startingPlayer,
    round: 1,
    phase: 'placement',
    winner: null,
    gameMode,
    humanPlayer,
    isBot,
    difficulty: gameMode === 'solo' ? difficulty : undefined
  };
};

export const getCurrentTokenToMove = (round: number): number => {
  if (round <= 6) {
    // Placement phase: rounds 1-6, players alternate placing tokens 1, 2, 3 in order
    // Round 1: Red token 1, Round 2: Blue token 1, Round 3: Red token 2, etc.
    return Math.floor((round - 1) / 2) + 1;
  }
  
  // Movement phase: cyclic pattern starting from round 7
  // Round 7: Red moves token 1, Round 8: Blue moves token 1
  // Round 9: Red moves token 2, Round 10: Blue moves token 2
  // Round 11: Red moves token 3, Round 12: Blue moves token 3, etc.
  const movementRound = round - 6; // Start from 1 for movement rounds
  const tokenIndex = Math.floor((movementRound - 1) / 2) % 3;
  return tokenIndex + 1; // Returns 1, 2, or 3
};

export interface WinningLine {
  player: Player;
  positions: { row: number; col: number }[];
  type: 'row' | 'column' | 'diagonal';
}

export const checkWinner = (board: (TokenPosition | null)[][]): Player | null => {
  // Check rows
  for (let row = 0; row < 3; row++) {
    const cell1 = board[row][0];
    const cell2 = board[row][1];
    const cell3 = board[row][2];
    if (cell1 && cell2 && cell3 &&
        cell1.player === cell2.player &&
        cell2.player === cell3.player) {
      return cell1.player;
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    const cell1 = board[0][col];
    const cell2 = board[1][col];
    const cell3 = board[2][col];
    if (cell1 && cell2 && cell3 &&
        cell1.player === cell2.player &&
        cell2.player === cell3.player) {
      return cell1.player;
    }
  }

  // Check diagonals
  const diag1_1 = board[0][0];
  const diag1_2 = board[1][1];
  const diag1_3 = board[2][2];
  if (diag1_1 && diag1_2 && diag1_3 &&
      diag1_1.player === diag1_2.player &&
      diag1_2.player === diag1_3.player) {
    return diag1_1.player;
  }

  const diag2_1 = board[0][2];
  const diag2_2 = board[1][1];
  const diag2_3 = board[2][0];
  if (diag2_1 && diag2_2 && diag2_3 &&
      diag2_1.player === diag2_2.player &&
      diag2_2.player === diag2_3.player) {
    return diag2_1.player;
  }

  return null;
};

export const getWinningLine = (board: (TokenPosition | null)[][]): WinningLine | null => {
  // Check rows
  for (let row = 0; row < 3; row++) {
    const cell1 = board[row][0];
    const cell2 = board[row][1];
    const cell3 = board[row][2];
    if (cell1 && cell2 && cell3 &&
        cell1.player === cell2.player &&
        cell2.player === cell3.player) {
      return {
        player: cell1.player,
        positions: [
          { row, col: 0 },
          { row, col: 1 },
          { row, col: 2 }
        ],
        type: 'row'
      };
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    const cell1 = board[0][col];
    const cell2 = board[1][col];
    const cell3 = board[2][col];
    if (cell1 && cell2 && cell3 &&
        cell1.player === cell2.player &&
        cell2.player === cell3.player) {
      return {
        player: cell1.player,
        positions: [
          { row: 0, col },
          { row: 1, col },
          { row: 2, col }
        ],
        type: 'column'
      };
    }
  }

  // Check diagonals
  const diag1_1 = board[0][0];
  const diag1_2 = board[1][1];
  const diag1_3 = board[2][2];
  if (diag1_1 && diag1_2 && diag1_3 &&
      diag1_1.player === diag1_2.player &&
      diag1_2.player === diag1_3.player) {
    return {
      player: diag1_1.player,
      positions: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 }
      ],
      type: 'diagonal'
    };
  }

  const diag2_1 = board[0][2];
  const diag2_2 = board[1][1];
  const diag2_3 = board[2][0];
  if (diag2_1 && diag2_2 && diag2_3 &&
      diag2_1.player === diag2_2.player &&
      diag2_2.player === diag2_3.player) {
    return {
      player: diag2_1.player,
      positions: [
        { row: 0, col: 2 },
        { row: 1, col: 1 },
        { row: 2, col: 0 }
      ],
      type: 'diagonal'
    };
  }

  return null;
};

export const getValidMoves = (
  board: (TokenPosition | null)[][],
  fromRow: number,
  fromCol: number
): { row: number; col: number }[] => {
  const validMoves: { row: number; col: number }[] = [];
  
  // Check all positions on the board - tokens can move to any empty space
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Skip the current position and only include empty cells
      if ((row !== fromRow || col !== fromCol) && board[row][col] === null) {
        validMoves.push({ row, col });
      }
    }
  }

  return validMoves;
};

export const makeMove = (
  gameState: GameState,
  toRow: number,
  toCol: number,
  fromPosition?: { row: number; col: number }
): GameState => {
  const newBoard = gameState.board.map(row => [...row]);
  const currentPlayer = gameState.currentPlayer;
  const currentRound = gameState.round;

  if (gameState.phase === 'placement') {
    // Placement phase: place the token with correct numbering
    const tokenNumber = getCurrentTokenToMove(currentRound);
    newBoard[toRow][toCol] = { player: currentPlayer, tokenNumber };
  } else if (gameState.phase === 'movement' && fromPosition) {
    // Movement phase: move the token
    const tokenToMove = newBoard[fromPosition.row][fromPosition.col];
    if (tokenToMove) {
      newBoard[fromPosition.row][fromPosition.col] = null;
      newBoard[toRow][toCol] = tokenToMove;
    }
  }

  // Check for winner
  const winner = checkWinner(newBoard);

  // Determine next player and phase
  const nextPlayer: Player = currentPlayer === 'red' ? 'blue' : 'red';
  const nextRound = currentRound + 1;
  const nextPhase = nextRound <= 6 ? 'placement' : 'movement';
  
  // Determine if next turn is bot's turn
  const nextIsBot = gameState.gameMode === 'solo' && nextPlayer !== gameState.humanPlayer;

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    round: nextRound,
    phase: nextPhase,
    winner,
    gameMode: gameState.gameMode,
    humanPlayer: gameState.humanPlayer,
    isBot: nextIsBot
  };
};

export const isValidMove = (
  gameState: GameState,
  toRow: number,
  toCol: number,
  fromPosition?: { row: number; col: number }
): boolean => {
  // Check if target cell is empty
  if (gameState.board[toRow][toCol] !== null) {
    return false;
  }

  if (gameState.phase === 'placement') {
    // In placement phase, any empty cell is valid
    return true;
  } else if (gameState.phase === 'movement' && fromPosition) {
    // In movement phase, any empty cell is valid (not just adjacent)
    const validMoves = getValidMoves(gameState.board, fromPosition.row, fromPosition.col);
    return validMoves.some(move => move.row === toRow && move.col === toCol);
  }

  return false;
};

// Bot AI Functions
export const getAllPossibleMoves = (gameState: GameState): { row: number; col: number; fromPosition?: { row: number; col: number } }[] => {
  const moves: { row: number; col: number; fromPosition?: { row: number; col: number } }[] = [];

  if (gameState.phase === 'placement') {
    // In placement phase, find all empty cells
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState.board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
  } else {
    // In movement phase, find all possible moves for the current token
    const currentTokenNumber = getCurrentTokenToMove(gameState.round);
    const currentPlayer = gameState.currentPlayer;

    // Find all tokens of the current player with the current token number
    for (let fromRow = 0; fromRow < 3; fromRow++) {
      for (let fromCol = 0; fromCol < 3; fromCol++) {
        const cell = gameState.board[fromRow][fromCol];
        if (cell && cell.player === currentPlayer && cell.tokenNumber === currentTokenNumber) {
          // Get all valid moves from this position
          const validMoves = getValidMoves(gameState.board, fromRow, fromCol);
          for (const move of validMoves) {
            moves.push({
              row: move.row,
              col: move.col,
              fromPosition: { row: fromRow, col: fromCol }
            });
          }
        }
      }
    }
  }

  return moves;
};

export const evaluateBoard = (board: (TokenPosition | null)[][], player: Player): number => {
  const winner = checkWinner(board);
  if (winner === player) return 1000;
  if (winner && winner !== player) return -1000;

  let score = 0;
  const opponent: Player = player === 'red' ? 'blue' : 'red';

  // Check rows, columns, and diagonals for potential wins/blocks
  const lines = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (const line of lines) {
    const cells = line.map(([r, c]) => board[r][c]);
    const playerCount = cells.filter(cell => cell?.player === player).length;
    const opponentCount = cells.filter(cell => cell?.player === opponent).length;
    const emptyCount = cells.filter(cell => cell === null).length;

    // Advanced scoring system
    if (playerCount === 3) score += 1000; // Win
    if (opponentCount === 3) score -= 1000; // Loss
    if (playerCount === 2 && emptyCount === 1) score += 50; // Potential win
    if (opponentCount === 2 && emptyCount === 1) score += 100; // Must block (higher priority)
    if (playerCount === 1 && emptyCount === 2) score += 5; // Building position
    if (opponentCount === 1 && emptyCount === 2) score -= 3; // Opponent building
  }

  // Strategic positions - center and corners are valuable
  const centerCell = board[1][1];
  if (centerCell?.player === player) score += 15;
  if (centerCell?.player === opponent) score -= 15;

  // Corner positions
  const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
  for (const [r, c] of corners) {
    const corner = board[r][c];
    if (corner?.player === player) score += 8;
    if (corner?.player === opponent) score -= 8;
  }

  return score;
};

// Minimax algorithm with alpha-beta pruning for smarter bot
export const minimax = (
  gameState: GameState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  botPlayer: Player
): { score: number; move?: { row: number; col: number; fromPosition?: { row: number; col: number } } } => {
  
  // Base case - check for terminal states
  const winner = checkWinner(gameState.board);
  if (winner === botPlayer) return { score: 1000 - depth };
  if (winner && winner !== botPlayer) return { score: -1000 + depth };
  if (depth === 0) return { score: evaluateBoard(gameState.board, botPlayer) };

  const possibleMoves = getAllPossibleMoves(gameState);
  if (possibleMoves.length === 0) return { score: evaluateBoard(gameState.board, botPlayer) };

  let bestMove: { row: number; col: number; fromPosition?: { row: number; col: number } } | undefined;

  if (isMaximizing) {
    let maxScore = -Infinity;
    
    for (const move of possibleMoves) {
      const newState = makeMove(gameState, move.row, move.col, move.fromPosition);
      const result = minimax(newState, depth - 1, false, alpha, beta, botPlayer);
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    
    for (const move of possibleMoves) {
      const newState = makeMove(gameState, move.row, move.col, move.fromPosition);
      const result = minimax(newState, depth - 1, true, alpha, beta, botPlayer);
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: minScore, move: bestMove };
  }
};

export const getBotMove = (gameState: GameState): { row: number; col: number; fromPosition?: { row: number; col: number } } | null => {
  const possibleMoves = getAllPossibleMoves(gameState);
  if (possibleMoves.length === 0) return null;

  const botPlayer = gameState.currentPlayer;
  const difficulty = gameState.difficulty || 'medium';
  const moveCount = possibleMoves.length;

  console.log(`Bot (${botPlayer}) thinking... ${moveCount} possible moves, phase: ${gameState.phase}, round: ${gameState.round}, difficulty: ${difficulty}`);

  // Easy difficulty: Almost entirely random with minimal strategic awareness
  if (difficulty === 'easy') {
    // Only 5% chance to play strategically, 95% random
    if (Math.random() < 0.05) {
      // Very rarely check for winning moves (never block opponent)
      for (const move of possibleMoves) {
        const simulatedState = makeMove(gameState, move.row, move.col, move.fromPosition);
        if (simulatedState.winner === botPlayer) {
          console.log('Bot (Easy) occasionally found winning move:', move);
          return move;
        }
      }
    }
    
    // 95% of the time, play completely randomly
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    console.log('Bot (Easy) playing random move:', randomMove);
    return randomMove;
  }

  // Medium and Hard difficulty: Always check for winning moves (Easy skips this)
  if (difficulty !== 'easy') {
    for (const move of possibleMoves) {
      const simulatedState = makeMove(gameState, move.row, move.col, move.fromPosition);
      if (simulatedState.winner === botPlayer) {
        console.log('Bot found winning move:', move);
        return move;
      }
    }

    // Always check for blocking opponent's winning moves (Easy doesn't block)
    const opponent: Player = botPlayer === 'red' ? 'blue' : 'red';
    const opponentTurnState = { ...gameState, currentPlayer: opponent, isBot: false };
    const opponentMoves = getAllPossibleMoves(opponentTurnState);
    for (const opponentMove of opponentMoves) {
      const simulatedState = makeMove(opponentTurnState, opponentMove.row, opponentMove.col, opponentMove.fromPosition);
      if (simulatedState.winner === opponent) {
        for (const ourMove of possibleMoves) {
          if (ourMove.row === opponentMove.row && ourMove.col === opponentMove.col) {
            console.log('Bot blocking opponent winning move at:', ourMove);
            return ourMove;
          }
        }
      }
    }
  }

  // Medium difficulty: Good defensive play but not perfect offense
  if (difficulty === 'medium') {
    // 70% chance to use strategic thinking, 30% chance for simpler heuristics
    if (Math.random() < 0.7) {
      const maxDepth = gameState.phase === 'placement' ? 2 : 3;
      console.log(`Using minimax with depth ${maxDepth} (Medium)`);
      
      const result = minimax(gameState, maxDepth, true, -Infinity, Infinity, botPlayer);
      
      if (result.move) {
        console.log('Bot (Medium) selected strategic move:', result.move, 'with score:', result.score);
        return result.move;
      }
    } else {
      // Use simple heuristics 30% of the time
      console.log('Bot (Medium) using simple heuristics');
    }
  }

  // Hard difficulty: Maximum strategic depth and perfect play
  if (difficulty === 'hard') {
    const maxDepth = gameState.phase === 'placement' ? 6 : 8; // Much deeper search
    console.log(`Using minimax with depth ${maxDepth} (Hard)`);
    
    const result = minimax(gameState, maxDepth, true, -Infinity, Infinity, botPlayer);
    
    if (result.move) {
      console.log('Bot (Hard) selected strategic move:', result.move, 'with score:', result.score);
      return result.move;
    }
  }

  // Fallback to heuristic evaluation (for medium difficulty fallback and general backup)
  let bestMove = possibleMoves[0];
  let bestScore = -Infinity;

  for (const move of possibleMoves) {
    let score = 0;
    
    // Strategic positioning evaluation
    if (move.row === 1 && move.col === 1) score += 30; // Center is very valuable
    if ((move.row === 0 || move.row === 2) && (move.col === 0 || move.col === 2)) score += 20; // Corners
    
    // Evaluate the position after this move
    const simulatedState = makeMove(gameState, move.row, move.col, move.fromPosition);
    score += evaluateBoard(simulatedState.board, botPlayer);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  console.log(`Bot (${difficulty}) fallback move:`, bestMove, 'with score:', bestScore);
  return bestMove;
};
