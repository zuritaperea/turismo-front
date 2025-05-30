import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import SeccionesSlider from "../components/SectionSlider";
import { ConfigContext } from "../extras/ConfigContext";
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from "lucide-react";
import reservaService from "../axios/services/producto_turistico";
import Listado from "../components/Objetos/Listado";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";

const keepLocalAsUTC = (date) => {
  if (!date) return null;
  if (typeof date === "string") date = new Date(date);
  if (!(date instanceof Date) || isNaN(date)) return null;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
};

export default function Marketplace() {
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [model, setModel] = useState(null);

  const config = useContext(ConfigContext);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtroDesde, setFiltroDesde] = useState(new Date());
  const [filtroHasta, setFiltroHasta] = useState(new Date());
  const [filtroCantidad, setFiltroCantidad] = useState(1);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSearch = async ({ desde, hasta, cantidad }) => {
    if (model) {
      setLoading(true);
      setBusquedaRealizada(false);
      setFiltroDesde(desde);
      setFiltroHasta(hasta);
      setFiltroCantidad(cantidad);
      setObjetosFiltrados([]);
      try {
        const response = await reservaService.obtenerTodosProductoTuristicoFiltro({
          start_date: keepLocalAsUTC(desde)?.toISOString(),
          end_date: keepLocalAsUTC(hasta)?.toISOString(),
          maximum_number_persons_max: cantidad,
          content_type__model: model,
          integrates_discount_passport: false,
        });

        const data = response.data.data;
        const now = new Date();

        const objetosData = data
          .filter((obj) => {
            const objeto = obj.attributes.objeto;
            const tipo = objeto.type.toLowerCase();
            const atributos = objeto.attributes;

            if (tipo !== "evento") return true;

            const startDate = atributos?.start_date ? new Date(atributos.start_date) : null;
            const endDate = atributos?.end_date ? new Date(atributos.end_date) : null;

            if (endDate && endDate < now) return false;
            if (desde && startDate && startDate < new Date(desde)) return false;
            if (hasta && endDate && endDate > new Date(hasta)) return false;

            return true;
          })
          .map((obj) => {
            const objeto = obj.attributes.objeto;
            const atributos = objeto.attributes;

            return {
              id: objeto.id,
              title: atributos.name,
              image: atributos.image_url
                ? process.env.REACT_APP_API_URL + atributos.image_url
                : process.env.REACT_APP_IMAGE_DEFAULT,
              puntuacion: atributos.evaluation,
              favorito: atributos.favorite,
              coordinates: atributos.point,
              tourist_type: atributos.tourist_type,
              type: objeto.type,
              tipo: objeto.type.toLowerCase() === "atractivoturistico" ? "atractivo" : objeto.type,
            };
          });

        const objetosUnicos = Array.from(
          new Map(objetosData.map((obj) => [`${obj.type}_${obj.id}`, obj])).values()
        );

        setObjetosFiltrados(objetosUnicos);
        setLoading(false);
        setBusquedaRealizada(true);
      } catch (error) {
        setLoading(false);
        setBusquedaRealizada(true);
        console.error("Error al buscar objetos:", error);
      }
    }
  };

  const navigate = useNavigate();

  const secciones = [
    { icono: <Ticket size={30} />, titulo: "Eventos", model: "evento" },
    { icono: <MapPinned size={30} />, titulo: "Atractivos", model: "atractivoturistico" },
    { icono: <Hotel size={30} />, titulo: "Alojamientos", model: "alojamiento" },
    { icono: <Bus size={30} />, titulo: "Circuitos", model: "circuito" },
    { icono: <ShoppingBag size={30} />, titulo: "Comercios", model: "comercio" },
    { icono: <Utensils size={30} />, titulo: "Gastronomía", model: "gastronomia" },
  ];

  const handleSectionClick = (seccion) => {
    setModel(seccion.model);
    if (selectedSection === seccion.titulo) {
      setSelectedSection("");
    } else {
      setSelectedSection(seccion.titulo);
    }
  };

  useEffect(() => {
    setBusquedaRealizada(false);
    setObjetosFiltrados([]);
  }, [model]);

  return (
    <>
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 px-4 max-w-6xl mx-auto items-start">
        <div className="flex flex-col items-center">
          <SeccionesSlider
            secciones={secciones}
            onSectionClick={handleSectionClick}
            selectedSection={selectedSection}
            isMarketplace={true}
          />
        </div>

        <div className="flex flex-col my-5 items-center w-full">
          <h2 className="text-center text-lg font-semibold mb-4">Fecha de llegada y partida</h2>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setDateRange([item.selection]);
              setFiltroDesde(item.selection.startDate);
              setFiltroHasta(item.selection.endDate);
            }}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            rangeColors={["#111827"]}
            locale={es}
          />

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full sm:justify-center">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 shadow w-[200px]">
              <span className="text-gray-500 text-sm">👥</span>
              <input
                type="number"
                min={1}
                value={filtroCantidad}
                onChange={(e) => setFiltroCantidad(parseInt(e.target.value))}
                placeholder="Personas"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>

            <button
              onClick={() =>
                handleSearch({
                  desde: dateRange[0].startDate,
                  hasta: dateRange[0].endDate,
                  cantidad: filtroCantidad,
                })
              }
              className="bg-black text-white font-semibold rounded-full px-6 py-3 text-sm hover:bg-gray-900 transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <Listado
        objetosFiltrados={objetosFiltrados}
        navigation={navigate}
        desde={filtroDesde}
        hasta={filtroHasta}
        cantidad={filtroCantidad}
        pasaporte={false}
      />

      {loading ? <Spinner size={10} className="mx-auto" /> : null}

      {busquedaRealizada && objetosFiltrados.length === 0 && !loading ? (
        <div className="flex justify-center items-center mt-4 text-gray-500">
          No se encontraron resultados para la búsqueda.
        </div>
      ) : null}

      <Footer />
    </>
  );
}
