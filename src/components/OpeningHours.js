import React from 'react';

// Traducir los días de la semana a su formato en español
const DAYS_OF_WEEK = {
  Mo: 'Lunes',
  Tu: 'Martes',
  We: 'Miércoles',
  Th: 'Jueves',
  Fr: 'Viernes',
  Sa: 'Sábado',
  Su: 'Domingo'
};

// Función para convertir el string de horarios a un formato legible
const formatOpeningHours = (openingHoursText) => {
  if (!openingHoursText) {
    return []; // Si el texto de horarios es nulo o vacío, devolver un array vacío
  }

  const days = openingHoursText.split(', ').map(item => {
    const [dayShort, times] = item.split(' ');
    const day = DAYS_OF_WEEK[dayShort] || dayShort;
    
    let timesFormatted = times;
    if (times.includes(',')) {
      // Si hay múltiples rangos de tiempo en el día
      timesFormatted = times.split(',').map(time => {
        const [start, end] = time.split('-');
        return `${start} - ${end}`;
      }).join(', ');
    } else {
      // Si es solo un único rango de tiempo
      const [start, end] = times.split('-');
      timesFormatted = `${start} - ${end}`;
    }
    
    return { day, times: timesFormatted };
  });

  return days;
};

const OpeningHours = ({ openingHoursText }) => {
  // Si no hay horarios, mostrar un mensaje adecuado
  if (!openingHoursText) {
    return <p>No hay horarios disponibles.</p>;
  }

  const formattedOpeningHours = formatOpeningHours(openingHoursText);

  return (
    <div>
      <h3>Horarios de Apertura:</h3>
      <ul>
        {formattedOpeningHours.length === 0 ? (
          <li>No hay horarios disponibles.</li>
        ) : (
          formattedOpeningHours.map((item, index) => (
            <li key={index}>
              <strong>{item.day}:</strong> {item.times}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default OpeningHours;
