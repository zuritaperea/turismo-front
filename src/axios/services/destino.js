import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "destino";

export default {
    obtenerNombre: function (nombre) {
        return api.get(`${apiVersion}/getDestino?nombre=${nombre}`);
    },
    obtener: function (id, fechaInicio, fechaFin, filtros) {
        let url = `${apiVersion}/${contentType}/${id}/`;
      
        if (fechaInicio) {
          url += `&fechaInicio=${fechaInicio}`;
        }
      
        if (fechaFin) {
          url += `&fechaFin=${fechaFin}`;
        }
      
        if (filtros) {
          url += `&filtros=${filtros}`;
        }
      
        return api.get(url);
      },
      obtenerTodos: function () {
        return api.get(`${apiVersion}/${contentType}/?ordering=name`);
      },
    obtenerDestino: function (id) {
      return api.get(`${apiVersion}/${contentType}/${id}/`);
    },
};