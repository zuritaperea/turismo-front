// src/axios/services/service.js
import api from "../api";

const obtenerDatos = async (tipo, id) => {
  try {
    const response = await api.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/${tipo}/${id}/`);
    const datos = {
      ...response.data.data,
      image: response.data.data.attributes.image_url
        ? process.env.REACT_APP_API_URL + response.data.data.attributes.image_url
        : process.env.REACT_APP_IMAGE_DEFAULT,
      tipo,
    };
    return datos;
  } catch (error) {
    throw new Error('Hubo un error al cargar los datos');
  }
};

const obtenerTodos = async (tipo) => {
  try {
    const response = await api.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/${tipo}/?ordering=name`);
    return response.data.data.map((obj) => ({
      id: obj.id,
      title: obj.attributes.name,
      image: obj.attributes.image_url
        ? process.env.REACT_APP_API_URL + obj.attributes.image_url
        : process.env.REACT_APP_IMAGE_DEFAULT,
      puntuacion: obj.attributes.evaluation,
      favorito: obj.attributes.favorite,
      coordinates: obj.attributes.point,
      tourist_type: obj.attributes.tourist_type,
      type: obj.type,
    }));
  } catch (error) {
    throw new Error('Hubo un error al cargar los objetos');
  }
};

export default {
  obtenerDatos,
  obtenerTodos,
};
