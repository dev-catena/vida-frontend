<template>
  <div class="prescricoes-cuidados">
    <Breadcrumbs :items="[
      { text: 'Início', to: '/' },
      { text: 'Saúde', to: '/saude' },
      { text: 'Cuidados' }
    ]" />
    <div class="header">
      <h2>Cuidados</h2>
      <button class="btn-novo" @click="abrirNovoRegistro">
        Novo Cuidado
      </button>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Cuidado</th>
              <th>Responsável</th>
              <th>Última Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ formatTime(registro.horario) }}</td>
              <td>{{ registro.cuidado || 'Não Consta' }}</td>
              <td>{{ registro.responsavel || 'Não Consta' }}</td>
              <td>{{ formatDateTime(registro.ultima_execucao) }}</td>
              <td>
                <button 
                  class="btn-executar" 
                  @click="atualizarUltimaExecucao(registro)"
                  :disabled="isUpdating === registro.id"
                >
                  {{ isUpdating === registro.id ? 'Atualizando...' : 'Executar' }}
                </button>
              </td>
            </tr>
            <tr v-if="registros.length === 0">
              <td colspan="5" class="no-records">
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
        <h2>Novo Cuidado</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Horário</label>
            <select v-model="form.horario" required>
              <option value="">Selecione...</option>
              <option v-for="hora in 24" :key="hora-1" :value="`${String(hora-1).padStart(2, '0')}:00`">
                {{ hora-1 }}h
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Cuidado</label>
            <textarea v-model="form.cuidado" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label>Responsável</label>
            <input type="text" v-model="form.responsavel" required />
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
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';

const props = defineProps({
  pessoaId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const registros = ref([]);
const showModal = ref(false);
const isUpdating = ref(null);
const form = ref({
  horario: '',
  cuidado: '',
  responsavel: authStore.user?.nome || ''
});

const formatTime = (time) => {
  if (!time) return '';
  // Formata o horário para HH:mm
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

const formatDateTime = (date) => {
  if (!date) return 'Não executado';
  const data = new Date(date);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
};

const carregarRegistros = async () => {
  try {
    const response = await api.get(`/cuidados/listar`, {
      params: {
        pessoa_id: props.pessoaId
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    registros.value = response.data.data || [];
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    registros.value = [];
  }
};

const atualizarUltimaExecucao = async (registro) => {
  try {
    isUpdating.value = registro.id;
    
    // Verifica se o usuário está autenticado
    if (!authStore.token || !authStore.user) {
      console.error('Usuário não autenticado');
      return;
    }

    const dados = {
      ultima_execucao: new Date().toISOString(),
    };

    console.log('Dados sendo enviados:', dados);

    const response = await api.patch(`/cuidados/atualizar/${registro.id}`, dados, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta do servidor:', response.data);
    await carregarRegistros();
  } catch (error) {
    console.error('Erro ao atualizar última execução:', error);
    if (error.response) {
      console.error('Detalhes do erro:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
  } finally {
    isUpdating.value = null;
  }
};

const abrirNovoRegistro = () => {
  form.value = {
    horario: '',
    cuidado: '',
    responsavel: authStore.user?.nome || ''
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    horario: '',
    cuidado: '',
    responsavel: authStore.user?.nome || ''
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      ...form.value,
      pessoa_id: props.pessoaId
    };

    await api.post('/cuidados/cadastrar', dados, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

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
.prescricoes-cuidados {
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

.btn-executar {
  background: var(--cor-sucesso);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-executar:hover {
  background: var(--cor-sucesso-escura);
}

.btn-executar:disabled {
  background: var(--cor-fonte-fraca);
  cursor: not-allowed;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
  background-color: white;
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

.no-records {
  text-align: center;
  padding: 20px;
  color: var(--cor-fonte-fraca);
}
</style> 