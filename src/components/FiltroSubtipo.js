import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function FiltroSubtipo({ interes, constantes, setFiltroSubtipo, filtroSubtipo }) {
    const tipoConstantesMap = {
        evento: "tipo_evento",
        atractivo: "tipo_atractivo",
        alojamiento: "tipo_alojamiento",
        circuito: "tipo_turismo",
        comercio: "tipo_comercio",
        gastronomia: "tipo_restaurante",
    };
    const { t } = useTranslation();
    useEffect(() => {
        if (interes) {
            setFiltroSubtipo('');
        }
    }, [interes, constantes]);

    if (!interes) return null;

    const tipoClave = tipoConstantesMap[interes];
    const opciones = constantes[tipoClave] || [];

    return (
        <div className="w-full flex justify-center px-4 mt-4">
            <select
                id="subtipo-select"
                value={filtroSubtipo}
                onChange={(e) => setFiltroSubtipo(e.target.value)}
                className="w-[90%] sm:w-[220px] md:w-[280px] lg:w-[340px] border rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">{t('common.seleccione')}</option>
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
