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

const MiPerfil = () => {
  const [logoLogin, setLogoLogin] = useState(logo);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState([]);
  const [paises, setPaises] = useState([]);
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
    position: ''
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

    try {
      const response = await profileService.updateProfile(datosUsuario); // PUT/PATCH según el backend
      setMensaje("Datos actualizados correctamente.");
      setError([]);
    } catch (error) {
      setMensaje(null);
      setError(["No se pudo actualizar el perfil."]);
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
      localidad: personaAttributes.localidad || "",
      nacionalidad: personaAttributes.nacionalidad || "",
      genero: personaAttributes.genero || "",
      is_children: personaAttributes.is_children || false,
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
    <Container className='md:w-6/12 w-full'>
      <Row className="m-b-2 text-center sm:mt-10 mt-6">
        <Col>
          <img className="logo m-auto" src={logoLogin} alt="Logo" />
          <h1 className="text-2xl font-bold">Mi perfil</h1>
          <h4 className="text-sm">Modificá tus datos personales.</h4>
        </Col>
      </Row>

      <Row className="destination-box mb-2">
        <Col>
          {error.length > 0 && (
            <Alert variant="danger">
              <ul>{error.map((err, i) => <li key={i}>{err}</li>)}</ul>
            </Alert>
          )}
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

            <h1 className='text-xl font-bold my-4'>Email</h1>
            <Form.Group controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" name="email" value={datosUsuario.email} onChange={handleInputChange} required />
            </Form.Group>

            <Button variant="primary" className="w-full bg-principal mt-4">Guardar cambios</Button>
          </Form>
        </Col>
      </Row>

      <Separador />
      <Row className="text-center">
        <Col>
          <p className="mt-4">
            ¿Querés ver tus reservas?
            <Link className="color-principal ml-2" to="/mis-reservas">Ir a Mis Reservas</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default MiPerfil;
