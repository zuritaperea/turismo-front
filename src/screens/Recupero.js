import React, { useState, useRef, useContext, useEffect } from 'react';
import Form from '../components/Form';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Row from '../components/Row';
import Col from '../components/Col';
import Container from '../components/Container';
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import registroService from "../axios/services/profile";
import Separador from '../components/Separador';

const Recupero = () => {
  const [mensaje, setMensaje] = useState(null);
  const [logoLogin, setLogoLogin] = useState(logo);
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración

  const [datosUsuario, setDatosUsuario] = useState({
    email: '',
    email2: ''
  });

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
        datosUsuario.email
      ) {
        try {
          registroService
            .recuperarCuenta(datosUsuario)
            .then((response) => {
              setMensaje(
                "Su contraseña ha sido reseteada, recibirá un correo electrónico con instrucciones"
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
          setError('No se pudo realizar el reseteo');
        }
      } else {
        // Si falta algún dato, muestra un error
        setError('El correo electrónico es obligatorio');
      }
    } else {
      // Si falta algún dato, muestra un error
      setError('Los correos electrónicos no son iguales');
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
            {error && <Alert variant="danger">{error}</Alert>}
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
            {mensaje && <Alert variant="success">{mensaje}</Alert>}
          </Col></Row></Container>
    </>
  );
};

export default Recupero;
