import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "producto_turistico";
export default {

  obtenerTodosProductoTuristico: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },

  obtenerProductoTuristicoPorId: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  obtenerMisReservas: function (id) {
    return api.get(`${apiVersion}/reserva/me/`);
  },
  obtenerReserva: function (id) {
    return api.get(`${apiVersion}/reserva/${id}/`);
  },
  crearReserva: function (data) {
    return api.post(
      `${apiVersion}/reserva/`,
      data,
      {
        headers: {
          "Content-Type": "application/vnd.api+json"
        }
      }
    );
  },
};