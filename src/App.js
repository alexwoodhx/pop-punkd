import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeGame, toggleInstructions } from './features/game/redux/gameSlice';
import Game from './features/game/components/Game';

// Logo component for reusability
const Logo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-all duration-300 hover:rotate-6">
    <circle cx="25" cy="25" r="24" fill="#121212" stroke="#FFCC00" strokeWidth="2"/>
    <path d="M15 20L20 15H30L35 20V30L30 35H20L15 30V20Z" fill="#FF3333"/>
    <path d="M22 25H28M25 22V28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize the game when the app loads
    dispatch(initializeGame());
  }, [dispatch]);

  const handleToggleInstructions = () => {
    dispatch(toggleInstructions());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-punk-black to-gray-900">
      {/* Texture overlay */}
      <div className="texture-overlay"></div>
      
      <header className="bg-punk-red py-6 shadow-lg relative">
        {/* Angled bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-punk-red" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-4 bg-punk-red" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="flex items-center mb-4 md:mb-0 group">
              <div className="mr-3 md:mr-4 transform transition-all duration-300 group-hover:rotate-12">
                <Logo size={40} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-marker text-white text-center md:text-left drop-shadow-md text-punk-shadow transform transition-all duration-300 group-hover:scale-105">
                  Pop Punk'd
                </h1>
                <p className="text-center md:text-left text-white mt-1 transition-all duration-300 group-hover:translate-x-2">
                  Guess the pop-punk band in 6 tries or less!
                </p>
              </div>
            </div>
            <button 
              onClick={handleToggleInstructions}
              className="bg-punk-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors border-2 border-white transform hover:-translate-y-1 hover:rotate-1 active:translate-y-0 transition-all duration-300"
            >
              How To Play
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Game />
      </main>
      
      <footer className="bg-gray-900 py-4 border-t border-gray-800 relative">
        {/* Angled top edge */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gray-900" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
        
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Created with <span className="text-punk-red animate-pulse inline-block">❤️</span> for pop-punk fans</p>
          <p className="text-sm mt-1">Data sourced from Wikipedia</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 