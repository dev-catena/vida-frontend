<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <h2>Adicionar usuários a um grupo</h2>
      </div>
    </div>

    <div class="container margem">
      <div class="bloco margem">
        <label>Selecione um grupo: </label>
        <div>
          <select
            v-model="grupoSelecionado"
            @change="handleGrupoSelecionadoChange"
          >
            <option
              value=""
              disabled
            >
              Selecione
            </option>
            <option
              v-for="item in grupos"
              :key="item.id"
              :value="item.id"
            >
              {{ item.nome }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div
      v-if="grupoSelecionado"
      class="container margem"
    >
      <div class="bloco margem">
        <label>Usuários para adicionar:</label>
        <select
          v-model="usuarioSelecionado"
          @change="associarUsuario"
        >
          <option
            value=""
            disabled
          >
            Selecione um usuário
          </option>
          <option
            v-for="user in usuariosDisponiveis"
            :key="user.id"
            :value="user.id"
            :disabled="isUserInGroup(user)"
          >
            {{ user.nome }}
          </option>
        </select>

        <div style="margin-top: 10px">
          <ul>
            <li
              v-for="user in grupoUsuario"
              :key="user.id"
            >
              {{ user.nome }}
              <i
                class="icone-deletar icone-menor direita"
                style="cursor: pointer; scale: 1.3; margin-bottom: 0px"
                @click="desassociarUsuario(user)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import grupoService from "@/services/funcionalidade/grupoService";
import usuarioService from "@/services/usuarioService";
import grupoUsuarioService from "@/services/funcionalidade/grupoUsuarioService";

export default {
  name: "VinculoGrupoUsuarioView",
  data() {
    return {
      grupos: [],
      grupoSelecionado: null,
      usuarios: [],
      grupoUsuario: [],
      usuarioSelecionado: null,
    };
  },
  computed: {
    usuariosDisponiveis() {
      return this.usuarios.filter((user) => !this.isUserInGroup(user));
    },
  },
  mounted() {
    this.getAllGrupos();
    this.getAllUsuarios();
  },
  methods: {
    handleGrupoSelecionadoChange() {
      if (this.grupoSelecionado) {
        this.obterUsuarioPorGrupo(this.grupoSelecionado);
      }
    },

    isUserInGroup(user) {
      return this.grupoUsuario.some((u) => u.id === user.id);
    },

    associarUsuario() {
      if (!this.usuarioSelecionado) return;
      grupoUsuarioService
        .cadastrar(this.usuarioSelecionado, this.grupoSelecionado)
        .then(() => {
          const usuario = this.usuarios.find((u) => u.id === this.usuarioSelecionado);
          this.grupoUsuario.push(usuario);
          this.usuarioSelecionado = null;
        })
        .catch((error) => {
          console.error("Erro ao associar usuário:", error);
        });
    },
    desassociarUsuario(user) {
      grupoUsuarioService
        .deletar(user.id, this.grupoSelecionado)
        .then(() => {
          this.grupoUsuario = this.grupoUsuario.filter((u) => u.id !== user.id);
        })
        .catch((error) => {
          console.error("Erro ao desassociar usuário:", error);
        });
    },

    obterUsuarioPorGrupo(id) {
      grupoUsuarioService
        .obterPorId(id)
        .then((response) => {
          this.grupoUsuario = response.data;
        })
        .catch((error) => {
          console.log("Erro ao carregar usuários do grupo:", error);
        });
    },

    getAllUsuarios() {
      usuarioService
        .obterTodos()
        .then((response) => {
          this.usuarios = response.data;
        })
        .catch((error) => {
          console.log("Erro ao carregar usuários:", error);
        });
    },

    getAllGrupos() {
      grupoService
        .obterTodos()
        .then((response) => {
          this.grupos = response.data;
        })
        .catch((error) => {
          console.log("Erro ao carregar grupos:", error);
        });
    },
  },
};
</script>

<style scoped>
li {
  transition: background-color 0.3s ease;
  margin-bottom: 5px;
  font-size: medium;
  margin-left: -20px;
}

li:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
