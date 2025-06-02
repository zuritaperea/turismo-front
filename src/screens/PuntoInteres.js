// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function PuntoInteresScreen() {
  // Obtén los parámetros de la URL, como el 'id' del evento
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="puntointeres" 
      id={id} 
    />
  );
}

export default PuntoInteresScreen;
