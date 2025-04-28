import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const BotonTraductor = () => {
  const [visible, setVisible] = useState(false);

  const toggleTraductor = () => {
    const contenedor = document.getElementById("google-translator");
    if (contenedor) {
      if (visible) {
        contenedor.classList.add("hidden");
      } else {
        contenedor.classList.remove("hidden");
      }
      setVisible(!visible);
    }
  };

  return (
    <button
      onClick={toggleTraductor}
      className="z-20 bg-white text-gray-700 p-3"
      title="Traducir"
    >
      <FontAwesomeIcon icon={faGlobe} className="text-xl" />
    </button>
  );
};

export default BotonTraductor;
