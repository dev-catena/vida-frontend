<template>
  <main class="usuarios">
    <h1>Gerenciamento de Usuários</h1>
    <div class="content">
      <div class="form-container">
        <form @submit.prevent="salvarUsuario">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input
              id="nome"
              v-model="usuario.nome"
              type="text"
              required
            >
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="usuario.email"
              type="email"
              required
            >
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input
              id="senha"
              v-model="usuario.senha"
              type="password"
              :required="!usuario.id"
            >
          </div>

          <div class="form-group">
            <label for="perfil">Perfil</label>
            <select
              id="perfil"
              v-model="usuario.perfil"
              required
            >
              <option value="">
                Selecione um perfil
              </option>
              <option value="admin">
                Administrador
              </option>
              <option value="recepcionista">
                Recepcionista
              </option>
              <option value="gerente">
                Gerente
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
            >
              {{ usuario.id ? 'Atualizar' : 'Salvar' }}
            </button>
            <button
              type="button"
              class="btn-secondary"
              @click="limparFormulario"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in usuarios"
              :key="user.id"
            >
              <td>{{ user.nome }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.perfil }}</td>
              <td>
                <button
                  class="btn-edit"
                  @click="editarUsuario(user)"
                >
                  Editar
                </button>
                <button
                  class="btn-delete"
                  @click="excluirUsuario(user.id)"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'UsuariosView',
  data() {
    return {
      usuarios: [],
      usuario: {
        id: null,
        nome: '',
        email: '',
        senha: '',
        perfil: ''
      }
    };
  },
  mounted() {
    this.carregarUsuarios();
  },
  methods: {
    async carregarUsuarios() {
      // TODO: Implementar chamada à API para carregar usuários
      this.usuarios = [
        { id: 1, nome: 'Admin', email: 'admin@hotel.com', perfil: 'admin' },
        { id: 2, nome: 'Recepcionista', email: 'recep@hotel.com', perfil: 'recepcionista' }
      ];
    },
    async salvarUsuario() {
      // TODO: Implementar chamada à API para salvar usuário
      console.log('Usuário a ser salvo:', this.usuario);
    },
    editarUsuario(usuario) {
      this.usuario = { ...usuario };
    },
    async excluirUsuario(id) {
      // TODO: Implementar chamada à API para excluir usuário
      console.log('Usuário a ser excluído:', id);
    },
    limparFormulario() {
      this.usuario = {
        id: null,
        nome: '',
        email: '',
        senha: '',
        perfil: ''
      };
    }
  }
};
</script>

<style scoped>
.usuarios {
  padding: 20px;
}

.content {
  margin-top: 20px;
  display: flex;
  gap: 30px;
}

.form-container {
  flex: 1;
  max-width: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  flex: 2;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-edit {
  background-color: #ffa000;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
}

.btn-delete {
  background-color: #d32f2f;
  color: white;
  padding: 5px 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 500;
}

tr:hover {
  background-color: #f9f9f9;
}
</style> 