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

    <div class="separador margem">
      <div class="m-icone">
        <a
          id="sistema"
          href="#"
          class="icone-compras"
          :class="{ ativo: menuAtivo === 'Sistema' }"
          title="Sistema"
          @click.prevent="abaMenu('Sistema')"
        />
        <a
          id="empresa"
          href="#"
          class="icone-gestao"
          :class="{ ativo: menuAtivo === 'Empresa' }"
          title="Configurações"
          @click.prevent="abaMenu('Empresa')"
        />
        <a
          id="relatorio"
          href="#"
          class="icone-alvo"
          :class="{ ativo: menuAtivo === 'Relatorios' }"
          title="Relatórios"
          @click.prevent="abaMenu('Relatorios')"
        />
      </div>
    </div>

    <nav
      v-if="menuAtivo === 'Sistema'"
      class="nav-maior separador"
    >
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'Painel', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Painel
      </router-link>
    </nav>

    <nav
      v-if="menuAtivo === 'Empresa'"
      class="nav-maior separador"
    >
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'Predio', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Prédio
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'Local', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Local
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'CondicaoSaude', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Condição de Saúde
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'classeMobilidade', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Classe de Mobilidade
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'TipoEvento', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Evento Monitorado
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'Pessoa', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Hóspede
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'Camera', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Câmera
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'VinculoPessoaQuarto', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Configurar Hóspede e Quarto
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'VinculoEventoAlerta', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Configurar Evento e Alerta
      </router-link>
      <router-link
        v-if="permissoes.includes(2) && empresaURL"
        :to="{ name: 'VinculoCameraLocal', params: { empresa: empresaURL } }"
        active-class="ativo"
      >
        Configurar Câmera e Local
      </router-link>
    </nav>

    <nav
      v-if="menuAtivo === 'Relatorios'"
      class="nav-maior separador"
    />
  </aside>
</template>

<script>
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";

export default {
  name: "ControleQuedaComponent",

  data() {
    return {
      permissoes: [],
      menuAtivo: "Empresa",
      moduloAtivo: "Controle de Queda",
    };
  },

  computed: {
    empresaURL() {
      return this.$route.params.empresa || "";
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
