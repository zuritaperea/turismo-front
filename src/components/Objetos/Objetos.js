import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Listado from "./Listado";
import Header from "../Header";
import Footer from "../Footer";
import L from "leaflet";
import Mapa from "./Mapa";
import Filtros from "./Filtros";

const mapStyles = `
  .leaflet-control-zoom {
    display: none !important;
  }
  .leaflet-control-attribution {
    display: none !important;
  }
`;

const ObjetosScreen = ({ navigation, target, title, objetoService }) => {
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultImage = process.env.REACT_APP_IMAGE_DEFAULT;
  const [backgroundImage, setBackgroundImage] = useState(defaultImage);

  useEffect(() => {
    if (objetosFiltrados.length > 0) {
      const randomIndex = Math.floor(Math.random() * objetosFiltrados.length);
      setBackgroundImage(objetosFiltrados[randomIndex].image);
    }
  }, [objetosFiltrados]);

  const customIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#f08400" fillOpacity="0.3" />
          <circle cx="12" cy="12" r="6" fill="#f08400" />
        </svg>
      `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  const obtenerTodos = async () => {
    setLoading(true);
    setObjetosFiltrados([]);
    try {
      const response = await objetoService.obtenerTodos();
      const data = response.data.data;

      const objetosData = data.map((obj) => ({
        id: obj.id,
        title: obj.attributes.name,
        image: obj.attributes.image_url
          ? process.env.REACT_APP_API_URL + obj.attributes.image_url
          : process.env.REACT_APP_IMAGE_DEFAULT,
        puntuacion: obj.attributes.evaluation,
        favorito: obj.attributes.favorite,
        coordinates: obj.attributes.point,
        tourist_type: obj.attributes.tourist_type,
        type: obj.type,
        location: obj.attributes.location,
        startDate: obj.attributes.start_date,
      }));

      setObjetosFiltrados(objetosData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = `${process.env.REACT_APP_DOCUMENT_TITLE} - ${title}`;
    obtenerTodos();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigation]);

  const hasCoordinates =
    Array.isArray(objetosFiltrados) &&
    objetosFiltrados.some(
      (objeto) =>
        objeto.coordinates &&
        typeof objeto.coordinates === "object" &&
        objeto.coordinates.latitude &&
        objeto.coordinates.longitude
    );

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <style>{mapStyles}</style>
      <Header />
      <div
        className="relative w-full pt-12 pb-6 md:pb-10 lg:pb-16 flex flex-col items-center text-white bg-cover bg-center h-auto lg:h-96"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
        <div className="z-10 w-full px-4 flex flex-col justify-center h-full">
          <div className="flex justify-center items-center">
            <h1 className="header-title text-white text-4xl md:text-5xl lg:text-6xl font-black text-center">
              {title}
            </h1>
          </div>

          <div className="filtros-container lg:absolute w-full flex justify-center px-4 z-20 mt-4 lg:mt-0">
            <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
              <Filtros
                objetoService={objetoService}
                setObjetosFiltrados={setObjetosFiltrados}
                target={target}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-center align-middle items-center">
        <Listado
          objetosFiltrados={objetosFiltrados}
          navigation={navigation}
          target={target}
          title={title}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-grow justify-center items-center align-middle mt-20">
        {hasCoordinates && (
          <div className="w-full flex justify-center px-4 mt-20">
            <div className="w-full max-w-[1600px]">
              <Mapa objetosFiltrados={objetosFiltrados} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ObjetosScreen;
