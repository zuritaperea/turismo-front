// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function AlojamientoScreen() {
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="alojamiento" 
      id={id}   
    />
  );
}

export default AlojamientoScreen;
