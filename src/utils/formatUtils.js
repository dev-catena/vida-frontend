export default {
  methods: {
    formatarData(data) {
      if (!data) return "";
      const dt = new Date(data);
      const dia = String(dt.getDate()).padStart(2, "0");
      const mes = String(dt.getMonth() + 1).padStart(2, "0");
      const ano = dt.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
    formatarDataHora(data) {
      if (!data) return "";
      const dt = new Date(data);
      const dia = String(dt.getDate()).padStart(2, "0");
      const mes = String(dt.getMonth() + 1).padStart(2, "0");
      const ano = dt.getFullYear();
      const hora = String(dt.getHours()).padStart(2, "0");
      const minuto = String(dt.getMinutes()).padStart(2, "0");
      const segundo = String(dt.getSeconds()).padStart(2, "0");
      return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    },
  },
};
