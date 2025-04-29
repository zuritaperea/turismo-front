import React, { useState, useEffect } from 'react';

function FiltroSubtipo({ interes, constantes, setFiltroSubtipo, filtroSubtipo }) {
    const tipoConstantesMap = {
        evento: "tipo_evento",
        atractivo: "tipo_atractivo",
        alojamiento: "tipo_alojamiento",
        circuito: "tipo_turismo",
        comercio: "tipo_comercio",
        gastronomia: "tipo_restaurante",
      };

useEffect(() => {
  if (interes) {
    setFiltroSubtipo('');
  }
}, [interes, constantes]);

    if (!interes) return null;

    const tipoClave = tipoConstantesMap[interes]; // Ej: 'tipo_restaurante'
    const opciones = constantes[tipoClave] || [];

    return (
        <div>
            <select
                id="subtipo-select"
                value={filtroSubtipo}
                onChange={(e) => setFiltroSubtipo(e.target.value)}
                className="mt-1 mx-10 block w-1/2 border rounded p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">Seleccione</option>
                {opciones.map((opcion, index) => (
                    <option key={index} value={opcion.label}>
                        {opcion.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default FiltroSubtipo;