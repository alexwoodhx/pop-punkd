import React from 'react';

const GuessInput = ({ guess, setGuess, onSubmit, disabled }) => {
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto transition-all duration-300 relative z-10">
      <div className="flex">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter band name..."
          className="input flex-grow transition-all duration-300 focus:ring-punk-yellow focus:ring-2 border-2 border-gray-700 focus:border-punk-yellow"
          disabled={disabled}
          autoFocus
        />
        <button
          type="submit"
          className="btn ml-2 transition-all duration-300 transform hover:scale-105 active:scale-95 font-marker"
          disabled={!guess.trim() || disabled}
        >
          Guess!
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2 transition-opacity duration-300 italic">
        {disabled ? 'Game over! Start a new game to play again.' : 'Enter your best guess and hit submit!'}
      </p>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-punk-yellow opacity-20 rounded-full"></div>
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-punk-red opacity-20 rounded-full"></div>
    </form>
  );
};

export default GuessInput; 