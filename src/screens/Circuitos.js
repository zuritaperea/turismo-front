import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/circuito';
import ContentSection from '../components/ContentSection';
import { useParams } from 'react-router-dom';

function CircuitosScreen() {
  const [error, setError] = useState(null);
  const [circuitos, setCircuitos] = useState([]);
  const [loadingCircuitos, setLoadingCircuitos] = useState(true);
  const { id } = useParams();

  useEffect(() => {


    const obtenerCircuitos = async () => {
      try {
        let response;
        if (id !== undefined && id !== null) {
          response = await service.obtenerCircuito(id);
        } else {
          response = await service.obtenerTodos();
        }
        const atracciones = response.data.map((circuito) => {
          let toPath = `/circuito/${circuito.id}`;
          return {
            to: toPath,
            imgSrc: circuito.imagenPrincipal,
            alt: circuito.nombre,
            title: circuito.nombre,
          };
        });
        setCircuitos(atracciones);
        setLoadingCircuitos(false);
      } catch (error) {
        setLoadingCircuitos(false);
      }
    };

    obtenerCircuitos();
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
      name="Circuitos"
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          {loadingCircuitos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <ContentSection data={circuitos} />
            </>
          )}
        </Col>
      </Row>


    </Container>

    <Footer /></>
  );
}

export default CircuitosScreen;
