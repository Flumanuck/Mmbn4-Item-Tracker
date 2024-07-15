import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className='row'>
        <img src='/red_sun_logo.png' alt='Red Sun Logo'/>
        <h1 className='header-title'>MMBN4 Mystery Data Tracker</h1>
        <img src='/blue_moon_logo.png' alt='Blue Moon Logo'/>
    </div>
  );
}

export default Header;
