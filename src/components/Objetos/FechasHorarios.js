import React from 'react';
import OpeningHours from '../../components/OpeningHours';
import Fecha from '../Fecha';
import { useTranslation } from 'react-i18next';

const FechasHorarios = ({ item, tipoObjeto }) => { 
  const { t } = useTranslation();
  return (
  <div id="horarios" className="mb-20">
    <div className="text-2xl text-slate-900 tracking-tight font-bold dark:text-slate-200 my-4" style={{ color: '#101828' }}>
      {tipoObjeto === 'evento' ? t('common.fechas') : t('common.horarios')}
    </div>
    <OpeningHours openingHoursText={item?.attributes?.opening_hours} />
    {item?.attributes?.checkin_time && (
      <div className="descripcion">{t('common.check_in')}: {item?.attributes?.checkin_time?.substring(0, 5)} hs</div>
    )}
    {item?.attributes?.checkout_time && (
      <div className="descripcion">{t('common.check_out')}: {item?.attributes?.checkout_time?.substring(0, 5)} hs</div>
    )}
    <Fecha fecha={item?.attributes?.start_date} label={t('common.fecha_inicio')} />
    <Fecha fecha={item?.attributes?.end_date} label={t('common.fecha_fin')}  />
  </div>
)};

export default FechasHorarios;
