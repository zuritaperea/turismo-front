import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/puntoInteres';
import ContentSection from '../components/ContentSection';
import { useParams } from 'react-router-dom';

function PuntosInteres() {
  const [puntointeress, setPuntosInteres] = useState([]);
  const [loadingPuntosInteres, setLoadingPuntosInteres] = useState(true);
  const { id } = useParams();

  useEffect(() => {


    const obtenerPuntosInteres = async () => {
      try {
          let response;
          if (id !== undefined && id !== null) {
            response = await service.obtenerDestino(id);
          } else {
            response = await service.obtenerTodos();
          }
        const puntos = response.data.map((puntointeres) => {
          let toPath = `/puntointeres/${puntointeres.id}`;
          return {
            to: toPath,
            imgSrc: puntointeres.imagenPrincipal,
            alt: puntointeres.nombre,
            title: puntointeres.nombre,
          };
        });
        setPuntosInteres(puntos);
        setLoadingPuntosInteres(false);
      } catch (error) {
        setLoadingPuntosInteres(false);
      }
    };

    obtenerPuntosInteres();
  }, [id]);



  return (<>
    <Header />
    <Jumbotron
      name="Puntos de Interés"
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          {loadingPuntosInteres ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <ContentSection data={puntointeress} />
            </>
          )}
        </Col>
      </Row>


    </Container>

    <Footer /></>
  );
}

export default PuntosInteres;
