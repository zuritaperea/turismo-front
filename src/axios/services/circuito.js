import api from "../api";


const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "circuito";
export default {
    obtenerTodos: function () {
        return api.get(`${apiVersion}/${contentType}/?ordering=name`);
    },
    obtenerCercanos: function (lat, lng) {
        return api.get(`${apiVersion}/${contentType}/?lat=${lat}&lng=${lng}`);
    },
    obtenerMasVisitados: function () {
        return api.get(`${apiVersion}/${contentType}/?ordering=-visits`);
    },
    obtener: function (id) {
        return api.get(`${apiVersion}/${contentType}/${id}/`);
    },
    obtenerDestino: function (id) {
        return api.get(`${apiVersion}/getCircuito?id_destino_inicio_fin=${id}`);
    },
    
  obtenerFiltrado: function (params) {
    const baseUrl = `${apiVersion}/${contentType}/`;
    // Construimos los parámetros dinámicos
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append("name", params.name);
    if (params.tourist_type) queryParams.append("tourist_type", params.tourist_type.join(","));
    if (params.destino) queryParams.append("destino", params.destino);
    if (params.type_attractive) queryParams.append("type_attractive", params.type_attractive);

    return api.get(`${baseUrl}?${queryParams.toString()}`);
  },
};