// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function BalnearioScreen() {
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="balneario" 
      id={id} 
       />
  );
}

export default BalnearioScreen;
