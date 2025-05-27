import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "evento";
export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },
  obtenerCercanos: function (lat, lng) {
    return api.get(`${apiVersion}/${contentType}/?lat=${lat}&lng=${lng}`);
  },
  obtenerMasVisitados: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=-start_date`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  obtenerFiltrado: function (params) {
    const baseUrl = `${apiVersion}/${contentType}/`;
    // Construimos los parámetros dinámicos
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append("name", params.name);
    if (params.tourist_type) queryParams.append("tourist_type", params.tourist_type.join(","));
    if (params.destino) queryParams.append("destino", params.destino);

    if (params.event_class) queryParams.append("event_class", params.event_class.join(","));
    if (params.speaker_name) queryParams.append("destino", params.speaker_name);
    if (params.moderador_name) queryParams.append("destino", params.moderador_name);
    if (params.presentador_name) queryParams.append("destino", params.presentador_name);

    return api.get(`${baseUrl}?${queryParams.toString()}`);
  },
};
