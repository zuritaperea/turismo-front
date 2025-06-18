// ConfigContext.js
import React, { createContext, useState, useEffect } from 'react';
import fetchConfig from "./config";
import Splash from '../components/Splash';

const ConfigContext = createContext(null);

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
        if (fetchedConfig) {
          document.documentElement.style.setProperty('--navbar-background', fetchedConfig.navbar_background);
          document.documentElement.style.setProperty('--navbar-text-color', fetchedConfig.navbar_color);
          document.documentElement.style.setProperty('--main-link-color', fetchedConfig.main_link_color);
          document.documentElement.style.setProperty('--color-principal', fetchedConfig.main_link_color);
          document.documentElement.style.setProperty('--body-background', fetchedConfig.body_background);
          document.title = fetchedConfig.title;
        } else {
          console.error("La configuración obtenida está vacía o es nula.");
        }
      } catch (err) {
        console.error("Error al cargar la configuración:", err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return <Splash />; // Muestra el Splash mientras se carga
  }

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export { ConfigContext, ConfigProvider };
