import React, { useState, useEffect } from 'react';
import Container from "../components/Container"
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Accordion from '../components/Accordion';
import Alert from "../components/Alert";
import Form from '../components/Form';
import Header from "../components/Header";
import Footer from "../components/Footer";
import registroService from "../axios/services/profile";
import paises from "../extras/paises"

function DatosAdicionales() {
  const [mensaje, setMensaje] = useState(null);

  const [datosAdicionales, setDatosAdicionales] = useState({
    tipoDocumento: '',
    numeroDocumento: '',
    nombre: '',
    apellido: '',
    numeroCelular: '',
    codigoPostal: '',
    calle: '',
    numero: '',
    barrio: '',
    ocupacion: '',
    pais: ''
  });
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDatosAdicionales({ ...datosAdicionales, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías enviar los datos al backend para su procesamiento
    // y realizar otras acciones necesarias.
    try {
      registroService
        .registroDatosAdicionales(datosAdicionales)
        .then((response) => {
          setMensaje(
            "Se actualizó la información de su perfil."
          );
          setRegistroExitoso(true);
          localStorage.setItem('datosCompletados', 'true');

        }
        )
        .catch((error) => {
          if (error) {
            setMensaje(null);
            setError(String(error));
          }
        });
    } catch (error) {
      // En caso de error al guardar los datos, muestra el mensaje de error
      setError('No se pudo realizar la actualización de datos');
    }
  };


  useEffect(() => {

    const obtenerProfile = () => {
      registroService
        .getProfile()
        .then((response) => {
          const user = response.data?.user;
          const user_data = response.data?.user?.user_data;
          setDatosAdicionales(prevState => ({
            ...prevState,
            email: user?.email || '',
            usuario: user?.name || '',
            fechaNacimiento: user_data?.fechaNac || '',
            genero: user_data?.genero || '',
            pais: user_data?.pais || '',
            localidad: user_data?.localidad || '',
            tipoDocumento: user_data?.tipoDoc || '',
            numeroDocumento: user_data?.numDoc || '',
            nombre: user_data?.nombre || '',
            apellido: user_data?.apellido || '',
            numeroCelular: user_data?.telefono || '',
            codigoPostal: user_data?.CP || '',
            calle: user_data?.calle || '',
            numero: user_data?.numero || '',
            barrio: user_data?.barrio || '',
            ocupacion: user_data?.ocupacion || '',
            pais2: user_data?.nacionalidad || '',
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    obtenerProfile();
  }, []);


  return (
    <>
      <Header />          <Container className='md:w-6/12 w-full'>
        <Row className="m-2">
          <Col>
            <Row className="destination-box mb-2">
              <h2 class="text-sm font-semibold mt-2 color-principal">
                  Completar datos adicionales</h2>
              </Row>
              <Row className="destination-box mb-2">

              
              <Form onSubmit={handleSubmit}>
                {/* Campos para los datos adicionales */}
                <h1 class="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Datos Personales</h1>
                <Row>
                  <Form.Group as={Col} md="4" controlId="tipoDocumento">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Control
                      as="select"
                      name="tipoDocumento"
                      value={datosAdicionales.tipoDocumento}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar</option>
                      <option value="DNI">DNI</option>
                      <option value="NIE">NIE</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Otro">Otro</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} md="8" controlId="numeroDocumento">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      type="number"
                      name="numeroDocumento"
                      value={datosAdicionales.numeroDocumento}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Row>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={datosAdicionales.nombre}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={datosAdicionales.apellido}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="numeroCelular">
                  <Form.Label>Número de Celular</Form.Label>
                  <Form.Control
                    type="text"
                    name="numeroCelular"
                    value={datosAdicionales.numeroCelular}
                    onChange={handleInputChange}
                  />
                </Form.Group>


                <h1 class="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Domicilio</h1>
                <Row>
                  <Form.Group as={Col} md="9" controlId="calle">
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                      type="text"
                      name="calle"
                      value={datosAdicionales.calle}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="numero">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="number"
                      name="numero"
                      value={datosAdicionales.numero}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Row>
                <Form.Group controlId="barrio">
                  <Form.Label>Barrio</Form.Label>
                  <Form.Control
                    type="text"
                    name="barrio"
                    value={datosAdicionales.barrio}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="codigoPostal">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigoPostal"
                    value={datosAdicionales.codigoPostal}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="ocupacion">
                  <Form.Label>Ocupación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ocupacion"
                    value={datosAdicionales.ocupacion}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="pais">
                  <Form.Label>País de Nacimiento</Form.Label>
                  <Form.Select
                    name="pais"
                    value={datosAdicionales.pais}
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
              
          <Row><Col>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="mt-3" disabled={registroExitoso}>
                Actualizar
              </Button></div></Col>
            <Col>
              <div className="d-grid gap-2">
                <Button variant="secondary" href="/" className="mt-3">
                  Volver
                </Button></div>
            </Col></Row>
        </Form>
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

      </Row></Col ></Row ></Container > <Footer />
    </>
  );
}

export default DatosAdicionales;
