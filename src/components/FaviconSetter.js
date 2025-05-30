import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { ConfigContext } from '../extras/ConfigContext';

const FaviconSetter = () => {
  const config = useContext(ConfigContext);

  if (!config) return null;

  return (
    <Helmet>
      {/* Título */}
      {config.title && <title>{config.title}</title>}

      {/* Favicon */}
      {config.logo && <link rel="icon" href={config.logo} />}
      {config.logo && <link rel="apple-touch-icon" href={config.logo} />}

      {/* Meta tags para SEO y redes */}
      {config.title && <meta property="og:title" content={config.title} />}
      {config.logo && <meta property="og:image" content={config.logo} />}
      {config.footer_description && (
        <>
          <meta name="description" content={config.footer_description} />
          <meta property="og:description" content={config.footer_description} />
        </>
      )}
    </Helmet>
  );
};

export default FaviconSetter;
