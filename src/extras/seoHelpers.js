// seoHelpers.js
const typeMapping = {
    Evento: "Event",
    AtractivoTuristico: "TouristAttraction",
    Circuito: "Route",
    Experiencia: "Trip",
    FiestaPopular: "Festival",
    Comercio: "LocalBusiness",
    Emprendedor: "LocalBusiness",
    Balneario: "TouristAttraction",
    Destino: "Place",
    Alojamiento: "Hotel",
    Gastronomía: "Restaurant",
    PuntoInteres: "TouristAttraction",
};

const generateJsonLdFromItem = (item) => {
    if (!item || !item.type || !item.attributes) return null;

    const attributes = item.attributes;
    const relationships = item.relationships || {};


    const imageBase = process.env.REACT_APP_API_URL || "";
    const imageUrl = attributes.image_url
        ? imageBase + attributes.image_url
        : process.env.REACT_APP_IMAGE_DEFAULT;

    const schemaType =
        item.type === "Balneario"
            ? attributes.servicios?.length > 0
                ? "Resort"
                : "Beach"
            : typeMapping[item.type] || "Place";


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
            openingHours: attributes.opening_hours,
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


const jsonLdInicio = (location, config, naturalAttractions = [], eventos = [], circuitos = [], secciones = []) => {

    const origin = location.origin;
    const pathname = location.pathname;
    const isWebPath = pathname.startsWith('/web');
    const baseUrl = process.env.PUBLIC_URL || (isWebPath ? `${origin}/web` : origin);
    const fullUrl = window.location.href;

    const title = typeof config?.title === 'string' ? config.title : '';
    const logo = typeof config?.logo === 'string' ? config.logo : '';
    const description = typeof config?.footer_description === 'string' ? config.footer_description : '';
    const image = logo || process.env.REACT_APP_IMAGE_DEFAULT;
    return ({
        "@context": "https://schema.org",
        "@graph": [
            // WebSite
            {
                "@type": "WebSite",
                "name": title,
                "url": baseUrl,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${baseUrl}/busqueda/{search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            },
            // Organization
            {
                "@type": "Organization",
                "name": config?.title,
                "url":baseUrl,
                "logo": logo,
                "sameAs": config?.social_links?.map(r => r.url) || []
            },
            // WebPage
            {
                "@type": "WebPage",
                "name": "Inicio",
                "url": baseUrl,
                "description": "Descubrí los atractivos, eventos y circuitos turísticos más destacados de Catamarca.",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Inicio",
                            "item": baseUrl
                        }
                    ]
                }
            },
            // Secciones
            {
                "@type": "ItemList",
                "name": "Secciones destacadas",
                "itemListElement": (secciones || []).map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.titulo,
                    "url": `${baseUrl}${item.link || "#"}`
                }))
            },
            // Atractivos Naturales
            {
                "@type": "ItemList",
                "name": "Atractivos Naturales",
                "itemListElement": (naturalAttractions || []).map((a, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": a.attributes?.name,
                    "url": `${baseUrl}/atractivos/${a.id}`
                }))
            },
            // Eventos
            {
                "@type": "ItemList",
                "name": "Eventos",
                "itemListElement": (eventos || []).map((e, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": e.attributes?.name,
                    "url": `${baseUrl}/eventos/${e.id}`
                }))
            },
            // Circuitos
            {
                "@type": "ItemList",
                "name": "Circuitos",
                "itemListElement": (circuitos || []).map((c, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": c.attributes?.name,
                    "url": `${baseUrl}/circuitos/${c.id}`
                }))
            }
        ]
    })
};

export { generateJsonLdFromItem, jsonLdInicio };
