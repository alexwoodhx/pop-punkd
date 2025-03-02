import React from 'react';

const GuessList = ({ guesses }) => {
  if (guesses.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-gray-400 text-center min-h-[200px] flex flex-col justify-center transition-all duration-300 stitched">
        <p className="text-2xl text-punk-yellow font-marker mb-3 text-punk-shadow animate-pulse">No guesses yet</p>
        <p className="text-gray-400">Your guesses will appear here</p>
        <div className="mt-4 flex justify-center">
          <div className="w-8 h-8 bg-punk-red rounded-full animate-pulse flex items-center justify-center">
            <span className="text-white font-bold">!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[200px] transition-all duration-300">
      <ul className="space-y-3">
        {guesses.map((guess, index) => (
          <li 
            key={index} 
            className="bg-gray-800 p-4 rounded-lg flex items-center shadow-punk transition-all duration-300 hover:bg-gray-700 transform hover:-translate-y-1 border-l-2 border-punk-red"
          >
            <div className="bg-punk-red text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold transition-all duration-300 transform hover:rotate-12">
              {index + 1}
            </div>
            <span className="text-lg font-medium relative group">
              {guess}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-punk-yellow transition-all duration-300 group-hover:w-full"></span>
            </span>
          </li>
        ))}
      </ul>
      
      {/* Decorative element */}
      <div className="mt-6 flex justify-end">
        <div className="w-16 h-1 bg-punk-red rounded"></div>
      </div>
    </div>
  );
};

export default GuessList; 