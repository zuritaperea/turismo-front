import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL;

export default {
  obtener: function (id) {
    return api.get(`${apiVersion}/getTipoTurismoById?id=${id}`);
},
obtenerTodos: function () {
    return api.get(`${apiVersion}/getTipoTurismo`);
},
};
