import { useContext, useEffect } from 'react';
import { ConfigContext } from '../extras/ConfigContext'; 

const FaviconSetter = () => {
  const  config  = useContext(ConfigContext);
  useEffect(() => {
    // Verifica si config y config.logo están definidos antes de intentar usarlos
    if (config?.logo) {
      const favicon = document.querySelector("link[rel~='icon']");
      if (favicon) {
        favicon.href = config.logo;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = config.logo;
        document.head.appendChild(link);
      }
    }
  }, [config?.logo]);

  return null; // no renderiza nada
};

export default FaviconSetter;
