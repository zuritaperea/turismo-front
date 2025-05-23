import React from 'react';
import { Link } from 'react-router-dom';

const DirectAccessList = ({ items }) => {

  const filteredItems = items.filter(item => item.published === true);
  const isCentered = filteredItems.length === 2;

  return (
    <div className="flex justify-center px-4">
      <div
        className={`
          grid gap-8 p-6 w-full
          ${isCentered ? 'grid-cols-1 sm:grid-cols-2 justify-center' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}
          max-w-screen-lg
        `}
      >
        {filteredItems.map((item, index) => {
          console.log(item);
          const imageUrl = item.image_url
            ? (item.image_url.startsWith('http') ? item.image_url : `${process.env.REACT_APP_API_URL}${item.image_url}`)
            : item.image;

          const isExternal = item.url.startsWith('http://') || item.url.startsWith('https://');

          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <img src={imageUrl} alt={item.title_text} className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title_text}</h3>
              <p
                className="text-gray-600 text-base mb-4"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              {isExternal ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-600 text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
                  aria-label={item.title}
                >
                  Ver &rsaquo;
                </a>
              ) : (
                <Link
                  to={item.url}
                  className="bg-gray-600 text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  Ver &rsaquo;
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DirectAccessList;
