import React from 'react';
import bocaDaOnca from '../assets/img/boca_da_onca.jpg';

const BannerImagenFija = () => {
  return (
    <div className="relative w-full sm:w-11/12 mx-auto mt-0 sm:mt-5 max-w-[1376px] px-0 sm:px-10 md:px-0">
  <img
    src={bocaDaOnca}
    alt="Boca da Onça"
    className="w-full max-h-[436px] object-cover mx-auto rounded-lg"
    style={{ minHeight: '280px', maxHeight: '436px', borderRadius: '1rem' }}
  />
</div>

  );
};

export default BannerImagenFija;
