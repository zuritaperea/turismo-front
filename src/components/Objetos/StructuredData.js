import React from 'react';
import { Helmet } from 'react-helmet';

const typeMapping = {
  Evento: "Event",
  AtractivoTuristico: "TouristAttraction",
  Circuito: "Route",
  Experiencia: "Trip",
  FiestaPopular: "Event",
  Comercio: "LocalBusiness",
  Emprendedor: "LocalBusiness",
  Balneario: "TouristAttraction",
  Destino: "Place",
  Alojamiento: "Hotel",
  Gastronomía: "Restaurant",
  PuntoInteres: "TouristAttraction"
};

const StructuredData = ({ item }) => {
  if (!item || !item.type || !item.attributes) return null;

  const attributes = item.attributes;
  const contentType = item.type;
  const schemaType = typeMapping[contentType] || "Place";

  const imageBase = process.env.REACT_APP_API_URL || "";
  const imageUrl = attributes.image_url
    ? imageBase + attributes.image_url
    : process.env.REACT_APP_IMAGE_DEFAULT;

  const photoArray = attributes.contenidos?.map(contenido => ({
    "@type": "ImageObject",
    "contentUrl": contenido.file
  })) || [];

  const amenityArray = attributes.amenity_feature?.map(feature => ({
    "@type": "LocationFeatureSpecification",
    "name": feature.name,
    "value": true
  })) || [];

  const socialLinks = attributes.redes_sociales?.map(rs => rs.url) || [];

  const data = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": attributes.name,
    "description": attributes.description,
    "image": imageUrl,
    ...(photoArray.length && { "photo": photoArray }),
    ...(attributes.url && { "url": attributes.url }),
    ...(attributes.street_address && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": attributes.street_address,
        "addressCountry": "AR"
      }
    }),
    ...(attributes.point && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": attributes.point.latitude,
        "longitude": attributes.point.longitude
      }
    }),
    ...(attributes.telefonos?.length > 0 && {
      "telephone": attributes.telefonos.map(t => t.contact_point)
    }),
    ...(attributes.checkin_time && { "checkinTime": attributes.checkin_time }),
    ...(attributes.checkout_time && { "checkoutTime": attributes.checkout_time }),
    ...(attributes.price_range && { "priceRange": attributes.price_range }),
    ...(socialLinks.length && { "sameAs": socialLinks }),
    ...(amenityArray.length && { "amenityFeature": amenityArray }),
    ...(attributes.evaluation > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": attributes.evaluation,
        "reviewCount": 1
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default StructuredData;
