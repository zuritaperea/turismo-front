import React, { useEffect, useState } from 'react';
import { Container,  Alert } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faHeart } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import service from '../axios/services/favorito_visitado';
import { useNavigate } from "react-router-dom";

function FavoritoScreen() {
  const [favoritos, setFavoritos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const irAFavoritos = () => {
    navigate('/favoritos');
  };
  const irAVisitados = () => {
    navigate('/visitados');
  };
  
  useEffect(() => {
    const obtenerFavoritos = async () => {
      try {
        const response = await service.obtenerFavoritos();
        const favoritosUnicos = response?.data?.favoritos;
        setFavoritos(favoritosUnicos);
        setLoading(false);
      } catch (error) {
        setError('Hubo un error al cargar los favoritos');
        setLoading(false);
      }
    };

    obtenerFavoritos();
  }, []);

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

  if (!favoritos) {
    return null;
  }

  return (
    <>
      <Header />
      <Jumbotron name="Mis Favoritos"       handleFavoriteClick={irAFavoritos}
      handleVisitedClick={irAVisitados} />
      <Container className="p-2">
        {favoritos?.map((data, index) => (
          <Alert key={index} variant="secondary" >
            <div className="image-container nolink d-flex justify-content-between">
              <a href={data.tipo === "PuntoInteres" ? `/puntointeres/${data.id}` : `/${data.tipo.toLowerCase()}/${data.id}`}>
                <img src={data.imagenPrincipal} alt={data.nombre} className="small-image" />
              </a>
              <a className="p-2 flex-grow-1" href={data.tipo === "PuntoInteres" ? `/puntointeres/${data.id}` : `/${data.tipo.toLowerCase()}/${data.id}`}>
                {data.nombre}
              </a>
              <a href={data.tipo === "PuntoInteres" ? `/puntointeres/${data.id}` : `/${data.tipo.toLowerCase()}/${data.id}`}>
                <FontAwesomeIcon icon={faHeart} className="heart-icon" />
              </a>
            </div>
          </Alert>
        ))}
      </Container>
      <Footer />
    </>
  );
}

export default FavoritoScreen;
