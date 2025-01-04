// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function ComercioScreen() {
  // Obtén los parámetros de la URL, como el 'id' del evento
  const { id, fechadesde, fechahasta } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="comercio" 
      id={id} 
      fechadesde={fechadesde} 
      fechahasta={fechahasta} 
    />
  );
}

export default ComercioScreen;
