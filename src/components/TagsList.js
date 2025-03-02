import React from 'react';
import funciones from '../extras/functions';

const TagsList = ({ tags }) => {
  return (
    tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-4 justify-center md:justify-start">
        {tags.map((tag, index) => {
          const tagStyle = funciones.getColorFromText(tag, index);
          return (
            <span
              key={index}
              className="font-semibold text-sm px-2 py-0 rounded-full tarjeta-tag"
              style={{
                backgroundColor: tagStyle.background,
                color: tagStyle.color,
                border: `1px solid ${tagStyle.border}`,
              }}
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
