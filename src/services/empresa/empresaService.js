import api from "../api";

function obterDadosEmpresa() {
  return new Promise((resolve, reject) => {
    return api
      .get("sua-empresa/buscar")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

function atualizarDadosEmpresa(formData) {
  return new Promise((resolve, reject) => {
    return api
      .post(`sua-empresa/atualizar`, formData)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export default {
  obterDadosEmpresa,
  atualizarDadosEmpresa,
};
