import api from "../api";
import api_profile from './profile';  // Asegúrate de importar la función getProfile

export default {
  login: async function (username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('client_id', process.env.REACT_APP_CLIENT_ID);
    formData.append('grant_type', 'password');
    let returnVal = undefined;

    await
      api
        .post(
          process.env.REACT_APP_API_URL + process.env.REACT_APP_AUTH_PATH,
          formData,
          {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            ,
          }
        )
        .then((response) => {
          let data = response.data;
          data['username'] = username;
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.access_token}`;

          api_profile.getProfile()
          .then(profileResponse => {
            data['profile'] = profileResponse.data.included; // Agrega la información del perfil al objeto de datos
            localStorage.setItem("user", JSON.stringify(data)); // Guarda los datos completos en el localStorage
          })
          .catch(profileError => {
            console.error('Error fetching profile details:', profileError);
            // Si no se puede obtener el perfil, aún guardar los datos básicos
            localStorage.setItem("user", JSON.stringify(data));
          });

     
          returnVal = "success";
        })
        .catch((error) => {
          //console.log(error.response);
          returnVal = error.response;
        });
    return returnVal;
  }
};
