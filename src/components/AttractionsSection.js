// AttractionsSection.jsx
import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import medalla from "../assets/img/medalla.png";

const AttractionsSection = () => {
  const title = "Atractivos más cercanos";
  const subtitle = "Conocé los puntos más cercanos a tu ubicación.";
  const attractions = [
    {
      "imgSrc": "https://picsum.photos/id/221/300/200",
      "category": "Plazas y Parques",
      "title": "Jardin Botánico",
      "description": "Una de las atracciones turísticas más visitadas de Curitiba, inaugurada...",
      "tags": [
        "Naturaleza", "Familia", "Aventura"]
    },
    {
      "imgSrc": "https://picsum.photos/id/222/300/200",
      "category": "Plazas y Parques",
      "title": "Bosque Alemano",
      "description": "Un hermoso lugar para disfrutar de la naturaleza y la cultura alemana...",
      "tags": ["Historia", "Cultura", "Paseo"
      ]
    },
    {
      "imgSrc": "https://picsum.photos/id/222/300/200",
      "category": "Plazas y Parques",
      "title": "Otra Atracción",
      "description": "Un lugar maravilloso para explorar y disfrutar de actividades al aire libre...",
      "tags": ["Exploración", "Aventura", "Descanso"
            ]
    },
    {
      "imgSrc": "https://picsum.photos/id/122/300/200",
      "category": "Plazas y Parques",
      "title": "Otra Atracción",
      "description": "Disfruta de un día en un lugar lleno de sorpresas y actividades emocionantes...",
      "tags": ["Diversión","Familia","Relax"
              ]
    }
  ];


  return (
    <div className="py-4">
      <SectionTitle title={title} subtitle={subtitle} imgSrc={medalla} />
      <div className="slider-horizontal flex space-x-4 overflow-x-auto 2xl:justify-center">
        {attractions.map((attraction, index) => (
          <Card key={index} {...attraction} />
        ))}
      </div>
    </div>
  );
};

export default AttractionsSection;
