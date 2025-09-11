import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import Turnstile from "react-turnstile";
import { useTranslation } from 'react-i18next';
const Login = () => {
  const { login } = useContext(AuthContext);
  const [token, setToken] = useState("");

  const [alerts, setAlerts] = useState([]);
  const formRef = useRef();
  const [logoLogin, setLogoLogin] = useState(logo);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración
  const { t } = useTranslation();
  const onSubmit = data => {
    if (!token) {
      alert(t("login.captcha_alerta"));
      return;
    }
    handleLogin(data.username, data.password);
  }


  const handleLogin = async (username, password) => {
    setAlerts([]);
    const response = await authService.login(username, password, login); // Pasa login como callback
    if (response === 'success') {
      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectAfterLogin; // Use this for full URLs
      }
      else {
        navigate("/"); // Redirige a la página principal
      }
    } else {
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
              <Link to="/"><img className="logo m-auto" src={logoLogin} alt="Logo" loading="lazy" /></Link>
            </div>
            <h1 className="text-2xl font-bold">{t("login.titulo")}</h1>
            <h4 className="text-sm">{t("login.subtitulo")}</h4>
          </Col>
        </Row>

        <Row>
          <Col>
            {alerts && alerts.message && (
              <Alert variant="danger">
                <Alert.Heading>{t("login.errores_titulo")}</Alert.Heading>
                <p>{alerts.message}</p>
              </Alert>
            )}

            <Form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <Row>
                <Col md={10} className="form-group item-form">
                  <Form.Label htmlFor="username">{t("login.email_label")}</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    placeholder={t("login.email_placeholder")}
                    required
                    {...register("username", { required: t("login.email_required") })} 
                  />
                  {errors.username && (
                    <Form.Text className="error">{t("login.email_required")}</Form.Text>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={10} className="form-group item-form">
                  <Form.Label htmlFor="password">{t("login.password_label")}</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder={t("login.password_placeholder")}
                    required
                    {...register("password", { required: t("login.password_required") })} 
                  />
                  {errors.password && (
                    <Form.Text className="error">{t("login.password_required")}</Form.Text>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <p>
                    <Link className="color-principal text-sm" to="/recuperar-clave">{t("login.olvide_clave")}</Link>
                  </p>
                </Col>
                <Col>
                  {/* Turnstile */}
                  <div className="flex justify-center">
                    <Turnstile
                      sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} // Para Create React App
                      onVerify={(token) => setToken(token)}
                    /></div>
                  <Button variant="primary" className="w-full bg-principal mt-3">
                  {t("login.ingresar")}
                  </Button>
                </Col>
              </Row>
            </Form>

            <Row>
              <Col xs={12}>
                <Separador />

                <p className="text-sm text-center mt-5">
                {t("login.no_tienes_cuenta")}  <Link to="/registro" className="color-principal text-sm">{t("login.creala_ahora")}</Link>
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
