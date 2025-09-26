// src/screens/EventosScreen.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemScreen from '../components/Objetos/ItemScreen';

function EmprendedorScreen() {
  const { id  } = useParams(); 

  return (
    <ItemScreen 
      tipoObjeto="emprendedor" 
      id={id} 
    />
  );
}

export default EmprendedorScreen;
