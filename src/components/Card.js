import React from 'react';
import Estrellas from './Items/Estrellas';

// Función para convertir el texto en un valor numérico y asignar un color, con menos colisiones
const getColorFromText = (text, index) => {
  const colors = ['yellow', 'red', 'pink', 'blue', 'purple', 'green'];
  
  // Concatenar el texto con el índice para hacer el hash más único
  let hash = 0;
  const combinedText = text + index;  // Usar el índice del tag para diversificar más el valor hash
  
  for (let i = 0; i < combinedText.length; i++) {
    hash = (hash << 5) - hash + combinedText.charCodeAt(i);
  }
  
  // Usar el valor hash para elegir un color, asegurando que se mapee a un índice válido
  const indexColor = Math.abs(hash % colors.length);
  return colors[indexColor];
};

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
        {tags && tags.length > 0 && (
          <div className="space-x-1 mt-2 p-2">
            {tags.map((tag, index) => {
              const tagColor = getColorFromText(tag, index);  // Asignar color basado en el texto y el índice
              return (
                <span
                  key={index}
                  className={`font-semibold bg-${tagColor}-100 text-${tagColor}-600 border border-${tagColor}-300 text-sm px-2 py-0 rounded-full tarjeta-tag`}
                >
                  {tag} {/* Mostrar solo el texto del tag */}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
