// TagsList.js
import React from 'react';
import funciones from '../extras/functions';

const TagsList = ({ tags }) => {
  return (
    tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-2 p-2">
        {tags.map((tag, index) => {
          const tagColor = funciones.getColorFromText(tag, index);
          return (
            <span
              key={index}
              className={`font-semibold bg-${tagColor}-100 text-${tagColor}-600 border border-${tagColor}-300 text-sm px-2 py-0 rounded-full tarjeta-tag`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    )
  );
};

export default TagsList;
