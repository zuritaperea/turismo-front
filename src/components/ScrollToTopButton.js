import React, { useState, useEffect } from 'react';
import Button from "./Button";
import { faUpLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para manejar el scroll
  const handleScroll = () => {
    // Verificamos la posición del scroll
    if (window.scrollY > 100) {
      setIsVisible(true); // Si el scroll es mayor a 100px, el botón se muestra
    } else {
      setIsVisible(false); // Si el scroll es menor o igual a 100px, el botón se oculta
    }
  };

  // Usamos useEffect para agregar el listener al evento scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Limpiamos el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // El efecto solo se ejecutará una vez al montar el componente

  // Función para manejar el desplazamiento al principio de la página
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // El botón solo es visible cuando isVisible es true
    isVisible && (
      <Button
        type="primary"
        className="fixed bottom-5 right-5 rounded-full bg-principal p-3 text-xs font-medium 
          shadow-md transition duration-150 
          ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700
          focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
        onClick={handleScrollToTop}
      >
        <FontAwesomeIcon icon={faUpLong} />
      </Button>
    )
  );
};

export default ScrollToTopButton;
