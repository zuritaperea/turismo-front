import React, { useEffect, useState, useContext } from "react";
import Modal from "../../Modal.js";
import service from "../../../axios/services/producto_turistico.js";
import { AuthContext } from "../../AuthContext.js";
import { useNavigate } from "react-router-dom";
import funciones from "../../../extras/functions.js";
import ProductoTuristicoCard from "./ProductoTuristicoCard";
import ProductoTuristicoModal from "./ProductoTuristicoModal.js";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation();
  // Estados y funciones para manejar el modal y la reserva
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
      alert(t("reservas.error_no_autenticado"));
      //agregar la url actual para poder volver despues de iniciar sesión
      localStorage.setItem("redirectAfterLogin", window.location.href);
      navigate("/login");
      return;
    }

    const persona = user.profile.find((p) => p.type === "Persona");
    if (!selectedStartDate || !selectedEndDate) {
      alert(t("reservas.error_fechas_obligatorias"));
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
        alert(t("reservas.error_creacion_reserva"));
      }
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert(t("reservas.error_creacion_reserva"));
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

  const productosFiltrados = listData
  .filter((p) => p.active)
  .filter((p) => isDentroDeRango(p, fechaDesde, fechaHasta))
  .filter((p) => p.integrates_discount_passport === esPasaporte)
  .filter((p) => p.maximum_number_persons <= cantidadPersonas);

  return (
    <div className="mb-20">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        {t('reservas.titulo_nueva')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto_turistico, index) => (
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
        <ProductoTuristicoModal
          producto={productoTuristico}
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          isAlojamiento={isAlojamiento}
          isReadOnly={isReadOnly}
          isLoadingProducto={isLoadingProducto}
          dateRange={dateRange}
          setDateRange={setDateRange}
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          inicio={inicio}
          final={final}
          tieneHorariosConfigurados={tieneHorariosConfigurados}
          hayHorariosParaElDia={hayHorariosParaElDia}
          horariosDisponibles={horariosDisponibles}
          intervaloMinutos={intervaloMinutos}
          setSelectedStartDate={setSelectedStartDate}
          setSelectedEndDate={setSelectedEndDate}
          cantidadProducto={cantidadProducto}
          setCantidadProducto={setCantidadProducto}
          cantidadPersonas={cantidadPersonas}
          setCantidadPersonas={setCantidadPersonas}
          cantidadPersonasFuePasada={cantidadPersonasFuePasada}
          acompaniantes={acompaniantes}
          setAcompaniantes={setAcompaniantes}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          isLoadingReserva={isLoadingReserva}
          handleReservar={handleReservar}
        />
      )}

      {confirmDialogOpen && reservaId && (
        <Modal show={confirmDialogOpen} onHide={() => setConfirmDialogOpen(false)}>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">{t('reservas.realizada')}</h2>
            <p className="text-lg text-gray-200">
              {t('reservas.numero')}: <span className="font-bold">{reservaId}</span>
            </p>
            <button
              className="mt-6 bg-[#f08400] text-white px-6 py-2 rounded-lg text-lg"
              onClick={() => {
                setConfirmDialogOpen(false);
                navigate(`/reserva/${reservaId}`); // Redirigir a la página de detalles de la reserva 
              }}
            >
              {t('reservas.aceptar')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListaProductosTuristicos;
