import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "front";
export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/`);
  },
  obtenerUltimo: function (lat,lng) {
    return api.get(`${apiVersion}/${contentType}/last/`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  obtenerBanners: function () {
    return api.get(`${apiVersion}/banner/`);
  }
};