import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Estrellas = ({ puntuacion, size }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      <FontAwesomeIcon icon={faStar} color={puntuacion > 0 ? "gold" : "lightgray"} size={size} />
      <FontAwesomeIcon icon={faStar} color={puntuacion > 1 ? "gold" : "lightgray"} size={size} />
      <FontAwesomeIcon icon={faStar} color={puntuacion > 2 ? "gold" : "lightgray"} size={size} />
      <FontAwesomeIcon icon={faStar} color={puntuacion > 3 ? "gold" : "lightgray"} size={size} />
      <FontAwesomeIcon icon={faStar} color={puntuacion > 4 ? "gold" : "lightgray"} size={size} />
    </div>
  );
};

export default Estrellas;
