import { Link } from "react-router-dom";
import Card from "../Card";

const Recomendaciones = ({ items, tipoObjeto, objectId }) => {
  if (!items || items.length === 0) {
    return null;
  }

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
      <div
        className="grid gap-6 px-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
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
