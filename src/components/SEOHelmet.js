import GlobalSEOHelmet from "./GlobalSEOHelmet";

const truncate = (str, maxLength = 160) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength).trim() + "…" : str;
};

/**
 * SEOHelmet - Extiende los metadatos globales para una página o item específico
 */
const SEOHelmet = ({ customTitle, customDescription, customImage, customJsonLd }) => {
  const description = truncate(customDescription, 160);

  return (
    <GlobalSEOHelmet
      override={{
        title: customTitle,
        description,
        image: customImage,
        jsonLd: customJsonLd,
      }}
    />
  );
};

export default SEOHelmet;
