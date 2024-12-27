import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Image, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import service from '../axios/services/alojamiento';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from '../components/Jumbotron';
import "bootstrap/js/src/collapse.js";
import CustomAccordion from '../components/CustomAccordion';
import ImageCarousel from '../components/ImageCarousel';
import Redes from '../components/Redes';

function AlojamientoScreen() {
  const { id } = useParams();
  const [alojamiento, setAlojamiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const obtenerAlojamiento = async () => {
      try {
        const response = await service.obtener(id);
        setAlojamiento(response.data);
        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar el alojamiento');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerAlojamiento(); // Llama a la función para obtener el alojamiento
  }, [id]);


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
      name={alojamiento.Nombre}
    />
    <Container className="boxed p-2">
      <Row>
        <Col>
          <Row className="destination-box">
            <Redes latitud={alojamiento.Lat} longitud={alojamiento.Lon}
              facebook={alojamiento?.facebook}
              instagram={alojamiento?.instagram}
              whatsapp={alojamiento?.whatsapp}
              email={alojamiento?.Email}
              telefono={alojamiento?.Tel} />

          </Row>
          <CustomAccordion
            title="CUIT"
            content={alojamiento.CUIT}
          />
          <CustomAccordion
            title="Razón Social"
            content={alojamiento.RazonSocial}
          />
          <CustomAccordion
            title="Cadena Hotelera"
            content={alojamiento.CadenaHotelera}
          />
          <CustomAccordion
            title="Marca de Cadena"
            content={alojamiento.MarcaCadena}
          />
          <CustomAccordion
            title="Área Natural Protegida"
            content={alojamiento.AreaNaturalProtegida}
          />

          <CustomAccordion
            title="Provincia"
            content={alojamiento.Provincia}
          />

          <CustomAccordion
            title="Departamento / Partido"
            content={alojamiento.DeptPart}
          />

          <CustomAccordion
            title="Localidad"
            content={alojamiento.Localidad}
          />


          <CustomAccordion
            title="Barrio"
            content={alojamiento.Barrio}
          />

          <CustomAccordion
            title="Dirección"
            content={`${alojamiento.Calle} ${alojamiento.Numero}`}
          />
          <CustomAccordion
            title="Ubicación"
            content={alojamiento.Ubicacion}
          />
          <CustomAccordion
            title="Tipo"
            content={alojamiento.Tipo}
          />
          <CustomAccordion
            title="Tipo de Vía"
            content={alojamiento.TipoVia}
          />
          <CustomAccordion
            title="Clasificación Organismo"
            content={alojamiento.ClasificacionOrganismo}
          />
          <CustomAccordion
            title="Clasificación MinTur"
            content={alojamiento.ClasificacionMinTur}
          />
          <CustomAccordion
            title="Categoría Urbanística"
            content={alojamiento.CatUrbanismo}
          />
          <CustomAccordion
            title="Estado del Establecimiento"
            content={alojamiento.EstadoEstablecimiento}
          />
          <CustomAccordion
            title="Página Web"
            content={<a href={alojamiento.PagWeb} target="_blank" rel="noopener noreferrer">Visitar Sitio Web</a>}
          />
          <CustomAccordion
            title="Número de Empleados"
            content={alojamiento.NumEmpleados}
          />
          <CustomAccordion
            title="Cantidad de Unidades"
            content={alojamiento.Unidades}
          />
          <CustomAccordion
            title="Cantidad de Habitaciones"
            content={alojamiento.Habitaciones}
          />
          <CustomAccordion
            title="Cantidad de Plazas"
            content={alojamiento.Plazas}
          />
          <CustomAccordion
            title="Inscripción Registro Provincial"
            content={alojamiento.InscRegProvincial}
          />
          <CustomAccordion
            title="Inscripción Registro Municipal"
            content={alojamiento.InscRegMunicipal}
          />
          <CustomAccordion
            title="Año de Apertura"
            content={alojamiento.AnoApertura}
          />
          <CustomAccordion
            title="Mes de Apertura"
            content={alojamiento.MesApertura}
          />
          <CustomAccordion
            title="Año de Cierre"
            content={alojamiento.AnoCierre}
          />
          <CustomAccordion
            title="Mes de Cierre"
            content={alojamiento.MesCierre}
          />
          <CustomAccordion
            title="Comentarios"
            content={alojamiento.Comentarios}
          />

        </Col>
      </Row>

    </Container>

    <Footer /></>
  );
}

export default AlojamientoScreen;
