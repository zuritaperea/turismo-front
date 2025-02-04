// Header.js
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import { AuthContext } from "./AuthContext";
import Sidebar from "./Sidebar"; // Importa el componente Sidebar

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [email, setEmail] = useState(null);
  const { user } = useContext(AuthContext);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const history = useNavigate();
  const location = useLocation();
  const [headerLogo, setHeaderLogo] = useState(logo);
  const [headerTitle, setHeaderTitle] = useState('Sistema de Turismo');
  const config = useContext(ConfigContext);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

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
    <>
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          {isHomePage ? (
            <>
              <Link to="/">
                <img className="logo" src={headerLogo} alt="Logo" />
              </Link>
              <Link to="/">
                <h1 className="ml-3 font-extrabold text-base">{headerTitle}</h1>
              </Link>
            </>
          ) : (
            <div className="cursor-pointer flex items-center" onClick={handleGoBack}>
              <div className="rounded-full h-10 w-10 flex items-center justify-center">
                <i className="fas fa-chevron-left text-base"></i>
              </div>
              <h1 className="ml-3 font-extrabold text-base">Atras</h1>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon
            icon={faBars}
            className="text-gray-500 text-xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      </header>

      <Sidebar
        sidebarVisible={sidebarVisible}
        closeSidebar={closeSidebar}
        headerLogo={headerLogo}
        headerTitle={headerTitle}
        personaDenominacion={personaDenominacion}
        email={email}
      />
    </>
  );
}
