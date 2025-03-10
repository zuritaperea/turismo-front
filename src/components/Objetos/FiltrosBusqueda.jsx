import React from 'react'
import { Calendar, User } from "lucide-react"

const FiltrosBusqueda = () => {
  return (
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
  )
}

export default FiltrosBusqueda