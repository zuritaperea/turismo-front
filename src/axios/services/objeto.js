import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default {
  obtenerObjeto: function () {
    return api.get(`${apiVersion}/objeto_turistico_merge/`);
  },
  obtenerObjetosTop: function () {
    return api.get(`${apiVersion}/objeto_turistico_top/`);
  },
  obtenerObjetosCerca: function (lat, lng) {
    return api.get(`${apiVersion}/objeto_turistico_top/?lat=${lat}&lng=${lng}`);
  },
  buscarObjeto: function (nombre) {
    return api.get(`${apiVersion}/objeto_turistico_merge/?nombre=${nombre}`);
  },
  obtenerConstantes: function(){
    return api.get(`${apiVersion}/constantes/`);
  },
  obtenerConstantesUsadas: function(){
    return api.get(`${apiVersion}/constantes/?filtrar_usados=true`);
  },
  obtenerConstantesUsadasTipo: function(tipo){
    return api.get(`${apiVersion}/constantes/?filtrar_usados=true&tipo_objeto=${tipo}`);
  },
  obtenerServicios: function(){
    return api.get(`${apiVersion}/servicio/`);
  },
  obtenerActividades: function(){
    return api.get(`${apiVersion}/actividad/`);
  },
  obtenerSubtipoAtractivos: function(tipo_atractivo){
    return api.get(`/subtipos/atractivo/${tipo_atractivo}/`);
  }
};
