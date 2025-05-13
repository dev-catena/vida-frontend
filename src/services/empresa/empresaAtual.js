export default {
  obterEmpresaAtual() {
    const path = window.location.hash.split("/")[1];
    return path || null;
  },
};
