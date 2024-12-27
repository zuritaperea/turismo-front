// Row.js
import React from 'react';

const Row = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap -mx-2 w-full ${className}`}>
      {children}
    </div>
  );
};

export default Row;
