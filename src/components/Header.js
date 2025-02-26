import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import { AuthContext } from "./AuthContext";

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
    <header className="w-full shadow-md px-56 py-10 bg-white relative">
      <div className="flex items-center relative">
        <div className="flex items-center absolute left-0">
          {isHomePage ? (
            <>
              <Link to="/">
                <img className="logo" src={headerLogo} alt="Logo" />
              </Link>
              <Link to="/">
                <h1 className="ml-3 font-bold text-lg font-poppins">{headerTitle}</h1>
              </Link>
            </>
          ) : (
            <div className="cursor-pointer flex items-center" onClick={handleGoBack}>
              <div className="rounded-full h-10 w-10 flex items-center justify-center">
                <i className="fas fa-chevron-left text-base"></i>
              </div>
              <h1 className="ml-3 font-bold text-lg font-poppins">Atrás</h1>
            </div>
          )}
        </div>

        <nav className="absolute inset-x-0 mx-auto flex justify-center w-max">
          <div className="flex gap-6">
            <Link to="/descubre" className="hover:text-blue-600 font-bold text-lg font-poppins">Descubre</Link>
            <Link to="/experiencias" className="hover:text-blue-600 font-bold text-lg font-poppins">Experiencias</Link>
            <Link to="/eventos" className="hover:text-blue-600 font-bold text-lg font-poppins">Eventos</Link>
            <Link to="/planifica" className="hover:text-blue-600 font-bold text-lg font-poppins">Planifica</Link>
          </div>
        </nav>
      </div>
    </header>

  );
}
