import React, { useEffect, useState, useContext } from "react";
import fidiApi from "../axios/services/fidi"; // Servicio API
import { Ticket, ArrowUpRight } from "lucide-react";
import { DatePickerComponent } from "./DatePicker.tsx";
import { Link } from "react-router-dom";
import Modal from './Modal.js';
import Button from './Button.js';
import { AuthContext } from "./AuthContext";
import { useNavigate } from 'react-router-dom';


const ActividadesLista = ({ idAtractivo }) => {
    const [actividades, setActividades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedActividad, setSelectedActividad] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [personaDenominacion, setPersonaDenominacion] = useState(null);

    // Fechas fijas a mostrar
    const fechasDisponibles = ["2025-03-19", "2025-03-20", "2025-03-21", "2025-03-22"];
    const [reservaConfirmada, setReservaConfirmada] = useState(null);
    const handleReservar = async () => {
        if (!user) {
            // Si no hay usuario, muestra un mensaje o redirige a login
            alert("¡Por favor, inicia sesión para realizar una reserva!");
            return; // Detiene la ejecución de la reserva si no hay usuario
        }
    
        const reservaData = {
            cdgbtms_atrativo: idAtractivo,
            cdgbtms_atividade: selectedActividad?.cdgbtms,
            data: new Date(selectedDate).toLocaleDateString('es-AR'),  // Asegúrate de que 'data' esté en el formato adecuado
            hora: selectedHorario,
            nome: personaDenominacion,
          };
          
          try {
            const response = await fidiApi.hacerReserva(reservaData);
            const reservaConfirmada = response.data.info[0];
    
            // Incluye nombre de la actividad y nombre de la persona
            const reservaDetalles = {
                reserva_num: reservaConfirmada.reserva_num,
                data: reservaConfirmada.data,
                hora: reservaConfirmada.hora,
                personaDenominacion: personaDenominacion, // Nombre de la persona
                nome_atividade: selectedActividad?.nome, // Nombre de la actividad, si está disponible
            };
    
            // Redirigir a la página de confirmación de reserva
            navigate('/confirmacion-reserva-fidi', { state: { reservaConfirmada: reservaDetalles } });
        } catch (error) {
            console.error('Error al hacer la reserva', error);
        }
    };
    
    
    useEffect(() => {
        if (user?.profile?.length > 0) {
            const persona = user.profile.find(p => p.type === "Persona");
            if (persona && persona.attributes.nombre && persona.attributes.apellido) {
                setPersonaDenominacion(`${persona.attributes.nombre} ${persona.attributes.apellido}`);
            } else {
                setPersonaDenominacion(user?.username);
            }
        } else {
            setPersonaDenominacion(user?.username);
        }
    }, [user]);

    useEffect(() => {
        const obtenerActividades = async () => {
            try {
                setLoading(true);
                const response = await fidiApi.obtenerActividades(idAtractivo);
                setActividades(response.data.data.dados);
            } catch (error) {
                setError("Hubo un error al cargar las actividades");
            } finally {
                setLoading(false);
            }
        };

        if (idAtractivo) {
            obtenerActividades();
        }
    }, [idAtractivo]);

    useEffect(() => {
        const obtenerHorarios = async () => {
            if (selectedActividad && selectedDate) {
                try {
                    // Convertir selectedDate a formato dd-mm-yyyy
                    const formattedDate = new Date(selectedDate).toLocaleDateString('es-AR'); // Aquí usas el formato adecuado para Argentina
                    const response = await fidiApi.obtenerHorarios(selectedActividad.cdgbtms, formattedDate);
                    setHorarios(Object.entries(response.data.data.dados[0].vagas));
                } catch (error) {
                    setHorarios([]);
                }
            }
        };
        obtenerHorarios();
    }, [selectedDate, selectedActividad]);


    if (loading) return <p>Cargando actividades...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                Actividades Disponibles
            </div>

            {actividades.map((actividad) => (
                <div className="p-4 cursor-pointer" key={actividad.cdgbtms} onClick={() => setSelectedActividad(actividad) || setModalOpen(true)}>
                    <div className="max-w-md mx-auto rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
                        <div className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="rounded-md text-[#f08400]">
                                    <Ticket size={24} style={{ color: "#f08400" }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-[#101828] mb-1">
                                        {actividad.nome}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-[#475467] mt-4 mb-6 text-lg">
                                {actividad.primeira_saida && actividad.ultima_saida && `${actividad.primeira_saida} a ${actividad.ultima_saida}`}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* MODAL */}
            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header onHide={() => setModalOpen(false)}>Seleccionar Fecha y Horario</Modal.Header>
                <Modal.Body>

                    {/* Selección de Fecha */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold mb-2">Selecciona una fecha:</h3>
                        <div className="flex gap-2">
                            {fechasDisponibles.map((fecha) => (
                                <button
                                    key={fecha}
                                    onClick={() => setSelectedDate(fecha)}
                                    className={`px-4 py-2 rounded-md border ${selectedDate === fecha ? "bg-principal text-white" : "border-gray-300"
                                        }`}
                                >
                                    {new Date(fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista de Horarios */}
                    {selectedDate && (
                        <div>
                            <h3 className="text-md font-semibold mb-2">Horarios Disponibles</h3>
                            <ul className="list-group">
                                {horarios.length > 0 ? (
                                    horarios.map(([hora, cupos]) => (
                                        <li
                                            key={hora}
                                            className={`list-group-item cursor-pointer ${selectedHorario === hora ? "bg-principal text-white" : "hover:bg-light"}`}
                                            onClick={() => setSelectedHorario(hora)}
                                        >
                                            {hora} - {cupos} lugares
                                        </li>
                                    ))
                                ) : (
                                    <p>No hay horarios disponibles.</p>
                                )}
                            </ul>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    {/* Botón de Reservar */}
                    <div
                        className=" bg-[#f08400] text-[#ffffff] rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors"
                        style={{
                            backgroundColor: selectedHorario ? "#F08400" : "#CCCCCC",
                            color: "#FFFFFF",
                            cursor: selectedHorario ? "pointer" : "not-allowed",
                            pointerEvents: selectedHorario ? "auto" : "none",
                        }}
                        onClick={handleReservar}
                    >
                        <ArrowUpRight className="w-5 h-5" />
                        <span>¡Reservar!</span>
                    </div>

                    {/* Botón de Cerrar */}
                    <Button variant="secondary" className="w-100 mt-2 button" onClick={() => setModalOpen(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ActividadesLista;
