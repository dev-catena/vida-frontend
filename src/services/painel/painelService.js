import api from "../api";

const entidade = "painel";

function dashboard(payload) {
  return new Promise((resolve, reject) => {
    return api
      .post(`${entidade}/exibir`, payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export default {
  dashboard,
};
