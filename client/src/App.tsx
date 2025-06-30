import React from 'react';
import TicTacToe from './components/TicTacToe';
import { ThemeToggle } from './components/ThemeToggle';
import AudioInitializer from './components/AudioInitializer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative">
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <AudioInitializer />
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center pt-8 pb-16">
          <TicTacToe />
        </div>
      </div>
    </div>
  );
}

export default App;
