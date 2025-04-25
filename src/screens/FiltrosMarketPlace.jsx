import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { DatePickerComponent } from "../components/DatePicker.tsx";
const formatForInput = (date) => {
  if (!date) return ""; // Si no hay fecha, retorna un string vacío.

  // Si la fecha es una cadena en formato ISO
  if (typeof date === "string") {
    // Intentamos convertirla a un objeto Date
    date = new Date(date);
  }

  // Verificar si es una instancia de Date válida
  if (!(date instanceof Date) || isNaN(date)) {
    return ""; // Si no es una fecha válida, retornamos vacío.
  }
  

  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // El mes es 0-indexado, sumamos 1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export default function FiltrosMarketPlace({ onSearch }) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1); // ⬅️ Le sumás un día
    return tomorrow;
  });
  const [cantidad, setCantidad] = useState(1);

  const handleSearch = () => {
    onSearch({
      desde: startDate,
      hasta: endDate,
      cantidad,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-principal sm:mx-20 rounded-xl p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-white text-lg font-semibold">
         Seleccioná las fechas y pasajeros
        </h1>

        <div className="w-full bg-white rounded-xl p-4 flex items-start gap-3 text-[#344054]">
          <Calendar className="h-6 w-6 text-[#344054] mt-1" />
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Desde:</label>

              <input
                type="datetime-local"
                className="w-full border rounded p-2"
                value={formatForInput(startDate)}
                onChange={(e) => {
                  const newStart = new Date(e.target.value);
                  setStartDate(newStart);

                  if (!endDate || newStart >= endDate) {
                    const newEnd = new Date(newStart);
                    newEnd.setDate(newStart.getDate() + 1);
                    setEndDate(newEnd);
                  }
                }} />            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Hasta:</label>

              <input
                type="datetime-local"
                className="w-full border rounded p-2"
                value={formatForInput(endDate)}
                onChange={(e) => {
                  const newEnd = new Date(e.target.value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (newEnd < today) {
                    alert("La fecha hasta no puede ser menor a hoy");
                    return;
                  }

                  if (startDate && newEnd <= startDate) {
                    alert("La fecha hasta no puede ser menor o igual a la fecha desde");
                    return;
                  }

                  setEndDate(newEnd);
                }}
              />            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-[#344054]">
          <Users className="h-6 w-6 text-[#344054]" />
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad de personas:</label>
            <input
              type="number"
              value={cantidad}
              min={1}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>

        <button
          className="w-full bg-white rounded-xl p-4 text-xl font-medium text-[#f08400] mt-6"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
