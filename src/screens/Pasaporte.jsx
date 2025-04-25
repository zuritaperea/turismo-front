import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import SeccionesSlider from "../components/SectionSlider";
import Splash from "../components/Splash";
import { ConfigContext } from "../extras/ConfigContext";
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils, Calendar, Users } from "lucide-react";
import FiltrosMarketPlace from "./FiltrosMarketPlace";
import reservaService from "../axios/services/producto_turistico"
import Listado from "../components/Objetos/Listado";
import personaService from "../axios/services/profile"
import Row from "../components/Row";
import Col from "../components/Col";
import serviceObjeto from "../axios/services/objeto";
import SeleccionComposicionViaje from "../components/SeleccionComposicionViaje";

const keepLocalAsUTC = (date) => {
  // Si no hay fecha, retornamos null
  if (!date) return null;

  // Si la fecha es una cadena en formato ISO, la convertimos a Date
  if (typeof date === "string") {
    date = new Date(date);
  }

  // Verificamos si es un objeto Date válido
  if (!(date instanceof Date) || isNaN(date)) {
    return null; // Si no es una fecha válida, retornamos null
  }

  const year = date.getFullYear();
  const month = date.getMonth(); // Los meses son 0-indexados, sin cambios
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Crea una nueva fecha en UTC con los mismos valores de la fecha local
  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
};
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

export default function Pasaporte() {
  const [constantes, setConstantes] = useState({
    composicion_viaje: [],
  })
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [model, setModel] = useState(null);
  const config = useContext(ConfigContext);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtroDesde, setFiltroDesde] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [filtroHasta, setFiltroHasta] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1); // ⬅️ Le sumás un día
    return tomorrow;
  });
  const [filtroCantidad, setFiltroCantidad] = useState(1);
  const [paisSelected, setPaisSelected] = useState(null);
  const [provinciaSelected, setProvinciaSelected] = useState(null);
  const [paises, guardarPaises] = useState([]);
  const [provincias, guardarProvincias] = useState([]);
  const [composicionViajeSelected, setComposicionViajeSelected]= useState(null);
  useEffect(() => {
    const obtenerConstantes = async ()  => {
      const resConstantes = await  serviceObjeto.obtenerConstantes();      
      setConstantes(resConstantes.data.data);
    }


    const obtenerPaises = () => {
      setLoading(true);
      guardarPaises([]);
      let itemReturn = [];
      personaService
        .getPaises()
        .then((response) => {
          response.data.data.map((item) => {
            itemReturn.push({
              id: item.id,
              title: item.attributes.nombre,
            });
          });
          guardarPaises(itemReturn);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
      setLoading(false);
    };
    obtenerConstantes();
    obtenerPaises();
  }, []);
  useEffect(() => {
    const obtenerProvincias = () => {
      setLoading(true);
      guardarProvincias([]);
      let itemReturn = [];
      personaService
        .getProvinciasArgentinas()
        .then((response) => {
          response.data.data.map((item) => {
            itemReturn.push({
              id: item.id,
              title: item.attributes.nombre,
            });
          });
          guardarProvincias(itemReturn);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
      setLoading(false);
    };
    if (paisSelected) obtenerProvincias(paisSelected); //TODO borrar hijos cuando se cambie los padres
  }, [paisSelected]);


  const handleSearch = async () => {
    if (model) {
      setLoading(true);
      setBusquedaRealizada(false);
      setObjetosFiltrados([]);
      try {
        const response = await reservaService.obtenerTodosProductoTuristicoFiltro({
          start_date: keepLocalAsUTC(filtroDesde)?.toISOString(),
          end_date: keepLocalAsUTC(filtroHasta)?.toISOString(),
          maximum_number_persons_max: filtroCantidad,
          content_type__model: model,
          integrates_discount_passport: true
        });
        const data = response.data.data;

        const now = new Date();

        const objetosData = data
          .filter((obj) => {
            const objeto = obj.attributes.objeto;
            const tipo = objeto.type.toLowerCase();
            const atributos = objeto.attributes;

            if (tipo !== 'evento') return true;

            const startDate = atributos?.start_date ? new Date(atributos.start_date) : null;
            const endDate = atributos?.end_date ? new Date(atributos.end_date) : null;

            // Si ya terminó, lo excluimos
            if (endDate && endDate < now) return false;

            // Si hay rango desde-hasta, lo usamos
            if (filtroDesde && startDate && startDate < new Date(filtroDesde)) return false;
            if (filtroHasta && endDate && endDate > new Date(filtroHasta)) return false;

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
              tipo: objeto.type.toLowerCase() === 'atractivoturistico' ? 'atractivo' : objeto.type,
            };
          });

        const objetosUnicos = Array.from(
          new Map(
            objetosData.map(obj => [`${obj.type}_${obj.id}`, obj])
          ).values()
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
    { icono: <Ticket size={30} />, titulo: "Eventos", model: 'evento' },
    { icono: <MapPinned size={30} />, titulo: "Atractivos", model: 'atractivoturistico' },
    { icono: <Hotel size={30} />, titulo: "Alojamientos", model: 'alojamiento' },
    { icono: <Bus size={30} />, titulo: "Circuitos", model: 'circuito' },
    { icono: <ShoppingBag size={30} />, titulo: "Comercios", model: 'comercio' },
    { icono: <Utensils size={30} />, titulo: "Gastronomía", model: 'gastronomia' },
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

      <div className="flex flex-col items-center justify-center bg-principal sm:mx-20 rounded-xl p-6">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-white text-lg font-semibold">
            ¡Creá tu pasaporte!
          </h1>

          <div className="w-full bg-white rounded-xl p-4 flex items-start gap-3 text-[#344054]">
            <Calendar className="h-6 w-6 text-[#344054] mt-1" />
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Desde:</label>

                <input
                  type="datetime-local"
                  className="w-full border rounded p-2"
                  value={formatForInput(filtroDesde)}
                  onChange={(e) => {
                    const newStart = new Date(e.target.value);
                    setFiltroDesde(newStart);

                    if (!filtroHasta || newStart >= filtroHasta) {
                      const newEnd = new Date(newStart);
                      newEnd.setDate(newStart.getDate() + 1);
                      setFiltroHasta(newEnd);
                    }
                  }} />            </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Hasta:</label>

                <input
                  type="datetime-local"
                  className="w-full border rounded p-2"
                  value={formatForInput(filtroHasta)}
                  onChange={(e) => {
                    const newEnd = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (newEnd < today) {
                      alert("La fecha hasta no puede ser menor a hoy");
                      return;
                    }

                    if (filtroDesde && newEnd <= filtroDesde) {
                      alert("La fecha hasta no puede ser menor o igual a la fecha desde");
                      return;
                    }

                    setFiltroHasta(newEnd);
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
                value={filtroCantidad}
                min={1}
                onChange={(e) => setFiltroCantidad(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4 mx-10">
        Datos Personales    </div>
      <Row className="px-10"><Col sm={6} md={6} lg={6}>
        <label className="block text-sm font-medium text-gray-600 mb-1">País de residencia</label>
        <select className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={paisSelected}
          onChange={(e) => setPaisSelected(e.target.value)}
        >
          <option value="">Seleccione un país</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>{pais.title}</option>
          ))}
        </select>

      </Col><Col sm={6} md={6} lg={6}>
          <label className="block text-sm font-medium text-gray-600 mb-1">Provincia</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={provinciaSelected}
            onChange={(e) => setProvinciaSelected(e.target.value)}
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>{provincia.title}</option>
            ))}
          </select>
        </Col></Row>

      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4 mx-10">
        ¿Con quien viajas?   </div>
       <SeleccionComposicionViaje composicion_viaje={constantes.composicion_viaje} />

      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4 mx-10">
        ¿Cuales son tus intereses?      </div>
      <div className="flex justify-center flex-col items-center px-8">
        <SeccionesSlider secciones={secciones} onSectionClick={handleSectionClick} selectedSection={selectedSection} />
      </div>

      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4 mx-10">
        Subintereses     </div>
      <button
        className="w-1/3 mx-auto ml-20 bg-principal bg-white rounded-xl p-4 text-xl font-medium text-gray-200 mt-6"
        onClick={handleSearch}
      >
        Registrá tu viaje
      </button>
      <Listado objetosFiltrados={objetosFiltrados} navigation={navigate} desde={filtroDesde}
        hasta={filtroHasta}
        cantidad={filtroCantidad} pasaporte={true} />
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
