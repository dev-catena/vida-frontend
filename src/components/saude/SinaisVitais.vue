<template>
  <div class="sinais-vitais">
    <Breadcrumbs :items="[
      { text: 'Início', to: '/' },
      { text: 'Saúde', to: '/saude' },
      { text: 'Sinais Vitais' }
    ]" />
    <div class="header">
      <h2>Sinais Vitais</h2>
      <button class="btn-novo" @click="abrirNovoRegistro">
        Novo Registro
      </button>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Pressão Arterial</th>
              <th>Temperatura</th>
              <th>Frequência Cardíaca</th>
              <th>Frequência Respiratória</th>
              <th>Saturação O2</th>
              <th>Glicemia</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ formatDateTime(registro.created_at) }}</td>
              <td>{{ registro.pressao_arterial_sistolica && registro.pressao_arterial_diastolica ? 
                `${registro.pressao_arterial_sistolica}/${registro.pressao_arterial_diastolica}` : 
                'Não Consta' }}</td>
              <td>{{ registro.temperatura ? `${registro.temperatura}°C` : 'Não Consta' }}</td>
              <td>{{ registro.frequencia_cardiaca ? `${registro.frequencia_cardiaca} bpm` : 'Não Consta' }}</td>
              <td>{{ registro.frequencia_respiratoria ? `${registro.frequencia_respiratoria} rpm` : 'Não Consta' }}</td>
              <td>{{ registro.saturacao_oxigenio ? `${registro.saturacao_oxigenio}%` : 'Não Consta' }}</td>
              <td>{{ registro.glicemia ? `${registro.glicemia} mg/dL` : 'Não Consta' }}</td>
              <td>{{ registro.responsavel || 'Não Consta' }}</td>
              <td>
                <button class="btn-editar" @click="editarRegistro(registro)">Editar</button>
              </td>
            </tr>
            <tr v-if="registros.length === 0">
              <td colspan="9" class="no-records">
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
        <h2>Novo Registro de Sinais Vitais</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Pressão Arterial</label>
            <div class="input-group">
              <input
                type="number"
                v-model="form.pressao_arterial_sistolica"
                placeholder="Sistólica"
                required
              />
              <span>/</span>
              <input
                type="number"
                v-model="form.pressao_arterial_diastolica"
                placeholder="Diastólica"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Temperatura (°C)</label>
            <input
              type="number"
              step="0.1"
              v-model="form.temperatura"
            />
          </div>

          <div class="form-group">
            <label>Frequência Cardíaca (bpm)</label>
            <input
              type="number"
              v-model="form.frequencia_cardiaca"
            />
          </div>

          <div class="form-group">
            <label>Frequência Respiratória (rpm)</label>
            <input
              type="number"
              v-model="form.frequencia_respiratoria"
            />
          </div>

          <div class="form-group">
            <label>Saturação de Oxigênio (%)</label>
            <input
              type="number"
              v-model="form.saturacao_oxigenio"
            />
          </div>

          <div class="form-group">
            <label>Glicemia (mg/dL)</label>
            <input
              type="number"
              v-model="form.glicemia"
            />
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea v-model="form.observacao" rows="3"></textarea>
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
const form = ref({
  pressao_arterial_sistolica: '',
  pressao_arterial_diastolica: '',
  temperatura: '',
  frequencia_cardiaca: '',
  frequencia_respiratoria: '',
  saturacao_oxigenio: '',
  glicemia: '',
  responsavel: authStore.user?.nome || '',
  observacao: ''
});

const formatDateTime = (date) => {
  if (!date) return '';
  const data = new Date(date);
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${data.toLocaleDateString('pt-BR')} ${hora}:${minutos}`;
};

const carregarRegistros = async () => {
  try {
    const response = await api.get(`/sinais-vitais/listar`, {
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

const abrirNovoRegistro = () => {
  form.value = {
    pressao_arterial_sistolica: '',
    pressao_arterial_diastolica: '',
    temperatura: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    saturacao_oxigenio: '',
    glicemia: '',
    responsavel: authStore.user?.nome || '',
    observacao: ''
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    pressao_arterial_sistolica: '',
    pressao_arterial_diastolica: '',
    temperatura: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    saturacao_oxigenio: '',
    glicemia: '',
    observacao: ''
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      ...form.value,
      pessoa_id: props.pessoaId,
      usuario_id: authStore.user?.id,
      empresa_id: authStore.user?.empresa_id,
      responsavel: authStore.user?.nome || '',
      data_hora: new Date().toISOString()
    };

    await api.post('/sinais-vitais/cadastrar', dados, {
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

const editarRegistro = (registro) => {
  form.value = {
    id: registro.id,
    temperatura: registro.temperatura,
    peso: registro.peso,
    altura: registro.altura,
    frequencia_cardiaca: registro.frequencia_cardiaca,
    frequencia_respiratoria: registro.frequencia_respiratoria,
    pressao_arterial: registro.pressao_arterial,
    glicemia: registro.glicemia,
    observacoes: registro.observacoes
  }
  showModal.value = true
}

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
.sinais-vitais {
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

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input,
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
</style> 