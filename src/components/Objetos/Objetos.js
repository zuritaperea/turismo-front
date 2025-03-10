"use client"

import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import Listado from "./Listado"
import Header from "../Header"
import Footer from "../Footer"
import { Calendar, Search, SlidersHorizontal, User, X } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import Mapa from "./Mapa";
import FiltrosBusqueda from "./FiltrosBusqueda"

const mapStyles = `
  .leaflet-control-zoom {
    display: none !important;
  }
  .leaflet-control-attribution {
    display: none !important;
  }
`

const ObjetosScreen = ({ navigation, target, title, objetoService }) => {
  const [objetos, guardarObjetos] = useState([])
  const [objetosFiltrados, setObjetosFiltrados] = useState([])
  const [textoBuscar, setTextoBuscar] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState([
    { id: 1, name: "Música" },
    { id: 2, name: "+18" },
  ])

  const customIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#f08400" fillOpacity="0.3" />
        <circle cx="12" cy="12" r="6" fill="#f08400" />
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })

  const obtenerTodos = async () => {
    setLoading(true)
    guardarObjetos([])
    setObjetosFiltrados([])
    try {
      const response = await objetoService.obtenerTodos()
      const data = response.data.data

      const objetosData = data.map((obj) => ({
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
      }))

      guardarObjetos(objetosData)
      setObjetosFiltrados(objetosData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    document.title = `${process.env.REACT_APP_DOCUMENT_TITLE} - ${title}`
    obtenerTodos()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [navigation])

  const search = (searchText) => {
    setLoading(true)
    setObjetosFiltrados([])
    if (searchText !== "") {
      const regex = new RegExp(searchText, "gi")

      const filteredData = objetos.filter((record) => record.title.match(regex))

      setObjetosFiltrados(filteredData)
    } else {
      setObjetosFiltrados(objetos)
    }
    setLoading(false)
  }

  const removeFilter = (id) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(textoBuscar)
    }
  }

  // Coordenadas de Curitiba como centro predeterminado
  const defaultPosition = [-25.429722, -49.271944]

  // Verificar si hay objetos con coordenadas
  const hasCoordinates = objetosFiltrados.some(
    (objeto) =>
      objeto.coordinates &&
      typeof objeto.coordinates === "object" &&
      objeto.coordinates.latitude &&
      objeto.coordinates.longitude
  )

  return (
    <div className="flex flex-col min-h-screen">
      <style>{mapStyles}</style>
      <Header />

      <div className="flex flex-col md:flex-row flex-grow justify-center align-middle">
        <div className="w-full md:w-1/2 flex flex-col">
          <FiltrosBusqueda/>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-[#667085] flex-1">Cargando...</div>
          ) : (
            <div className="flex flex-col flex-grow overflow-hidden">
              <div className="px-4 pt-4 pb-3">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#667085]" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={textoBuscar}
                    onChange={(e) => setTextoBuscar(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full py-3 pl-11 pr-4 border border-[#d0d5dd] rounded-lg text-base text-[#344054] focus:outline-none"
                  />
                </div>
              </div>

              <div className="px-4 pb-3">
                <button className="w-full py-3 border border-[#d0d5dd] rounded-lg flex items-center justify-center gap-2 bg-white text-[#344054] text-base">
                  <SlidersHorizontal size={18} />
                  <span>2 filtros aplicados</span>
                </button>
                <div className="grid grid-cols-2 gap-2 rounded-lg mt-4 border-[#d0d5dd]">
                  <button className="py-3.5 text-center rounded-lg text-[#344054] border-2 border-[#d0d5dd] bg-white text-base cursor-pointer">
                    Ord. por calificación
                  </button>
                  <button className="py-3.5 text-center text-[#344054] border-2 rounded-lg bg-white text-base cursor-pointer">
                    Ord. por cercanía
                  </button>
                </div>
              </div>

              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center bg-white border border-[#d0d5dd] rounded-full px-3 py-1"
                  >
                    <span className="text-sm text-[#344054]">{filter.name}</span>
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="ml-1.5 text-[#667085] bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              

            </div>
          )}
        </div>

        <div className="hidden md:block md:w-1/2 lg:ml-10 h-[calc(100vh-64px)]">
          {!hasCoordinates ? (
            <div className="flex items-center justify-center h-full bg-[#f9fafb] text-[#667085] text-sm text-center p-5">
              No hay ubicaciones para mostrar en el mapa
            </div>
          ) : (
            <Mapa objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
          )}
        </div>
      </div>

      <div className="overflow-auto flex-grow mt-7 flex justify-center">
                <Listado objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
              </div>

      <Footer />
    </div>
  )
}

export default ObjetosScreen

