<template>
  <aside v-if="empresaURL">
    <div class="titulo margem efeito">
      <div class="m-icone">
        <a
          href="#"
          class="icone-menu"
          title="Menu"
          @click.prevent="toggleMenu"
        />
      </div>
    </div>

    <!--     <div class="separador margem">
      <div class="m-icone">
        <a href="#" class="icone-compras" title="Sistema" id="sistema" @click.prevent="abaMenu('Sistema')"></a>
        <a href="#" class="icone-gestao" title="Configurações" id="empresa" @click.prevent="abaMenu('Empresa')"></a>
        <a href="#" class="icone-alvo" title="Relatórios" id="relatorio" @click.prevent="abaMenu('Relatorios')"></a>
      </div>
    </div> -->

    <!--  <nav v-if="menuAtivo === 'Sistema'" class="nav-maior separador"> -->
    <nav class="nav-maior separador">
      <router-link
        v-if="permissoes.includes(1) && empresaURL"
        :to="{ name: 'Empresa', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Empresa
      </router-link>
      <router-link
        v-if="permissoes.includes(1) && empresaURL"
        :to="{ name: 'CadastrarGrupo', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Grupo
      </router-link>
      <router-link
        v-if="permissoes.includes(1) && empresaURL"
        :to="{ name: 'GrupoFuncionalidade', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Vincular<br>funcionalidade→grupo
      </router-link>
      <router-link
        v-if="permissoes.includes(1) && empresaURL"
        :to="{ name: 'GrupoUsuario', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Vincular<br>usuário→grupo
      </router-link>
    </nav>
  </aside>
</template>

<script>
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";

export default {
  name: "ConfiguracaoComponent",

  data() {
    return {
      menuAtivo: "",
      moduloAtivo: "Configurações",
    };
  },

  computed: {
    empresaURL() {
      return this.$route.params.empresa || "";
    },
    permissoes() {
      const permissoes = JSON.parse(localStorage.getItem("permissoes") || "[]");
      console.log("Permissões do usuário:", permissoes);
      return permissoes;
    },
  },

  async created() {
    if (this.$route.name !== "Login" && this.empresaURL) {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    }
  },

  methods: {
    toggleMenu() {
      document.getElementById("main").classList.toggle("esconde");
    },
    abaMenu(menu) {
      this.menuAtivo = menu;
    },
  },
};
</script>
