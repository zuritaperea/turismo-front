// src/axios/services/atractivo.js
import api from "../api";
import BaseService from "./baseService";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

class AtractivoService extends BaseService {
  constructor() {
    super("atractivo"); 
  }

  async obtenerRedesSociales(id) {
    const response = await api.get(`${apiVersion}/${this.tipo}/${id}/`);
    return response.data.data.attributes.redes_sociales;
  }
}

export default new AtractivoService();
