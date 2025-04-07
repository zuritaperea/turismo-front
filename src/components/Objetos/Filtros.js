import React, { useState, useEffect } from "react";
import { Filter, Search, SlidersHorizontal, XCircle } from "lucide-react";
import Modal from "../Modal";
import Button from "../Button";
import Form from "../Form";
import service from "../../axios/services/objeto";
import Select from "react-select";
import FiltroSelect from "./FiltroSelect";
import FiltroInput from "./FiltroInput";
const initialFilters = {
  // Comunes a todos los target
  name: "",
  tourist_type: [],
  destino: "",
  // Alojamiento, Atractivo y Gastronomia
  price_range: "",
  // Alojamiento
  amenity_feature: [],
  checkin_time: "",
  checkout_time: "",
  accommodation_type: [],
  // Atractivo y Circuito
  type_attractive: "",
  // Solo Atractivo
  services: [],
  activities: [],
  subtype_attractive: "",
  free_access: "",
  // Comercio
  type_commerce: "",
  // Gastronomía
  resto_type: "",
  served_cuisine: [],
  accepts_reservations: "",
  // Evento
  event_class: "",
  speaker_name: "",
  presentador_name: "",
  moderador_name: "",
  start_date: "",
  end_date: "",
};
const Filtros = ({ objetoService, setObjetosFiltrados, target }) => {
  const [filters, setFilters] = useState(initialFilters);

  const [constantes, setConstantes] = useState({
    rango_precio: [],
    tipo_turismo: [],
    tipo_alojamiento: [],
    tipo_atractivo: [],
    tipo_comercio: [],
    tipo_restaurante: [],
    tipo_cocina: [],
    tipo_evento: [],
  });
  const [servicios, setServicios] = useState([]);
  const [actividades, setActividades] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const limpiarFiltros = () => setFilters(initialFilters);


  const filtrosSeleccionados = Object.entries(filters).filter(([key, value]) => {
    if (key === "name") return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  }).length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConstantes, resServicios, resActividades] = await Promise.all([
          service.obtenerConstantes(),
          service.obtenerServicios(),
          service.obtenerActividades(),
        ]);
        setConstantes(resConstantes.data.data);
        setServicios(
          resServicios.data.data.map((s) => ({ value: s.id, label: s.attributes.name }))
        );
        setActividades(
          resActividades.data.data.map((s) => ({ value: s.id, label: s.attributes.name }))
        );
      } catch (error) {
        console.error("Error obteniendo datos de API", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e, fieldName) => {
    const updateFilters = (key, val) =>
      setFilters((prev) => {
        if (!val || (Array.isArray(val) && val.length === 0)) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: val };
      });

    // Caso react-select
    if (fieldName) {
      if (Array.isArray(e)) {
        // isMulti = true
        return updateFilters(fieldName, e.map((o) => o.value));
      } else {
        // isMulti = false
        return updateFilters(fieldName, e?.value || "");
      }
    }

    // Caso nativo (inputs)
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const prevValues = filters[name] || [];
      const newValues = checked
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value);
      return updateFilters(name, newValues);
    }

    const val = type === "datetime-local" ? new Date(value).toISOString() : value;
    updateFilters(name, val);
  };



  const aplicarFiltros = async () => {
    try {
      const response = await objetoService.obtenerFiltrado(filters);
      setObjetosFiltrados(response.data.data.map((obj) => ({
        id: obj.id,
        title: obj.attributes.name,
        image: obj.attributes.image_url
          ? process.env.REACT_APP_API_URL + obj.attributes.image_url
          : process.env.REACT_APP_IMAGE_DEFAULT,
        puntuacion: obj.attributes.evaluation,
        favorito: obj.attributes.favorite,
        coordinates: obj.attributes.point,
        tourist_type: obj.attributes.tourist_type,
        type: obj.type,
        location: obj.attributes.location,
        startDate: obj.attributes.start_date,
      })));
      setShowModal(false);
    } catch (error) {
      console.error("Error al obtener alojamientos:", error);
    }
  };

  return (
    <div className="bg-[#f08400] p-4">
      <div className="space-y-3 p-5 rounded-lg" style={{ backgroundColor: "#F08400" }}>
        <div className="bg-white rounded-lg p-4 flex items-center">
          <Search className="text-[#667085] mr-2" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre"
            value={filters.name}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Previene que se recargue la página o haga submit
                aplicarFiltros();
              }
            }}
            onChange={handleFilterChange}
            className="text-[#344054] text-base w-full outline-none bg-transparent"
          />
        </div>
        {target == 'Alojamiento' &&
          <FiltroSelect label="Tipo de alojamiento" name="accommodation_type"
            classLabel="text-white text-base font-medium"
            options={constantes.tipo_alojamiento}
            selected={filters.accommodation_type} onChange={handleFilterChange} isMulti />}
        {['Atractivo', 'Circuito'].includes(target)  &&
          <FiltroSelect label="Tipo de atractivo" name="type_attractive"
            classLabel="text-white text-base font-medium"
            options={constantes.tipo_atractivo}
            selected={filters.type_attractive} onChange={handleFilterChange} />
        }
        {target == 'Comercio' &&
          <FiltroSelect label="Tipo de comercio" name="type_commerce"
            classLabel="text-white text-base font-medium"
            options={constantes.tipo_comercio}
            selected={filters.type_commerce} onChange={handleFilterChange} />
        }
        {target == 'Gastronomia' &&
          <FiltroSelect label="Tipo de restaurante" name="resto_type"
            classLabel="text-white text-base font-medium"
            options={constantes.tipo_restaurante}
            selected={filters.resto_type} onChange={handleFilterChange} />
        }
        {target == 'Evento' &&
          <FiltroSelect label="Tipo de evento" name="event_class"
            classLabel="text-white text-base font-medium"
            options={constantes.tipo_evento}
            selected={filters.event_class} onChange={handleFilterChange} />
        }
        <div className="bg-white rounded-lg p-4 flex items-center cursor-pointer" onClick={() => setShowModal(true)}>
          <Filter className="text-[#667085] mr-2" size={20} />
          <span className="text-[#344054] text-base">
            {filtrosSeleccionados > 0 ? `${filtrosSeleccionados} filtros seleccionados` : "Filtros avanzados"}</span>
          <SlidersHorizontal className="ml-auto text-[#667085]" size={20} />
        </div>
        <div className="flex space-x-2">

          <button className="bg-white text-[#f08400] px-4 py-2 rounded-lg w-full font-semibold mt-2" onClick={aplicarFiltros}>
            Aplicar Filtros
          </button>
          <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold mt-2 flex items-center" onClick={limpiarFiltros}>
            <XCircle size={18} />
          </button></div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body className="overflow-y-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FiltroSelect label="Tipo de turista" name="tourist_type" options={constantes.tipo_turismo} selected={filters.tourist_type} onChange={handleFilterChange} isMulti />
            {target == 'Alojamiento' &&
              <FiltroSelect label="Servicios" name="amenity_feature" options={servicios} selected={filters.amenity_feature} onChange={handleFilterChange} isMulti />
            }
            {target == 'Atractivo' && (
              <>
                <FiltroSelect label="Servicios" name="services" options={servicios} selected={filters.services} onChange={handleFilterChange} isMulti />
                <FiltroSelect label="Actividades" name="actividades" options={actividades} selected={filters.activities} onChange={handleFilterChange} isMulti />
                <FiltroSelect
                  label="Acceso Gratuito"
                  name="free_access"
                  selected={filters.free_access}
                  forceSelect
                  isBoolean
                  onChange={handleFilterChange}
                />
              </>

            )}
            {target === 'Gastronomia' && (
              <FiltroSelect
                label="Acepta reservas"
                name="accepts_reservations"
                selected={filters.accepts_reservations}
                forceSelect
                isBoolean
                onChange={handleFilterChange}
              />
            )}
            {['Alojamiento', 'Atractivo', 'Gastronomia'].includes(target) &&
              <FiltroSelect
                label="Rango de precio"
                name="price_range"
                selected={filters.price_range}
                forceSelect
                options={constantes.rango_precio}
                onChange={handleFilterChange}
              />
            }
            {target === 'Gastronomia' && (
              <FiltroSelect
                label="Tipo de cocina"
                name="served_cuisine"
                selected={filters.served_cuisine}
                forceSelect
                isMulti
                options={constantes.tipo_cocina}
                onChange={handleFilterChange}
              />
            )}
            {target === 'Evento' && (
              <><FiltroInput
                label="Nombre orador"
                name="speaker_name"
                selected={filters.speaker_name}
                onChange={handleFilterChange}
              />
                <FiltroInput
                  label="Nombre moderador"
                  name="moderador_name"
                  selected={filters.moderador_name}
                  onChange={handleFilterChange}
                /><FiltroInput
                  label="Nombre presentador"
                  name="presentador_name"
                  selected={filters.presentador_name}
                  onChange={handleFilterChange}
                />
              </>

            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Listo</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Filtros;
