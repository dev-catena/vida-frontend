<template>
  <header>
    <div class="linha">
      <div class="linha">
        <nav
          v-if="menus && menus.length > 0"
          id="menu"
          class="jm jm-menu nav-maior none"
          style="margin-left: 80px"
        >
          <div class="separador">
            <RouterLink
              v-for="modulo in menus"
              :key="modulo.id"
              :to="`/${$route.params.empresa}${modulo.URL}`"
              :class="moduloAtivo === modulo.nome ? 'ativo' : ''"
              @click="fecharMenu"
            >
              {{ modulo.nome }}
            </RouterLink>
          </div>
        </nav>
        <RouterLink
          v-if="$route.params.empresa"
          :to="{ name: 'Home', params: { empresa: $route.params.empresa } }"
          :class="['logo-menor', logo ? 'logo' : 'logo-fixo']"
        >
          <img
            v-if="logo"
            :src="`${baseStorage.replace(/\/$/, '')}/${logo.replace(
              /^\/+/,
              ''
            )}`"
            alt="Logo da empresa"
            style="height: 36px; max-width: 140px; object-fit: contain"
          >
        </RouterLink>

        <a
          v-if="menus && menus.length > 0"
          href="#"
          class="icone-avancar negrito com-texto"
          @click.prevent="toggleMenu($event)"
        >
          {{ moduloAtivo }}
        </a>
      </div>

      <div class="coluna">
        <a
          href="#"
          class="avatar direita"
          :title="modulo && modulo.usuario_nome ? modulo.usuario_nome : ''"
          @click.prevent="toggleUserMenu($event)"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/709/709722.png"
            :class="theme == 'dark' ? 'white-profile' : 'none'"
          >
        </a>

        <nav
          id="usuario"
          class="jm jm-avatar none"
        >
          <div class="separador margem alinha-centro negrito">
            {{ modulo && modulo.usuario_nome ? modulo.usuario_nome : "" }}
          </div>
          <div class="separador">
            <a
              href="#"
              :class="theme == 'dark' ? 'ativo' : ''"
              onclick="document.documentElement.classList.toggle('dark');this.classList.toggle('ativo');return false"
              @click="setTheme()"
            >
              <span class="direita toggle" />Tema escuro
            </a>
          </div>

          <div class="separador bg-cinza">
            <a @click="logout()">Sair</a>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import headerMenuService from "@/services/headerMenuService";
import api from "@/services/api";
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";
import usuarioService from "@/services/usuarioService";

import { useCustomizacao } from "@/composables/useCustomizacao";
import { useModuloAtivo } from "@/composables/useModuloAtivo";
import { computed } from "vue";

export default {
  data() {
    return {
      theme: null,
      menus: [],
      menu: [
        {
          label: "Administração",
          icon: "mdi-cog-outline",
          permissoes: ["visualizar_usuarios", "visualizar_empresa"],
          children: [
            {
              label: "Usuários",
              path: "/usuarios",
              func: "visualizar_usuarios",
            },
            {
              label: "Empresas",
              path: "/empresas",
              func: "visualizar_empresa",
            },
            { label: "Grupos", path: "/grupos", func: "visualizar_grupos" },
            {
              label: "Funcionalidades",
              path: "/funcionalidades",
              func: "visualizar_funcionalidades",
            },
          ],
        },
        {
          label: "Estrutura Física",
          icon: "mdi-home-city",
          permissoes: ["visualizar_predios"],
          children: [
            { label: "Prédios", path: "/predios", func: "visualizar_predios" },
            { label: "Locais", path: "/locais", func: "visualizar_locais" },
            { label: "Câmeras", path: "/cameras", func: "visualizar_cameras" },
          ],
        },
        {
          label: "Hóspedes",
          icon: "mdi-account-multiple-outline",
          permissoes: ["visualizar_pessoas"],
          children: [
            { label: "Pessoas", path: "/pessoas", func: "visualizar_pessoas" },
            {
              label: "Check-in/Check-out",
              path: "/movimentacoes",
              func: "ver_movimentacoes",
            },
          ],
        },
        {
          label: "Prontuário Eletrônico",
          icon: "mdi-clipboard-text",
          permissoes: [
            "ver_sinais_vitais",
            "ver_evolucoes",
            "ver_admissoes",
            "ver_lesoes",
            "ver_ocorrencias",
          ],
          children: [
            {
              label: "Sinais Vitais",
              path: "/saude/sinais-vitais",
              func: "ver_sinais_vitais",
            },
            {
              label: "Evoluções",
              path: "/saude/evolucoes",
              func: "ver_evolucoes",
            },
            {
              label: "Admissões",
              path: "/saude/admissoes",
              func: "ver_admissoes",
            },
            { label: "Lesões", path: "/saude/lesoes", func: "ver_lesoes" },
            {
              label: "Ocorrências",
              path: "/saude/ocorrencias",
              func: "ver_ocorrencias",
            },
          ],
        },
        {
          label: "Alertas e Eventos",
          icon: "mdi-bell-alert",
          permissoes: ["visualizar_alertas"],
          children: [
            {
              label: "Configurações de Alerta",
              path: "/alertas/configuracoes",
              func: "visualizar_alertas",
            },
            {
              label: "Tipos de Evento",
              path: "/eventos/tipos",
              func: "visualizar_eventos",
            },
          ],
        },
      ],
      permissoes: [],
      modalAberto: false,
      usuarios: [],
      usuarioSelecionado: null,
      funcionalidades: [],
      funcionalidade_id: [],
      funcionalidadesSelecionadas: [],
      baseStorage: process.env.VUE_APP_ROOT_STORAGE,
      modulo: null,
      moduloAtivo: "",
    };
  },
  computed: {
    logo() {
      const { logo } = useCustomizacao();
      return logo.value;
    },
  },
  async created() {
    if (this.$route.name !== "Login") {
      this.permissoes =
        await funcionalidadeService.obterFuncionalidadeUsuario();

      try {
        const modulos = await headerMenuService.buscarModulos();
        this.menus = modulos || [];

        if (this.menus.length > 0) {
          this.modulo = this.menus[0];
          this.moduloAtivo = this.menus[0].nome;
        }
      } catch (error) {
        console.error("Erro ao buscar módulos:", error);
        this.menus = [];
      }
    }

    this.linkPortal = headerMenuService.linkPortal();

    this.theme = localStorage.getItem("tema");
    if (this.theme == null) {
      localStorage.setItem("tema", "light");
    } else {
      document.documentElement.classList.toggle(this.theme);
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeMenuOnClickOutside);
    document.removeEventListener("click", this.closeUserMenuOnClickOutside);
  },
  mounted() {
    const menusRef = computed(() => this.menus);

    const { modulo, moduloAtivo } = useModuloAtivo(menusRef);

    this.$watch(
      () => [modulo.value, moduloAtivo.value],
      ([novoModulo, novoModuloAtivo]) => {
        this.modulo = novoModulo;
        this.moduloAtivo = novoModuloAtivo;
      },
      { immediate: true }
    );

    this.carregarFuncionalidadesUsuario();
  },
  methods: {
    async carregarPermissoes() {
      try {
        this.permissoes =
          await funcionalidadeService.obterFuncionalidadeUsuario();
      } catch (error) {
        console.error("Erro ao obter permissões:", error);
      }
    },
    abrirModal() {
      this.modalAberto = true;
      this.carregarUsuarios();
      this.carregarFuncionalidadesUsuario();
      this.funcionalidadesSelecionadas = [...this.funcionalidade_id];
    },
    fecharModal() {
      this.modalAberto = false;
      this.usuarioSelecionado = null;
      this.funcionalidadesSelecionadas = [];
    },
    async carregarUsuarios() {
      try {
        const response = await usuarioService.obterTodos();
        this.usuarios = response.data;
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    },
    async carregarFuncionalidadesUsuario() {
      const response = await funcionalidadeService.obterFuncionalidadeUsuario();
      const permissoes = response.data;

      if (permissoes) {
        this.funcionalidades = permissoes.funcionalidade || [];
        this.funcionalidade_id = permissoes.funcionalidade_id || [];
      }
    },

    async logout() {
      try {
        const authToken = localStorage.getItem("authToken");
        await api.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        localStorage.removeItem("authToken");
        document.removeEventListener("click", this.closeMenuOnClickOutside);
        document.removeEventListener("click", this.closeUserMenuOnClickOutside);

        this.$router.push({ name: "Login" });
      } catch (error) {
        console.error("Erro ao realizar logout:", error);
      }
    },
    toggleMenu(event) {
      event.stopPropagation();
      this.menuAberto = !this.menuAberto;
      const menu = document.getElementById("menu");
      if (menu) {
        menu.classList.toggle("none", !this.menuAberto);
      }
      if (this.menuAberto) {
        document.addEventListener("click", this.closeMenuOnClickOutside);
      } else {
        document.removeEventListener("click", this.closeMenuOnClickOutside);
      }
    },

    fecharMenu() {
      this.menuAberto = false;
      const menu = document.getElementById("menu");
      if (menu) {
        menu.classList.add("none");
      }
      document.removeEventListener("click", this.closeMenuOnClickOutside);
    },
    toggleUserMenu(event) {
      event.stopPropagation();
      this.userMenuAberto = !this.userMenuAberto;
      const userMenu = document.getElementById("usuario");
      if (userMenu) {
        userMenu.classList.toggle("none", !this.userMenuAberto);
      }
      if (this.userMenuAberto) {
        document.addEventListener("click", this.closeUserMenuOnClickOutside);
      } else {
        document.removeEventListener("click", this.closeUserMenuOnClickOutside);
      }
    },
    closeMenuOnClickOutside(event) {
      const menu = document.getElementById("menu");
      if (menu && !menu.contains(event.target)) {
        this.menuAberto = false;
        menu.classList.add("none");
        document.removeEventListener("click", this.closeMenuOnClickOutside);
      }
    },
    closeUserMenuOnClickOutside(event) {
      const userMenu = document.getElementById("usuario");
      if (userMenu && !userMenu.contains(event.target)) {
        this.userMenuAberto = false;
        userMenu.classList.add("none");
        document.removeEventListener("click", this.closeUserMenuOnClickOutside);
      }
    },
    setTheme() {
      if (this.theme == "light") {
        localStorage.setItem("tema", "dark");
        this.theme = "dark";
      } else {
        localStorage.setItem("tema", "light");
        this.theme = "light";
      }
    },
  },
};
</script>

