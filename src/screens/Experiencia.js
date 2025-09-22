// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import ItemScreen from '../components/Objetos/ItemScreen';

function ExperienciaScreen() {
  const { id } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="experiencia" 
      id={id} 
       />
  );
}

export default ExperienciaScreen;
