// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function OficinaScreen() {
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="oficina" 
      id={id} 
       />
  );
}

export default OficinaScreen;
