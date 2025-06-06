// Spinner.js
import React from 'react';

const Spinner = ({ size = '4', color = 'blue', className ='' }) => {
  return (
    <div
      className={`animate-spin border-t-2 border-${color}-500 rounded-full w-${size} h-${size} ${className}`}
    ></div>
  );
};

export default Spinner;
