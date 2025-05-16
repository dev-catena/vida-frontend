<template>
  <main class="usuarios">
    <div class="header">
      <h1>Gerenciamento de Usuários</h1>
      <div class="header-actions">
        <button class="btn-novo" @click="abrirNovoUsuario">
          Novo Usuário
        </button>
      </div>
    </div>

    <div class="content">
      <div v-if="carregando" class="loading">
        <div class="spinner"></div>
        <p>Carregando usuários...</p>
      </div>
      
      <div v-else class="tabela">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usuarios" :key="user.id">
              <td>{{ user.nome }}</td>
              <td>{{ user.CPF }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatPerfil(user.perfil) }}</td>
              <td>
                <div class="acoes">
                  <button class="btn-editar" @click="editarUsuario(user)" title="Editar usuário">
                    <span class="icone-editar"></span>
                  </button>
                  <button class="btn-excluir" @click="excluirUsuario(user.id)" title="Excluir usuário">
                    <span class="icone-excluir"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="usuarios.length === 0">
              <td colspan="5" class="no-records">
                <div class="empty-state">
                  <span class="icone-info"></span>
                  <p>Nenhum usuário encontrado</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Usuário -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ usuario.id ? 'Editar' : 'Novo' }} Usuário</h2>
        <form @submit.prevent="salvarUsuario">
          <div class="form-columns">
            <div class="form-column">
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
                <label for="CPF">CPF</label>
                <input
                  id="CPF"
                  v-model="usuario.CPF"
                  type="text"
                  required
                  maxlength="14"
                  @input="formatarCPF"
                  placeholder="000.000.000-00"
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
                  v-model="usuario.password"
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
                  <option value="">Selecione um perfil</option>
                  <option value="admin">Administrador</option>
                  <option value="recepcionista">Recepcionista</option>
                  <option value="gerente">Gerente</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar" @click="fecharModal">
              Cancelar
            </button>
            <button type="submit" class="btn-salvar">
              {{ usuario.id ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

export default {
  name: 'UsuariosView',
  data() {
    return {
      usuarios: [],
      usuario: {
        id: null,
        nome: '',
        CPF: '',
        email: '',
        senha: '',
        perfil: ''
      },
      showModal: false,
      carregando: false
    };
  },
  mounted() {
    this.carregarUsuarios();
  },
  methods: {
    formatCPF(CPF) {
      if (!CPF) return '';
      return CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    formatarCPF(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        this.usuario.CPF = value;
      }
    },
    formatPerfil(perfil) {
      const perfis = {
        admin: 'Administrador',
        recepcionista: 'Recepcionista',
        gerente: 'Gerente'
      };
      return perfis[perfil] || perfil;
    },
    async carregarUsuarios() {
      try {
        if (!this.authStore.user) {
          console.error('Usuário não autenticado');
          this.usuarios = [];
          return;
        }

        this.carregando = true;
        const response = await api.get('/usuario/listar', {
          headers: {
            Authorization: `Bearer ${this.authStore.token}`
          }
        });
        this.usuarios = Array.isArray(response.data) ? response.data : 
                       (response.data.data || []);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        if (error.response?.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
        }
        this.usuarios = [];
      } finally {
        this.carregando = false;
      }
    },
    abrirNovoUsuario() {
      this.usuario = {
        nome: '',
        CPF: '',
        email: '',
        password: '',
        perfil: ''
      };
      this.showModal = true;
    },
    async salvarUsuario() {
      try {
        if (!this.authStore.user) {
          console.error('Usuário não autenticado');
          alert('Sessão expirada. Por favor, faça login novamente.');
          return;
        }

        // Formatar os dados antes de enviar
        const dados = {
          nome: this.usuario.nome,
          email: this.usuario.email,
          CPF: this.usuario.CPF.replace(/\D/g, ''), // Remove caracteres não numéricos
          password: this.usuario.password,
          perfil: this.usuario.perfil,
          empresa_id: this.authStore.user.empresa_id
        };

        console.log('Dados a serem enviados:', dados);

        if (this.usuario.id) {
          // Atualizar usuário existente
          await api.patch(`/usuario/atualizar/${this.usuario.id}`, dados, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`
            }
          });
        } else {
          // Criar novo usuário
          await api.post('/usuario/cadastrar', dados, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`
            }
          });
        }

        await this.carregarUsuarios();
        this.fecharModal();
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        if (error.response?.status === 422) {
          const mensagens = Object.values(error.response.data.errors).flat();
          mensagens.forEach(msg => alert(msg));
        } else if (error.response?.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
        } else if (error.response?.status === 500) {
          console.error('Detalhes do erro:', error.response.data);
          alert('Erro interno do servidor. Por favor, verifique os dados e tente novamente.');
        } else {
          alert('Erro ao salvar usuário. Tente novamente.');
        }
      }
    },
    editarUsuario(usuario) {
      this.usuario = { ...usuario };
      this.showModal = true;
    },
    async excluirUsuario(id) {
      if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
      
      try {
        if (!this.authStore.user) {
          console.error('Usuário não autenticado');
          alert('Sessão expirada. Por favor, faça login novamente.');
          return;
        }

        await api.delete(`/usuario/excluir/${id}`, {
          headers: {
            Authorization: `Bearer ${this.authStore.token}`
          }
        });
        await this.carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        if (error.response?.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
        } else {
          alert('Erro ao excluir usuário. Tente novamente.');
        }
      }
    },
    fecharModal() {
      this.showModal = false;
      this.usuario = {
        nome: '',
        CPF: '',
        email: '',
        password: '',
        perfil: ''
      };
    }
  },
  computed: {
    authStore() {
      return useAuthStore();
    }
  }
};
</script>

<style scoped>
.usuarios {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--margem);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margem);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--margem);
}

.btn-novo {
  background: var(--cor-primaria);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-novo:hover {
  background: var(--cor-primaria-escura);
}

.content {
  flex: 1;
  overflow: auto;
}

.tabela {
  background: white;
  border-radius: var(--raio);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--cor-separador);
}

th {
  background: var(--cor-fundo);
  font-weight: 600;
}

.acoes {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}

.btn-editar,
.btn-excluir {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--raio);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-editar:hover {
  background: var(--cor-hover);
  color: var(--cor-primaria);
}

.btn-excluir:hover {
  background: var(--cor-erro-clara);
  color: var(--cor-erro);
}

.icone-editar,
.icone-excluir {
  font-size: 18px;
  width: 18px;
  height: 18px;
  display: inline-block;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: var(--margem);
  border-radius: var(--raio);
  width: 100%;
  max-width: 500px;
}

.form-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--margem);
}

.form-group {
  margin-bottom: var(--margem);
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.form-group input:focus {
  border-color: var(--cor-primaria);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--cor-primaria-rgb), 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--margem);
  margin-top: var(--margem);
  padding-top: var(--margem);
  border-top: 1px solid var(--cor-separador);
}

.btn-cancelar {
  background: var(--cor-fonte-fraca);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
}

.btn-salvar {
  background: var(--cor-sucesso);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
}

.no-records {
  text-align: center;
  color: var(--cor-fonte-fraca);
  padding: var(--margem);
}

tr:hover {
  background-color: var(--cor-hover);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--margem);
  color: var(--cor-fonte-fraca);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--cor-separador);
  border-top: 4px solid var(--cor-primaria);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--margem);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--margem);
  color: var(--cor-fonte-fraca);
}

.empty-state .icone-info {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-state p {
  margin: 0;
  text-align: center;
}
</style> 