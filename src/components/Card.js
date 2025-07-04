import React from 'react';
import TagsList from './TagsList';
import { useTranslation } from 'react-i18next';

function Card({ imgSrc, category, title, description, tags, puntuacion, location, startDate }) {
  const visibleTags = tags?.slice(0, 2) || [];
  const hasMoreTags = tags?.length > 2;
  const extraTags = hasMoreTags ? ['Más'] : [];
  const { t } = useTranslation();
  const dateObject = startDate ? new Date(startDate) : null;
  const formattedDate = dateObject
    ? `${dateObject.getDate().toString().padStart(2, '0')}/${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getFullYear()}`
    : "Fecha no disponible";

  const formattedTime = dateObject
    ? dateObject.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
    : "Hora no disponible";

  return (
    <div className="bg-white border border-gray-200 rounded-xl card-basica flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 h-full min-h-[450px]">
      <div className="w-full h-[200px] rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-[200px] min-h-[198px] object-cover"
          style={{ minHeight: '198px', maxHeight: '200px' }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-sm font-semibold my-2 text-orange-500">
          <span>
            {category ? t(`common.${category.toLowerCase()}`, category) : ''}
          </span>
          {location && (
            <span className="text-gray-600 text-xs flex items-center">
              📍 {location}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 texto-tarjeta flex-grow overflow-hidden text-ellipsis line-clamp-3">
          {description}
        </p>

        {startDate && (
          <p className="text-sm text-gray-600 mt-1">
            📅 {formattedDate} | 🕒 {formattedTime}
          </p>
        )}

        <div className="mt-auto">
          <TagsList tags={[...visibleTags, ...extraTags]} />
        </div>
      </div>
    </div>
  );
}

export default Card;
