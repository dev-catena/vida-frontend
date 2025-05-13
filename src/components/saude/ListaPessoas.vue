<template>
  <div class="lista-pessoas">
    <div class="header">
      <h2>Lista de Pessoas</h2>
      <button class="btn-pre-admissao" @click="showPreAdmissaoForm = true">
        Pré-Admissão
      </button>
    </div>

    <div v-if="showPreAdmissaoForm" class="modal-overlay">
      <div class="modal-content">
        <PreAdmissaoForm
          @cancel="showPreAdmissaoForm = false"
          @saved="handlePreAdmissaoSaved"
        />
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Gênero</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pessoa in pessoas" :key="pessoa.id">
            <td>{{ pessoa.nome }}</td>
            <td>{{ formatCPF(pessoa.CPF) }}</td>
            <td>{{ formatDate(pessoa.data_nascimento) }}</td>
            <td>{{ pessoa.sexo }}</td>
            <td>
              <span :class="['status-badge', pessoa.status ? 'active' : 'inactive']">
                {{ pessoa.status ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td>
              <button class="btn-action" @click="editarPessoa(pessoa)">
                Editar
              </button>
              <button class="btn-action" @click="toggleStatus(pessoa)">
                {{ pessoa.status ? 'Desativar' : 'Ativar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import PreAdmissaoForm from './PreAdmissaoForm.vue';

const authStore = useAuthStore();
const pessoas = ref([]);
const showPreAdmissaoForm = ref(false);

const carregarPessoas = async () => {
  try {
    const response = await api.get('/pessoas', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    pessoas.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
  }
};

const formatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

const editarPessoa = (pessoa) => {
  // Implementar edição
  console.log('Editar pessoa:', pessoa);
};

const toggleStatus = async (pessoa) => {
  try {
    await api.patch(`/pessoas/${pessoa.id}`, {
      status: !pessoa.status
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    await carregarPessoas();
  } catch (error) {
    console.error('Erro ao alterar status:', error);
  }
};

const handlePreAdmissaoSaved = async () => {
  showPreAdmissaoForm.value = false;
  await carregarPessoas();
};

onMounted(() => {
  carregarPessoas();
});
</script>

<style scoped>
.lista-pessoas {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-pre-admissao {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-pre-admissao:hover {
  background: #0056b3;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.btn-action {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background: #e9ecef;
  color: #495057;
}

.btn-action:hover {
  background: #dee2e6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
}
</style> 