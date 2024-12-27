import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "objeto_turistico_beneficio";
export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/`);
  },
  obtenerCercanos: function (lat,lng) {
    return api.get(`${apiVersion}/${contentType}/?lat=${lat}&lng=${lng}`);
  },
  obtenerMasVisitados: function () {
    return api.get(`${apiVersion}/objeto_beneficio_visitas/`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/beneficio/${id}/`);
  },
  obtenerComprobante: function (id) {
    return api.get(`${apiVersion}/beneficio/${id}/comprobante/`);
  },
};