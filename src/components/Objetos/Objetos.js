import { useState, useEffect, useContext } from "react";
import "leaflet/dist/leaflet.css";
import Listado from "./Listado";
import Header from "../Header";
import Footer from "../Footer";
import L from "leaflet";
import Mapa from "./Mapa";
import Filtros from "./Filtros";
import { ConfigContext } from '../../extras/ConfigContext';
import { useTranslation } from 'react-i18next';
import { useSeoConfig } from "../../extras/useSeoConfig";
import SEOHelmet from "../SEOHelmet";

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
  const [backgroundImage, setBackgroundImage] = useState("");
  const config = useContext(ConfigContext);
  const { description: globalDescription } = useSeoConfig();
  const { t } = useTranslation();

  const translatedTitle = t(`common.${title.toLowerCase()}`, title);


  useEffect(() => {
    if (config && target) {
      const fieldMap = {
        atractivo: 'image_bg_atractivo',
        evento: 'image_bg_evento',
        gastronomia: 'image_bg_gastronomia',
        alojamiento: 'image_bg_alojamiento',
        circuito: 'image_bg_circuito',
        comercio: 'image_bg_comercio',
        oficina: 'image_bg_oficina',
        emprendedor: 'image_bg_emprendedor',
        balneario: 'image_bg_balneario',
        experiencia: 'image_bg_experiencia',
        fiestapopular: 'image_bg_fiestapopular',
        puntointeres: 'image_bg_puntointeres',
      };

      const fieldKey = fieldMap[target.toLowerCase()];
      if (fieldKey) {
        setBackgroundImage(config[fieldKey]);
      }
    }
  }, [config, target]);

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
    document.title = `${translatedTitle} | ${process.env.REACT_APP_DOCUMENT_TITLE}`;
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
    <>
      <SEOHelmet
        customTitle={`${translatedTitle} | ${process.env.REACT_APP_DOCUMENT_TITLE}`}
        customDescription={`${translatedTitle} | ${globalDescription}`}
        customImage={backgroundImage}
      />
      <div className="flex flex-col min-h-screen justify-center">
        <style>{mapStyles}</style>
        <Header />
        <div
          className="relative w-full pt-12 pb-6 md:pb-10 lg:pb-16 flex flex-col items-center text-white bg-cover bg-center h-auto lg:h-96 bg-principal"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
          <div className="z-10 w-full px-4 flex flex-col justify-center h-full">
            <div className="flex justify-center items-center">
              <h1 className="header-title text-white text-4xl md:text-5xl lg:text-6xl font-black text-center">
                {t(`common.${title.toLowerCase()}`, title)}
              </h1>
            </div>

            <div className="filtros-container lg:absolute w-full flex justify-center px-4 z-20 mt-4 lg:mt-0 animate__animated animate__fadeInUp animate__delay-1s">
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
          {objetosFiltrados.length > 0 ? (
            <div className="w-full">
              <Listado
                objetosFiltrados={objetosFiltrados}
                navigation={navigation}
                target={target}
                title={title}
              />
            </div>
          ) : (
            <div className="text-center mt-5 text-gray-500">
              {t('common.sin_resultados')}
            </div>
          )}
        </div>

        {hasCoordinates && (
          <>
            <p className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4 text-center">
              {t('common.ver_en_el_mapa')}
            </p>
            <div className="flex flex-col md:flex-row flex-grow justify-center items-center align-middle mt-5">
              <div className="w-full flex justify-center px-4 mt-5">
                <div className="w-full max-w-[1600px]">
                  <Mapa objetosFiltrados={objetosFiltrados} />
                </div>
              </div>
            </div>
          </>
        )}
        <Footer />
      </div></>
  );
};

export default ObjetosScreen;
