<template>
  <div class="evolucao">
    <div class="header">
      <h2>Evolução</h2>
      <div class="header-actions">
        <div class="filtros">
          <button 
            v-for="tipo in tiposEvolucao" 
            :key="tipo.value"
            type="button"
            class="btn-filtro"
            :class="{ 'active': filtroAtivo === tipo.value }"
            @click="aplicarFiltro(tipo.value)"
          >
            {{ tipo.label }}
            <span class="contador" v-if="registros.filter(r => r.tipo_evolucao === tipo.value).length > 0">
              ({{ registros.filter(r => r.tipo_evolucao === tipo.value).length }})
            </span>
          </button>
          <button 
            type="button"
            class="btn-filtro"
            :class="{ 'active': filtroAtivo === 'todos' }"
            @click="aplicarFiltro('todos')"
          >
            Todos
            <span class="contador" v-if="registros.length > 0">
              ({{ registros.length }})
            </span>
          </button>
        </div>
        <button class="btn-novo" @click="abrirNovoRegistro">
          Nova Evolução
        </button>
      </div>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registrosFiltrados" :key="registro.id">
              <td>{{ formatDateTime(registro.data_hora) }}</td>
              <td>{{ getTipoLabel(registro.tipo_evolucao) }}</td>
              <td>{{ registro.descricao || 'Não Consta' }}</td>
              <td>{{ registro.profissional_responsavel || 'Não Consta' }}</td>
            </tr>
            <tr v-if="registrosFiltrados.length === 0">
              <td colspan="4" class="no-records">
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
        <h2>Nova Evolução</h2>
        <form @submit.prevent="salvarRegistro">
          <div v-if="filtroAtivo === 'todos'" class="form-group">
            <label>Tipo de Evolução</label>
            <div class="tipo-evolucao-buttons">
              <button 
                v-for="tipo in tiposEvolucao" 
                :key="tipo.value"
                type="button"
                class="btn-tipo-evolucao"
                :class="{ 'active': form.tipo_evolucao === tipo.value }"
                @click="form.tipo_evolucao = tipo.value"
              >
                {{ tipo.label }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Data/Hora</label>
            <input 
              type="datetime-local" 
              v-model="form.data_evolucao" 
              required
            />
          </div>

          <div class="form-group">
            <label>Responsável</label>
            <input 
              type="text" 
              v-model="form.profissional_responsavel" 
              disabled
            />
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="form.descricao" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label>Observação</label>
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

const props = defineProps({
  pessoaId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const registros = ref([]);
const registrosFiltrados = ref([]);
const showModal = ref(false);
const form = ref({
  descricao: '',
  tipo_evolucao: '',
  data_evolucao: new Date().toISOString().slice(0, 16),
  profissional_responsavel: authStore.user?.nome || '',
  observacao: ''
});

const tiposEvolucao = [
  { value: 'clinica', label: 'Clínica' },
  { value: 'enfermagem', label: 'Enfermagem' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'nutricao', label: 'Nutrição' },
  { value: 'psicologia', label: 'Psicologia' },
  { value: 'social', label: 'Social' }
];

const filtroAtivo = ref('todos');

const getTipoLabel = (tipo) => {
  const tipoEncontrado = tiposEvolucao.find(t => t.value === tipo);
  return tipoEncontrado ? tipoEncontrado.label : 'Não Consta';
};

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR');
};

const carregarRegistros = async () => {
  try {
    const response = await api.get(`/evolucao/listar`, {
      params: {
        pessoa_id: props.pessoaId
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    registros.value = response.data.data || [];
    registrosFiltrados.value = registros.value;
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    registros.value = [];
    registrosFiltrados.value = [];
  }
};

const abrirNovoRegistro = () => {
  form.value = {
    descricao: '',
    tipo_evolucao: filtroAtivo.value === 'todos' ? '' : filtroAtivo.value,
    data_evolucao: new Date().toISOString().slice(0, 16),
    profissional_responsavel: authStore.user?.nome || '',
    observacao: ''
  };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    descricao: '',
    tipo_evolucao: filtroAtivo.value === 'todos' ? '' : filtroAtivo.value,
    data_evolucao: new Date().toISOString().slice(0, 16),
    profissional_responsavel: authStore.user?.nome || '',
    observacao: ''
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      ...form.value,
      pessoa_id: props.pessoaId,
      usuario_id: authStore.user?.id,
      empresa_id: authStore.user?.empresa_id
    };

    await api.post('/evolucao/cadastrar', dados, {
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

const aplicarFiltro = (tipo) => {
  filtroAtivo.value = tipo;
  if (tipo === 'todos') {
    registrosFiltrados.value = registros.value;
  } else {
    registrosFiltrados.value = registros.value.filter(registro => registro.tipo_evolucao === tipo);
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
.evolucao {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--margem);
}

.filtros {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.tipo-evolucao-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.btn-tipo-evolucao {
  padding: 8px 16px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-tipo-evolucao:hover {
  background: var(--cor-hover);
  border-color: var(--cor-primaria);
}

.btn-tipo-evolucao.active {
  background: var(--cor-primaria);
  color: white;
  border-color: var(--cor-primaria);
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

.btn-filtro {
  padding: 8px 16px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: var(--cor-fonte);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-filtro:hover {
  background: var(--cor-hover);
  border-color: var(--cor-primaria);
}

.btn-filtro.active {
  background: var(--cor-primaria);
  color: white;
  border-color: var(--cor-primaria);
}

.btn-novo {
  margin-left: auto;
}

.form-group input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.form-group input[disabled] {
  background-color: var(--cor-fundo);
  cursor: not-allowed;
}

.contador {
  font-size: 12px;
  color: var(--cor-fonte-fraca);
  background: var(--cor-fundo);
  padding: 2px 6px;
  border-radius: 12px;
}

.btn-filtro.active .contador {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
</style> 