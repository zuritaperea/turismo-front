// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemScreen from '../components/Objetos/ItemScreen';

function EventoScreen() {
  const { id, fechadesde, fechahasta } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="evento" 
      id={id} 
      fechadesde={fechadesde} 
      fechahasta={fechahasta} 
    />
  );
}

export default EventoScreen;
