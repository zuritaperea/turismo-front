import React, { useState, useContext, useEffect } from 'react';
import Form from '../components/Form';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Row from '../components/Row';
import Col from '../components/Col';
import Container from '../components/Container';
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Turnstile from "react-turnstile";
import functions from '../extras/functions';

import registroService from "../axios/services/profile";
import Separador from '../components/Separador';
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';

const Recupero = () => {
  const [mensaje, setMensaje] = useState(null);
  const [logoLogin, setLogoLogin] = useState(logo);
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración
  const [token, setToken] = useState("");

  const [datosUsuario, setDatosUsuario] = useState({
    email: '',
    email2: ''
  });

  const [alerts, setAlerts] = useState([]);
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
    if (!token) {
      alert("Por favor, completa el captcha.");
      return;
    }
  
    if (datosUsuario.email === datosUsuario.email2) {
      if (datosUsuario.email) {
        try {
          const response = await registroService.recuperarCuenta(datosUsuario.email);
  
          if (response.status === 200) {
            setMensaje(
              "Su contraseña ha sido reseteada, recibirá un correo electrónico con instrucciones"
            );
            setAlerts([]);
            setRegistroExitoso(true);
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
  
          if (error.response) {
            // Manejo de error basado en la respuesta del servidor
            setAlerts(functions.errorMaker(error.response.data));
          } else {
            // Error inesperado
            setAlerts([{"description": "Ocurrió un error inesperado. Intente nuevamente."}]);
          }
        }
      } else {
        setAlerts([{"description": "El correo electrónico es obligatorio"}]);
      }
    } else {
      setAlerts([{"description": "Los correos electrónicos no son iguales"},]);
    }
  };
  

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
            <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
            <h4 className="text-sm">No te preocupes enviaremos un correo electrónico para que la recuperes</h4>
          </Col>
        </Row>

        <Row className="destination-box mb-2 mt-6">
          <Col md={{ span: 6, offset: 3 }}>

            <ErrorAlerts alerts={alerts} />
            {mensaje && <Alert variant="success">{mensaje}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={datosUsuario.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Colocá aquí tu email"

                />
              </Form.Group>
              <Form.Group controlId="email2">
                <Form.Label>Confirmar Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email2"
                  value={datosUsuario.email2}
                  onChange={handleInputChange}
                  required
                  placeholder="Colocá aquí tu email"

                />
              </Form.Group>


              <Row>
                <Col sm={3}>
                  {/* Turnstile */}
                  <div className="flex justify-center">
                    <Turnstile
                      sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} // Para Create React App
                      // sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} // Para Vite
                      onVerify={(token) => setToken(token)}
                    /></div>
                  <Button variant="primary" type="submit" className="w-full bg-principal mt-3" disabled={registroExitoso}>
                    Comenzar
                  </Button>
                </Col>
                <Separador />
              </Row>
              <Row className="destination-box mb-2 text-center">
                <Col xs={12}>

                  <p className="text-sm text-center mt-0">
                    <Link to="/" className="color-principal text-sm"><FontAwesomeIcon icon={faArrowLeft} /> Regresar al inicio</Link>
                  </p> </Col>
              </Row>

            </Form>
          </Col></Row></Container>
    </>
  );
};

export default Recupero;
