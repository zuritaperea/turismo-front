import React from 'react';

const InformacionEmpresa = ({ item }) => (
  <div>
    <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
      Información de la empresa
    </div>
    <ul className="descripcion list-disc ml-10">
      <li>{item?.attributes?.legal_name}</li>
      <li>ID: {item?.attributes?.identifier_organization}</li>
    </ul>
  </div>
);

export default InformacionEmpresa;
