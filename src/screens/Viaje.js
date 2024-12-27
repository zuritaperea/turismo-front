import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/profile';
import { useNavigate } from "react-router-dom";

function getFormattedDate(date) {
  var initial = date.split(/-/);
  return [initial[1], initial[2], initial[0]].join('/');
}

function getFormattedDateDMY(date) {
  var initial = date.split(/-/);
  return [initial[2], initial[1], initial[0]].join('/');
}

function ViajeScreen() {
  const [viajes, setViajes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerViajes = async () => {
      try {
        const response = await service.getViajes();
        const datosPuntoInteres = response?.data?.viajes;

        const quitarId = (objeto) => {
          const { id, created_at, updated_at, ...resto } = objeto;
          return resto;
        };

        const datosSinId = datosPuntoInteres.map(quitarId);

        const viajesUnicos = Array.from(new Set(datosSinId.map(JSON.stringify))).map(JSON.parse);
        setViajes(viajesUnicos);

        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar los viajes');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerViajes(); // Llama a la función para obtener el viajes
  }, []);
  const irAFavoritos = () => {
    navigate('/favoritos');
  };
  const irAVisitados = () => {
    navigate('/visitados');
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

  if (!viajes) {
    return null;
  }

  return (<>
    <Header />
    <Jumbotron
      name="Viajes consultados"
      handleFavoriteClick={irAFavoritos}
      handleVisitedClick={irAVisitados}

    />
    <Container className="boxed p-2">

      <Row>
        <Col>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Fecha de Consulta</th>
                <th>Filtros</th>
              </tr>
            </thead>
            <tbody>
              {viajes?.map((data, index) => {
                return (
                  <tr key={index}>
                    <td className="nolink">
                      <a href={`/destino/${data.destino?.id}`}>{data.destino?.nombre}</a>
                    </td>
                    <td>{data.fechaInicio ? getFormattedDateDMY(data.fechaInicio) : ''}</td>
                    <td>{data.fechaFin ? getFormattedDateDMY(data.fechaFin) : ''}</td>
                    <td>{getFormattedDate(data.fechaOperacion)}</td>
                    <td>{data.filtros ? data.filtros : ''}</td>
                  </tr>

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

export default ViajeScreen;
