import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "alojamiento";
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
    if (params.amenity_feature) {
      params.amenity_feature.forEach((feature) => queryParams.append("amenity_feature", feature));
    }
    if (params.tourist_type) queryParams.append("tourist_type", params.tourist_type.join(","));
    if (params.price_range) queryParams.append("price_range", params.price_range);
    if (params.checkin_time) queryParams.append("checkin_time", params.checkin_time);
    if (params.checkout_time) queryParams.append("checkout_time", params.checkout_time);
    if (params.accommodation_type) queryParams.append("accommodation_type", params.accommodation_type.join(","));
    if (params.destino) queryParams.append("destino", params.destino);
  
    return api.get(`${baseUrl}?${queryParams.toString()}`);
  },
  
};