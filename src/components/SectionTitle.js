// SectionTitle.jsx
import React from 'react';

function SectionTitle  ({ title, subtitle, imgSrc }) {
  return (
    <div className="py-4 lg:text-center">
      <h1 className="text-3xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
        {title}
        <img className="inline ml-1" src={imgSrc} alt="Medalla" />
      </h1>
      <p className="descripcion">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
