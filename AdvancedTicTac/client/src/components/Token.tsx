import React from 'react';
import { Player } from '../lib/gameLogic';
import { cn } from '@/lib/utils';

interface TokenProps {
  player: Player;
  tokenNumber: number;
  isSelected?: boolean;
}

const Token: React.FC<TokenProps> = ({ player, tokenNumber, isSelected = false }) => {
  const getTokenColors = (player: Player) => {
    if (player === 'red') {
      return {
        bg: 'bg-red-500',
        border: 'border-red-600',
        text: 'text-white',
        shadow: 'shadow-red-200'
      };
    } else {
      return {
        bg: 'bg-blue-500',
        border: 'border-blue-600',
        text: 'text-white',
        shadow: 'shadow-blue-200'
      };
    }
  };

  const colors = getTokenColors(player);

  return (
    <div
      className={cn(
        "w-16 h-16 rounded-full border-2 flex items-center justify-center",
        "font-bold text-lg transition-all duration-200 transform",
        colors.bg,
        colors.border,
        colors.text,
        "shadow-lg",
        colors.shadow,
        {
          "scale-110 ring-4 ring-yellow-400 ring-opacity-60": isSelected,
          "hover:scale-105": !isSelected,
        }
      )}
    >
      {tokenNumber}
    </div>
  );
};

export default Token;
