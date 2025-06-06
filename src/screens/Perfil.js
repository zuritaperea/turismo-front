import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../components/Form';
import Container from "../components/Container";
import Button from "../components/Button";
import Row from "../components/Row";
import Col from "../components/Col";
import Alert from "../components/Alert";
import objetoService from "../axios/services/objeto";
import profileService from "../axios/services/profile"; // servicio para cargar/guardar perfil
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import Separador from '../components/Separador';
import Splash from '../components/Splash';
import Turnstile from "react-turnstile";
import Footer from '../components/Footer';
import Header from '../components/Header';
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';
import functions from '../extras/functions';

const MiPerfil = () => {
  const [logoLogin, setLogoLogin] = useState(logo);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState([]);
  const [paises, setPaises] = useState([]);
  const [token, setToken] = useState("");

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

  const config = useContext(ConfigContext);
  const navigate = useNavigate();

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
    // Validaciones para contraseña
    const quiereCambiarPassword = datosUsuario.password || datosUsuario.password_2;

    if (quiereCambiarPassword) {
      if (!datosUsuario.password || !datosUsuario.password_2) {
        setError(['Debes completar ambos campos de contraseña para cambiarla.']);
        return;
      }
      if (datosUsuario.password !== datosUsuario.password_2) {
        setError(['Las contraseñas no son iguales']);
        return;
      }
    }
    try {
      const response = await profileService.updateProfile(datosUsuario); // PUT/PATCH según el backend
      setMensaje("Datos actualizados correctamente.");
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
        setError([{ "description": "El tipo de documento y el número de documento ya están registrados. Por favor, verifica los datos ingresados." }]);
      } else {
        setError(functions.errorMaker(error || error.response.data || [{ "description": "No se pudo actualizar el perfil. Por favor, intenta nuevamente." }]));
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
        setError(["Error al cargar tus datos."]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (config) setLogoLogin(config.logo || logo);
  }, [config]);

  if (loading) return <Splash />;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">

        <Row className="">
          <Col>
            <h1 className="text-2xl font-bold">Mi perfil</h1>
          </Col>
        </Row>

        <Row className="destination-box mb-2">
          <Col>
            <ErrorAlerts alerts={error} />

            {mensaje && <Alert variant="success">{mensaje}</Alert>}

            <Form onSubmit={handleSubmit}>
              <h1 className='text-xl font-bold my-4'>Datos personales</h1>

              <Form.Group controlId="nombre">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control type="text" name="nombre" value={datosUsuario.nombre} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="apellido">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control type="text" name="apellido" value={datosUsuario.apellido} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="tipo_documento">
                <Form.Label>Tipo Documento *</Form.Label>
                <Form.Select name="tipo_documento" value={datosUsuario.tipo_documento} onChange={handleInputChange} required options={constantes.tipo_documento} />
              </Form.Group>

              <Form.Group controlId="documento_identidad">
                <Form.Label>Número de Documento *</Form.Label>
                <Form.Control type="number" name="documento_identidad" value={datosUsuario.documento_identidad} onChange={handleInputChange} required />
              </Form.Group>

              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="tel" name="telefono" value={datosUsuario.telefono} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId="nacionalidad">
                <Form.Label>Nacionalidad *</Form.Label>
                <Form.Select name="nacionalidad" value={datosUsuario.nacionalidad} onChange={handleInputChange} required options={paises} />
              </Form.Group>

              <Form.Group controlId="company">
                <Form.Label>Empresa u Organización</Form.Label>
                <Form.Control type="text" name="company" value={datosUsuario.company} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId="position">
                <Form.Label>Cargo / Posición</Form.Label>
                <Form.Control type="text" name="position" value={datosUsuario.position} onChange={handleInputChange} />
              </Form.Group>

              <h1 className='text-xl font-bold my-4'>Datos de Acceso</h1>
              <Form.Group controlId="email">
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" name="email" value={datosUsuario.email} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type='password'
                  name="password"
                  value={datosUsuario.password}
                  onChange={handleInputChange}
                  placeholder="Solo si deseas cambiarla"
                />
              </Form.Group>

              <Form.Group controlId="password_2">
                <Form.Label>Confirmar nueva contraseña</Form.Label>
                <Form.Control
                  type='password'
                  name="password_2"
                  value={datosUsuario.password_2}
                  onChange={handleInputChange}
                  placeholder="Confirmar nueva contraseña"

                />
              </Form.Group>
              {/* Turnstile */}
              <div className="flex justify-center">
                <Turnstile
                  sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} // Para Create React App
                  // sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} // Para Vite
                  onVerify={(token) => setToken(token)}
                /></div>
              <Button variant="primary" className="w-full bg-principal mt-4">Guardar cambios</Button>
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
            <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/mis-reservas">Mis reservas</Link>
            </p>
            <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/viajes">Mis viajes</Link>
            </p>
            <p className="text-xl font-bold mt-4">
              <Link className="color-principal ml-2" to="/pasaporte">Mi pasaporte</Link>
            </p>
            <p className="text-xl font-bold my-4">
              <Link className="color-principal ml-2" to="/perfil-ambiental">Mi perfil ambiental</Link>
            </p>
          </Col>
        </Row></div>
      <Footer />

    </div>
  );
};

export default MiPerfil;
