import React from 'react';
import { Link } from 'react-router-dom'; 
function SeccionesSlider  ({ secciones })  {
  return (
    <div className="slider-horizontal flex items-center md:justify-center space-x-4 mt-6 overflow-x-auto pb-4">
      {secciones.map((seccion, index) => (
        <div key={index} className="flex-none categoria text-center">
          <div className="bg-white p-1 rounded-lg shadow-sm">
          <Link to={seccion.link}>
            <img src={seccion.imagen} alt={seccion.titulo} className="imagen-categoria" />
            <p className="mt-2 text-sm lg:text-md">{seccion.titulo}</p>
          </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeccionesSlider;
