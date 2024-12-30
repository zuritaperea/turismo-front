import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

const Listado = ({ objetosFiltrados, target }) => {
  return (
    <div className="flex flex-wrap">
      {objetosFiltrados.map((item) => (
        <div style={{ margin: "0.8px" }}>
          <Link key={item.id} to={`/${target.toLowerCase()}/${item.id}`}>
            <Card key={item.id} imgSrc={item.image} title={item.title} category={item.type} description={item.description} tags={item.tourist_type} puntuacion={item.puntuacion} />
          </Link></div>
      ))}
    </div>
  );
};

export default Listado;
