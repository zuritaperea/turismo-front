import React, { useEffect, useState, useContext } from "react";
import { Ticket, ArrowUpRight } from "lucide-react";
import Modal from "./Modal";
import service from "../axios/services/producto_turistico.js";
import { AuthContext } from "./AuthContext";

const ActividadesListaPresentacion = ({ listData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservaId, setReservaId] = useState(null);
  const { user } = useContext(AuthContext);

  const fechasDisponibles = ["2025-03-19", "2025-03-20", "2025-03-21", "2025-03-22"];

  const formatHour = (dateString) => {
    if (!dateString) return "Sin horario";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReservar = async () => {
    if (!user) {
      alert("¡Por favor, inicia sesión para realizar una reserva!");
      return;
    }

    const persona = user.profile.find((p) => p.type === "Persona");
    if (!selectedDate) return;

    const startDateTime = new Date(`${selectedDate}T00:00:00`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setDate(startDateTime.getDate() + 1);

    try {
      const data = {
        data: {
          type: "Reserva",
          attributes: {
            start_date: startDateTime.toISOString(),
            end_date: endDateTime.toISOString(),
            cantidad: 1,
          },
          relationships: {
            titular: {
              data: {
                nombre: persona?.attributes?.nombre,
                apellido: persona?.attributes?.apellido,
                documento_identidad: persona?.attributes?.documento_identidad,
                fecha_nacimiento: persona?.attributes?.fecha_nacimiento,
                domicilio: persona?.attributes?.domicilio,
                correo_electronico: persona?.attributes?.correo_electronico,
              },
            },
            producto_turistico: {
              data: { type: "ProductoTuristico", id: selectedActividad.id },
            },
          },
        },
      };

      const response = await service.crearReserva(data);
      if (response?.data?.data?.id) {
        setReservaId(response.data.data.id);
        setConfirmDialogOpen(true); // Mostrar diálogo con la reserva
      } else {
        alert("Hubo un problema al generar la reserva.");
      }
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert("Error al procesar la reserva.");
    }

    setModalOpen(false);
  };

  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Actividades Disponibles
      </div>

      {listData.length > 0 ? (
        listData.map((actividad, index) => (
          <div
            className="p-4 cursor-pointer"
            key={actividad?.id || index}
            onClick={() => {
              setSelectedActividad(actividad);
              setModalOpen(true);
            }}
          >
            <div className="max-w-md mx-auto rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-md text-[#f08400]">
                    <Ticket size={24} style={{ color: "#f08400" }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-1">
                      {actividad.name}
                    </h2>
                  </div>
                </div>

                <p className="text-[#475467] mt-4 mb-6 text-lg">
                  {actividad.start_date ? formatHour(actividad.start_date) : ""}
                  {actividad.start_date && actividad.end_date ? " - " : ""}
                  {actividad.end_date ? formatHour(actividad.end_date) : ""}
                </p>
                <p className="text-[#475467] mt-4 mb-6 text-lg">
                  {actividad.value}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay actividades disponibles.</p>
      )}

      {/* Modal de selección de fecha */}
      {modalOpen && selectedActividad && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <div
            className="mx-4 sm:mx-auto"
            style={{
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <div className="flex flex-col h-full">
              <Modal.Header onHide={() => setModalOpen(false)}>
                Seleccionar Fecha
              </Modal.Header>
              <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2">Selecciona una fecha:</h3>
                  <div className="flex flex-col gap-2">
                    {fechasDisponibles.map((fecha) => (
                      <button
                        key={fecha}
                        onClick={() => setSelectedDate(fecha)}
                        className={`px-4 py-2 rounded-md border ${
                          selectedDate === fecha ? "bg-principal text-white" : "border-gray-300"
                        }`}
                      >
                        {new Date(fecha).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </button>
                    ))}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-center w-full">
                  <div
                    className="bg-[#f08400] text-[#ffffff] rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors"
                    style={{
                      backgroundColor: selectedDate ? "#F08400" : "#CCCCCC",
                      color: "#FFFFFF",
                      cursor: selectedDate ? "pointer" : "not-allowed",
                      pointerEvents: selectedDate ? "auto" : "none",
                    }}
                    onClick={handleReservar}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span>¡Reservar!</span>
                  </div>
                </div>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación con el número de reserva */}
      {confirmDialogOpen && reservaId && (
        <Modal show={confirmDialogOpen} onHide={() => setConfirmDialogOpen(false)}>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[#101828]">¡Reserva Confirmada!</h2>
            <p className="text-lg text-[#475467]">
              Tu número de reserva es: <span className="font-bold">{reservaId}</span>
            </p>
            <button
              className="mt-6 bg-[#f08400] bg-principal text-white px-6 py-2 rounded-lg text-lg"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActividadesListaPresentacion;
