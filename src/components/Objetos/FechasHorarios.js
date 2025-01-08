import React from 'react';
import OpeningHours from '../../components/OpeningHours';
import Fecha from '../Fecha';

const FechasHorarios = ({ item, tipoObjeto }) => (
  <div id="horarios">
    <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
      {tipoObjeto === 'evento' ? 'Fechas' : 'Horarios'}
    </div>
    <OpeningHours openingHoursText={item?.attributes?.opening_hours} />
    {item?.attributes?.checkin_time && (
      <div className="descripcion">Check in: {item?.attributes?.checkin_time?.substring(0, 5)} hs</div>
    )}
    {item?.attributes?.checkout_time && (
      <div className="descripcion">Check out: {item?.attributes?.checkout_time?.substring(0, 5)} hs</div>
    )}
    <Fecha fecha={item?.attributes?.start_date} label="Fecha de inicio" />
    <Fecha fecha={item?.attributes?.end_date} label="Fecha de fin" />
  </div>
);

export default FechasHorarios;
