import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import { AuthContext } from "./AuthContext";
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import MenuLink from "./MenuLink";
import BotonTraductor from "./BotonTraductor";

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [headerLogo, setHeaderLogo] = useState(logo);
  const [headerTitle, setHeaderTitle] = useState('Sistema de Turismo');
  const config = useContext(ConfigContext);
  const [menuItems, setMenuItems] = useState([])

  const isHomePage = location.pathname === "/" || location.pathname === "/inicio";

  useEffect(() => {
    if (config) {
      setHeaderLogo(config.logo || logo);
      setHeaderTitle(config.title || 'Sistema de Turismo');
      setMenuItems(config?.menus?.[0]?.attributes?.items || []);
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
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige al inicio después del logout
  };

  return (
    <header className="w-full shadow-md py-4 px-6 md:px-10">
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

        <nav className="hidden md:flex gap-6 items-center">
          {menuItems.filter(item => {
            if (item.requires_authentication) {
              return user !== null; // solo si hay usuario
            }
            return true; // siempre muestra si no requiere auth
          }).map(item => (
            <MenuLink
              key={item.id}
              item={item}
              onClick={() => setMenuOpen(false)}
              className="font-light text-base"
            />
          ))}
          {user ? (
            // Icono de usuario con menú desplegable
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center">
                <User size={24} className="text-gray-700" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-20">
                  <p className="px-4 py-2 text-gray-700 font-medium">{personaDenominacion}</p>
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-medium"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                  >
                    <LogOut size={18} className="text-gray-700" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" title="Iniciar sesión">
              <LogIn size={24} className="text-gray-700" />
            </Link>
          )}
                        <BotonTraductor />

        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} className="text-gray-700" /> : <Menu size={28} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 transition-all duration-300 z-50">
          <nav className="flex flex-col gap-4 items-center">
            {menuItems.filter(item => {
              if (item.requires_authentication) {
                return user !== null; // solo si hay usuario
              }
              return true; // siempre muestra si no requiere auth
            }).map(item => (
              <MenuLink
                key={item.id}
                item={item}
                onClick={() => setMenuOpen(false)}
                className="font-light text-base"
              />
            ))}
            {user ? (
              <>
                <Link
                  to="/perfil"
                  className="flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={24} className="text-gray-700" />
                  <span>Mi Perfil</span>
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  title="Cerrar sesión"
                  className="flex items-center gap-2"
                >
                  <LogOut size={24} className="text-gray-700" />
                  <span>Cerrar sesión</span>
                </button>  </>

            ) : (
              <Link to="/login" title="Iniciar sesión" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <span>Iniciar sesión</span>
              </Link>
            )}
          <div className="flex items-center"> <BotonTraductor />Traducir</div> 
          </nav>
        </div>
      )}
    </header>
  );
}
