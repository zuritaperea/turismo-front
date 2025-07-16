import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ show, onHide, children, className = '', classNameOverlay = '', modalClassName = '' }) => {
  if (!show) return null;

  // Clases por defecto del modal - tamaño más moderado
  const defaultModalClasses = "p-6 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-4xl";
  
  return ReactDOM.createPortal(
    <>
      <div
        className={`fixed inset-0 w-screen h-screen bg-black bg-opacity-60 z-50 ${classNameOverlay}`}
        style={{ zIndex: 401 }}
        onClick={onHide}
      />
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${className}`}
        style={{ zIndex: 401 }}
      >
        <div
          className={modalClassName || defaultModalClasses}
          style={{ 
            backgroundColor: 'rgba(46, 45, 44, 0.98)', 
            maxHeight: '90vh',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

Modal.Header = ({ children, onHide }) => (
  <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
    <h2 className="text-xl font-semibold text-gray-200">{children}</h2>
    <button
      className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
      onClick={onHide}
    >
      <span className="font-bold text-2xl leading-none">&times;</span>
    </button>
  </div>
);

Modal.Body = ({ children, className = '' }) => (
  <div className={`overflow-auto ${className}`} style={{ maxHeight: 'calc(90vh - 140px)' }}>
    {children}
  </div>
);

Modal.Footer = ({ children }) => (
  <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-600">{children}</div>
);

export default Modal;
