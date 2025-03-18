// ActividadesListaPresentacion.jsx
import React, { useEffect, useState } from "react";
import { Ticket, ArrowUpRight } from "lucide-react";
import Modal from "./Modal";

const ActividadesListaPresentacion = ({ listData = {} }) => {
  const { loading = false, error = null } = listData;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [horarios, setHorarios] = useState([]);

  const fechasDisponibles = ["2025-03-19", "2025-03-20", "2025-03-21", "2025-03-22"];

  useEffect(() => {
    console.log(listData, "listData");
  }, [listData]);

  const formatHour = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReservar = () => {
    console.log("Reservar actividad:", selectedActividad, selectedDate, selectedHorario);
    setModalOpen(false);
  };

  useEffect(() => {
    if (selectedActividad && selectedDate) {
      setHorarios([
        ["07:00", 10],
        ["08:00", 5],
        ["09:00", 8]
      ]);
    }
  }, [selectedActividad, selectedDate]);

  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Actividades Disponibles
      </div>

      {listData.data && listData.data.data && listData.data.data.length > 0 ? (
        listData.data.data.map((actividad, index) => (
          <div
            className="p-4 cursor-pointer"
            key={actividad.id || index}
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
                      {actividad.attributes.name}
                    </h2>
                  </div>
                </div>

                <p className="text-[#475467] mt-4 mb-6 text-lg">
                  {formatHour(actividad.attributes.objeto.attributes.start_date)} -{" "}
                  {formatHour(actividad.attributes.objeto.attributes.end_date)}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay actividades disponibles.</p>
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <div
          className="mx-4 sm:mx-auto"
          style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", paddingRight: "10px" }}
        >
          <div className="flex flex-col h-full">
            <Modal.Header onHide={() => setModalOpen(false)}>
              Seleccionar Fecha y Horario
            </Modal.Header>
            <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Selecciona una fecha:</h3>
                <div className="flex flex-col gap-2">
                  {fechasDisponibles.map((fecha) => (
                    <button
                      key={fecha}
                      onClick={() => {
                        setSelectedDate(fecha);
                        setSelectedHorario(null);
                      }}
                      className={`px-4 py-2 rounded-md border ${
                        selectedDate === fecha ? "bg-principal text-white" : "border-gray-300"
                      }`}
                    >
                      {new Date(fecha).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <div>
                  <h3 className="text-md font-semibold mb-2">Horarios Disponibles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {horarios.length > 0 ? (
                      horarios.map(([hora, cupos]) => (
                        <div
                          key={hora}
                          onClick={() => setSelectedHorario(hora)}
                          className={`cursor-pointer rounded-lg border p-4 text-center transition-colors duration-200 ${
                            selectedHorario === hora
                              ? "bg-principal text-white border-transparent"
                              : "bg-white text-slate-900 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          <div className="text-lg font-bold">{hora}</div>
                          <div className="text-sm">{cupos} lugares</div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-center">No hay horarios disponibles.</p>
                    )}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-center w-full">
                <div
                  className="bg-[#f08400] text-[#ffffff] rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors"
                  style={{
                    backgroundColor: selectedHorario ? "#F08400" : "#CCCCCC",
                    color: "#FFFFFF",
                    cursor: selectedHorario ? "pointer" : "not-allowed",
                    pointerEvents: selectedHorario ? "auto" : "none"
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
    </div>
  );
};

export default ActividadesListaPresentacion;
