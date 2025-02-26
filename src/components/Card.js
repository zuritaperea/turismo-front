import React from 'react';
import Estrellas from './Items/Estrellas';
import TagsList from './TagsList';

function Card({ imgSrc, category, title, description, tags, puntuacion }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl card-basica h-[450px] flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Imagen fija */}
      <div className="h-[200px]">
        <img src={imgSrc} alt={title} className="rounded-t-xl w-full h-full object-cover" />
      </div>

      {/* Contenido con altura fija */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-sm font-semibold color-principal">{category}</h2>
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Descripción con límite de 3 líneas */}
        <p className="mt-2 texto-tarjeta flex-grow overflow-hidden text-ellipsis line-clamp-3">
          {description}
        </p>

        {/* Estrellas y Tags en un contenedor de altura fija */}
        <div className="mt-auto">
          <Estrellas puntuacion={puntuacion} size={'sm'} />
          <div className="max-h-[60px] overflow-hidden">
            <TagsList tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
}



export default Card;
