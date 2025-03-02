import React from 'react';

const HintsDisplay = ({ hints }) => {
  const { firstLetter, yearFormed, album, song, lyric, image } = hints;

  return (
    <div className="space-y-4 h-full">
      {firstLetter && (
        <div className="hint-card group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">First Letter</h3>
          <p className="text-4xl font-marker text-punk-shadow transform transition-all duration-300 group-hover:scale-110 group-hover:translate-x-2">{firstLetter}</p>
        </div>
      )}
      
      {yearFormed && (
        <div className="hint-card group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">Year Formed</h3>
          <p className="text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:translate-x-2">{yearFormed}</p>
        </div>
      )}
      
      {album && (
        <div className="hint-card group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">Album</h3>
          <p className="text-xl italic transform transition-all duration-300 group-hover:scale-105 group-hover:translate-x-2 tape">"{album}"</p>
        </div>
      )}
      
      {song && (
        <div className="hint-card group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">Popular Song</h3>
          <p className="text-xl italic transform transition-all duration-300 group-hover:scale-105 group-hover:translate-x-2 tape">"{song}"</p>
        </div>
      )}
      
      {lyric && (
        <div className="hint-card group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">Lyric Hint</h3>
          <div className="bg-gray-900 p-3 rounded-lg border-l-2 border-punk-red">
            <p className="text-lg italic transform transition-all duration-300 group-hover:scale-105">"{lyric}"</p>
          </div>
        </div>
      )}
      
      {image && (
        <div className="hint-card overflow-hidden group">
          <h3 className="text-lg font-bold mb-2 text-punk-yellow">Band Image</h3>
          <div className="relative">
            <img 
              src={image} 
              alt="Band" 
              className="w-full h-48 object-cover rounded transition-all duration-500 transform group-hover:scale-110"
              style={{ 
                filter: 'blur(10px)',
              }} 
            />
            <div className="absolute inset-0 bg-punk-black bg-opacity-30 flex items-center justify-center">
              <span className="text-white text-lg font-marker">Blurred for a challenge!</span>
            </div>
          </div>
        </div>
      )}
      
      {Object.keys(hints).length === 0 && (
        <div className="bg-gray-800 p-6 rounded-lg text-center min-h-[200px] flex flex-col justify-center transition-all duration-300 stitched">
          <p className="text-2xl text-punk-yellow font-marker mb-3 text-punk-shadow animate-pulse">Make your first guess!</p>
          <p className="text-gray-400">Hints will be revealed after each incorrect guess</p>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 bg-punk-red rounded-full animate-pulse flex items-center justify-center">
              <span className="text-white font-bold">?</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HintsDisplay; 