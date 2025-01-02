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
  const formattedOpeningHours = formatOpeningHours(openingHoursText);

  return (
    <div>
      <ul className="descripcion list-disc ml-10">
        {formattedOpeningHours.map((item, index) => (
          <li key={index}>
            <strong>{item.day}:</strong> {item.times}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpeningHours;
