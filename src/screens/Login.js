import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Form from '../components/Form';
import Button from '../components/Button';
import Container from '../components/Container';
import Row from '../components/Row';
import Col from '../components/Col';
import Alert from "../components/Alert";
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';
import authService from '../axios/services/auth';
import functions from '../extras/functions';
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import Separador from '../components/Separador';
import { AuthContext } from '../components/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  const [alerts, setAlerts] = useState([]);
  const formRef = useRef();
  const [logoLogin, setLogoLogin] = useState(logo);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración

  const onSubmit = data => {
    handleLogin(data.username, data.password);
  }


  const handleLogin  = async (username, password) => {
    setAlerts([]);
    const response = await authService.login(username, password, login); // Pasa login como callback
    if (response === 'success') {
      if (usuarioCompleto()) {
        navigate('/');
      } else {
        navigate('/');//navigate('/datos-adicionales'); por ahora esta asi
      }
    } else {
      console.log("error :", response.data);
      setAlerts(functions.errorMaker(response.data));
    }
  }

  const usuarioCompleto = () => {
    return localStorage.getItem('datosCompletados') === 'true';
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
            <h1 className="text-2xl font-bold">Ingresá a tu cuenta</h1>
            <h4 className="text-sm">¡Hola de nuevo! Completá tus datos para ingresar</h4>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            {alerts && alerts.message && (
              <Alert variant="danger">
                <Alert.Heading>Se han producido los siguientes errores:</Alert.Heading>
                <p>{alerts.message}</p>
              </Alert>
            )}

            <Form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <Row>
                <Col md={10} className="form-group item-form">
                  <Form.Label htmlFor="username">Email</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    placeholder="Colocá aquí tu email"
                    required
                    {...register("username", { required: 'Ingrese su email' })} // Aquí NO se usa inputRef directamente
                  />
                  {errors.username && (
                    <Form.Text className="error">Ingresá tu email</Form.Text>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={10} className="form-group item-form">
                  <Form.Label htmlFor="password">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder="Colocá aquí tu contraseña"
                    required
                    {...register("password", { required: 'Ingrese su contraseña' })} // Aquí NO se usa inputRef directamente
                  />
                  {errors.password && (
                    <Form.Text className="error">Ingresá tu contraseña</Form.Text>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <p>
                    <Link className="color-principal text-sm" to="/recuperar-clave">Olvidé contraseña</Link>
                  </p>
                </Col>
                <Col sm={3}>
                  <Button variant="primary" className="w-full bg-principal mt-3">
                    Ingresar
                  </Button>
                </Col>
              </Row>
            </Form>

            <Row>
              <Col xs={12}>
              <Separador />

                <p className="text-sm text-center mt-5">
                  ¿Aún no tienes una cuenta?  <Link to="/registro" className="color-principal text-sm">¡Créala ahora!</Link>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <ErrorAlerts alerts={alerts} />
    </>
  );
};

export default Login;
