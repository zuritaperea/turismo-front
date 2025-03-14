import { useLocation } from "react-router-dom";

export default function ConfirmacionReserva() {
    const location = useLocation();
    const { reservaConfirmada } = location.state || {};

    if (!reservaConfirmada) {
        return <p>No se pudo obtener la información de la reserva.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#ffffff]">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-[#f08400] text-2xl font-semibold" style={{color: '#f08400'}}>¡Felicidades!</h2>
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
            </div>
        </div>
    );
}
