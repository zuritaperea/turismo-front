import { Helmet } from "react-helmet";
import { useSeoConfig } from "../extras/useSeoConfig";
import { useEffect } from "react";

const GlobalSEOHelmet = ({ override = {} }) => {
  const {
    title: globalTitle,
    logo: globalLogo,
    description: globalDescription,
    fullUrl,
    canonicalUrl,
    image: globalImage,
    jsonLd: globalJsonLd,
    alternateLinks,
    baseUrl,
  } = useSeoConfig();



  // Override dinámico
  const title = override.title || globalTitle;
  const description = override.description || globalDescription;
  const image = override.image || globalImage;
  const logo = override.logo || globalLogo;
  const jsonLd = override.jsonLd || globalJsonLd;

    useEffect(() => {
    // Buscar el JSON-LD estático del index.html (el generado en el build)

      // Buscar el JSON-LD global inyectado en el index.html
    const defaultJsonLd = document.querySelector(
      'script[type="application/ld+json"]:not([data-react-helmet])'
    );

    // Si existe y tenemos un JSON-LD dinámico, lo eliminamos
    if (defaultJsonLd && jsonLd) {
      defaultJsonLd.remove();
      console.log("🧹 JSON-LD por defecto eliminado porque hay uno dinámico");
    }
  }, [jsonLd]);


  return (
    <Helmet>
      {/* --- Favicon y Apple Icon --- */}
      {logo && <link rel="icon" href={logo} />}
      {logo && <link rel="apple-touch-icon" href={logo} />}

      {/* --- Título y descripción --- */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      {/* --- Open Graph --- */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content="es_AR" />

      {/* --- Twitter --- */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:url" content={fullUrl} />

      {/* --- Keywords opcionales --- */}
      {process.env.REACT_APP_KEYWORDS && (
        <meta name="keywords" content={process.env.REACT_APP_KEYWORDS} />
      )}

      {/* --- Links alternativos --- */}
      {alternateLinks?.map(({ lng, hrefLang, href }) => (
        <link key={lng} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* --- Canonical --- */}
      <link rel="canonical" href={canonicalUrl} data-react-helmet="true" />

      {/* --- JSON-LD --- */}
      {jsonLd && (
        <script type="application/ld+json" data-react-helmet="true">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default GlobalSEOHelmet;