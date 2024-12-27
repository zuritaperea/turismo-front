import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/atractivo';
import ContentSection from '../components/ContentSection';
import { useParams } from 'react-router-dom';

function AtractivosNatural() {
  const [error, setError] = useState(null);
  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);
  const { id } = useParams();

  useEffect(() => {


    const obtenerAtractivos = async () => {
      try {
          let response;
          if (id !== undefined && id !== null) {
            response = await service.obtenerNaturalDestino(id);
          } else {
            response = await service.obtenerTodosNatural();
          }
        const atracciones = response.data.map((atractivo) => {
          let toPath = `/atractivo/${atractivo.id}`;
          return {
            to: toPath,
            imgSrc: atractivo.imagenPrincipal,
            alt: atractivo.nombre,
            title: atractivo.nombre,
          };
        });
        setNaturalAttractions(atracciones);
        setLoadingAtractivos(false);
      } catch (error) {
        setLoadingAtractivos(false);
      }
    };

    obtenerAtractivos();
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
      name="Atractivos Naturales"
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          {loadingAtractivos ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <ContentSection data={naturalAttractions} />
            </>
          )}
        </Col>
      </Row>


    </Container>

    <Footer /></>
  );
}

export default AtractivosNatural;
