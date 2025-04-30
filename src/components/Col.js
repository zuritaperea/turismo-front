// Col.js
import React from 'react';

const Col = ({ children, className = '', sm = '12', md = '12', lg = '12' }) => {
  // Mapeo de clases equivalentes entre Bootstrap y Tailwind
  const widthMapping = {
    12: 'w-full', // 100% ancho
    6: 'w-1/2',   // 50% ancho
    4: 'w-1/3',   // 33.33% ancho
    3: 'w-1/4',   // 25% ancho
    2: 'w-1/6',   // 16.66% ancho
    1: 'w-1/12',  // 8.33% ancho
  };

  // Función para obtener clases basadas en el span y el offset
  const getColumnClasses = (value) => {
    if (typeof value === 'object') {
      const { span, offset } = value;
      let classes = widthMapping[span] || widthMapping[12]; // Si no se pasa span, usamos 12
      if (offset) {
        classes += ` ml-${offset * 2}`; // Offset en Tailwind se maneja con 'ml-{n}', donde n es el doble de la fracción
      }
      return classes;
    }
    return widthMapping[value] || widthMapping[12]; // Si es solo un valor numérico
  };

  return (
    <div
      className={`
       w-full
       sm:${getColumnClasses(sm)} 
       md:${getColumnClasses(md)} 
       lg:${getColumnClasses(lg)} 
       px-2 
       ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Col;
