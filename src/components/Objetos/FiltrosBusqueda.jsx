import React from 'react'
import { Calendar, User, House, ArrowUpRight } from "lucide-react"
import { useLocation, Link } from 'react-router-dom';

const FiltrosBusqueda = () => {
  const location = useLocation();

  return (
    <>
      <div className="bg-[#f08400] p-4">
        <div className="space-y-3 p-5 rounded-lg" style={{ backgroundColor: "#F08400" }}>
          <div className="bg-white rounded-lg p-4 flex items-center">
            <Calendar className="text-[#667085] mr-2" size={20} />
            <span className="text-[#344054] text-base">Ene 12, 2024 - Ene 18, 2024</span>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center">
            <User className="text-[#667085] mr-2" size={20} />
            <span className="text-[#344054] text-base">2 Adultos · 0 Menores · 1 Habitación</span>
          </div>
        </div>
      </div>
      <div>
        <h1 className="py-2 text-2xl my-4 font-semibold text-slate-900 tracking-tight dark:text-slate-200">
          Habitaciones
        </h1>

        {location.pathname.includes('/alojamiento/') &&
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="p-4">
              <div className="max-w-md rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md text-[#f08400]">
                      <House color="#F08400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#101828] mb-1">Habitación Base</h2>
                    </div>
                  </div>

                  <p className="text-[#475467] mt-4 mb-6 text-base text-start">
                    Habitación para dos personas en base doble, incluye desayuno.
                  </p>

                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#101828]">R$ 540</span>
                    <span className="text-[#475467] ml-2 text-lg">+ impuestos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="max-w-md rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md text-[#f08400]">
                      <House color="#F08400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#101828] mb-1">Habitación Triple</h2>
                    </div>
                  </div>

                  <p className="text-[#475467] mt-4 mb-6 text-base text-start">
                    Habitación para tres personas en base doble, incluye desayuno.
                  </p>

                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#101828]">R$ 540</span>
                    <span className="text-[#475467] ml-2 text-lg">+ impuestos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <Link to="/marketplace" className="w-1/2 mx-auto block">
          <button className="w-full bg-[#f08400] text-[#ffffff] rounded-2xl py-4 px-6 flex items-center justify-center gap-2 font-medium text-xl hover:bg-[#e07800] transition-colors" style={{ backgroundColor: "#F08400", color: '#FFFFFF' }}>
            <ArrowUpRight className="w-5 h-5" />
            <span>¡Reservar!</span>
          </button>
        </Link>
      </div>
    </>
  )
}

export default FiltrosBusqueda
