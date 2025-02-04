import api from "../api";
import api_profile from "./profile";

const authService = {
  login: async function (username, password, loginCallback) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("client_id", process.env.REACT_APP_CLIENT_ID);
    formData.append("grant_type", "password");

    try {
      const response = await api.post(
        process.env.REACT_APP_API_URL + process.env.REACT_APP_AUTH_PATH,
        formData
      );

      let data = response.data;
      data["username"] = username;
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      try {
        const profileResponse = await api_profile.getProfile();
        data["profile"] = profileResponse.data.included;
      } catch (profileError) {
        console.error("Error fetching profile details:", profileError);
      }

      localStorage.setItem("user", JSON.stringify(data));
      loginCallback(data); // Actualiza el estado global si se pasa un callback

      return "success";
    } catch (error) {
      return error.response;
    }
  }
};

export default authService;
