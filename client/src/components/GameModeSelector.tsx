import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameMode, Player, Difficulty } from '../lib/gameLogic';
import { useAudio } from '@/lib/stores/useAudio';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, difficulty?: Difficulty) => void;
  gameMode: GameMode;
  difficulty?: Difficulty;
  humanPlayer?: Player;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ 
  onModeSelect, 
  gameMode,
  difficulty = 'medium',
  humanPlayer 
}) => {
  const { playClick } = useAudio();

  const handleModeSelect = (mode: GameMode, newDifficulty?: Difficulty) => {
    playClick();
    onModeSelect(mode, newDifficulty);
  };

  const handleDifficultySelect = (newDifficulty: Difficulty) => {
    playClick();
    onModeSelect('solo', newDifficulty);
  };
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Game Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleModeSelect('pvp')}
            variant={gameMode === 'pvp' ? 'default' : 'outline'}
            className={`flex items-center justify-start h-auto py-4 px-4 space-x-3 transition-all ${
              gameMode === 'pvp' 
                ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <div className="text-2xl">👥</div>
            <div className="text-left">
              <div className="font-semibold">Two Players</div>
              <div className={`text-xs ${
                gameMode === 'pvp' 
                  ? 'text-primary-foreground/80' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Play with a friend locally
              </div>
            </div>
            {gameMode === 'pvp' && (
              <div className="ml-auto text-primary-foreground">✓</div>
            )}
          </Button>
          
          <Button
            onClick={() => handleModeSelect('solo', difficulty)}
            variant={gameMode === 'solo' ? 'default' : 'outline'}
            className={`flex items-center justify-start h-auto py-4 px-4 space-x-3 transition-all ${
              gameMode === 'solo' 
                ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <div className="text-2xl">🤖</div>
            <div className="text-left">
              <div className="font-semibold">Solo vs Bot</div>
              <div className={`text-xs ${
                gameMode === 'solo' 
                  ? 'text-primary-foreground/80' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Challenge the computer
              </div>
            </div>
            {gameMode === 'solo' && (
              <div className="ml-auto text-primary-foreground">✓</div>
            )}
          </Button>
        </div>

        {gameMode === 'solo' && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Bot Difficulty</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleDifficultySelect('easy')}
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                size="sm"
                className={`transition-all ${
                  difficulty === 'easy' 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
                    : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                <div className="text-xs font-medium">Easy</div>
              </Button>
              
              <Button
                onClick={() => handleDifficultySelect('medium')}
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                size="sm"
                className={`transition-all ${
                  difficulty === 'medium' 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg' 
                    : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
              >
                <div className="text-xs font-medium">Medium</div>
              </Button>
              
              <Button
                onClick={() => handleDifficultySelect('hard')}
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                size="sm"
                className={`transition-all ${
                  difficulty === 'hard' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <div className="text-xs font-medium">Hard</div>
              </Button>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {difficulty === 'easy' && 'Bot plays randomly and rarely takes winning moves or blocks you'}
              {difficulty === 'medium' && 'Bot uses good strategy but sometimes makes mistakes'}
              {difficulty === 'hard' && 'Bot uses perfect strategy and deep analysis'}
            </div>
          </div>
        )}
        
        {gameMode === 'solo' && humanPlayer && (
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="text-sm font-medium mb-1">You are assigned:</div>
            <Badge variant={humanPlayer === 'red' ? 'destructive' : 'default'}>
              {humanPlayer.charAt(0).toUpperCase() + humanPlayer.slice(1)} Player
            </Badge>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Playing against {humanPlayer === 'red' ? 'Blue' : 'Red'} Bot ({difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)})
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameModeSelector;