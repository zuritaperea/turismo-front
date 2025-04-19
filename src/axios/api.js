import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const publicUrl = process.env.PUBLIC_URL;

const instance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axios.defaults.withCredentials = true;
instance.defaults.withCredentials = true;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.access_token : null;
};

const getRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.refresh_token : null;
};

if (getToken()) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;
}

// Obtener el UUID guardado en el localStorage
const uuid = localStorage.getItem("userIdentifier");

// Verificar si hay un UUID y agregarlo como encabezado personalizado
if (uuid) {
  instance.defaults.headers.common["X-Session-UUID"] = uuid;
}


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${apiUrl}/oauth2/token/`, {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.REACT_APP_CLIENT_ID,
        });

        const newToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // Guardar nuevos tokens en localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        user.token = newToken;
        user.refresh_token = newRefreshToken;
        localStorage.setItem("user", JSON.stringify(user));

        // Actualizar headers
        instance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return axios(originalRequest); // Reintenta la petición original con el nuevo token
      } catch (refreshError) {
        console.error("Error al refrescar el token", refreshError);
        localStorage.removeItem("user");
        window.location.href = publicUrl + "/login"; // Redirigir al login
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
