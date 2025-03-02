import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentBand, selectGuesses } from '../redux/gameSlice';

const ResultModal = ({ gameStatus, onPlayAgain }) => {
  const currentBand = useSelector(selectCurrentBand);
  const guesses = useSelector(selectGuesses);
  
  if (!currentBand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-punk max-w-md w-full">
        <h2 className={`text-2xl font-marker mb-4 ${gameStatus === 'won' ? 'text-green-500' : 'text-punk-red'}`}>
          {gameStatus === 'won' ? 'You Won!' : 'Game Over!'}
        </h2>
        
        <div className="mb-6">
          <p className="text-lg mb-2">
            {gameStatus === 'won' 
              ? `You correctly guessed ${currentBand.band} in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!` 
              : `The band was ${currentBand.band}.`}
          </p>
          
          {currentBand.hints.image_url && (
            <div className="mt-4">
              <img 
                src={currentBand.hints.image_url} 
                alt={currentBand.band} 
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
          
          <div className="mt-4 bg-gray-700 p-3 rounded">
            <h3 className="font-bold text-punk-yellow">Band Info:</h3>
            <p><span className="font-bold">Formed:</span> {currentBand.year_formed || 'Unknown'}</p>
            {currentBand.hints.albums && currentBand.hints.albums.length > 0 && (
              <p><span className="font-bold">Albums include:</span> {currentBand.hints.albums.slice(0, 3).join(', ')}</p>
            )}
            {currentBand.hints.popular_songs && currentBand.hints.popular_songs.length > 0 && (
              <p><span className="font-bold">Songs include:</span> {currentBand.hints.popular_songs.slice(0, 3).join(', ')}</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={onPlayAgain}
          className="btn w-full"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ResultModal; 