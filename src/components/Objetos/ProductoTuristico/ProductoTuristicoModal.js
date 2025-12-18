import React from "react";
import Modal from "../../Modal";
import { Calendar } from "react-date-range";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import Spinner from "../../Spinner"; // si usás uno
import { ArrowUpRight } from "lucide-react";
import Tags from "../Tags";
import FormularioAcompaniantes from "./FormularioAcompaniantes";
import Carousel from "../../Carousel";
import { useTranslation } from "react-i18next";
import { calcularRangoReservable } from "./FechasReservables";
import { eachDayOfInterval } from "date-fns";

const ProductoTuristicoModal = ({
  producto,
  show,
  onClose,
  isAlojamiento,
  isReadOnly,
  isLoadingProducto,
  dateRange,
  setDateRange,
  fechaDesde,
  fechaHasta,
  inicio,
  final,
  tieneHorariosConfigurados,
  hayHorariosParaElDia,
  horariosDisponibles,
  intervaloMinutos,
  setSelectedStartDate,
  setSelectedEndDate,
  cantidadProducto,
  setCantidadProducto,
  cantidadPersonas,
  setCantidadPersonas,
  cantidadPersonasFuePasada,
  acompaniantes,
  setAcompaniantes,
  selectedStartDate,
  selectedEndDate,
  isLoadingReserva,
  handleReservar,
}) => {
  const { t } = useTranslation();
  const { minDate, maxDate, warnings } = calcularRangoReservable({
    fechaDesde,
    fechaHasta,
    producto,
    inicio,
    final
  });
  const botonHabilitado =
    selectedStartDate &&
    selectedEndDate &&
    !isLoadingReserva &&
    (!tieneHorariosConfigurados || (hayHorariosParaElDia && selectedStartDate instanceof Date)) &&
    warnings.length === 0;
  const isDiaHabilitado = (date) => {
    if (!tieneHorariosConfigurados) return true;

    const horariosConfig = producto?.attributes?.horarios_disponibles;
    if (!horariosConfig || horariosConfig.length === 0) return false;

    const jsDay = date.getDay(); // 0=domingo
    const adjustedDay = (jsDay + 6) % 7; // 0=lunes, 6=domingo

    return horariosConfig.some(h => h.dia_semana === adjustedDay);
  };
  const disabledDates = React.useMemo(() => {
  if (!tieneHorariosConfigurados || !minDate || !maxDate) return [];

  return eachDayOfInterval({ start: minDate, end: maxDate })
    .filter(date => !isDiaHabilitado(date));
}, [tieneHorariosConfigurados, minDate, maxDate, producto]);
  return (
    <div className="" style={{ zIndex: 1000 }}>
      <Modal show={show} onHide={onClose}>
        <div className="flex flex-col h-full max-h-screen overflow-y-auto" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
          <Modal.Header onHide={onClose}>
            <span className="text-gray-200">
              {t('reservas.titulo_nueva')}
            </span>
          </Modal.Header>
          <Modal.Body className="flex-grow" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>

            {!producto || isLoadingProducto ? <Spinner /> : (<>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Columna izquierda: info del producto */}
                <div className="">
                  <h1 className="text-gray-200 font-bold text-xl mb-4">{producto.attributes.name}</h1>

                  {producto.attributes.contenidos?.length > 0 && (
                    <div className="mb-4">
                      <Carousel images={producto.attributes.contenidos} />
                    </div>
                  )}

                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 leading-relaxed text-sm">{producto.attributes.description}</p>
                  </div>

                  <div className="space-y-4">
                    {producto.attributes.amenity_feature_includes.length > 0 && (
                      <div className="bg-green-900 bg-opacity-30 rounded-lg p-3">
                        <span className="text-green-300 font-semibold block mb-2">{t("reservas.servicios_incluidos")}</span>
                        <Tags elementos={producto.attributes.amenity_feature_includes} className="border-2 border-green-400" />
                      </div>
                    )}

                    {producto.attributes.amenity_feature_does_not_include.length > 0 && (
                      <div className="bg-red-900 bg-opacity-30 rounded-lg p-3">
                        <span className="text-red-300 font-semibold block mb-2">{t("reservas.no_incluye")}</span>
                        <Tags elementos={producto.attributes.amenity_feature_does_not_include} className="border-2 border-red-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna derecha: inputs de reserva */}
                <div className="overflow-visible">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 overflow-visible">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">
                      {isAlojamiento
                        ? isReadOnly ? t("reservas.rango_fechas") : t("reservas.seleccionar_rango")
                        : isReadOnly ? t("reservas.fecha_seleccionada") : t("reservas.seleccionar_fecha")}
                    </h3>

                    <div className="mb-4 overflow-visible modal-calendar-container">
                      {isAlojamiento ? (
                        <div className="overflow-visible relative z-10">
                          <DateRange
                            editableDateInputs={!isReadOnly}
                            onChange={(item) => setDateRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={
                              dateRange?.length
                                ? dateRange
                                : [{
                                  startDate: minDate,
                                  endDate: minDate,
                                  key: "selection"
                                }]
                            }
                            locale={es}
                            minDate={minDate}
                            maxDate={maxDate}
                            disabledDates={disabledDates}
                            scroll={{ enabled: false }}
                            months={1}
                            className="rounded border shadow w-full"
                            style={{
                              position: 'relative',
                              zIndex: 10,
                              overflow: 'visible'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="overflow-visible relative z-10">
                          <Calendar
                            date={dateRange?.[0]?.startDate || minDate}
                            onChange={(date) => {
                              const start = new Date(date);
                              const end = new Date(date);
                              end.setHours(23, 59, 59, 999);
                              setDateRange([{ startDate: start, endDate: end, key: "selection" }]);
                            }}
                            locale={es}
                            disabled={isReadOnly}
                            color="#111827"
                            minDate={minDate}
                            maxDate={maxDate}
                            disabledDay={(date) => !isDiaHabilitado(date)}
                            className="rounded border shadow w-full"
                            style={{
                              position: 'relative',
                              zIndex: 10,
                              overflow: 'visible'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {warnings.length > 0 && (
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded border border-yellow-300 my-4">
                        {warnings.map((msg, i) => (
                          <p key={i} className="text-sm">{msg}</p>
                        ))}
                      </div>
                    )}
                    {tieneHorariosConfigurados && hayHorariosParaElDia && horariosDisponibles && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          {t("reservas.horario_disponible")}
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
                          <option value="">{t("reservas.seleccionar_horario")}</option>
                          {Object.entries(horariosDisponibles).map(([hora, disponible]) =>
                            disponible > 0 ? (
                              <option key={hora} value={hora}>
                                {hora}
                              </option>
                            ) : null
                          )}
                        </select>
                      </div>
                    )}

                    {tieneHorariosConfigurados && !hayHorariosParaElDia && (
                      <p className="text-sm text-yellow-300 mt-2">
                        {t("reservas.no_hay_horarios")}
                      </p>)}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        {t("reservas.cantidad_reservar")}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={cantidadProducto}
                        onChange={(e) => setCantidadProducto(Number(e.target.value))}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    {!cantidadPersonasFuePasada && producto?.attributes?.maximum_number_persons > 1 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          {t("reservas.cantidad_personas")}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={producto?.attributes?.maximum_number_persons}
                          value={cantidadPersonas}
                          onChange={(e) => setCantidadPersonas(Number(e.target.value))}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    )}

                    <FormularioAcompaniantes
                      cantidadPersonas={cantidadPersonas}
                      acompaniantes={acompaniantes}
                      setAcompaniantes={setAcompaniantes}
                    />
                  </div>
                </div>
              </div>
            </>)}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-center w-full">
              <button
                className={`mb-6 text-white rounded-xl py-4 px-8 flex items-center font-semibold text-lg transition-all duration-300 shadow-lg transform ${isLoadingReserva
                  ? "bg-gray-500 cursor-not-allowed"
                  : botonHabilitado
                    ? "bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-xl cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed opacity-50"
                  }`}
                disabled={!botonHabilitado || isLoadingReserva}
                onClick={botonHabilitado ? handleReservar : undefined}
              >
                {isLoadingReserva ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {t("reservas.reservando")}
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    {t("reservas.reservar")}
                  </>
                )}
              </button>
            </div>
          </Modal.Footer>
        </div>
      </Modal></div>
  );
};

export default ProductoTuristicoModal;