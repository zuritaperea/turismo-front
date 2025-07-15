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

  return (
    <div className="">
      <Modal show={show} onHide={onClose}>
        <div className="mx-auto max-w-5xl max-h-screen overflow-auto px-4">
          <div className="flex flex-col h-full">
            <Modal.Header onHide={onClose}>
              <span className="text-gray-200">
                {t('reservas.titulo_nueva')}
              </span>
            </Modal.Header>
            <Modal.Body className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 ">

              {!producto || isLoadingProducto ? <Spinner /> : (<>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 pr-2 overflow-y-auto">
                  {/* Columna izquierda: info del producto */}
                  <div className="overflow-y-auto ">
                    <h1 className="text-gray-200 font-bold">{producto.attributes.name}</h1>
                    <p className="text-gray-200">{producto.attributes.description}</p>

                    {producto.attributes.contenidos?.length > 0 && (
                      <div className="my-4">
                        <Carousel images={producto.attributes.contenidos} detail={true} />
                      </div>
                    )}

                    {producto.attributes.amenity_feature_includes.length > 0 && (
                      <>
                        <span className="text-gray-200 font-semibold">{t("reservas.servicios_incluidos")}</span>
                        <Tags elementos={producto.attributes.amenity_feature_includes} className="border-2 border-gray-200" />
                      </>
                    )}

                    {producto.attributes.amenity_feature_does_not_include.length > 0 && (
                      <>
                        <span className="text-gray-200 font-semibold">{t("reservas.no_incluye")}</span>
                        <Tags elementos={producto.attributes.amenity_feature_does_not_include} className="border-2 border-gray-200" />
                      </>
                    )}
                  </div>

                  {/* Columna derecha: inputs de reserva */}
                  <div className="flex flex-col gap-4 overflow-y-auto ">
                    <h3 className="text-md font-semibold mb-2 text-gray-200">
                      {isAlojamiento
                        ? isReadOnly ? t("reservas.rango_fechas") : t("reservas.seleccionar_rango")
                        : isReadOnly ? t("reservas.fecha_seleccionada") : t("reservas.seleccionar_fecha")}
                    </h3>

                    <div className="mb-4">
                      {isAlojamiento ? (
                        <DateRange
                          editableDateInputs={!isReadOnly}
                          onChange={(item) => {
                            setDateRange([item.selection]);
                          }}
                          moveRangeOnFirstSelection={false}
                          ranges={
                            dateRange?.length
                              ? dateRange
                              : [
                                {
                                  startDate: minDate,
                                  endDate: minDate,
                                  key: 'selection',
                                },
                              ]
                          }
                          locale={es}
                          minDate={minDate}
                          maxDate={maxDate}
                          className="rounded border shadow"
                        />

                      ) : (
                        <Calendar
                          date={dateRange[0]?.startDate || minDate}
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
                          className="rounded border shadow"
                        />
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
                    {!cantidadPersonasFuePasada && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          {t("reservas.cantidad_personas")}
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

                    <FormularioAcompaniantes
                      cantidadPersonas={cantidadPersonas}
                      acompaniantes={acompaniantes}
                      setAcompaniantes={setAcompaniantes}
                    />
                  </div>
                </div>
              </>)}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-center w-full mb-4">
                <div
                  className={`text-white rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors ${isLoadingReserva ? "bg-gray-400" : "bg-principal"
                    }`}
                  style={{
                    cursor: botonHabilitado ? "pointer" : "not-allowed",
                    pointerEvents: "auto"
                  }}
                  onClick={botonHabilitado ? handleReservar : undefined}
                >
                  {isLoadingReserva ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {t("reservas.reservando")}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5 mr-1" />
                      {t("reservas.reservar")}
                    </>
                  )}
                </div>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal></div>
  );
};

export default ProductoTuristicoModal;