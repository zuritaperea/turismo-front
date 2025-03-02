import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import medalla from "../assets/img/medalla.png";
import { Link } from "react-router-dom";

const AttractionsSection = ({ data }) => {
  const title = "Atractivos más cercanos";
  const subtitle = "Conocé los puntos más cercanos a tu ubicación.";
  const target = "atractivo";

  return (
    <div className="py-4 px-4 sm:px-6 md:px-0">
      <SectionTitle title={title} subtitle={subtitle} imgSrc={medalla} />
      <div className="slider-horizontal flex space-x-4 overflow-x-auto 2xl:justify-center">
        {data.map((item, index) => (
          <Link key={item.id} to={`/${target.toLowerCase()}/${item.id}`}>
            <Card 
              key={item.id} 
              imgSrc={item.image} 
              title={item.title} 
              category={item.type} 
              description={item.description} 
              tags={item.tourist_type} 
              puntuacion={item.puntuacion} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AttractionsSection;
