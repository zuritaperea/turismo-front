import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;

export default {

    getProfile: function () {
        return api.get(`${apiVersion}/turista/me/`);
    },
    getViajes: function () {
        return api.get(`${apiVersion}/getViajeFront/`);
    },
    getProvincia: function (nombre) {
        return api.get(
            `${apiVersion}/getProvincia?nombre=${nombre}`,
            null,
            { headers: { "Content-Type": "application/vnd.api+json" } }
        );
    },
    getProvincias: function () {
        return api.get(
            `${apiVersion}/getProvincia`,
            null,
            { headers: { "Content-Type": "application/vnd.api+json" } }
        );
    },
    getDepartamentos: function (id) {
        return api.get(
            `${apiVersion}/getDepartamento?idProvincia=${id}`,
            null,
            { headers: { "Content-Type": "application/vnd.api+json" } }
        );
    },

    getLocalidades: function (id) {
        return api.get(
            `${apiVersion}/getLocalidad?idDepartamento=${id}`,
            null,
            { headers: { "Content-Type": "application/vnd.api+json" } }
        );
    },
    getLocalidad: function (id) {
        return api.get(
            `${apiVersion}/getLocalidad?id=${id}`,
            null,
            { headers: { "Content-Type": "application/vnd.api+json" } }
        );
    },
    registro: function (data) {
        return api.post(`${apiVersion}/usuario/registro/`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/vnd.api+json",
            },
        });
    },
    registroDatosAdicionales: function (data) {
        return api.post(`${apiVersion}/usuario/datos-adicionales/`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/vnd.api+json",
            },
        });
    },
    editarPerfil: function (data) {
        return api.post(`${apiVersion}/usuario/editar-perfil/`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/vnd.api+json",
            },
        });
    },
    recuperarCuenta: function (data) {
        return api.post(`${apiVersion}/usuario/recuperar-cuenta/`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    eliminarCuenta: function () {
        return api.post(`${apiVersion}/usuario/eliminar-cuenta/`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};
