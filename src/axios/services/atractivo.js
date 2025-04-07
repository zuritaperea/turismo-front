import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "atractivo";
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
  obtenerRedesSociales: async function (id) {
    const response = await api.get(`${apiVersion}/${contentType}/${id}/`);
    return response.data.data.attributes.redes_sociales;
  },
  obtenerFiltrado: function (params) {
    const baseUrl = `${apiVersion}/${contentType}/`;
    // Construimos los parámetros dinámicos
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append("name", params.name);
    if (params.tourist_type) queryParams.append("tourist_type", params.tourist_type.join(","));
    if (params.destino) queryParams.append("destino", params.destino);

    if (params.price_range) queryParams.append("price_range", params.price_range);

    if (params.services) {
      params.services.forEach((feature) => queryParams.append("services", feature));
    }
    if (params.type_attractive) queryParams.append("type_attractive", params.type_attractive);
    if (params.subtype_attractive) queryParams.append("subtype_attractive", params.subtype_attractive);
    if (params.activities) {
      params.activities.forEach((feature) => queryParams.append("activities", feature));
    }

    if (params.free_access) queryParams.append("free_access", params.free_access);

    return api.get(`${baseUrl}?${queryParams.toString()}`);
  },
};