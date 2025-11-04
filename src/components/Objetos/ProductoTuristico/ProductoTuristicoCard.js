import { BanknoteIcon, Ticket } from "lucide-react";
import funciones from "../../../extras/functions";
import { useTranslation } from "react-i18next";
import { formatHorarios } from "../../../extras/formatHorarios";

const ProductoTuristicoCard = ({ producto, onClick }) => {

  const { t } = useTranslation();
  return (
    <div
      key={producto.id}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded-3xl shadow-sm border border-[#e4e7ec] bg-white">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <Ticket size={24} className="text-[#f08400]" />
            <h2 className="text-xl font-semibold text-[#101828]">{producto.name}</h2>
          </div>
          <p className="text-[#475467] mt-4 text-lg">           
              <p>{formatHorarios(producto.horarios_disponibles, t)}</p>
          </p>
          <p className="text-[#475467] mt-2 text-lg">
            {producto.value_type === "IMPORTE" && producto.value ? (
              <span className="flex items-start gap-3"><BanknoteIcon size={22} className="text-[#f08400]" />
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.value)}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductoTuristicoCard;
