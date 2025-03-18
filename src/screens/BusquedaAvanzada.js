import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Col, Row, Alert, Accordion, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Jumbotron from '../components/Jumbotron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';
import registroService from "../axios/services/profile";
import tiposTurismoService from "../axios/services/tipo_turismo";

import paises from "../extras/paises"

// Opciones de filtro
const composicion_grupo = ['Familia', 'Amigos', 'Pareja', 'Viajero Solitario'
]
const preferencias = [

  'Mayores de 60 años',
  'Con vehículo',
  'Contingente',
  'Observación de aves',
  'Aventura',
  'Astronómico',
  'Paleontológico',
  'Cultural',
  'Natural urbano',
  'Eventos',
  'Bienestar y salud',
  'Pesca',
  'Religioso',
  'Ocio',
  'Trabajo y negocios',
  'Académico y educativo',
  'Visita a familiares o amigos',
  'Salud',
];

const rangos_edad = [
  'Primera infancia (0-5 años)',
  'Infancia (6-11 años)',
  'Adolescencia (12-18 años)',
  'Juventud (19-26 años)',
  'Adultez (27-59 años)',
  'Vejez (60 años y más)'
];


function BusquedaAvanzada() {

  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [provincias, guardarProvincias] = useState([]);
  const [provincia, guardarProvincia] = useState(null);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [departamentos, guardarDepartamentos] = useState([]);
  const [departamento, guardarDepartamento] = useState(null);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);
  const [localidades, guardarLocalidades] = useState([]);
  const [tiposTurismo, setTiposTurismo] = useState([]);
  const [loadingTiposTurismo, setLoadingTiposTurismo] = useState(false);

  const [selectedFiltersComposicion, setSelectedFiltersComposicion] = useState([]);
  const [selectedFiltersPreferencias, setSelectedFiltersPreferencias] = useState([]);
  const [selectedFiltersTipoTurismo, setSelectedFiltersTipoTurismo ] = useState([]);
  const [selectedFiltersRango, setSelectedFiltersRango] = useState([]);


  const { id, tipo, nombre, fechadesde, fechahasta } = useParams();
  const navigate = useNavigate();
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState({
    pais: '',
    localidad: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDatosUsuario({
      ...datosUsuario,
      [name]: value
    });
  };

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setPersonaDenominacion(item.user.name);
    }
  }, []);


  useEffect(() => {
    const obtenerProvincias = () => {
      setLoadingProvincias(true);
      guardarProvincias([]);
      registroService
        .getProvincias()
        .then((response) => {
          const provinciasData = response.data.provincia; // Accede a la clave 'provincia' en la respuesta

          const mappedProvincias = provinciasData.map((item) => ({
            id: item.id,
            nombre: item.nombre,
          }));

          guardarProvincias(mappedProvincias);
          setLoadingProvincias(false);
        })
        .catch((error) => {
          setLoadingProvincias(false);
        });
    };
    if (datosUsuario.pais === 'Argentina') obtenerProvincias(); else {
      guardarProvincias([]);
      guardarDepartamentos([]);
      guardarLocalidades([])
    }
  }, [datosUsuario.pais]);

  useEffect(() => {
    const obtenerDepartamentos = () => {
      setLoadingDepartamentos(true);
      guardarDepartamentos([]);
      registroService
        .getDepartamentos(provincia)
        .then((response) => {
          const departamentosData = response.data;
          const mappedDepartamentos = Object.keys(departamentosData).map((key) => ({
            id: departamentosData[key].id,
            nombre: departamentosData[key].nombre,
          }));
          guardarDepartamentos(mappedDepartamentos);
          setLoadingDepartamentos(false);
        })
        .catch((error) => {
          setLoadingDepartamentos(false);
        });
    };
    if (datosUsuario.pais === 'Argentina' && provincia) obtenerDepartamentos(); else guardarDepartamentos([])
  }, [datosUsuario.pais, provincia]);


  useEffect(() => {
    const obtenerLocalidades = () => {
      setLoadingLocalidades(true);
      guardarLocalidades([]);
      registroService
        .getLocalidades(departamento)
        .then((response) => {
          const localidadesData = response.data;
          const mappedLocalidades = Object.keys(localidadesData).map((key) => ({
            id: localidadesData[key].id,
            nombre: localidadesData[key].nombre,
          }));
          guardarLocalidades(mappedLocalidades);
          setLoadingLocalidades(false);
        })
        .catch((error) => {
          setLoadingLocalidades(false);
        });
    };
    if (datosUsuario.pais === 'Argentina' && departamento) obtenerLocalidades(); else guardarLocalidades([])
  }, [datosUsuario.pais, departamento]);
  useEffect(() => {
    if (datosUsuario.localidad && datosUsuario.localidad !== '') {
      registroService
        .getLocalidad(datosUsuario.localidad)
        .then((response) => {
          const localidadInfo = response.data; // Accediendo a la propiedad .data de la respuesta

          // Iterar sobre las claves del objeto para obtener la información de la localidad
          Object.keys(localidadInfo).forEach((key) => {
            const info = localidadInfo[key];
            // Obtener la información de la localidad si el ID coincide con datosUsuario.localidad
            // Obtener la provincia y el departamento de la información de la localidad
            const provinciaUsuario = info.provincia_id;
            const departamentoUsuario = info.departamento_id;
            // Configurar las provincias y departamentos en el estado
            guardarProvincia(provinciaUsuario);
            guardarDepartamento(departamentoUsuario);

          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [datosUsuario.localidad]);
  useEffect(() => {

    const obtenerTiposTurismo = () => {
      setLoadingTiposTurismo(true);
      setTiposTurismo([]);
      tiposTurismoService
        .obtenerTodos()
        .then((response) => {
          const data = response.data;
          setTiposTurismo(data);
          setLoadingTiposTurismo(false);
        })
        .catch((error) => {
          setLoadingTiposTurismo(false);
        });
    };
    obtenerTiposTurismo();
  }, []);

  const handleBuscarClick = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    // Validar que haya una sugerencia seleccionada y fechas no vacías
    const uuid = uuidv4();
    const viaje = {
      id: uuid,
      destino: nombre,
      fechaDesde: fechadesde,
      fechaHasta: fechahasta,
      filtros: {
        composicion: selectedFiltersComposicion,
        preferencias: selectedFiltersPreferencias,
        tipoTurismo: selectedFiltersTipoTurismo,
        rango: selectedFiltersRango
      }
    };
    localStorage.setItem('viaje', JSON.stringify(viaje));
    
    // Convertir los filtros a cadena JSON para usarlos en la URL
    const filtrosJson = encodeURIComponent(JSON.stringify(viaje.filtros));
    
    // Construir las URLs con los filtros concatenados

    if (fechadesde && fechahasta) {
      navigate(
        `/destino/${id}/${fechadesde}/${fechahasta}/${filtrosJson}`
      );
    } else {
      navigate(
        `/destino/${id}/${filtrosJson}`
      );
    }
  };


  const handleFilterChangeComposicion = (event) => {
    const value = event.target.value;
    const updatedFilters = selectedFiltersComposicion.includes(value)
      ? selectedFiltersComposicion.filter((filter) => filter !== value)
      : [...selectedFiltersComposicion, value];

      setSelectedFiltersComposicion(updatedFilters);
  };

  const handleFilterChangePreferencias = (event) => {
    const value = event.target.value;
    const updatedFilters = selectedFiltersPreferencias.includes(value)
      ? selectedFiltersPreferencias.filter((filter) => filter !== value)
      : [...selectedFiltersPreferencias, value];

      setSelectedFiltersPreferencias(updatedFilters);
  };

  const handleFilterChangeTipoTurismo = (event) => {
    const value = event.target.value;
    const updatedFilters = selectedFiltersTipoTurismo.includes(value)
      ? selectedFiltersTipoTurismo.filter((filter) => filter !== value)
      : [...selectedFiltersTipoTurismo, value];

      setSelectedFiltersTipoTurismo(updatedFilters);
  };

  const handleFilterChangeRango = (event) => {
    const value = event.target.value;
    const updatedFilters = selectedFiltersRango.includes(value)
      ? selectedFiltersRango.filter((filter) => filter !== value)
      : [...selectedFiltersRango, value];

      setSelectedFiltersRango(updatedFilters);
  };

  return (
    <>
      <Header />
      <Jumbotron
        name={nombre}
        fechadesde={fechadesde}
        fechahasta={fechahasta}
      />
      <Container className="boxed p-3">
        {!personaDenominacion ? (
          <Alert variant="light">
            ¿Sabías que al <Alert.Link href="/login">iniciar sesión </Alert.Link>
            puedes guardar tus destinos favoritos y recibir recomendaciones personalizadas?</Alert>
        ) : (
          <Alert variant="light">
            Para mejorar los resultados de tus búsquedas, <Alert.Link href="/perfil">completá  </Alert.Link>
            algunos datos que definan <Alert.Link href="/perfil">tu perfil de turista</Alert.Link>
          </Alert>)}
        <h2>Búsqueda Avanzada:</h2>
        <Row>
          <Col md="6">
            <Form >


              <Accordion defaultActiveKey="0" alwaysOpen>
                <Accordion.Item eventKey="0">


                  <Accordion.Header>Composición del grupo</Accordion.Header>
                  <Accordion.Body>

                    {composicion_grupo.map((option) => (
                      <Form.Check
                        key={option}
                        type="checkbox"
                        id={option}
                        label={option}
                        value={option}
                        checked={selectedFiltersComposicion.includes(option)}
                        onChange={handleFilterChangeComposicion}
                      />
                    ))}
                  </Accordion.Body></Accordion.Item>
                <Accordion.Item eventKey="1">


                  <Accordion.Header>Preferencias de Túrista</Accordion.Header>
                  <Accordion.Body>

                    {preferencias.map((option) => (
                      <Form.Check
                        key={option}
                        type="checkbox"
                        id={option}
                        label={option}
                        value={option}
                        checked={selectedFiltersPreferencias.includes(option)}
                        onChange={handleFilterChangePreferencias}
                      />
                    ))}
                  </Accordion.Body></Accordion.Item>
                <Accordion.Item eventKey="2">


                  <Accordion.Header>Tipo de Turismo</Accordion.Header>
                  <Accordion.Body>

                    {loadingTiposTurismo ? (
                      <Spinner animation="border" role="status" />
                    ) : tiposTurismo.map((option) => (
                      <Form.Check
                        key={option.id}
                        type="checkbox"
                        id={option.id}
                        label={option.nombre}
                        value={option.nombre}
                        checked={selectedFiltersTipoTurismo.includes(option.nombre)}
                        onChange={handleFilterChangeTipoTurismo}
                      />
                    ))}
                  </Accordion.Body></Accordion.Item>
                <Accordion.Item eventKey="3">


                  <Accordion.Header>Origen</Accordion.Header>
                  <Accordion.Body>



                    <Form.Group controlId="paísResidencia">
                      <Form.Label>País de Residencia</Form.Label>
                      <Form.Select
                        name="pais"
                        value={datosUsuario.pais}
                        onChange={handleInputChange}

                      >
                        <option value="">Selecciona un país</option>
                        {paises.map((pais) => (
                          <option key={pais.id} value={pais.nombre}>
                            {pais.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>


                    {loadingProvincias ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <Form.Group controlId="provincia">
                        <Form.Label>Provincia de residencia</Form.Label>
                        <Form.Select
                          name="provincia"
                          value={provincia}
                          onChange={(e) => guardarProvincia(e.target.value)}
                          disabled={datosUsuario.pais !== 'Argentina'}
                        >
                          <option value="">Selecciona una provincia</option>
                          {provincias?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>)}

                    {loadingDepartamentos ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <Form.Group controlId="departamento">
                        <Form.Label>Departamento/Comuna/Partido de residencia</Form.Label>
                        <Form.Select
                          name="departamento"
                          value={departamento}
                          onChange={(e) => guardarDepartamento(e.target.value)}

                          disabled={datosUsuario.pais !== 'Argentina'}
                        >
                          <option value="">Selecciona un Departamento/Comuna/Partido</option>
                          {departamentos?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>)}

                    {loadingLocalidades ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <Form.Group controlId="localidad">
                        <Form.Label>Localidad de residencia</Form.Label>
                        <Form.Select
                          name="localidad"
                          value={datosUsuario.localidad}
                          onChange={handleInputChange}

                          disabled={datosUsuario.pais !== 'Argentina'}
                        >
                          <option value="">Selecciona una localidad</option>
                          {localidades?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>)}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">


                  <Accordion.Header>Rango de edad</Accordion.Header>
                  <Accordion.Body>

                    {rangos_edad.map((option) => (
                      <Form.Check
                        key={option}
                        type="checkbox"
                        id={option}
                        label={option}
                        value={option}
                        checked={selectedFiltersRango.includes(option)}
                        onChange={handleFilterChangeRango}
                      />
                    ))}
                  </Accordion.Body></Accordion.Item></Accordion>
            </Form>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit"
                onClick={handleBuscarClick}>
                <FontAwesomeIcon icon={faSearch} />
                Buscar
              </Button></div>
          </Col>
        </Row>
      </Container>
      <Footer />

    </>
  );
}

export default BusquedaAvanzada;
