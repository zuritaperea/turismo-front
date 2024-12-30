import React from 'react';
import Estrellas from './Items/Estrellas';
import TagsList from './TagsList'; // Importamos el nuevo componente

function Card({ imgSrc, category, title, description, tags, puntuacion }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl card-basica">

      {/* Imagen */}
      <img src={imgSrc} alt={title} className="rounded-t-xl w-full imagen-tarjeta object-cover" />
      <div className="p-4">
        {/* Categoría */}
        <h2 className="text-sm font-semibold mt-4 color-principal">{category}</h2>
        {/* Título */}
        <h2 className="text-lg font-semibold mt-1">{title}</h2>

        {/* Descripción: solo se muestra si existe */}
        {description && <p className="mt-2 texto-tarjeta">{description}</p>}

        {/* Puntuación: solo se muestra si existe */}
        <div className="estrellas">
          <Estrellas puntuacion={puntuacion} size={'sm'} />
        </div>

        {/* Etiquetas: solo se muestran si existen */}
        <TagsList tags={tags} /> 
        
      </div>
    </div>
  );
};

export default Card;
