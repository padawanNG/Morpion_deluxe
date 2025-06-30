import React from 'react';
import Token from './Token';
import { TokenPosition } from '../lib/gameLogic';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: (TokenPosition | null)[][];
  onCellClick: (row: number, col: number) => void;
  selectedPosition: { row: number; col: number } | null;
  validMoves: { row: number; col: number }[];
  gamePhase: 'placement' | 'movement';
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  selectedPosition,
  validMoves,
  gamePhase
}) => {
  const isCellSelected = (row: number, col: number) => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };

  const isCellValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "w-24 h-24 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg",
              "flex items-center justify-center cursor-pointer",
              "hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200",
              "shadow-sm hover:shadow-md",
              {
                "border-blue-500 bg-blue-50 dark:bg-blue-900/50": isCellSelected(rowIndex, colIndex),
                "border-green-400 bg-green-50 dark:bg-green-900/50": isCellValidMove(rowIndex, colIndex),
                "hover:border-green-500": isCellValidMove(rowIndex, colIndex),
              }
            )}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell && (
              <Token
                player={cell.player}
                tokenNumber={cell.tokenNumber}
                isSelected={isCellSelected(rowIndex, colIndex)}
              />
            )}
            {isCellValidMove(rowIndex, colIndex) && !cell && (
              <div className="w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full opacity-60" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
