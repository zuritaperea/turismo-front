import React, { useEffect, useState, useContext } from "react";
import { Ticket, ArrowUpRight } from "lucide-react";
import Modal from "../../Modal.js";
import service from "../../../axios/services/producto_turistico.js";
import { AuthContext } from "../../AuthContext.js";
import { useNavigate } from "react-router-dom";
import funciones from "../../../extras/functions.js";
import { DateRange, Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";
import Spinner from "../../Spinner.js";
import ProductoTuristicoCard from "./ProductoTuristicoCard";

const ListaProductosTuristicos = (props) => {
  const {
    listData,
    fechaDesde,
    fechaHasta,
    cantidadPersonas: cantidadPersonasProp,
    esPasaporte = false,
    tipoObjeto,
    inicio,
    final
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoadingReserva, setIsLoadingReserva] = useState(false);
  const [isLoadingProducto, setIsLoadingProducto] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductoTuristico, setSelectedProductoTuristico] = useState(null);
  const [productoTuristico, setProductoTuristico] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [reservaId, setReservaId] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: selectedStartDate || fechaDesde || new Date(),
      endDate: selectedEndDate || fechaHasta || new Date(),
      key: "selection",
    },
  ]);
  const [acompaniantes, setAcompaniantes] = useState([]);
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [cantidadPersonas, setCantidadPersonas] = useState(cantidadPersonasProp ?? 1);
  const cantidadPersonasFuePasada = props.cantidadPersonas != null;
  const isAlojamiento = tipoObjeto === "alojamiento";
  const [intervaloMinutos, setIntervaloMinutos] = useState(null);
  const [tieneHorariosConfigurados, setTieneHorariosConfigurados] = useState(false);
  const [hayHorariosParaElDia, setHayHorariosParaElDia] = useState(false);


  useEffect(() => {
    const fetchProductoTuristico = async () => {
      setProductoTuristico(null);
      setIsLoadingProducto(true);
      if (!selectedProductoTuristico) return;
      try {
        const response = await service.obtenerProductoTuristicoPorId(selectedProductoTuristico.id);
        if (response?.data?.data) {
          setProductoTuristico(response.data.data);
        } else {
          console.error("No se encontró el producto turístico");
        }
      } catch (error) {
        console.error("Error al obtener el producto turístico:", error);
      }
      setIsLoadingProducto(false);
    }
    fetchProductoTuristico();
  }, [selectedProductoTuristico]);


  useEffect(() => {
    if (cantidadPersonas > 1) {
      const nuevos = Array.from({ length: cantidadPersonas - 1 }, () => ({
        documento_identidad: "", nombre: "", apellido: "",
      }));
      setAcompaniantes(nuevos);
    }
  }, [cantidadPersonas]);



  useEffect(() => {
    setSelectedStartDate(dateRange[0].startDate);
    setSelectedEndDate(dateRange[0].endDate);

    const obtenerHorarios = async () => {
      if (!productoTuristico) return;

      const horariosConfig = productoTuristico.attributes?.horarios_disponibles;
      //ajustamos el dia de la semana para que coincida con el formato de la API siendo 0 el Lunes y 6 el Domingo
      const diaSemana = new Date(dateRange[0].startDate).getDay();
      const adjustedDiaSemana = (diaSemana + 6) % 7; // Ajuste para que 0 sea Lunes y 6 sea Domingo
      console.log("Día de la semana:", diaSemana);
      if (horariosConfig && horariosConfig.length > 0) {
        setTieneHorariosConfigurados(true);

        const horarioDelDia = horariosConfig.find(h => h.dia_semana === adjustedDiaSemana);

        if (horarioDelDia) {
          setIntervaloMinutos(horarioDelDia.intervalo_minutos);
          setHayHorariosParaElDia(true);

          const horariosResponse = await service.obtenerHorariosDisponibles(
            productoTuristico.id,
            funciones.formatDateOnly(dateRange[0].startDate)
          );

          if (horariosResponse?.data?.data) {
            const horarios = horariosResponse.data.data;
            setHorariosDisponibles(horarios.horarios);
          }
        } else {
          // Tiene configuración pero no para este día
          setIntervaloMinutos(null);
          setHayHorariosParaElDia(false);
          setHorariosDisponibles(null);
        }
      } else {
        // No hay configuración de horarios
        setTieneHorariosConfigurados(false);
        setIntervaloMinutos(null);
        setHayHorariosParaElDia(false);
        setHorariosDisponibles(null);
      }
    };

    obtenerHorarios();
  }, [dateRange, productoTuristico]);

  const isReadOnly = fechaDesde && fechaHasta;

  const handleReservar = async () => {
    if (!user) {
      alert("¡Por favor, inicia sesión para realizar una reserva!");
      //agregar la url actual para poder volver despues de iniciar sesión
      localStorage.setItem("redirectAfterLogin", window.location.href);
      navigate("/login");
      return;
    }

    const persona = user.profile.find((p) => p.type === "Persona");
    if (!selectedStartDate || !selectedEndDate) {
      alert("Seleccioná una fecha de inicio y una de fin");
      return;
    }

    setIsLoadingReserva(true); // ⬅️ Activar loading

    function ensureDate(value) {
      if (value instanceof Date) {
        return value;
      }
      return new Date(value);
    }

    const startDate = ensureDate(selectedStartDate).toISOString();
    const endDate = ensureDate(selectedEndDate).toISOString();

    try {
      const data = {
        data: {
          type: "Reserva",
          attributes: {
            start_date: startDate,
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
                correo_electronico: persona?.attributes?.correo_electronico || user.username,
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
    } finally {
      setIsLoadingReserva(false); // ⬅️ Desactivar loading al finalizar
      setModalOpen(false);
    }
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
    <div className="mb-20">
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
            <ProductoTuristicoCard
            key={producto_turistico.id || index}
            producto={producto_turistico}
            onClick={() => {
              setSelectedProductoTuristico(producto_turistico);
              setModalOpen(true);
            }}
          />
          ))}
      </div>

      {modalOpen && selectedProductoTuristico && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <div className="mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto pr-2">
            <div className="flex flex-col h-full">
              <Modal.Header onHide={() => setModalOpen(false)}>
                <span className="text-gray-200">Realizá tu reserva</span>
              </Modal.Header>
              <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">

                {isLoadingProducto ? <Spinner /> : (<>
                  <div className="mb-4 overflow-y-auto max-h-80 sm:max-h-80 md:max-h-96 lg:max-h-96 pr-2">
                    <h1 className="text-gray-200 font-bold">{productoTuristico.attributes.name}</h1>
                    <span className="text-gray-200">{productoTuristico.attributes.description}</span>

                    <h3 className="text-md font-semibold mb-2 text-gray-200">
                      {isAlojamiento
                        ? isReadOnly
                          ? "Rango de Fechas"
                          : "Seleccioná el rango de fechas"
                        : isReadOnly
                          ? "Fecha seleccionada"
                          : "Seleccioná la fecha"}                  </h3>
                    <div className="flex flex-col gap-4">
                      <div className="mb-4">


                        {isAlojamiento ? (
                          <DateRange
                            editableDateInputs={!isReadOnly}
                            onChange={(item) => {
                              const selectedStart = item.selection.startDate;
                              const selectedEnd = item.selection.endDate;
                              setDateRange([item.selection]);
                            }}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            locale={es}
                            minDate={fechaDesde || new Date()}
                            maxDate={fechaHasta}
                            className="rounded border shadow"
                          />
                        ) : (
                          <Calendar
                            date={dateRange[0].startDate}
                            onChange={(date) => {
                              const start = new Date(date);
                              const end = new Date(date);
                              end.setHours(23, 59, 59, 999);
                              setDateRange([{ startDate: start, endDate: end, key: "selection" }]);
                            }}
                            locale={es}
                            disabled={isReadOnly}
                            color="#111827"
                            minDate={fechaDesde || inicio || new Date()}
                            maxDate={fechaHasta || final}
                            className="rounded border shadow"

                          />
                        )}
                      </div>

                      {tieneHorariosConfigurados && hayHorariosParaElDia && horariosDisponibles && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-200 mb-1">
                            Horario disponible:
                          </label>
                          <select
                            className="w-full border rounded p-2"
                            onChange={(e) => {
                              const selectedHour = e.target.value;
                              if (selectedHour && intervaloMinutos) {
                                const selectedStart = new Date(dateRange[0].startDate);
                                const [hours, minutes] = selectedHour.split(":");
                                selectedStart.setHours(hours, minutes, 0, 0);
                                setSelectedStartDate(selectedStart);

                                const selectedEnd = new Date(selectedStart);
                                selectedEnd.setMinutes(selectedEnd.getMinutes() + intervaloMinutos);
                                setSelectedEndDate(selectedEnd);
                              }
                            }}
                          >
                            <option value="">Seleccionar horario</option>
                            {Object.entries(horariosDisponibles).map(([hora, disponible]) =>
                              disponible >  0 ? (
                                <option key={hora} value={hora}>
                                  {hora}
                                </option>
                              ) : null
                            )}
                          </select>
                        </div>
                      )}

                      {tieneHorariosConfigurados && !hayHorariosParaElDia && (
                        <p className="text-sm text-yellow-300 mt-2">No hay horarios para este día.</p>
                      )}

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
                      {!cantidadPersonasFuePasada && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-200 mb-1">
                            Cantidad de personas:
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(Number(e.target.value))}
                            className="w-full border rounded p-2"
                          />
                        </div>
                      )}
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
                  </div></>)}
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-center w-full">
                  <div
                    className={`text-white rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors ${isLoadingReserva ? "bg-gray-400" : "bg-[#f08400]"
                      }`}
                    style={{
                      cursor: selectedStartDate && selectedEndDate && !isLoadingReserva ? "pointer" : "not-allowed",
                      pointerEvents: selectedStartDate && selectedEndDate && !isLoadingReserva ? "auto" : "none",
                    }}
                    onClick={!isLoadingReserva ? handleReservar : undefined}
                  >
                    {isLoadingReserva ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Reservando...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-5 h-5 mr-1" />
                        ¡Reservar!
                      </>
                    )}
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
              onClick={() => {
                setConfirmDialogOpen(false);
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
