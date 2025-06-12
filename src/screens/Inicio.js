import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import atractivoService from '../axios/services/atractivo';
import eventoService from '../axios/services/evento';
import SearchComponent from "../components/SearchComponent";
import SeccionesSlider from "../components/SectionSlider";
import Carousel from "../components/Carousel";
import Splash from "../components/Splash";
import { ConfigContext } from '../extras/ConfigContext';
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from 'lucide-react';
import ItemSection from "../components/ItemSection";
import medallaAtractivos from "../assets/img/medalla.png";
import medallaEventos from "../assets/img/calendario.png";
import DirectAccessList from "../components/DirectAccessList";
import { useTranslation } from 'react-i18next';

export default function Inicio() {

  const [loading, setLoading] = useState(false);

  const [eventos, setEventos] = useState([]);

  const [images, setImages] = useState([]);
  const [banners, setBanners] = useState([]);

  const [directAccessItems, setDirectAccessItems] = useState([]);

  const [naturalAttractions, setNaturalAttractions] = useState([]);

  const [loadingAtractivos, setLoadingAtractivos] = useState(true);

  const [loadingEventos, setLoadingEventos] = useState(true);
  const config = useContext(ConfigContext);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (config) {
      setImages(config.carousel_items);
      setDirectAccessItems(config.direct_access_items);
      setBanners(config.banners);
    }
  }, [config]);

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
        setLoadingEventos(false);
      } catch (error) {
        setLoadingEventos(false);
      }
    };

    const obtenerAtractivos = async () => {
      try {
        const response = await atractivoService.obtenerTodos();
        const atracciones = response.data.data.map((obj) => {
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
        setNaturalAttractions(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };
    obtenerEventos();

    obtenerAtractivos();
  }, []);

  const handleSearch = (query) => {
    navigate(`/busqueda/${query}`);
  };
  const secciones = [
    { icono: <Ticket size={30} />, titulo: t('common.eventos'), link: '/eventos' },
    { icono: <MapPinned size={30} />, titulo: t('common.atractivos'), link: '/atractivos' },
    { icono: <Hotel size={30} />, titulo: t('common.alojamientos'), link: '/alojamientos' },
    { icono: <Bus size={30} />, titulo: t('common.circuitos'), link: '/circuitos' },
    { icono: <ShoppingBag size={30} />, titulo: t('common.comercios'), link: '/comercios' },
    { icono: <Utensils size={30} />, titulo: t('common.gastronomia'), link: '/gastronomia' },
  ];
  return (
    <>
      {loading ? <Splash /> : null}
      <Header config={config} />

      <div className="relative animate__animated animate__fadeIn animate__fast">
        <Carousel images={images} />

        <div className="flex justify-center -mt-28 z-10 relative px-4">
          <div className="w-full max-w-md animate__animated animate__fadeInUp animate__delay-1s">
            <SearchComponent onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col mt-3 items-center px-8 animate__animated animate__fadeInUp animate__delay-2s">
        <SeccionesSlider secciones={secciones} />
      </div>

      <div className="animate__animated animate__fadeIn animate__delay-2s">
        <DirectAccessList items={directAccessItems} />
      </div>

      {loadingAtractivos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div className="animate__animated animate__fadeInUp animate__delay-3s">
          <ItemSection
            data={naturalAttractions.sort(() => Math.random() - Math.random())}
            title={t('common.atractivos_cercanos')}
            subtitle={t('common.atractivos_cercanos_subtitulo')}
            target="atractivo"
            imgSrc={medallaAtractivos}
          />
        </div>
      )}

      <div className="border-t border-[#E4E7EC] h-[1px] md:hidden my-4"></div>

      {loadingEventos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div className="animate__animated animate__fadeInUp animate__delay-4s">
          <ItemSection
            data={eventos.sort(() => Math.random() - Math.random())}
            title={t('common.proximos_eventos')}
            subtitle={t('common.proximos_eventos_subtitulo')}
            target="evento"
            imgSrc={medallaEventos}
            marketplace={false}
          />
        </div>
      )}

      {banners.map((banner, index) => (
        <a
          href={banner.attributes.url}
          key={banner.id}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full mx-auto mt-8 text-center animate__animated animate__zoomIn animate__delay-${index + 1}s`}
        >
          <img
            src={banner.attributes.image}
            alt={banner.attributes.name}
            className="w-full rounded-xl 
          max-h-[320px] sm:max-h-[280px] md:max-h-[300px] lg:max-h-[320px]
          max-w-[95%] sm:max-w-[90%] md:max-w-4xl lg:max-w-5xl mx-auto"
          />
        </a>
      ))}

      <Footer />
    </>

  );
}
