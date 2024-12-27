import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import Redes from '../components/Redes';
import CustomAccordion from '../components/CustomAccordion';
import Opiniones from '../components/Opiniones';
import Carrusel from '../components/Carrusel';
import service from '../axios/services/atractivo';
import puntoInteresService from '../axios/services/puntoInteres';
import favoritoService from '../axios/services/favorito_visitado';
import canalService from '../axios/services/contacto_canales';

import { useParams } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import MapView from '../components/MapView';

function AtractivoScreen() {
  const { id, fechadesde, fechahasta } = useParams();
  const [atractivo, setAtractivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destino, setDestino] = useState(null);
  const [canal, setCanal] = useState(null);

  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);
  const [culturalAttractions, setCulturalAttractions] = useState([]);
  const [loadingAtractivosCulturales, setLoadingAtractivosCulturales] = useState(true);
  const [puntosInteres, setPuntosInteres] = useState([]);
  const [loadingPuntosInteres, setLoadingPuntosInteres] = useState(true);

  useEffect(() => {
    const obtenerAtractivo = async () => {
      try {
        const response = await service.obtener(id);
        const datosAtractivo = {
          ...response.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          tipo: "atractivo"
        };
        setAtractivo(datosAtractivo);
        if (datosAtractivo.destinos && datosAtractivo.destinos.length > 0) {
          setDestino(datosAtractivo.destinos[0]);
        }
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el atractivo');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerAtractivo(); // Llama a la función para obtener el atractivo
  }, [id, fechadesde, fechahasta]);


  useEffect(() => {

    const obtenerAtractivosNaturales = async () => {
      try {
        const response = await service.obtenerNaturalDestino(destino.id);
        const atracciones = response.data.map((atractivo) => {
          let toPath = `/atractivo/${atractivo.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: atractivo.imagenPrincipal,
            alt: atractivo.nombre,
            title: atractivo.nombre,
          };
        });
        const atraccionesFiltradas = atracciones.filter((atractivo) => atractivo.id !== id);

        setNaturalAttractions(atraccionesFiltradas);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };

    const obtenerAtractivosCulturales = async () => {
      try {
        const response = await service.obtenerCulturalDestino(destino.id);
        const atracciones = response.data.map((atractivo) => {
          let toPath = `/atractivo/${atractivo.id}`;
          if (fechadesde || fechahasta) {
            toPath += `/${fechadesde || ''}/${fechahasta || ''}`;
          }
          return {
            to: toPath,
            imgSrc: atractivo.imagenPrincipal,
            alt: atractivo.nombre,
            title: atractivo.nombre,
          };
        });
        const atraccionesFiltradas = atracciones.filter((atractivo) => atractivo.id !== id);

        setCulturalAttractions(atraccionesFiltradas);
        setLoadingAtractivosCulturales(false);
      } catch (error) {
        setLoadingAtractivosCulturales(false);
      }
    };


    const obtenerPuntoInteres = async () => {
      try {
        const response = await puntoInteresService.obtenerDestino(destino.id);
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

    const obtenerCanales = async () => {
      try {
        const response = await canalService.obtenerContactoCanalAtractivo(id);
        if (response.data.length > 0) {
          const primerCanal = response.data[0];
          setCanal(primerCanal); // Establecer el primer canal obtenido en el estado
        } else {
          // No se encontraron canales, devolver un valor predeterminado
          setCanal(null); // O establecer algún otro valor predeterminado según tu caso
        }
      } catch (error) {
        // Manejar errores
        console.error("Error al obtener los canales:", error);
        setCanal(null); // O establecer algún otro valor predeterminado según tu caso
      }
    };

    if (destino?.id) {
      obtenerAtractivosNaturales();
      obtenerAtractivosCulturales();
      obtenerPuntoInteres();
      obtenerCanales();
    }
  }, [destino?.id]);

  const handleFavoriteClick = async () => {
    try {
      let newFavoriteValue = 1; // Valor predeterminado
      if (atractivo && atractivo.favorito === 1) {
        newFavoriteValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarFavorito({ tipo: 'Atractivo', id, favorito: newFavoriteValue })
        .then((response) => {
          setAtractivo({ ...atractivo, favorito: newFavoriteValue });
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
      if (atractivo && atractivo.visitado === 1) {
        newVisitedValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarVisitado({ tipo: 'Atractivo', id, visitado: newVisitedValue })
        .then((response) => {
          setAtractivo({ ...atractivo, visitado: newVisitedValue });
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


  const esURL = atractivo?.Entradas && /^(ftp|http|https):\/\/[^ "]+$/.test(atractivo.Entradas);

  // Opiniones aqui
  const opiniones = atractivo?.opinones;


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

  if (!atractivo) {
    return null;
  }

  return (<>
    <Header />
    <Jumbotron
      name={atractivo.Nombre}
      subtittle={`${atractivo.Departamento}, ${atractivo.Provincia}`}
      description={`Atractivo ${atractivo.Tipo}`}
      fechadesde={atractivo.fechadesde}
      fechahasta={atractivo.fechahasta}
      id={atractivo.id}
      tipo={atractivo.tipo}
      isFavorite={atractivo.favorito}
      isVisited={atractivo.visitado}
      handleFavoriteClick={handleFavoriteClick}
      handleVisitedClick={handleVisitedClick}
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          <Row className="destination-box">
            <Col xs={12} md={6}>
              <Image src={atractivo.ImagenPrincipal} fluid />
            </Col>
            <Col xs={12} md={6}>
              <p>{atractivo.Descripcion}</p>
            </Col>

            <Redes latitud={atractivo.Latitud} longitud={atractivo.Longitud}
              facebook={canal?.facebook}
              instagram={canal?.instagram}
              whatsapp={canal?.whatsapp}
              email={canal?.email}
              telefono={canal?.telefono} />
          </Row>

          <ImageCarousel images={atractivo.imagenes} />
          <Row>
            <Col className="mapa">
              <MapView
                name={atractivo.Nombre}
                latitud={atractivo.Latitud}
                longitud={atractivo.Longitud}
                height="300px"
              />
            </Col>
          </Row>
          {(atractivo.HorarioApertura && atractivo.HorarioCierre) && (
            <CustomAccordion
              title="Horarios de visita"
              content={`De ${atractivo.HorarioApertura} a ${atractivo.HorarioCierre}`}
            />
          )}

          {(!atractivo.HorarioApertura || !atractivo.HorarioCierre) && (
            <CustomAccordion
              title="Horarios de visita"
              content="No se han especificado horarios de visita"
            />
          )}
          <CustomAccordion
            title="Época de Visita"
            content={atractivo.Epoca_Visita}
          />

          <CustomAccordion
            title="Servicios dentro"
            content={atractivo.Servicios_Adentro}
          />
          <CustomAccordion
            title="Servicios fuera"
            content={atractivo.Servicios_Afuera}
          />

          <CustomAccordion
            title="Requisitos de acceso"
            content={atractivo.requistosAcceso}
          />

          <CustomAccordion
            title="Accesibilidad"
            content={atractivo.accesibilidad}
          />

          <CustomAccordion
            title="Tipo de Atractivo"
            content={atractivo.tipo_atractivo}
          />

          <CustomAccordion
            title="Tipo de Turismo"
            content={atractivo.tipoTurismo}
          />

          <CustomAccordion
            title="Ruta Natural"
            content={atractivo.ruta_natural}
          />
          {(opiniones) && (

            <CustomAccordion
              title="Opiniones"
              content={<Opiniones opiniones={opiniones} />}
            />
          )}


          {esURL ? (
            <Button variant="primary" className="centrado blanco" href={atractivo.Entradas}>
              Entradas/Tickets
            </Button>
          ) : (
            <CustomAccordion
              title="Entradas"
              content={atractivo.Entradas}
            />
          )}        </Col>
      </Row>
      <hr />
      {loadingAtractivos ? (
        <Spinner animation="border" role="status" />
      ) : (
        <Carrusel title="Atractivos Naturales" data={naturalAttractions.slice(0, 4)} to={`/atractivos-naturales/${destino.id}`} />
      )}
      {loadingAtractivosCulturales ? (
        <Spinner animation="border" role="status" />
      ) : (
        <Carrusel title="Atractivos Culturales" data={culturalAttractions.slice(0, 4)} to={`/atractivos-culturales/${destino.id}`} />
      )}
      {loadingPuntosInteres ? (
        <Spinner animation="border" role="status" />
      ) : (
        <Carrusel title="Puntos de Interés" data={puntosInteres.slice(0, 4)} to={`/puntosinteres/${destino.id}`} />
      )} </Container>

    <Footer /></>
  );
}

export default AtractivoScreen;
