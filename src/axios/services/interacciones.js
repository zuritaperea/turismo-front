import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "interaccion";

export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
//TODO agregar alta de interaccion lectura qr
};