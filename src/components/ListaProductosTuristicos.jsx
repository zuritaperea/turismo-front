import React, { useEffect, useState, useContext } from "react";
import { Ticket, ArrowUpRight } from "lucide-react";
import Modal from "./Modal.js";
import service from "../axios/services/producto_turistico.js";
import { AuthContext } from "./AuthContext.js";
import { useNavigate } from "react-router-dom";

const formatForInput = (date) => {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  if (!(date instanceof Date) || isNaN(date)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const ListaProductosTuristicos = ({ listData, fechaDesde, fechaHasta, cantidadPersonas = 1, esPasaporte = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductoTuristico, setSelectedProductoTuristico] = useState(null);
  const [reservaId, setReservaId] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [acompaniantes, setAcompaniantes] = useState([]);
  const [cantidadProducto, setCantidadProducto] = useState(1);

  useEffect(() => {
    if (cantidadPersonas > 1) {
      const nuevos = Array.from({ length: cantidadPersonas - 1 }, () => ({
        documento_identidad: "", nombre: "", apellido: "",
      }));
      setAcompaniantes(nuevos);
    }
  }, [cantidadPersonas]);

  useEffect(() => {
    if (fechaDesde) setSelectedStartDate(new Date(fechaDesde));
    if (fechaHasta) setSelectedEndDate(new Date(fechaHasta));
  }, [fechaDesde, fechaHasta]);

  const isReadOnly = fechaDesde && fechaHasta;

  const formatHour = (dateString) => {
    if (!dateString) return "Sin horario";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleReservar = async () => {
    if (!user) {
      alert("¡Por favor, inicia sesión para realizar una reserva!");
      return;
    }

    const persona = user.profile.find((p) => p.type === "Persona");
    if (!selectedStartDate || !selectedEndDate) {
      alert("Seleccioná una fecha de inicio y una de fin");
      return;
    }

    const endDate = selectedEndDate.toISOString();

    try {
      const data = {
        data: {
          type: "Reserva",
          attributes: {
            start_date: selectedStartDate.toISOString(),
            end_date: endDate,
            cantidad: cantidadProducto,
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
            acompaniantes: {
              data: acompaniantes,
            },
            producto_turistico: {
              data: { type: "ProductoTuristico", id: selectedProductoTuristico.id },
            },
          },
        },
      };

      const response = await service.crearReserva(data);
      if (response?.data?.data?.id) {
        setReservaId(response.data.data.id);
        setConfirmDialogOpen(true);
      } else {
        alert("Hubo un problema al generar la reserva.");
      }
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert("Error al procesar la reserva.");
    }

    setModalOpen(false);
  };

  const isDentroDeRango = (producto, fechaDesde, fechaHasta) => {
    const start = producto.validity_from ? new Date(producto.validity_from) : null;
    const end = producto.validity_to ? new Date(producto.validity_to) : null;
    if (!start && !end) return true;
    if (!fechaDesde && !fechaHasta) return true;
    if (fechaDesde && !fechaHasta) return !end || end >= fechaDesde;
    if (!fechaDesde && fechaHasta) return !start || start <= fechaHasta;
    return (!end || end >= fechaDesde) && (!start || start <= fechaHasta);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Realizá tu reserva
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listData
          .filter((p) => p.active)
          .filter((p) => isDentroDeRango(p, fechaDesde, fechaHasta))
          .filter((p) => p.integrates_discount_passport === esPasaporte)
          .filter((p) => p.maximum_number_persons <= cantidadPersonas)
          .map((producto_turistico, index) => (
            <div
              key={producto_turistico?.id || index}
              className="cursor-pointer"
              onClick={() => {
                setSelectedProductoTuristico(producto_turistico);
                setModalOpen(true);
              }}
            >
              <div className="rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <Ticket size={24} className="text-[#f08400]" />
                    <h2 className="text-xl font-semibold text-[#101828]">{producto_turistico.name}</h2>
                  </div>
                  <p className="text-[#475467] mt-4 text-lg">
                    {producto_turistico.validity_from ? formatHour(producto_turistico.validity_from) : ""}
                    {producto_turistico.validity_from && producto_turistico.validity_to ? " - " : ""}
                    {producto_turistico.validity_to ? formatHour(producto_turistico.validity_to) : ""}
                  </p>
                  <p className="text-[#475467] mt-2 text-lg">
                    {producto_turistico.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {modalOpen && selectedProductoTuristico && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <div className="mx-4 sm:mx-auto max-w-md max-h-[90vh] overflow-y-auto pr-2">
            <div className="flex flex-col h-full">
              <Modal.Header onHide={() => setModalOpen(false)}>
                <span className="text-gray-200">Realizá tu reserva</span>
              </Modal.Header>
              <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2 text-gray-200">
                    {isReadOnly ? 'Rango de Fechas' : 'Seleccioná el rango de fechas'}:
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">Desde:</label>
                      <input
                        type="datetime-local"
                        className="w-full border rounded p-2"
                        value={formatForInput(selectedStartDate)}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">Hasta:</label>
                      <input
                        type="datetime-local"
                        className="w-full border rounded p-2"
                        value={formatForInput(selectedEndDate)}
                        onChange={(e) => setSelectedEndDate(e.target.value)}
                        readOnly={isReadOnly}
                      />
                    </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Cantidad a reservar:
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={cantidadProducto}
                          onChange={(e) => setCantidadProducto(Number(e.target.value))}
                          className="w-full border rounded p-2"
                        />
                      </div>
                  </div>
                  {cantidadPersonas > 1 && acompaniantes.map((a, idx) => (
                    <div key={idx} className="mt-4">
                      <label className="block text-sm text-gray-200 mb-1">Acompañante {idx + 1}</label>
                      <input type="text" placeholder="Nombres" className="w-full border p-2 mb-2"
                        value={a.nombre} onChange={(e) => {
                          const updated = [...acompaniantes];
                          updated[idx].nombre = e.target.value;
                          setAcompaniantes(updated);
                        }} />
                      <input type="text" placeholder="Apellido" className="w-full border p-2 mb-2"
                        value={a.apellido} onChange={(e) => {
                          const updated = [...acompaniantes];
                          updated[idx].apellido = e.target.value;
                          setAcompaniantes(updated);
                        }} />
                      <input type="text" placeholder="Número de Documento" className="w-full border p-2"
                        value={a.documento_identidad} onChange={(e) => {
                          const updated = [...acompaniantes];
                          updated[idx].documento_identidad = e.target.value;
                          setAcompaniantes(updated);
                        }} />
                    </div>
                  ))}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-center w-full">
                  <div
                    className="bg-[#f08400] text-white rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors"
                    style={{
                      backgroundColor: selectedStartDate && selectedEndDate ? "#F08400" : "#CCCCCC",
                      cursor: selectedStartDate && selectedEndDate ? "pointer" : "not-allowed",
                      pointerEvents: selectedStartDate && selectedEndDate ? "auto" : "none",
                    }}
                    onClick={handleReservar}
                  >
                    <ArrowUpRight className="w-5 h-5 mr-1" />
                    ¡Reservar!
                  </div>
                </div>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      )}

      {confirmDialogOpen && reservaId && (
        <Modal show={confirmDialogOpen} onHide={() => setConfirmDialogOpen(false)}>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">¡Reserva Realizada!</h2>
            <p className="text-lg text-gray-200">
              Tu número de reserva es: <span className="font-bold">{reservaId}</span>
            </p>
            <button
              className="mt-6 bg-[#f08400] text-white px-6 py-2 rounded-lg text-lg"
              onClick={() => {setConfirmDialogOpen(false);
                navigate(`/reserva/${reservaId}`); // Redirigir a la página de detalles de la reserva 
              }}
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListaProductosTuristicos;
