import React from 'react';
import { Link } from 'react-router-dom';
import pasaporte from '../assets/img/pasaporte-turistico.png';
import planifica from '../assets/img/planifica-viaje.png';
import gestion from '../assets/img/gestion-reservas.png';

const items = [
  {
    title: 'Pasaporte turístico',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet sapien eget diam commodo semper.',
    image: pasaporte,
    url: '/pasaporte',
  },
  {
    title: 'Gestión de reservas',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet sapien eget diam commodo semper.',
    image: gestion,
    url: '/reservas',
  },
  {
    title: 'Planifica tu viaje',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet sapien eget diam commodo semper.',
    image: planifica,
    url: '/planifica',
  },
];

const DirectAccessList = () => {
  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-6 "
        >
          <img src={item.image} alt={item.title} className="w-24 h-24 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-600 font-normal text-base mb-4">{item.description}</p>
          <Link
            to={item.url}
            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Ver &rsaquo;
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DirectAccessList;
