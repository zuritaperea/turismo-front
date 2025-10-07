import React from 'react';
import phoneIcon from '../../assets/img/phone.png';
import mailIcon from '../../assets/img/mail-03.png';
import linkIcon from '../../assets/img/link-01.png';
import { useTranslation } from 'react-i18next';
const Contacto = ({ contactoData }) => {
  const { t } = useTranslation();
  if (!contactoData) return null;

  const defaultCountry = process.env.REACT_APP_DEFAULT_COUNTRY || "AR";

  // Función para agregar el código de país si falta
  const addCountryCode = (number, defaultCountry, type) => {
    let digits = number.replace(/\D/g, '');
    if (type.toLowerCase() === 'whatsapp' && defaultCountry === 'AR') {
      // Si ya empieza con 549, lo dejamos igual
      if (digits.startsWith('549')) return digits;
      // Si empieza con 54 pero no con 549, agregamos el 9
      if (digits.startsWith('54')) return '549' + digits.slice(2);
      // Si no tiene código, agregamos 549
      return '549' + digits;
    }
    if (type.toLowerCase() === 'whatsapp' && defaultCountry === 'BR') {
      // Si ya empieza con 559, lo dejamos igual
      if (digits.startsWith('559')) return digits;
      // Si empieza con 55 pero no con 559, agregamos el 9
      if (digits.startsWith('55')) return '559' + digits.slice(2);
      // Si no tiene código, agregamos 559
      return '559' + digits;
    }
    if (
      (defaultCountry === 'AR' && digits.startsWith('54')) ||
      (defaultCountry === 'BR' && digits.startsWith('55'))
    ) {
      return digits;
    }
    if (defaultCountry === 'AR') {
      return '54' + digits;
    }
    if (defaultCountry === 'BR') {
      return '55' + digits;
    }
    return digits;
  };


  // Ordenar teléfonos por tipo (ejemplo: WhatsApp primero, luego otros)
  const sortedTelefonos = contactoData.telefonos
    ? [...contactoData.telefonos].sort((a, b) => {
      if (a.type.toLowerCase() === 'whatsapp') return -1;
      if (b.type.toLowerCase() === 'whatsapp') return 1;
      return a.type.localeCompare(b.type);
    })
    : [];

  return (
    <div id="contacto" className="mb-5">
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        {t('common.contacto')}
      </div>
      {sortedTelefonos.length > 0 &&
        sortedTelefonos.map((telefono, index) => {

          const contactPoint = telefono.contact_point;
          const whatsappNumber = addCountryCode(contactPoint, defaultCountry, telefono.type);
          const isWhatsapp = telefono.type.toLowerCase() === "whatsapp";
          const href = isWhatsapp
            ? `https://wa.me/${whatsappNumber}`
            : `tel:${contactPoint}`;
          return (
            <div key={index} className="flex descripcion">
              <img src={phoneIcon}               className="mr-3 mt-1 w-5 h-5 flex-shrink-0 object-contain"
 alt="Teléfono" loading="lazy" />
             <span className="font-semibold capitalize mr-1"> {telefono.type}:</span>
              {telefono.type.toLowerCase() === 'whatsapp' ? (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactPoint}
                </a>
              ) : (
                <a href={`tel:${contactPoint}`}>
                  {contactPoint}
                </a>
              )}
            </div>
          );
        })}
      {contactoData.correos_electronicos && contactoData.correos_electronicos.length > 0 && (
        contactoData.correos_electronicos.map((correo, index) => (
          <div key={index} className="flex descripcion">
            <img src={mailIcon} className="mr-3 object-contain" alt="Correo" loading="lazy" />
            {correo.type}: <a href={`mailto:${correo.contact_point}`}>{correo.contact_point}</a>
          </div>
        ))
      )}
      {contactoData.url && (
        <div className="flex descripcion">
          <img src={linkIcon} className="mr-3 object-contain" alt="Sitio web" loading="lazy" />
          <a href={contactoData.url} target="_blank" rel="noopener noreferrer">
            {contactoData.url}
          </a>
        </div>
      )}
    </div>
  );
};

export default Contacto;
