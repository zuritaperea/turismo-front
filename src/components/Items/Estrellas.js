import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Estrellas = ({ puntuacion = 0, setPuntuacion = null, size = "lg" }) => {
  const [valor, setValor] = useState(puntuacion);
  const [hover, setHover] = useState(null); // estado para el hover

  useEffect(() => {
    setValor(puntuacion);
  }, [puntuacion]);

  const handleClick = (index) => {
    if (setPuntuacion) {
      setValor(index);
      setPuntuacion(index);
    }
  };

  const isInteractive = !!setPuntuacion;

  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size={size}
          className={`transition-colors duration-200 ${
            isInteractive ? "cursor-pointer" : "cursor-default"
          }`}
          color={
            hover !== null
              ? i <= hover
                ? "gold"
                : "lightgray"
              : i <= valor
              ? "gold"
              : "lightgray"
          }
          onMouseEnter={() => isInteractive && setHover(i)}
          onMouseLeave={() => isInteractive && setHover(null)}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  );
};

export default Estrellas;
