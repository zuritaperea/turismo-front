import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import SeccionesSlider from "../components/SectionSlider";
import Splash from "../components/Splash";
import { ConfigContext } from "../extras/ConfigContext";
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from "lucide-react";
import FiltrosMarketPlace from "./FiltrosMarketPlace";
import reservaService from "../axios/services/producto_turistico"
import Listado from "../components/Objetos/Listado";

export default function Marketplace() {
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [objetosFiltrados, setObjetosFiltrados] = useState([]);
  const [model, setModel] = useState(null);
  const config = useContext(ConfigContext);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtroDesde, setFiltroDesde] = useState(null);
  const [filtroHasta, setFiltroHasta] = useState(null);
  const [filtroCantidad, setFiltroCantidad] = useState(null);


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
          start_date: desde,
          end_date: hasta,
          maximum_number_persons_max: cantidad,
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
      <div className="flex justify-center flex-col items-center px-8">
        <SeccionesSlider secciones={secciones} onSectionClick={handleSectionClick} selectedSection={selectedSection} />
      </div>
      <FiltrosMarketPlace onSearch={handleSearch} />
      <Listado objetosFiltrados={objetosFiltrados} navigation={navigate} desde={filtroDesde}
        hasta={filtroHasta}
        cantidad={filtroCantidad} pasaporte={true}/>
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
