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
      <div className="flex descripcion">
        <img src={phoneIcon} className="mr-3" alt="Teléfono" />
        {contactoData.telefonos}
      </div>
      <div className="flex descripcion">
        <img src={mailIcon} className="mr-3" alt="Correo" />
        {contactoData.correos_electronicos}
      </div>
      <div className="flex descripcion">
        <img src={linkIcon} className="mr-3" alt="Sitio web" />
        {contactoData.url}
      </div>
    </div>
  );
};

export default Contacto;
