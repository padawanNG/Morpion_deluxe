import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameModeSelector from './GameModeSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudio } from '@/lib/stores/useAudio';
import { 
  GameState, 
  Player, 
  TokenPosition, 
  GameMode,
  Difficulty,
  WinningLine,
  initializeGame, 
  makeMove, 
  checkWinner, 
  getValidMoves,
  getCurrentTokenToMove,
  getBotMove,
  getWinningLine
} from '../lib/gameLogic';

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [selectedPosition, setSelectedPosition] = useState<{ row: number; col: number } | null>(null);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const { playClick, playPlacement, playMovement, playBotMove, playSuccess } = useAudio();

  // Update valid moves when game state changes
  useEffect(() => {
    if (gameState.phase === 'movement' && selectedPosition) {
      const moves = getValidMoves(gameState.board, selectedPosition.row, selectedPosition.col);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [gameState, selectedPosition]);

  // Update winning line when game state changes
  useEffect(() => {
    if (gameState.winner) {
      const line = getWinningLine(gameState.board);
      setWinningLine(line);
    } else {
      setWinningLine(null);
    }
  }, [gameState]);

  // Handle bot moves in solo mode
  useEffect(() => {
    if (gameState.isBot && !gameState.winner && gameState.gameMode === 'solo') {
      const timer = setTimeout(() => {
        const botMove = getBotMove(gameState);
        if (botMove) {
          console.log('Bot making move:', botMove);
          playBotMove(); // Play bot move sound
          const newGameState = makeMove(gameState, botMove.row, botMove.col, botMove.fromPosition);
          setGameState(newGameState);
          setSelectedPosition(null);
          setValidMoves([]);
          
          // Play success sound if bot wins
          if (newGameState.winner) {
            setTimeout(() => playSuccess(), 300);
          }
        }
      }, 1000); // 1 second delay for bot move to feel natural

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.winner) return;
    if (gameState.isBot) return; // Prevent clicking during bot's turn

    console.log('Cell clicked:', row, col, 'Phase:', gameState.phase, 'Round:', gameState.round);

    if (gameState.phase === 'placement') {
      // Placement phase: place token if cell is empty
      if (gameState.board[row][col] === null) {
        // In PvP mode, use different sounds for red/blue players
        if (gameState.gameMode === 'pvp' && gameState.currentPlayer === 'blue') {
          playBotMove(); // Blue player uses bot sound in PvP
        } else {
          playPlacement(); // Red player or solo mode uses placement sound
        }
        
        const newGameState = makeMove(gameState, row, col);
        console.log('Placement move made, new state:', newGameState);
        setGameState(newGameState);
        
        // Play success sound if someone wins
        if (newGameState.winner) {
          setTimeout(() => playSuccess(), 300);
        }
      }
    } else {
      // Movement phase
      const currentPlayer = gameState.currentPlayer;
      const currentTokenNumber = getCurrentTokenToMove(gameState.round);
      const cellContent = gameState.board[row][col];

      console.log('Movement phase - Current player:', currentPlayer, 'Token to move:', currentTokenNumber);
      console.log('Cell content:', cellContent, 'Selected position:', selectedPosition);

      if (selectedPosition) {
        // If we have a selected position, try to move to this cell
        if (gameState.board[row][col] === null && 
            validMoves.some(move => move.row === row && move.col === col)) {
          // In PvP mode, use different sounds for red/blue players
          if (gameState.gameMode === 'pvp' && gameState.currentPlayer === 'blue') {
            playBotMove(); // Blue player uses bot sound in PvP
          } else {
            playPlacement(); // Red player or solo mode uses placement sound
          }
          
          console.log('Making movement from', selectedPosition, 'to', row, col);
          const newGameState = makeMove(gameState, row, col, selectedPosition);
          console.log('Movement made, new state:', newGameState);
          setGameState(newGameState);
          setSelectedPosition(null);
          setValidMoves([]);
          
          // Play success sound if someone wins
          if (newGameState.winner) {
            setTimeout(() => playSuccess(), 300);
          }
        } else {
          // Invalid move or clicking on occupied cell
          console.log('Invalid move attempted');
          setSelectedPosition(null);
          setValidMoves([]);
        }
      } else {
        // No position selected, check if clicking on own token that should be moved
        if (cellContent && 
            cellContent.player === currentPlayer && 
            cellContent.tokenNumber === currentTokenNumber) {
          console.log('Selecting token at', row, col);
          setSelectedPosition({ row, col });
        } else {
          console.log('Cannot select this token - wrong player or token number');
        }
      }
    }
  }, [gameState, selectedPosition, validMoves]);

  const resetGame = useCallback((mode?: GameMode, newDifficulty?: Difficulty) => {
    const newMode = mode || gameState.gameMode;
    const currentDifficulty = newDifficulty || difficulty;
    // Always create a fresh game state for solo mode to ensure random assignment
    setGameState(initializeGame(newMode, currentDifficulty));
    setSelectedPosition(null);
    setValidMoves([]);
    setWinningLine(null);
  }, [gameState.gameMode, difficulty]);

  const handleModeSelect = useCallback((mode: GameMode, newDifficulty?: Difficulty) => {
    // Always create a new game when switching modes to ensure random assignment
    if (mode === 'solo') {
      const currentDifficulty = newDifficulty || difficulty;
      setDifficulty(currentDifficulty);
      // Force new random assignment for solo mode
      const newGameState = initializeGame(mode, currentDifficulty);
      setGameState(newGameState);
      setSelectedPosition(null);
      setValidMoves([]);
      setWinningLine(null);
    } else {
      resetGame(mode, newDifficulty);
    }
  }, [resetGame, difficulty]);

  const winner = gameState.winner;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      {/* Game Board */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Improved Tic-Tac-Toe
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            selectedPosition={selectedPosition}
            validMoves={validMoves}
            gamePhase={gameState.phase}
            winningLine={winningLine}
          />
        </CardContent>
      </Card>

      {/* Game Status Panel */}
      <div className="lg:w-80">
        <GameModeSelector
          onModeSelect={handleModeSelect}
          gameMode={gameState.gameMode}
          difficulty={difficulty}
          humanPlayer={gameState.humanPlayer}
        />
        
        <GameStatus
          gameState={gameState}
          winner={winner}
          selectedPosition={selectedPosition}
        />
        
        <Card className="mt-4">
          <CardContent className="pt-6">
            <Button 
              onClick={() => {
                playClick();
                resetGame();
              }}
              className="w-full"
              variant="outline"
            >
              Reset Game
            </Button>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Placement Phase (Rounds 1-6):</strong></p>
            <p>• Players alternate placing tokens 1, 2, 3 in order</p>
            <p><strong>Movement Phase (Round 7+):</strong></p>
            <p>• Move tokens cyclically (1→2→3→1...)</p>
            <p>• Tokens can move to any empty cell</p>
            <p><strong>Goal:</strong> Align 3 tokens to win!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicTacToe;
