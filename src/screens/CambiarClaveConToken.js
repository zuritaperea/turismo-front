import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import Form from '../components/Form';
import Alert from '../components/Alert';
import ErrorAlerts from '../components/ErrorAlerts/ErrorAlerts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import functions from '../extras/functions';
import registroService from "../axios/services/profile";
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import Row from '../components/Row';
import Col from '../components/Col';
import Container from '../components/Container';
import logo from '../assets/img/logomark.png';
import Separador from '../components/Separador';

const CambiarClaveConToken = () => {
    const { uid, token } = useParams(); // uid y token desde la URL
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración
    const [logoLogin, setLogoLogin] = useState(logo);
    const [reseteoExitoso, setReseteoExitoso] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password1 !== password2) {
            setAlerts([{ description: "Las contraseñas no coinciden" }]);
            return;
        }

        try {
            const response = await registroService.cambiarClaveConToken(uid, token, password1);
            console.log("Respuesta del servidor:", response);
            if (response.data) {
                setMensaje("La contraseña fue cambiada con éxito");
                setReseteoExitoso(true);
                setAlerts([]);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            // Manejo de error basado en la respuesta del servidor
            setAlerts(functions.errorMaker(error || error.response.data || [{ "description": "Ocurrió un error inesperado. Intente nuevamente." }]));
        }
    };
    useEffect(() => {
        if (config) { // Verifica que config no sea null
            setLogoLogin(config.logo || logo);
        }
    }, [config]); // El useEffect se ejecuta cada vez que config cambia


    return (
        <Container className='md:w-6/12 w-full'>
            <Row className="m-b-2 text-center sm:mt-10 mt-6">
                <Col>
                    <div>
                        <img className="logo m-auto" src={logoLogin} alt="Logo" />
                    </div>
                    <h1 className="text-2xl font-bold mt-5">Cambiar contraseña</h1>
                </Col>
            </Row>
            <Row className="destination-box mb-2 mt-6">
                <Col md={{ span: 6, offset: 3 }}>

                    {mensaje && <Alert variant="success">{mensaje}</Alert>}
                    <ErrorAlerts alerts={alerts} />

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="password1">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password2">
                            <Form.Label>Confirmar nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-full bg-principal mt-3" disabled={reseteoExitoso}>
                            Aceptar
                        </Button>
                    </Form>
                    <Separador />

                    <p className="mt-4">
                        <Link to="/" className="text-blue-600 text-sm">
                            <FontAwesomeIcon icon={faArrowLeft} /> Volver al inicio
                        </Link>
                    </p>
                </Col></Row></Container>
    );
};

export default CambiarClaveConToken;
