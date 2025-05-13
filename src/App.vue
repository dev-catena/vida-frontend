<template>
  <div>
    <headerComponent v-if="exibirLayout && $route.params.empresa" />
    <main id="main">
      <component
        :is="menuLateralAtual"
        v-if="exibirLayout && menuLateralAtual && $route.params.empresa"
      />
      <section>
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
import headerComponent from "./components/headerComponent.vue";
import empresaService from "@/services/empresa/empresaService";
import { useCustomizacao } from "@/composables/useCustomizacao";
import { useMenuLateral } from "@/composables/useMenuLateral";

export default {
  components: {
    headerComponent,
  },

  setup() {
    const { menuLateralAtual } = useMenuLateral();

    return {
      menuLateralAtual,
    };
  },

  data() {
    return {
      carregouCustomizacao: false,
    };
  },

  computed: {
    exibirLayout() {
      return this.$route.name !== "Login";
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler(novaRota) {
        if (novaRota.name === "Login") return;

        if (!this.carregouCustomizacao) {
          this.carregarCustomizacao();
        }
      },
    },
  },

  methods: {
    async carregarCustomizacao() {
      const { aplicarCustomizacao } = useCustomizacao();
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await empresaService.obterDadosEmpresa();
        const custom = response.data.data.customizacao;

        if (custom) {
          aplicarCustomizacao(custom.css_tonalidade || 25, custom.css_saturacao || "100%", custom.css_luminosidade || "65%", custom.logo || "");
        }

        this.carregouCustomizacao = true;
      } catch (e) {
        console.error("Erro ao carregar customização:", e);
      }
    },
  },
};
</script>

<style>
#main {
  display: flex;
}

.clicavel {
  cursor: pointer;
}

.snackbar {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
}

a {
  cursor: pointer;
}
.snackbar.success {
  background-color: green;
}

.snackbar.error {
  background-color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-quill-editor .ql-editor p {
  line-height: 1.3;
  margin: 0;
}
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  min-width: 80px;
}
.status-ativo {
  background-color: green;
  color: white;
}
.status-inativo {
  background-color: red;
  color: white;
}
</style>
