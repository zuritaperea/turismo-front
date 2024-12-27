import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
});

axios.defaults.withCredentials = true;
instance.defaults.withCredentials = true;

let token = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).token
  : undefined;
if (token) {
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Obtener el UUID guardado en el localStorage
const uuid = localStorage.getItem("userIdentifier");

// Verificar si hay un UUID y agregarlo como encabezado personalizado
if (uuid) {
  instance.defaults.headers.common["X-Session-UUID"] = uuid;
}


// Obtener el viaje guardado en el localStorage
const viaje = localStorage.getItem("viaje");

// Verificar si hay un viaje y agregarlo como encabezado personalizado
if (viaje) {
  instance.defaults.headers.common["X-Session-viaje"] = viaje;
}



const isStatusError = (error) => {
  return error.response.status === 401 || error.response.status === 403;
};

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && isStatusError(error)) {
      window.location.href = `${process.env.PUBLIC_URL}/logout`;
    }
    return Promise.reject(error);
  }
);

export default instance;
