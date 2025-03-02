import React, { useEffect, useRef } from 'react';

const InstructionsModal = ({ onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    // Add active class after a small delay to trigger animation
    const timer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('active');
      }
    }, 10);
    
    // Add event listener for escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Clean up
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  const handleCloseModal = () => {
    // Remove active class first to trigger exit animation
    if (modalRef.current) {
      modalRef.current.classList.remove('active');
      setTimeout(onClose, 300); // Wait for animation to complete
    }
  };
  
  return (
    <div ref={modalRef} className="modal" onClick={handleCloseModal}>
      <div className="modal-content animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {/* Decorative corner elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-punk-yellow transform rotate-45"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-punk-red transform rotate-45"></div>
        
        <h2 className="text-3xl font-marker mb-6 text-punk-yellow text-punk-shadow relative">
          How To Play
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-punk-yellow"></span>
        </h2>
        
        <div className="space-y-6 text-white">
          <p className="text-xl font-bold">Guess the pop-punk band in 6 tries or less!</p>
          
          <div className="stitched bg-gray-900 p-5">
            <h3 className="font-bold mb-3 text-punk-yellow text-xl">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li className="transform transition-all duration-300 hover:translate-x-1">Each incorrect guess reveals a new hint about the band</li>
              <li className="transform transition-all duration-300 hover:translate-x-1">You have 6 chances to guess correctly</li>
              <li className="transform transition-all duration-300 hover:translate-x-1">Band names are not case sensitive</li>
              <li className="transform transition-all duration-300 hover:translate-x-1">Hints get progressively more revealing as you play</li>
            </ul>
          </div>
          
          <div className="tape bg-gray-700 p-5 rounded-lg mt-2 transform -rotate-1">
            <p className="text-punk-yellow font-bold mb-2 text-lg">Strategy Tip:</p>
            <p className="italic">Start with your best guess based on the first hint. As more hints are revealed, use them to narrow down your options.</p>
          </div>
          
          <p className="text-center text-punk-yellow font-bold text-xl mt-4 animate-pulse">
            Can you guess the band before all hints are revealed?
          </p>
        </div>
        
        <button 
          className="mt-8 btn w-full text-lg py-3 font-marker"
          onClick={handleCloseModal}
        >
          Let's Rock!
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal; 