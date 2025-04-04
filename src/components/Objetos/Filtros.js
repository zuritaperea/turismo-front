import React, { useState, useEffect } from "react";
import { Filter, Search, SlidersHorizontal, XCircle } from "lucide-react";
import Modal from "../Modal";
import Button from "../Button";
import Form from "../Form";
import service from "../../axios/services/objeto";
import Select from "react-select";

const FiltroSelect = ({ label, name, options, selected, onChange, isMulti = false }) => (
  <div>
    <label className="text-sm">{label}</label>
    {options.length <= 5 ? (
      options.map((option) => (
        <Form.Check
          key={option.value}
          type="checkbox"
          label={option.label}
          name={name}
          value={option.value}
          onChange={onChange}
        />
      ))
    ) : (
      <Select
        isMulti={isMulti}
        isSearchable
        name={name}
        options={options}
        value={options.filter((o) => selected.includes(o.value))}
        onChange={(selected) => onChange(selected, name)}
        className="mt-1"
      />
    )}
  </div>
);
const FiltroFecha = ({ label, name, value, onChange }) => (
  <div className="flex-1">
    <label className="text-sm">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-2 mt-1"
    />
  </div>
);

const Filtros = ({ objetoService, setObjetosFiltrados }) => {
  const [filters, setFilters] = useState({
    name: "",
    amenity_feature: [],
    tourist_type: [],
    price_range: "",
    checkin_time: "",
    checkout_time: "",
    accommodation_type: [],
    destino: "",
  });

  const [constantes, setConstantes] = useState({
    rango_precio: [],
    tipo_turismo: [],
    tipo_alojamiento: [],
  });
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const limpiarFiltros = () => {
    setFilters({
      name: "",
      tourist_type: [],
      destino: "",
      //parametros de target = alojamiento
      amenity_feature: [],
      price_range: "",
      checkin_time: "",
      checkout_time: "",
      accommodation_type: [],
    });
  };

  const filtrosSeleccionados = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  }).length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConstantes, resServicios] = await Promise.all([
          service.obtenerConstantes(),
          service.obtenerServicios(),
        ]);
        setConstantes(resConstantes.data.data);
        setServicios(
          resServicios.data.data.map((s) => ({ value: s.id, label: s.attributes.name }))
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

    if (Array.isArray(e)) {
      return updateFilters(fieldName, e.map((o) => o.value));
    }

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
          <Search className="text-[#667085] mr-2" size={20} />          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre"
            value={filters.name}
            onChange={handleFilterChange}
            className="text-[#344054] text-base w-full outline-none bg-transparent"
          />
        </div>

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
            <XCircle className="mr-2" size={18} />
          </button></div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body className="overflow-y-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FiltroSelect label="Tipo de turista" name="tourist_type" options={constantes.tipo_turismo} selected={filters.tourist_type} onChange={handleFilterChange} isMulti />
            <FiltroSelect label="Tipo de alojamiento" name="accommodation_type" options={constantes.tipo_alojamiento} selected={filters.accommodation_type} onChange={handleFilterChange} isMulti />
            <FiltroSelect label="Servicios" name="amenity_feature" options={servicios} selected={filters.amenity_feature} onChange={handleFilterChange} isMulti />
            <div>
              <label className="text-sm">Rango de precio</label> <Select
                isSearchable
                name="price_range"
                options={constantes.rango_precio} // Asegúrate de que es [{ value: "...", label: "..." }]
                value={constantes.rango_precio.find(t => t.value === filters.price_range) || null} // Busca el seleccionado
                onChange={(selected) => setFilters((prev) => ({ ...prev, price_range: selected ? selected.value : "" }))} // Manejo del cambio
                className="mt-1"
              />       </div>     <div className="flex space-x-2">
              <FiltroFecha label="Check-in" name="checkin_time" value={filters.checkin_time} onChange={handleFilterChange} />
              <FiltroFecha label="Check-out" name="checkout_time" value={filters.checkout_time} onChange={handleFilterChange} />
            </div>
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
