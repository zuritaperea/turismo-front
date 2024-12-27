import api from "../api";

const apiVersion = process.env.REACT_APP_API_URL;

export default {
    //tipos: oficina, atrativo
    obtenerContactoCanalOficina: function (id) {
        return api.get(`${apiVersion}/getContactoCanal?tipo=oficina&ent_id=${id}`);
    },
    obtenerContactoCanalAtractivo: function (id) {
        return api.get(`${apiVersion}/getContactoCanal?tipo=atractivo&ent_id=${id}`);
    }, 
};