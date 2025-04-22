import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { DatePickerComponent } from "../components/DatePicker.tsx";

export default function FiltrosMarketPlace({ onSearch }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
          Selecciona las fechas y pasajeros
        </h1>

        <div className="w-full bg-white rounded-xl p-4 flex items-start gap-3 text-[#344054]">
          <Calendar className="h-6 w-6 text-[#344054] mt-1" />
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Desde:</label>
              <DatePickerComponent setSelectedDate={setStartDate} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Hasta:</label>
              <DatePickerComponent setSelectedDate={setEndDate} />
            </div>
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
