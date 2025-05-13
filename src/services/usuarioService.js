import api from "./api";

function obterTodos() {
  return new Promise((resolve, reject) => {
    api
      .get("usuario/listar")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function obterInfoUsuario() {
  return new Promise((resolve, reject) => {
    api
      .get("usuario/info")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}

function obterPorId(id) {
  return new Promise((resolve, reject) => {
    api
      .get(`usuario/buscar/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function cadastrar(usuario) {
  return new Promise((resolve, reject) => {
    api
      .post("usuario/gravar", usuario)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function atualizar(usuario) {
  return new Promise((resolve, reject) => {
    api
      .patch(`usuario/atualizar/${usuario.id}`, usuario)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function deletar(id) {
  return new Promise((resolve, reject) => {
    api
      .delete(`usuario/excluir/${id}`)
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
  obterInfoUsuario,
};
