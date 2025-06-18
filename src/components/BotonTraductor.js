import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import i18n from "../i18n";

const BotonTraductor = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setOpen(!open);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  // Cierra el menú si clickea afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="z-20 bg-white text-gray-700 p-2 rounded hover:bg-gray-100 focus:outline-none"
        title="Cambiar idioma"
      >
        <FontAwesomeIcon icon={faGlobe} className="text-xl" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 animate-fade-in">
          <div className="py-1">
            <button
              onClick={() => changeLanguage("es")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="fi fi-es mr-2"></span> Español
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="fi fi-us mr-2"></span> English
            </button>
            <button
              onClick={() => changeLanguage("pt")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="fi fi-br mr-2"></span> Português
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotonTraductor;
