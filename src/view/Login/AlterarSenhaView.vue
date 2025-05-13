<template>
  <div class="">
    <br>
    <br><br><br>
    <div class="box-login">
      <div style="text-align: right">
        <b-button
          variant="outline-secondary"
          @click="toggleShowPassword"
        >
          <!-- <b-icon :icon="showNewPasswordConf ? 'eye-fill' : 'eye-slash-fill'"></b-icon> -->
          <!-- <i class="fa-solid fa-eye" :icon="showNewPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i> -->
          <i
            class="fas"
            :class="{ 'fa-eye-slash': showNewPassword, 'fa-eye': !showNewPassword }"
          />
        </b-button>
      </div>
      <br>
      <div style="text-align: center">
        <h4 class="titulo">
          Alterar Senha
        </h4>
      </div>
      <hr>

      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <i class="fa-solid fa-lock" />
        </b-input-group-prepend>
        <b-form-input
          ref="currentInput"
          v-model="current_password"
          :type="showCurrentPassword ? 'text' : 'password'"
          placeholder="Senha Atual"
        />
        <b-input-group-append />
      </b-input-group>

      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <i class="fa-solid fa-lock" />
        </b-input-group-prepend>
        <b-form-input
          v-model="new_password"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="Nova Senha"
        />
        <b-input-group-append />
      </b-input-group>

      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <i class="fa-solid fa-lock" />
        </b-input-group-prepend>
        <b-form-input
          v-model="new_password_confirmation"
          :type="showNewPasswordConf ? 'text' : 'password'"
          :state="validationState"
          placeholder="Repita a Nova Senha"
        />
      </b-input-group>

      <div
        v-if="notSamePasswords"
        class="matches"
        style="color: red; text-align: center"
      >
        <p>A senhas não conferem!</p>
      </div>

      <br>

      <br>
      <transition
        name="hint"
        appear
      >
        <div
          v-if="passwordValidation.errors.length > 0 && !submitted"
          class="hints"
        >
          <hr>
          <p
            v-for="error in passwordValidation.errors"
            :key="error.id"
            style="color: red"
          >
            {{ error }}
          </p>
        </div>
      </transition>

      <b-button
        v-if="passwordsFilled && !notSamePasswords && passwordValidation.valid"
        class="button-default"
        @click="resetPassword"
      >
        <b-icon
          v-if="!loading"
          icon="check-circle-fill"
          aria-hidden="true"
        />
        <i
          v-if="loading"
          class="fas fa-spinner fa-spin"
        /> &nbsp;
        <span v-if="!loading">Salvar </span>
        <span v-if="loading">Salvando...</span>
      </b-button>
    </div>
    <br><br><br><br><br>
  </div>
</template>

<script>
import grupoService from "@/services/funcionalidade/grupoService";
import usuarioService from "@/services/usuarioService";
import grupoUsuarioService from "@/services/funcionalidade/grupoUsuarioService";
import grupoFuncionalidadeService from "@/services/funcionalidade/grupoFuncionalidadeService";
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";

export default {
  name: "AlterarSenhaView",
  data() {
    return {
      grupos: [],
      grupoSelecionado: null,
      usuarios: [],
      grupoUsuario: [],
      searchQueryUser: "",
      filteredUsers: [],
      listaAbertaUser: false,
      funcionalidades: [],
      funcionalidadesNoGrupo: [],
      searchQueryFunc: "",
      filteredFuncionalidades: [],
      listaAbertaFunc: false,
    };
  },
  mounted() {
    this.getAllGrupos();
    this.getAllUsuarios();
    this.getAllFuncionalidades();
  },
  methods: {
    abrirListaUser() {
      this.listaAbertaUser = true;
    },
    filtrarUsers() {
      const query = this.searchQueryUser.toLowerCase();

      if (this.usuarios.length === 0) {
        this.filteredUsers = [];
        return;
      }

      this.filteredUsers = this.usuarios.filter((user) => user.nome.toLowerCase().includes(query));
    },
    fecharListaUser() {
      setTimeout(() => {
        this.listaAbertaUser = false;
        this.filteredUsers = [];
      }, 200);
    },
    toggleUser(user) {
      if (this.isUserInGroup(user)) {
        this.desassociarUsuario(user);
      } else {
        this.associarUsuario(user);
      }
    },
    associarUsuario(user) {
      grupoUsuarioService
        .cadastrar(user.id, this.grupoSelecionado)
        .then(() => {
          this.grupoUsuario.push(user);
          this.filtrarUsers();
        })
        .catch((error) => {
          console.error("Error associating user:", error);
        });
    },
    desassociarUsuario(user) {
      grupoUsuarioService
        .deletar(user.id, this.grupoSelecionado)
        .then(() => {
          this.grupoUsuario = this.grupoUsuario.filter((u) => u.id !== user.id);
          this.filtrarUsers();
        })
        .catch((error) => {
          console.error("Error disassociating user:", error);
        });
    },
    isUserInGroup(user) {
      return this.grupoUsuario.some((u) => u.id === user.id);
    },
    abrirListaFunc() {
      this.listaAbertaFunc = true;
    },
    filtrarFuncionalidades() {
      const query = this.searchQueryFunc.toLowerCase();

      if (this.funcionalidades.length === 0) {
        this.filteredFuncionalidades = [];
        return;
      }

      this.filteredFuncionalidades = this.funcionalidades.filter((func) => func.nome.toLowerCase().includes(query));
    },
    fecharListaFunc() {
      setTimeout(() => {
        this.listaAbertaFunc = false;
        this.filteredFuncionalidades = [];
      }, 200);
    },
    toggleFunc(func) {
      if (this.isFuncInGroup(func)) {
        this.desassociarFunc(func);
      } else {
        this.associarFunc(func);
      }
    },
    associarFunc(func) {
      grupoFuncionalidadeService
        .cadastrar(func.id, this.grupoSelecionado)
        .then(() => {
          this.funcionalidadesNoGrupo.push(func);
          this.filtrarFuncionalidades();
        })
        .catch((error) => {
          console.error("Error associating funcionalidade:", error);
        });
    },
    desassociarFunc(func) {
      grupoFuncionalidadeService
        .deletar(func.id, this.grupoSelecionado)
        .then(() => {
          this.funcionalidadesNoGrupo = this.funcionalidadesNoGrupo.filter((f) => f.id !== func.id);
          this.filtrarFuncionalidades();
        })
        .catch((error) => {
          console.error("Error disassociating funcionalidade:", error);
        });
    },
    isFuncInGroup(func) {
      return this.funcionalidadesNoGrupo.some((f) => f.id === func.id);
    },
    handleGrupoSelecionadoChange() {
      if (this.grupoSelecionado) {
        this.obterUsuarioPorGrupo(this.grupoSelecionado);
        this.obterFuncionalidadesGrupo(this.grupoSelecionado);
      }
    },
    obterUsuarioPorGrupo(id) {
      grupoUsuarioService
        .obterPorId(id)
        .then((response) => {
          this.grupoUsuario = response.data;
          this.filtrarUsers();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    obterFuncionalidadesGrupo(id) {
      grupoFuncionalidadeService
        .obterFuncionalidade(id)
        .then((response) => {
          this.funcionalidadesNoGrupo = response.data;
          this.filtrarFuncionalidades();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllUsuarios() {
      usuarioService
        .obterTodos()
        .then((response) => {
          this.usuarios = response.data;
          this.filtrarUsers();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllFuncionalidades() {
      funcionalidadeService
        .obterTodos()
        .then((response) => {
          this.funcionalidades = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllGrupos() {
      grupoService
        .obterTodos()
        .then((response) => {
          this.grupos = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
}

.box-login {
  max-width: 400px;
  margin: auto;
  border: 1px solid #ddd;
  margin-top: 0px;
  padding: 30px;
  border-radius: 20px;
  background-color: #ffffff;
}

.b-button {
  width: 100%;
  background-color: var(--second-color) !important;
  color: rgb(255, 255, 255) !important;
  padding: 10px !important;
  margin: 6px 0 !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer;
}

/* @media (max-width: 576px) {
    .box-login {
        margin-top: 20px;
    }
} */
</style>
