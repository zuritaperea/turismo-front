import React from 'react';

const RangoPrecios = ({ item }) => {
  if (!item?.attributes?.price_range) return null;

  return (
    <div className="mb-20">
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Rango de Precios
      </div>
      <div className="descripcion">{item?.attributes?.price_range}</div>
    </div>
  );
};

export default RangoPrecios;
