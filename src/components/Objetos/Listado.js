import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

const Listado = ({ objetosFiltrados, target }) => {
  return (
    <div className="flex flex-wrap  justify-center">
      {objetosFiltrados.map((item) => (
        <div key={item.id} style={{ margin: "0.8px" }}>
          <Link to={`/${target.toLowerCase()}/${item.id}`}>
            <Card imgSrc={item.image} title={item.title} category={item.type} description={item.description} tags={item.tourist_type} puntuacion={item.puntuacion} />
          </Link></div>
      ))}
    </div>
  );
};

export default Listado;
