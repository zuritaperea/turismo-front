import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from '../axios/services/producto_turistico';
import Splash from '../components/Splash';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedReservas = async () => {
      try {
        const response = await service.obtenerMisReservas();
        setReservas(response?.data?.data ? [response.data.data] : []);
        setLoading(false);
      } catch (error) {
        console.log('Hubo un error al cargar las reservas');
        setLoading(false);
      }
    };
    fetchedReservas();
  }, []);

  const cancelarReserva = (id) => {
    setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== id));
  };

  if (loading) {
    return <Splash />;
  }

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " " + fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
        {reservas.length === 0 ? (
          <p className="text-gray-600">No tienes reservas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Visita</th>
                  <th className="p-3 text-left">Entrada</th>
                  <th className="p-3 text-left">Salida</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id} className="border-t border-gray-300">
                    <td className="p-3">{reserva.attributes.producto_turistico?.name || "-"}</td>
                    <td className="p-3">{formatearFecha(reserva.attributes.start_date)}</td>
                    <td className="p-3">{formatearFecha(reserva.attributes.end_date)}</td>
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
