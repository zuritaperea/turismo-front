import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
export default {
  obtenerAccionesSustentables: function () {
    return api.get(`${apiVersion}/accion_sustentable/`);
  },
  obtenerEvidencias: function () {
    return api.get(`${apiVersion}/recompensa_evidencias/`);
  },
  obtenerNiveles: function () {
    return api.get(`${apiVersion}/recompensa_niveles/`);
  },
  obtenerBeneficios: function () {
    return api.get(`${apiVersion}/recompensa_beneficios/`);
  },
  obtenerBeneficiosUsuario: function () {
    return api.get(`${apiVersion}/usuario_beneficios/`);
  },
  agregarEvidencia: function (data) {
    const formData = new FormData();
    formData.append("comment", data.comment);
    if (data.locationLat !== null && data.locationLng !== null) {
      formData.append("location", JSON.stringify({
      lat: data.locationLat,
      lng: data.locationLng
      }));
    }
    formData.append("image", data.image);  // archivo tipo File
    formData.append("sustainable_action", data.sustainable_action_id);  // ID
    
    api.post(`${apiVersion}/recompensa_evidencias/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};