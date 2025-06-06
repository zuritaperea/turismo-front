import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from "../axios/services/producto_turistico";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, Hourglass, XCircle, DollarSign, CreditCard, Trash2 } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { SeccionDescripcionMultilingue } from "../components/DescripcionBilingue";

const renderEstado = (estado) => {
  switch (estado) {
    case "APROBADA":
      return <span className="inline-flex items-center px-2 py-1 rounded-md border border-green-600 bg-green-100 text-green-700 text-sm font-medium"><BadgeCheck className="w-4 h-4 mr-1" />Aprobada</span>;
    case "PAGADA":
      return <span className="inline-flex items-center px-2 py-1 rounded-md border border-green-900 bg-green-200 text-green-800 text-sm font-medium"><DollarSign className="w-4 h-4 mr-1" />Pagada</span>;
    case "DEPOSITO":
      return <span className="inline-flex items-center px-2 py-1 rounded-md border border-blue-600 bg-blue-100 text-blue-700 text-sm font-medium"><CreditCard className="w-4 h-4 mr-1" />Depósito</span>;
    case "CANCELADA":
      return <span className="inline-flex items-center px-2 py-1 rounded-md border border-red-600 bg-red-100 text-red-700 text-sm font-medium"><XCircle className="w-4 h-4 mr-1" />Cancelada</span>;
    case "PENDIENTE":
    default:
      return <span className="inline-flex items-center px-2 py-1 rounded-md border border-yellow-600 bg-yellow-100 text-yellow-700 text-sm font-medium"><Hourglass className="w-4 h-4 mr-1" />Pendiente</span>;
  }
};

const Reserva = () => {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEliminar = async (reserva) => {
    if (window.confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
      try {
        await service.cancelarReserva(reserva.id);
        setReserva((r) => ({
          ...r,
          attributes: { ...r.attributes, estado: "CANCELADA" },
        }));
      } catch (error) {
        console.error("Error al cancelar la reserva:", error);
        alert("Hubo un problema al cancelar la reserva.");
      }
    }
  };

  useEffect(() => {
    const fetchedReserva = async () => {
      if (!user) {
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        const response = await service.obtenerReserva(id);
        setReserva(response?.data?.data || []);
        setLoading(false);
      } catch (error) {
        console.log("Hubo un error al cargar las reservas");
        setLoading(false);
      }
    };
    fetchedReserva();
  }, [user, navigate]);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    return fecha.toLocaleDateString("es-AR", opcionesFecha);
  };

  const safeText = (text) => text || "-";

  if (loading) return <Splash />;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Reserva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reserva === null ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error mostrando reserva</div>
            ) : (
              <>
                <div className="space-y-4">

                  <div className="flex items-center gap-2">{renderEstado(reserva.attributes.estado)}</div>
                  <div className="text-gray-600 text-sm mb-4 "><span className="font-bold">Número de Reserva: </span>{reserva.id}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Fecha de Entrada</h3>
                      <p className="text-gray-600">{formatearFecha(reserva.attributes.start_date)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Fecha de Salida</h3>
                      <p className="text-gray-600">{formatearFecha(reserva.attributes.end_date)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Cantidad</h3>
                      <p className="text-gray-600">{reserva.attributes.cantidad}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Titular</h2>
                    <div className="grid md:grid-cols-2 gap-2">
                      <p className="text-gray-700"><strong>Nombre:</strong> {safeText(reserva.attributes.titular.nombre)} {safeText(reserva.attributes.titular.apellido)}</p>
                      <p className="text-gray-700"><strong>DNI:</strong> {safeText(reserva.attributes.titular.documento_identidad)}</p>
                      <p className="text-gray-700"><strong>Email:</strong> {safeText(reserva.attributes.titular.correo_electronico)}</p>
                      <p className="text-gray-700"><strong>Teléfono:</strong> {safeText(reserva.attributes.titular.telefono)}</p>
                    </div>
                  </div>
             

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Objeto</h2>
                    <p className="text-gray-700 font-medium">{safeText(reserva.attributes.producto_turistico.objeto.attributes.name)}</p>

                    {reserva.attributes.producto_turistico.objeto.attributes.image_url && (
                      <img
                        src={process.env.REACT_APP_API_URL + reserva.attributes.producto_turistico.objeto.attributes.image_url}
                        alt={reserva.attributes.producto_turistico.objeto.attributes.name}
                        className="w-full max-w-md rounded shadow-md mb-3"
                      />
                    )}
                    <p className="text-gray-500"><SeccionDescripcionMultilingue descripcion={safeText(reserva.attributes.producto_turistico.objeto.attributes.description)} /></p>
                   </div>
                   <p className="text-sm text-gray-500 mt-2">
                      <span className="font-bold">Ubicación: </span>
                      <a
                        href={`https://www.google.com/maps?q=${reserva.attributes.producto_turistico.objeto.attributes.point.latitude},${reserva.attributes.producto_turistico.objeto.attributes.point.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver en Google Maps
                      </a>
                    </p>
                    {reserva.attributes.producto_turistico.objeto.attributes.start_date && (
                      <p className="text-sm text-gray-600">
                        Fecha del evento: {formatearFecha(reserva.attributes.producto_turistico.objeto.attributes.start_date)} - {formatearFecha(reserva.attributes.producto_turistico.objeto.attributes.end_date)}
                      </p>
                    )}
                   </div>
                {/* COLUMNA 2 */}
                <div className="space-y-4">
                    
                  

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Producto Reservado</h2>
                    <p className="text-gray-700 font-medium">{safeText(reserva.attributes.producto_turistico.name)}</p>
                    <p className="text-gray-500">{safeText(reserva.attributes.producto_turistico.description)}</p>
                  </div>

                  {reserva.attributes.acompaniante.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Acompañantes</h2>
                      <ul className="space-y-2">
                        {reserva.attributes.acompaniante.map((a, index) => (
                          <li key={index} className="border rounded p-3 bg-gray-50">
                            <p className="text-gray-700"><strong>Nombre:</strong> {safeText(a.nombre)} {safeText(a.apellido)}</p>
                            <p className="text-gray-700"><strong>DNI:</strong> {safeText(a.documento_identidad)}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {safeText(a.correo_electronico)}</p>
                            <p className="text-gray-700"><strong>Teléfono:</strong> {safeText(a.telefono)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-4 mt-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Código QR para validar</h2>
                      <QRCodeSVG value={`${process.env.REACT_APP_API_URL}/admin/reserva/reserva/${reserva.id}/`} size={128} />
                    </div>

                    <button
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      onClick={() => handleEliminar(reserva)}
                    >
                      <Trash2 className="w-5 h-5" /> Cancelar Reserva
                    </button>
                  </div>
                </div>
              </>
            )}
          </div> {/* cierre grid */}
        </div> {/* cierre card */}
      </div> {/* cierre container */}
      <Footer />
    </div>
  );
};

export default Reserva;
