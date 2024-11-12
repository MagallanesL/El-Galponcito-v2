// ToggleButton.js
import React from 'react';
import './toggleButton.css'

const ToggleButton = ({ onClick, text }) => {
  return (
    <button className='toggle-button ' onClick={onClick}>
      {text}
    </button>
  );
};

export default ToggleButton;
