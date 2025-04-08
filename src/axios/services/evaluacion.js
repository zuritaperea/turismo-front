import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default {
  obtenerEvaluacions: function () {
    return api.get(`${apiVersion}/evaluacion/`);
  },
  obtenerEvaluacion: function (id) {
    return api.get(`${apiVersion}/evaluacion/${id}/`);
  },
  agregarEvaluacion: function (objeto) {
    const body = {
      data: {
        type: "Evaluacion",
        id: null,
        attributes: {
          evaluation: objeto.evaluation,
          description: objeto.description,
        },
        relationships: {
          objeto: {
            data: {
                content_type: objeto.content_type,
                object_id: objeto.object_id,
            },
          },
        },
      },
    };
    return api.post(`${apiVersion}/evaluacion/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  },
};