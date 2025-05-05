import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "viaje";
export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  crearViaje: function (data) {
    return api.post(
      `${apiVersion}/viaje/`,
      data,
      {
        headers: {
          "Content-Type": "application/vnd.api+json"
        }
      }
    );
  }

};