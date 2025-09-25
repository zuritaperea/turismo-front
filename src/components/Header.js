import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext';
import { AuthContext } from "./AuthContext";
import { Menu, X, LogIn, LogOut, User, Leaf, Calendar, ChevronDown } from 'lucide-react';
import MenuLink from "./MenuLink";
import BotonTraductor from "./BotonTraductor";
import SocialLinks from "./SocialLinks";
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [personaDenominacion, setPersonaDenominacion] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [headerLogo, setHeaderLogo] = useState(logo);
  const [headerTitle, setHeaderTitle] = useState('Sistema de Turismo');
  const config = useContext(ConfigContext);
  const [menuItems, setMenuItems] = useState([]);
  const isHomePage = location.pathname === "/" || location.pathname === "/inicio";
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const permisos = useMemo(() => ({
    pasaporte: config?.pasaporte || false,
    marketplace: config?.marketplace || false,
    modulo_sostenibilidad: config?.modulo_sostenibilidad || false
  }), [config]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
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
    navigate("/");
  };

  const toggleSubMenu = (id) => {
    setUserMenuOpen(false); // cerrar menu usuario al abrir submenu
    setSubMenuOpen((currentId) => (currentId === id ? null : id));
  };

  const toggleUserMenu = () => {
    setSubMenuOpen(null); // cerrar todos los submenus
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-50 bg-white shadow-md transition-all duration-300 ease-in-out ${scrolled ? 'py-2' : 'py-4'} px-6 md:px-10`}>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-10" src={headerLogo} alt="Logo" />
              <h1 className="ml-3 font-semibold text-lg font-inter hidden sm:block">
                {headerTitle}
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            {menuItems.filter(item => {
              if (item.requires_authentication) return user !== null;
              return true;
            }).map(item => (
              <div key={item.id} className="relative">
                {item.children && item.children.length > 0 ? (
                  <>
                    <a
                      onClick={() => toggleSubMenu(item.id)}
                      className="flex items-center gap-1 font-light cursor-pointer"
                    >
                      {item.name}
                      <ChevronDown size={16} className={`text-gray-500 mt-0.5 transition-transform ${subMenuOpen === item.id ? 'rotate-180' : ''}`} />
                    </a>

                    {subMenuOpen === item.id && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                        {item.children.map(child => (
                          <MenuLink
                            key={child.id}
                            item={child}
                            onClick={() => {
                              setMenuOpen(false);
                              setSubMenuOpen(null);
                            }}
                            isActive={location.pathname === child.url}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-medium"
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <MenuLink
                    item={item}
                    onClick={() => setMenuOpen(false)}
                    isActive={location.pathname === item.url}
                  />
                )}
              </div>




            ))}
            {user ? (
              <div className="relative">
                <button onClick={toggleUserMenu} className="flex items-center">
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
                      {t("perfil.titulo")}
                    </Link>
                    {permisos.marketplace && (<Link
                      to="/mis-reservas"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-medium"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("perfil.mis_reservas")}
                    </Link>)}
                    {permisos.modulo_sostenibilidad && (<Link
                      to="/perfil-ambiental"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-medium"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("perfil.mi_perfil_ambiental")}
                    </Link>)}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                    >
                      <LogOut size={18} className="text-gray-700" />
                      {t("perfil.cerrar_sesion")}
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
            <SocialLinks header={true} redes={config?.redes_sociales || []} />
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} className="text-gray-700" /> : <Menu size={28} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 transition-all duration-300 z-50">
            <nav className="flex flex-col gap-4 items-center">
              {menuItems.filter(item => {
                if (item.requires_authentication) {
                  return user !== null;
                }
                return true;
              }).map(item => (
                <div key={item.id} className="w-full">
                  <div className="flex items-center justify-between">
                    {item.children && item.children.length > 0 ? (
                      <div className="flex items-center justify-between w-full">
                        <a
                          onClick={() => toggleSubMenu(item.id)}
                          className="flex-1 text-left font-light  cursor-pointer"
                        >
                          {item.name}
                        </a>
                        <button onClick={() => toggleSubMenu(item.id)} className="p-2">
                          <ChevronDown
                            size={20}
                            className={`text-gray-700 transition-transform ${subMenuOpen === item.id ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <MenuLink
                        item={item}
                        onClick={() => setMenuOpen(false)}
                        isActive={location.pathname === item.url}
                      />
                    )}
                  </div>
                  {item.children && item.children.length > 0 && subMenuOpen === item.id && (
                    <div className="ml-4 flex flex-col gap-2 mt-2">
                      {item.children.map(child => (
                        <MenuLink
                          key={child.id}
                          item={child}
                          onClick={() => setMenuOpen(false)}
                          isActive={location.pathname === child.url}
                          className="text-gray-600 hover:text-gray-900"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {user ? (
                <>
                  <Link
                    to="/perfil"
                    className="flex w-full gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={24} className="text-gray-700" />
                    <span>{t("perfil.titulo")}</span>
                  </Link>
                  {permisos.marketplace && (
                    <Link
                      to="/mis-reservas"
                      className="flex w-full gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Calendar size={24} className="text-gray-700" />
                      <span>{t("perfil.mis_reservas")}</span>
                    </Link>
                  )}
                  {permisos.modulo_sostenibilidad && (
                    <Link
                      to="/perfil-ambiental"
                      className="flex w-full gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Leaf size={24} className="text-green-600" />
                      <span>{t("perfil.mi_perfil_ambiental")}</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    title={t("perfil.cerrar_sesion")}
                    className="flex w-full gap-2"
                  >
                    <LogOut size={24} className="text-gray-700" />
                    <span>{t("perfil.cerrar_sesion")}</span>
                  </button>
                </>
              ) : (
                <Link to="/login" title={t("perfil.iniciar_sesion")}
                className="flex w-full gap-2"
                onClick={() => setMenuOpen(false)}>
                  <span>{t("perfil.iniciar_sesion")}</span>
                </Link>
              )}
              <div className="flex ">
                <BotonTraductor />{t("perfil.traducir")}
              </div>
              <div className="flex justify-center mt-4">
                <SocialLinks header={true} redes={config?.redes_sociales || []} />
              </div>
            </nav>
          </div>
        )}
      </header>
      <div className="pt-20"></div></>
  );
}