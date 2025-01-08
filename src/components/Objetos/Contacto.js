import React from 'react';
import phone from '../../assets/img/phone.png';
import mail from '../../assets/img/mail-03.png';
import link from '../../assets/img/link-01.png';

const Contacto = () => (
  <div id="contacto">
    <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
      Contacto
    </div>
    <div className="flex descripcion">
      <img src={phone} className="mr-3" />+54 9 223 521 9100
    </div>
    <div className="flex descripcion">
      <img src={mail} className="mr-3" />info@mabubusiness.br
    </div>
    <div className="flex descripcion">
      <img src={link} className="mr-3" />mabubusiness.br
    </div>
  </div>
);

export default Contacto;
