import api from "../api";

// Base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default {
  /**
   * Obtener la lista de actividades de un atractivo.
   * @param {string} cdgbtms_atrativo - ID del atractivo.
   * @returns {Promise} - Lista de actividades disponibles.
   */
  obtenerActividades: function (cdgbtms_atrativo) {
    return api.get(`${API_BASE_URL}/actividades/actividades_lista/`, {
      params: { cdgbtms_atrativo }
    });
  },

  /**
   * Consultar los horarios disponibles de una actividad en una fecha.
   * @param {string} cdgbtms_atividade - ID de la actividad.
   * @param {string} fecha - Fecha en formato "DD-MM-YYYY".
   * @returns {Promise} - Horarios y cupos disponibles.
   */
  obtenerHorarios: function (cdgbtms_atividade, fecha) {
    return api.get(`${API_BASE_URL}/horarios/horarios_atividade/`, {
      params: { cdgbtms_atividade, fecha }
    });
  },

  /**
   * Realizar una reserva para una actividad en un horario específico.
   * @param {string} token - Token JWT para autenticación.
   * @param {object} data - Datos de la reserva.
   * @returns {Promise} - Confirmación de la reserva.
   */
  hacerReserva: function (token, data) {
    return api.post(`${API_BASE_URL}/reservas/reserva_salva/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  }
};
