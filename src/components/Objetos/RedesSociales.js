import React, { useEffect, useState } from 'react';
import x_button from '../../assets/img/x-button.png';
import fb_button from '../../assets/img/fb-button.png';
import in_button from '../../assets/img/in-button.png';
import service from '../../axios/services/atractivo';

const RedesSociales = ({ idAtractivo }) => {
  const [redes, setRedes] = useState([]);

  useEffect(() => {
    console.log("Componente RedesSociales, idAtractivo:", idAtractivo);
    if (!idAtractivo) return;
    service.obtenerRedesSociales(idAtractivo)
      .then((redesSociales) => {
        console.log("Redes sociales recibidas:", redesSociales);
        setRedes(redesSociales);
      })
      .catch((error) => console.error("Error al obtener las redes sociales: ", error));
  }, [idAtractivo]);

  const getIcon = (red_social) => {
    if (!red_social || typeof red_social !== 'string') return null;
    switch (red_social.toLowerCase()){
      case 'facebook':
        return fb_button;
      case 'instagram':
        return in_button;
      case 'twitter':
        return x_button;
      default:
        return null;
    }
  };

  if (!redes || redes.length === 0) return null;

  return (
    <div id="redes">
      <div className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Redes sociales
      </div>
      <div className="flex">
        {redes.map((red, index) => {
          const icon = getIcon(red.red_social);
          return icon && (
            <a key={index} href={red.url} target="_blank" rel="noopener noreferrer">
              <img src={icon} className="mr-2" alt={red.red_social} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default RedesSociales;
