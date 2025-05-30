import { useContext, useEffect } from 'react';
import { ConfigContext } from '../extras/ConfigContext';

const FaviconSetter = () => {
  const config = useContext(ConfigContext);
  useEffect(() => {
    // Verifica si config y config.logo están definidos antes de intentar usarlos
    if (config?.logo) {
      // Modificar o agregar favicon
      const favicon = document.querySelector("link[rel~='icon']");
      if (favicon) {
        favicon.href = config.logo;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = config.logo;
        document.head.appendChild(link);
      }

      // Modificar o agregar apple-touch-icon
      const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
      if (appleTouchIcon) {
        appleTouchIcon.href = config.logo;
      } else {
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = config.logo;
        document.head.appendChild(appleLink);
      }
      // Agregar o actualizar og:image
      const existingOgImage = document.querySelector("meta[property='og:image']");
      if (existingOgImage) {
        existingOgImage.setAttribute('content', config.logo);
      } else {
        const ogImageMeta = document.createElement('meta');
        ogImageMeta.setAttribute('property', 'og:image');
        ogImageMeta.setAttribute('content', config.logo);
        document.head.appendChild(ogImageMeta);
      }
    }
  }, [config?.logo]);

  return null; // no renderiza nada
};

export default FaviconSetter;
