import React, { useEffect, useState } from "react";
import eventoService from '../axios/services/evento';
import ItemSection from "./ItemSection";
import medallaEventos from "../assets/img/calendario.png";

const EventoMarketplace = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const response = await eventoService.obtenerTodos();
        const destinos = response.data.data.map((obj) => {
          return {
            id: obj.id,
            title: obj.attributes.name,
            image: obj.attributes.image_url
              ? process.env.REACT_APP_API_URL + obj.attributes.image_url
              : process.env.REACT_APP_IMAGE_DEFAULT,
            puntuacion: obj.attributes.evaluation,
            favorito: obj.attributes.favorite,
            coordinates: obj.attributes.point,
            tourist_type: obj.attributes.tourist_type,
            type: obj.type
          };
        });
        setEventos(destinos);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerEventos();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Eventos Destacados</h2>
      <p className="text-center">Estos son los Eventos más elegidos en Santa Clara del Mar.</p>

      <ItemSection             target="evento"
            imgSrc={medallaEventos}
            title="Próximos eventos"
            subtitle="Conocé los próximos eventos."

        marketplace={true} 
        data={eventos.sort(() => Math.random() - Math.random()).slice(0, 6)} 
      />
    </div>
  );
}

export default EventoMarketplace;
