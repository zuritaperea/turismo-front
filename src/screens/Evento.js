// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function EventoScreen() {
  // Obtén los parámetros de la URL, como el 'id' del evento
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
