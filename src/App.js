// App.js
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CookieConsent from "./components/CookieConsent";
import { ConfigProvider } from './extras/ConfigContext';
import { AuthProvider } from "./components/AuthContext";
import FaviconSetter from "./components/FaviconSetter";
import { v4 as uuidv4 } from 'uuid';
import AppRoutes from './AppRoutes';
import i18n from './i18n';
import 'animate.css';

const GA_ID = process.env.REACT_APP_GA_ID;
const IS_PROD = process.env.REACT_APP_STATUS === 'production';

function App() {
  // Idioma predeterminado
  useEffect(() => {
    if (!localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage('es');
    }
  }, []);

  // Consentimiento
  const userIdentifier = localStorage.getItem('userIdentifier');
  const handleConsent = (consentAccepted) => {
    if (consentAccepted) {
      if (!userIdentifier) {
        localStorage.setItem('userIdentifier', uuidv4());
      }
    } else {
      localStorage.removeItem('userIdentifier');
    }
  };

  // GA script dinámico
  useEffect(() => {
    if (!IS_PROD || !GA_ID || window.gtagLoaded) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    window.gtagLoaded = true;
  }, []);

  return (
    <ConfigProvider>
      <AuthProvider>
        <CookieConsent onConsent={handleConsent} />
        <BrowserRouter basename="/web">
          <FaviconSetter />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
