import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

function Redes({ latitud, longitud, facebook, instagram, whatsapp, email, telefono }) {
  const isIconGray = (value) => !value || typeof value === 'string' && value.trim() === '';

  const mapsLink = latitud && longitud ? `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}` : null;
  const facebookLink = facebook ? `${facebook}` : null; //`https://www.facebook.com/${facebook}`
  const instagramLink = instagram ? `${instagram}` : null; //`https://www.instagram.com/${instagram}`
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;
  const emailLink = email ? `mailto:${email}` : null;
  const telefonoLink = telefono ? `tel:${telefono}` : null;

  return (
    <div className="social-icons d-flex justify-content-around p-3">
      <a href={mapsLink} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          size="2x"
          color={isIconGray(latitud) || isIconGray(longitud) ? 'gray' : undefined}
        />
      </a>
      <a href={facebookLink} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faFacebookF}
          size="2x"
          color={isIconGray(facebook) ? 'gray' : undefined}
        />
      </a>
      <a href={instagramLink} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faInstagram}
          size="2x"
          color={isIconGray(instagram) ? 'gray' : undefined}
        />
      </a>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faWhatsapp}
          size="2x"
          color={isIconGray(whatsapp) ? 'gray' : undefined}
        />
      </a>
      <a href={emailLink} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faEnvelope}
          size="2x"
          color={isIconGray(email) ? 'gray' : undefined}
        />
      </a>
      <a href={telefonoLink}>
        <FontAwesomeIcon
          icon={faPhone}
          size="2x"
          color={isIconGray(telefono) ? 'gray' : undefined}
        />
      </a>
    </div>
  );
}

export default Redes;
