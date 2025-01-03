import React from 'react';
import { Link } from 'react-router-dom';

// Componente de enlace dentro de la alerta
const AlertLink = ({ children, href }) => (
  <Link to={href} className="text-blue-600 hover:text-blue-800">
    {children}
  </Link>
);

const Alert = ({ variant = 'info', children, onClose }) => {
  // Definir las clases de estilo dependiendo del 'variant'
  const variantStyles = {
    danger: 'bg-red-100 border-l-4 border-red-500 text-red-700',
    light: 'bg-gray-100 border-l-4 border-gray-500 text-gray-700',
    success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
  };

  return (
    <div className={`p-4 mb-4 rounded-lg shadow-md ${variantStyles[variant]}`} role="alert">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-semibold">{children}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-lg text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Agregamos el componente AlertLink
Alert.Link = AlertLink;

export default Alert;
