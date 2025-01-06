import React from 'react';

// Componente reutilizable para formatear fechas
const Fecha = ({ fecha, label }) => {
  if (!fecha) return null;

  const formattedDate = new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(":", "."); // Reemplaza el ":" por un "."
  
  return (
    <div className="descripcion">
      {label}: {formattedDate} {formattedTime}
    </div>
  );
};

export default Fecha;
