import React from 'react';
import { Link } from 'react-router-dom';

function SeccionesSlider({ secciones, onSectionClick, selectedSection }) {
  return (
    <div className="w-full overflow-x-auto md:overflow-hidden flex justify-start md:justify-center space-x-4 mt-6 pb-4 px-4 md:px-0">
      <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-4">
        {secciones.map((seccion, index) => {
          const isSelected = selectedSection === seccion.titulo;
          return (
            <div
              key={index}
              className="flex-none md:flex-grow text-center w-[100px] md:w-[150px] lg:w-[180px]"
            >
              <div className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center transition-transform transform hover:scale-105 max-w-20 w-40">
                {seccion.link ? (
                  <Link to={seccion.link} className="flex flex-col items-center">
                    <div className="text-2xl" style={{ color: isSelected ? "#f08400" : "#667085" }}>
                      {seccion.icono}
                    </div>
                    <p
                      className="min-w-0 mt-2 text-sm lg:text-md font-medium truncate"
                      style={{ color: isSelected ? "#f08400" : "#344054", textOverflow: "ellipsis" }}
                    >
                      {seccion.titulo}
                    </p>
                  </Link>
                ) : (
                  <div
                    onClick={() => onSectionClick(seccion.titulo)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="text-2xl" style={{ color: isSelected ? "#f08400" : "#667085", textOverflow: "ellipsis" }}>
                      {seccion.icono}
                    </div>
                    <p
                      className="min-w-0 mt-2 text-sm lg:text-md font-medium truncate"
                      style={{ color: isSelected ? "#f08400" : "#344054" }}
                    >
                      {seccion.titulo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SeccionesSlider;
