// src/axios/services/baseService.js
import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default class BaseService {
  constructor(tipo) {
    this.tipo = tipo;
  }

  obtenerTodos(params = {}) {
    return api.get(`${apiVersion}/${this.tipo}/`, { params });
  }

  obtener(id) {
    return api.get(`${apiVersion}/${this.tipo}/${id}/`);
  }

  obtenerMasVisitados() {
    return api.get(`${apiVersion}/${this.tipo}/?ordering=-visits`);
  }

  obtenerCercanos(lat, lng) {
    return api.get(`${apiVersion}/${this.tipo}/?lat=${lat}&lng=${lng}`);
  }

  obtenerFiltrado(params) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, params[key]);
        }
      }
    });
    return api.get(`${apiVersion}/${this.tipo}/?${queryParams.toString()}`);
  }
}
