import { Link } from "react-router-dom";
import Card from "../Card";
import { useTranslation } from "react-i18next";

const Recomendaciones = ({ items, tipoObjeto, objectId }) => {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return null;
  }
  const recomendaciones = items
    .filter(item => item.id !== objectId)
    .slice(0, 4);

  return (
    <div className="py-4 mb-20">
      <div
        className="mb-5"
        style={{
          color: "#101828",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        {t('common.tambien_puede_interesarte')}...
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
