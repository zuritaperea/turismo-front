// Container.js
import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-screen-lg mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
