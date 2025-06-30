import React from 'react';
import TicTacToe from './components/TicTacToe';
import { ThemeToggle } from './components/ThemeToggle';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <TicTacToe />
    </div>
  );
}

export default App;
