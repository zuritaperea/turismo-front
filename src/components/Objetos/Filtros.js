import React, {useState, useEffect} from "react";
import {Filter, Search, SlidersHorizontal} from "lucide-react";
import Modal from "../Modal";
import Button from "../Button";
import service from "../../axios/services/objeto";
import FiltroSelect from "./FiltroSelect";
import FiltroInput from "./FiltroInput";

const initialFilters = {
    name: "",
    tourist_type: [],
    destino: "",
    price_range: "",
    amenity_feature: [],
    checkin_time: "",
    checkout_time: "",
    accommodation_type: [],
    type_attractive: "",
    services: [],
    activities: [],
    subtype_attractive: "",
    free_access: "",
    type_commerce: "",
    resto_type: "",
    served_cuisine: [],
    accepts_reservations: "",
    event_class: "",
    speaker_name: "",
    presentador_name: "",
    moderador_name: "",
    start_date: "",
    end_date: "",
};

const Filtros = ({objetoService, setObjetosFiltrados, target}) => {
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
    const [subtipoAtractivos, setSubtipoAtractivos] = useState([]);

    const limpiarFiltros = () => setFilters(initialFilters);

    const filtrosSeleccionados = Object.entries(filters).filter(([key, value]) => {
        if (key === "name") return false;
        if (key === "type_attractive") return false;

        if (Array.isArray(value)) return value.length > 0;
        return value !== "";
    }).length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resConstantes, resServicios, resActividades] = await Promise.all([
                    service.obtenerConstantesUsadasTipo(target),
                    service.obtenerServicios(),
                    service.obtenerActividades(),
                ]);
                setConstantes(resConstantes.data.data);
                setServicios(
                    resServicios.data.data.map((s) => ({value: s.id, label: s.attributes.name}))
                );
                setActividades(
                    resActividades.data.data.map((s) => ({value: s.id, label: s.attributes.name}))
                );
            } catch (error) {
                console.error("Error obteniendo datos de API", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        const fetchSubtipoAtractivos = async () => {
            setSubtipoAtractivos([]);
            if (filters.type_attractive) {
                // Si no hay tipo de atractivo seleccionado, no hacemos la llamada
                try {
                    const response = await service.obtenerSubtipoAtractivos(filters.type_attractive);
                    const subtipoOptions = response.data.map((s) => ({
                        value: s[0],
                        label: s[1],
                    }));
                    setSubtipoAtractivos(subtipoOptions);
                } catch (error) {
                    console.error("Error obteniendo subtipo de atractivos", error);
                }
            }
        }
        fetchSubtipoAtractivos()
    }, [filters.type_attractive]);


    const handleFilterChange = (e, fieldName) => {
        const updateFilters = (key, val) =>
            setFilters((prev) => {
                if (!val || (Array.isArray(val) && val.length === 0)) {
                    const {[key]: _, ...rest} = prev;
                    return rest;
                }
                return {...prev, [key]: val};
            });

        if (fieldName) {
            if (Array.isArray(e)) {
                return updateFilters(fieldName, e.map((o) => o.value));
            } else {
                return updateFilters(fieldName, e?.value || "");
            }
        }

        const {name, value, type, checked} = e.target;
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
        <div className="w-full px-4">
            <div
                className="
    bg-black bg-opacity-95 rounded-2xl shadow-md
    flex flex-col lg:flex-row items-center justify-center
    gap-2 px-2 py-4 w-full max-w-full overflow-hidden
  "
                style={{backgroundColor: "rgba(46, 45, 44, 0.95)"}}
            >
                <div className="flex items-center bg-white rounded-full px-4 py-2 w-full lg:w-auto">
                    <Search className="text-black mr-2" size={18}/>
                    <input
                        type="text"
                        name="name"
                        placeholder="Buscar por nombre"
                        value={filters.name}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                aplicarFiltros();
                            }
                        }}
                        onChange={handleFilterChange}
                        className="text-gray-700 placeholder-gray-700 bg-transparent outline-none w-full"
                    />
                </div>

                {['Atractivo', 'Circuito'].includes(target) && (
                    <FiltroSelect
                        className="w-full lg:w-auto"
                        name="type_attractive"
                        placeholder="Tipo de atractivo"
                        options={constantes.tipo_atractivo}
                        selected={filters.type_attractive}
                        onChange={handleFilterChange}
                    />
                )}
                {target === "Alojamiento" && (
                    <FiltroSelect className="w-full lg:w-auto" name="amenity_feature" options={servicios}
                                  selected={filters.amenity_feature} onChange={handleFilterChange} isMulti/>
                )}
                {target === "Evento" && (
                    <FiltroSelect className="w-full lg:w-auto" name="event_class" options={constantes.tipo_evento}
                                  selected={filters.event_class} onChange={handleFilterChange}/>
                )}
                {target === "Comecio" && (
                    <FiltroSelect className="w-full lg:w-auto" name="type_commerce" options={constantes.tipo_comercio}
                                  selected={filters.type_commerce} onChange={handleFilterChange}/>
                )}
                {target !== "Evento" && target !== "Comercio" && target !== "Alojamiento" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center bg-white rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition w-full lg:w-auto"
                    >
                        <Filter className="text-black mr-2" size={18}/>
                        <span className="text-gray-700">
              {filtrosSeleccionados > 0
                  ? `${filtrosSeleccionados} filtros seleccionados`
                  : "Filtros avanzados"}
            </span>

                        <div className="align-right">
                            <SlidersHorizontal className="ml-2 text-black" size={18}/>
                        </div>
                    </button>)}

                <button
                    onClick={aplicarFiltros}
                    className="bg-black text-white font-semibold rounded-full px-6 py-2 hover:bg-gray-900 transition w-full md:w-auto"
                >
                    Aplicar
                </button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body className="bg-[#2e2d2c]/95 text-white p-4 rounded-xl max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4">
                        {target === "Circuito" && (
                            <FiltroSelect label="Tipo de turista" name="tourist_type" options={constantes.tipo_turismo}
                                          forceSelect selected={filters.tourist_type} onChange={handleFilterChange}
                                          isMulti/>
                        )}

                        {target === "Atractivo" && (
                            <>
                                <FiltroSelect label="Subtipo de Atractivo" name="subtype_attractive"
                                              options={subtipoAtractivos} selected={filters.subtype_attractive}
                                              onChange={handleFilterChange} isMuli/>
                                <FiltroSelect label="Servicios" name="services" options={servicios}
                                              selected={filters.services} onChange={handleFilterChange} isMulti/>
                                <FiltroSelect label="Actividades" name="activities" options={actividades}
                                              selected={filters.activities} onChange={handleFilterChange} isMulti
                                              forceSelect/>
                                <FiltroSelect label="Acceso Gratuito" name="free_access" selected={filters.free_access}
                                              forceSelect isBoolean onChange={handleFilterChange}/>
                            </>
                        )}
                        {target === "Gastronomia" && (
                            <>
                                <FiltroSelect label="Acepta reservas" name="accepts_reservations"
                                              selected={filters.accepts_reservations} forceSelect isBoolean
                                              onChange={handleFilterChange}/>
                                <FiltroSelect label="Tipo de restaurante" name="resto_type"
                                              selected={filters.resto_type} forceSelect
                                              options={constantes.tipo_restaurante} onChange={handleFilterChange}/>
                            </>
                        )}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-between w-full px-4">
                        <Button variant="secondary" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Listo
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Filtros;
