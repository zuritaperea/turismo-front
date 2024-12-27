import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL;

export default {
  obtenerFavoritos: function () {
    return api.get(`${apiVersion}/getFavorito/`);
  },
  obtenerVisitados: function () {
    return api.get(`${apiVersion}/getVisitado/`);
  },
  agregarFavorito: function (objeto) {  
    return api.post(`${apiVersion}/favorito/`, JSON.stringify(objeto), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  },
  agregarVisitado: function (objeto) {  
    return api.post(`${apiVersion}/visitado/`, JSON.stringify(objeto), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  },
};
