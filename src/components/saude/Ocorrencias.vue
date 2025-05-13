<template>
  <div class="ocorrencias">
    <div class="header">
      <h2>Ocorrências</h2>
      <button class="btn-novo" @click="abrirNovoRegistro">
        Nova Ocorrência
      </button>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ formatDate(registro.data) }}</td>
              <td>{{ registro.tipo || 'Não Consta' }}</td>
              <td>{{ registro.observacoes || 'Não Consta' }}</td>
            </tr>
            <tr v-if="!registros || registros.length === 0">
              <td colspan="3" class="no-records">
                Nenhum registro encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Nova Ocorrência</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="form.tipo" required>
              <option value="">Selecione...</option>
              <option value="Queda">Queda</option>
              <option value="Desnutrição">Desnutrição</option>
              <option value="Escabiose">Escabiose</option>
              <option value="Desidratação">Desidratação</option>
              <option value="Lesão por pressão">Lesão por pressão</option>
              <option value="Diarreia">Doença diarreica aguda</option>
            </select>
          </div>

          <div class="form-group">
            <label>Data</label>
            <input type="date" v-model="form.data" required />
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea v-model="form.observacoes" rows="4" required></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  pessoaId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const registros = ref([]);
const showModal = ref(false);
const form = ref({
  tipo: '',
  data: '',
  observacoes: ''
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

const carregarRegistros = async () => {
  try {
    console.log('Carregando registros para pessoa_id:', props.pessoaId);
    const response = await api.get(`/ocorrencia/listar`, {
      params: {
        pessoa_id: props.pessoaId
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    console.log('Resposta da API:', response.data);
    
    // Verifica se os dados estão em response.data ou response.data.data
    registros.value = Array.isArray(response.data) ? response.data : 
                     (response.data.data || []);
    
    console.log('Registros carregados:', registros.value);
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    registros.value = [];
  }
};

const abrirNovoRegistro = () => {
  form.value = {
    tipo: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    tipo: '',
    data: '',
    observacoes: ''
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      pessoa_id: props.pessoaId,
      tipo: form.value.tipo,
      data: form.value.data,
      observacoes: form.value.observacoes
    };

    console.log('Enviando dados para cadastro:', dados);
    const response = await api.post('/ocorrencia/cadastrar', dados, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    console.log('Resposta do cadastro:', response.data);

    await carregarRegistros();
    fecharModal();
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
  }
};

// Observar mudanças no ID da pessoa
watch(() => props.pessoaId, (newId) => {
  if (newId) {
    carregarRegistros();
  }
});

// Carregar registros quando o componente for montado
onMounted(() => {
  if (props.pessoaId) {
    carregarRegistros();
  }
});
</script>

<style scoped>
.ocorrencias {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margem);
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

.no-records {
  text-align: center;
  padding: 20px;
  color: var(--cor-fonte-fraca);
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

.form-group {
  margin-bottom: var(--margem);
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--margem);
  margin-top: var(--margem);
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

.form-group input[type="date"] {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}
</style> 