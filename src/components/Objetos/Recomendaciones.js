import { Link } from "react-router-dom";
import Card from "../Card";

const Recomendaciones = ({ items, tipoObjeto, objectId }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Filtra el item actual y toma hasta 4 recomendaciones
  const recomendaciones = items
    .filter(item => item.id !== objectId)
    .slice(0, 4);

  return (
    <div className="py-4">
      <div
        className="mb-4"
        style={{
          color: "#101828",
          fontSize: "30px",
          fontWeight: "600",
        }}
      >
        También puede interesarte...
      </div>
      <div className="slider-horizontal flex space-x-4 overflow-x-auto pl-2">
        {recomendaciones.map((item) => (
          <Link key={item.id} to={`/${tipoObjeto}/${item.id}`}>
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
};

export default Recomendaciones;
