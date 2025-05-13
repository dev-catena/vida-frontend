import api from "../api";

function obterTodos() {
  return new Promise((resolve, reject) => {
    return api
      .get("funcionalidade")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function obterPorId(id) {
  return new Promise((resolve, reject) => {
    return api
      .get(`funcionalidade/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function cadastrar(funcionalidade) {
  return new Promise((resolve, reject) => {
    return api
      .post(`funcionalidade`, funcionalidade)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function atualizar(funcionalidade) {
  return new Promise((resolve, reject) => {
    return api
      .patch(`funcionalidade/${funcionalidade.id}`, funcionalidade)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function deletar(id) {
  return new Promise((resolve, reject) => {
    return api
      .delete(`funcionalidade/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function obterFuncionalidadeUsuario() {
  return new Promise((resolve, reject) => {
    return api
      .post(`usuario/funcionalidades`)
      .then((response) => {
        resolve(response.data?.funcionalidade_id ?? []);
      })
      .catch((error) => reject(error));
  });
}

export default {
  obterTodos,
  obterPorId,
  cadastrar,
  atualizar,
  deletar,
  obterFuncionalidadeUsuario,
};
