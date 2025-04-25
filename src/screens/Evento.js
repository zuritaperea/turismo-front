// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemScreen from '../components/Objetos/ItemScreen';

function EventoScreen() {
  const { id  } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="evento" 
      id={id} 
    />
  );
}

export default EventoScreen;
