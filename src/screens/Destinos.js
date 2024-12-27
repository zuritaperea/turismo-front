import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/destino';
import ContentSection from '../components/ContentSection';
import { useParams } from 'react-router-dom';

function DestinosScreen() {
  const [error, setError] = useState(null);
  const [destinos, setDestinos] = useState([]);
  const [loadingDestinos, setLoadingDestinos] = useState(true);
  const { id } = useParams();

  useEffect(() => {


    const obtenerDestinos = async () => {
      try {
        let response;
        if (id !== undefined && id !== null) {
          response = await service.obtenerDestino(id);
        } else {
          response = await service.obtenerTodos();
        }
        const atracciones = response.data.data.map((destino) => {
          let toPath = `/destino/${destino.id}`;
          return {
            to: toPath,
            imgSrc: destino.attributes.image_url?destino.attributes.image_url:process.env.REACT_APP_IMAGE_DEFAULT,
            alt: destino.attributes.name,
            title: destino.attributes.name,
          };
        });
        setDestinos(atracciones);
        setLoadingDestinos(false);
      } catch (error) {
        setLoadingDestinos(false);
      }
    };

    obtenerDestinos();
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
      name="Destinos"
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          {loadingDestinos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <ContentSection data={destinos} />
            </>
          )}
        </Col>
      </Row>


    </Container>

    <Footer /></>
  );
}

export default DestinosScreen;
