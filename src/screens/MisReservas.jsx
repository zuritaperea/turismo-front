import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from "../axios/services/producto_turistico";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Hourglass, XCircle, DollarSign, CreditCard } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Eye, Trash2 } from "lucide-react"; // ya que usás lucide-react
import Table from "../components/Table";
const renderEstado = (estado) => {
  switch (estado) {
    case "APROBADA":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-green-600 bg-green-100 text-green-700 text-sm font-medium">
          <BadgeCheck className="w-4 h-4 mr-1" />
          Aprobada
        </span>
      );
    case "PAGADA":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-green-900 bg-green-200 text-green-800 text-sm font-medium">
          <DollarSign className="w-4 h-4 mr-1" />
          Pagada
        </span>
      );
    case "DEPOSITO":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-blue-600 bg-blue-100 text-blue-700 text-sm font-medium">
          <CreditCard className="w-4 h-4 mr-1" />
          Depósito
        </span>
      );
    case "CANCELADA":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-red-600 bg-red-100 text-red-700 text-sm font-medium">
          <XCircle className="w-4 h-4 mr-1" />
          Cancelada
        </span>
      );
    case "PENDIENTE":
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-yellow-600 bg-yellow-100 text-yellow-700 text-sm font-medium">
          <Hourglass className="w-4 h-4 mr-1" />
          Pendiente
        </span>
      );
  }
};

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);  // Se obtiene el contexto del usuario autenticado
  const navigate = useNavigate();  // Para la redirección
  const handleVer = (reserva) => {
    // Redirigir o mostrar modal
    console.log("Ver reserva:", reserva.id);
    navigate(`/reserva/${reserva.id}`); // Redirigir a la página de detalles de la reserva 
  };

  const handleEliminar = async (reserva) => {
    if (window.confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
      if (reserva.id) {
        try {
          await service.cancelarReserva(reserva.id);

          // Actualizar el estado local cambiando solo esa reserva a "CANCELADA"
          setReservas((prevReservas) =>
            prevReservas.map((r) =>
              r.id === reserva.id
                ? {
                  ...r,
                  attributes: {
                    ...r.attributes,
                    estado: "CANCELADA",
                  },
                }
                : r
            )
          );
        } catch (error) {
          console.error("Error al cancelar la reserva:", error);
          alert("Hubo un problema al cancelar la reserva.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchedReservas = async () => {
      if (!user) {
        // Si no hay usuario, redirigir al login
        setLoading(false);
        navigate('/login');
        return; // Detener la ejecución del efecto si no hay usuario
      }

      try {
        const response = await service.obtenerMisReservas();  // Traer las reservas del servicio
        setReservas(response?.data?.data || []);  // Actualizar el estado con las reservas
        setLoading(false);
      } catch (error) {
        console.log("Hubo un error al cargar las reservas");
        setLoading(false);
      }
    };

    fetchedReservas();
  }, [user, navigate]);  // Dependencias: 'user' y 'navigate'

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";

    // Crear un objeto Date a partir de la fecha ISO
    const fecha = new Date(fechaISO);

    // Configurar opciones para obtener la fecha y hora de acuerdo con la zona horaria local
    const opcionesFecha = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Para formato 24 horas
    };

    // Formatear la fecha y hora en el formato dd/mm/yyyy hh:mm
    const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString("es-AR", opcionesHora);

    // Devolver la fecha formateada como dd/mm/yyyy hh:mm
    // return `${fechaFormateada} ${horaFormateada}`;
    return `${fechaFormateada}`;
  };

  if (loading) {
    return <Splash />; // Mostrar el splash mientras cargan los datos
  }

  return (
    <>     
     <Header />

        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
          {reservas.length === 0 ? (
            <p className="text-gray-600">No tienes reservas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table responsive className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Objeto</th>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-left">Entrada</th>
                    <th className="p-3 text-left">Salida</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="border-t border-gray-300">
                      <td className="p-3">
                        {reserva.attributes.producto_turistico?.objeto?.attributes?.name || "-"}
                      </td>
                      <td className="p-3">
                        {reserva.attributes.producto_turistico?.name || "-"}
                      </td>
                      <td className="p-3">{formatearFecha(reserva.attributes.start_date)}</td>
                      <td className="p-3">{formatearFecha(reserva.attributes.end_date)}</td>
                      <td className="p-3">  {renderEstado(reserva.attributes.estado)}
                      </td>
                      <td className="p-3">
                        {reserva.attributes.estado !== "CANCELADA" && (
                          <div className="flex items-center justify-center h-full gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleVer(reserva)}
                              title="Ver reserva"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleEliminar(reserva)}
                              title="Cancelar reserva"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
      </div>      <Footer />
    </>
  );
};

export default MisReservas;
