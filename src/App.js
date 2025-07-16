import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./screens/Inicio";
import Logout from "./screens/Logout";
import Login from "./screens/Login";
import Perfil from "./screens/Perfil";
import DestinoScreen from "./screens/Destino";

import BusquedaScreen from "./screens/Busqueda";
import AtractivoScreen from "./screens/Atractivo";
import AlojamientoScreen from "./screens/Alojamiento";
import AlojamientosScreen from "./screens/Alojamientos";
import PuntoInteresScreen from "./screens/PuntoInteres";
import CircuitoScreen from "./screens/Circuito";
import EventoScreen from "./screens/Evento";
import { v4 as uuidv4 } from 'uuid';
import AtractivosScreen from "./screens/Atractivos";
import DestinosScreen from "./screens/Destinos";
import CookieConsent from "./components/CookieConsent";
import Registro from "./screens/Registro";
import Recupero from "./screens/Recupero";
import Eventos from "./screens/Eventos";
import PuntosInteres from "./screens/PuntosInteres";
import ViajeScreen from "./screens/Viaje";
import CircuitosScreen from "./screens/Circuitos";
import GastronomiasScreen from "./screens/Gastronomias";
import GastronomiaScreen from "./screens/Gastronomia";
import ComerciosScreen from "./screens/Comercios"
import ComercioScreen from "./screens/Comercio"
import ScrollToTopButton from "./components/ScrollToTopButton";
import Splash from "./components/Splash";
import { ConfigProvider } from './extras/ConfigContext';
import { AuthProvider } from "./components/AuthContext";
import Marketplace from "./screens/Marketplace";
import ConfirmacionReserva from "./screens/ConfirmacionReserva";
import ComprobanteReserva from "./screens/ComprobanteReserva";
import MisReservas from "./screens/MisReservas";
import Paginas from "./screens/Paginas";
import Pagina from "./screens/Pagina";
import Reserva from "./screens/Reserva";
import Pasaporte from "./screens/Pasaporte";
import CargaEvidencia from "./screens/CargaEvidencia";
import MisEvidencias from "./screens/MisEvidencias";
import PerfilAmbiental from "./screens/PerfilAmbiental";
import FaviconSetter from "./components/FaviconSetter";
import CambiarClaveConToken from "./screens/CambiarClaveConToken";
import 'animate.css';
import i18n from "./i18n";
import NotFound from "./screens/NotFound";


function App() {

  useEffect(() => {
    // Si no hay idioma guardado en localStorage, forzar español
    if (!localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage('es');
    }
  }, []);

  // Verificar si ya existe un UUID en el localStorage
  let userIdentifier = localStorage.getItem('userIdentifier');

  const handleConsent = (consentAccepted) => {
    if (consentAccepted) {
      if (!userIdentifier) {
        // Generar un nuevo UUID si no existe y se acepta el consentimiento
        userIdentifier = uuidv4();
        localStorage.setItem('userIdentifier', userIdentifier);
      }
    } else {
      // Eliminar el identificador si se rechaza el consentimiento
      localStorage.removeItem('userIdentifier');
    }
  };
  return (
    <ConfigProvider>
      <FaviconSetter />
      <AuthProvider>
        <>
          <CookieConsent onConsent={handleConsent} />
          <BrowserRouter basename="/sitio">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/destino/:id" element={<DestinoScreen />} />
              <Route path="/destino/:id/:filtros" element={<DestinoScreen />} />
              <Route path="/destinos" element={<DestinosScreen />} />
              <Route path="/destinos/:id" element={<DestinosScreen />} />
              <Route path="/busqueda/:nombre" element={<BusquedaScreen />} />
              <Route path="/busqueda" element={<BusquedaScreen />} />
              <Route path="/atractivo" element={<AtractivoScreen />} />
              <Route path="/atractivos" element={<AtractivosScreen />} />
              <Route path="/atractivos/:id" element={<AtractivosScreen />} />
              <Route path="/gastronomia" element={<GastronomiasScreen />} />
              <Route path="/gastronomia/:id" element={<GastronomiaScreen />} />
              <Route path="/comercios" element={<ComerciosScreen />} />
              <Route path="/comercio/:id" element={<ComercioScreen />} />
              <Route path="/atractivo/:id" element={<AtractivoScreen />} />
              <Route path="/alojamiento/:id" element={<AlojamientoScreen />} />
              <Route path="/alojamientos" element={<AlojamientosScreen />} />
              <Route path="/puntointeres/:id" element={<PuntoInteresScreen />} />
              <Route path="/puntointeres" element={<PuntoInteresScreen />} />
              <Route path="/puntosinteres/:id" element={<PuntosInteres />} />
              <Route path="/puntosinteres" element={<PuntosInteres />} />
              <Route path="/circuito/:id" element={<CircuitoScreen />} />
              <Route path="/circuitos" element={<CircuitosScreen />} />
              <Route path="/circuitos/:id" element={<CircuitosScreen />} />
              <Route path="/evento/:id" element={<EventoScreen />} />
              <Route path="/eventos/:id" element={<Eventos />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/evento" element={<EventoScreen />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/recuperar-clave" element={<Recupero />} />
              <Route path="/viajes" element={<ViajeScreen />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/pasaporte" element={<Pasaporte />} />
              <Route path="/confirmacion-reserva" element={<ConfirmacionReserva />} />
              <Route path="/comprobante-reserva" element={<ComprobanteReserva />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
              <Route path="/mis-evidencias" element={<MisEvidencias />} />

              <Route path="/paginas" element={<Paginas />} />
              <Route path="/page/:slug" element={<Pagina />} />
              <Route path="/reserva/:id" element={<Reserva />} />

              <Route path="/cargar-evidencia" element={<CargaEvidencia />} />
              <Route path="/perfil-ambiental" element={<PerfilAmbiental />} />
              <Route path="/recuperar-cuenta/:uid/:token" element={<CambiarClaveConToken />} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
          <ScrollToTopButton />
        </></AuthProvider>
    </ConfigProvider>
  );
}

export default App;
