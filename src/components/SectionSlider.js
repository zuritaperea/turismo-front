import React from 'react';
import { Link } from 'react-router-dom'; 

function SeccionesSlider({ secciones }) {
  return (
    <div className="slider-horizontal flex items-center md:justify-center space-x-4 mt-6 overflow-x-auto pb-4">
      {secciones.map((seccion, index) => (
        <div key={index} className="flex-none text-center">
          <div className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center">
            <Link to={seccion.link} className="flex flex-col items-center">
              <div className="text-blue-500">{seccion.icono}</div> 
              <p className="mt-2 text-sm lg:text-md font-medium">{seccion.titulo}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SeccionesSlider;
