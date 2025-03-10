import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "atractivo";
export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },
  obtenerCercanos: function (lat,lng) {
    return api.get(`${apiVersion}/${contentType}/?lat=${lat}&lng=${lng}`);
  },
  obtenerMasVisitados: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=-visits`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  obtenerRedesSociales: function (id) {
    console.log("Obteniendo redes sociales del atractivo con ID:", id);
    return api.get(`${apiVersion}/${contentType}/${id}/`)
      .then(response => {
        console.log("Respuesta API:", response);
        return response.data.data.attributes.redes_sociales;
      });
  },
  
};