import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL;

export default {
    obtenerNombre: function (nombre) {
        return api.get(`${apiVersion}/getEvento?nombre=${nombre}`);
    },
    obtenerDestinoDesdeHasta: function (id, fechaDesde, fechahasta) {
        let url = `${apiVersion}/getEvento?id_destino=${id}`;

        if (fechaDesde) {
            url += `&fecha_inicio=${fechaDesde}`;
        }

        if (fechahasta) {
            url += `&fecha_fin=${fechahasta}`;
        }

        return api.get(url);
    },
    obtener: function (id) {
        return api.get(`${apiVersion}/getEventoById?id=${id}`);
    },
    obtenerTodos: function () {
        return api.get(`${apiVersion}/getEvento`);
    },
    obtenerDestino: function (id) {
        return api.get(`${apiVersion}/getEvento?id_destino=${id}`);
    },
    obtenerDesdeHasta: function (fechaDesde, fechaHasta) {
        let url = `${apiVersion}/getEvento?`;

        if (fechaDesde && fechaHasta) {
            url += `fecha_inicio=${fechaDesde}&fecha_fin=${fechaHasta}`;
        }
      
        return api.get(url);
    },
};