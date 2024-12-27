import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import CustomAccordion from '../components/CustomAccordion';
import Redes from '../components/Redes';
import service from '../axios/services/oficina_atencion';
import canalService from '../axios/services/contacto_canales';
import destinoService from '../axios/services/destino';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';

function InfoScreen() {
  const { id } = useParams();

  const [oficina, setOficina] = useState(null);
  const [canal, setCanal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destino, setDestino] = useState(null);


  useEffect(() => {
    const obtenerDestino = async () => {
      try {
        const response = await destinoService.obtener(id);
        const datosDestino = {
          ...response.data
        };
        setDestino(datosDestino);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el destino');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    const obtenerOficina = async () => {
      try {
        const response = await service.obtenerDestino(id);

        if (response.data.length > 0) {
          const datos = response.data[0];
          console.log('datos: ', datos);
          setOficina(datos);
        } else {
          setOficina(null);
        }
        console.log('oficina: ', oficina);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar la oficina');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };
    obtenerDestino();
    obtenerOficina(); // Llama a la función para obtener el atractivo
  }, [id]);


  useEffect(() => {
    const obtenerCanales = async () => {
      try {
        if (oficina) {
          const response = await canalService.obtenerContactoCanalOficina(oficina.id);
          if (response.data.length > 0) {
            const primerCanal = response.data[0];
            setCanal(primerCanal); // Establecer el primer canal obtenido en el estado
          } else {
            // No se encontraron canales, devolver un valor predeterminado
            setCanal(null); // O establecer algún otro valor predeterminado según tu caso
          }
        }
      } catch (error) {
        // Manejar errores
        console.error("Error al obtener los canales:", error);
        setCanal(null); // O establecer algún otro valor predeterminado según tu caso
      }
    };
    obtenerCanales();
  }, [oficina]);

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


  return (<>
    <Header />
    <Jumbotron
      name='Información Útil'
    />
    <Container className="mt-2">
      <CustomAccordion
        title="¿Cómo Llego?"
        content={destino?.comoLlego}
      />

      <CustomAccordion
        title="Oficina de Atención"
        content={<>
          <Redes latitud={oficina?.Latitud} longitud={oficina?.Longitud}
            facebook={canal?.facebook}
            instagram={canal?.instagram}
            whatsapp={canal?.whatsapp}
            email={canal?.email}
            telefono={canal?.telefono} />
          <p>{oficina?.nombre}</p>
          <p>{`${oficina?.calle} ${oficina?.numero}`}</p>
          <p>{oficina?.lineaAdicional}</p>
          <p>{`${oficina?.localidad}, ${oficina?.departamento}, ${oficina?.provincia}`}</p>
          {oficina?.paginaWeb && <p><a href={oficina.paginaWeb}>Página web: {oficina.paginaWeb}</a></p>}
        </>}
      />


    </Container>

    <Footer /></>
  );
}

export default InfoScreen;
