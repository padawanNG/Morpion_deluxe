import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameState, Player, getCurrentTokenToMove } from '../lib/gameLogic';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  gameState: GameState;
  winner: Player | null;
  selectedPosition: { row: number; col: number } | null;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameState,
  winner,
  selectedPosition
}) => {
  const currentTokenToMove = getCurrentTokenToMove(gameState.round);
  
  const getPlayerColor = (player: Player) => {
    return player === 'red' ? 'text-red-600' : 'text-blue-600';
  };

  const getPlayerBadgeVariant = (player: Player) => {
    return player === 'red' ? 'destructive' : 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Winner Display */}
        {winner && (
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="text-2xl font-bold mb-2">🎉 Game Over! 🎉</div>
            <div className={cn("text-xl font-semibold", getPlayerColor(winner))}>
              {winner.charAt(0).toUpperCase() + winner.slice(1)} Player Wins!
            </div>
          </div>
        )}

        {/* Current Turn */}
        {!winner && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Turn:</span>
              <Badge variant={getPlayerBadgeVariant(gameState.currentPlayer)}>
                {gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1)}
              </Badge>
            </div>
          </div>
        )}

        {/* Round Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Round:</span>
            <span className="font-semibold">{gameState.round}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Game Phase:</span>
            <Badge variant="outline">
              {gameState.phase === 'placement' ? 'Placement' : 'Movement'}
            </Badge>
          </div>
        </div>

        {/* Phase-specific Information */}
        {!winner && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {gameState.phase === 'placement' ? (
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Place Token</div>
                <div className={cn("text-2xl font-bold", getPlayerColor(gameState.currentPlayer))}>
                  #{currentTokenToMove}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Click any empty cell
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Move Token</div>
                <div className={cn("text-2xl font-bold", getPlayerColor(gameState.currentPlayer))}>
                  #{currentTokenToMove}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedPosition 
                    ? "Select destination" 
                    : `Click your token #${currentTokenToMove}`
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* Movement Instructions */}
        {gameState.phase === 'movement' && !winner && (
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/50 p-2 rounded">
            <div className="font-medium mb-1">Movement Rules:</div>
            <div>• Tokens can move to any empty cell</div>
            <div>• You must move the highlighted token number</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameStatus;
