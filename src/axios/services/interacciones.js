import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const contentType = "interaccion";

export default {
  obtenerTodos: function () {
    return api.get(`${apiVersion}/${contentType}/?ordering=name`);
  },
  obtener: function (id) {
    return api.get(`${apiVersion}/${contentType}/${id}/`);
  },
  generarInteraccionQR: function (data) {
    const attributes = {
      objeto_send_type: data.content_type,
      objeto_send_id: data.object_id,
      interaction_type: 'qrobjeto',
    };

    if (data.latitude != null && data.longitude != null) {
      attributes.point = {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }

    const body = {
      data: {
        type: "Interaccion",
        id: null,
        attributes: attributes,
      },
    };
    return api.post(`${apiVersion}/${contentType}/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  },
  generarInteraccionRedes: function (data) {
    const attributes = {
      objeto_send_type: data.content_type,
      objeto_send_id: data.object_id,
      interaction_type: 'visitaredes',
    };

    if (data.latitude != null && data.longitude != null) {
      attributes.point = {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }

    const body = {
      data: {
        type: "Interaccion",
        id: null,
        attributes: attributes,
      },
    };
    return api.post(`${apiVersion}/${contentType}/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  }
};