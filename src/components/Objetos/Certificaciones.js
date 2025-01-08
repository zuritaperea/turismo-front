import React from 'react';

const Certificaciones = ({ item }) => (
  <div className="bg-white border border-gray-200 rounded-xl pl-4 pb-4 mt-4">
    <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
      Certificaciones y premios
    </div>
    <div className="descripcion">{item?.attributes?.certifications}</div>
  </div>
);

export default Certificaciones;
