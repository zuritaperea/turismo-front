import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from "../axios/services/recompensa";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Hourglass, XCircle, DollarSign, CreditCard } from "lucide-react";
import { Eye } from "lucide-react"; // ya que usás lucide-react
import funciones from "../extras/functions";
const renderEstado = (estado) => {
  switch (estado) {
    case "approved":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-green-600 bg-green-100 text-green-700 text-sm font-medium">
          <BadgeCheck className="w-4 h-4 mr-1" />
          Aprobada
        </span>
      );
   case "rejected":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-red-600 bg-red-100 text-red-700 text-sm font-medium">
          <XCircle className="w-4 h-4 mr-1" />
          Rechazada
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md border border-yellow-600 bg-yellow-100 text-yellow-700 text-sm font-medium">
          <Hourglass className="w-4 h-4 mr-1" />
          Pendiente
        </span>
      );
  }
};

const MisEvidencias = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);  // Se obtiene el contexto del usuario autenticado
  const navigate = useNavigate();  // Para la redirección
  const handleVer = (image) => {
    if (image && typeof image === "string" && image.startsWith("http")) {
      window.open(image, "_blank");
    } else {
      alert("La URL del archivo no es válida.");
    }
  };

  useEffect(() => {
    const fetchedEvidencias = async () => {
      if (!user) {
        // Si no hay usuario, redirigir al login
        setLoading(false);
        navigate('/login');
        return; // Detener la ejecución del efecto si no hay usuario
      }

      try {
        const response = await service.obtenerEvidencias();  // Traer las evidencias del servicio
        setReservas(response?.data?.data || []);  // Actualizar el estado con las reservas
        setLoading(false);
      } catch (error) {
        console.log("Hubo un error al cargar las evidencias");
        setLoading(false);
      }
    };

    fetchedEvidencias();
  }, [user, navigate]);  // Dependencias: 'user' y 'navigate'


  if (loading) {
    return <Splash />; // Mostrar el splash mientras cargan los datos
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Mis Evidencias</h2>
        <div className="mb-4">
          <button
            className="bg-principal text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => navigate('/cargar-evidencia')}
          >
            Cargar Evidencia
          </button>
        </div>
        {reservas.length === 0 ? (
          <p className="text-gray-600">No tienes evidencias registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Acción</th>
                  <th className="p-3 text-left">Commentario</th>
                  <th className="p-3 text-left">Ubicación</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-t border-gray-300">
                    <td className="p-3">
                      {reserva.attributes.sustainable_action_detail?.name || "-"}
                    </td>
                    <td className="p-3">
                      {reserva.attributes.comment || "-"}
                    </td>
                    <td className="p-3">{reserva.attributes.location}</td>
                    <td className="p-3">{funciones.formatearFecha(reserva.attributes.created_at)}</td>
                    <td className="p-3">  {renderEstado(reserva.attributes.status)}
                    </td>
                    <td className="p-3">
                        <div className="flex items-center justify-center h-full gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleVer(reserva.attributes.image)}
                            title="Ver archivo"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                         
                        </div>
                    </td>

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

export default MisEvidencias;
