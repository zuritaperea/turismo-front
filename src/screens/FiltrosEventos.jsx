import { Calendar, Users } from "lucide-react"

export default function FiltrosEventos() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f08400] p-6" style={{backgroundColor: "#f08400"}}>
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-white text-lg font-semibold">Selecciona las fechas y pasajeros</h1>

        <button className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-3 text-[#344054]">
          <Calendar className="h-6 w-6 text-[#344054]" />
          <span className="text-lg font-medium">Ene 12, 2024 – Ene 18, 2024</span>
        </button>

        <button className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-3 text-[#344054]">
          <Users className="h-6 w-6 text-[#344054]" />
          <span className="text-lg font-medium">2 Adultos · 0 Menores</span>
        </button>

        <button className="w-full bg-white rounded-xl p-4 text-xl font-medium text-[#f08400] mt-6" style={{backgroundColor: 'white', color: '#f08400'}}>Buscar</button>
      </div>
    </div>
  )
}
