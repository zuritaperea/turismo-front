import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../components/Form';
import Container from "../components/Container";
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Alert from "../components/Alert";
import objetoService from "../axios/services/objeto";
import profileService from "../axios/services/profile"; // servicio para cargar/guardar perfil
import { ConfigContext } from '../extras/ConfigContext';
import Separador from '../components/Separador';
import Splash from '../components/Splash';
import Turnstile from "react-turnstile";
import Footer from '../components/Footer';
import Header from '../components/Header';
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';
import functions from '../extras/functions';
import { useTranslation } from 'react-i18next';
const MiPerfil = () => {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState([]);
  const [paises, setPaises] = useState([]);
  const [token, setToken] = useState("");
  const { t } = useTranslation();
  const permisos = useMemo(() => ({
    pasaporte: config?.pasaporte || false,
    marketplace: config?.marketplace || false,
    modulo_sostenibilidad: config?.modulo_sostenibilidad || false
  }), [config]);

  const [constantes, setConstantes] = useState({
    tipo_documento: [],
    genero: [],
  });

  const [datosUsuario, setDatosUsuario] = useState({
    email: '',
    usuario: '',
    telefono: '',
    nombre: '',
    apellido: '',
    documento_identidad: '',
    tipo_documento: '',
    nacionalidad: '',
    company: '',
    position: '',
    password: '',
    password_2: ''
  });

  const navigate = useNavigate();

  const agregarOpcionVacia = (items, label = t("perfil.seleccionar")) => [
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
      alert(t("perfil.captcha_alerta"));
      return;
    }
    // Validaciones para contraseña
    const quiereCambiarPassword = datosUsuario.password || datosUsuario.password_2;

    if (quiereCambiarPassword) {
      if (!datosUsuario.password || !datosUsuario.password_2) {
        setError([t("perfil.error_password_vacia")]);
        return;
      }
      if (datosUsuario.password !== datosUsuario.password_2) {
        setError([t("perfil.error_password_vacia")]);
        return;
      }
    }
    try {
      const response = await profileService.updateProfile(datosUsuario); // PUT/PATCH según el backend
      setMensaje(t("perfil.mensaje_exito"));
      setError([]);
    } catch (error) {
      setMensaje(null);
      console.error("Error modificando el perfil:", error);
      // Manejo de error basado en la respuesta del servidor
      const serverErrors = error?.errors || error?.response?.data?.errors || [];
      const uniqueError = serverErrors.find(err =>
        err.detail === "Los campos tipo_documento, documento_identidad deben formar un conjunto único."
      );
      if (uniqueError) {
        setError([{ "description": t("perfil.error_unico") }]);
      } else {
        setError(functions.errorMaker(error || error.response.data || [{ "description": t("perfil.error_general") }]));
      }
    }
  };

  const transformarDatosUsuario = (response) => {
    const userAttributes = response.data.attributes || {};
    const personaId = response.data.relationships?.persona?.data?.id;
    const persona = response.included?.find(item => item.type === "Persona" && item.id === personaId);
    const personaAttributes = persona?.attributes || {};

    return {
      id: response.data.id,
      username: userAttributes.username || "",
      email: userAttributes.email || "",
      first_name: userAttributes.first_name || "",
      last_name: userAttributes.last_name || "",
      persona_id: personaId,
      nombre: personaAttributes.nombre || "",
      apellido: personaAttributes.apellido || "",
      tipo_documento: personaAttributes.tipo_documento || "",
      documento_identidad: personaAttributes.documento_identidad || "",
      fecha_nacimiento: personaAttributes.fecha_nacimiento || "",
      domicilio: personaAttributes.domicilio || "",
      correo_electronico: personaAttributes.correo_electronico || "",
      telefono: personaAttributes.telefono || "",
      localidad: personaAttributes.localidad?.id || "",
      nacionalidad: personaAttributes.nacionalidad?.id || "",
      genero: personaAttributes.genero || "",
      is_children: personaAttributes.is_children || false,
      company: personaAttributes.company || "",
      position: personaAttributes.position || "",
    };
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConstantes, resPaises, resPerfil] = await Promise.all([
          objetoService.obtenerConstantes(),
          profileService.getPaises(),
          profileService.getProfile(), // Obtener datos actuales del usuario
        ]);
        setConstantes(procesarConstantes(resConstantes.data.data));
        setPaises(agregarOpcionVacia(
          resPaises.data.data.map((s) => ({ value: s.id, label: s.attributes.nombre }))
        ));
        const perfilTransformado = transformarDatosUsuario(resPerfil.data);
        setDatosUsuario(prev => ({ ...prev, ...perfilTransformado }));

      } catch (error) {
        console.error("Error cargando datos de perfil", error);
        setError([t("perfil.error_datos")]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  if (loading) return <Splash />;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">

        <Row className="">
          <Col>
            <h1 className="text-2xl font-bold">{t("perfil.titulo")}</h1>
          </Col>
        </Row>

        <Row className="destination-box mb-2">
          <Col>
            <ErrorAlerts alerts={error} />

            {mensaje && <Alert variant="success">{mensaje}</Alert>}

            <Form onSubmit={handleSubmit}>
              <h1 className='text-xl font-bold my-4'>{t("perfil.datos_personales")}</h1>

              <Form.Group controlId="nombre">
                <Form.Label>{t("perfil.nombre")} *</Form.Label>
                <Form.Control type="text" name="nombre" value={datosUsuario.nombre} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="apellido">
                <Form.Label>{t("perfil.apellido")} *</Form.Label>
                <Form.Control type="text" name="apellido" value={datosUsuario.apellido} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="tipo_documento">
                <Form.Label>{t("perfil.tipo_documento")} *</Form.Label>
                <Form.Select name="tipo_documento" value={datosUsuario.tipo_documento} onChange={handleInputChange} required options={constantes.tipo_documento} />
              </Form.Group>

              <Form.Group controlId="documento_identidad">
                <Form.Label>{t("perfil.numero_documento")} *</Form.Label>
                <Form.Control type="number" name="documento_identidad" value={datosUsuario.documento_identidad} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="telefono">
                <Form.Label>{t("perfil.telefono")}</Form.Label>
                <Form.Control type="tel" name="telefono" value={datosUsuario.telefono} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId="nacionalidad">
                <Form.Label>{t("perfil.nacionalidad")} *</Form.Label>
                <Form.Select name="nacionalidad" value={datosUsuario.nacionalidad} onChange={handleInputChange} required options={paises} />
              </Form.Group>

              <Form.Group controlId="company">
                <Form.Label>{t("perfil.empresa")}</Form.Label>
                <Form.Control type="text" name="company" value={datosUsuario.company} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId="position">
                <Form.Label>{t("perfil.cargo")}</Form.Label>
                <Form.Control type="text" name="position" value={datosUsuario.position} onChange={handleInputChange} />
              </Form.Group>

              <h1 className='text-xl font-bold my-4'>{t("perfil.datos_acceso")}</h1>
              <Form.Group controlId="email">
                <Form.Label>{t("perfil.email")} *</Form.Label>
                <Form.Control type="email" name="email" value={datosUsuario.email} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>{t("perfil.nueva_contrasena")}</Form.Label>
                <Form.Control
                  type='password'
                  name="password"
                  value={datosUsuario.password}
                  onChange={handleInputChange}
                  placeholder={t("perfil.placeholder_contrasena")}
                />
              </Form.Group>

              <Form.Group controlId="password_2">
                <Form.Label>{t("perfil.confirmar_contrasena")}</Form.Label>
                <Form.Control
                  type='password'
                  name="password_2"
                  value={datosUsuario.password_2}
                  onChange={handleInputChange}
                  placeholder={t("perfil.confirmar_contrasena")}

                />
              </Form.Group>
              {/* Turnstile */}
              <div className="flex justify-center">
                <Turnstile
                  sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} // Para Create React App
                  onVerify={(token) => setToken(token)}
                /></div>
              <Button variant="primary" className="w-full bg-principal mt-4">{t("perfil.guardar_cambios")}</Button>
            </Form>
            <Row><Col className='mt-3'>{error.length > 0 && (
              <ErrorAlerts alerts={error} />
            )}
              {mensaje && <Alert variant="success">{mensaje}</Alert>}</Col></Row>
          </Col>
        </Row>

        <Separador />
        <Row>
          <Col>
            {permisos.marketplace && <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/mis-reservas">{t("perfil.mis_reservas")}</Link>
            </p>}
            {permisos.pasaporte && <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/viajes">{t("perfil.mis_viajes")}</Link>
            </p>}
            {permisos.pasaporte && <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/pasaporte">{t("perfil.mi_pasaporte")}</Link>
            </p>}
            {permisos.modulo_sostenibilidad && <p className="text-xl font-bold my-4">
              <Link className="color-principal ml-2" to="/perfil-ambiental">{t("perfil.mi_perfil_ambiental")}</Link>
            </p>}
          </Col>
        </Row></div>
      <Footer />

    </div>
  );
};

export default MiPerfil;
