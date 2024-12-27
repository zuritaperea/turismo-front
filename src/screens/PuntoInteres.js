import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import CustomAccordion from '../components/CustomAccordion';
import Opiniones from '../components/Opiniones';
import Multimedia from '../components/Multimedia';
import { useParams } from 'react-router-dom';
import service from '../axios/services/puntoInteres';
import favoritoService from '../axios/services/favorito_visitado';
import ImageCarousel from '../components/ImageCarousel';
import MapView from '../components/MapView';

function PuntoInteresScreen() {
  const { id, fechadesde, fechahasta } = useParams();
  const [puntoInteres, setPuntoInteres] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canal, setCanal] = useState(null);

  // Opiniones aqui
  const opiniones = puntoInteres?.opiones;


  const handleFavoriteClick = async () => {
    try {
      let newFavoriteValue = 1; // Valor predeterminado
      if (puntoInteres && puntoInteres.favorito === 1) {
        newFavoriteValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarFavorito({ tipo: 'PuntoInteres', id, favorito: newFavoriteValue })
        .then((response) => {
          setPuntoInteres({ ...puntoInteres, favorito: newFavoriteValue });
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
      if (puntoInteres && puntoInteres.visitado === 1) {
        newVisitedValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarVisitado({ tipo: 'PuntoInteres', id, visitado: newVisitedValue })
        .then((response) => {
          setPuntoInteres({ ...puntoInteres, visitado: newVisitedValue });
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

  useEffect(() => {
    const obtenerPuntoInteres = async () => {
      try {
        const response = await service.obtener(id);
        const datosPuntoInteres = {
          ...response.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          tipo: "PuntoInteres"
        };
        setPuntoInteres(datosPuntoInteres);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el puntoInteres');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerPuntoInteres(); // Llama a la función para obtener el puntoInteres
  }, [id, fechadesde, fechahasta]);

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

  if (!puntoInteres) {
    return null;
  }

  return (<>
    <Header />
    <Jumbotron
      name={puntoInteres.nombre}
      subtittle={`${puntoInteres.departamento}, ${puntoInteres.provincia}`}
      description={`Punto de interés`}
      fechadesde={puntoInteres.fechadesde}
      fechahasta={puntoInteres.fechahasta}
      id={puntoInteres.id}
      tipo={puntoInteres.tipo}
      isFavorite={puntoInteres.favorito}
      isVisited={puntoInteres.visitado}
      handleFavoriteClick={handleFavoriteClick}
      handleVisitedClick={handleVisitedClick}
    />
    <Container className="boxed p-2">

      <Row>
        <Col>
          <Row className="destination-box">
            <Col xs={12} md={6}>
              <Image src={puntoInteres.imagenPrincipal} fluid />
            </Col>
            <Col xs={12} md={6}>
              <p>{puntoInteres.descripcion}</p>
            </Col>
          </Row>

          <ImageCarousel images={puntoInteres.imagenes} />

          {(puntoInteres.HorarioApertura && puntoInteres.HorarioCierre) && (
            <CustomAccordion
              title="Horarios de visita"
              content={`De ${puntoInteres.HorarioApertura} a ${puntoInteres.HorarioCierre}`}
            />
          )}

          {(!puntoInteres.HorarioApertura || !puntoInteres.HorarioCierre) && (
            <CustomAccordion
              title="Horarios de visita"
              content="No se han especificado horarios de visita"
            />
          )}


          <CustomAccordion
            title="Época de Visita"
            content={puntoInteres.epocaVisita}
          />

          <CustomAccordion
            title="Servicios dentro"
            content={puntoInteres.serviciosAdentro}
          />

          <CustomAccordion
            title="Requisitos de acceso"
            content={puntoInteres.requisitosAcceso}
          />
          <CustomAccordion
            title="Accesibilidad"
            content={puntoInteres.accesibilidad}
          />

          <CustomAccordion
            title="Tipo de Turismo"
            content={puntoInteres.tipoTurismo}
          />

          <CustomAccordion
            title="Ruta Natural"
            content={puntoInteres.ruta_natural}
          />
          {(opiniones) && (

            <CustomAccordion
              title="Opiniones"
              content={<Opiniones opiniones={opiniones} />}
            />
          )}


        </Col>
      </Row>

    </Container>

    <Footer /></>
  );
}

export default PuntoInteresScreen;
