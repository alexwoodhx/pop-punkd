import { createSlice } from '@reduxjs/toolkit';
import bandsData from '../../../data/pop_punk_bands.json';

// Hint types in order of reveal
const HINT_TYPES = [
  'firstLetter',
  'yearFormed',
  'album',
  'song',
  'lyric',
  'image'
];

const initialState = {
  bands: [],
  currentBand: null,
  guesses: [],
  gameStatus: 'playing', // 'playing', 'won', 'lost'
  revealedHints: 0,
  message: '',
  showInstructions: true,
  loading: true,
  error: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBands: (state, action) => {
      state.bands = action.payload;
      state.loading = false;
    },
    setCurrentBand: (state, action) => {
      state.currentBand = action.payload;
    },
    addGuess: (state, action) => {
      const guess = action.payload;
      state.guesses.push(guess);
      
      // Check if the guess is correct
      if (guess.toLowerCase() === state.currentBand.band.toLowerCase()) {
        state.gameStatus = 'won';
        state.message = `Correct! You guessed ${state.currentBand.band}!`;
      } else {
        // Reveal next hint if available
        if (state.revealedHints < HINT_TYPES.length) {
          state.revealedHints += 1;
        }
        
        // Check if player has used all guesses
        if (state.guesses.length >= 6) {
          state.gameStatus = 'lost';
          state.message = `Game over! The band was ${state.currentBand.band}.`;
        } else {
          state.message = `Wrong guess. Try again! (${6 - state.guesses.length} guesses left)`;
        }
      }
    },
    resetGame: (state) => {
      // Pick a new random band
      const randomIndex = Math.floor(Math.random() * state.bands.length);
      state.currentBand = state.bands[randomIndex];
      state.guesses = [];
      state.gameStatus = 'playing';
      state.revealedHints = 0;
      state.message = '';
    },
    toggleInstructions: (state) => {
      state.showInstructions = !state.showInstructions;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

// Action creators
export const { 
  setBands, 
  setCurrentBand, 
  addGuess, 
  resetGame, 
  toggleInstructions,
  setError
} = gameSlice.actions;

// Thunks
export const initializeGame = () => (dispatch) => {
  try {
    // Load bands data
    dispatch(setBands(bandsData));
    
    // Pick a random band to start
    const randomIndex = Math.floor(Math.random() * bandsData.length);
    dispatch(setCurrentBand(bandsData[randomIndex]));
  } catch (error) {
    dispatch(setError('Failed to initialize game: ' + error.message));
  }
};

// Selectors
export const selectCurrentBand = (state) => state.game.currentBand;
export const selectGuesses = (state) => state.game.guesses;
export const selectGameStatus = (state) => state.game.gameStatus;
export const selectRevealedHints = (state) => state.game.revealedHints;
export const selectMessage = (state) => state.game.message;
export const selectShowInstructions = (state) => state.game.showInstructions;
export const selectLoading = (state) => state.game.loading;
export const selectError = (state) => state.game.error;

// Helper selector to get the currently revealed hints
export const selectAvailableHints = (state) => {
  const { currentBand, revealedHints } = state.game;
  if (!currentBand) return {};
  
  const hints = {};
  
  for (let i = 0; i < revealedHints; i++) {
    const hintType = HINT_TYPES[i];
    switch (hintType) {
      case 'firstLetter':
        hints.firstLetter = currentBand.band.charAt(0);
        break;
      case 'yearFormed':
        hints.yearFormed = currentBand.year_formed;
        break;
      case 'album':
        hints.album = currentBand.hints.albums && currentBand.hints.albums.length > 0 
          ? currentBand.hints.albums[Math.floor(Math.random() * currentBand.hints.albums.length)]
          : 'Unknown album';
        break;
      case 'song':
        hints.song = currentBand.hints.popular_songs && currentBand.hints.popular_songs.length > 0
          ? currentBand.hints.popular_songs[Math.floor(Math.random() * currentBand.hints.popular_songs.length)]
          : 'Unknown song';
        break;
      case 'lyric':
        hints.lyric = currentBand.hints.lyric_hint || 'No lyrics available';
        break;
      case 'image':
        hints.image = currentBand.hints.image_url || '';
        break;
      default:
        break;
    }
  }
  
  return hints;
};

export default gameSlice.reducer; 