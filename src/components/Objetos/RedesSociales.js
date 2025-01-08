import React from 'react';
import x_button from '../../assets/img/x-button.png';
import fb_button from '../../assets/img/fb-button.png';
import in_button from '../../assets/img/in-button.png';

const RedesSociales = () => (
  <div id="redes">
    <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
      Redes sociales
    </div>
    <div className="flex">
      <img src={x_button} className="mr-2" />
      <img src={fb_button} className="mr-2" />
      <img src={in_button} className="mr-2" />
    </div>
  </div>
);

export default RedesSociales;
