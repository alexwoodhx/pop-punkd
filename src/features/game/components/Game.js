import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addGuess, 
  resetGame, 
  toggleInstructions,
  selectAvailableHints,
  selectGuesses,
  selectGameStatus,
  selectMessage,
  selectShowInstructions,
  selectLoading,
  selectError,
  selectCurrentBand
} from '../redux/gameSlice';
import HintsDisplay from './HintsDisplay';
import GuessInput from './GuessInput';
import GuessList from './GuessList';
import InstructionsModal from './InstructionsModal';

const Game = () => {
  const dispatch = useDispatch();
  const hints = useSelector(selectAvailableHints);
  const guesses = useSelector(selectGuesses);
  const gameStatus = useSelector(selectGameStatus);
  const message = useSelector(selectMessage);
  const showInstructions = useSelector(selectShowInstructions);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const currentBand = useSelector(selectCurrentBand);
  
  const [guess, setGuess] = useState('');

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() && gameStatus === 'playing') {
      dispatch(addGuess(guess.trim()));
      setGuess('');
    }
  };

  const handlePlayAgain = () => {
    dispatch(resetGame());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 transition-opacity duration-500">
        <div className="text-xl font-marker text-punk-yellow animate-pulse">
          <span className="inline-block animate-rock">Loading game...</span>
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 rounded-full bg-punk-red" 
                style={{ 
                  animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` 
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 p-6 rounded-lg text-white transition-all duration-500 transform animate-fadeIn border-l-4 border-punk-yellow">
        <h2 className="text-xl font-bold mb-2 text-punk-yellow">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(resetGame())}
          className="mt-4 btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Success view (replaces the modal)
  if (gameStatus === 'won') {
    return (
      <div className="max-w-4xl mx-auto transition-all duration-500 transform animate-fadeIn">
        <div className="bg-green-800 p-6 rounded-lg shadow-punk mb-8 text-center relative overflow-hidden">
          {/* Confetti corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-punk-yellow opacity-20" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }}></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-punk-yellow opacity-20" style={{ clipPath: 'polygon(100% 100%, 0% 100%, 100% 0)' }}></div>
          
          <h2 className="text-4xl font-marker mb-4 text-white text-punk-shadow animate-rock">You Won!</h2>
          <p className="text-xl mb-6">
            You correctly guessed <span className="font-bold text-punk-yellow">{currentBand.band}</span> in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
          </p>
          
          {currentBand.hints.image_url && (
            <div className="mt-6 mb-6 max-w-md mx-auto transition-all duration-500 transform hover:scale-105 tape">
              <img 
                src={currentBand.hints.image_url} 
                alt={currentBand.band} 
                className="w-full h-64 object-cover rounded shadow-punk transition-all duration-500"
              />
            </div>
          )}
          
          <div className="mt-8 bg-gray-800 p-5 rounded max-w-md mx-auto text-left transition-all duration-300 hover:shadow-lg stitched">
            <h3 className="font-bold text-punk-yellow text-xl mb-3">Band Info:</h3>
            <p className="mb-2"><span className="font-bold">Formed:</span> {currentBand.year_formed || 'Unknown'}</p>
            {currentBand.hints.albums && currentBand.hints.albums.length > 0 && (
              <p className="mb-2"><span className="font-bold">Albums include:</span> {currentBand.hints.albums.slice(0, 3).join(', ')}</p>
            )}
            {currentBand.hints.popular_songs && currentBand.hints.popular_songs.length > 0 && (
              <p className="mb-2"><span className="font-bold">Songs include:</span> {currentBand.hints.popular_songs.slice(0, 3).join(', ')}</p>
            )}
            {currentBand.hints.lyric_hint && (
              <p className="mb-2"><span className="font-bold">Lyric:</span> <span className="italic">"{currentBand.hints.lyric_hint}"</span></p>
            )}
          </div>
          
          <button 
            onClick={handlePlayAgain}
            className="mt-8 btn text-lg px-8 py-3 transition-all duration-300 transform hover:scale-105 font-marker"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Game over view (replaces the modal)
  if (gameStatus === 'lost') {
    return (
      <div className="max-w-4xl mx-auto transition-all duration-500 transform animate-fadeIn">
        <div className="bg-red-900 p-6 rounded-lg shadow-punk mb-8 text-center relative overflow-hidden">
          {/* Torn paper effect */}
          <div className="absolute top-0 left-0 w-full h-8" style={{ 
            backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #7f1d1d 33.333%, #7f1d1d 66.667%, transparent 66.667%)',
            backgroundSize: '12px 100%',
            opacity: 0.5
          }}></div>
          
          <h2 className="text-4xl font-marker mb-4 text-white text-punk-shadow animate-shake">Game Over!</h2>
          <p className="text-xl mb-6">
            The band was <span className="font-bold text-punk-yellow">{currentBand.band}</span>
          </p>
          
          {currentBand.hints.image_url && (
            <div className="mt-6 mb-6 max-w-md mx-auto transition-all duration-500 transform hover:scale-105 tape">
              <img 
                src={currentBand.hints.image_url} 
                alt={currentBand.band} 
                className="w-full h-64 object-cover rounded shadow-punk transition-all duration-500"
              />
            </div>
          )}
          
          <div className="mt-8 bg-gray-800 p-5 rounded max-w-md mx-auto text-left transition-all duration-300 hover:shadow-lg stitched">
            <h3 className="font-bold text-punk-yellow text-xl mb-3">Band Info:</h3>
            <p className="mb-2"><span className="font-bold">Formed:</span> {currentBand.year_formed || 'Unknown'}</p>
            {currentBand.hints.albums && currentBand.hints.albums.length > 0 && (
              <p className="mb-2"><span className="font-bold">Albums include:</span> {currentBand.hints.albums.slice(0, 3).join(', ')}</p>
            )}
            {currentBand.hints.popular_songs && currentBand.hints.popular_songs.length > 0 && (
              <p className="mb-2"><span className="font-bold">Songs include:</span> {currentBand.hints.popular_songs.slice(0, 3).join(', ')}</p>
            )}
            {currentBand.hints.lyric_hint && (
              <p className="mb-2"><span className="font-bold">Lyric:</span> <span className="italic">"{currentBand.hints.lyric_hint}"</span></p>
            )}
          </div>
          
          <button 
            onClick={handlePlayAgain}
            className="mt-8 btn text-lg px-8 py-3 transition-all duration-300 transform hover:scale-105 font-marker"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto transition-all duration-500">
      {/* Central guess input */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-punk text-center transition-all duration-300 hover:shadow-lg relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16" style={{ 
          backgroundImage: 'linear-gradient(135deg, transparent 50%, #ff3333 50%)'
        }}></div>
        
        <h2 className="text-3xl font-marker mb-5 text-punk-yellow text-punk-shadow">Guess the Pop-Punk Band</h2>
        <GuessInput 
          guess={guess} 
          setGuess={setGuess} 
          onSubmit={handleGuessSubmit} 
          disabled={gameStatus !== 'playing'} 
        />
        
        {/* Game message */}
        {message && (
          <div className="mt-4 text-center transition-all duration-300 animate-fadeIn">
            <p className="text-lg font-bold">{message}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hints section */}
        <div className="transition-all duration-300 h-full">
          <h2 className="text-3xl font-marker mb-4 text-punk-yellow text-punk-shadow relative inline-block">
            Hints
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-punk-yellow"></span>
          </h2>
          <HintsDisplay hints={hints} />
        </div>
        
        {/* Guesses section */}
        <div className="transition-all duration-300 h-full">
          <h2 className="text-3xl font-marker mb-4 text-punk-yellow text-punk-shadow relative inline-block">
            Your Guesses <span className="text-white">({guesses.length}/6)</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-punk-yellow"></span>
          </h2>
          <GuessList guesses={guesses} />
        </div>
      </div>
      
      {/* Instructions modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => dispatch(toggleInstructions())} />
      )}
    </div>
  );
};

export default Game; 