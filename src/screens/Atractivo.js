// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function AtractivoScreen() {
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="atractivo" 
      id={id} 
       />
  );
}

export default AtractivoScreen;
