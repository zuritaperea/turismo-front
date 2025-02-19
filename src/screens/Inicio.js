import React, { useEffect, useState, useContext } from "react";
import Row from "../components/Row";
import Spinner from "../components/Spinner";
import Col from "../components/Col";
import Container from "../components/Container";
import Alert from "../components/Alert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import atractivoService from '../axios/services/atractivo';
import eventoService from '../axios/services/evento';
import SearchComponent from "../components/SearchComponent";
import SeccionesSlider from "../components/SectionSlider";
import ticketImg from '../assets/img/ticket-01.png';
import markerImg from '../assets/img/marker-pin-04.png';
import buildingImg from '../assets/img/building-07.png';
import busImg from '../assets/img/bus.png';
import shoppingBagImg from '../assets/img/shopping-bag-01.png';
import gastronomyImg from '../assets/img/face-happy.png';
import Carousel from "../components/Carousel";
import AttractionsSection from "../components/AttractionsSection";
import EventsSection from "../components/EventsSection";
import Splash from "../components/Splash";
import marketPlaceLogo from "../assets/img/marketplace.png"
import pasaporteLogo from "../assets/img/pasaporte.png"
import planificadorLogo from "../assets/img/planificador.png"
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto


export default function Inicio() {
  const [loading, setLoading] = useState(false);

  const [personaDenominacion, setPersonaDenominacion] = useState(null);

  const [eventos, setEventos] = useState([]);

  const [error, setError] = useState("");
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
    if (config) { // Verifica que config no sea null
      setImages(config.carousel_items || imagesTest);
    }
  }, [config]); // El useEffect se ejecuta cada vez que config cambia




  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setPersonaDenominacion(item?.username);
    }

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
    { imagen: ticketImg, titulo: 'Eventos', link: '/eventos' },
    { imagen: markerImg, titulo: 'Atractivos', link: '/atractivos' },
    { imagen: buildingImg, titulo: 'Alojamientos', link: '/alojamientos' },
    { imagen: busImg, titulo: 'Circuitos', link: '/circuitos' },
    { imagen: shoppingBagImg, titulo: 'Comercios', link: '/comercios' },
    { imagen: gastronomyImg, titulo: 'Gastronomía', link: '/gastronomia' },
  ];


  return (
    <>
      {loading ? <Splash /> : null}

      <Header />
      <Carousel images={images} />

      <SearchComponent onSearch={handleSearch} />
      <SeccionesSlider secciones={secciones} />
      <div className="flex justify-center flex-wrap">
        <img src={marketPlaceLogo} className="m-2 h-48 2xl:h-auto" loading="lazy" alt="Marketplace"/>
        <img src={pasaporteLogo} className="m-2 h-48 2xl:h-auto" loading="lazy" alt="Pasaporte" />
        <img src={planificadorLogo} className="m-2 h-48 2xl:h-auto" loading="lazy" alt="Planificador"/>
      </div>
      <hr />
      {loadingAtractivos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <AttractionsSection data={naturalAttractions.sort(() => Math.random() - Math.random()).slice(0, 6)} />
      )}


      <hr />
      {loadingEventos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <EventsSection data={eventos.sort(() => Math.random() - Math.random()).slice(0, 6)} />
      )}




      <Row className="justify-content-md-center p-2">
        <Col md="12">
          {!personaDenominacion ? (
            <Alert variant="light">
              ¿Sabías que al <Alert.Link href="/login">iniciar sesión </Alert.Link>
              puedes guardar tus destinos favoritos y recibir recomendaciones personalizadas?</Alert>
          ) : (
            <Alert variant="light">
              Para mejorar los resultados de tus búsquedas, <Alert.Link href="/perfil">completá  </Alert.Link>
              algunos datos que definan <Alert.Link href="/perfil">tu perfil de turista</Alert.Link>
            </Alert>)}
        </Col>
      </Row>

      <Footer />
    </>
  );
}
