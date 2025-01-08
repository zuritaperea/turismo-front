import React from 'react';

const BotonesAccion = () => (
  <div className="botones float-right hidden sm:block">
    <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2">
      <i className="fa-regular fa-star"></i> Calificar
    </button>
    <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg">
      <i className="fa-solid fa-arrow-up-right-from-square"></i> Compartir
    </button>
  </div>
);

export default BotonesAccion;
