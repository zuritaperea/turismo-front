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
import AttractionsSection from "../components/AttractionsSection";
import EventsSection from "../components/EventsSection";
import Splash from "../components/Splash";
import marketPlaceLogo from "../assets/img/marketplace.png"
import pasaporteLogo from "../assets/img/pasaporte.png"
import planificadorLogo from "../assets/img/planificador.png"
import { ConfigContext } from '../extras/ConfigContext';
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from 'lucide-react';


export default function Inicio() {
  const [loading, setLoading] = useState(false);

  const [eventos, setEventos] = useState([]);

  const [images, setImages] = useState([]);
  const [naturalAttractions, setNaturalAttractions] = useState([]);

  const [loadingAtractivos, setLoadingAtractivos] = useState(true);

  const [loadingEventos, setLoadingEventos] = useState(true);
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración


  const imagesTest = [
    { file: 'https://picsum.photos/id/227/300/200' },
    { file: 'https://picsum.photos/id/217/300/200' },
    { file: 'https://picsum.photos/id/237/300/200' },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (config) {
      setImages(config.carousel_items || imagesTest);
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

      <Header />
      <Carousel images={images} />

      <div className="flex justify-center flex-col items-center px-8">
        <SearchComponent onSearch={handleSearch} />
        <SeccionesSlider secciones={secciones} />
      </div>

      <div className="flex overflow-x-auto md:overflow-hidden whitespace-nowrap justify-start md:justify-center gap-4 px-4 md:px-0 pb-4">
        <img src={marketPlaceLogo} className="h-48 flex-none" loading="lazy" alt="Marketplace" />
        <img src={pasaporteLogo} className="h-48 flex-none" loading="lazy" alt="Pasaporte" />
        <img src={planificadorLogo} className="h-48 flex-none" loading="lazy" alt="Planificador" />
      </div>

      <div className="border-t border-[#E4E7EC] h-[1px] md:hidden my-4"></div>

      {loadingAtractivos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <AttractionsSection data={naturalAttractions.sort(() => Math.random() - Math.random()).slice(0, 6)} />
      )}
      <div className="border-t border-[#E4E7EC] h-[1px] md:hidden my-4"></div>


      {loadingEventos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <EventsSection data={eventos.sort(() => Math.random() - Math.random()).slice(0, 6)} />
      )}

      <Footer />
    </>
  );
}
