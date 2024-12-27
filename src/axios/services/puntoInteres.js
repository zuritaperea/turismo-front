import api from "../api";

const apiVersion =   process.env.REACT_APP_API_URL;

export default {
    obtenerNombre: function (nombre) {
        return api.get(`${apiVersion}/getPtoInteres?nombre=${nombre}`);
    },
    obtener: function (id) {
        return api.get(`${apiVersion}/getPtoInteresById?id=${id}`);
    },
    obtenerTodos: function () {
        return api.get(`${apiVersion}/getPtoInteres`);
    },
    obtenerDestino: function (id) {
        return api.get(`${apiVersion}/getPtoInteres?id_destino=${id}`);
    },
};