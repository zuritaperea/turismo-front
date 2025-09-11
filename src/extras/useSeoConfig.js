import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { getCanonicalUrl } from './getCanonicalUrl';
import { ConfigContext } from './ConfigContext';

export const useSeoConfig = () => {
  const location = useLocation();
  const config = useContext(ConfigContext);
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const origin = window.location.origin;
  const pathname = location.pathname;
  const isWebPath = pathname.startsWith('/web');
  const baseUrl = process.env.PUBLIC_URL || (isWebPath ? `${origin}/web` : origin);
  const fullUrl = window.location.href;

  const title = typeof config?.title === 'string' ? config.title : '';
  const logo = typeof config?.logo === 'string' ? config.logo : '';
  const description = typeof config?.footer_description === 'string' ? config.footer_description : '';
  const image = logo || process.env.REACT_APP_IMAGE_DEFAULT;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": title,
    "url": fullUrl,
    "description": description,
    "image": image
  };

  const langs = ['es', 'en', 'pt'];
  const alternateLinks = langs.map(lng => ({
    lng,
    hrefLang: lng,
    href: `${origin}${pathname}?lng=${lng}`
  }));

  return {
    title,
    logo,
    description,
    fullUrl,
    canonicalUrl,
    image,
    jsonLd,
    alternateLinks,
    baseUrl
  };
};
