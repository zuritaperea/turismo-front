import React from "react";


export default function EncabezadoCategoria({ target, title }) {

  let epigrafe = "";
  let subtitulo = "";

  
switch (target) { // Usar switch es más legible para múltiples comparaciones
  case 'Agencia':
    epigrafe = "Agencias de Viajes"; // Más descriptivo
    subtitulo = "Encontrá la agencia ideal para tu viaje";
    break;
  case 'Alojamiento':
    epigrafe = "Dónde dormir";
    subtitulo = "Conocé dónde hospedarte";
    break;
  case 'Atractivo':
    epigrafe = "Qué hacer";
    subtitulo = "Actividades de todos los tipos y para todos los públicos";
    break;
  case 'Circuito':
    epigrafe = "Circuitos Turísticos"; // Más descriptivo
    subtitulo = "Descubre circuitos para explorar la región";
    break;
  case 'Comercio':
    epigrafe = "Comercios Locales"; // Más descriptivo
    subtitulo = "Explora la oferta comercial de la zona";
    break;
  case 'Evento':
    epigrafe = "Eventos"; // Más conciso
    subtitulo = "Conocé los próximos eventos";
    break;
  case 'Experiencia':
    epigrafe = "Experiencias Únicas"; // Más atractivo
    subtitulo = "Viví momentos inolvidables en tu viaje";
    break;
  case 'Gastronomia':
    epigrafe = "Gastronomía Local"; // Más descriptivo
    subtitulo = "Sabores que te encantarán";
    break;
  case 'Ruta':
    epigrafe = "Rutas Turísticas"; // Más descriptivo
    subtitulo = "Recorré caminos increíbles";
    break;
  default: // Manejo de casos no contemplados
    console.warn(`Valor de 'target' no reconocido: ${target}`);
    epigrafe = "Información"; // Valor por defecto
    subtitulo = "Detalles sobre el destino";
    break;
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
