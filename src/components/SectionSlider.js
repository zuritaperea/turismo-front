import React from 'react';
import { Link } from 'react-router-dom';

function SeccionesSlider({ secciones, onSectionClick, selectedSection, isMarketplace = false }) {
  if (isMarketplace) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <h2 className="text-center text-lg font-semibold mb-4">¿Qué te interesa reservar?</h2>
        <div className="grid grid-cols-2 gap-4">
          {secciones.map((seccion, index) => {
            const isSelected = selectedSection === seccion.titulo;
            const content = (
              <>
                <div className="text-3xl" style={{ color: isSelected ? "#f08400" : "#667085" }}>
                  {seccion.icono}
                </div>
                <p
                  className="mt-2 text-sm font-semibold text-center"
                  style={{ color: isSelected ? "#f08400" : "#344054" }}
                >
                  {seccion.titulo}
                </p>
              </>
            );

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => !seccion.link && onSectionClick(seccion)}
              >
                {seccion.link ? (
                  <Link to={seccion.link} className="flex flex-col items-center">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto lg:overflow-hidden flex justify-start lg:justify-center space-x-4 mt-6 pb-4 px-4 md:px-0">
      <div className="flex flex-nowrap lg:flex-wrap lg:justify-center gap-4">
        {secciones.map((seccion, index) => {
          const isSelected = selectedSection === seccion.titulo;
          return (
            <div
              key={index}
              className="flex-none lg:flex-grow text-center w-[100px] md:w-[150px] lg:w-[180px]"
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
                    onClick={() => onSectionClick(seccion)}
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
