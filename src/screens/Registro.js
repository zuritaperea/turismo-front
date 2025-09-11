import React, { useEffect, useState, useContext } from 'react';
import Form from '../components/Form';
import Container from "../components/Container"
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Alert from "../components/Alert";
import { Link, useNavigate } from 'react-router-dom';
import registroService from "../axios/services/profile";
import objetoService from "../axios/services/objeto";

import logo from '../assets/img/logomark.png';
import functions from "../extras/functions";
import Turnstile from "react-turnstile";

import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import Separador from '../components/Separador';
import Splash from '../components/Splash';


const Registro = () => {
  const [logoLogin, setLogoLogin] = useState(logo);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState("");
  const [paises, setPaises] = useState([]);
  const [constantes, setConstantes] = useState({
    tipo_documento: [],
    genero: [],
  });
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const [datosUsuario, setDatosUsuario] = useState({
    email: '',
    password: '',
    usuario: '',
    password_2: '',
    telefono: '',
    nombre: '',
    apellido: '',
    documento_identidad: '',
    tipo_documento: '',
    nacionalidad: '',
    company: '',
    position: ''
  });
  const [error, setError] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración

  const agregarOpcionVacia = (items, label = "Seleccione...") => [
    { value: "", label },
    ...(Array.isArray(items) ? items : []),
  ];

  const procesarConstantes = (data) => {
    const resultado = {};
    for (const key in data) {
      const value = data[key];
      resultado[key] = Array.isArray(value) ? agregarOpcionVacia(value) : value;
    }
    return resultado;
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDatosUsuario({
      ...datosUsuario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Por favor, completa el captcha.");
      return;
    }
    // Realiza validación de los datos
    if (datosUsuario.password === datosUsuario.password_2) {
      if (
        datosUsuario.email &&
        datosUsuario.password && datosUsuario.documento_identidad
      ) {
        try {
          registroService
            .registro(datosUsuario)
            .then((response) => {
              setMensaje(
                <span>
                  Su registro se ha realizado exitosamente,
                  <Alert.Link href="/login"> a continuación Ingresá con tus datos de acceso</Alert.Link>
                </span>
              );
              setError([]);
              setRegistroExitoso(true);
            }
            )
            .catch((error) => {
              if (error) {
                setMensaje(null);
                if (error?.response?.data) {
                  let errorResponse = functions.errorMaker(error?.response?.data);
                  setError(errorResponse);
                }
                else
                  setError([String(error)]);
              }
            });
        } catch (error) {
          // En caso de error al guardar los datos, muestra el mensaje de error
          setError(['No se pudo realizar el registro']);
        }
      } else {
        // Si falta algún dato, muestra un error
        setError(['Debe completar los campos obligatorios (*)']);
      }
    } else {
      // Si falta algún dato, muestra un error
      setError(['Las contraseñas no son iguales']);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [resConstantes, resPaises] = await Promise.all([
          objetoService.obtenerConstantes(),
          registroService.getPaises(),
        ]);
        setConstantes(procesarConstantes(resConstantes.data.data));
        setPaises(agregarOpcionVacia(
          resPaises.data.data.map((s) => ({ value: s.id, label: s.attributes.nombre }))
        ));
      } catch (error) {
        console.error("Error obteniendo datos de API", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (registroExitoso) {
      console.log(registroExitoso)
      // Si el registro fue exitoso, redirige a la siguiente pantalla
      setTimeout(function () {
        navigate("/login");
      }, 10000);//5000
    }
  }, [registroExitoso, navigate]);



  useEffect(() => {
    if (config) { // Verifica que config no sea null
      setLogoLogin(config.logo || logo);
    }
  }, [config]); // El useEffect se ejecuta cada vez que config cambia

  if (loading) {
    return <Splash />;
  }

  return (
    <>
      <Container className='md:w-6/12 w-full'>
        <Row className="m-b-2 text-center sm:mt-10 mt-6">
          <Col>
            <div>
              <img className="logo m-auto" src={logoLogin} alt="Logo" loading="lazy" />
            </div>
            <h1 className="text-2xl font-bold">Creá a tu cuenta</h1>
            <h4 className="text-sm">Por favor completá estos datos para continuar.</h4>
          </Col>
        </Row>


        <Row className="destination-box mb-2">
          <Col md={{ span: 6, offset: 3 }}>
            {error?.length > 0 && (
              <Alert variant="danger">
                <ul>
                  {error.map((err, index) => (
                    <li key={index}>{err.description || err}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <h1 className='text-xl font-bold my-4'>Datos personales</h1>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={datosUsuario.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="apellido">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={datosUsuario.apellido}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="tipo_documento">
                <Form.Label>Tipo Documento *</Form.Label>
                <Form.Select
                  name="tipo_documento"
                  value={datosUsuario.tipo_documento}
                  onChange={handleInputChange}
                  required
                  options={constantes.tipo_documento}
                />
              </Form.Group>
              <Form.Group controlId="documento_identidad">
                <Form.Label>Número de Documento *</Form.Label>
                <Form.Control
                  type="number"
                  name="documento_identidad"
                  value={datosUsuario.documento_identidad}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={datosUsuario.telefono}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="nacionalidad">
                <Form.Label>Nacionalidad *</Form.Label>
                <Form.Select
                  name="nacionalidad"
                  value={datosUsuario.nacionalidad}
                  onChange={handleInputChange}
                  required
                  options={paises}
                />
              </Form.Group>
              <Form.Group controlId="company">
                <Form.Label>Empresa u Organización</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={datosUsuario.company}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="position">
                <Form.Label>Cargo / Posición</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={datosUsuario.position}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <h1 className='text-xl font-bold my-4'>Datos de acesso</h1>

              <Form.Group controlId="email">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={datosUsuario.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>


              <Form.Group controlId="password">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  type='password'
                  name="password"
                  value={datosUsuario.password}
                  onChange={handleInputChange}
                  required
                />

              </Form.Group>


              <Form.Group controlId="password_2">
                <Form.Label>Confirmar contraseña *</Form.Label>
                <Form.Control
                  type='password'
                  name="password_2"
                  value={datosUsuario.password_2}
                  onChange={handleInputChange}
                  required
                />

              </Form.Group>


              <Col sm={12}>
                {/* Turnstile */}
                <div className="flex justify-center">
                  <Turnstile
                    sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} // Para Create React App
                    // sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} // Para Vite
                    onVerify={(token) => setToken(token)}
                  /></div>
                <Button variant="primary" className="w-full bg-principal mt-3">
                  Comenzar
                </Button>
              </Col>
            </Form>
            {mensaje && <Alert variant="success">{mensaje}</Alert>}
          </Col>
          <Separador />

        </Row>
        <Row className="destination-box mb-2 text-center">

          <Col>
            <p className="mt-2 ml-2 texto-tarjeta ">
              ¿Ya tienes una cuenta?
              <Link className='color-principal' to="/login/"> Ingresá a tu aquí.</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Registro;
