import React, { useEffect, useState, useContext } from 'react';
import Form from '../components/Form';
import Container from "../components/Container"
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Alert from "../components/Alert";
import { Link, useNavigate } from 'react-router-dom';
import registroService from "../axios/services/profile";
import logo from '../assets/img/logomark.png';
import { v4 as uuidv4 } from 'uuid';
import functions from "../extras/functions";
import Turnstile from "react-turnstile";

import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import Separador from '../components/Separador';

const Registro = () => {
  const [logoLogin, setLogoLogin] = useState(logo);
  const [token, setToken] = useState("");

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
  });
  const [error, setError] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración

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
    // Agregar un UUID único al campo documento_identidad
    // Generar un UUID y tomar solo los primeros 9 caracteres después del prefijo "t-"
    const uuidParcial = uuidv4().replace(/-/g, '').slice(0, 9); // Eliminar guiones y tomar los primeros 9 caracteres
    const documentoIdentidadTemporal = `t-${uuidParcial}`; // Aseguramos que el total no sea mayor a 12 caracteres
    const datosConDocumento = {
      ...datosUsuario,
      documento_identidad: documentoIdentidadTemporal
    };
    // Realiza validación de los datos
    if (datosUsuario.password === datosUsuario.password_2) {
      if (
        datosUsuario.email &&
        datosUsuario.password
      ) {
        try {
          registroService
            .registro(datosConDocumento)
            .then((response) => {
              setMensaje(
                <span>
                  Su registro se ha realizado exitosamente,
                  <Alert.Link href="/perfil"> a continuación podrá completar datos adicionales</Alert.Link>
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

  return (
    <>
      <Container className='md:w-6/12 w-full'>
        <Row className="m-b-2 text-center sm:mt-10 mt-6">
          <Col>
            <div>
              <img className="logo m-auto" src={logoLogin} alt="Logo" />
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

              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={datosUsuario.telefono}
                  onChange={handleInputChange}
                />
              </Form.Group>

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
