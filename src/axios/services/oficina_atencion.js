import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL;

export default {
    obtenerNombre: function (nombre) {
        return api.get(`${apiVersion}/getOficinaAtencion?nombre=${nombre}`);
    },
    
    obtener: function (id) {
        return api.get(`${apiVersion}/getOficinaAtencionById?id=${id}`);
    },
    obtenerTodos: function () {
        return api.get(`${apiVersion}/getOficinaAtencion`);
    },
    obtenerDestino: function (id) {
        return api.get(`${apiVersion}/getOficinaAtencion?id_destino=${id}`);
    },
   
};