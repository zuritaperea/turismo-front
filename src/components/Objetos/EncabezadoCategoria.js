import React from "react";


export default function EncabezadoCategoria({ target, title }) {

  let epigrafe = "";
  let subtitulo = "";

  if (target === 'Agencia') {
    epigrafe = "epigrafeAgencia";
  } else if (target === 'Alojamiento') {
    epigrafe = "Dónde dormir";
    subtitulo = "Conocé donde hospedarte";

  } else if (target === 'Atractivo') {
    epigrafe = "epigrafeAtractivos";
  } else if (target === 'Beneficio') {
    epigrafe = "epigrafeBeneficios";
  } else if (target === 'Comercio') {
    epigrafe = "epigrafeComercios";
  } else if (target === 'Evento') {
    epigrafe = "epigrafeEventos";
  } else if (target === 'Experiencia') {
    epigrafe = "epigrafeExperiencias";
  } else if (target === 'Gastronomia') {
    epigrafe = "epigrafeGastronomia";
  } else if (target === 'Ruta') {
    epigrafe = "epigrafeRuta";
  }

  return (
    <div className="">
          <h2 class="text-sm font-semibold mt-2 color-principal">
{epigrafe}</h2>
<h1 class="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
              {title}</h1>
              <p class="mt-2 texto-tarjeta">
{subtitulo}</p>
    </div>
  );
}
