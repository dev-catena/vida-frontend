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
            <tr v-for="registro in registros" :key="registro.id" @click="editarRegistro(registro)">
              <td>{{ formatTime(registro.horario) }}</td>
              <td>{{ registro.cuidado || 'Não Consta' }}</td>
              <td>{{ registro.responsavel || 'Não Consta' }}</td>
              <td>{{ formatDateTime(registro.ultima_execucao) }}</td>
              <td>
                <button 
                  class="btn-executar" 
                  @click.stop="atualizarUltimaExecucao(registro)"
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

    <!-- Modal de Registro/Edição -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ registroEditando ? 'Editar' : 'Novo' }} Cuidado</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Horário</label>
            <input
              type="time"
              v-model="form.horario"
              required
              step="1"
            />
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
            <button type="submit" class="btn-salvar">{{ registroEditando ? 'Atualizar' : 'Salvar' }}</button>
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
const registroEditando = ref(null);
const form = ref({
  pessoa_id: '',
  empresa_id: '',
  horario: '',
  cuidado: '',
  responsavel: ''
});

const formatTime = (time) => {
  if (!time) return '';
  // Transforma o horário do formato HH:MM:SS para texto (ex: "07:30:00" -> "7h30")
  const [hora, minutos] = time.split(':');
  const horaFormatada = hora.split('T')[1];
  return `${parseInt(horaFormatada)}h${minutos}`;
};

const formatDateTime = (date) => {
  if (!date) return 'Não executado';
  const data = new Date(date);
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${hora}:${minutos}`;
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
    if (!authStore.user) {
      alert('Usuário não autenticado');
      return;
    }

    isUpdating.value = registro.id;
    
    // Formata a data para o formato esperado pelo backend (YYYY-MM-DD HH:mm:ss)
    const dataAtual = new Date();
    const ultimaExecucao = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
    
    // Formata o horário para o formato H:i
    const [hora, minutos] = registro.horario.split(':');
    const horaFormatada = hora.split('T')[1];
    const horarioFormatado = `0${parseInt(horaFormatada)}:${minutos}`;
    console.log(horarioFormatado);
    
    const dados = {
      pessoa_id: props.pessoaId,
      empresa_id: authStore.user.empresa_id,
      horario: horarioFormatado,
      cuidado: registro.cuidado,
      responsavel: registro.responsavel,
      ultima_execucao: ultimaExecucao
    };

    console.log('Dados sendo enviados:', dados); // Log para debug

    await api.patch(`/cuidados/atualizar/${registro.id}`, dados, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    await carregarRegistros();
  } catch (error) {
    console.error('Erro ao atualizar última execução:', error);
    if (error.response?.status === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.');
    } else if (error.response?.status === 403) {
      alert('Você não tem permissão para realizar esta operação.');
    } else if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors || {}).flat();
      alert(mensagens.length > 0 ? mensagens.join('\n') : 'Dados inválidos. Por favor, verifique os campos.');
    } else {
      alert('Erro ao atualizar execução. Por favor, tente novamente.');
    }
  } finally {
    isUpdating.value = null;
  }
};

const abrirNovoRegistro = () => {
  if (!authStore.user) {
    alert('Usuário não autenticado');
    return;
  }

  form.value = {
    pessoa_id: props.pessoaId,
    empresa_id: authStore.user.empresa_id || '',
    horario: '',
    cuidado: '',
    responsavel: authStore.user?.nome || ''
  };
  showModal.value = true;
};

const editarRegistro = (registro) => {
  if (!authStore.user) {
    alert('Usuário não autenticado');
    return;
  }

  registroEditando.value = registro;
  form.value = {
    pessoa_id: props.pessoaId,
    empresa_id: authStore.user.empresa_id || '',
    horario: registro.horario,
    cuidado: registro.cuidado,
    responsavel: registro.responsavel
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  registroEditando.value = null;
  form.value = {
    pessoa_id: '',
    empresa_id: '',
    horario: '',
    cuidado: '',
    responsavel: ''
  };
};

const salvarRegistro = async () => {
  try {
    if (!authStore.user) {
      alert('Usuário não autenticado');
      return;
    }

    if (!authStore.user.empresa_id) {
      alert('Empresa não identificada');
      return;
    }

    // Garante que o horário esteja no formato HH:MM:SS
    const horario = form.value.horario + ':00';
    
    const dados = {
      pessoa_id: props.pessoaId,
      empresa_id: authStore.user.empresa_id,
      horario: horario,
      cuidado: form.value.cuidado,
      responsavel: form.value.responsavel
    };

    if (registroEditando.value) {
      await api.patch(`/cuidados/atualizar/${registroEditando.value.id}`, dados, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
    } else {
      await api.post('/cuidados/cadastrar', dados, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
    }

    await carregarRegistros();
    fecharModal();
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
    if (error.response?.status === 401) {
      alert('Sessão expirada. Por favor, faça login novamente.');
    } else {
      alert('Erro ao salvar registro. Por favor, tente novamente.');
    }
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

tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

tr:hover {
  background-color: var(--cor-hover);
}

.horario-inputs {
  display: flex;
  gap: 10px;
}

.horario-inputs input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
  background-color: white;
  text-align: center;
}

.horario-inputs input:focus {
  border-color: var(--cor-primaria);
  outline: none;
}

.horario-inputs input::-webkit-inner-spin-button,
.horario-inputs input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.horario-inputs input[type=number] {
  -moz-appearance: textfield;
}
</style> 