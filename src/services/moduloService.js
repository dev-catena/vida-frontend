import api from "../services/api";

const moduloService = {
  buscarModulos: async () => {
    var resp = await api.post("funcionalidade/cards/usuario");
    return resp.data;
  },
};

export default moduloService;
