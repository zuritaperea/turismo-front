import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

const Listado = ({ objetosFiltrados, target }) => {
  return (
    <div className="w-full p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {objetosFiltrados.map((item) => (
            <Link 
              key={item.id} 
              to={`/${target ? target.toLowerCase() : item.tipo.toLowerCase()}/${item.id}`}
            >
              <div className="w-64 h-80">
                <Card 
                  imgSrc={item.image} 
                  title={item.title} 
                  category={item.type} 
                  description={item.description} 
                  tags={item.tourist_type} 
                  puntuacion={item.puntuacion} 
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listado;
