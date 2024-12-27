import api from "../api";
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
          localStorage.setItem("user", JSON.stringify(data));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.access_token}`;
          returnVal = "success";
        })
        .catch((error) => {
          //console.log(error.response);
          returnVal = error.response;
        });
    return returnVal;
  }
};
