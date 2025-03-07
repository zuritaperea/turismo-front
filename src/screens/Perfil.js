import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import Container from "../components/Container"
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner"
import Modal from '../components/Modal';

import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import registroService from "../axios/services/profile";
import paises from "../extras/paises"

const Perfil = () => {
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
    usuario: '',
    contrasenia: '',
    contrasenia2: '',
    fechaNacimiento: '',
    genero: '',
    pais: '',
    localidad: '',
    acepta: '',
    tipoDocumento: '',
    numeroDocumento: '',
    nombre: '',
    apellido: '',
    numeroCelular: '',
    codigoPostal: '',
    calle: '',
    numero: '',
    barrio: '',
    localidad2: '',
    ocupacion: '',
    pais2: ''

  });
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [mostrarContrasenia2, setMostrarContrasenia2] = useState(false);

  const [perfilCargado, setPerfilCargado] = useState(false);

  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    if (datosUsuario.contrasenia === datosUsuario.contrasenia2) {
      if (
        datosUsuario.usuario
      ) {
        try {
          registroService
            .editarPerfil(datosUsuario)
            .then((response) => {
              const storedData = JSON.parse(localStorage.getItem('user'));

              if (storedData) {
                storedData.user.name = datosUsuario?.usuario;
              }
    
              localStorage.setItem('user', JSON.stringify(storedData));
              setMensaje(
                "Se actualizó correctamente su perfil"
              );
              
              setRegistroExitoso(true);
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
          setError('No se pudo realizar el registro');
        }
      } else {
        // Si falta algún dato, muestra un error
        setError('Complete los campos obligatorios');
      }
    }
    else {
      // Si falta algún dato, muestra un error
      setError('Las contraseñas no son iguales');
    }
  };

  const toggleMostrarContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  const toggleMostrarContrasenia2 = () => {
    setMostrarContrasenia2(!mostrarContrasenia2);
  };

  const eliminarCuenta = async () => {
    try {
      await registroService.eliminarCuenta();
      navigate('/logout');
    } catch (error) {
      // Manejar el error si la eliminación de la cuenta falla
      console.error('Error al eliminar la cuenta:', error);
    }
  };


  const handleConfirmDelete = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteAccount = () => {
    eliminarCuenta();
    setShowModal(false);
  };


  useEffect(() => {

    const obtenerProfile = () => {
      registroService
        .getProfile()
        .then((response) => {
          const user = response.data?.user;
          const user_data = response.data?.user?.user_data;
          setDatosUsuario(prevState => ({
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
          setPerfilCargado(true);         
        })
        .catch((error) => {
          console.log(error);
        });
    };

    obtenerProfile();
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
          console.log(error);
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


  return (
    <>
      <Header />
      <Container className='md:w-6/12 w-full'>
        <Row className="m-2">
          <Col>
            <Row className="destination-box mb-2">

             <hr className="mb-2"></hr>
              {error && <Alert variant="danger">{error}</Alert>}
              {perfilCargado && (

                <Form onSubmit={handleSubmit}>
                 <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Usuario</h1>
                        <Form.Group controlId="email">
                          <Form.Label>Correo Electrónico *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            disabled={true}
                            value={datosUsuario.email}
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

                        <Form.Group controlId="contrasenia">
                          <Form.Label>Cambiar la contraseña</Form.Label>
                          <Form.Control
                            type={mostrarContrasenia ? 'text' : 'password'}
                            name="contrasenia"
                            value={datosUsuario.contrasenia}
                            onChange={handleInputChange}
                          />

                        </Form.Group>
                        <Form.Check
                          type="checkbox"
                          label={mostrarContrasenia ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
                          onChange={toggleMostrarContrasenia}
                        />
                        <Form.Group controlId="contraseña2">
                          <Form.Label>Confirmar contraseña</Form.Label>
                          <Form.Control
                            type={mostrarContrasenia2 ? 'text' : 'password'}
                            name="contrasenia2"
                            value={datosUsuario.contrasenia2}
                            onChange={handleInputChange}
                          />

                        </Form.Group>
                        <Form.Check
                          type="checkbox"
                          label={mostrarContrasenia2 ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
                          onChange={toggleMostrarContrasenia2}
                        />
                      <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Perfil de Turísta</h1>
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
       
                          <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Datos Personales</h1>
                        <Row>
                          <Form.Group as={Col} md="4" controlId="tipoDocumento">
                            <Form.Label>Tipo de Documento</Form.Label>
                            <Form.Control
                              as="select"
                              name="tipoDocumento"
                              value={datosUsuario.tipoDocumento}
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
                              value={datosUsuario.numeroDocumento}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Row>
                        <Form.Group controlId="nombre">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={datosUsuario.nombre}
                            onChange={handleInputChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="apellido">
                          <Form.Label>Apellido</Form.Label>
                          <Form.Control
                            type="text"
                            name="apellido"
                            value={datosUsuario.apellido}
                            onChange={handleInputChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="numeroCelular">
                          <Form.Label>Número de Celular</Form.Label>
                          <Form.Control
                            type="text"
                            name="numeroCelular"
                            value={datosUsuario.numeroCelular}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  Domicilio</h1>

                        <Form.Group controlId="codigoPostal">
                          <Form.Label>Código Postal</Form.Label>
                          <Form.Control
                            type="text"
                            name="codigoPostal"
                            value={datosUsuario.codigoPostal}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Row>
                          <Form.Group as={Col} md="9" controlId="calle">
                            <Form.Label>Calle</Form.Label>
                            <Form.Control
                              type="text"
                              name="calle"
                              value={datosUsuario.calle}
                              onChange={handleInputChange}
                            />
                          </Form.Group>

                          <Form.Group as={Col} md="3" controlId="numero">
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                              type="number"
                              name="numero"
                              value={datosUsuario.numero}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Row>
                        <Form.Group controlId="barrio">
                          <Form.Label>Barrio</Form.Label>
                          <Form.Control
                            type="text"
                            name="barrio"
                            value={datosUsuario.barrio}
                            onChange={handleInputChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="ocupacion">
                          <Form.Label>Ocupación</Form.Label>
                          <Form.Control
                            type="text"
                            name="ocupacion"
                            value={datosUsuario.ocupacion}
                            onChange={handleInputChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="pais2">
                          <Form.Label>País de Nacimiento</Form.Label>
                          <Form.Select
                            name="pais2"
                            value={datosUsuario.pais2}
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
                        <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
                          Volver
                        </Button></div>
                    </Col></Row>

                  <Button variant="danger" onClick={handleConfirmDelete} className="mt-3">
                    ¿Querés borrar tu cuenta?
                  </Button>

                  <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Eliminar Cuenta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      ¿Estás seguro de que quieres eliminar tu cuenta?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                      </Button>
                      <Button variant="danger" onClick={handleDeleteAccount}>
                        Eliminar Cuenta
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Form>)}
              {mensaje && <Alert variant="success">{mensaje}</Alert>}


            </Row>
          </Col></Row></Container>
      <Footer />
    </>
  );
};

export default Perfil;
