import { Helmet } from 'react-helmet';
import { useSeoConfig } from '../extras/useSeoConfig';

const FaviconSetter = () => {
  const {
    title,
    logo,
    description,
    fullUrl,
    canonicalUrl,
    image,
    jsonLd,
    alternateLinks,
    baseUrl
  } = useSeoConfig();

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {logo && <link rel="icon" href={logo} />}
      {logo && <link rel="apple-touch-icon" href={logo} />}
      {description && <meta name="description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content="es_AR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      {process.env.REACT_APP_KEYWORDS && (
        <meta name="keywords" content={process.env.REACT_APP_KEYWORDS} />
      )}
      {alternateLinks.map(({ lng, hrefLang, href }) => (
        <link key={lng} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      <link rel="canonical" href={canonicalUrl} data-react-helmet="true" />
    </Helmet>
  );
};

export default FaviconSetter;
