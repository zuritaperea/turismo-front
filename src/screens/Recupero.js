import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, } from 'react-bootstrap';
import Header from "../components/Header";
import Footer from "../components/Footer";
import registroService from "../axios/services/profile";

const Recupero = () => {
  const [mensaje, setMensaje] = useState(null);

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




  return (
    <>
      <Header />
      <Container className="boxed p-2">

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Row className="destination-box mb-2">
              <h3>Recuperá tu contraseña</h3>
              <hr className="mb-2"></hr>
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
                  />
                </Form.Group>


                <Row><Col>
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" className="mt-3" disabled={registroExitoso}>
                      Enviar
                    </Button></div></Col>
                  <Col>
                    <div className="d-grid gap-2">
                      <Button variant="secondary" href="/login" className="mt-3">
                        Volver
                      </Button></div>
                  </Col></Row>

              </Form>
              {mensaje && <Alert variant="success">{mensaje}</Alert>}
            </Row></Col></Row></Container>
      <Footer />
    </>
  );
};

export default Recupero;
