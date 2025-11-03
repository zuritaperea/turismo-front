import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "producto_turistico";
export default {

  obtenerTodosProductoTuristico: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },

  obtenerTodosProductoTuristicoFiltro: function ({ start_date, end_date, 
    maximum_number_persons_min, content_type__model, integrates_discount_passport} = {}) {
    const params = new URLSearchParams();
  
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);
    if (maximum_number_persons_min) params.append("maximum_number_persons_min", maximum_number_persons_min);
    if (content_type__model) params.append("content_type__model", content_type__model);
    if (content_type__model) params.append("content_type__model", content_type__model);
    if (integrates_discount_passport) params.append("integrates_discount_passport", integrates_discount_passport);
    // Siempre incluir ordering
    params.append("ordering", "name");
  
    return api.get(`${apiVersion}/${contentType}/?${params.toString()}`);
  },
  obtenerProductoTuristicoPorId: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  obtenerHorariosDisponibles: function (producto_turistico_id, fecha) {
    return api.get(`${apiVersion}/horarios/disponibles/`, {
      params: {
        producto_turistico_id,
        fecha
      }
    });
  },
  obtenerMisReservas: function (id) {
    return api.get(`${apiVersion}/reserva/me/`);
  },
  obtenerReserva: function (id) {
    return api.get(`${apiVersion}/reserva/${id}/`);
  },
  crearReserva: function (data) {
    return api.post(
      `${apiVersion}/reserva/`,
      data,
      {
        headers: {
          "Content-Type": "application/vnd.api+json"
        }
      }
    );
  },
  cancelarReserva: function (id) {
    return api.post(
      `${apiVersion}/reserva/${id}/cancelar/`,
      );
  }
};