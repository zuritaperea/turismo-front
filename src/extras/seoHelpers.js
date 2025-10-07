// seoHelpers.js
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
  PuntoInteres: "TouristAttraction",
};

export const generateJsonLdFromItem = (item) => {
  if (!item || !item.type || !item.attributes) return null;

    const attributes = item.attributes;
        const relationships = item.relationships || {};
        const schemaType = typeMapping[item.type] || "Place";

        const imageBase = process.env.REACT_APP_API_URL || "";
        const imageUrl = attributes.image_url
            ? imageBase + attributes.image_url
            : process.env.REACT_APP_IMAGE_DEFAULT;

        const photoArray =
            attributes.contenidos?.map((c) => ({
                "@type": "ImageObject",
                contentUrl: c.file,
            })) || [];

        const amenityArray =
            attributes.amenity_feature?.map((f) => ({
                "@type": "LocationFeatureSpecification",
                name: f.name,
                value: true,
            })) || [];

        const socialLinks = attributes.redes_sociales?.map((r) => r.url) || [];

        const data = {
            "@context": "https://schema.org",
            "@type": schemaType,
            name: attributes.name,
            description: attributes.description,
            image: imageUrl,
            ...(photoArray.length && { photo: photoArray }),
            ...(attributes.url && { url: attributes.url }),
            ...(attributes.street_address && {
                address: {
                    "@type": "PostalAddress",
                    streetAddress: attributes.street_address,
                    addressCountry: process.env.REACT_APP_DEFAULT_COUNTRY || "AR",
                },
            }),
            ...(attributes.point && {
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: attributes.point.latitude,
                    longitude: attributes.point.longitude,
                },
                hasMap: `https://www.google.com/maps?q=${attributes.point.latitude},${attributes.point.longitude}`,
            }),
            ...(attributes.telefonos?.length && {
                telephone: attributes.telefonos.map((t) => t.contact_point),
            }),
            ...(attributes.opening_hours && {
                openingHours: Object.entries(attributes.opening_hours)
                    .map(([day, hours]) => `${day} ${hours}`)
                    .join(", "),
            }),
            ...(attributes.allows_pets && { petsAllowed: true }),
            ...(attributes.tourist_type?.length && {
                audience: attributes.tourist_type.map((type) => ({
                    "@type": "Audience",
                    name: type,
                })),
            }),
            ...((attributes.telefonos?.length ||
                attributes.correos_electronicos?.length) && {
                contactPoint: [
                    ...(attributes.telefonos?.map((tel) => ({
                        "@type": "ContactPoint",
                        contactType: tel.type || "customer service",
                        telephone: tel.contact_point,
                    })) || []),
                    ...(attributes.correos_electronicos?.map((email) => ({
                        "@type": "ContactPoint",
                        contactType: email.type || "customer service",
                        email: email.contact_point,
                    })) || []),
                ],
            }),
            ...(attributes.destino && {
                containedInPlace: {
                    "@type": "Place",
                    name: attributes.destino || "Destino",
                },
            }),
            ...(attributes.start_date && { startDate: attributes.start_date }),
            ...(attributes.end_date && { endDate: attributes.end_date }),
            ...(attributes.duration && { duration: attributes.duration }),
            ...(attributes.checkin_time && { checkinTime: attributes.checkin_time }),
            ...(attributes.checkout_time && { checkoutTime: attributes.checkout_time }),
            ...(attributes.price_range && { priceRange: attributes.price_range }),
            ...(socialLinks.length && { sameAs: socialLinks }),
            ...(amenityArray.length && { amenityFeature: amenityArray }),
            ...(attributes.evaluation > 0 && {
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: attributes.evaluation,
                    reviewCount: 1,
                },
            }),
        };

  return data;
};
