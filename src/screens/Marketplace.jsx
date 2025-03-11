import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import SeccionesSlider from "../components/SectionSlider";
import Carousel from "../components/Carousel";
import Splash from "../components/Splash";
import { ConfigContext } from "../extras/ConfigContext";
import { Ticket, MapPinned, Hotel, Bus, ShoppingBag, Utensils } from "lucide-react";
import EventoMarketplace from "../components/EventoMarketplace";
import FiltrosEventos from "./FiltrosEventos";

export default function Marketplace() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [naturalAttractions, setNaturalAttractions] = useState([]);
  const [loadingAtractivos, setLoadingAtractivos] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); 
  const config = useContext(ConfigContext);


  const imagesTest = [
    { file: "https://picsum.photos/id/227/300/200" },
    { file: "https://picsum.photos/id/217/300/200" },
    { file: "https://picsum.photos/id/237/300/200" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (config) {
      setImages(config.carousel_items || imagesTest);
    }
  }, [config]);

  const secciones = [
    { icono: <Ticket size={30} />, titulo: "Eventos"},
    { icono: <MapPinned size={30} />, titulo: "Atractivos", link: "/atractivos" },
    { icono: <Hotel size={30} />, titulo: "Alojamientos", link: "/alojamientos" },
    { icono: <Bus size={30} />, titulo: "Circuitos", link: "/circuitos" },
    { icono: <ShoppingBag size={30} />, titulo: "Comercios", link: "/comercios" },
    { icono: <Utensils size={30} />, titulo: "Gastronomía", link: "/gastronomia" },
  ];

  const handleSectionClick = (titulo) => {
    if (selectedSection === titulo) {
      setSelectedSection("");
    } else {
      setSelectedSection(titulo);
    }
  };

  return (
    <>
      {loading ? <Splash /> : null}
      <Header />
      <div className="flex justify-center flex-col items-center px-8">
        <SeccionesSlider secciones={secciones} onSectionClick={handleSectionClick} selectedSection={selectedSection}  />
      </div>
      <FiltrosEventos/>

      {selectedSection === "Eventos" && (
        <div className="my-8 mx-8">
          {loadingEventos ? <Spinner /> : <EventoMarketplace  />}
        </div>
      )}
      <Footer />
    </>
  );
}
