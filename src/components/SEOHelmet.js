import { Helmet } from 'react-helmet';
import { useSeoConfig } from '../extras/useSeoConfig';

const truncate = (str, maxLength = 160) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength).trim() + '…' : str;
};

const SEOHelmet = ({ customTitle, customDescription, customImage }) => {
  const {
    title: globalTitle,
    description: globalDescription,
    image: globalImage,
    fullUrl,
    canonicalUrl
  } = useSeoConfig();

  const title = customTitle || globalTitle;
  const description = customDescription || globalDescription;
  const truncatedDescription = truncate(description, 160);
  const image = customImage || globalImage;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={truncatedDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonicalUrl} data-react-helmet="true" />
    </Helmet>
  );
};

export default SEOHelmet;
