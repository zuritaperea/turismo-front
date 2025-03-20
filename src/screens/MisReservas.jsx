import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from "../axios/services/producto_turistico";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);  // Se obtiene el contexto del usuario autenticado
  const navigate = useNavigate();  // Para la redirección

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
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
        {reservas.length === 0 ? (
          <p className="text-gray-600">No tienes reservas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Visita</th>
                  <th className="p-3 text-left">Acceso</th>
                  <th className="p-3 text-left">Entrada</th>
                {/*    <th className="p-3 text-left">Salida</th> */}
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
                  {/*  <td className="p-3">{formatearFecha(reserva.attributes.end_date)}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MisReservas;
