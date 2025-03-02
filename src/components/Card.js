import React from 'react';
import Estrellas from './Items/Estrellas';
import TagsList from './TagsList'; 

function Card({ imgSrc, category, title, description, tags, puntuacion }) {
  const visibleTags = tags?.slice(0, 2) || [];
  const hasMoreTags = tags?.length > 2;
  const extraTags = hasMoreTags ? ['Más'] : []; 

  return (
    <div className="bg-white border border-gray-200 rounded-xl card-basica flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 h-full min-h-[450px]">
      <div className="w-full h-[200px] rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full h-[200px] min-h-[198px] object-cover"
          style={{minHeight: '198px'}}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-sm font-semibold my-2" style={{ color: "#F08400" }}>
          {category}
        </h2>

        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 texto-tarjeta flex-grow overflow-hidden text-ellipsis line-clamp-3">
          {description}
        </p>

        <div className="mt-auto">
          <Estrellas puntuacion={puntuacion} size={'sm'} />
          <TagsList tags={[...visibleTags, ...extraTags]} />
        </div>
      </div>
    </div>
  );
}

export default Card;
