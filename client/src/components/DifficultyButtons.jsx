import React from 'react';
import './DifficultyButtons.css';

function DifficultyButtons({ setDifficulty, difficulty }) {
  return (
    <div className='difficulty-buttons-row'>
      <button
        className={`difficulty-button ${difficulty === 'Normal' ? 'active' : ''}`}
        onClick={() => setDifficulty('Normal')}
      >
        Normal
      </button>
      <button
        className={`difficulty-button ${difficulty === 'Hard' ? 'active' : ''}`}
        onClick={() => setDifficulty('Hard')}
      >
        Hard
      </button>
      <button
        className={`difficulty-button ${difficulty === 'Super_Hard' ? 'active' : ''}`}
        onClick={() => setDifficulty('Super_Hard')}
      >
        Super Hard
      </button>
    </div>
  );
}

export default DifficultyButtons;
