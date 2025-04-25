import React, { useState } from "react";

const SeleccionComposicionViaje = ({ composicion_viaje }) => {
  const [composicionViajeSelected, setComposicionViajeSelected] = useState(null);
  if (!composicion_viaje) return null;

  return (
    <div className="w-full mt-6 pb-4 px-4 md:px-0">
      <div className="overflow-x-auto lg:overflow-hidden flex justify-start lg:justify-center space-x-4">
        <div className="flex flex-nowrap lg:flex-wrap lg:justify-center gap-4">
          {composicion_viaje.map((item) => {
            const isSelected = composicionViajeSelected === item.value;
            return (
              <div
                key={item.value}
                onClick={() => setComposicionViajeSelected(item.value)}
                className={`cursor-pointer flex-none lg:flex-grow text-center`}
              >
                <div
                  className={`p-4 rounded-lg shadow-md p-10 m-3 flex flex-col items-center transition-transform transform hover:scale-105 w-full ${
                    isSelected ? "bg-orange-100 border border-orange-400" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-sm lg:text-md font-medium truncate ${
                      isSelected ? "text-orange-600" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeleccionComposicionViaje;
