import { Link } from "react-router-dom";
import Card from "../Card";

const Recomendaciones = ({ items, tipoObjeto }) => (
    <div className="py-4">
      <div className="text-3xl font-semibold text-slate-900 tracking-tight dark:text-slate-200 mb-4">
        También puede interesarte...
      </div>
      <div className="slider-horizontal flex space-x-4 overflow-x-auto pl-2">
        {items?.map((item) => (
          <Link key={item.id} to={`/${tipoObjeto}/${item.id}`}>
            <Card
              key={item.id}
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
  
  export default Recomendaciones;