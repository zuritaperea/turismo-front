import React, { useEffect, useState } from 'react';
import Row from '../components/Row';
import Col from '../components/Col';
import Alert from '../components/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from '../axios/services/viaje';
import { useNavigate } from "react-router-dom";
import Splash from '../components/Splash';
import funciones from "../extras/functions";
import { Eye } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from "../components/AuthContext";

function ViajeScreen() {
  const { user } = useContext(AuthContext);

  const [viajes, setViajes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViaje, setSelectedViaje] = useState(null); // Para almacenar el viaje seleccionado
  const [showModal, setShowModal] = useState(false); // Para controlar la visibilidad del modal
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const obtenerViajes = async () => {
      try {
        const response = await service.obtenerTodos();
        const data = response?.data?.data || []; // Asegúrate de que data sea un array

        setViajes(data);

        setLoading(false); // Cambia el estado a false cuando los datos se cargan correctamente
      } catch (error) {
        setError('Hubo un error al cargar los viajes');
        setLoading(false); // Cambia el estado a false en caso de error
      }
    };

    obtenerViajes(); // Llama a la función para obtener el viajes
  }, []);

  if (loading) return <Splash />;


  if (error) {
    return (
      <Alert variant="danger">
        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
      </Alert>
    );
  }

  if (!viajes) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Mis Viajes</h2>
        <div className="mb-4">
          {!viajes || viajes.length === 0 ? (
            <p className="text-gray-600">No tienes evidencias registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Pais de origen</th>
                    <th>Provincia</th>
                    <th>Ver</th>

                  </tr>
                </thead>
                <tbody>
                  {viajes?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{data.attributes.start_date ? funciones.toDateLocalFormat(data.attributes.start_date) : ''}</td>
                        <td>{data.attributes.end_date ? funciones.toDateLocalFormat(data.attributes.end_date) : ''}</td>

                        <td>{data.attributes.origin}</td>
                        <td>{data.attributes.administrative_division_of_origin}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center h-full gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setSelectedViaje(data)
                                setShowModal(true); // Abre el modal al hacer clic en "Ver"
                              }}
                              title="Ver Viaje"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}



                </tbody>
              </table></div>
          )}
        </div></div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header onHide={() => setShowModal(false)}>
          <div className='text-gray-200'>Detalles del Viaje</div>
        </Modal.Header>
        <Modal.Body>
          <Row className='text-gray-200'>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Fecha Inicio</h3>
              <p>{selectedViaje?.attributes.start_date ? funciones.toDateLocalFormat(selectedViaje.attributes.start_date) : ''}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Fecha Fin</h3>
              <p>{selectedViaje?.attributes.end_date ? funciones.toDateLocalFormat(selectedViaje.attributes.end_date) : ''}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Pais de origen</h3>
              <p>{selectedViaje?.attributes.origin}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Provincia</h3>
              <p>{selectedViaje?.attributes.administrative_division_of_origin}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Composición del grupo</h3>
              <p>{selectedViaje?.attributes.composition_travel_display}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Cantidad de personas</h3>
              <p>{selectedViaje?.attributes.number_of_people_in_group}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Tipo de interés</h3>
              <p>{selectedViaje?.attributes.interest_subtype.interest_type_display}</p>
            </Col>
            <Col xs={12} md={6}>
              <h3 className="text-lg font-semibold">Subtipo de interés</h3>
              <p>{selectedViaje?.attributes.interest_subtype.name}</p>
            </Col>
            <button className="bg-principal text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>
              Cerrar
            </button></Row>
        </Modal.Body>
      </Modal>
      <Footer /></>
  );
}

export default ViajeScreen;
