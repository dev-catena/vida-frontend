<template>
  <div class="prescricoes">
    <div class="header">
      <h2>Prescrições</h2>
      <button class="btn-novo" @click="abrirNovoRegistro">
        Nova Prescrição
      </button>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Medicamento</th>
              <th>Dosagem</th>
              <th>Frequência</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ formatDateTime(registro.data_hora) }}</td>
              <td>{{ registro.medicamento || 'Não Consta' }}</td>
              <td>{{ registro.dosagem || 'Não Consta' }}</td>
              <td>{{ registro.frequencia || 'Não Consta' }}</td>
              <td>{{ registro.responsavel || 'Não Consta' }}</td>
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
        <h2>Nova Prescrição</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Medicamento</label>
            <input type="text" v-model="form.medicamento" required />
          </div>

          <div class="form-group">
            <label>Dosagem</label>
            <input type="text" v-model="form.dosagem" required />
          </div>

          <div class="form-group">
            <label>Frequência</label>
            <select v-model="form.frequencia" required>
              <option value="">Selecione...</option>
              <option value="1x ao dia">1x ao dia</option>
              <option value="2x ao dia">2x ao dia</option>
              <option value="3x ao dia">3x ao dia</option>
              <option value="4x ao dia">4x ao dia</option>
              <option value="6x ao dia">6x ao dia</option>
              <option value="8x ao dia">8x ao dia</option>
              <option value="12x ao dia">12x ao dia</option>
              <option value="A cada 2 horas">A cada 2 horas</option>
              <option value="A cada 4 horas">A cada 4 horas</option>
              <option value="A cada 6 horas">A cada 6 horas</option>
              <option value="A cada 8 horas">A cada 8 horas</option>
              <option value="A cada 12 horas">A cada 12 horas</option>
            </select>
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
  medicamento: '',
  dosagem: '',
  frequencia: '',
  responsavel: authStore.user?.nome || ''
});

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR');
};

const carregarRegistros = async () => {
  try {
    const response = await api.get(`/prescricao/listar`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    registros.value = response.data || [];
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    registros.value = [];
  }
};

const abrirNovoRegistro = () => {
  form.value = {
    medicamento: '',
    dosagem: '',
    frequencia: '',
    responsavel: authStore.user?.nome || ''
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    medicamento: '',
    dosagem: '',
    frequencia: '',
    responsavel: authStore.user?.nome || ''
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      ...form.value,
      pessoa_id: props.pessoaId,
      usuario_id: authStore.user?.id,
      empresa_id: authStore.user?.empresa_id,
      data_hora: new Date().toISOString()
    };

    await api.post('/prescricoes/cadastrar', dados, {
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
.prescricoes {
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

.btn-editar {
  background: var(--cor-secundaria);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-editar:hover {
  background: var(--cor-secundaria-escura);
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
.form-group select {
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

.no-records {
  text-align: center;
  padding: 20px;
  color: var(--cor-fonte-fraca);
}
</style> 