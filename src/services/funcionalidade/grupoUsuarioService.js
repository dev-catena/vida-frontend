import api from "../api";

function obterPorId(id) {
  return new Promise((resolve, reject) => {
    return api
      .get(`grupo/${id}/usuarios`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function cadastrar(usuarioId, grupoId) {
  const payload = {
    usuario_id: usuarioId,
    grupo_id: grupoId,
  };

  return new Promise((resolve, reject) => {
    return api
      .post(`usuario/grupo`, payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function deletar(usuarioId, grupoId) {
  const payload = {
    usuario_id: usuarioId,
    grupo_id: grupoId,
  };

  const apiUrl = `usuario/grupo`;
  return new Promise((resolve, reject) => {
    return api
      .delete(apiUrl, {
        data: payload,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.error("API Error:", error);
        reject(error);
      });
  });
}

export default {
  obterPorId,
  cadastrar,
  deletar,
};
