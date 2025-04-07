import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "gastronomia";

export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },
  obtenerCercanos: function (lat,lng) {
    return api.get(`${apiVersion}/${contentType}/?lat=${lat}&lng=${lng}`);
  },
  obtenerMasVisitados: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=-visits`);
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

    if (params.price_range) queryParams.append("price_range", params.price_range);

    if (params.resto_type) queryParams.append("resto_type", params.resto_type);
    if (params.served_cuisine) queryParams.append("served_cuisine", params.served_cuisine.join(","));
    if (params.accepts_reservations) queryParams.append("accepts_reservations", params.accepts_reservations);


    return api.get(`${baseUrl}?${queryParams.toString()}`);
  },
};