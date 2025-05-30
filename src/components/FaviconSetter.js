import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { ConfigContext } from '../extras/ConfigContext';

const FaviconSetter = () => {
  const config = useContext(ConfigContext);

  if (!config) return null;

  // Asegurarse de que los valores son realmente strings
  const title = typeof config.title === 'string' ? config.title : '';
  const logo = typeof config.logo === 'string' ? config.logo : '';
  const description = typeof config.footer_description === 'string' ? config.footer_description : '';

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {logo ? <link rel="icon" href={logo} /> : null}
      {logo ? <link rel="apple-touch-icon" href={logo} /> : null}
      {title ? <meta property="og:title" content={title} /> : null}
      {logo ? <meta property="og:image" content={logo} /> : null}
      {description ? <meta name="description" content={description} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
    </Helmet>
  );
};

export default FaviconSetter;
