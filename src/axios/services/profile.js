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
    const body = {
      email: data.email,
      username: data.email,
      first_name: data.nombre,
      last_name: data.apellido,
      persona: {
        documento_identidad: data.documento_identidad,
        nombre: data.nombre,
        apellido: data.apellido,
        //fecha_nacimiento: data.fecha_nacimiento,
        tipo_documento: data.tipo_documento,
        nacionalidad_id: data.nacionalidad,
        telefono: data.telefono,
        correo_electronico: data.email,
        position: data.position,
        company: data.company,
        // domicilio: data.domicilio,
        // genero: data.genero,
        // localidad_id: data.localidad,
      },
    };
    if (data.password) {
      body.password = data.password;
    }
    if (data.password_2) {
      body.password_2 = data.password_2;
    }
    return api.patch(
      `${apiVersion}/usuario/me/`,
      JSON.stringify(body),
      { headers: { "Content-Type": "application/json" } } // <- importante!
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
              tipo_documento: data.tipo_documento,
              nacionalidad_id: data.nacionalidad,
              telefono: data.telefono,
              correo_electronico: data.email,
              position: data.position,
              company: data.company,
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
  recuperarCuenta: async function (correo_electronico) {
    const body = {
      correo_electronico: correo_electronico,
    };
    return await api.post(`${apiVersion}/usuario/recuperar-cuenta/`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  cambiarClaveConToken: async function (uid, token, password) {
    const body = {
      uidb64: uid,
      token: token,
      nueva_clave: password,
    };
    try {
      const response = await api.post(`${apiVersion}/usuario/cambiar-clave-con-token/`, JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: "Error al cambiar la contraseña" };
    }
  },
  changePassword: function (old_password, new_password) {
    const body = {
      "clave": old_password,
      "clave_nueva": new_password,
      "clave_nueva_2": new_password
    }
    return api.patch(apiVersion + `/usuario/cambiar-clave-secreta/`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};