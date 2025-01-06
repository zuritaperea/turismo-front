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
  console.log('openingHoursText: ', openingHoursText);
  
  if (!openingHoursText) {
    return []; // Si el texto de horarios es nulo o vacío, devolver un array vacío
  }

  try {
    // Dividir la cadena de texto por comas y procesar cada grupo de días
    const days = openingHoursText.split(', ').map(item => {
      const parts = item.split(' ');

      // Si no hay horas en esta parte (es decir, son solo los días de la semana)
      if (parts.length === 1) {
        // Estos días están abiertos todo el día
        const day = DAYS_OF_WEEK[parts[0]] || parts[0];
        return { day, times: 'Todo el día' };
      }

      // Si hay días y horas (rango de tiempo)
      const [dayShorts, times] = parts;
      const daysList = dayShorts.split(','); // Dividimos los días si están separados por comas
      const formattedTimes = times.split(',').map(time => {
        const [start, end] = time.split('-');
        return `${start} - ${end}`;
      }).join(', ');

      // Formateamos los días con el nombre en español
      const formattedDays = daysList.map(day => DAYS_OF_WEEK[day.trim()] || day.trim());

      // Devolvemos los días con sus horarios
      return formattedDays.map(day => ({ day, times: formattedTimes }));
    }).flat(); // Aplanamos el array, ya que puede haber días repetidos con diferentes horarios

    return days;
  } catch (error) {
    console.error('Error al procesar los horarios: ', error);
    return [];
  }
};

const OpeningHours = ({ openingHoursText }) => {
  // Si no hay horarios, mostrar un mensaje adecuado
  if (!openingHoursText) {
    return null;
  }

  const formattedOpeningHours = formatOpeningHours(openingHoursText);

  return (
    <div>
      <ul className='descripcion list-disc ml-10'>
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
