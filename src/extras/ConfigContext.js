// ConfigContext.js
import React, { createContext, useState, useEffect } from 'react';
import fetchConfig from "./config";

const ConfigContext = createContext(null);

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
        if (fetchedConfig) {
          document.documentElement.style.setProperty('--color-principal', fetchedConfig.main_link_color);
          document.documentElement.style.setProperty('--color-principal-background', fetchedConfig.body_background);
          document.title = fetchedConfig.title;
        } else {
          console.error("La configuración obtenida está vacía o es nula.");
          setError("Error: Configuración no disponible.");
        }
      } catch (err) {
        console.error("Error al cargar la configuración:", err);
        setError("Error: No se pudo cargar la configuración.");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return <div>Cargando..</div>; // Muestra el Splash mientras se carga
  }

  if (error) {
    return <div>{error}</div>; // Muestra un mensaje de error si falla la carga
  }

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export { ConfigContext, ConfigProvider };
