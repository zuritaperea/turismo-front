import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Image, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import service from '../axios/services/circuito';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import "bootstrap/js/src/collapse.js";
import CustomAccordion from '../components/CustomAccordion';
import favoritoService from '../axios/services/favorito_visitado';
import ImageCarousel from '../components/ImageCarousel';

function CircuitoScreen() {
  const { id, fechadesde, fechahasta } = useParams();
  const [circuito, setCircuito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const obtenerCircuito = async () => {
      try {
        const response = await service.obtener(id);
        const datosCircuito = {
          ...response.data,
          fechadesde: fechadesde,
          fechahasta: fechahasta,
          tipo: "circuito"
        };
        setCircuito(datosCircuito);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el circuito');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerCircuito(); // Llama a la función para obtener el circuito
  }, [id, fechadesde, fechahasta]);



  const handleFavoriteClick = async () => {
    try {
      let newFavoriteValue = 1; // Valor predeterminado
      if (circuito && circuito.favorito === 1) {
        newFavoriteValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarFavorito({ tipo: 'Circuito', id, favorito: newFavoriteValue })
        .then((response) => {
          setCircuito({ ...circuito, favorito: newFavoriteValue });
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
      if (circuito && circuito.visitado === 1) {
        newVisitedValue = 0; // Si era 1, lo cambiamos a 0
      }
      await favoritoService.agregarVisitado({ tipo: 'Circuito', id, visitado: newVisitedValue })
        .then((response) => {
          setCircuito({ ...circuito, visitado: newVisitedValue });
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

  if (!circuito) {
    return null;
  } else return (<>
    <Header />
    <Jumbotron
      name={circuito.nombre}
      description={'Circuito'}
      fechadesde={circuito.fechadesde}
      fechahasta={circuito.fechahasta}
      id={circuito.id}
      tipo={circuito.tipo}
      isFavorite={circuito.favorito}
      isVisited={circuito.visitado}
      handleFavoriteClick={handleFavoriteClick}
      handleVisitedClick={handleVisitedClick}
    />
    <Container className="boxed p-2">

      <Row>
        <Col>
          <Row className="destination-box mb-2">
            <Col xs={12} md={6}>
              <Image src={circuito.imagenPrincipal} fluid />
            </Col>
            <Col xs={12} md={6}>
              <h1>{circuito.nombre}</h1>
              <p>{circuito.descripcion}</p>
            </Col>
          </Row>
          <ImageCarousel images={circuito.imagenes} />

          <CustomAccordion
            title="Ruta Natural"
            content={circuito.ruta_natural}
          />

          <CustomAccordion
            title="Inicio del circuito"
            content={circuito.inicio_nombre}
          />
          <CustomAccordion
            title="Fin del circuito"
            content={circuito.fin_nombre}
          />

          <CustomAccordion
            title="Tipo de Turismo"
            content={circuito.tipoTurismo}
          />

          <Table bordered hover>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Punto Turístico</th>
                <th>Tipo</th>
                <th>Distancia</th>
                <th>Tiempo hasta el Punto Turístico</th>
              </tr>
            </thead>
            <tbody>
              {circuito?.cirs_ptos?.map(data => {
                return (
                  <React.Fragment key={`section-${data.orden}`}>
                    <tr
                      data-bs-toggle="collapse"
                      href={`#collapse-${data.orden}`}
                      role="button"
                      aria-expanded="false"
                      aria-controls={`collapse-${data.orden}`}
                    >
                      <td>{data.orden}</td>
                      <td>{data.nombre}</td>
                      <td>{data.tipo}</td>
                      <td>{`${data.distancia} Km.`}</td>
                      <td>{`${data.tiempo} Hs.`}</td>
                    </tr>
                    <tr className="collapse" id={`collapse-${data.orden}`}>
                      <td className="nolink" colSpan={5}>
                        <Row className="destination-box mb-2">
                          <Col xs={12} md={6}>
                            <Image src={data.imagenPrincipal} fluid />
                          </Col>
                          <Col xs={12} md={6}>
                            {data.tipo === "Punto de Interes" ? (
                              <a href={`/puntointeres/${data.id}`}>{data.descripcion}</a>
                            ) : (
                              <a href={`/${data.tipo.toLowerCase()}/${data.id}`}>{data.descripcion}</a>
                            )}
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}



            </tbody>
          </Table>


        </Col>
      </Row>

    </Container>

    <Footer /></>
  );
}

export default CircuitoScreen;
