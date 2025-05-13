<template><div /></template>

<script>
export default {
  async created() {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await import("@/services/usuarioService").then((m) => m.default.obterInfoUsuario());
        const empresa = response.data.user.empresa;
        this.$router.replace({ path: `/${empresa}/` });
      } catch {
        localStorage.removeItem("authToken");
        this.$router.replace({ name: "Login" });
      }
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
};
</script>
