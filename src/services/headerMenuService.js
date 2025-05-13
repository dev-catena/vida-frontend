import api from "../services/api.js";

const link = "http://192.168.0.12:8080/#/login";
const linkHomologacao = "http://192.168.0.12:8080/#/";

const moduloService = {
  buscarModulos: async () => {
    try {
      const resp = await api.post("funcionalidade/cards/usuario");
      return resp.data || [];
    } catch (error) {
      console.error("Erro ao buscar módulos:", error);
      return [];
    }
  },
  linkPortal() {
    return process.env.NODE_ENV === "staging" ? linkHomologacao : link;
  },
};

export default moduloService;
