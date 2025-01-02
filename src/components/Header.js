import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const history = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    history(-1);
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/inicio";

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setPersonaDenominacion(item?.username);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };


  const closeSidebar = () => {
    setSidebarVisible(false);
  };


  return (
    <>
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img className="logo" src={logo} alt="Logo" /></Link>
          <Link to="/">
            <h1 className="ml-3 font-extrabold text-base">Sistema de Turismo</h1></Link>
        </div>
        <div className="flex items-center space-x-4">
          <i className="fas fa-cloud text-gray-500 text-xl"></i>
          <FontAwesomeIcon
            icon={faBars}
            className="text-gray-500 text-xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      </header>

      <div className={`fixed z-30	left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} duration-300`}>
        <div className="flex flex-row h-full">
          <div className="h-full w-full flex-col">
            <div className="mt-8 flex items-center justify-center">
              <img className="logo" src={logo} alt="Logo" />
              <h1 className="ml-3 font-extrabold text-base">Curitiba</h1>
            </div>
            <div className="flex flex-col">

              <div className=""><hr /></div>
              <div className="p-5">
                {personaDenominacion ? (
                  <>
                    Bienvenido: <b><a href="/perfil"><FontAwesomeIcon icon={faUser} /> {personaDenominacion}</a></b>
                    <span style={{ marginLeft: '10px' }}>|</span>{' '}
                    <a href="/logout"><FontAwesomeIcon icon={faSignOutAlt} /> Desconectar</a>
                  </>
                ) : (
                  <a href="/login">Ingresar</a>
                )}</div>
            </div></div>
          <div className="h-full sidebar-cerrar">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-white text-xl cursor-pointer m-2"
              onClick={closeSidebar}
            />
          </div>
        </div>
      </div>

    </>
  );
}
