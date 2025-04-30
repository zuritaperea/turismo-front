import React from 'react';
import { Link } from 'react-router-dom';
import pasaporte from '../assets/img/pasaporte-turistico.png';
import planifica from '../assets/img/planifica-viaje.png';
import gestion from '../assets/img/gestion-reservas.png';

const items = [
  {
    title: 'Pasaporte turístico',
    description: 'Explorá nuestro destino y obtené beneficios exclusivos.<br />¡Viajá, disfrutá y ganá!',
    image: pasaporte,
    url: '/pasaporte',
  },
  {
    title: 'Gestión de reservas',
    description: 'Consultá, reservá y organizá tus actividades turísticas de forma fácil y rápida, <br /> todo en un solo lugar.',
    image: gestion,
    url: '/marketplace',
  },
  // {
  //   title: 'Planifica tu viaje',
  //   description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet sapien eget diam commodo semper.',
  //   image: planifica,
  //   url: '/planifica',
  // },
];

const DirectAccessList = () => {
  const isCentered = items.length === 2;

  return (
    <div className="flex justify-center px-4">
      <div
        className={`
          grid gap-8 p-6 w-full
          ${isCentered ? 'grid-cols-1 sm:grid-cols-2 justify-center' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}
          max-w-screen-lg
        `}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 "
          >
            <img src={item.image} alt={item.title} className="w-20 h-20 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p
              className="text-gray-600 text-base mb-4"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            <Link
              to={item.url}
              className="bg-gray-600 text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
            >
              Ver &rsaquo;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};


export default DirectAccessList;
