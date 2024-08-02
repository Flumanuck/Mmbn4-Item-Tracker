import React from 'react';
import './ResetButton.css';

function LogoutButton({ handleLogout }){
  return (
    <button className="button" onClick={handleLogout}>Log Out</button>
  );
};

export default LogoutButton;
