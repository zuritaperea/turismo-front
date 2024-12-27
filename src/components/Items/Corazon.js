import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Corazon = ({ favorito, size }) => {
  return (
    <div>
      <FontAwesomeIcon
        icon={faHeart}
        color={favorito ? "orangered" : "lightgray"}
        size={size}
      />
    </div>
  );
};

export default Corazon;
