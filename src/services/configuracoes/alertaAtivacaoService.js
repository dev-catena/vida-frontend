import api from "../api";

const entidade = "alerta-tipo";

function obterTodos() {
  return new Promise((resolve, reject) => {
    return api
      .get(`${entidade}/listar`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export default {
  obterTodos,
};
