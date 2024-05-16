import React from 'react';

function DifficultyButtons({ setDifficulty }){
  return (
    <div>
      <button onClick={() => setDifficulty('Normal')}>Normal</button>
      <button onClick={() => setDifficulty('Hard')}>Hard</button>
      <button onClick={() => setDifficulty('Super_Hard')}>Super Hard</button>
    </div>
  );
};

export default DifficultyButtons;
