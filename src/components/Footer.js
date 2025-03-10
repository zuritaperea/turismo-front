import React, { useContext, useEffect, useState } from "react";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const [footerLogo, setFooterLogo] = useState(logo);
  const config = useContext(ConfigContext);
  const [footerDescription, setFooterDescription] = useState("");

  useEffect(() => {
    if (config) {
      setFooterLogo(config.footer_logo || logo);
      setFooterDescription(
        config.footer_description ||
          "Este es un párrafo descriptivo marketinero de cada uno de los destinos."
      );
    }
  }, [config]);

  return (
    <footer className="hidden md:block">
      {/* Sección superior del footer */}
      <div id="menu-footer" className="bg-white mt-10 py-5 px-10 mx-auto">
      <p className="descripcion text-center sm:mx-10 my-7 text-sm text-gray-600">
  {footerDescription}
</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          
          <div className="flex justify-center">
            <img className="logo" src={footerLogo} alt="Logo Footer" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <h3 className="titulo mb-4 text-center">About us</h3>
            </div>
            <div>
              <h3 className="titulo mb-4 text-center">Features</h3>
            </div>
            <div>
              <h3 className="titulo mb-4 text-center">FAQs</h3>
            </div>
            <div>
              <h3 className="titulo mb-4 text-center">Blog</h3>
            </div>
            <div>
              <h3 className="titulo mb-4 text-center">Políticas de privacidad</h3>
            </div>
          </div>
        </div>

       

      </div>

      {/* Sección inferior del footer */}
      <div className="footer-bottom py-5 px-10 flex flex-col md:flex-row items-center justify-center gap-4 mx-auto">
        <span className="py-5 sm:px-10 sm:mx-10">
          © 2024 Instituto Ciudades del Futuro. All rights reserved.
        </span>
        <div className="flex py-5 px-10 mx-10">
          <SocialLinks redes={config.redes_sociales} />
        </div>
      </div>
    </footer>
  );
}
