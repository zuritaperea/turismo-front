import React from 'react';

// Modal Component using Tailwind CSS
const Modal = ({ show, onHide, children, className = '', classNameOverlay = '' }) => {
  if (!show) return null; // No renderizar si `show` es false

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 ${classNameOverlay}`}
        style={{ zIndex: 401 }}
        onClick={onHide}
      />

      {/* Modal */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${className}`}
        style={{ zIndex: 401 }}
      >
        <div
          className="p-6 rounded-lg shadow-lg min-w-96 max-w-4xl"
          style={{ backgroundColor: 'rgba(46, 45, 44, 0.95)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
};

// Modal.Header
Modal.Header = ({ children, onHide }) => (
  <div className="flex justify-between items-center border-b pb-4">
    <h2 className="text-xl font-semibold">{children}</h2>
    <button
      className="text-gray-500 hover:text-gray-700"
      onClick={onHide}
    >
      <span className="font-bold text-xl">&times;</span>
    </button>
  </div>
);

// Modal.Body
Modal.Body = ({ children }) => <div className="mt-4">{children}</div>;

// Modal.Footer
Modal.Footer = ({ children }) => <div className="flex justify-end space-x-4 mt-6">{children}</div>;

export default Modal;
