import React, { useContext, useEffect, useState } from "react";
import logo from '../assets/img/logomark.png';
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto
import SocialLinks from "./SocialLinks";
import { Link } from "react-router-dom";
import MenuLink from "./MenuLink";
import { AuthContext } from "./AuthContext";

export default function Footer() {
  const [footerLogo, setFooterLogo] = useState(logo);
  const config = useContext(ConfigContext);
  const { user } = useContext(AuthContext);
  const [footerDescription, setFooterDescription] = useState("");
  const [footerItems, setFooterItems] = useState([]);

  useEffect(() => {
    if (config) {
      setFooterLogo(config.footer_logo || logo);
      setFooterDescription(
        config.footer_description ||
        "Este es un párrafo descriptivo marketinero de cada uno de los destinos."
      );
      setFooterItems(config?.menus?.[0]?.attributes?.items || []);
    }
  }, [config]);

  return (
    <footer className="hidden md:block">
      {/* Sección superior del footer */}
      <div id="menu-footer" className="bg-white mt-10 py-5 px-10 mx-auto">
        <p className="descripcion text-center sm:mx-10 my-7 text-sm text-gray-600 mb-10">
          {footerDescription}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">

          <div className="flex justify-center">
            <img className="logo" src={footerLogo} alt="Logo Footer" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {footerItems.filter(item => {
              if (item.requires_authentication) {
                return user !== null; 
              }
              return true; 
            }).map(item => (
              <div key={item.id}>
                <h3 className="titulo text-center">
                  <MenuLink item={item} className="font-bold text-base" />
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom py-5 px-10 flex flex-col md:flex-row items-center justify-center gap-4 mx-auto">
        <div className="flex py-5 px-10 mx-10">
          <SocialLinks redes={config.redes_sociales} />
        </div>
      </div>
    </footer>
  );
}
