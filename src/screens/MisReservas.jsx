import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchedReservas = [
      { id: 1, alojamiento: "Hotel Las Brisas", entrada: "2025-04-15", salida: "2025-04-20", estado: "Confirmada" },
      { id: 2, alojamiento: "Cabañas del Bosque", entrada: "2025-05-10", salida: "2025-05-15", estado: "Pendiente" },
      { id: 3, alojamiento: "Resort Playa Azul", entrada: "2025-06-05", salida: "2025-06-10", estado: "Cancelada" },
    ];
    setReservas(fetchedReservas);
  }, []);

  const cancelarReserva = (id) => {
    setReservas(prevReservas =>
      prevReservas.map(reserva =>
        reserva.id === id ? { ...reserva, estado: "Cancelada" } : reserva
      )
    );
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
                  <th className="p-3 text-left">Alojamiento</th>
                  <th className="p-3 text-left">Entrada</th>
                  <th className="p-3 text-left">Salida</th>
                  <th className="p-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id} className="border-t border-gray-300">
                    <td className="p-3">{reserva.alojamiento}</td>
                    <td className="p-3">{reserva.entrada}</td>
                    <td className="p-3">{reserva.salida}</td>
                    <td className={`p-3 font-semibold ${reserva.estado === "Cancelada" ? "text-red-500" : "text-green-600"}`}>{reserva.estado}</td>
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
