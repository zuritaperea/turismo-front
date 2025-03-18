import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "atractivo";
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
  obtenerRedesSociales: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`)
      .then(response => {
        return response.data.data.attributes.redes_sociales;
      });
  },
  obtenerTodosProductoTuristico: function () {
    return api.get(`${apiVersion}/producto_turistico/?ordering=name`);
  },

  obtenerProductoTuristicoPorId: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },

  crearReserva: function(start_date, end_date, id, cantidad) {
    const payload = {
      data: {
        type: "Reserva",
        attributes: {
          start_date,
          end_date,
          cantidad: Number(cantidad)  // Convertir a número
        }
      }
    };
  
    if (id) {
      payload.data.id = id;  // Solo agregar id si existe
    }
  
    return api.post(
      `${apiVersion}/reserva/`,
      payload,
      {
        headers: {
          "Content-Type": "application/vnd.api+json"
        }
      }
    );
  },
};