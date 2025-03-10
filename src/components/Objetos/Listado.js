import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

const Listado = ({ objetosFiltrados, target }) => {
  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-2 mx-auto">
  {objetosFiltrados.map((item) => (
    <div key={item.id}>
      <Link to={`/${target ? target.toLowerCase() : item.tipo.toLowerCase()}/${item.id}`}>
        <Card 
          imgSrc={item.image} 
          title={item.title} 
          category={item.type} 
          description={item.description} 
          tags={item.tourist_type} 
          puntuacion={item.puntuacion} 
        />
      </Link>
    </div>
  ))}
</div>
  );
};

export default Listado;
