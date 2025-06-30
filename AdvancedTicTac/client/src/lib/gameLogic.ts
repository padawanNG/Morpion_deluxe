export type Player = 'red' | 'blue';

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
}

export const initializeGame = (): GameState => {
  return {
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    currentPlayer: 'red',
    round: 1,
    phase: 'placement',
    winner: null
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

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    round: nextRound,
    phase: nextPhase,
    winner
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
