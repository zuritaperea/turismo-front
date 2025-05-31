import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import atractivoService from '../axios/services/atractivo';
import eventoService from '../axios/services/evento';
import SearchComponent from "../components/SearchComponent";
import SeccionesSlider from "../components/SectionSlider";
import Carousel from "../components/Carousel";
import Splash from "../components/Splash";
import marketPlaceLogo from "../assets/img/banners-aplicativo-01.jpg"
import pasaporteLogo from "../assets/img/banners-aplicativo-02.jpg"
import planificadorLogo from "../assets/img/planificador.png"
import { ConfigContext } from '../extras/ConfigContext';
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from 'lucide-react';
import ItemSection from "../components/ItemSection";
import medallaAtractivos from "../assets/img/medalla.png";
import medallaEventos from "../assets/img/calendario.png";
import DirectAccessList from "../components/DirectAccessList";
import bannerHome from "../assets/img/banner-home.png";

export default function Inicio() {
  const [loading, setLoading] = useState(false);

  const [eventos, setEventos] = useState([]);

  const [images, setImages] = useState([]);
  const [directAccessItems, setDirectAccessItems] = useState([]);

  const [naturalAttractions, setNaturalAttractions] = useState([]);

  const [loadingAtractivos, setLoadingAtractivos] = useState(true);

  const [loadingEventos, setLoadingEventos] = useState(true);
  const config = useContext(ConfigContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (config) {
      setImages(config.carousel_items);
      setDirectAccessItems(config.direct_access_items);
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
    { icono: <Ticket size={30} />, titulo: 'Eventos', link: '/eventos' },
    { icono: <MapPinned size={30} />, titulo: 'Atractivos', link: '/atractivos' },
    { icono: <Hotel size={30} />, titulo: 'Alojamientos', link: '/alojamientos' },
    { icono: <Bus size={30} />, titulo: 'Circuitos', link: '/circuitos' },
    { icono: <ShoppingBag size={30} />, titulo: 'Comercios', link: '/comercios' },
    { icono: <Utensils size={30} />, titulo: 'Gastronomía', link: '/gastronomia' },
  ];
  return (
    <>
      {loading ? <Splash /> : null}
      <Header config={config} />

      <div className="relative">
        <Carousel images={images} />
        <div className="flex justify-center -mt-28 z-10 relative px-4">
          <div className="w-full max-w-md">
            <SearchComponent onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col mt-3 items-center px-8">
        <SeccionesSlider secciones={secciones} />
      </div>

      <DirectAccessList items={directAccessItems} />
      {
        loadingAtractivos ? (
            <Spinner animation="border" role="status" />
        ) : (
            <ItemSection
                data={naturalAttractions.sort(() => Math.random() - Math.random())}
                title="Atractivos más cercanos"
                subtitle="Conocé los puntos más cercanos a tu ubicación."
                target="atractivo"
                imgSrc={medallaAtractivos}
            />)
      }
      <div className="border-t border-[#E4E7EC] h-[1px] md:hidden my-4"></div>

      <div className="border-t border-[#E4E7EC] h-[1px] md:hidden my-4"></div>
      {
        loadingEventos ? (
          <Spinner animation="border" role="status" />
        ) : (
          <ItemSection
            data={eventos.sort(() => Math.random() - Math.random())}
            title="Próximos eventos"
            subtitle="Conocé los próximos eventos."
            target="evento"
            imgSrc={medallaEventos}
            marketplace={false}
          />)
      }
      <a
        href="https://hechoenmarchiquita.ar/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mx-auto mt-8 text-center"
      >
        <img
          src={bannerHome}
          alt="Banner Home"
          className="w-full rounded-xl 
               max-h-[320px] sm:max-h-[280px] md:max-h-[300px] lg:max-h-[320px]
               max-w-[95%] sm:max-w-[90%] md:max-w-4xl lg:max-w-5xl mx-auto"
        />
      </a>
      <Footer />
    </>
  );
}
