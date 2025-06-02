// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemScreen from '../components/Objetos/ItemScreen';

function DestinoScreen() {
  const { id  } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="destino" 
      id={id} 
    />
  );
}

export default DestinoScreen;
