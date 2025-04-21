import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import service from "../axios/services/producto_turistico";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, Hourglass, XCircle, DollarSign, CreditCard } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Eye, Trash2 } from "lucide-react"; // ya que usás lucide-react
import {QRCodeSVG } from 'qrcode.react';

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

const Reserva = () => {
  const { id } = useParams(); // Obtener el ID de la reserva desde la URL
  const [reserva, setReserva] = useState(null); // Estado para almacenar la reserva
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);  // Se obtiene el contexto del usuario autenticado
  const navigate = useNavigate();  // Para la redirección

  const handleEliminar = async (reserva) => {
    if (window.confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
      if (reserva.id) {
        try {
          await service.cancelarReserva(reserva.id);

          // Actualizar el estado local cambiando solo esa reserva a "CANCELADA"
          setReserva((r) =>
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
        } catch (error) {
          console.error("Error al cancelar la reserva:", error);
          alert("Hubo un problema al cancelar la reserva.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchedReserva = async () => {
      if (!user) {
        // Si no hay usuario, redirigir al login
        setLoading(false);
        navigate('/login');
        return; // Detener la ejecución del efecto si no hay usuario
      }

      try {
        const response = await service.obtenerReserva(id);  // Traer las reservas del servicio
        setReserva(response?.data?.data || []);  // Actualizar el estado con las reservas
        setLoading(false);
      } catch (error) {
        console.log("Hubo un error al cargar las reservas");
        setLoading(false);
      }
    };

    fetchedReserva();
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
        {reserva === null ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Error mostrando reserva</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reserva</h2>

            <div className="max-w-4xl mx-auto bg-white space-y-6">

              {/* Estado de la reserva */}
              <div className="flex items-center gap-2">
                {renderEstado(reserva.attributes.estado)}
              </div>

              {/* Producto turístico */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Producto Turístico</h2>
                <p className="text-gray-700 font-medium">{reserva.attributes.producto_turistico.name}</p>
                <p className="text-gray-500">{reserva.attributes.producto_turistico.description}</p>
              </div>

              {/* Objeto (Evento, etc.) */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Objeto</h2>
                {reserva.attributes.producto_turistico.objeto.attributes.image_url && <img
                  src={reserva.attributes.producto_turistico.objeto.attributes.image_url ? process.env.REACT_APP_API_URL + reserva.attributes.producto_turistico.objeto.attributes.image_url : null}
                  alt={reserva.attributes.producto_turistico.objeto.attributes.name}
                  className="w-full max-w-md rounded shadow-md mb-3"
                />}
                <p className="text-gray-700 font-medium">{reserva.attributes.producto_turistico.objeto.attributes.name}</p>
                <p className="text-gray-500">{reserva.attributes.producto_turistico.objeto.attributes.description}</p>
                <p className="text-sm text-gray-600">Ubicación: {reserva.attributes.producto_turistico.objeto.attributes.location}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {formatearFecha(reserva.attributes.producto_turistico.objeto.attributes.start_date)} - {formatearFecha(reserva.attributes.producto_turistico.objeto.attributes.end_date)}
                </p>
              </div>

              {/* Fechas de reserva */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Fecha de Entrada</h3>
                  <p className="text-gray-600">{formatearFecha(reserva.attributes.start_date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Fecha de Salida</h3>
                  <p className="text-gray-600">{formatearFecha(reserva.attributes.end_date)}</p>
                </div>
              </div>

              {/* Titular */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Titular</h2>
                <p className="text-gray-700"><strong>Nombre:</strong> {reserva.attributes.titular.nombre} {reserva.attributes.titular.apellido}</p>
                <p className="text-gray-700"><strong>DNI:</strong> {reserva.attributes.titular.documento_identidad}</p>
                <p className="text-gray-700"><strong>Email:</strong> {reserva.attributes.titular.correo_electronico}</p>
                <p className="text-gray-700"><strong>Teléfono:</strong> {reserva.attributes.titular.telefono}</p>
              </div>

              {/* Acompañantes */}
              {reserva.attributes.acompaniante.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Acompañantes</h2>
                  <ul className="space-y-2">
                    {reserva.attributes.acompaniante.map((a, index) => (
                      <li key={index} className="border rounded p-3 bg-gray-50">
                        <p className="text-gray-700"><strong>Nombre:</strong> {a.nombre} {a.apellido}</p>
                        <p className="text-gray-700"><strong>DNI:</strong> {a.documento_identidad}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {a.correo_electronico}</p>
                        <p className="text-gray-700"><strong>Teléfono:</strong> {a.telefono}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
<div className="mt-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Código QR para validar</h2>
  <QRCodeSVG value={`${process.env.REACT_APP_API_URL}/admin/reserva/${reserva.id}/`} size={128} />
</div>
              <button
                className="text-red-600 hover:text-red-800 flex"
                onClick={() => handleEliminar(reserva)}
                title="Cancelar reserva"
              >
                <Trash2 className="w-5 h-5" /> Cancelar Reserva
              </button>

            </div>


          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Reserva;
