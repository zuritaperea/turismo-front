import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

const keepLocalAsUTC = (date) => {
  if (!date) return null;

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date)) {
    return null; 
  }

  const year = date.getFullYear();
  const month = date.getMonth(); 
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
};

const Listado = ({ objetosFiltrados, target, desde, hasta, cantidad, pasaporte }) => {
  return (
    <div className="w-full p-4 flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {Array.isArray(objetosFiltrados)
            ? objetosFiltrados.map((item, index) => {
                const queryParams = new URLSearchParams();

                const fechaDesdeUTC = keepLocalAsUTC(desde);
                const fechaHastaUTC = keepLocalAsUTC(hasta);

                if (fechaDesdeUTC) queryParams.append("fechadesde", fechaDesdeUTC.toISOString());
                if (fechaHastaUTC) queryParams.append("fechahasta", fechaHastaUTC.toISOString());
                if (cantidad != null) queryParams.append("cantidad", cantidad);
                if (pasaporte != null) queryParams.append("pasaporte", pasaporte);

                const path = `/${target ? target.toLowerCase() : item.tipo.toLowerCase()}/${item.id}`;
                const fullPath = `${path}?${queryParams.toString()}`;

                const delayClass = `animate__delay-${(index % 1)}s`;

                return (
                  <Link key={item.id} to={fullPath}>
                    <div className={`w-64 h-80 animate__animated animate__flipInY ${delayClass}`}>
                      <Card
                        imgSrc={item.image}
                        title={item.title}
                        category={item.type}
                        description={item.description}
                        tags={item.tourist_type}
                        puntuacion={item.puntuacion}
                        location={item.location}
                        startDate={item.startDate}
                      />
                    </div>
                  </Link>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Listado;
