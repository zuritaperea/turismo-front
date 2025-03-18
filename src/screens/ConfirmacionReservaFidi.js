import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import fidiApi from "../axios/services/fidi"; // Servicio API

export default function ConfirmacionReserva() {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservaConfirmada } = location.state || {}; // Se obtiene la información de la reserva

    // Estado de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para generar e imprimir el voucher
    const generarYImprimirVoucher = async () => {
        setLoading(true);  // Establecer el estado de carga a 'true'
        setError(null);  // Limpiar cualquier error previo

        try {
            // Preparar los datos para la solicitud de generar el voucher
            const voucherData = {
                cdgbtms_atrativo: reservaConfirmada.cdgbtms_atrativo,
                reserva: reservaConfirmada.reserva_num
            };

            // Llamada a la API para generar el voucher
            const responseGenerar = await fidiApi.generarVoucher(voucherData);

            // Verificar si la generación del voucher fue exitosa
            const infoGenerado = responseGenerar?.data?.info[0];
            if (infoGenerado && infoGenerado.num_voucher) {
                // Si el voucher se generó exitosamente, proceder a imprimirlo
                const imprimirData = {
                    num_voucher: infoGenerado.num_voucher,
                    cdgbtms_agencia: reservaConfirmada.cdgbtms_agencia // Asegúrate de tener este dato en reservaConfirmada
                };

                // Llamada a la API para imprimir el voucher
                const responseImprimir = await fidiApi.imprimirVoucher(imprimirData);
                // Verificar si la respuesta de imprimir tiene una URL
                const infoImprimir = responseImprimir?.data?.info[0];
                if (infoImprimir && infoImprimir.url) {
                    // Redirigir al usuario a la URL para visualizar o descargar el voucher
                    // Guardamos que ya se procesó el voucher en sessionStorage con un identificador único
                    const claveVoucher = `voucherProcesado_${reservaConfirmada.reserva_num}_${reservaConfirmada.cdgbtms_atrativo}`;
                    sessionStorage.setItem(claveVoucher, "true");
                    window.location.href = infoImprimir.url;
                } else {
                    setError("Hubo un error al intentar imprimir el voucher.");
                }
            } else {
                setError("No se pudo generar el voucher. Error: " + infoGenerado?.msg);
            }
        } catch (err) {
            setError("Ocurrió un error al procesar el voucher. Intente nuevamente.");
        } finally {
            setLoading(false);  // Restablecer el estado de carga a 'false'
        }
    };

    // useEffect debe llamarse incondicionalmente
    useEffect(() => {
        // Crear la clave única para el sessionStorage usando ambas variables
        const claveVoucher = `voucherProcesado_${reservaConfirmada.reserva_num}_${reservaConfirmada.cdgbtms_atrativo}`;
        
        // Verificar si el voucher ya ha sido procesado para esta reserva y atractivo
        if (sessionStorage.getItem(claveVoucher) === "true") {
            navigate('/')
            return; // Si ya se procesó el voucher para esta reserva y atractivo, no hacer nada
        }

        // Llamar a la función para generar e imprimir el voucher cuando el componente se cargue
        if (reservaConfirmada) {
            generarYImprimirVoucher();
        }
    }, [reservaConfirmada]);  // Dependencia en reservaConfirmada

    // Verificar si no se encontró la reserva
    if (!reservaConfirmada) {
        return <p>No se pudo obtener la información de la reserva.</p>;
    }

    if (loading) {
        return <p>Generando e imprimiendo tu voucher...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#ffffff]">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-[#f08400] text-2xl font-semibold" style={{ color: '#f08400' }}>
                        ¡Felicidades!
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-[#101828] text-4xl font-bold">Tu reserva ha sido confirmada</h1>
                        <span className="text-3xl">🎉</span>
                    </div>
                </div>

                <div className="overflow-hidden border border-[#e4e7ec] rounded-xl shadow-sm">
                    <div className="p-5 border-b border-[#e4e7ec] bg-[#fafafa]">
                        <h3 className="text-[#344054] text-xl font-semibold">Detalles de la reserva</h3>
                    </div>
                    <div className="p-5">
                        <div className="space-y-1">
                            <h4 className="text-[#101828] text-xl font-semibold">
                                {reservaConfirmada.nome_atividade} {/* Nombre de la actividad */}
                            </h4>
                            <p className="text-[#475467]">
                                Fecha: {reservaConfirmada.data} <br />
                                Hora: {reservaConfirmada.hora} <br />
                                Nombre: {reservaConfirmada.personaDenominacion} {/* Nombre de la persona */}
                            </p>
                            <p className="text-[#475467]">
                                <strong>Número de reserva:</strong> {reservaConfirmada.reserva_num} {/* Número de la reserva */}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mostrar mensaje de error si ocurre algún problema */}
                {error && (
                    <div className="mt-4 text-red-500">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
