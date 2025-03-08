import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import { AuthContext } from "./AuthContext";
import { Sun, Menu, X } from 'lucide-react';

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [email, setEmail] = useState(null);
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useNavigate();
  const location = useLocation();
  const [headerLogo, setHeaderLogo] = useState(logo);
  const [headerTitle, setHeaderTitle] = useState('Sistema de Turismo');
  const config = useContext(ConfigContext);

  const handleGoBack = () => {
    history(-1);
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/inicio";

  useEffect(() => {
    if (config) {
      setHeaderLogo(config.logo || logo);
      setHeaderTitle(config.title || 'Sistema de Turismo');
    }
  }, [config]);

  useEffect(() => {
    if (user?.profile?.length > 0) {
      const persona = user.profile.find(p => p.type === "Persona");
      if (persona && persona.attributes.nombre && persona.attributes.apellido) {
        setPersonaDenominacion(`${persona.attributes.nombre} ${persona.attributes.apellido}`);
      } else {
        setPersonaDenominacion(user?.username);
      }
    } else {
      setPersonaDenominacion(user?.username);
    }
    setEmail(user?.username);
  }, [user]);

  return (
    <header className="w-full shadow-md bg-white py-4 px-6 md:px-10">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img className="h-10" src={headerLogo} alt="Logo" />
            {isHomePage && (
              <h1 className="ml-3 font-semibold text-lg font-inter hidden sm:block">
                {headerTitle}
              </h1>
            )}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} className="text-gray-700" /> : <Menu size={28} className="text-gray-700" />}
          </button>
          <Sun className="text-yellow-500" size={24} />

        </div>


        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600 text-[#475467] font-medium text-base">Inicio</Link>
          <Link to="/alojamientos" className="hover:text-blue-600 text-[#475467] font-light text-base">Alojamiento</Link>
          <Link to="/actividades" className="hover:text-blue-600 text-[#475467] font-light text-base">Actividades</Link>
          <Link to="/eventos" className="hover:text-blue-600 text-[#475467] font-light text-base">Eventos</Link>
          <Link to="/circuito" className="hover:text-blue-600 text-[#475467] font-light text-base">Circuito</Link>
          <Sun className="text-yellow-500" size={24} />
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 transition-all duration-300 z-50">
          <nav className="flex flex-col gap-4 items-center">
            <Link to="/" className="hover:text-blue-600 text-[#475467] font-medium text-base" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/alojamiento" className="hover:text-blue-600 text-[#475467] font-light text-base" onClick={() => setMenuOpen(false)}>Alojamiento</Link>
            <Link to="/actividades" className="hover:text-blue-600 text-[#475467] font-light text-base" onClick={() => setMenuOpen(false)}>Actividades</Link>
            <Link to="/eventos" className="hover:text-blue-600 text-[#475467] font-light text-base" onClick={() => setMenuOpen(false)}>Eventos</Link>
            <Link to="/circuito" className="hover:text-blue-600 text-[#475467] font-light text-base" onClick={() => setMenuOpen(false)}>Circuito</Link>
          </nav>
        </div>
      )}

    </header>
  );
}
