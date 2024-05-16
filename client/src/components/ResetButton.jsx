import React from 'react';
import './ResetButton.css';

function ResetButton({ handleResetItems }){
  return (
    <button className="reset-button" onClick={handleResetItems}>Reset All</button>
  );
};

export default ResetButton;
