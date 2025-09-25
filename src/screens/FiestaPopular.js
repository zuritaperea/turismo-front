// src/screens/FiestaPopularScreen.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemScreen from '../components/Objetos/ItemScreen';

function FiestaPopularScreen() {
  const { id  } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="fiestapopular" 
      id={id} 
    />
  );
}

export default FiestaPopularScreen;
