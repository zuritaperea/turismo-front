import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/evento';
import ContentSection from '../components/ContentSection';
import { useParams } from 'react-router-dom';

function Eventos() {
  const [error, setError] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const { id } = useParams();

  useEffect(() => {


    const obtenerEventos = async () => {
      try {
          let response;
          if (id !== undefined && id !== null) {
            response = await service.obtenerDestino(id);
          } else {
            response = await service.obtenerTodos();
          }
        const atracciones = response.data.map((evento) => {
          let toPath = `/evento/${evento.id}`;
          return {
            to: toPath,
            imgSrc: evento.imagenPrincipal,
            alt: evento.nombre,
            title: evento.nombre,
          };
        });
        setEventos(atracciones);
        setLoadingEventos(false);
      } catch (error) {
        setLoadingEventos(false);
      }
    };

    obtenerEventos();
  }, [id]);


  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }


  return (<>
    <Header />
    <Jumbotron
      name="Eventos"
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          {loadingEventos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <ContentSection data={eventos} />
            </>
          )}
        </Col>
      </Row>


    </Container>

    <Footer /></>
  );
}

export default Eventos;
