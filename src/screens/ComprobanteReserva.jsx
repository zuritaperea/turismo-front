import React from 'react'

const ComprobanteReserva = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="flex flex-col items-center w-full max-w-3xl space-y-6">
                
                <div className="text-center">
                    <h1 className="text-[#101828] text-3xl font-bold">Reserva #1234</h1>
                    <h2 className="text-[#475467] text-xl">Resumen de tu reserva</h2>
                    <div className="border-t border-[#e4e7ec] mt-4 pt-2"></div>
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-[#101828] text-2xl font-semibold">Código de tu reserva</h2>
                    <p className="text-[#475467] text-lg">Muestralo al llegar al lugar.</p>
                    <div className="mt-4 flex justify-center">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Plataforma_DTI___FIDI-cB7ISCTgKd0VoWJ0KX6xvMwo8ptXvf.png"
                            alt="Código QR de la reserva"
                            className="w-64 h-64"
                        />
                    </div>
                </div>

                <div className="w-full max-w-lg border border-[#e4e7ec] rounded-xl shadow-sm">
                    <div className="p-5 border-b border-[#e4e7ec] bg-[#fafafa] text-center">
                        <h3 className="text-[#344054] text-xl font-semibold">Detalles de la reserva</h3>
                    </div>
                    <div className="p-5 text-center">
                        <h4 className="text-[#101828] text-xl font-semibold">Albúfera</h4>
                        <p className="text-[#475467]">12/01/24 - Ticket Visita Familiar - 2 adultos</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComprobanteReserva
