import React from 'react'

const Habitaciones = () => {
    return (
        <div>
            <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                Habitaciones
            </h1>

            <div className="p-4">
                <div className="max-w-md rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
                    <div className="p-6">
                        <div className="flex items-start gap-3">
                            <div className="rounded-md text-[#f08400]">
                                <Home size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#101828] mb-1">Habitación Base</h2>
                            </div>
                        </div>

                        <p className="text-[#475467] mt-4 mb-6 text-lg">
                            Habitación para dos personas en base doble, incluye desayuno.
                        </p>

                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-[#101828]">R$ 540</span>
                            <span className="text-[#475467] ml-2 text-lg">+ impuestos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Habitaciones