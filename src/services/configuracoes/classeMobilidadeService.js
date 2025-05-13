import api from "../api";

const entidade = "mobilidade-classe";

function obterTodos() {
  return new Promise((resolve, reject) => {
    return api
      .get(`${entidade}/listar`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function obterPorId(id) {
  return new Promise((resolve, reject) => {
    return api
      .get(`${entidade}/buscar/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function cadastrar(payload) {
  return new Promise((resolve, reject) => {
    return api
      .post(`${entidade}/cadastrar`, payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function atualizar(payload) {
  return new Promise((resolve, reject) => {
    return api
      .patch(`${entidade}/atualizar/${payload.id}`, payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function deletar(id) {
  return new Promise((resolve, reject) => {
    return api
      .delete(`${entidade}/excluir/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export default {
  obterTodos,
  obterPorId,
  cadastrar,
  atualizar,
  deletar,
};
