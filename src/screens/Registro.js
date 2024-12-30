import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import Container from "../components/Container"
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Accordion from '../components/Accordion';
import Alert from "../components/Alert";
import Spinner from "../components/Spinner"
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import registroService from "../axios/services/profile";
import paises from "../extras/paises"

const Registro = () => {
  const [mensaje, setMensaje] = useState(null);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [provincias, guardarProvincias] = useState([]);
  const [provincia, guardarProvincia] = useState(null);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [departamentos, guardarDepartamentos] = useState([]);
  const [departamento, guardarDepartamento] = useState(null);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);
  const [localidades, guardarLocalidades] = useState([]);
  const navigate = useNavigate();

  const [datosUsuario, setDatosUsuario] = useState({
    email: '',
    email2: '',
    usuario: '',
    contrasenia: '',
    fechaNacimiento: '',
    genero: '',
    pais: '',
    localidad: '',
  });
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDatosUsuario({
      ...datosUsuario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Realiza validación de los datos
    if (datosUsuario.email === datosUsuario.email2) {
      if (
        datosUsuario.email &&
        datosUsuario.usuario &&
        datosUsuario.contrasenia
      ) {
        try {
          registroService
            .registro(datosUsuario)
            .then((response) => {
              setMensaje(
                <span>
                  Su registro se ha realizado exitosamente,
                  <Alert.Link href="/login"> a continuación podrá completar datos adicionales</Alert.Link>
                </span>
              );

              setRegistroExitoso(true);
            }
            )
            .catch((error) => {
              if (error) {
                setMensaje(null);
                if (error?.response?.data?.message) {
                  setError(String(error.response.data.message));
                }
                else
                  setError(String(error));
              }
            });
        } catch (error) {
          // En caso de error al guardar los datos, muestra el mensaje de error
          setError('No se pudo realizar el registro');
        }
      } else {
        // Si falta algún dato, muestra un error
        setError('Debe completar los campos obligatorios (*)');
      }
    } else {
      // Si falta algún dato, muestra un error
      setError('Los correos electrónicos no son iguales');
    }
  };

  const toggleMostrarContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  useEffect(() => {
    if (registroExitoso) {
      console.log(registroExitoso)
      // Si el registro fue exitoso, redirige a la siguiente pantalla
      setTimeout(function () {
        navigate("/login");
      }, 5000);
    }
  }, [registroExitoso, navigate]);


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
          console.log(error);
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
          console.log(error);
        });
    };
    if (datosUsuario.pais === 'Argentina') obtenerDepartamentos(); else guardarDepartamentos([])
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
          console.log(error);
        });
    };
    if (datosUsuario.pais === 'Argentina') obtenerLocalidades(); else guardarLocalidades([])
  }, [datosUsuario.pais, departamento]);


  return (
    <>
      <Header />
      <Container className="boxed p-2">

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Row className="destination-box mb-2">
              <h2 class="text-sm font-semibold mt-2 color-principal">
                Creá tu cuenta</h2>
              <Row className="destination-box mb-2">
                <p class="mt-2 ml-2 texto-tarjeta">
                  Por favor completá estos datos para continuar.</p>
              </Row>                <Row className="destination-box mb-2">
                <p class="mt-2 ml-2 texto-tarjeta">

                  <a href="/login/">Si ya estás registrado, ingresá a tu cuenta.</a>
                </p></Row>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>

                <h1 class="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Usuario</h1>
                <Form.Group controlId="email">
                  <Form.Label>Correo Electrónico *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={datosUsuario.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email2">
                  <Form.Label>Confirmar Correo Electrónico *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email2"
                    value={datosUsuario.email2}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="usuario">
                  <Form.Label>Usuario *</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={datosUsuario.usuario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="contraseña">
                  <Form.Label>Creá una contraseña *</Form.Label>
                  <Form.Control
                    type={mostrarContrasenia ? 'text' : 'password'}
                    name="contrasenia"
                    value={datosUsuario.contrasenia}
                    onChange={handleInputChange}
                    required
                  />

                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label={mostrarContrasenia ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
                  onChange={toggleMostrarContrasenia}
                />

                <h1 class="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Perfil de turista</h1>

                <Form.Group controlId="fechaNacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={datosUsuario.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="género">
                  <Form.Label>Género</Form.Label>
                  <Form.Control
                    as="select"
                    name="genero"
                    value={datosUsuario.genero}
                    onChange={handleInputChange}

                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </Form.Control>
                </Form.Group>

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


                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" className="mt-3" disabled={registroExitoso}>
                    Crear Usuario
                  </Button></div>

                <section className="bg-gray modulo-mapaestado p-2">

                  <legend>
                    <h5>Términos y condiciones</h5>
                  </legend>
                  <p>Para crear tu cuenta es necesario que aceptes los <a href="/terminos-y-condiciones" target="_blank">Términos y condiciones generales</a> de la plataforma</p>
                  <Form.Check
                    type="checkbox"
                    id="terminos"
                    label="Acepto términos y condiciones generales."
                    feedback="Debes aceptar los Términos y condiciones generales antes de continuar."
                    feedbackType="invalid"
                    required
                  />
                </section>

              </Form>
              {mensaje && <Alert variant="success">{mensaje}</Alert>}
            </Row></Col></Row></Container>
      <Footer />
    </>
  );
};

export default Registro;
