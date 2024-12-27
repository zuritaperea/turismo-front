import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import CustomAccordion from '../components/CustomAccordion';
import Opiniones from '../components/Opiniones';
import Multimedia from '../components/Multimedia';
import { useParams } from 'react-router-dom';
import service from '../axios/services/evento';
import favoritoService from '../axios/services/favorito_visitado';
import ImageCarousel from '../components/ImageCarousel';
import Redes from '../components/Redes';

function EventoScreen() {
  const { id, fechadesde, fechahasta } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        const response = await service.obtener(id);
        const datosEvento = {
          ...response.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          tipo: "evento"
        };
        setEvento(datosEvento);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el evento');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerEvento(); // Llama a la función para obtener el evento
  }, [id, fechadesde, fechahasta]);

  // Opiniones aqui
  const opiniones = evento?.opiniones;

  // Función para formatear la fecha en el formato "dd/mm/yyyy"
  const formatDate = (date) => {
    if (date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    return null; // Si la fecha es nula, retornamos nulo
  }

  const handleFavoriteClick = async () => {
    try {
      let newFavoriteValue = 1; // Valor predeterminado
      if (evento && evento.favorito === 1) {
        newFavoriteValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarFavorito({ tipo: 'Evento', id, favorito: newFavoriteValue })
        .then((response) => {
          setEvento({ ...evento, favorito: newFavoriteValue });
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
      if (evento && evento.visitado === 1) {
        newVisitedValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarVisitado({ tipo: 'Evento', id, visitado: newVisitedValue })
        .then((response) => {
          setEvento({ ...evento, visitado: newVisitedValue });
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

  if (!evento) {
    return null;
  } else
    return (<>
      <Header />
      <Jumbotron
        name={evento.nombre}
        description={'Evento'}
        subtittle={`${evento.departamento}, ${evento.provincia}`}
        fechadesde={evento.fechadesde}
        fechahasta={evento.fechahasta}
        id={evento.id}
        tipo={evento.tipo}
        isFavorite={evento.favorito}
        isVisited={evento.visitado}
        handleFavoriteClick={handleFavoriteClick}
        handleVisitedClick={handleVisitedClick}
      />
      <Container className="boxed p-2">
        <Row>
          <Col>
            <Row className="destination-box">
              <Col xs={12} md={6}>
                <Image src={evento.imagenPrincipal} fluid />
              </Col>
              <Col xs={12} md={6}>
                <h1>{evento.nombre}</h1>
                <p>{evento.descripcion}</p>
              </Col>

              <Redes latitud={evento.Latitud} longitud={evento.Longitud}
                facebook={evento?.canales?.facebook}
                instagram={evento?.canales?.instagram}
                whatsapp={evento?.canales?.whatsapp}
                email={evento?.canales?.email}
                telefono={evento?.canales?.telefono} />



            </Row>
            <ImageCarousel images={evento.imagenes} />


            {(evento.fecha_inicio && evento.fecha_fin) && (
              <CustomAccordion
                title="Dias"
                content={`Del ${formatDate(evento.fecha_inicio)} al ${formatDate(evento.fecha_fin)}`}
              />
            )}

            {(!evento.fecha_inicio || !evento.fecha_fin) && (
              <CustomAccordion
                title="Días"
                content="No se han especificado días"
              />
            )}


            {(evento.horarioApertura && evento.horarioCierre) && (
              <CustomAccordion
                title="Horarios"
                content={`De ${evento.horarioApertura} a ${evento.horarioCierre}`}
              />
            )}

            {(!evento.horarioApertura || !evento.horarioCierre) && (
              <CustomAccordion
                title="Horarios"
                content="No se han especificado horarios"
              />
            )}


            <CustomAccordion
              title="Calendario de actividades"
              content={evento.calendario}
            />

            <CustomAccordion
              title="Servicios"
              content={evento.serviciosAdentro}
            />

            <CustomAccordion
              title="Tipo de entrada"
              content={evento.tipoEntrada}
            />

            <CustomAccordion
              title="Requisitos de acceso"
              content={evento.requisitosAcceso}
            />

            <CustomAccordion
              title="Aforo"
              content={evento.aforo}
            />
            <CustomAccordion
              title="Organizador"
              content={evento.organizador}
            />
            <CustomAccordion
              title="Accesibilidad"
              content={evento.accesibilidad}
            />
            <CustomAccordion
              title="Ruta Natural"
              content={evento.ruta_natural}
            />
            <CustomAccordion
              title="Tipo de Turismo"
              content={evento.tipoTurismo}
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

export default EventoScreen;
