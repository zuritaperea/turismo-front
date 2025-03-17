import React, { useEffect, useState, useContext } from "react";
import fidiApi from "../axios/services/fidi"; 
import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal.js";
import Button from "./Button.js";
import { AuthContext } from "./AuthContext";

const AtractivosLista = () => {
  const [atractivos, setAtractivos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAtractivo, setSelectedAtractivo] = useState(null);
  const [personaDenominacion, setPersonaDenominacion] = useState(null);

  const handleReservar = async () => {
    if (!user) {
      alert("¡Por favor, inicia sesión para realizar una reserva!");
      return;
    }

    const reservaData = {
      cdgbtms_atractivo: selectedAtractivo?.id,
      nome: personaDenominacion,
    };

    try {
      const response = await fidiApi.hacerReserva(reservaData);
      const reservaConfirmada = response.data.info[0];

      const reservaDetalles = {
        reserva_num: reservaConfirmada.reserva_num,
        data: reservaConfirmada.data,
        hora: reservaConfirmada.hora,
        personaDenominacion: personaDenominacion,
        nome_atractivo: selectedAtractivo?.attributes.name,
      };

      navigate("/confirmacion-reserva-fidi", { state: { reservaConfirmada: reservaDetalles } });
    } catch (error) {
      console.error("Error al hacer la reserva", error);
    }
  };

  useEffect(() => {
    if (user?.profile?.length > 0) {
      const persona = user.profile.find((p) => p.type === "Persona");
      if (persona && persona.attributes.nombre && persona.attributes.apellido) {
        setPersonaDenominacion(`${persona.attributes.nombre} ${persona.attributes.apellido}`);
      } else {
        setPersonaDenominacion(user?.username);
      }
    } else {
      setPersonaDenominacion(user?.username);
    }
  }, [user]);

  useEffect(() => {
    const obtenerAtractivos = async () => {
      try {
        setLoading(true);
        const response = await fidiApi.obtenerTodosProductoTuristico();
        setAtractivos(response.data.data);
      } catch (error) {
        setError("Hubo un error al cargar los atractivos");
      } finally {
        setLoading(false);
      }
    };

    obtenerAtractivos();
  }, []);

  if (loading) return <p>Cargando atractivos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Atractivos Disponibles
      </div>

      {atractivos.map((atractivo) => (
        <div
          className="p-4 cursor-pointer"
          key={atractivo.id}
          onClick={() => {
            setSelectedAtractivo(atractivo);
            setModalOpen(true);
          }}
        >
          <div className="max-w-md mx-auto rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#101828] mb-1">
                {atractivo.attributes.name}
              </h2>
              <p className="text-[#475467] mt-4 mb-6 text-lg">
                {atractivo.attributes.description}
              </p>
              {atractivo.attributes.objeto && (
                <p className="text-sm text-gray-500">
                  Evento Asociado: {atractivo.attributes.objeto.attributes.name}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header onHide={() => setModalOpen(false)}>
          {selectedAtractivo?.attributes.name}
        </Modal.Header>
        <Modal.Body>
          <p>{selectedAtractivo?.attributes.description}</p>
          {selectedAtractivo?.attributes.tourist_type && (
            <p>
              <strong>Tipo:</strong> {selectedAtractivo.attributes.tourist_type.join(", ")}
            </p>
          )}
          <p>
            <strong>Valor:</strong> {selectedAtractivo?.attributes.value}
          </p>
          {selectedAtractivo?.attributes.objeto && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Evento Asociado</h3>
              <p>{selectedAtractivo.attributes.objeto.attributes.name}</p>
              <p>{selectedAtractivo.attributes.objeto.attributes.description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div
            className="bg-[#f08400] text-[#ffffff] rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors cursor-pointer"
            onClick={handleReservar}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>¡Reservar!</span>
          </div>
          <Button variant="secondary" className="w-100 mt-2" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AtractivosLista;
