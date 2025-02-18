import React, { useContext, useEffect, useState } from "react";
import logo from '../assets/img/logomark.png'; 
import x_button from '../assets/img/x-button.png';
import fb_button from '../assets/img/fb-button.png'; 
import in_button from '../assets/img/in-button.png'; 
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto

export default function Footer() {
  const [footerLogo, setFooterLogo] = useState(logo); // Estado para el logo
  const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración
  const [footerDescription, setFooterDescription] = useState(""); 

  useEffect(() => {
    if (config) { // Verifica que config no sea null
      setFooterLogo(config.footer_logo || logo);
      setFooterDescription(config.footer_description || "Este es un parrafo descriptivo marketinero de cada uno de los destinos.")

      //setfooterTitle(config.title || 'Sistema de Turismo');
    }
  }, [config]); // El useEffect se ejecuta cada vez que config cambia


  return (
    <>
      <footer>
        <div id="menu-footer" className="bg-white py-5 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="md:col-span-1 mx-10">
              <img className="logo sm:mx-10 " src={footerLogo} />
                <p className="descripcion sm:mx-10 mt-4">{footerDescription}</p>
            </div>
            <div className="hidden sm:block sm:col-span-2">

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div>
                  <h3 className="titulo mb-4">Product</h3>
                  <ul>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Overview</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Features</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Pricing</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Integrations</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">API</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="titulo mb-4">Company</h3>
                  <ul>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">About Us</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Careers</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Press</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Blog</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="titulo mb-4">Resources</h3>
                  <ul>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Documentation</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Tutorials</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Community</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Support</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">FAQs</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="titulo mb-4">Social</h3>
                  <ul>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Facebook</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Twitter</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">LinkedIn</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Instagram</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">YouTube</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="titulo mb-4">Legal</h3>
                  <ul>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Privacy Policy</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Terms of Service</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Cookie Policy</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">GDPR Compliance</a></li>
                    <li className="mb-2"><a href="#" className="hover:underline font-semibold">Accessibility</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-5 px-10 flex justify-between">
          <span className="py-5 sm:px-10 sm:mx-10">© 2024 Instituto Ciudades del Futuro. All rights reserved.</span>
          <div className="flex py-5 px-10 mx-10">
            <img src={x_button} className="mr-2 object-contain" />
            <img src={fb_button} className="mr-2 object-contain" />
            <img src={in_button} className="mr-2 object-contain" />
          </div>
        </div>
      </footer>

    </>
  );
}
