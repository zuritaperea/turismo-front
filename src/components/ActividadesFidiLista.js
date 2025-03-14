import React, { useEffect, useState } from "react";
import fidiApi from "../axios/services/fidi"; // Asegúrate de importar tu servicio
import { Ticket, ArrowUpRight } from 'lucide-react';

const ActividadesLista = ({ idAtractivo }) => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        setLoading(true);
        const response = await fidiApi.obtenerActividades(idAtractivo);
        setActividades(response.data.data.dados); // Ajusta según la estructura de la API
      } catch (error) {
        setError("Hubo un error al cargar las actividades");
      } finally {
        setLoading(false);
      }
    };

    if (idAtractivo) {
      obtenerActividades();
    }
  }, [idAtractivo]); // Se ejecuta cuando cambia `idAtractivo`

  if (loading) return <p>Cargando actividades...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div class="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">Actividades Disponibles</div>
      
        {actividades.map((actividad) => (
            <div className="p-4"  key={actividad.cdgbtms}>
            <div className="max-w-md mx-auto rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-md text-[#f08400]">
                    <Ticket size={24} style={{ color: "#f08400" }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-1"> {actividad.nome}</h2>
                  </div>
                </div>

                <p className="text-[#475467] mt-4 mb-6 text-lg">
                {actividad.primeira_saida && actividad.ultima_saida && `${actividad.primeira_saida} a ${actividad.ultima_saida}`}
                </p>
              </div>
            </div>
          </div>  
        ))}
    </div>
  );
};

export default ActividadesLista;
