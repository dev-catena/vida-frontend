export default {
  mounted() {
    document.addEventListener("click", this.handleGlobalClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleGlobalClick);
  },
  methods: {
    handleGlobalClick(event) {
      if (event.target.classList && event.target.classList.contains("modal-mask")) {
        this.fecharModal();
      }
    },
    fecharModal() {
      if (this.mostrarModalCadastro !== undefined) {
        this.mostrarModalCadastro = false;
      }
      if (this.mostrarModalExcluir !== undefined) {
        this.mostrarModalExcluir = false;
      }
    },
  },
};
