import React from 'react';
import './DifficultyButtons.css';

function DifficultyButtons({ setDifficulty }){
  return (
    <div className='difficulty-buttons-row'>
      <button className = 'difficulty-button' onClick={() => setDifficulty('Normal')}>Normal</button>
      <button className = 'difficulty-button' onClick={() => setDifficulty('Hard')}>Hard</button>
      <button className = 'difficulty-button' onClick={() => setDifficulty('Super_Hard')}>Super Hard</button>
    </div>
  );
};

export default DifficultyButtons;
