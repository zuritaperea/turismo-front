import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { ConfigContext } from '../extras/ConfigContext';

const FaviconSetter = () => {
  const config = useContext(ConfigContext);

  if (!config) return null;

  const origin = window.location.origin;
  const pathname = window.location.pathname;

  // Detecta si está montado en /web
  const isWebPath = pathname.startsWith('/web');
  const baseUrl = process.env.PUBLIC_URL || (isWebPath ? `${origin}/web` : origin);
  const fullUrl = window.location.href;

  // Asegurarse de que los valores son realmente strings
  const title = typeof config.title === 'string' ? config.title : '';
  const logo = typeof config.logo === 'string' ? config.logo : '';
  const description = typeof config.footer_description === 'string' ? config.footer_description : '';

  // JSON-LD para Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": title,
    "url": fullUrl,
    "description": description,
    "image": logo || process.env.REACT_APP_IMAGE_DEFAULT
  };

  const langs = ['es', 'en', 'pt'];
  const alternateLinks = [
    ...langs.map(lng => (
      <link key={lng} rel="alternate" hrefLang={lng} href={`${origin}${pathname}?lng=${lng}`} />
    )),
    <link key="x-default" rel="alternate" hrefLang="x-default" href={baseUrl} />
  ];

  return (
    <Helmet>
      {/* Título y favicon */}
      {title && <title>{title}</title>}
      {logo && <link rel="icon" href={logo} />}
      {logo && <link rel="apple-touch-icon" href={logo} />}

      {/* SEO: descripción */}
      {description && <meta name="description" content={description} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={logo} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content="es_AR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logo} />

      {/* JSON-LD para rich results */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Enlaces alternativos para idiomas */}
      {alternateLinks}
    </Helmet>
  );
};

export default FaviconSetter;
