import React from 'react';
import phoneIcon from '../../assets/img/phone.png';
import mailIcon from '../../assets/img/mail-03.png';
import linkIcon from '../../assets/img/link-01.png';

const Contacto = ({ contactoData }) => {
  if (!contactoData) return null;

  return (
    <div id="contacto">
      <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Contacto
      </div>
      {/* Mostrar los teléfonos */}
      {contactoData.telefonos && contactoData.telefonos.length > 0 && (
        contactoData.telefonos.map((telefono, index) => (
          <div key={index} className="flex descripcion">
            <img src={phoneIcon} className="mr-3" alt="Teléfono" />
            {telefono.type}: {telefono.contact_point}
          </div>
        ))
      )}
      
      {/* Mostrar los correos electrónicos */}
      {contactoData.correos_electronicos && contactoData.correos_electronicos.length > 0 && (
        contactoData.correos_electronicos.map((correo, index) => (
          <div key={index} className="flex descripcion">
            <img src={mailIcon} className="mr-3" alt="Correo" />
            {correo.type}: {correo.contact_point}
          </div>
        ))
      )}

      {/* Mostrar el sitio web */}
      {contactoData.url && (
        <div className="flex descripcion">
          <img src={linkIcon} className="mr-3" alt="Sitio web" />
          {contactoData.url}
        </div>
      )}
    </div>
  );
};

export default Contacto;
