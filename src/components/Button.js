// Button.js
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
  const buttonStyles = {
    primary: 'bg-indigo-800 text-white hover:bg-indigo-900',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md ${buttonStyles[variant]} ${sizeStyles[size]} focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
