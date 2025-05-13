import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from "lucide-react";
import { ConfigContext } from "../extras/ConfigContext";
import BannerImagenFija from "../components/BannerImagenFija";
import SeccionesSlider from "../components/SectionSlider";
import Listado from "../components/Objetos/Listado";
import Spinner from "../components/Spinner";
import FiltroSubtipo from "../components/FiltroSubtipo";
import SeleccionComposicionViaje from "../components/SeleccionComposicionViaje";
import Row from "../components/Row";
import Col from "../components/Col";
import funciones from "../extras/functions";
import personaService from "../axios/services/profile";
import serviceObjeto from "../axios/services/objeto";
import reservaService from "../axios/services/producto_turistico";
import viajeService from "../axios/services/viaje";
import { AuthContext } from "../components/AuthContext";

export default function Pasaporte() {
  const [viaje, setViaje] = useState(null);
  const [constantes, setConstantes] = useState({
    composicion_viaje: [],
    tipo_turismo: [],
    tipo_alojamiento: [],
    tipo_atractivo: [],
    tipo_comercio: [],
    tipo_restaurante: [],
    tipo_cocina: [],
    tipo_evento: [],
  });

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
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [filtroCantidad, setFiltroCantidad] = useState(1);
  const [filtroSubtipo, setFiltroSubtipo] = useState('');
  const [interes, setInteres] = useState(null);
  const [paisSelected, setPaisSelected] = useState({ id: null, nombre: null });
  const [provinciaSelected, setProvinciaSelected] = useState(null);
  const [paises, guardarPaises] = useState([]);
  const [provincias, guardarProvincias] = useState([]);
  const [composicionViajeSelected, setComposicionViajeSelected] = useState(null);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const secciones = [
    { icono: <Ticket size={30} />, titulo: "Eventos", model: 'evento', value: 'evento' },
    { icono: <MapPinned size={30} />, titulo: "Atractivos", model: 'atractivoturistico', value: 'atractivo' },
    { icono: <Hotel size={30} />, titulo: "Alojamientos", model: 'alojamiento', value: 'alojamiento' },
    { icono: <Bus size={30} />, titulo: "Circuitos", model: 'circuito', value: 'circuito' },
    { icono: <ShoppingBag size={30} />, titulo: "Comercios", model: 'comercio', value: 'comercio' },
    { icono: <Utensils size={30} />, titulo: "Gastronomía", model: 'gastronomia', value: 'gastronomia' },
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      navigate('/login');
      return;
    } else {

      const viajeGuardado = localStorage.getItem("viaje");
      if (viajeGuardado) {
        try {
          const viajeJson = JSON.parse(viajeGuardado)
          if (user.username === viajeJson.attributes.user.username)
            setViaje(JSON.parse(viajeGuardado));
        } catch { }
      }
    }
  }, [user, navigate]);


  useEffect(() => {
    const obtenerConstantes = async () => {
      const resConstantes = await serviceObjeto.obtenerConstantesUsadas();
      setConstantes(resConstantes.data.data);
    };

    const obtenerPaises = async () => {
      setLoading(true);
      try {
        const response = await personaService.getPaises();
        const items = response.data.data.map((item) => ({
          id: item.id,
          nombre: item.attributes.nombre,
        }));
        guardarPaises(items);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    obtenerConstantes();
    obtenerPaises();
  }, []);

  useEffect(() => {
    if (paisSelected?.id) {
      const obtenerProvincias = async () => {
        setLoading(true);
        try {
          const response = await personaService.getProvincias(paisSelected.id);
          const items = response.data.data.map((item) => ({
            id: item.id,
            title: item.attributes.nombre,
          }));
          guardarProvincias(items);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };
      obtenerProvincias();
    }
  }, [paisSelected]);

  useEffect(() => {
    if (!viaje) return;
    const fetchViaje = async () => {
      try {
        const response = await reservaService.obtenerTodosProductoTuristicoFiltro({
          start_date: funciones.keepLocalAsUTC(filtroDesde)?.toISOString(),
          end_date: funciones.keepLocalAsUTC(filtroHasta)?.toISOString(),
          maximum_number_persons_max: filtroCantidad,
          content_type__model: model,
          integrates_discount_passport: true,
        });

        const objetosData = response.data.data.map((obj) => {
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
          new Map(objetosData.map(obj => [`${obj.type}_${obj.id}`, obj])).values()
        );

        setObjetosFiltrados(objetosUnicos);
        setBusquedaRealizada(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchViaje();
  }, [viaje]);

  const handleSearch = async () => {
    if (model && filtroSubtipo) {
      setLoading(true);
      setBusquedaRealizada(false);
      setObjetosFiltrados([]);

      const data = {
        data: {
          type: "Viaje",
          attributes: {
            origin: paisSelected.nombre,
            administrative_division_of_origin: provinciaSelected,
            start_date: funciones.keepLocalAsUTC(filtroDesde)?.toISOString().split("T")[0],
            end_date: funciones.keepLocalAsUTC(filtroHasta)?.toISOString().split("T")[0],
            number_of_people_in_group: filtroCantidad,
            composition_travel: composicionViajeSelected,
            interest_type: interes,
            interest_subtype: {
              interest_type: interes,
              name: filtroSubtipo,
            },
          },
        },
      };

      try {
        const res = await viajeService.crearViaje(data);
        localStorage.setItem("viaje", JSON.stringify(res.data.data));
        setViaje(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Debe seleccionar sus intereses.");
    }
  };

  const handleSectionClick = (seccion) => {
    setModel(seccion.model);
    setInteres(seccion.value);
    setSelectedSection(selectedSection === seccion.titulo ? "" : seccion.titulo);
  };

  return (
    <>
      <Header />
      <BannerImagenFija titulo="Pasaporte" />
      <div className="relative z-10 -mt-16 px-4">
        {!viaje && (
          <div className="bg-black bg-opacity-80 rounded-2xl shadow-md px-6 py-8 mx-auto mb-8 max-w-5xl flex flex-wrap justify-center gap-4 items-end">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <input
                type="datetime-local"
                value={funciones.formatForInput(filtroDesde)}
                onChange={(e) => {
                  const newStart = new Date(e.target.value);
                  setFiltroDesde(newStart);
                  if (!filtroHasta || newStart >= filtroHasta) {
                    const newEnd = new Date(newStart);
                    newEnd.setDate(newStart.getDate() + 1);
                    setFiltroHasta(newEnd);
                  }
                }}
                className="bg-transparent text-sm text-gray-700 outline-none w-full"
              />
            </div>
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <input
                type="datetime-local"
                value={funciones.formatForInput(filtroHasta)}
                onChange={(e) => {
                  const newEnd = new Date(e.target.value);
                  setFiltroHasta(newEnd);
                }}
                className="bg-transparent text-sm text-gray-700 outline-none w-full"
              />
            </div>
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2">
              <Users size={18} className="text-gray-500" />
              <input
                type="number"
                min={1}
                value={filtroCantidad}
                onChange={(e) => setFiltroCantidad(parseInt(e.target.value))}
                placeholder="Personas"
                className="bg-transparent text-sm text-gray-700 outline-none w-full"
              />
            </div>
          </div>
        )}
      </div>
      {!viaje && (
        <>
          <div className="mx-auto max-w-5xl px-4 mb-6">
            <Row className="gap-4">
              <Col sm={12} md={6}>
                <label className="block text-sm font-medium text-gray-700 mb-1">País de residencia</label>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={paisSelected.id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const nombre = e.target.options[e.target.selectedIndex].text;
                    setPaisSelected({ id, nombre });
                  }}
                >
                  <option value="">Seleccione un país</option>
                  {paises.map((pais) => (
                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                  ))}
                </select>
              </Col>

              <Col sm={12} md={6}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={provinciaSelected}
                  onChange={(e) => setProvinciaSelected(e.target.value)}
                >
                  <option value="">Seleccione una provincia</option>
                  {provincias.map((prov) => (
                    <option key={prov.id} value={prov.title}>{prov.title}</option>
                  ))}
                </select>
              </Col>
            </Row>
          </div>

          <div className="flex justify-center flex-col items-center px-8">
            <p className="text-2xl font-bold my-2">¿Qué te interesa?</p>
            <SeccionesSlider secciones={secciones} onSectionClick={handleSectionClick} selectedSection={selectedSection} />
          </div>
        </>)}


      {!viaje && (
        <>
          <div className="flex justify-center w-full items-center">
            <FiltroSubtipo interes={interes} constantes={constantes} filtroSubtipo={filtroSubtipo} setFiltroSubtipo={setFiltroSubtipo} />
          </div>
          <div className="flex justify-center flex-col items-center px-8">
            <p className="text-2xl font-bold mt-8">¿Cómo viajas?</p>
          </div>
          <SeleccionComposicionViaje composicion_viaje={constantes.composicion_viaje} composicionViajeSelected={composicionViajeSelected} setComposicionViajeSelected={setComposicionViajeSelected} />

          <div className="flex justify-center mt-6">
            <button
              className="bg-principal text-white px-6 py-3 rounded-full font-medium text-lg"
              onClick={handleSearch}
            >
              Registrá tu viaje
            </button>
          </div>
        </>
      )}

      {viaje && (
        <div className="text-center my-8 mt-10 pt-10">
          <h2 className="text-2xl font-bold">Tu viaje registrado</h2>
          <p><strong>Desde:</strong> {funciones.toDateLocalFormat(viaje.attributes.start_date)}</p>
          <p><strong>Hasta:</strong> {funciones.toDateLocalFormat(viaje.attributes.end_date)}</p>
          <p><strong>Personas:</strong> {viaje.attributes.number_of_people_in_group}</p>
          <button
            onClick={() => {
              localStorage.removeItem("viaje");
              setViaje(null);
              navigate("/pasaporte");
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full"
          >
            Generar nuevo viaje
          </button>
        </div>
      )}

      <Listado
        objetosFiltrados={objetosFiltrados}
        navigation={navigate}
        desde={filtroDesde}
        hasta={filtroHasta}
        cantidad={filtroCantidad}
        pasaporte={true}
      />

      {loading && <Spinner size={10} className="mx-auto mt-6" />}

      {busquedaRealizada && objetosFiltrados.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-6">
          No se encontraron resultados para la búsqueda.
        </div>
      )}
      <Footer />
    </>
  );
}
