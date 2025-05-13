// Splash.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Splash() {
  return (
    <div className="splash">
      <div className="splash-container flex flex-col items-center justify-center h-screen">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-gray-500" />
      </div>
    </div>
  );
}

export default Splash;
