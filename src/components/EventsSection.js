import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import medalla from "../assets/img/calendario.png";
import { Link } from "react-router-dom";

const EventsSection = ({ data, marketplace }) => {
  const title = "Próximos eventos";
  const subtitle = "Conocé los próximos eventos.";
  const target = "evento";

  return (
    <div className="py-10 px-4 sm:px-6 md:px-0">
      {!marketplace && (
        <SectionTitle title={title} subtitle={subtitle} imgSrc={medalla} />
      )}
      <div className="slider-horizontal flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        {data.map((item) => (
          <Link key={item.id} to={`/${target.toLowerCase()}/${item.id}`}>
            <Card 
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
}

export default EventsSection;
