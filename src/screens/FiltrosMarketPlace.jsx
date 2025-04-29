import { useState } from "react";
import { Calendar, Users } from "lucide-react";

const formatForInput = (date) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }

  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
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
    tomorrow.setDate(tomorrow.getDate() + 1);
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
    <div
  className="bg-black bg-opacity-80 rounded-2xl shadow-md px-6 py-8 max-w-6xl mx-auto mb-8 flex flex-wrap justify-center gap-4 items-end"
>
      <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 w-52 sm:w-auto">
        <Calendar className="text-gray-500" size={18} />
        <input
          type="datetime-local"
          value={formatForInput(startDate)}
          onChange={(e) => {
            const newStart = new Date(e.target.value);
            setStartDate(newStart);
            if (!endDate || newStart >= endDate) {
              const newEnd = new Date(newStart);
              newEnd.setDate(newStart.getDate() + 1);
              setEndDate(newEnd);
            }
          }}
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 w-full sm:w-auto">
        <Calendar className="text-gray-500" size={18} />
        <input
          type="datetime-local"
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
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 w-full sm:w-auto">
        <Users className="text-gray-500" size={18} />
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
          placeholder="Personas"
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-black text-white font-semibold rounded-full px-6 py-3 text-sm hover:bg-gray-900 transition w-full sm:w-auto"
      >
        Buscar
      </button>
    </div>
  );
}
