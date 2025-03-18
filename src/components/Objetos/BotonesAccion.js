import React from 'react';

const BotonesAccion = () => (
  <div className="hidden sm:flex justify-center md:justify-end items-center gap-2 mt-4 md:mt-0">
    {/* <button className="bg-white shadow-sm px-6 py-2 font-semibold rounded-lg flex items-center">
      <i className="fa-regular fa-star mr-2" style={{ color: "#F08400" }}></i>
      <span style={{ color: "#F08400" }}>Calificar</span>
</button> */}
<button
  className="bg-white shadow-sm px-6 py-2 font-semibold rounded-lg flex items-center"
  onClick={() => {
    if (navigator.share) {
      navigator.share({
        title: "Mirá esto",
        text: "Te comparto este enlace",
        url: window.location.href
      }).catch(console.error);
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  }}
>
  <i className="fa-solid fa-arrow-up-right-from-square mr-2" style={{ color: "#F08400" }}></i>
  <span style={{ color: "#F08400" }}>Compartir</span>
</button>

  </div>
);

export default BotonesAccion;
