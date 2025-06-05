
const ProductoTuristicoModal = ({ producto, onClose }) => {
    
    <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <div className="mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto pr-2">
            <div className="flex flex-col h-full">
              <Modal.Header onHide={() => setModalOpen(false)}>
                <span className="text-gray-200">Realizá tu reserva</span>
              </Modal.Header>
              <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">

                {isLoadingProducto ? <Spinner /> : (<>
                  <div className="mb-4 overflow-y-auto max-h-80 sm:max-h-80 md:max-h-96 lg:max-h-96 pr-2">
                    <h1 className="text-gray-200 font-bold">{producto.attributes.name}</h1>
                    <span className="text-gray-200">{producto.attributes.description}</span>

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
}