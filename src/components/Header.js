import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [email, setEmail] = useState(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const history = useNavigate();
  const location = useLocation();
  const [headerLogo, setHeaderLogo] = useState(logo); // Estado para el logo
  const [headerTitle, setHeaderTitle] = useState('Sistema de Turismo'); // Estado para el título
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración


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
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setPersonaDenominacion(item?.username);
      setEmail(item?.username);
    }
  }, []);

  useEffect(() => {
    if (config) { // Verifica que config no sea null
      setHeaderLogo(config.logo || logo);
      setHeaderTitle(config.title || 'Sistema de Turismo');
    }
  }, [config]); // El useEffect se ejecuta cada vez que config cambia



  return (
    <>
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          {isHomePage ? (
            <> <Link to="/">
              <img className="logo" src={headerLogo} alt="Logo" /></Link>
              <Link to="/">
                <h1 className="ml-3 font-extrabold text-base">{headerTitle}</h1></Link>
            </>
          ) : (
            <div className="cursor-pointer flex items-center" onClick={handleGoBack}>
              <div className="rounded-full h-10 w-10 flex items-center justify-center">
                <i className="fas fa-chevron-left text-base"></i>
              </div>
              <h1 className="ml-3 font-extrabold text-base"> Atras</h1>
            </div>
          )}</div>
        <div className="flex items-center space-x-4">
          <i className="fas fa-cloud text-gray-500 text-xl"></i>
          <FontAwesomeIcon
            icon={faBars}
            className="text-gray-500 text-xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      </header>

      <div
        className={`fixed z-30 left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform transform duration-300 ${sidebarVisible
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : '-translate-x-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-row h-full">
          <div className="h-full w-full flex-col">
            <div className="mt-8 flex items-center justify-center">
            <Link to="/"><img className="logo" src={headerLogo} alt="Logo" /></Link>
            <Link to="/"> <h1 className="ml-3 font-extrabold text-base">{headerTitle}</h1></Link>
            </div>
            <div className="flex flex-col">

              <div className=""><hr /></div>
              <div className="p-5">
                {personaDenominacion ? (
                  <>
                  <div className="flex w-full items-center"> {/* Contenedor principal con ancho completo y alineación vertical centrada */}
  <Link to="/perfil">
    <FontAwesomeIcon
      icon={faUser}
      className="rounded-full h-5 p-1 border border-gray-500"
    />
  </Link>

  <div className="flex flex-col ml-2">
    <Link to="/perfil" className="block m-0 p-0 line-none"> {/* Elimina espaciado del Link */}
      <span className="text-sm font-bold line-none">{personaDenominacion}</span>{/* Ajusta line-height */}
    </Link>
    <Link to="/perfil" className="block m-0 p-0"> {/* Elimina espaciado del Link */}
      <span className="text-xs line-none">{email}</span>{/* Ajusta line-height */}
    </Link>
  </div>

  <div className="ml-auto"> {/* Margen automático a la izquierda para empujar el icono de logout a la derecha */}
    <Link to="/logout" >
      <FontAwesomeIcon icon={faSignOutAlt} className="color-gris h-4 " /> {/*color-gris cambiado a text-gray-500*/}
    </Link>
  </div>
</div>
                  </>
                ) : (
                  <Link to="/login">
                    Ingresar</Link>
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
