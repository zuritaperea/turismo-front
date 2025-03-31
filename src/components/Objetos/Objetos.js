"use client"

import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import Listado from "./Listado"
import Header from "../Header"
import Footer from "../Footer"
import { Calendar, CaseLower, Search, SlidersHorizontal, User, X } from "lucide-react"
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

  const defaultImage = process.env.REACT_APP_IMAGE_DEFAULT;
  const [backgroundImage, setBackgroundImage] = useState(defaultImage);

  useEffect(() => {
    if (objetosFiltrados.length > 0) {
      const randomIndex = Math.floor(Math.random() * objetosFiltrados.length);
      setBackgroundImage(objetosFiltrados[randomIndex].image);
    }
  }, [objetosFiltrados]);


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
        location: obj.attributes.location, 
        startDate: obj.attributes.start_date 
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

  const defaultPosition = [-25.429722, -49.271944]

  const hasCoordinates = objetosFiltrados.some(
    (objeto) =>
      objeto.coordinates &&
      typeof objeto.coordinates === "object" &&
      objeto.coordinates.latitude &&
      objeto.coordinates.longitude
  )

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <style>{mapStyles}</style>
      <Header />

      <div 
      className="relative w-full h-24 md:h-32 lg:h-40 flex items-center justify-center 
      text-center text-white bg-cover   bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>

      {/* Título */}
      <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold">
        {title}
      </h1>
    </div>

      <div className="flex flex-col md:flex-row flex-grow justify-center items-center align-middle">
        


        <div className="hidden md:block md:w-1/2 lg:ml-10 ">
          {!hasCoordinates ? (
            <div className="flex items-center justify-center h-full bg-[#f9fafb] text-[#667085] text-sm text-center ">
              No hay {title?.toLowerCase()} para mostrar en el mapa
            </div>
          ) : (
            <Mapa objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
          )}
        </div>
      </div>

      <div className="mt-7 flex justify-center align-middle items-center">
        <Listado objetosFiltrados={objetosFiltrados} navigation={navigation} target={target} />
      </div>
      <Footer />
    </div>
  )
}

export default ObjetosScreen

