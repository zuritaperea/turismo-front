import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import atractivoService from '../axios/services/atractivo';
import eventoService from '../axios/services/evento';
import circuitoService from '../axios/services/circuito';
import SearchComponent from "../components/SearchComponent";
import SeccionesSlider from "../components/SectionSlider";
import Carousel from "../components/Carousel";
import Splash from "../components/Splash";
import { ConfigContext } from '../extras/ConfigContext';
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from 'lucide-react';
import ItemSection from "../components/ItemSection";
import medallaAtractivos from "../assets/img/medalla.png";
import medallaEventos from "../assets/img/calendario.png";
import circuitoImg from "../assets/img/circuito.png";
import DirectAccessList from "../components/DirectAccessList";
import { useTranslation } from 'react-i18next';
import { jsonLdInicio } from "../extras/seoHelpers";
import SEOHelmet from "../components/SEOHelmet";
export default function Inicio() {
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [images, setImages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [directAccessItems, setDirectAccessItems] = useState([]);
  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingCircuitos, setLoadingCircuitos] = useState(true);

  const config = useContext(ConfigContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [seoJson, setSeoJson] = useState(null);


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
        const destinos = response.data.data.map((obj) => ({
          id: obj.id,
          title: obj.attributes.name,
          image: obj.attributes.image_url
            ? process.env.REACT_APP_API_URL + obj.attributes.image_url
            : process.env.REACT_APP_IMAGE_DEFAULT,
          puntuacion: obj.attributes.evaluation,
          favorito: obj.attributes.favorite,
          coordinates: obj.attributes.point,
          tourist_type: obj.attributes.tourist_type,
          start_date: obj.attributes.start_date,
          end_date: obj.attributes.end_date,
          type: obj.type
        }));
        setEventos(destinos);
        setLoadingEventos(false);
      } catch (error) {
        setLoadingEventos(false);
      }
    };

    const obtenerCircuitos = async () => {
      try {
        const response = await circuitoService.obtenerTodos();
        const destinos = response.data.data.map((obj) => ({
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
        }));
        setCircuitos(destinos);
        setLoadingCircuitos(false);
      } catch (error) {
        setLoadingCircuitos(false);
      }
    };

    const obtenerAtractivos = async () => {
      try {
        const response = await atractivoService.obtenerTodos();
        const atracciones = response.data.data.map((obj) => ({
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
        }));
        setNaturalAttractions(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };

    obtenerEventos();
    obtenerAtractivos();
    obtenerCircuitos();
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

    useEffect(() => {
    if (config && naturalAttractions.length && eventos.length && circuitos.length) {
      setSeoJson(jsonLdInicio(window.location, config, naturalAttractions, eventos, circuitos, secciones));
      //TODO revisar que se cargue bien el json
    }
  }, [config, naturalAttractions, eventos, circuitos]);


  return (
    <>
      {loading ? <Splash /> : null}
      {seoJson && <SEOHelmet customJsonLd={seoJson} />}
      <Header config={config} />

      <div className="relative">
        <Carousel images={images} />

        <div className="flex justify-center -mt-28 z-10 relative px-4">
          <div className="w-full max-w-md animate__animated animate__fadeInUp animate__delay-1s">
            <SearchComponent onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col mt-3 items-center px-8">
        <SeccionesSlider secciones={secciones} />
      </div>

      <div>
        <DirectAccessList items={directAccessItems} />
      </div>

      {loadingAtractivos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div >
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
        <div>
          <ItemSection
            data={eventos}
            title={t('common.eventos_titulo')}
            subtitle={t('common.eventos_subtitulo')}
            target="evento"
            imgSrc={medallaEventos}
            marketplace={false}
          />
        </div>
      )}

      {loadingCircuitos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div>
          <ItemSection
            data={circuitos.sort(() => Math.random() - Math.random())}
            title={t('common.circuitos_titulo')}
            subtitle={t('common.circuitos_subtitulo')}
            target="circuito"
            imgSrc={circuitoImg}
            marketplace={false}
          />
        </div>
      )}

      {/* Slider de banners */}
      {banners.length > 0 && (
        <div className="w-full mt-8 text-center 
         max-h-[320px] sm:max-h-[280px] md:max-h-[300px] 
         lg:max-h-[320px] max-w-[95%] sm:max-w-[90%] md:max-w-4xl 
         lg:max-w-5xl mx-auto">
          <Carousel
            images={banners.map(banner => ({
              file: banner.attributes.image,
              title: banner.attributes.name,
              url: banner.attributes.url
            }))}
          />
        </div>
      )}
      <Footer />
    </>
  );
}
