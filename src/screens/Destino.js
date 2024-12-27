import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import Row from '../components/Row';
import Col from '../components/Col';
import Alert from '../components/Alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Carrusel from '../components/Carrusel';
import Jumbotron from '../components/Jumbotron';
import MapView from '../components/MapView';
import ImageCarousel from '../components/ImageCarousel';
import service from '../axios/services/destino';
import eventoService from '../axios/services/evento';
import circuitoService from '../axios/services/circuito';
import puntoInteresService from '../axios/services/puntoInteres';
import favoritoService from '../axios/services/favorito_visitado';
import atractivoService from '../axios/services/atractivo';



function DestinoScreen() {
  // useParams para obtener los parámetros de la URL
  const { id, fechadesde, fechahasta, filtros } = useParams();
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);
  const [culturalAttractions, setCulturalAttractions] = useState([]);
  const [loadingAtractivosCulturales, setLoadingAtractivosCulturales] = useState(true);
  const [circuitos, setCircuitos] = useState([]);
  const [loadingCircuitos, setLoadingCircuitos] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [puntosInteres, setPuntosInteres] = useState([]);
  const [loadingPuntosInteres, setLoadingPuntosInteres] = useState(true);
  const [destinos, setDestinos] = useState([]);
  const [loadingDestinos, setLoadingDestinos] = useState(true);




  useEffect(() => {

    const obtenerDestino = async () => {
      try {
        const response = await service.obtener(id, fechadesde, fechahasta, filtros);
        const datosDestino = {
          ...response.data.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          tipo: "destino"
        };
        setDestino(datosDestino);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el destino');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    const obtenerAtractivosNaturales = async () => {
      try {
        const response = await atractivoService.obtenerNaturalDestino(id);
        const atracciones = response.data.map((destino) => {
          let toPath = `/atractivo/${destino.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: destino.imagenPrincipal,
            alt: destino.nombre,
            title: destino.nombre,
          };
        });
        setNaturalAttractions(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };

    const obtenerAtractivosCulturales = async () => {
      try {
        const response = await atractivoService.obtenerCulturalDestino(id);
        const atracciones = response.data.map((destino) => {
          let toPath = `/atractivo/${destino.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: destino.imagenPrincipal,
            alt: destino.nombre,
            title: destino.nombre,
          };
        });
        setCulturalAttractions(atracciones);
        setLoadingAtractivosCulturales(false);
      } catch (error) {
        setLoadingAtractivosCulturales(false);
      }
    };

    const obtenerCircuitos = async () => {
      try {
        const response = await circuitoService.obtenerDestino(id);
        const circuitos = response.data.map((circuito) => {
          let toPath = `/circuito/${circuito.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: circuito.imagenPrincipal,
            alt: circuito.nombre,
            title: circuito.nombre,
          };
        });
        setCircuitos(circuitos);
        setLoadingCircuitos(false);
      } catch (error) {
        setLoadingCircuitos(false);
      }
    };


    const obtenerPuntoInteres = async () => {
      try {
        const response = await puntoInteresService.obtenerDestino(id);
        const puntosInteres = response.data.map((puntoInteres) => {
          let toPath = `/puntointeres/${puntoInteres.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: puntoInteres.imagenPrincipal,
            alt: puntoInteres.nombre,
            title: puntoInteres.nombre,
          };
        });
        setPuntosInteres(puntosInteres);
        setLoadingPuntosInteres(false);
      } catch (error) {
        setLoadingPuntosInteres(false);
      }
    };


    const obtenerEventos = async () => {
      try {
        const response = await eventoService.obtenerDestinoDesdeHasta(id, fechadesde, fechahasta);
        const eventos = response.data.map((evento) => {
          let toPath = `/evento/${evento.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: evento.imagenPrincipal,
            alt: evento.nombre,
            title: evento.nombre,
          };
        });
        setEventos(eventos);
        setLoadingEventos(false);
      } catch (error) {
        setLoadingEventos(false);
      }
    };


    const obtenerDestinos = async () => {
      try {
        const response = await service.obtenerDestino(id);
        const destinos = response.data.data.map((destino) => {
          let toPath = `/destino/${destino.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: destino.attributes.image_url?destino.attributes.image_url:process.env.REACT_APP_IMAGE_DEFAULT,
            alt: destino.attributes.name,
            title: destino.attributes.name,
          };
        });
        setDestinos(destinos);
        setLoadingDestinos(false);
      } catch (error) {
        setLoadingDestinos(false);
      }
    };
    obtenerDestino();
    obtenerAtractivosNaturales()
    obtenerAtractivosCulturales()
    obtenerCircuitos();
    obtenerEventos();
    obtenerPuntoInteres();
    obtenerDestinos();
  }, [id, fechadesde, fechahasta]);


  const handleFavoriteClick = async () => {
    try {
      let newFavoriteValue = 1; // Valor predeterminado
      if (destino && destino.favorito === 1) {
        newFavoriteValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarFavorito({ tipo: 'Destino', id, favorito: newFavoriteValue })
        .then((response) => {
          setDestino({ ...destino, favorito: newFavoriteValue });
        }
        )
        .catch((error) => {
          if (error) {
            console.log('Error estableciendo el valor de favorito');
          }
        });

    } catch (error) {
      console.log('Error estableciendo el valor de favorito');
    }
  };

  const handleVisitedClick = async () => {
    try {
      let newVisitedValue = 1; // Valor predeterminado
      if (destino && destino.visitado === 1) {
        newVisitedValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarVisitado({ tipo: 'Destino', id, visitado: newVisitedValue })
        .then((response) => {
          setDestino({ ...destino, visitado: newVisitedValue });
        }
        )
        .catch((error) => {
          if (error) {
            console.log('Error estableciendo el valor de visitado');
          }
        });

    } catch (error) {
      console.log('Error estableciendo el valor de visitado');
    }
  };



  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }

  if (!destino) {
    return null;
  }



  return (
    <>
      <Header />
      <Jumbotron
        name={destino?.attributes?.name}
        subtittle={`${destino.localidad}, ${destino.provincia}`}
        description={'Destino Túristico'}
        fechadesde={destino.fechadesde}
        fechahasta={destino.fechahasta}
        id={destino.id}
        tipo={destino.tipo}
        isFavorite={destino.favorito}
        isVisited={destino.visitado}
        handleFavoriteClick={handleFavoriteClick}
        handleVisitedClick={handleVisitedClick}
      />
      <Container>
        <Row className="mt-2"></Row>
        <Row>
          <ImageCarousel images={destino.imagenes} /></Row>
        <p className="m-3">{destino.attributes.description}</p>
        <Row>
          <Col className="mapa">
            <MapView
              name={destino.nombre}
              latitud={destino.latitud}
              longitud={destino.longitud}
              height="300px"
            />
          </Col>
        </Row>
        {loadingAtractivos ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Carrusel title="Atractivos Naturales" data={naturalAttractions.slice(0, 4)} to={`/destinos-naturales/${id}`} />
        )}
        {loadingAtractivosCulturales ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Carrusel title="Atractivos Culturales" data={culturalAttractions.slice(0, 4)} to={`/destinos-culturales/${id}`} />
        )}
        {loadingEventos ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Carrusel title="Eventos" data={eventos.slice(0, 4)} to={`/eventos/${id}`} />
        )}
        {loadingPuntosInteres ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Carrusel title="Puntos de Interés" data={puntosInteres.slice(0, 4)} to={`/puntosinteres/${id}`} />
        )}

        {loadingCircuitos ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Carrusel title="Circuitos" data={circuitos.slice(0, 4)} to={`/circuitos/${id}`} />
        )}



        <Row>
          <Col>
            <ul className="nav nav-icons nav-icons-selected centrado">
              <li className="md-6">
                <Link to={`/alojamientos/${destino.provincia}`}>
                  <i className="icono-arg-hotel-neg bg-success"></i>
                  <span>Alojamientos</span>
                </Link>
              </li>
              <li className="md-6">
                <Link to={`/info/${id}`}>
                  <i className="icono-arg-tramite bg-success"></i>
                  <span>Información Útil</span>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <section className="bg-gray modulo-mapaestado p-2">
          {loadingDestinos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <Carrusel title="Destinos cercanos" data={destinos} to={`/destinos/${id}`} />
          )}


        </section>
      </Container>
      <Footer />
    </>
  );
}

export default DestinoScreen;
