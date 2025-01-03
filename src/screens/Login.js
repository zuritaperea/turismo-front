import React, { useState , useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Form from '../components/Form';
import Button from '../components/Button';
import Container from '../components/Container';
import Row from '../components/Row';
import Col from '../components/Col';
import Alert from "../components/Alert";
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';
import authService from '../axios/services/auth';
import functions from '../extras/functions';
import styles from './styles.module.css';
import logo from '../assets/img/logomark.png';

const Login = () => {
  const [alerts, setAlerts] = useState([]);
  const formRef = useRef();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = data => {
    login(data.username, data.password);
  }

  const login = async (username, password) => {
    setAlerts([]);
    try {
      const response = await authService.login(username, password);
      if (response === 'success') { // Verifica la condición de éxito
        // ... (navegación)
      } else {
        console.error("Respuesta inesperada:", response); // Log completo para depuración
        setAlerts([{ message: "Respuesta inesperada del servidor." }]);
      }
    } catch (error) { // Manejo de errores de red o del API
      console.error("Error en el login:", error);
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setAlerts([{ message: error.response.data.message }]);
        } else if (Array.isArray(error.response.data.errors)) { // Manejo de array de errores
          setAlerts(error.response.data.errors.map(err => ({ message: err.message })));
        } else {
          setAlerts([{ message: JSON.stringify(error.response.data) }]); // Mostrar el error en string si no tiene formato conocido
        }
      } else if (error.message) {
        setAlerts([{ message: error.message }]);
      } else {
        setAlerts([{ message: "Error desconocido al iniciar sesión." }]);
      }
    }
  };

  const usuarioCompleto = () => {
    return localStorage.getItem('datosCompletados') === 'true';
  };

  return (
    <>
      <Container className='md:w-6/12 w-full'>
        <Row className="m-b-2 text-center sm:mt-10 mt-6">
          <Col md={{ span: 6, offset: 3 }} >
            <div>
              <img className="logo m-auto" src={logo} alt="Logo" />
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
