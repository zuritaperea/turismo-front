import React, { useEffect, useState, useContext } from "react";
import fidiApi from "../axios/services/fidi"; // Servicio API
import { Ticket, ArrowUpRight } from "lucide-react";
import Modal from './Modal.js';
import { AuthContext } from "./AuthContext";
import { useNavigate } from 'react-router-dom';

const cdgbtms_agencia = [
    "90550101001270003", "90550101000690009", "90550101000860001", "90550101001070004",
    "90550101019005905", "90550101001140002", "90550101000820000", "90550101000730000",
    "90550101000930000", "90550101001250002", "90550101009790006", "90550101012420001",
    "90550101019004828", "90550101019003775", "90550101032520001", "90550101019006499",
    "90550101000630006", "90550101000570003", "90550101009750004", "90550101019005891",
    "90550101000030009", "90550101000590004", "90550101001120001", "90550101011820006",
    "90550101000680003", "90550101001190000", "90550101012620000", "90550101032500000",
    "90550101000650007", "90550101000940005", "90550101000710000", "90550101000040004",
    "90550101000050000", "90550101000450008", "90550101000100007", "90550101002280045",
    "90550101001130007", "90550101001260008", "90550101000600000", "90550101019008327",
    "90550101000360009", "90550101000830005", "90550101000180000", "90550101019004763",
    "90550101009780000", "90550101011830001", "90550101000210007", "90550101011640008",
    "90550101000250009", "90550101000460003", "90550101019005239", "90550101000610005",
    "90550101009910001", "90550101000880002", "90550101000290000", "90550101001280009",
    "90550101001030002", "90550101000330002"
  ];
  
  function getRandomAgencia() {
    const randomIndex = Math.floor(Math.random() * cdgbtms_agencia.length);
    return cdgbtms_agencia[randomIndex];
  }
  
  // Ejemplo de uso:
  console.log(getRandomAgencia());
  
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

    const fechasDisponibles = ["2025-03-19", "2025-03-20", "2025-03-21", "2025-03-22"];
    const [reservaConfirmada, setReservaConfirmada] = useState(null);
    const handleReservar = async () => {
        if (!user) {
            alert("¡Por favor, inicia sesión para realizar una reserva!");
            return;
        }

        const reservaData = {
            cdgbtms_atrativo: idAtractivo,
            cdgbtms_atividade: selectedActividad?.cdgbtms,
            data: new Date(selectedDate).toLocaleDateString('es-AR'),
            hora: selectedHorario,
            nome: personaDenominacion,
        };

        try {
            const response = await fidiApi.hacerReserva(reservaData);
            const reservaConfirmada = response.data.info[0];
            if (reservaConfirmada.reserva_num) {
                const reservaDetalles = {
                    reserva_num: reservaConfirmada.reserva_num,
                    data: reservaConfirmada.data,
                    hora: reservaConfirmada.hora,
                    personaDenominacion: personaDenominacion,
                    nome_atividade: selectedActividad?.nome,
                    cdgbtms_atividade: selectedActividad?.cdgbtms,
                    cdgbtms_atrativo: idAtractivo,
                    cdgbtms_agencia: "90550101000430007" //getRandomAgencia() //"90550101000430007" //hardcodeada

                };

                navigate('/confirmacion-reserva-fidi', { state: { reservaConfirmada: reservaDetalles } });
            }
            else { alert(reservaConfirmada.msg) }
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
                    const formattedDate = new Date(selectedDate).toLocaleDateString('es-AR');
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

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <div
                    className="mx-4 sm:mx-auto"
                    style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", paddingRight: "10px" }}
                >
                    <div className="flex flex-col h-full">
                        <Modal.Header onHide={() => setModalOpen(false)}>
                            Seleccionar Fecha y Horario
                        </Modal.Header>
                        <Modal.Body className="flex-grow overflow-y-auto scrollbar-hide">
                            <div className="mb-4">
                                <h3 className="text-md font-semibold mb-2">Selecciona una fecha:</h3>
                                <div className="flex flex-col gap-2">
                                    {fechasDisponibles.map((fecha) => (
                                        <button
                                            key={fecha}
                                            onClick={() => setSelectedDate(fecha)}
                                            className={`px-4 py-2 rounded-md border ${selectedDate === fecha ? "bg-principal text-white" : "border-gray-300"
                                                }`}
                                        >
                                            {new Date(`${fecha}T12:00:00`).toLocaleDateString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {selectedDate && (
                                <div>
                                    <h3 className="text-md font-semibold mb-2">Horarios Disponibles</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {horarios.length > 0 ? (
                                            horarios.map(([hora, cupos]) => (
                                                <div
                                                    key={hora}
                                                    onClick={() => setSelectedHorario(hora)}
                                                    className={`cursor-pointer rounded-lg border p-4 text-center transition-colors duration-200 ${selectedHorario === hora
                                                        ? "bg-principal text-white border-transparent"
                                                        : "bg-white text-slate-900 border-gray-300 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <div className="text-lg font-bold">{hora}</div>
                                                    <div className="text-sm">{cupos} lugares</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="col-span-2 text-center">No hay horarios disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            )}


                        </Modal.Body>
                        <Modal.Footer>
                            <div className="flex justify-center w-full">
                                <div
                                    className="bg-[#f08400] text-[#ffffff] rounded-2xl py-1 px-4 flex items-center font-medium text-xl transition-colors"
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
                            </div>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>



        </div>
    );
};

export default ActividadesLista;
