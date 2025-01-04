// Splash.js
import React, {useContext, useEffect, useState} from 'react';
import logo from "../assets/img/logomark.png";
import { ConfigContext } from '../extras/ConfigContext'; // Importa el contexto

function Splash() {
const [headerLogo, setHeaderLogo] = useState(logo); // Estado para el logo
const config = useContext(ConfigContext); // Usa el contexto para acceder a la configuración

useEffect(() => {
    if (config) { // Verifica que config no sea null
      setHeaderLogo(config.logo || logo);
    }
  }, [config]); // El useEffect se ejecuta cada vez que config cambia

    return (
        <div className="splash">
            <div className="splash-container">
                <img className="logo-splash" src={headerLogo} alt="Logo" />
            </div>
        </div>
    );
};

export default Splash;
