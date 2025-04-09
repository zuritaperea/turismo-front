import React from 'react';
import { Link } from 'react-router-dom';

const DirectAccessItem = ({ item }) => {
  const imageUrl = item.image_url.startsWith('http')
    ? item.image_url
    : process.env.REACT_APP_API_URL + item.image_url;

  return (
    <Link to={item.url} className="block w-full p-2">
      <div
        className="relative rounded-xl overflow-hidden bg-gray-200 shadow-md"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '220px' // o lo que quieras según tu layout
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <span
            className="text-center text-3xl font-semibold px-2"
            style={{
              color: item.title_color,
              fontFamily: item.title_font
            }}
          >
            {item.title_text}
          </span>
        </div>
      </div>
    </Link>
  );
};


const DirectAccessList = ({ items }) => {
  const publicados = items.filter(item => item.published).slice(0, 6); // por ejemplo

  return (
    <div className="max-w-screen-xl mx-auto block">
      <div className="flex flex-wrap justify-center gap-4 px-4 md:px-0 pb-4">
        {publicados.map((item, index) => (
          <DirectAccessItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DirectAccessList;
