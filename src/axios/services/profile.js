import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default {

  getAllPeople: function () {
    return api.get(`${apiVersion}/persona/`);
  },

  getProfile: function () {
    return api.get(`${apiVersion}/usuario/me/?include=persona`);
  },

  updateProfile: function (data) {
    return api.patch(
      `${apiVersion}/perfil-usuario/me/?include=ubicacion`,
      { data: data },
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },

  updateFotoPersona: function (id, data) {
    return api.patch(
      `${apiVersion}/perfil-usuario/${id}/actualizar-avatar/`,
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      }
    );
  },

  getPaises: function () {
    return api.get(
      `${apiVersion}/ubicacion/?nombre=&parent_id=&parent_nombre=&tipo=PA`,
      null,
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },

  getProvincias: function (id) {
    return api.get(
      `${apiVersion}/ubicacion/?nombre=&parent_id=${id}&parent_nombre=&tipo=PR`,
      null,
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },
  getProvinciasArgentinas: function (id) {
    return api.get(
      `${apiVersion}/ubicacion/?nombre=&parent_id=&parent_nombre=ARGENTINA&tipo=PR`,
      null,
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },
  getDepartamentos: function (id) {
    return api.get(
      `${apiVersion}/ubicacion/?nombre=&parent_id=${id}&parent_nombre=&tipo=DE`,
      null,
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },

  getLocalidades: function (id) {
    return api.get(
      `${apiVersion}/ubicacion/?nombre=&parent_id=${id}&parent_nombre=&tipo=LO`,
      null,
      { headers: { "Content-Type": "application/vnd.api+json" } }
    );
  },
  registro: function (data) {
    const body = {
      data: {
        type: "Usuario",
        id: null,
        attributes: {
          email: data.email,
          username: data.email,
          first_name: data.nombre,
          last_name: data.apellido,
          domicilio: data.domicilio,
          password: data.password,
          password_2: data.password_2,
        },
        relationships: {
          persona: {
            data: {
              documento_identidad: data.documento_identidad,
              nombre: data.nombre,
              apellido: data.apellido,
              fecha_nacimiento: data.fecha_nacimiento,
              //nacionalidad_id: data.nacionalidad,
              telefono: data.telefono,
              correo_electronico: data.email,
              //domicilio: data.domicilio,
              //genero: data.genero,
              //localidad_id: data.localidad,
            },
          },
        },
      },
    };
    return api.post(`${apiVersion}/usuario/registro/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    });
  },
  recuperarCuenta: function (data) {
    const body = {
        correo_electronico:data,      
    };
    return api.post(`${apiVersion}/usuario/recuperar-cuenta/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};